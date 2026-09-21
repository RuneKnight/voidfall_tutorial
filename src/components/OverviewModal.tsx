'use client';

import React from 'react';
import { Layer } from '@/types/tutorial';

interface OverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  layers: Layer[];
  currentStepIndex: number;
  completedSteps: number[];
  onSelectStep: (stepIndex: number) => void;
}

export function OverviewModal({
  isOpen,
  onClose,
  layers,
  currentStepIndex,
  completedSteps,
  onSelectStep,
}: OverviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="overview-modal-backdrop" onClick={onClose}>
      <div
        className="overview-modal-dialog glass-panel animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="overview-modal-title"
      >
        <div className="modal-header">
          <div className="header-title-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <h2 id="overview-modal-title" className="modal-title">
              튜토리얼 목차 (16개 챕터)
            </h2>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="닫기">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <ul className="layers-list">
          {layers.map((layer) => {
            const isCurrent =
              currentStepIndex >= layer.stepStartIndex &&
              currentStepIndex <= layer.stepEndIndex;

            // Count completed
            let doneCount = 0;
            for (let i = layer.stepStartIndex; i <= layer.stepEndIndex; i++) {
              if (completedSteps.includes(i) || i <= currentStepIndex) {
                doneCount++;
              }
            }
            const progressPercent = Math.min(
              100,
              Math.round((doneCount / layer.stepCount) * 100)
            );

            return (
              <li
                key={layer.id}
                className={`layer-item ${isCurrent ? 'current' : ''}`}
              >
                <button
                  type="button"
                  className="layer-btn"
                  onClick={() => {
                    onSelectStep(layer.stepStartIndex);
                    onClose();
                  }}
                >
                  <div className="layer-top-row">
                    <span className="layer-number">Chapter {layer.index + 1}</span>
                    <span className="layer-meta">
                      <span className="steps-count">
                        {doneCount}/{layer.stepCount} 단계
                      </span>
                      <span className="time-est">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        ~{layer.estimatedMinutes}분
                      </span>
                    </span>
                  </div>

                  <div className="layer-title-row">
                    <h3 className="layer-title">{layer.title}</h3>
                    {layer.titleEn && <span className="layer-title-en">{layer.titleEn}</span>}
                  </div>

                  <div className="layer-progress-track">
                    <div
                      className="layer-progress-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <style jsx>{`
        .overview-modal-backdrop {
          position: fixed;
          inset: 0;
          background: var(--overlay-bg);
          backdrop-filter: var(--backdrop-blur);
          z-index: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .overview-modal-dialog {
          width: 100%;
          max-width: 520px;
          max-height: 85vh;
          background: var(--bg-secondary);
          border: 1px solid var(--border-emphasis);
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-default);
        }

        .header-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--color-accent);
        }

        .modal-title {
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text-primary);
        }

        .close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .close-btn:hover {
          color: var(--text-primary);
          background: var(--surface-active);
        }

        .layers-list {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          list-style: none;
        }

        .layer-item {
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: all var(--transition-fast);
          border: 1px solid var(--border-subtle);
        }

        .layer-item.current {
          background: var(--accent-bg-subtle);
          border-color: var(--accent-border-strong);
        }

        .layer-btn {
          width: 100%;
          padding: 0.85rem 1rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          background: var(--bg-surface);
          transition: background-color var(--transition-fast);
        }

        .layer-btn:hover {
          background: var(--bg-surface-hover);
        }

        .layer-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: var(--text-xs);
        }

        .layer-number {
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-accent);
        }

        .layer-meta {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--text-muted);
        }

        .time-est {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .layer-title-row {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .layer-title {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-primary);
        }

        .layer-item.current .layer-title {
          color: var(--color-accent);
        }

        .layer-title-en {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .layer-progress-track {
          width: 100%;
          height: 3px;
          background: var(--border-default);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 0.25rem;
        }

        .layer-progress-fill {
          height: 100%;
          background: var(--color-accent);
          transition: width 0.3s ease;
        }

        .layer-item.current .layer-progress-fill {
          background: linear-gradient(90deg, var(--color-accent), #a78bfa);
        }
      `}</style>
    </div>
  );
}
