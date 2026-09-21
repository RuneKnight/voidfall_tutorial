'use client';

import React, { useEffect } from 'react';

interface StepNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  currentLayerTitle: string;
  onPrev: () => void;
  onNext: () => void;
}

export function StepNavigation({
  currentStepIndex,
  totalSteps,
  currentLayerTitle,
  onPrev,
  onNext,
}: StepNavigationProps) {
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === totalSteps - 1;

  // Keyboard navigation support (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or dialog
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight' && !isLast) {
        onNext();
      } else if (e.key === 'ArrowLeft' && !isFirst) {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, isFirst, isLast, onNext, onPrev]);

  return (
    <nav className="player-nav">
      <button
        type="button"
        className="nav-btn nav-btn-secondary"
        onClick={onPrev}
        disabled={isFirst}
        title="이전 단계 (단축키: ←)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>이전</span>
      </button>

      <div className="nav-layer-title" title={currentLayerTitle}>
        <span>{currentLayerTitle}</span>
      </div>

      <button
        type="button"
        className="nav-btn nav-btn-primary"
        onClick={onNext}
        title={isLast ? '학습 완료' : '다음 단계 (단축키: →)'}
      >
        <span>{isLast ? '완료' : '다음'}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <style jsx>{`
        .player-nav {
          position: sticky;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          padding-bottom: calc(0.75rem + var(--safe-bottom));
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-default);
          z-index: 20;
          gap: 1rem;
        }

        .nav-layer-title {
          font-size: var(--text-xs);
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          min-width: 0;
          text-align: center;
          font-weight: 600;
          word-break: keep-all;
          padding: 0 0.5rem;
        }

        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.1rem;
          font-size: var(--text-sm);
          font-weight: 600;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          user-select: none;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .nav-btn:active {
          transform: scale(0.97);
        }

        .nav-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          transform: none;
        }

        .nav-btn-secondary {
          background: var(--surface-hover);
          color: var(--text-secondary);
          border: 1px solid var(--border-default);
        }

        .nav-btn-secondary:hover:not(:disabled) {
          color: var(--text-primary);
          background: var(--surface-active);
          border-color: var(--border-emphasis);
        }

        .nav-btn-primary {
          background: linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary));
          color: #050810;
          box-shadow: 0 2px 10px var(--accent-glow);
        }

        .nav-btn-primary:hover:not(:disabled) {
          filter: brightness(1.1);
          box-shadow: 0 4px 16px var(--accent-glow);
          transform: translateY(-1px);
        }
      `}</style>
    </nav>
  );
}
