'use client';

import React, { useState, useMemo } from 'react';
import { CombatantSpecs, FleetUnits } from '@/types/combat';
import { calculateCombatResult } from '@/lib/combatEngine';
import { CombatPhaseAnimator } from '@/components/CombatPhaseAnimator';

interface CombatSimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CombatSimulatorDrawer({ isOpen, onClose }: CombatSimulatorDrawerProps) {
  // Invader Specs
  const [invaderFleet, setInvaderFleet] = useState<FleetUnits>({
    corvette: 2,
    destroyer: 1,
    dreadnought: 0,
    carrier: 0,
  });
  const [invaderAbsorption, setInvaderAbsorption] = useState(0);

  // Defender Specs
  const [defenderFleet, setDefenderFleet] = useState<FleetUnits>({
    corvette: 1,
    destroyer: 0,
    dreadnought: 0,
    carrier: 0,
  });
  const [sectorDefense, setSectorDefense] = useState(1);
  const [starbase, setStarbase] = useState(false);
  const [defenderAbsorption, setDefenderAbsorption] = useState(0);

  const combatResult = useMemo(() => {
    const invaderSpecs: CombatantSpecs = {
      side: 'INVADER',
      units: invaderFleet,
      techAbsorption: invaderAbsorption,
    };
    const defenderSpecs: CombatantSpecs = {
      side: 'DEFENDER',
      units: defenderFleet,
      defense: {
        sectorDefense,
        starbase,
      },
      techAbsorption: defenderAbsorption,
    };

    return calculateCombatResult(invaderSpecs, defenderSpecs);
  }, [invaderFleet, invaderAbsorption, defenderFleet, sectorDefense, starbase, defenderAbsorption]);

  if (!isOpen) return null;

