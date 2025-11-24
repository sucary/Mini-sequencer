import { create } from 'zustand';

export interface StepData {
  note: string | null;
  active: boolean;
}

interface SequencerState {
  isPlaying: boolean;
  isMetronomeOn: boolean;
  bpm: number;
  currentStep: number;
  selectedStep: number | null;
  sequence: StepData[];
  sectionCount: number; // 1 to 4
  totalSteps: number; // sectionCount * 16
  
  // Actions
  togglePlay: () => void;
  pausePlay: () => void;
  stopPlay: () => void;
  toggleMetronome: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setBpm: (bpm: number) => void;
  setCurrentStep: (step: number) => void;
  setSelectedStep: (step: number | null) => void;
  setStepNote: (stepIndex: number, note: string) => void;
  clearStep: (stepIndex: number) => void;
  clearAllSteps: () => void;
  setSectionCount: (count: number) => void;
}

const MAX_SECTIONS = 4;
const STEPS_PER_SECTION = 16;
const MAX_STEPS = MAX_SECTIONS * STEPS_PER_SECTION;

const INITIAL_SEQUENCE: StepData[] = Array(MAX_STEPS).fill(null).map(() => ({
  note: null,
  active: false,
}));

export const useSequencerStore = create<SequencerState>((set) => ({
  isPlaying: false,
  isMetronomeOn: false,
  bpm: 120,
  currentStep: -1, // -1 indicates stopped/not playing
  selectedStep: null,
  sequence: INITIAL_SEQUENCE,
  sectionCount: 1,
  totalSteps: 16,

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  pausePlay: () => set({ isPlaying: false }),
  stopPlay: () => set({ isPlaying: false, currentStep: -1, selectedStep: null }),
  toggleMetronome: () => set((state) => ({ isMetronomeOn: !state.isMetronomeOn })),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setBpm: (bpm) => set({ bpm }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setSelectedStep: (selectedStep) => set({ selectedStep }),
  
  setStepNote: (stepIndex, note) => set((state) => {
    const newSequence = [...state.sequence];
    newSequence[stepIndex] = { note, active: true };
    return { sequence: newSequence };
  }),
  
  clearStep: (stepIndex) => set((state) => {
    const newSequence = [...state.sequence];
    newSequence[stepIndex] = { note: null, active: false };
    return { sequence: newSequence };
  }),

  clearAllSteps: () => set((state) => {
    const newSequence = state.sequence.map(() => ({ note: null, active: false }));
    return { sequence: newSequence };
  }),

  setSectionCount: (count) => set(() => {
    const newCount = Math.max(1, Math.min(4, count));
    return {
      sectionCount: newCount,
      totalSteps: newCount * 16
    };
  }),
}));