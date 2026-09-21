'use client';

import { useState } from 'react';

const PROGRESS_STORAGE_KEY = 'voidfall_tutorial_progress';

export interface ProgressData {
  currentStepIndex: number;
  completedSteps: number[];
  lastAccessedAt: number;
}

const DEFAULT_PROGRESS: ProgressData = {
  currentStepIndex: 0,
  completedSteps: [],
  lastAccessedAt: Date.now(),
};

export function useTutorialProgress(totalSteps: number = 58) {
  const [progress, setProgress] = useState<ProgressData>(() => {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to read tutorial progress from localStorage:', e);
    }
    return DEFAULT_PROGRESS;
  });

  const saveProgress = (newProgress: ProgressData) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(newProgress));
    } catch (e) {
      console.warn('Failed to save tutorial progress to localStorage:', e);
    }
  };

  const goToStep = (index: number) => {
    if (index < 0 || index >= totalSteps) return;
    const completed = new Set(progress.completedSteps);
    if (progress.currentStepIndex < index) {
      completed.add(progress.currentStepIndex);
    }
    saveProgress({
      ...progress,
      currentStepIndex: index,
      completedSteps: Array.from(completed),
      lastAccessedAt: Date.now(),
    });
  };

  const nextStep = () => {
    goToStep(progress.currentStepIndex + 1);
  };

  const prevStep = () => {
    goToStep(progress.currentStepIndex - 1);
  };

  const resetProgress = () => {
    saveProgress(DEFAULT_PROGRESS);
  };

  return {
    currentStepIndex: progress.currentStepIndex,
    completedSteps: progress.completedSteps,
    isLoaded: true,
    goToStep,
    nextStep,
    prevStep,
    resetProgress,
    completionPercentage: Math.round((progress.completedSteps.length / totalSteps) * 100),
  };
}
