'use client';

import React from 'react';
import Link from 'next/link';
import tutorialData from '@/data/tutorial.json';
import { useTutorialProgress } from '@/hooks/useTutorialProgress';
import { useTheme } from '@/hooks/useTheme';
import { Layer } from '@/types/tutorial';

export default function HomePage() {
  const layers = tutorialData.layers as unknown as Layer[];
  const {
    currentStepIndex,
    completedSteps,
    currentLayer,
    stepInChapter,
    isLoaded,
    completionPercentage,
    getChapterStatus,
  } = useTutorialProgress(tutorialData.meta.totalSteps);
  const { theme, toggleTheme } = useTheme();

  const hasProgress = currentStepIndex > 0 || completedSteps.length > 0;
  const resumeUrl = `/play?ch=${currentLayer.id}&step=${currentStepIndex + 1}`;

  return (
    <div className="home-container">
      {/* Top Navbar */}
      <nav className="home-nav">
        <div className="nav-brand">
          <span className="brand-badge">4X EURO TUTORIAL</span>
          <span className="brand-name">VOIDFALL KR</span>
        </div>
        <div className="nav-actions">
          <Link href="/assist" className="nav-assist-link">
            ⚔️ 플레이 어시스트
          </Link>
          <Link href={resumeUrl} className="nav-play-link">
            튜토리얼 입장
          </Link>
          <button
            type="button"
            className="theme-btn"
            onClick={toggleTheme}
            title="테마 전환"
            aria-label="테마 전환"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-badge">대화형 인터랙티브 룰북 & 테이블탑 플레이 툴</div>
        <h1 className="hero-title">
          보이드폴 <span className="highlight">Voidfall</span>
        </h1>
        <p className="hero-subtitle">
          공허태생(Voidborn)의 어둠에 맞서 은하계를 수호하고, 당신만의 성간 제국을 건설하세요.
          총 16개 챕터, 58개 단계로 완벽하게 정리된 공식 한국어 인터랙티브 튜토리얼입니다.
        </p>

        {/* CTA Buttons */}
        <div className="cta-group">
          <div className="cta-primary-row">
            <Link href={resumeUrl} className="cta-btn primary-btn">
              <span>
                {hasProgress
                  ? `이어서 학습하기: Chapter ${currentLayer.index + 1} - ${stepInChapter}단계`
                  : '튜토리얼 시작하기'}
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <Link href="/assist" className="cta-btn secondary-btn">
              <span>⚔️ 플레이 어시스트 (전투 계산기 & 퀵 레퍼런스)</span>
            </Link>
          </div>

          {hasProgress && isLoaded && (
            <div className="progress-pill">
              <span className="pill-dot" />
              <span>
                전체 진행도: {currentStepIndex + 1} / {tutorialData.meta.totalSteps} 단계 ({completionPercentage}%)
              </span>
            </div>
          )}
        </div>

        {/* Game Quick Info Badges */}
        <div className="info-grid">
          <div className="info-card">
            <span className="info-val">1 - 4인</span>
            <span className="info-lbl">경쟁 / 협동 / 솔로</span>
          </div>
          <div className="info-card">
            <span className="info-val">120 - 240분</span>
            <span className="info-lbl">3 사이클 진행</span>
          </div>
          <div className="info-card">
            <span className="info-val">4.6 / 5.0</span>
            <span className="info-lbl">깊이 있는 4X 유로</span>
          </div>
          <div className="info-card">
            <span className="info-val">주사위 없는 전투</span>
            <span className="info-lbl">100% 결정론적 계산</span>
          </div>
        </div>
      </header>

      {/* Chapters Grid Section */}
      <section className="chapters-section">
        <div className="section-header">
          <h2 className="section-title">튜토리얼 목차</h2>
          <p className="section-desc">
            원하는 챕터를 클릭하여 해당 단계부터 즉시 학습을 시작할 수 있습니다.
          </p>
        </div>

        <div className="chapters-grid">
          {layers.map((layer) => {
            const status = getChapterStatus(layer);
            const chapterUrl = `/play?ch=${layer.id}&step=${layer.stepStartIndex + 1}`;

            return (
              <Link
                key={layer.id}
                href={chapterUrl}
                className={`chapter-card glass-panel ${status.toLowerCase()}`}
                onClick={() => {
                  try {
                    localStorage.setItem(
                      'voidfall_tutorial_progress',
                      JSON.stringify({
                        currentStepIndex: layer.stepStartIndex,
                        completedSteps: completedSteps,
                        lastAccessedAt: Date.now(),
                      })
                    );
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                <div className="chapter-header">
                  <span className="ch-num">CHAPTER {layer.index + 1}</span>
                  {status === 'COMPLETED' && <span className="status-badge completed">✓ 완료</span>}
                  {status === 'IN_PROGRESS' && <span className="status-badge in-progress">학습 중</span>}
                  <span className="ch-time">~{layer.estimatedMinutes}분</span>
                </div>
                <h3 className="ch-title">{layer.title}</h3>
                <span className="ch-title-en">{layer.titleEn}</span>
                <div className="ch-footer">
                  <span className="ch-steps">{layer.stepCount}개 단계</span>
                  <span className="ch-arrow">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p className="footer-text">
          원작: <strong>Voidfall</strong> (Nigel Buckle & David Turczi / Mindclash Games)
        </p>
        <p className="footer-subtext">
          본 사이트는 비상업적 목적의 한국어 인터랙티브 룰 가이드입니다. 
          튜토리얼 원작: <a href="https://boardgamegenius.net/play/voidfall" target="_blank" rel="noreferrer">Boardgamegenius.net</a>
        </p>
      </footer>

      <style jsx>{`
        .home-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1.25rem 3rem;
        }

        /* Navbar */
        .home-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 0;
          border-bottom: 1px solid var(--border-subtle);
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .brand-badge {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          background: var(--accent-bg);
          color: var(--color-accent);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--accent-border);
        }

        .brand-name {
          font-weight: 700;
          font-size: var(--text-md);
          letter-spacing: 0.05em;
          color: var(--text-primary);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nav-assist-link {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-primary);
          background: var(--bg-surface);
          padding: 0.45rem 0.9rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
          transition: all var(--transition-fast);
        }

        .nav-assist-link:hover {
          background: var(--surface-hover);
          text-decoration: none;
          transform: translateY(-1px);
        }

        .nav-play-link {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--color-accent);
          background: var(--accent-bg);
          padding: 0.45rem 0.9rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--accent-border);
          transition: all var(--transition-fast);
        }

        .nav-play-link:hover {
          background: var(--accent-bg-hover);
          text-decoration: none;
          transform: translateY(-1px);
        }

        .theme-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--surface-hover);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          border: 1px solid var(--border-subtle);
        }

        /* Hero */
        .hero-section {
          padding: 4rem 0 3rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-badge {
          font-size: var(--text-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-accent);
          background: var(--accent-bg-subtle);
          border: 1px solid var(--accent-border);
          padding: 0.35rem 1rem;
          border-radius: var(--radius-full);
          margin-bottom: 1.25rem;
        }

        .hero-title {
          font-size: clamp(2.2rem, 6vw, 3.8rem);
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }

        .hero-title .highlight {
          background: linear-gradient(135deg, var(--color-accent), #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          max-width: 680px;
          font-size: var(--text-md);
          line-height: var(--leading-relaxed);
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
        }

        .cta-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .cta-primary-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-size: var(--text-md);
          font-weight: 700;
          padding: 0.9rem 1.8rem;
          border-radius: var(--radius-lg);
          transition: all var(--transition-normal);
        }

        .primary-btn {
          background: linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary));
          color: #050810;
          box-shadow: 0 4px 20px var(--accent-glow);
        }

        .primary-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
          box-shadow: 0 6px 28px var(--accent-glow);
          text-decoration: none;
        }

        .secondary-btn {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-default);
        }

        .secondary-btn:hover {
          background: var(--bg-surface);
          border-color: var(--accent-border);
          transform: translateY(-2px);
          text-decoration: none;
        }

        .progress-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: var(--text-xs);
          color: var(--text-secondary);
          background: var(--bg-surface);
          padding: 0.35rem 0.9rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-default);
        }

        .pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-accent);
          box-shadow: 0 0 6px var(--accent-glow);
        }

        /* Info Grid */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          width: 100%;
          max-width: 800px;
        }

        @media (min-width: 640px) {
          .info-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .info-card {
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          text-align: center;
        }

        .info-val {
          font-size: var(--text-md);
          font-weight: 700;
          color: var(--text-primary);
        }

        .info-lbl {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        /* Chapters Section */
        .chapters-section {
          padding: 2.5rem 0;
        }

        .section-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .section-title {
          font-size: var(--text-2xl);
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .section-desc {
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .chapters-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .chapters-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .chapters-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .chapter-card {
          padding: 1.25rem 1.4rem;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          border: 1px solid var(--border-default);
          background: var(--bg-secondary);
          transition: all var(--transition-normal);
          min-width: 0;
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        .chapter-card:hover {
          border-color: var(--accent-border-strong);
          background: var(--bg-surface);
          transform: translateY(-2px);
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .chapter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: var(--text-xs);
          margin-bottom: 0.25rem;
          gap: 0.5rem;
        }

        .status-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-sm);
        }

        .status-badge.completed {
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .status-badge.in-progress {
          background: rgba(234, 179, 8, 0.15);
          color: #facc15;
          border: 1px solid rgba(234, 179, 8, 0.3);
        }

        .ch-num {
          font-weight: 700;
          color: var(--color-accent);
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .ch-time {
          color: var(--text-muted);
          white-space: nowrap;
        }

        .ch-title {
          font-size: var(--text-md);
          font-weight: 700;
          color: var(--text-primary);
          line-height: var(--leading-snug);
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        .ch-title-en {
          font-size: var(--text-xs);
          color: var(--text-muted);
          word-break: break-all;
        }

        .ch-footer {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        .ch-arrow {
          font-weight: 700;
          color: var(--color-accent);
          transition: transform var(--transition-fast);
        }

        .chapter-card:hover .ch-arrow {
          transform: translateX(4px);
        }

        /* Footer */
        .home-footer {
          margin-top: auto;
          padding-top: 3rem;
          border-top: 1px solid var(--border-subtle);
          text-align: center;
          font-size: var(--text-xs);
          color: var(--text-muted);
          line-height: var(--leading-normal);
        }

        .footer-text {
          margin-bottom: 0.35rem;
        }
      `}</style>
    </div>
  );
}
