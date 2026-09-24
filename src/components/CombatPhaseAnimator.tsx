'use client';

import React from 'react';
import { CombatResult } from '@/types/combat';

interface CombatPhaseAnimatorProps {
  result: CombatResult;
}

export function CombatPhaseAnimator({ result }: CombatPhaseAnimatorProps) {
  return (
    <div className="animator-container">
      {/* Winner Banner */}
      <div className={`winner-banner ${result.winner.toLowerCase()}`}>
        <span className="winner-icon">{result.isInvasionSuccessful ? '🚀' : '🛡️'}</span>
        <div className="winner-text">
          <h4 className="winner-title">
            {result.isInvasionSuccessful ? '침공 성공 (Invasion Successful)' : '방어 성공 (Sector Defended)'}
          </h4>
          <p className="winner-desc">
            {result.isInvasionSuccessful
              ? '침공자 함대가 방어군을 완전히 섬멸하고 섹터를 점령하였습니다.'
              : '방어군이 침공자의 공세를 격퇴하고 섹터를 수호하였습니다.'}
          </p>
        </div>
      </div>

      {/* Phase Logs Stepper */}
      <div className="phase-logs-list">
        {result.phaseLogs.map((log, index) => (
          <div key={index} className="phase-card">
            <div className="phase-header">
              <span className="phase-badge">Phase {index + 1}</span>
              <h4 className="phase-title">{log.title}</h4>
            </div>

            <p className="phase-note">{log.summaryNote}</p>

            <div className="phase-stats-grid">
              <div className="side-stat invader">
                <span className="stat-label">침공자 대미지</span>
                <span className="stat-value">{log.invaderRawDamage} (흡수 {log.invaderAbsorbed})</span>
                <span className="stat-net">순수 피해: {log.invaderNetDamage}</span>
              </div>

              <div className="side-stat defender">
                <span className="stat-label">방어자 대미지</span>
                <span className="stat-value">{log.defenderRawDamage} (흡수 {log.defenderAbsorbed})</span>
                <span className="stat-net">순수 피해: {log.defenderNetDamage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Remaining Units Summary */}
      <div className="final-units-card">
        <h4 className="final-title">최종 잔존 유닛 상태</h4>
        <div className="units-columns">
          <div className="unit-col">
            <span className="col-label invader">침공자 잔존 함대</span>
            <ul>
              <li>초계함: {result.finalInvaderUnits.corvette}대</li>
              <li>구축함: {result.finalInvaderUnits.destroyer}대</li>
              <li>드레드노트: {result.finalInvaderUnits.dreadnought}대</li>
              <li>순양함: {result.finalInvaderUnits.carrier}대</li>
            </ul>
          </div>

          <div className="unit-col">
            <span className="col-label defender">방어자 잔존 세력</span>
            <ul>
              <li>초계함: {result.finalDefenderUnits.corvette}대</li>
              <li>구축함: {result.finalDefenderUnits.destroyer}대</li>
              <li>드레드노트: {result.finalDefenderUnits.dreadnought}대</li>
              <li>순양함: {result.finalDefenderUnits.carrier}대</li>
              <li>섹터 방어 시설: {result.finalDefense.sectorDefense}개</li>
              <li>성간 기지: {result.finalDefense.starbase ? '생존' : '파괴'}</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animator-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .winner-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-default);
        }

        .winner-banner.invader {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .winner-banner.defender {
          background: rgba(59, 130, 246, 0.12);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .winner-icon {
          font-size: 2rem;
        }

        .winner-title {
          font-size: var(--text-md);
          font-weight: 800;
          color: var(--text-primary);
        }

        .winner-desc {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .phase-logs-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .phase-card {
          padding: 1rem;
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .phase-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .phase-badge {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-accent);
          background: var(--accent-bg);
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-sm);
        }

        .phase-title {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--text-primary);
        }

        .phase-note {
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        .phase-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-top: 0.35rem;
        }

        .side-stat {
          padding: 0.6rem 0.75rem;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          font-size: var(--text-xs);
        }

        .side-stat.invader {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .side-stat.defender {
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .stat-label {
          font-weight: 700;
          color: var(--text-muted);
        }

        .stat-value {
          color: var(--text-primary);
        }

        .stat-net {
          font-weight: 700;
          color: var(--color-accent);
        }

        .final-units-card {
          padding: 1rem;
          border-radius: var(--radius-lg);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
        }

        .final-title {
          font-size: var(--text-sm);
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .units-columns {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .unit-col {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: var(--text-xs);
        }

        .col-label {
          font-weight: 700;
        }

        .col-label.invader { color: #f87171; }
        .col-label.defender { color: #60a5fa; }

        .unit-col ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
