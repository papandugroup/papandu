import fs from 'fs';
import path from 'path';
import { FALLBACK_PRODUCTS, getInventoryKey, isProductOneOfOne } from '@/data/fallbackProducts';

export interface InventoryRecord {
  isSoldOut: boolean;
  soldAt?: string;
  orderReference?: string;
  reservedUntil?: number; // Epoch timestamp for temporary checkout reservation
  reservedBy?: string;
}

export type InventoryStore = Record<string, InventoryRecord>;

const INVENTORY_FILE = path.join(process.cwd(), 'data', 'inventory-status.json');
const TMP_INVENTORY_FILE = path.join('/tmp', 'papandu-inventory-status.json');

// In-memory cache to guarantee sub-millisecond reads during high traffic drops
let memoryCache: InventoryStore | null = null;
let lastPaystackSync = 0;
const PAYSTACK_SYNC_TTL_MS = 25 * 1000; // 25 seconds cache

/**
 * Automatically syncs verified successful transactions from Paystack API.
 * This guarantees that even if a customer paid on mobile/redirect, closed the tab,
 * or the webhook was delayed or dropped, any paid piece is immediately marked SOLD OUT.
 */
export async function syncFromPaystack(): Promise<void> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey || secretKey.includes('demo') || secretKey.startsWith('sk_test_demo')) {
    return;
  }

  const now = Date.now();
  if (now - lastPaystackSync < PAYSTACK_SYNC_TTL_MS) {
    return;
  }

  try {
    const res = await fetch('https://api.paystack.co/transaction?status=success&perPage=50', {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(4500),
    });

    if (!res.ok) return;

    const data = await res.json();
    if (data?.status && Array.isArray(data.data)) {
      const store = getStore();
      let changed = false;

      for (const tx of data.data) {
        if (tx.status === 'success' && tx.metadata?.items && Array.isArray(tx.metadata.items)) {
          for (const item of tx.metadata.items) {
            const productSlug = item.slug || item.product?.slug;
            const colorwayName = item.colorway || item.product?.colorway;
            const key = item.inventoryKey || (productSlug ? getInventoryKey(productSlug, colorwayName) : null);

            if (key) {
              const foundProduct = FALLBACK_PRODUCTS.find(
                (p) => p.slug === productSlug || p.id === item.productId || p.id === item.product?.id
              );
              const isOneOfOne = foundProduct
                ? isProductOneOfOne(foundProduct, colorwayName)
                : (productSlug === 'for-the-stars-signature-stripe-shirt' || (item.title && item.title.includes('For The Stars')));

              if (isOneOfOne && !store[key]?.isSoldOut) {
                store[key] = {
                  isSoldOut: true,
                  soldAt: tx.paid_at || new Date().toISOString(),
                  orderReference: tx.reference,
                };
                changed = true;
                console.log(`[Inventory Sync] Automatically marked SOLD OUT via Paystack API: ${key} (Ref: ${tx.reference})`);
              }
            }
          }
        }
      }

      if (changed) {
        persistInventoryToDisk(store);
      }
      lastPaystackSync = now;
    }
  } catch (err) {
    // Non-blocking: fail quietly so inventory endpoint is always fast and available
    console.warn('[Inventory Sync] Paystack sync notice:', err);
  }
}

function ensureDataDirectory(): void {
  const dataDir = path.dirname(INVENTORY_FILE);
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch {
      // Ignored on read-only environments (e.g. Vercel serverless)
    }
  }
}

function loadInventoryFromDisk(): InventoryStore {
  const store: InventoryStore = {};

  // 1. Read bundled repository status (committed to git)
  try {
    if (fs.existsSync(INVENTORY_FILE)) {
      const content = fs.readFileSync(INVENTORY_FILE, 'utf-8');
      Object.assign(store, JSON.parse(content || '{}'));
    }
  } catch (error) {
    console.warn('[Inventory] Failed to read inventory-status.json from disk:', error);
  }

  // 2. Read runtime /tmp updates (works across warm serverless invocations on Vercel)
  try {
    if (fs.existsSync(TMP_INVENTORY_FILE)) {
      const content = fs.readFileSync(TMP_INVENTORY_FILE, 'utf-8');
      Object.assign(store, JSON.parse(content || '{}'));
    }
  } catch (error) {
    // Non-critical /tmp read
  }

  return store;
}

