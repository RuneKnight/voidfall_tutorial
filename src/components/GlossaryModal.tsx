'use client';

import React, { useState, useMemo } from 'react';
import { GlossaryTerm } from '@/types/tutorial';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  glossary: Record<string, GlossaryTerm>;
  activeTermKey?: string | null;
  onSelectTerm: (termKey: string) => void;
}

export function GlossaryModal({
  isOpen,
  onClose,
  glossary,
  activeTermKey,
  onSelectTerm,
}: GlossaryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openTermKey, setOpenTermKey] = useState<string | null>(activeTermKey || null);

  const termsList = useMemo(() => {
    return Object.values(glossary);
  }, [glossary]);

  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return termsList;
    const q = searchQuery.toLowerCase();
    return termsList.filter(
      (item) =>
        item.term.toLowerCase().includes(q) ||
        (item.termEn && item.termEn.toLowerCase().includes(q)) ||
        item.definition.toLowerCase().includes(q)
    );
  }, [termsList, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="glossary-modal-backdrop" onClick={onClose}>
      <div
        className="glossary-modal-dialog glass-panel animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="glossary-modal-title"
      >
        <div className="modal-header">
          <div className="header-title-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <h2 id="glossary-modal-title" className="modal-title">
              게임 용어 사전 ({termsList.length}개)
            </h2>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="닫기">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-search">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="용어 또는 설명 검색... (예: 부패, 공허태생, 흡수)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="검색어 지우기"
            >
              ×
            </button>
          )}
        </div>

        <div className="terms-list">
          {filteredTerms.length === 0 ? (
            <div className="no-results">
              <p>검색 결과가 없습니다.</p>
              <span>다른 검색어를 입력해 보세요.</span>
            </div>
          ) : (
            filteredTerms.map((item) => {
              const isOpen = openTermKey === item.id;
              return (
                <div key={item.id} className={`term-card ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="term-header-btn"
                    onClick={() => setOpenTermKey(isOpen ? null : item.id)}
                  >
                    <div className="term-names">
                      <span className="term-ko">{item.term}</span>
                      {item.termEn && <span className="term-en">{item.termEn}</span>}
                    </div>
                    <svg
                      className={`chevron ${isOpen ? 'rotate' : ''}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="term-body">
                      <p className="term-desc">{item.definition}</p>

                      {item.related && item.related.length > 0 && (
                        <div className="term-related">
                          <span className="related-label">연관 용어:</span>
                          <div className="related-tags">
                            {item.related.map((rel) => (
                              <button
                                key={rel.id}
                                type="button"
                                className="related-tag"
                                onClick={() => {
                                  setOpenTermKey(rel.id);
                                  onSelectTerm(rel.id);
                                }}
                              >
                                {rel.term}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <style jsx>{`
        .glossary-modal-backdrop {
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

        .glossary-modal-dialog {
          width: 100%;
          max-width: 580px;
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

        .modal-search {
          position: relative;
          display: flex;
          align-items: center;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-surface);
        }

        .search-icon {
          position: absolute;
          left: 1.75rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.65rem 2rem 0.65rem 2.2rem;
          background: var(--bg-input);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: var(--text-sm);
          outline: none;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .search-input:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .clear-search-btn {
          position: absolute;
          right: 1.75rem;
          font-size: 1.2rem;
          color: var(--text-muted);
        }

        .terms-list {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .no-results {
          padding: 3rem 1rem;
          text-align: center;
          color: var(--text-muted);
        }

        .term-card {
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          overflow: hidden;
          transition: border-color var(--transition-fast);
        }

        .term-card.open {
          border-color: var(--accent-border-strong);
        }

        .term-header-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          text-align: left;
        }

        .term-header-btn:hover {
          background: var(--surface-hover);
        }

        .term-names {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .term-ko {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--text-primary);
        }

        .term-card.open .term-ko {
          color: var(--color-accent);
        }

        .term-en {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .chevron {
          color: var(--text-muted);
          transition: transform var(--transition-normal);
        }

        .chevron.rotate {
          transform: rotate(180deg);
          color: var(--color-accent);
        }

        .term-body {
          padding: 0.75rem 1rem 1rem;
          border-top: 1px solid var(--border-subtle);
          background: var(--bg-secondary);
        }

        .term-desc {
          font-size: var(--text-sm);
          line-height: var(--leading-relaxed);
          color: var(--text-secondary);
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        .term-related {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
        }

        .related-label {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-bottom: 0.35rem;
          display: block;
        }

        .related-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .related-tag {
          font-size: var(--text-xs);
          padding: 0.2rem 0.5rem;
          background: var(--accent-bg);
          color: var(--color-accent);
          border-radius: var(--radius-sm);
          border: 1px solid var(--accent-border);
        }

        .related-tag:hover {
          background: var(--accent-bg-hover);
        }
      `}</style>
    </div>
  );
}
