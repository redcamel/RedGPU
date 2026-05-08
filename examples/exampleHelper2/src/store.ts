import {create} from 'zustand';
import RedGPUContext from "@redgpu/src/context/RedGPUContext";
import { ExampleItem } from './types/example';

/**
 * [KO] ExampleHelper2의 상태 정의 인터페이스
 */
export interface ExampleHelperState {
    redGPUContext: RedGPUContext | null;
    currentExample: ExampleItem | null;
    language: 'ko' | 'en';
    showSourceModal: boolean;
    setRedGPUContext: (value: RedGPUContext | null) => void;
    setCurrentExample: (value: ExampleItem | null) => void;
    setLanguage: (value: 'ko' | 'en') => void;
    setShowSourceModal: (value: boolean) => void;
}

/**
 * [KO] ExampleHelper2의 전역 상태 스토어
 */
export const useExampleHelperStore = create<ExampleHelperState>((set) => ({
    redGPUContext: null,
    currentExample: null,
    language: (typeof navigator !== 'undefined' && navigator.language.startsWith('ko')) ? 'ko' : 'en',
    showSourceModal: false,
    setRedGPUContext: (value: RedGPUContext | null) => set({ redGPUContext: value }),
    setCurrentExample: (value: ExampleItem | null) => set({ currentExample: value }),
    setLanguage: (value: 'ko' | 'en') => set({ language: value }),
    setShowSourceModal: (value: boolean) => set({ showSourceModal: value }),
}));
