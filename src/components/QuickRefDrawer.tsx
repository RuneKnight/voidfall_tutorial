'use client';

import React, { useState, useMemo } from 'react';
import glossaryData from '@/data/glossary.json';
import { GlossaryTerm } from '@/types/tutorial';
import { fuzzySearchItems } from '@/lib/fuzzySearch';
import { CheatSheetView } from '@/components/CheatSheetView';

interface QuickRefDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTerm?: (termKey: string) => void;
}

export function QuickRefDrawer({ isOpen, onClose, onSelectTerm }: QuickRefDrawerProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'cheatsheets'>('search');

  const glossaryTermsList = useMemo(() => {
    return Object.entries(glossaryData).map(([key, term]) => {
      const gTerm = term as unknown as GlossaryTerm;
      return {
        key,
        id: gTerm.id,
        titleKo: gTerm.term,
        titleEn: gTerm.termEn,
        summaryKo: gTerm.definition,
        relatedKeywords: gTerm.related?.map((r) => r.term) || [],
      };
    });
  }, []);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return fuzzySearchItems(glossaryTermsList, query);
  }, [glossaryTermsList, query]);

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="퀵 레퍼런스 및 용어 검색"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="search-bar">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="용어, 초성 (예: ㅂㅍ), 영문 검색... (Esc로 닫기)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (activeTab !== 'search') setActiveTab('search');
              }}
              aria-label="용어 및 초성 검색"
              autoFocus
            />
            {query && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setQuery('')}
                aria-label="검색어 지우기"
              >
                ×
              </button>
            )}
            <span className="shortcut-badge">Cmd/Ctrl + K</span>
          </div>

          <div className="nav-tabs" role="tablist" aria-label="퀵 레퍼런스 탭">
            <button
              type="button"
              role="tab"
              id="tab-search"
              aria-selected={activeTab === 'search'}
              aria-controls="panel-search"
              className={`nav-tab ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              용어 검색 {searchResults.length > 0 ? `(${searchResults.length})` : ''}
            </button>
            <button
              type="button"
              role="tab"
              id="tab-cheatsheets"
              aria-selected={activeTab === 'cheatsheets'}
              aria-controls="panel-cheatsheets"
              className={`nav-tab ${activeTab === 'cheatsheets' ? 'active' : ''}`}
              onClick={() => setActiveTab('cheatsheets')}
            >
              📋 치트시트 & 요약
            </button>
            <button type="button" className="close-btn" onClick={onClose} aria-label="닫기">
              ✕
            </button>
          </div>
        </div>

        {/* Drawer Content Body */}
        <div className="drawer-content">
          {activeTab === 'search' && (
            <div
              id="panel-search"
              role="tabpanel"
              aria-labelledby="tab-search"
              className="search-results-list"
            >
              {query.trim() === '' ? (
                <div className="search-placeholder">
                  <p className="placeholder-text">💡 검색어를 입력하거나 초성(예: ㅂㅍ, ㄱㅎ태생)을 입력하세요.</p>
                  <div className="popular-tags">
                    <span className="tag-label">추천 용어:</span>
                    {['흡수', '부패', '접근 단계', '일제사격', '공허태생'].map((term) => (
                      <button
                        key={term}
                        type="button"
                        className="quick-tag"
                        onClick={() => setQuery(term)}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="empty-results">
                  <p>’{query}’에 대한 검색 결과가 없습니다.</p>
                </div>
              ) : (
                searchResults.map(({ item, score }) => (
                  <div
                    key={item.key}
                    tabIndex={0}
                    role="button"
                    aria-label={`${item.titleKo} 용어 상세보기`}
                    className="result-card"
                    onClick={() => {
                      if (onSelectTerm) onSelectTerm(item.key);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (onSelectTerm) onSelectTerm(item.key);
                      }
                    }}
                  >
                    <div className="card-top">
                      <span className="card-title">{item.titleKo}</span>
                      <span className="card-en">{item.titleEn}</span>
                      <span className="match-score">매칭 점수: {score}</span>
                    </div>
                    <p className="card-desc">{item.summaryKo}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'cheatsheets' && (
            <div id="panel-cheatsheets" role="tabpanel" aria-labelledby="tab-cheatsheets">
              <CheatSheetView />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(5, 8, 16, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.2s ease-out;
        }

        .drawer-container {
          width: 100%;
          max-width: 520px;
          height: 100%;
          background: var(--bg-primary);
          border-left: 1px solid var(--border-default);
          display: flex;
          flex-direction: column;
          box-shadow: -8px 0 32px rgba(0, 0, 0, 0.6);
          animation: slideLeft 0.25s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .drawer-header {
          padding: 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: var(--bg-secondary);
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: 0.65rem 1rem;
        }

        .search-icon {
          font-size: var(--text-md);
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: var(--text-sm);
        }

        .clear-search-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0 0.25rem;
          line-height: 1;
        }

        .clear-search-btn:hover {
          color: var(--text-primary);
        }

        .shortcut-badge {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          background: var(--surface-hover);
          padding: 0.2rem 0.45rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }

        .nav-tabs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-tab {
          padding: 0.4rem 0.8rem;
          font-size: var(--text-xs);
          font-weight: 600;
          border-radius: var(--radius-md);
          background: transparent;
          color: var(--text-secondary);
          border: none;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .nav-tab.active {
          background: var(--accent-bg);
          color: var(--color-accent);
          border: 1px solid var(--accent-border);
        }

        .close-btn {
          margin-left: auto;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0.2rem 0.5rem;
        }

        .drawer-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
        }

        .search-placeholder {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 2rem 0;
          text-align: center;
          color: var(--text-secondary);
        }

        .placeholder-text {
          font-size: var(--text-sm);
        }

        .popular-tags {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .tag-label {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .quick-tag {
          font-size: var(--text-xs);
          color: var(--color-accent);
          background: var(--accent-bg-subtle);
          border: 1px solid var(--accent-border);
          padding: 0.35rem 0.7rem;
          border-radius: var(--radius-full);
          cursor: pointer;
        }

        .empty-results {
          padding: 3rem 0;
          text-align: center;
          color: var(--text-muted);
          font-size: var(--text-sm);
        }

        .search-results-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .result-card {
          padding: 1rem;
          border-radius: var(--radius-lg);
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .result-card:hover {
          background: var(--bg-surface);
          border-color: var(--accent-border);
          transform: translateY(-1px);
        }

        .nav-tab:focus-visible,
        .search-input:focus-visible,
        .close-btn:focus-visible,
        .quick-tag:focus-visible,
        .result-card:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.35rem;
        }

        .card-title {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--text-primary);
        }

        .card-en {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .match-score {
          margin-left: auto;
          font-size: 0.65rem;
          color: var(--color-accent);
          background: var(--accent-bg);
          padding: 0.15rem 0.4rem;
          border-radius: var(--radius-sm);
        }

        .card-desc {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
        }
      `}</style>
    </div>
  );
}
