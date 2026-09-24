export async function requestScreenWakeLock(): Promise<WakeLockSentinel | null> {
  if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
    try {
      const sentinel = await navigator.wakeLock.request('screen');
      return sentinel;
    } catch (err) {
      console.warn('Screen Wake Lock request failed:', err);
      return null;
    }
  }
  return null;
}
