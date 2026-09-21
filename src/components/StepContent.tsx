'use client';

import React, { useState } from 'react';
import { Step } from '@/types/tutorial';

interface StepContentProps {
  step: Step;
  onOpenGlossaryTerm: (termKey: string, position: { x: number; y: number }) => void;
}

export function StepContent({ step, onOpenGlossaryTerm }: StepContentProps) {
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);

  const getCalloutIcon = (type: string) => {
    switch (type) {
      case 'tip':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'important':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
      case 'example':
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        );
    }
  };

  return (
    <article className="step-article animate-fade-in" key={step.id}>
      <header className="step-article-header">
        <span className="chapter-badge">{step.layerTitle}</span>
        <h2 className="step-main-title">{step.title}</h2>
        {step.titleEn && <span className="step-main-title-en">{step.titleEn}</span>}
      </header>

      <div className="step-body">
        {/* Paragraphs */}
        {step.textBlocks.map((blockHtml, idx) => (
          <div
            key={idx}
            className="text-block"
            dangerouslySetInnerHTML={{
              __html: blockHtml.replace(
                /\{\{glossary:([a-zA-Z0-9_\-]+)\|([^}]+)\}\}/g,
                `<span class="glossary-term" data-term-key="$1">$2</span>`
              ),
            }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.classList.contains('glossary-term')) {
                const key = target.getAttribute('data-term-key');
                if (key) {
                  const rect = target.getBoundingClientRect();
                  onOpenGlossaryTerm(key, {
                    x: rect.left + rect.width / 2,
                    y: rect.bottom,
                  });
                }
              }
            }}
          />
        ))}

        {/* Diagram Process Cards */}
        {step.diagram && (
          <div className="diagram-container glass-panel">
            <h3 className="diagram-title">{step.diagram.title}</h3>
            <div className="diagram-flow">
              {step.diagram.nodes.map((node, nIdx) => (
                <div key={node.id} className="diagram-node">
                  <div className="node-badge-col">
                    <span className="node-step-tag">{node.step}</span>
                    {nIdx < step.diagram!.nodes.length - 1 && <div className="flow-line" />}
                  </div>
                  <div className="node-card">
                    <h4 className="node-title">{node.title}</h4>
                    <p className="node-desc">{node.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Callouts */}
        {step.callouts &&
          step.callouts.map((co, idx) => (
            <aside key={idx} className={`callout callout-${co.type}`}>
              <div className="callout-icon-wrap">{getCalloutIcon(co.type)}</div>
              <div
                className="callout-text"
                dangerouslySetInnerHTML={{
                  __html: co.content.replace(
                    /\{\{glossary:([a-zA-Z0-9_\-]+)\|([^}]+)\}\}/g,
                    `<span class="glossary-term" data-term-key="$1">$2</span>`
                  ),
                }}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.classList.contains('glossary-term')) {
                    const key = target.getAttribute('data-term-key');
                    if (key) {
                      const rect = target.getBoundingClientRect();
                      onOpenGlossaryTerm(key, {
                        x: rect.left + rect.width / 2,
                        y: rect.bottom,
                      });
                    }
                  }
                }}
              />
            </aside>
          ))}

        {/* Hints */}
        {step.hints &&
          step.hints.map((hint, idx) => (
            <details key={idx} className="hint-details">
              <summary className="hint-summary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
                </svg>
                <span>{hint.summary}</span>
              </summary>
              <div
                className="hint-content"
                dangerouslySetInnerHTML={{
                  __html: hint.content.replace(
                    /\{\{glossary:([a-zA-Z0-9_\-]+)\|([^}]+)\}\}/g,
                    `<span class="glossary-term" data-term-key="$1">$2</span>`
                  ),
                }}
              />
            </details>
          ))}

        {/* Quiz / Knowledge Check */}
        {step.quiz && (
          <div className="quiz-box glass-panel">
            <div className="quiz-header">
              <span className="quiz-label">핵심 체크 퀴즈</span>
              <h3 className="quiz-question">{step.quiz.question}</h3>
            </div>
            <div className="quiz-options">
              {step.quiz.options.map((opt) => {
                const isSelected = selectedQuizOption === opt.value;
                const isCorrect = step.quiz?.correctAnswer ? opt.value === step.quiz.correctAnswer : false;
                let optClass = 'quiz-option-btn';

                if (selectedQuizOption) {
                  if (isSelected) {
                    optClass += isCorrect ? ' correct' : ' wrong';
                  } else if (isCorrect) {
                    optClass += ' correct-reveal';
                  }
                }

                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={optClass}
                    onClick={() => setSelectedQuizOption(opt.value)}
                  >
                    <span className="opt-indicator">{opt.label || opt.value.toUpperCase()}</span>
                    <span className="opt-text">{opt.text}</span>
                    {selectedQuizOption && isCorrect && <span className="answer-mark">✓</span>}
                    {selectedQuizOption && isSelected && !isCorrect && <span className="answer-mark">✗</span>}
                  </button>
                );
              })}
            </div>
            {selectedQuizOption && (
              <div
                className={`quiz-feedback animate-fade-in ${
                  step.quiz.correctAnswer && selectedQuizOption === step.quiz.correctAnswer
                    ? 'feedback-correct'
                    : 'feedback-wrong'
                }`}
              >
                <div className="feedback-status">
                  {step.quiz.correctAnswer && selectedQuizOption === step.quiz.correctAnswer
                    ? '🎉 정답입니다!'
                    : '💡 다시 확인해 보세요!'}
                </div>
                <p className="feedback-explanation">
                  {step.quiz.explanation || '답변을 확인했습니다. 계속해서 다음 단계로 진행해 보세요!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .step-article {
          max-width: 740px;
          margin: 0 auto;
          padding: 1.5rem 1.25rem 3.5rem;
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        .step-article-header {
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border-default);
          padding-bottom: 1.25rem;
        }

        .chapter-badge {
          display: inline-block;
          font-size: var(--text-xs);
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-accent);
          background: var(--accent-bg-subtle);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--accent-border);
          margin-bottom: 0.75rem;
        }

        .step-main-title {
          font-size: clamp(1.4rem, 4vw, 1.85rem);
          font-weight: 800;
          color: var(--text-primary);
          line-height: var(--leading-tight);
          margin-bottom: 0.4rem;
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        .step-main-title-en {
          font-size: var(--text-xs);
          color: var(--text-muted);
          display: block;
        }

        .step-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .text-block {
          font-size: var(--text-md);
          line-height: var(--leading-relaxed);
          color: var(--text-primary);
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        .text-block :global(p) {
          margin-bottom: 1.15rem;
          line-height: var(--leading-relaxed);
        }

        .text-block :global(p:last-child) {
          margin-bottom: 0;
        }

        .text-block :global(strong) {
          color: var(--text-primary);
          font-weight: 700;
        }

        /* Diagram Component */
        .diagram-container {
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          border: 1px solid var(--border-emphasis);
          background: var(--bg-secondary);
        }

        .diagram-title {
          font-size: var(--text-md);
          font-weight: 700;
          color: var(--color-accent);
          margin-bottom: 1.25rem;
          text-align: center;
        }

        .diagram-flow {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .diagram-node {
          display: flex;
          gap: 1.25rem;
          align-items: stretch;
          position: relative;
        }

        .node-badge-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 54px;
          flex-shrink: 0;
        }

        .node-step-tag {
          font-size: var(--text-xs);
          font-weight: 800;
          color: var(--color-accent);
          background: var(--bg-surface);
          border: 1px solid var(--accent-border);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          white-space: nowrap;
          z-index: 2;
        }

        .flow-line {
          width: 2px;
          flex: 1;
          background: var(--border-emphasis);
          margin: 0.35rem 0;
        }

        .node-card {
          flex: 1;
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 0.9rem 1.15rem;
          margin-bottom: 1rem;
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        .node-title {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }

        .node-desc {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          line-height: var(--leading-normal);
        }

        /* Callouts */
        .callout {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.1rem 1.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        .callout-icon-wrap {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
        }

        .callout-tip {
          background: var(--accent-bg-subtle);
          border-color: var(--accent-border);
        }
        .callout-tip .callout-icon-wrap {
          background: var(--accent-bg);
          color: var(--color-accent);
        }

        .callout-warning {
          background: rgba(245, 158, 11, 0.08);
          border-color: rgba(245, 158, 11, 0.3);
        }
        .callout-warning .callout-icon-wrap {
          background: rgba(245, 158, 11, 0.15);
          color: var(--color-warning);
        }

        .callout-important {
          background: rgba(244, 63, 94, 0.08);
          border-color: rgba(244, 63, 94, 0.3);
        }
        .callout-important .callout-icon-wrap {
          background: rgba(244, 63, 94, 0.15);
          color: var(--color-incorrect);
        }

        .callout-text {
          flex: 1;
          font-size: var(--text-sm);
          line-height: var(--leading-relaxed);
          color: var(--text-secondary);
          min-width: 0;
        }

        /* Hints */
        .hint-details {
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          overflow: hidden;
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        .hint-summary {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 1.15rem;
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          user-select: none;
        }

        .hint-summary:hover {
          color: var(--text-primary);
          background: var(--surface-hover);
        }

        .hint-content {
          padding: 0.85rem 1.15rem 1.15rem;
          border-top: 1px solid var(--border-subtle);
          font-size: var(--text-sm);
          line-height: var(--leading-relaxed);
          color: var(--text-secondary);
        }

        /* Quiz */
        .quiz-box {
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          border: 1px solid var(--accent-border-strong);
          background: var(--bg-secondary);
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        .quiz-label {
          font-size: var(--text-xs);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-accent);
          margin-bottom: 0.5rem;
          display: block;
        }

        .quiz-question {
          font-size: var(--text-md);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
          line-height: var(--leading-snug);
        }

        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .quiz-option-btn {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          padding: 0.85rem 1.15rem;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          text-align: left;
          color: var(--text-primary);
          font-size: var(--text-sm);
          transition: all var(--transition-fast);
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        .quiz-option-btn:hover {
          background: var(--bg-surface-hover);
          border-color: var(--border-emphasis);
          transform: translateX(2px);
        }

        .opt-indicator {
          font-weight: 800;
          font-size: var(--text-xs);
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          background: var(--surface-active);
          color: var(--text-secondary);
          flex-shrink: 0;
        }

        .opt-text {
          flex: 1;
          min-width: 0;
          line-height: var(--leading-normal);
        }

        .quiz-option-btn.correct {
          background: rgba(16, 185, 129, 0.15);
          border-color: var(--color-correct);
          color: var(--color-correct);
          font-weight: 600;
        }
        .quiz-option-btn.correct .opt-indicator {
          background: var(--color-correct);
          color: #050810;
        }

        .quiz-option-btn.wrong {
          background: rgba(244, 63, 94, 0.15);
          border-color: var(--color-incorrect);
          color: var(--color-incorrect);
        }
        .quiz-option-btn.wrong .opt-indicator {
          background: var(--color-incorrect);
          color: #fff;
        }

        .quiz-option-btn.correct-reveal {
          border-color: var(--color-correct);
          background: rgba(16, 185, 129, 0.08);
        }

        .answer-mark {
          font-weight: 800;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .quiz-feedback {
          margin-top: 1.25rem;
          padding: 1.1rem 1.25rem;
          border-radius: var(--radius-md);
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        .feedback-correct {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #ecfdf5;
        }

        .feedback-wrong {
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.35);
          color: #fffbeb;
        }

        .feedback-status {
          font-weight: 800;
          font-size: var(--text-sm);
          margin-bottom: 0.35rem;
        }

        .feedback-explanation {
          font-size: var(--text-xs);
          line-height: var(--leading-normal);
          opacity: 0.9;
        }
      `}</style>
    </article>
  );
}
