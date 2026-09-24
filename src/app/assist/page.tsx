'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuickSearch } from '@/hooks/useQuickSearch';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useTheme } from '@/hooks/useTheme';
import { QuickRefDrawer } from '@/components/QuickRefDrawer';
import { CombatSimulatorDrawer } from '@/components/CombatSimulatorDrawer';
import { CheatSheetView } from '@/components/CheatSheetView';

export default function AssistPage() {
  const { isOpen: isSearchOpen, openSearch, closeSearch } = useQuickSearch();
  const [isCombatSimOpen, setIsCombatSimOpen] = useState(false);
  const { isActive: isWakeLockActive, isSupported: isWakeLockSupported, toggleWakeLock } = useWakeLock();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="assist-container">
      {/* Top Navbar */}
      <nav className="assist-nav">
        <div className="nav-brand">
          <Link href="/" className="back-link">
            ← 메인 홈
          </Link>
          <span className="brand-badge">TABLETOP COMPANION</span>
          <span className="brand-name">보이드폴 어시스트</span>
        </div>
        <div className="nav-actions">
          {isWakeLockSupported && (
            <button
              type="button"
              className={`wakelock-pill ${isWakeLockActive ? 'active' : ''}`}
              onClick={toggleWakeLock}
              title="화면 꺼짐 방지 토글"
            >
              💡 {isWakeLockActive ? '화면 켜짐 유지 중' : '화면 꺼짐 방지'}
            </button>
          )}
          <button
            type="button"
            className="theme-btn"
            onClick={toggleTheme}
            title="테마 전환"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* Hero Banner */}
      <header className="assist-hero">
        <h1 className="hero-title">⚔️ 보이드폴 플레이 어시스트 툴</h1>
        <p className="hero-desc">
          실전 테이블탑 보드게임 플레이 중 빠른 규칙 검색, 결정론적 전투 수식 연산, 진행 요약 점검표를 즉시 활용하세요.
        </p>

        {/* Quick Tools Grid */}
        <div className="tools-grid">
          <div className="tool-card glass-panel" onClick={openSearch}>
            <div className="tool-icon">🔍</div>
            <h3 className="tool-title">인게임 퀵 레퍼런스 (Ctrl+K)</h3>
            <p className="tool-desc">
              한글 초성(예: ㅂㅍ), 영문 용어 및 46개 핵심 게임 키워드를 실시간 퍼지 검색합니다.
            </p>
            <span className="tool-btn">검색 실행 (Ctrl+K) →</span>
          </div>

          <div className="tool-card glass-panel" onClick={() => setIsCombatSimOpen(true)}>
            <div className="tool-icon">⚔️</div>
            <h3 className="tool-title">결정론적 전투 시뮬레이터</h3>
            <p className="tool-desc">
              주사위 없는 100% 결정론적 전투: 접근 단계 선제 타격, 일제사격 피해 교환, 잔존 유닛 성패 연산.
            </p>
            <span className="tool-btn">전투 계산기 열기 →</span>
          </div>
        </div>
      </header>

      {/* CheatSheet Embedded Section */}
      <section className="cheatsheet-section">
        <h2 className="section-title">📋 핵심 플레이 요약 & 점검표 (Cheat Sheets)</h2>
        <CheatSheetView />
      </section>

      {/* Drawers */}
      <QuickRefDrawer isOpen={isSearchOpen} onClose={closeSearch} />
      <CombatSimulatorDrawer isOpen={isCombatSimOpen} onClose={() => setIsCombatSimOpen(false)} />

      <style jsx>{`
        .assist-container {
          min-height: 100vh;
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 1.25rem 4rem;
          display: flex;
          flex-direction: column;
        }

        .assist-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 0;
          border-bottom: 1px solid var(--border-subtle);
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .back-link {
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--color-accent);
        }

        .brand-badge {
          font-size: 0.65rem;
          font-weight: 800;
          background: var(--accent-bg);
          color: var(--color-accent);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--accent-border);
        }

        .brand-name {
          font-weight: 700;
          font-size: var(--text-md);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .wakelock-pill {
          font-size: var(--text-xs);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          background: var(--bg-surface);
          color: var(--text-secondary);
          border: 1px solid var(--border-default);
          cursor: pointer;
        }

        .wakelock-pill.active {
          background: var(--accent-bg);
          color: var(--color-accent);
          border-color: var(--accent-border);
          box-shadow: 0 0 10px var(--accent-glow);
        }

        .theme-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--surface-hover);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .assist-hero {
          padding: 2.5rem 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .hero-title {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 900;
        }

        .hero-desc {
          font-size: var(--text-md);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          max-width: 720px;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.25rem;
          margin-top: 1rem;
        }

        @media (min-width: 640px) {
          .tools-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .tool-card {
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          background: var(--bg-secondary);
          border: 1px solid var(--border-default);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .tool-card:hover {
          border-color: var(--accent-border);
          background: var(--bg-surface);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .tool-icon {
          font-size: 2rem;
        }

        .tool-title {
          font-size: var(--text-md);
          font-weight: 700;
        }

        .tool-desc {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
        }

        .tool-btn {
          margin-top: 0.75rem;
          font-size: var(--text-xs);
          font-weight: 700;
          color: var(--color-accent);
        }

        .cheatsheet-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-subtle);
        }

        .section-title {
          font-size: var(--text-xl);
          font-weight: 700;
          margin-bottom: 1.25rem;
        }
      `}</style>
    </div>
  );
}
