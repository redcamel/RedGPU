import {create} from 'zustand';
import RedGPUContext from "@redgpu/src/context/RedGPUContext";
import { ExampleItem } from './types/example';

/**
 * [KO] TopBar의 우측 액션 버튼 정의 인터페이스
 */
export interface TopBarAction {
    id: string;
    label: string;
    icon?: string;
    isActive?: boolean;
    onClick: () => void;
}

/**
 * [KO] ExampleHelper2의 상태 정의 인터페이스
 */
export interface ExampleHelperState {
    redGPUContext: RedGPUContext | null;
    currentExample: ExampleItem | null;
    language: 'ko' | 'en';
    showSourceModal: boolean;
    topBarRightActions: TopBarAction[];
    setRedGPUContext: (value: RedGPUContext | null) => void;
    setCurrentExample: (value: ExampleItem | null) => void;
    setLanguage: (value: 'ko' | 'en') => void;
    setShowSourceModal: (value: boolean) => void;
    addTopBarRightAction: (action: TopBarAction) => void;
    removeTopBarRightAction: (id: string) => void;
    clearTopBarRightActions: () => void;
}

/**
 * [KO] ExampleHelper2의 전역 상태 스토어
 */
export const useExampleHelperStore = create<ExampleHelperState>((set) => ({
    redGPUContext: null,
    currentExample: null,
    language: (typeof navigator !== 'undefined' && navigator.language.startsWith('ko')) ? 'ko' : 'en',
    showSourceModal: false,
    topBarRightActions: [],
    setRedGPUContext: (value: RedGPUContext | null) => set({ redGPUContext: value }),
    setCurrentExample: (value: ExampleItem | null) => set({ currentExample: value }),
    setLanguage: (value: 'ko' | 'en') => set({ language: value }),
    setShowSourceModal: (value: boolean) => set({ showSourceModal: value }),
    addTopBarRightAction: (action) => set((state) => {
        const filtered = state.topBarRightActions.filter(a => a.id !== action.id);
        return { topBarRightActions: [...filtered, action] };
    }),
    removeTopBarRightAction: (id) => set((state) => ({
        topBarRightActions: state.topBarRightActions.filter(a => a.id !== id)
    })),
    clearTopBarRightActions: () => set({ topBarRightActions: [] }),
}));
