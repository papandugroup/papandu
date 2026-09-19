// Drop 001: "For The Stars" Launch Schedule & Automatic Activation
// Configurable via NEXT_PUBLIC_DROP_LAUNCH_DATE (defaults to September 23, 2026 at 00:00:00 Lagos / West Africa Time, UTC+1)
export const DROP_LAUNCH_DATE_ISO =
  process.env.NEXT_PUBLIC_DROP_LAUNCH_DATE || '2026-09-23T00:00:00+01:00';

/**
 * Returns true if the current time is on or past the drop launch moment.
 * Also supports a testing override via URL parameter (?previewDrop=live / ?previewDrop=soon).
 */
export function isDropLive(): boolean {
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const preview = params.get('previewDrop');
      if (preview === 'live') return true;
      if (preview === 'soon') return false;
    } catch {
      // Ignore in non-browser environments
    }
  }

  const launchTime = new Date(DROP_LAUNCH_DATE_ISO).getTime();
  return Date.now() >= launchTime;
}

/**
 * Automatically transitions product status from 'COMING SOON' to 'NEW'
 * once the launch moment is reached.
 */
export function resolveProductStatus<T extends { status?: string }>(product: T): T {
  if (product.status === 'COMING SOON' && isDropLive()) {
    return {
      ...product,
      status: 'NEW' as const,
    };
  }
  return product;
}
