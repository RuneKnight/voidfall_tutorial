'use client';

import React, { useState } from 'react';
import cheatsheetsData from '@/data/cheatsheets.json';
import { CheatSheetItem } from '@/types/companion';

export function CheatSheetView() {
  const cheatsheets = cheatsheetsData as unknown as CheatSheetItem[];
  const [selectedId, setSelectedId] = useState<string>(cheatsheets[0]?.id || 'cs-cycle-flow');

  const activeItem = cheatsheets.find((cs) => cs.id === selectedId) || cheatsheets[0];

  return (
    <div className="cheatsheet-container">
      {/* Category Tabs */}
      <div className="cheatsheet-tabs">
        {cheatsheets.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`tab-btn ${item.id === selectedId ? 'active' : ''}`}
            onClick={() => setSelectedId(item.id)}
          >
            {item.titleKo}
          </button>
        ))}
      </div>

      {/* Selected CheatSheet Content */}
      {activeItem && (
        <div className="cheatsheet-body">
          <div className="cs-header">
            <h3 className="cs-title">{activeItem.titleKo}</h3>
            <span className="cs-title-en">{activeItem.titleEn}</span>
            <p className="cs-summary">{activeItem.summaryKo}</p>
          </div>

          {activeItem.steps && (
            <div className="cs-steps-list">
              {activeItem.steps.map((step) => (
                <div key={step.stepNumber} className="cs-step-card">
                  <div className="step-badge">{step.stepNumber}</div>
                  <div className="step-content">
                    <h4 className="step-title">{step.title}</h4>
                    <p className="step-desc">{step.description}</p>
                    {step.warning && <div className="step-warning">⚠️ {step.warning}</div>}
                    {step.tip && <div className="step-tip">💡 {step.tip}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .cheatsheet-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .cheatsheet-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .tab-btn {
          white-space: nowrap;
          padding: 0.5rem 0.9rem;
          font-size: var(--text-xs);
          font-weight: 600;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          color: var(--text-secondary);
          border: 1px solid var(--border-default);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .tab-btn:hover {
          color: var(--text-primary);
          background: var(--surface-hover);
        }

        .tab-btn.active {
          background: var(--accent-bg);
          color: var(--color-accent);
          border-color: var(--accent-border);
        }

        .cs-header {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }

        .cs-title {
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text-primary);
        }

        .cs-title-en {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .cs-summary {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-top: 0.35rem;
          line-height: var(--leading-relaxed);
        }

        .cs-steps-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .cs-step-card {
          display: flex;
          gap: 0.85rem;
          padding: 0.9rem 1rem;
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
        }

        .step-badge {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--accent-bg);
          color: var(--color-accent);
          font-weight: 700;
          font-size: var(--text-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid var(--accent-border);
        }

        .step-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .step-title {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--text-primary);
        }

        .step-desc {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
        }

        .step-warning {
          margin-top: 0.35rem;
          font-size: var(--text-xs);
          color: #f87171;
          background: rgba(239, 68, 68, 0.1);
          padding: 0.35rem 0.6rem;
          border-radius: var(--radius-sm);
        }

        .step-tip {
          margin-top: 0.35rem;
          font-size: var(--text-xs);
          color: var(--color-accent);
          background: var(--accent-bg-subtle);
          padding: 0.35rem 0.6rem;
          border-radius: var(--radius-sm);
        }
      `}</style>
    </div>
  );
}
