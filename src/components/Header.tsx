'use client';

import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  currentStepIndex: number;
  totalSteps: number;
  currentLayerTitle: string;
  timeLeft?: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenOverview: () => void;
  onOpenGlossary: () => void;
  onOpenQuickSearch?: () => void;
  onOpenCombatSim?: () => void;
  wakeLockActive?: boolean;
  onToggleWakeLock?: () => void;
}

export function Header({
  currentStepIndex,
  totalSteps,
  currentLayerTitle,
  timeLeft,
  theme,
  onToggleTheme,
  onOpenOverview,
  onOpenGlossary,
  onOpenQuickSearch,
  onOpenCombatSim,
  wakeLockActive,
  onToggleWakeLock,
}: HeaderProps) {
  return (
    <header className="player-header">
      <div className="header-left">
        <Link href="/" className="header-btn" title="메인 화면으로" aria-label="메인 화면으로">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <button
          type="button"
          onClick={onOpenOverview}
          className="header-btn"
          title="목차 / 챕터 선택"
          aria-label="튜토리얼 목차 열기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onOpenGlossary}
          className="header-btn"
          title="용어 사전"
          aria-label="용어 사전 열기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </button>

        {onOpenQuickSearch && (
          <button
            type="button"
            onClick={onOpenQuickSearch}
            className="header-btn search-btn"
            title="퀵 레퍼런스 검색 (Ctrl/Cmd + K)"
            aria-label="퀵 레퍼런스 검색 열기"
          >
            🔍
          </button>
        )}

        {onOpenCombatSim && (
          <button
            type="button"
            onClick={onOpenCombatSim}
            className="header-btn combat-btn"
            title="전투 시뮬레이터"
            aria-label="전투 시뮬레이터 열기"
          >
            ⚔️
          </button>
        )}
      </div>

      <div className="header-center">
        <h1 className="header-title" title={currentLayerTitle}>
          {currentLayerTitle}
        </h1>
      </div>

      <div className="header-right">
        {onToggleWakeLock && (
          <button
            type="button"
            onClick={onToggleWakeLock}
            className={`header-btn wakelock-btn ${wakeLockActive ? 'active' : ''}`}
            title={wakeLockActive ? '화면 켜짐 유지 중' : '테이블탑 화면 켜짐 유지 토글'}
            aria-label="화면 켜짐 유지 토글"
          >
            💡
          </button>
        )}

        <span className="step-counter" title="현재 단계">
          {currentStepIndex + 1} / {totalSteps}
        </span>

        {timeLeft && (
          <span className="time-badge" title="예상 남은 소요 시간">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{timeLeft}</span>
          </span>
        )}

        <button
          type="button"
          onClick={onToggleTheme}
          className="header-btn theme-toggle-btn"
          title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          aria-label="테마 전환"
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>

      <style jsx>{`
        .player-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-default);
          min-height: 56px;
          gap: 0.75rem;
          user-select: none;
          z-index: 20;
        }

        .header-left, .header-right {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-shrink: 0;
        }

        .header-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          background: var(--surface-hover);
          border: 1px solid var(--border-subtle);
          transition: all var(--transition-fast);
          flex-shrink: 0;
          cursor: pointer;
        }

        .header-btn:hover {
          color: var(--color-accent);
          background: var(--accent-bg);
          border-color: var(--accent-border);
          transform: translateY(-1px);
        }

        .wakelock-btn.active {
          background: var(--accent-bg);
          border-color: var(--accent-border);
          box-shadow: 0 0 10px var(--accent-glow);
        }

        .header-center {
          flex: 1;
          min-width: 0;
          text-align: center;
          padding: 0 0.5rem;
        }

        .header-title {
          font-size: clamp(0.85rem, 2.5vw, 1rem);
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: keep-all;
        }

        .step-counter {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-secondary);
          font-variant-numeric: tabular-nums;
          background: var(--bg-surface);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
        }

        .time-badge {
          display: none;
          align-items: center;
          gap: 0.35rem;
          font-size: var(--text-xs);
          color: var(--text-muted);
          background: var(--bg-surface);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
        }

        @media (min-width: 640px) {
          .time-badge {
            display: inline-flex;
          }
        }
      `}</style>
    </header>
  );
}
