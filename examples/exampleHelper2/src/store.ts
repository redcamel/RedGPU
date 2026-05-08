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
    setRedGPUContext: (value: RedGPUContext) => void;
    setCurrentExample: (value: ExampleItem | null) => void;
    setLanguage: (value: 'ko' | 'en') => void;
}

/**
 * [KO] ExampleHelper2의 전역 상태 스토어
 */
export const useExampleHelperStore = create<ExampleHelperState>((set) => ({
    redGPUContext: null,
    currentExample: null,
    language: navigator.language.startsWith('ko') ? 'ko' : 'en',
    setRedGPUContext: (value) => set({redGPUContext: value}),
    setCurrentExample: (value) => set({currentExample: value}),
    setLanguage: (value) => set({language: value}),
}));
