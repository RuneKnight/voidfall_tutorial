'use client';

import React, { useEffect, useRef } from 'react';
import { GlossaryTerm } from '@/types/tutorial';

interface GlossaryPopoverProps {
  term: GlossaryTerm | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onSelectTerm: (termId: string) => void;
}

export function GlossaryPopover({
  term,
  position,
  onClose,
  onSelectTerm,
}: GlossaryPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!term || !position) return null;

  // Calculate viewport boundaries
  const padding = 16;
  const popoverWidth = 320;
  const popoverEstimatedHeight = 220;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  const left = Math.min(
    Math.max(padding, position.x - popoverWidth / 2),
    viewportWidth - popoverWidth - padding
  );

  // If opening at bottom overflows viewport, position above the target point
  const isNearBottom = position.y + popoverEstimatedHeight > viewportHeight;
  const top = isNearBottom
    ? Math.max(padding, position.y - popoverEstimatedHeight - 12)
    : position.y + 12;

  return (
    <div
      ref={popoverRef}
      className="glossary-popover glass-panel animate-fade-in"
      style={{ top: `${top}px`, left: `${left}px` }}
      role="dialog"
      aria-label={`${term.term} 용어 설명`}
    >
      <div className="popover-header">
        <div className="title-wrap">
          <h3 className="popover-title">{term.term}</h3>
          {term.termEn && <span className="popover-term-en">{term.termEn}</span>}
        </div>
        <button
          type="button"
          className="popover-close-btn"
          onClick={onClose}
          aria-label="닫기"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="popover-body">
        <p className="popover-def">{term.definition}</p>

        {term.related && term.related.length > 0 && (
          <div className="popover-related">
            <span className="related-label">연관 용어:</span>
            <div className="related-tags">
              {term.related.map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  className="related-tag-btn"
                  onClick={() => onSelectTerm(rel.id)}
                >
                  {rel.term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .glossary-popover {
          position: fixed;
          z-index: 1000;
          width: 320px;
          max-width: calc(100vw - 32px);
          max-height: 60vh;
          overflow-y: auto;
          background: var(--bg-surface);
          border: 1px solid var(--accent-border-strong);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg), 0 0 20px rgba(0, 242, 254, 0.15);
        }

        .popover-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-default);
          background: var(--bg-secondary);
        }

        .title-wrap {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .popover-title {
          font-size: var(--text-md);
          font-weight: 700;
          color: var(--color-accent);
        }

        .popover-term-en {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .popover-close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .popover-close-btn:hover {
          color: var(--text-primary);
          background: var(--surface-active);
        }

        .popover-body {
          padding: 0.9rem 1rem;
          font-size: var(--text-sm);
          line-height: var(--leading-normal);
          color: var(--text-secondary);
        }

        .popover-def {
          margin-bottom: 0.75rem;
        }

        .popover-related {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          font-size: var(--text-xs);
        }

        .related-label {
          color: var(--text-muted);
          font-weight: 500;
          display: block;
          margin-bottom: 0.35rem;
        }

        .related-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .related-tag-btn {
          font-size: var(--text-xs);
          color: var(--color-accent);
          background: var(--accent-bg);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--accent-border);
          transition: all var(--transition-fast);
        }

        .related-tag-btn:hover {
          background: var(--accent-bg-hover);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