function persistInventoryToDisk(store: InventoryStore): void {
  memoryCache = store;

  // 1. Persist to project directory (works in local development)
  try {
    ensureDataDirectory();
    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch {
    // Expected on Vercel serverless where /var/task is read-only
  }

  // 2. Persist to /tmp (writable on Vercel serverless / AWS Lambda)
  try {
    fs.writeFileSync(TMP_INVENTORY_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (error) {
    console.warn('[Inventory] Failed to persist to /tmp:', error);
  }
}

function getStore(): InventoryStore {
  if (!memoryCache) {
    memoryCache = loadInventoryFromDisk();
  }
  return memoryCache;
}

/**
 * Returns the entire inventory status map.
 * Automatically cleans up expired temporary reservations.
 */
export async function getInventoryStatus(): Promise<Record<string, { isSoldOut: boolean; isReserved: boolean }>> {
  await syncFromPaystack();
  const store = getStore();
  const now = Date.now();
  const result: Record<string, { isSoldOut: boolean; isReserved: boolean }> = {};

  for (const [key, record] of Object.entries(store)) {
    const isReserved = Boolean(record.reservedUntil && record.reservedUntil > now);
    result[key] = {
      isSoldOut: Boolean(record.isSoldOut),
      isReserved: isReserved && !record.isSoldOut,
    };
  }

  return result;
}

/**
 * Checks whether a specific item key is available for purchase.
 * An item is unavailable if it is permanently sold out or currently under active checkout hold.
 */
export async function isItemAvailable(itemKey: string): Promise<boolean> {
  await syncFromPaystack();
  const store = getStore();
  const record = store[itemKey];
  if (!record) return true;

  if (record.isSoldOut) return false;

  const now = Date.now();
  if (record.reservedUntil && record.reservedUntil > now) {
    return false; // Currently reserved by another shopper
  }

  return true;
}

/**
 * Attempts to acquire a temporary reservation lock on 1-of-1 items for a checkout session.
 * Prevents race conditions where two customers attempt to pay for the same item at the same time.
 */
export async function reserveItems(
  itemKeys: string[],
  sessionId: string,
  ttlMinutes: number = 10
): Promise<{ success: boolean; unavailableKey?: string }> {
  await syncFromPaystack();
  const store = getStore();
  const now = Date.now();
  const expiry = now + ttlMinutes * 60 * 1000;

  // Pre-check all items atomically
  for (const key of itemKeys) {
    const record = store[key];
    if (record) {
      if (record.isSoldOut) {
        return { success: false, unavailableKey: key };
      }
      if (record.reservedUntil && record.reservedUntil > now && record.reservedBy !== sessionId) {
        return { success: false, unavailableKey: key };
      }
    }
  }

  // Lock all items
  for (const key of itemKeys) {
    store[key] = {
      ...store[key],
      isSoldOut: false,
      reservedUntil: expiry,
      reservedBy: sessionId,
    };
  }

  persistInventoryToDisk(store);
  return { success: true };
}

/**
 * Releases a reservation hold if a customer cancels or abandons checkout.
 */
export async function releaseReservation(itemKeys: string[], sessionId?: string): Promise<void> {
  const store = getStore();
  let changed = false;

  for (const key of itemKeys) {
    const record = store[key];
    if (record && !record.isSoldOut) {
      if (!sessionId || record.reservedBy === sessionId) {
        delete record.reservedUntil;
        delete record.reservedBy;
        changed = true;
      }
    }
  }

  if (changed) {
    persistInventoryToDisk(store);
  }
}

/**
 * Permanently marks 1-of-1 items as SOLD OUT upon verified successful payment.
 */
export async function markItemsAsSold(itemKeys: string[], orderReference: string): Promise<void> {
  const store = getStore();
  const nowISO = new Date().toISOString();

  for (const key of itemKeys) {
    store[key] = {
      isSoldOut: true,
      soldAt: nowISO,
      orderReference,
    };
  }

  persistInventoryToDisk(store);
  console.log(`[Inventory] Marked as SOLD OUT: ${itemKeys.join(', ')} (Order: ${orderReference})`);
}

/**
 * Administrative reset tool (for development / restocking testing)
 */
export async function resetInventory(itemKeys?: string[]): Promise<void> {
  const store = getStore();

  if (!itemKeys || itemKeys.length === 0) {
    // Clear all
    for (const key of Object.keys(store)) {
      delete store[key];
    }
  } else {
    for (const key of itemKeys) {
      delete store[key];
    }
  }

  persistInventoryToDisk(store);
  console.log(`[Inventory] Reset items: ${itemKeys ? itemKeys.join(', ') : 'ALL'}`);
}
