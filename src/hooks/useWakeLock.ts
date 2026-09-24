'use client';

import { useState, useCallback, useRef } from 'react';
import { requestScreenWakeLock } from '@/lib/wakeLock';

export function useWakeLock() {
  const [isActive, setIsActive] = useState(false);
  const [isSupported] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'wakeLock' in navigator;
  });
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  const toggleWakeLock = useCallback(async () => {
    if (!isSupported) return;

    if (isActive && sentinelRef.current) {
      try {
        await sentinelRef.current.release();
        sentinelRef.current = null;
        setIsActive(false);
      } catch (err) {
        console.warn('Wake Lock release error:', err);
      }
    } else {
      const sentinel = await requestScreenWakeLock();
      if (sentinel) {
        sentinelRef.current = sentinel;
        setIsActive(true);

        sentinel.addEventListener('release', () => {
          setIsActive(false);
          sentinelRef.current = null;
        });
      }
    }
  }, [isActive, isSupported]);

  return {
    isActive,
    isSupported,
    toggleWakeLock,
  };
}
