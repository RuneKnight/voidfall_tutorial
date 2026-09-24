'use client';

import { useSyncExternalStore } from 'react';
import tutorialData from '@/data/tutorial.json';
import { Layer, Step } from '@/types/tutorial';
import { ChapterStatus } from '@/types/companion';

const PROGRESS_STORAGE_KEY = 'voidfall_tutorial_progress';

export interface ProgressData {
  currentStepIndex: number;
  completedSteps: number[];
  lastAccessedAt: number;
}

const DEFAULT_PROGRESS: ProgressData = {
  currentStepIndex: 0,
  completedSteps: [],
  lastAccessedAt: 0,
};

function getSnapshot(): string {
  if (typeof window === 'undefined') return JSON.stringify(DEFAULT_PROGRESS);
  return localStorage.getItem(PROGRESS_STORAGE_KEY) || JSON.stringify(DEFAULT_PROGRESS);
}

function getServerSnapshot(): string {
  return JSON.stringify(DEFAULT_PROGRESS);
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function useTutorialProgress(totalSteps: number = 58) {
  const storeString = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const steps = tutorialData.steps as unknown as Step[];
  const layers = tutorialData.layers as unknown as Layer[];

  let progress: ProgressData = DEFAULT_PROGRESS;
  try {
    progress = JSON.parse(storeString);
  } catch (e) {
    console.warn('Failed to parse tutorial progress:', e);
  }

  const saveProgress = (newProgress: ProgressData) => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(newProgress));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.warn('Failed to save tutorial progress to localStorage:', e);
    }
  };

  const goToStep = (index: number) => {
    if (index < 0 || index >= totalSteps) return;
    const completed = new Set(progress.completedSteps || []);
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

  const currentStep = steps[progress.currentStepIndex || 0] || steps[0];
  const currentLayer = layers[currentStep.layerIndex] || layers[0];
  const stepInChapter = (progress.currentStepIndex || 0) - currentLayer.stepStartIndex + 1;

  const getChapterStatus = (layer: Layer): ChapterStatus => {
    let completedInChapter = 0;
    for (let i = layer.stepStartIndex; i <= layer.stepEndIndex; i++) {
      if ((progress.completedSteps || []).includes(i)) {
        completedInChapter++;
      }
    }
    if (completedInChapter === layer.stepCount) return 'COMPLETED';
    if (completedInChapter > 0 || ((progress.currentStepIndex || 0) >= layer.stepStartIndex && (progress.currentStepIndex || 0) <= layer.stepEndIndex)) {
      return 'IN_PROGRESS';
    }
    return 'NOT_STARTED';
  };

  return {
    currentStepIndex: progress.currentStepIndex || 0,
    completedSteps: progress.completedSteps || [],
    currentStep,
    currentLayer,
    stepInChapter,
    isLoaded: true,
    goToStep,
    nextStep,
    prevStep,
    resetProgress,
    getChapterStatus,
    completionPercentage: Math.round(((progress.completedSteps || []).length / totalSteps) * 100),
  };
}
