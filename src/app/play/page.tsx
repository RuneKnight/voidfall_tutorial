'use client';

import React, { useState } from 'react';
import tutorialData from '@/data/tutorial.json';
import glossaryData from '@/data/glossary.json';
import { useTutorialProgress } from '@/hooks/useTutorialProgress';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { StepContent } from '@/components/StepContent';
import { StepNavigation } from '@/components/StepNavigation';
import { GlossaryPopover } from '@/components/GlossaryPopover';
import { GlossaryModal } from '@/components/GlossaryModal';
import { OverviewModal } from '@/components/OverviewModal';
import { Step, Layer, GlossaryTerm } from '@/types/tutorial';

export default function PlayPage() {
  const steps = tutorialData.steps as unknown as Step[];
  const layers = tutorialData.layers as unknown as Layer[];
  const glossary = glossaryData as unknown as Record<string, GlossaryTerm>;

  const { theme, toggleTheme } = useTheme();
  const {
    currentStepIndex,
    completedSteps,
    isLoaded,
    goToStep,
    nextStep,
    prevStep,
  } = useTutorialProgress(steps.length);

  // Modals state
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [modalActiveTermKey, setModalActiveTermKey] = useState<string | null>(null);

  // Popover state
  const [popoverTerm, setPopoverTerm] = useState<GlossaryTerm | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);

  const currentStep = steps[currentStepIndex] || steps[0];
  const currentLayer = layers[currentStep.layerIndex] || layers[0];

  const handleOpenGlossaryTerm = (termKey: string, pos: { x: number; y: number }) => {
    const term = glossary[termKey];
    if (term) {
      setPopoverTerm(term);
      setPopoverPos(pos);
    } else {
      // If term key doesn't match directly, open glossary modal with that query
      setModalActiveTermKey(termKey);
      setIsGlossaryOpen(true);
    }
  };

  const handleSelectRelatedTerm = (termId: string) => {
    const nextTerm = glossary[termId];
    if (nextTerm) {
      setPopoverTerm(nextTerm);
    }
  };

  if (!isLoaded) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>보이드폴 튜토리얼을 불러오는 중...</p>
        <style jsx>{`
          .loading-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 1rem;
            color: var(--text-secondary);
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border-default);
            border-top-color: var(--color-accent);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="player-layout">
      {/* 1. Header */}
      <Header
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        currentLayerTitle={currentLayer.title}
        timeLeft={currentStep.timeLeft}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenOverview={() => setIsOverviewOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
      />

      {/* 2. Progress Bar */}
      <ProgressBar
        layers={layers}
        currentStepIndex={currentStepIndex}
        completedSteps={completedSteps}
        onSelectStep={goToStep}
      />

      {/* 3. Main Scrollable Content */}
      <main className="player-main" id="main-content">
        <StepContent
          step={currentStep}
          onOpenGlossaryTerm={handleOpenGlossaryTerm}
        />
      </main>

      {/* 4. Sticky Bottom Navigation */}
      <StepNavigation
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        currentLayerTitle={currentLayer.title}
        onPrev={prevStep}
        onNext={nextStep}
      />

      {/* 5. Floating Glossary Popover */}
      <GlossaryPopover
        term={popoverTerm}
        position={popoverPos}
        onClose={() => {
          setPopoverTerm(null);
          setPopoverPos(null);
        }}
        onSelectTerm={handleSelectRelatedTerm}
      />

      {/* 6. Overview Modal */}
      <OverviewModal
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        layers={layers}
        currentStepIndex={currentStepIndex}
        completedSteps={completedSteps}
        onSelectStep={goToStep}
      />

      {/* 7. Full Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => {
          setIsGlossaryOpen(false);
          setModalActiveTermKey(null);
        }}
        glossary={glossary}
        activeTermKey={modalActiveTermKey}
        onSelectTerm={(key) => setModalActiveTermKey(key)}
      />

      <style jsx>{`
        .player-layout {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          width: 100vw;
          overflow: hidden;
          background: var(--bg-primary);
        }

        .player-main {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          scroll-behavior: smooth;
          position: relative;
        }
      `}</style>
    </div>
  );
}
