'use client';

import React from 'react';
import { Layer } from '@/types/tutorial';

interface ProgressBarProps {
  layers: Layer[];
  currentStepIndex: number;
  completedSteps: number[];
  onSelectStep: (stepIndex: number) => void;
}

export function ProgressBar({
  layers,
  currentStepIndex,
  completedSteps,
  onSelectStep,
}: ProgressBarProps) {
  return (
    <div className="progress-container" role="progressbar" aria-label="튜토리얼 진행도">
      {layers.map((layer) => {
        const isCurrentLayer =
          currentStepIndex >= layer.stepStartIndex && currentStepIndex <= layer.stepEndIndex;

        // Calculate segment fill percentage
        let filledStepsInLayer = 0;
        for (let i = layer.stepStartIndex; i <= layer.stepEndIndex; i++) {
          if (completedSteps.includes(i) || i <= currentStepIndex) {
            filledStepsInLayer++;
          }
        }
        const fillPercent = Math.min(
          100,
          Math.round((filledStepsInLayer / layer.stepCount) * 100)
        );

        return (
          <div
            key={layer.id}
            className={`progress-segment ${isCurrentLayer ? 'current' : ''} ${
              fillPercent === 100 ? 'complete' : ''
            }`}
            title={`${layer.title} (${filledStepsInLayer}/${layer.stepCount} 단계)`}
            onClick={() => onSelectStep(layer.stepStartIndex)}
          >
            <div
              className="progress-fill"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        );
      })}

      <style jsx>{`
        .progress-container {
          display: flex;
          height: 5px;
          background: var(--bg-surface);
          gap: 2px;
          width: 100%;
          cursor: pointer;
          user-select: none;
        }

        .progress-segment {
          position: relative;
          flex: 1;
          background: var(--bg-surface);
          overflow: hidden;
          transition: background-color var(--transition-fast);
        }

        .progress-segment:hover {
          background: var(--bg-surface-hover);
        }

        .progress-fill {
          height: 100%;
          background: var(--color-accent);
          transition: width var(--transition-normal);
        }

        .progress-segment.current .progress-fill {
          box-shadow: 0 0 8px var(--accent-glow);
          background: linear-gradient(90deg, var(--color-accent), #a78bfa);
        }

        .progress-segment.complete .progress-fill {
          background: var(--color-correct);
        }
      `}</style>
    </div>
  );
}