  const updateUnit = (side: 'invader' | 'defender', ship: keyof FleetUnits, delta: number) => {
    if (side === 'invader') {
      setInvaderFleet((prev) => ({
        ...prev,
        [ship]: Math.max(0, prev[ship] + delta),
      }));
    } else {
      setDefenderFleet((prev) => ({
        ...prev,
        [ship]: Math.max(0, prev[ship] + delta),
      }));
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="header-title-group">
            <span className="header-icon">⚔️</span>
            <div>
              <h3 className="drawer-title">결정론적 전투 시뮬레이터</h3>
              <span className="drawer-subtitle">주사위 없는 100% 수식 기반 보이드폴 전투 연산기</span>
            </div>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="drawer-body">
          {/* Inputs Section */}
          <div className="inputs-grid">
            {/* Invader Inputs */}
            <div className="side-card invader">
              <h4 className="side-title">🚀 침공자 (Invader)</h4>

              <div className="unit-stepper-group">
                <div className="stepper-row">
                  <span>초계함 (Corvette)</span>
                  <div className="counter">
                    <button type="button" onClick={() => updateUnit('invader', 'corvette', -1)} aria-label="침공자 초계함 수량 감소">-</button>
                    <span>{invaderFleet.corvette}</span>
                    <button type="button" onClick={() => updateUnit('invader', 'corvette', 1)} aria-label="침공자 초계함 수량 증가">+</button>
                  </div>
                </div>

                <div className="stepper-row">
                  <span>구축함 (Destroyer)</span>
                  <div className="counter">
                    <button type="button" onClick={() => updateUnit('invader', 'destroyer', -1)} aria-label="침공자 구축함 수량 감소">-</button>
                    <span>{invaderFleet.destroyer}</span>
                    <button type="button" onClick={() => updateUnit('invader', 'destroyer', 1)} aria-label="침공자 구축함 수량 증가">+</button>
                  </div>
                </div>

                <div className="stepper-row">
                  <span>드레드노트 (Dreadnought)</span>
                  <div className="counter">
                    <button type="button" onClick={() => updateUnit('invader', 'dreadnought', -1)} aria-label="침공자 드레드노트 수량 감소">-</button>
                    <span>{invaderFleet.dreadnought}</span>
                    <button type="button" onClick={() => updateUnit('invader', 'dreadnought', 1)} aria-label="침공자 드레드노트 수량 증가">+</button>
                  </div>
                </div>

                <div className="stepper-row">
                  <span>순양함 (Carrier)</span>
                  <div className="counter">
                    <button type="button" onClick={() => updateUnit('invader', 'carrier', -1)} aria-label="침공자 순양함 수량 감소">-</button>
                    <span>{invaderFleet.carrier}</span>
                    <button type="button" onClick={() => updateUnit('invader', 'carrier', 1)} aria-label="침공자 순양함 수량 증가">+</button>
                  </div>
                </div>

                <div className="stepper-row">
                  <span>기술 피해 흡수 (Absorption)</span>
                  <div className="counter">
                    <button type="button" onClick={() => setInvaderAbsorption((v) => Math.max(0, v - 1))} aria-label="침공자 기술 피해 흡수 감소">-</button>
                    <span>{invaderAbsorption}</span>
                    <button type="button" onClick={() => setInvaderAbsorption((v) => v + 1)} aria-label="침공자 기술 피해 흡수 증가">+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Defender Inputs */}
            <div className="side-card defender">
              <h4 className="side-title">🛡️ 방어자 (Defender)</h4>

              <div className="unit-stepper-group">
                <div className="stepper-row">
                  <span>초계함 (Corvette)</span>
                  <div className="counter">
                    <button type="button" onClick={() => updateUnit('defender', 'corvette', -1)} aria-label="방어자 초계함 수량 감소">-</button>
                    <span>{defenderFleet.corvette}</span>
                    <button type="button" onClick={() => updateUnit('defender', 'corvette', 1)} aria-label="방어자 초계함 수량 증가">+</button>
                  </div>
                </div>

                <div className="stepper-row">
                  <span>구축함 (Destroyer)</span>
                  <div className="counter">
                    <button type="button" onClick={() => updateUnit('defender', 'destroyer', -1)} aria-label="방어자 구축함 수량 감소">-</button>
                    <span>{defenderFleet.destroyer}</span>
                    <button type="button" onClick={() => updateUnit('defender', 'destroyer', 1)} aria-label="방어자 구축함 수량 증가">+</button>
                  </div>
                </div>

                <div className="stepper-row">
                  <span>드레드노트 (Dreadnought)</span>
                  <div className="counter">
                    <button type="button" onClick={() => updateUnit('defender', 'dreadnought', -1)} aria-label="방어자 드레드노트 수량 감소">-</button>
                    <span>{defenderFleet.dreadnought}</span>
                    <button type="button" onClick={() => updateUnit('defender', 'dreadnought', 1)} aria-label="방어자 드레드노트 수량 증가">+</button>
                  </div>
                </div>

                <div className="stepper-row">
                  <span>섹터 방어 시설 (Defense)</span>
                  <div className="counter">
                    <button type="button" onClick={() => setSectorDefense((v) => Math.max(0, v - 1))} aria-label="방어자 섹터 방어 시설 감소">-</button>
                    <span>{sectorDefense}</span>
                    <button type="button" onClick={() => setSectorDefense((v) => v + 1)} aria-label="방어자 섹터 방어 시설 증가">+</button>
                  </div>
                </div>

                <div className="stepper-row">
                  <span>성간 기지 (Starbase)</span>
                  <button
                    type="button"
                    className={`toggle-pill ${starbase ? 'active' : ''}`}
                    onClick={() => setStarbase((v) => !v)}
                    aria-label="성간 기지 배치 여부 토글"
                  >
                    {starbase ? '배치됨 (+1 흡수)' : '없음'}
                  </button>
                </div>

                <div className="stepper-row">
                  <span>기술 피해 흡수 (Absorption)</span>
                  <div className="counter">
                    <button type="button" onClick={() => setDefenderAbsorption((v) => Math.max(0, v - 1))} aria-label="방어자 기술 피해 흡수 감소">-</button>
                    <span>{defenderAbsorption}</span>
                    <button type="button" onClick={() => setDefenderAbsorption((v) => v + 1)} aria-label="방어자 기술 피해 흡수 증가">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Result Section */}
          <div className="results-section">
            <h4 className="section-title">전투 시뮬레이션 결과</h4>
            <CombatPhaseAnimator result={combatResult} />
          </div>
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
          max-width: 600px;
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
          align-items: center;
          justify-content: space-between;
          background: var(--bg-secondary);
        }

        .header-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-icon {
          font-size: 1.5rem;
        }

        .drawer-title {
          font-size: var(--text-md);
          font-weight: 700;
          color: var(--text-primary);
        }

        .drawer-subtitle {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.1rem;
          cursor: pointer;
        }

        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .inputs-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
        }

        @media (min-width: 540px) {
          .inputs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .side-card {
          padding: 1rem;
          border-radius: var(--radius-lg);
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .side-title {
          font-size: var(--text-sm);
          font-weight: 700;
        }

        .unit-stepper-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .stepper-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        .counter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 0.2rem 0.5rem;
        }

        .counter button {
          background: transparent;
          border: none;
          color: var(--color-accent);
          font-weight: 700;
          cursor: pointer;
          width: 18px;
        }

        .toggle-pill {
          padding: 0.25rem 0.6rem;
          font-size: var(--text-xs);
          border-radius: var(--radius-full);
          background: var(--bg-surface);
          color: var(--text-muted);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
        }

        .toggle-pill.active {
          background: var(--accent-bg);
          color: var(--color-accent);
          border-color: var(--accent-border);
        }

        .section-title {
          font-size: var(--text-md);
          font-weight: 700;
          margin-bottom: 0.85rem;
        }
      `}</style>
    </div>
  );
}
