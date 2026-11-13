import {create} from 'zustand';
import React from 'react';
import RedGPUContext from "@redgpu/src/context/RedGPUContext";
import {ExampleItem} from './types/example';

export interface LoadingInfo {
    url?: string;
    model?: {
        loaded: number;
        total: number;
        lengthComputable?: boolean;
        percent?: number;
        transferred?: string;
        totalSize?: string;
    };
    buffers?: {
        loaded: number;
        total: number;
        percent?: number;
    };
    textures?: {
        loaded: number;
        total: number;
        percent?: number;
    };
}

const cloneLoadingInfo = (info: LoadingInfo): LoadingInfo => ({
    url: info.url,
    model: info.model ? {...info.model} : undefined,
    buffers: info.buffers ? {...info.buffers} : undefined,
    textures: info.textures ? {...info.textures} : undefined,
});

let pendingLoadingBatch: Record<string, LoadingInfo> = {};
let loadingBatchRafId: number | null = null;

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

export interface TopBarConfig {
    toneMapping?: boolean;
    antialiasing?: boolean;
    bloom?: boolean;
    ssao?: boolean;
}

export interface GuiConfig {
    RedGPU?: any;
    redGPUContext?: boolean;
    viewList?: boolean;
    scene?: boolean;
    directionalShadow?: boolean;
    ibl?: boolean;
    skybox?: boolean;
    globalWind?: boolean | { expanded?: boolean };
    compareLabel?: CompareLabelConfig;
    topBar?: TopBarConfig;
    gui?: (gui: any) => void;
}

export const hasGuiPanels = (config: GuiConfig | null) => !!(
    config?.redGPUContext ||
    config?.viewList ||
    config?.scene ||
    config?.directionalShadow ||
    config?.ibl ||
    config?.skybox ||
    config?.globalWind ||
    config?.gui
);

/**
 * [KO] ExampleHelper2의 상태 정의 인터페이스
 */
export interface ExampleHelperState {
    RedGPU: any;
    redGPUContext: RedGPUContext | null;
    currentExample: ExampleItem | null;
    language: 'ko' | 'en';
    showSourceModal: boolean;
    isSourceModalMaximized: boolean;
    showSettingsPanel: boolean;
    showCompareLabel: boolean;
    topBarRightActions: TopBarAction[];
    guiConfig: GuiConfig | null;
    isNarrow: boolean;
    loadingStates: Record<string, LoadingInfo>;
    /**
     * [KO] 하단 설명(Description) 영역이 뷰포트 하단에서부터 차지하는 높이(px). 설명이 없으면 0
     * [EN] Height (px) occupied by the bottom Description area measured from the viewport bottom. 0 if none
     */
    descriptionOccupiedHeight: number;
    setRedGPU: (value: any) => void;
    setRedGPUContext: (value: RedGPUContext | null) => void;
    setCurrentExample: (value: ExampleItem | null) => void;
    setLanguage: (value: 'ko' | 'en') => void;
    setShowSourceModal: (value: boolean) => void;
    setIsSourceModalMaximized: (value: boolean) => void;
    setShowSettingsPanel: (value: boolean) => void;
    setShowCompareLabel: (value: boolean) => void;
    addTopBarRightAction: (action: TopBarAction) => void;
    setGuiConfig: (config: GuiConfig | null) => void;
    setIsNarrow: (value: boolean) => void;
    setDescriptionOccupiedHeight: (value: number) => void;
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
    isSourceModalMaximized: false,
    showSettingsPanel: false,
    showCompareLabel: true,
    topBarRightActions: [],
    guiConfig: null,
    isNarrow: typeof window !== 'undefined' ? window.innerWidth <= 768 : false,
    loadingStates: {},
    descriptionOccupiedHeight: 0,
    setRedGPU: (value: any) => set({RedGPU: value}),
    setRedGPUContext: (value: RedGPUContext | null) => set({redGPUContext: value}),
    setCurrentExample: (value: ExampleItem | null) => set({currentExample: value}),
    setLanguage: (value: 'ko' | 'en') => set({language: value}),
    setShowSourceModal: (value: boolean) => set({showSourceModal: value}),
    setIsSourceModalMaximized: (value: boolean) => set({isSourceModalMaximized: value}),
    setShowSettingsPanel: (value: boolean) => set({showSettingsPanel: value}),
    setShowCompareLabel: (value: boolean) => set({showCompareLabel: value}),
    addTopBarRightAction: (action) => set((state) => {
        const filtered = state.topBarRightActions.filter(a => a.id !== action.id);
        return {topBarRightActions: [...filtered, action]};
    }),
    setGuiConfig: (config: GuiConfig | null) => {
        set({guiConfig: config, showSettingsPanel: hasGuiPanels(config), showCompareLabel: true});
    },
    setIsNarrow: (value: boolean) => set({isNarrow: value}),
    setDescriptionOccupiedHeight: (value: number) => set((state) => (
        state.descriptionOccupiedHeight === value ? state : {descriptionOccupiedHeight: value}
    )),
    updateLoadingState: (info: LoadingInfo) => {
        if (!info) return;
        const key = info.url || 'default';
        pendingLoadingBatch[key] = cloneLoadingInfo(info);

        if (typeof window === 'undefined') {
            const batch = pendingLoadingBatch;
            pendingLoadingBatch = {};
            set((state) => ({loadingStates: {...state.loadingStates, ...batch}}));
            return;
        }

        if (loadingBatchRafId === null) {
            loadingBatchRafId = window.requestAnimationFrame(() => {
                loadingBatchRafId = null;
                const batch = pendingLoadingBatch;
                pendingLoadingBatch = {};
                if (Object.keys(batch).length > 0) {
                    set((state) => ({
                        loadingStates: {...state.loadingStates, ...batch}
                    }));
                }
            });
        }
    },
    clearLoadingStates: () => {
        if (loadingBatchRafId !== null && typeof window !== 'undefined') {
            window.cancelAnimationFrame(loadingBatchRafId);
            loadingBatchRafId = null;
        }
        pendingLoadingBatch = {};
        set({loadingStates: {}});
    }
}));
