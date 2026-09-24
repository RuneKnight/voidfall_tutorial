'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import tutorialData from '@/data/tutorial.json';
import glossaryData from '@/data/glossary.json';
import { useTutorialProgress } from '@/hooks/useTutorialProgress';
import { useTheme } from '@/hooks/useTheme';
import { useQuickSearch } from '@/hooks/useQuickSearch';
import { useWakeLock } from '@/hooks/useWakeLock';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { StepContent } from '@/components/StepContent';
import { StepNavigation } from '@/components/StepNavigation';
import { GlossaryPopover } from '@/components/GlossaryPopover';
import { GlossaryModal } from '@/components/GlossaryModal';
import { OverviewModal } from '@/components/OverviewModal';
import { QuickRefDrawer } from '@/components/QuickRefDrawer';
import { CombatSimulatorDrawer } from '@/components/CombatSimulatorDrawer';
import { Step, Layer, GlossaryTerm } from '@/types/tutorial';

function PlayContent() {
  const steps = tutorialData.steps as unknown as Step[];
  const layers = tutorialData.layers as unknown as Layer[];
  const glossary = glossaryData as unknown as Record<string, GlossaryTerm>;

  const searchParams = useSearchParams();
  const chParam = searchParams.get('ch');
  const stepParam = searchParams.get('step');

  const { theme, toggleTheme } = useTheme();
  const {
    currentStepIndex,
    completedSteps,
    isLoaded,
    goToStep,
    nextStep,
    prevStep,
  } = useTutorialProgress(steps.length);

  const { isOpen: isQuickSearchOpen, openSearch: openQuickSearch, closeSearch: closeQuickSearch } = useQuickSearch();
  const [isCombatSimOpen, setIsCombatSimOpen] = useState(false);
  const { isActive: isWakeLockActive, toggleWakeLock } = useWakeLock();

  // Synchronize route query parameters if provided
  useEffect(() => {
    if (!isLoaded) return;
    if (chParam) {
      const targetLayer = layers.find(
        (l) => l.id === chParam || `ch-${l.index + 1}` === chParam || `layer-${l.index + 1}` === chParam
      );
      if (targetLayer) {
        let stepIdx = targetLayer.stepStartIndex;
        if (stepParam) {
          const parsedStep = parseInt(stepParam, 10);
          if (!isNaN(parsedStep) && parsedStep >= 1) {
            stepIdx = Math.min(targetLayer.stepEndIndex, targetLayer.stepStartIndex + parsedStep - 1);
          }
        }
        if (stepIdx !== currentStepIndex) {
          goToStep(stepIdx);
        }
      }
    }
  }, [chParam, stepParam, isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

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
        onOpenQuickSearch={openQuickSearch}
        onOpenCombatSim={() => setIsCombatSimOpen(true)}
        wakeLockActive={isWakeLockActive}
        onToggleWakeLock={toggleWakeLock}
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

      {/* 8. Quick Reference Drawer (Ctrl+K) */}
      <QuickRefDrawer
        isOpen={isQuickSearchOpen}
        onClose={closeQuickSearch}
        onSelectTerm={(key) => {
          closeQuickSearch();
          setModalActiveTermKey(key);
          setIsGlossaryOpen(true);
        }}
      />

      {/* 9. Combat Simulator Drawer */}
      <CombatSimulatorDrawer
        isOpen={isCombatSimOpen}
        onClose={() => setIsCombatSimOpen(false)}
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

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
          <span>로딩 중...</span>
        </div>
      }
    >
      <PlayContent />
    </Suspense>
  );
}
