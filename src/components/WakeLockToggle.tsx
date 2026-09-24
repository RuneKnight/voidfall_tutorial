'use client';

import React from 'react';
import { useWakeLock } from '@/hooks/useWakeLock';

export function WakeLockToggle() {
  const { isActive, isSupported, toggleWakeLock } = useWakeLock();

  if (!isSupported) return null;

  return (
    <button
      type="button"
      className={`wakelock-btn ${isActive ? 'active' : ''}`}
      onClick={toggleWakeLock}
      title={isActive ? '화면 켜짐 유지 중' : '테이블탑 화면 켜짐 유지'}
    >
      💡 {isActive ? '화면 켜짐 유지' : '화면 꺼짐 방지'}
      <style jsx>{`
        .wakelock-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: var(--text-xs);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-full);
          background: var(--bg-surface);
          color: var(--text-secondary);
          border: 1px solid var(--border-default);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .wakelock-btn.active {
          background: var(--accent-bg);
          color: var(--color-accent);
          border-color: var(--accent-border);
          box-shadow: 0 0 12px var(--accent-glow);
        }
      `}</style>
    </button>
  );
}
