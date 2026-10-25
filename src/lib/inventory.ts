import fs from 'fs';
import path from 'path';

export interface InventoryRecord {
  isSoldOut: boolean;
  soldAt?: string;
  orderReference?: string;
  reservedUntil?: number; // Epoch timestamp for temporary checkout reservation
  reservedBy?: string;
}

export type InventoryStore = Record<string, InventoryRecord>;

const INVENTORY_FILE = path.join(process.cwd(), 'data', 'inventory-status.json');

// In-memory cache to guarantee sub-millisecond reads during high traffic drops
let memoryCache: InventoryStore | null = null;

function ensureDataDirectory(): void {
  const dataDir = path.dirname(INVENTORY_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadInventoryFromDisk(): InventoryStore {
  try {
    ensureDataDirectory();
    if (fs.existsSync(INVENTORY_FILE)) {
      const content = fs.readFileSync(INVENTORY_FILE, 'utf-8');
      return JSON.parse(content || '{}');
    }
  } catch (error) {
    console.warn('[Inventory] Failed to read inventory-status.json from disk:', error);
  }
  return {};
}

function persistInventoryToDisk(store: InventoryStore): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (error) {
    console.error('[Inventory] Failed to persist inventory-status.json to disk:', error);
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
