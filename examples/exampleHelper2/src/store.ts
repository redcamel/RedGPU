import {create} from 'zustand';
import React from 'react';
import RedGPUContext from "@redgpu/src/context/RedGPUContext";
import {ExampleItem} from './types/example';

export interface LoadingInfo {
    url?: string;
    model?: { loaded: number; total: number };
    buffers?: { loaded: number; total: number };
    textures?: { loaded: number; total: number };
}

/**
 * [KO] TopBar의 우측 액션 버튼 정의 인터페이스
 */
export interface TopBarAction {
    id: string;
    label: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    onClick: () => void;
}

/**
 * [KO] GUI 설정 정의 인터페이스
 */
export interface CompareLabelConfig {
    title: string;
    normalTitle?: string;
    targetContainer?: HTMLElement;
}

export interface GuiConfig {
    RedGPU?: any;
    redGPUContext?: boolean;
    viewList?: boolean;
    scene?: boolean;
    ibl?: boolean;
    skybox?: boolean;
    compareLabel?: CompareLabelConfig;
    guiCallback?: (gui: any) => void;
}

/**
 * [KO] ExampleHelper2의 상태 정의 인터페이스
 */
export interface ExampleHelperState {
    RedGPU: any;
    redGPUContext: RedGPUContext | null;
    currentExample: ExampleItem | null;
    language: 'ko' | 'en';
    showSourceModal: boolean;
    showSettingsPanel: boolean;
    topBarRightActions: TopBarAction[];
    guiConfig: GuiConfig | null;
    isNarrow: boolean;
    loadingStates: Record<string, LoadingInfo>;
    setRedGPU: (value: any) => void;
    setRedGPUContext: (value: RedGPUContext | null) => void;
    setCurrentExample: (value: ExampleItem | null) => void;
    setLanguage: (value: 'ko' | 'en') => void;
    setShowSourceModal: (value: boolean) => void;
    setShowSettingsPanel: (value: boolean) => void;
    addTopBarRightAction: (action: TopBarAction) => void;
    removeTopBarRightAction: (id: string) => void;
    clearTopBarRightActions: () => void;
    setGuiConfig: (config: GuiConfig | null) => void;
    setIsNarrow: (value: boolean) => void;
    updateLoadingState: (info: LoadingInfo) => void;
    clearLoadingStates: () => void;
}

/**
 * [KO] ExampleHelper2의 전역 상태 스토어
 */
export const useExampleHelperStore = create<ExampleHelperState>((set) => ({
    RedGPU: null,
    redGPUContext: null,
    currentExample: null,
    language: (typeof navigator !== 'undefined' && navigator.language.startsWith('ko')) ? 'ko' : 'en',
    showSourceModal: false,
    showSettingsPanel: false,
    topBarRightActions: [],
    guiConfig: null,
    isNarrow: typeof window !== 'undefined' ? window.innerWidth <= 768 : false,
    loadingStates: {},
    setRedGPU: (value: any) => set({RedGPU: value}),
    setRedGPUContext: (value: RedGPUContext | null) => set({redGPUContext: value}),
    setCurrentExample: (value: ExampleItem | null) => set({currentExample: value}),
    setLanguage: (value: 'ko' | 'en') => set({language: value}),
    setShowSourceModal: (value: boolean) => set({showSourceModal: value}),
    setShowSettingsPanel: (value: boolean) => set({showSettingsPanel: value}),
    addTopBarRightAction: (action) => set((state) => {
        const filtered = state.topBarRightActions.filter(a => a.id !== action.id);
        return {topBarRightActions: [...filtered, action]};
    }),
    removeTopBarRightAction: (id) => set((state) => ({
        topBarRightActions: state.topBarRightActions.filter(a => a.id !== id)
    })),
    clearTopBarRightActions: () => set({topBarRightActions: []}),
    setGuiConfig: (config: GuiConfig | null) => {
        const hasPanels = !!(
            config?.redGPUContext ||
            config?.viewList ||
            config?.scene ||
            config?.ibl ||
            config?.skybox ||
            config?.guiCallback
        );
        set({guiConfig: config, showSettingsPanel: hasPanels});
    },
    setIsNarrow: (value: boolean) => set({isNarrow: value}),
    updateLoadingState: (info: LoadingInfo) => set((state) => {
        const key = info.url || 'default';
        return { loadingStates: { ...state.loadingStates, [key]: info } };
    }),
    clearLoadingStates: () => set({ loadingStates: {} })
}));
