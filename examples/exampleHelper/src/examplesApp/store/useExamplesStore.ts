import {create} from 'zustand';

export type ViewMode = 'grid' | 'list';
export type Language = 'ko' | 'en';

export interface ExamplesState {
    activeTab: string;
    searchQuery: string;
    viewMode: ViewMode;
    language: Language;
    sidebarOpen: boolean;
    scrollPosition: number;

    setActiveTab: (tab: string) => void;
    setSearchQuery: (query: string) => void;
    setViewMode: (mode: ViewMode) => void;
    setLanguage: (lang: Language) => void;
    setSidebarOpen: (open: boolean) => void;
    setScrollPosition: (pos: number) => void;
    
    // [KO] 세션 스토리지에서 상태 복원
    // [EN] Restore state from session storage
    restoreState: () => void;
    // [KO] 세션 스토리지에 상태 저장
    // [EN] Save state to session storage
    saveState: () => void;
}

const STORAGE_KEY = 'redgpu_examples_app_state';

export const useExamplesStore = create<ExamplesState>((set, get) => ({
    activeTab: '3D',
    searchQuery: '',
    viewMode: 'grid',
    language: (typeof navigator !== 'undefined' && navigator.language.startsWith('ko')) ? 'ko' : 'en',
    sidebarOpen: true,
    scrollPosition: 0,

    setActiveTab: (activeTab) => {
        set({activeTab});
        get().saveState();
    },
    setSearchQuery: (searchQuery) => {
        set({searchQuery});
        get().saveState();
    },
    setViewMode: (viewMode) => {
        set({viewMode});
        get().saveState();
    },
    setLanguage: (language) => {
        set({language});
        get().saveState();
    },
    setSidebarOpen: (sidebarOpen) => set({sidebarOpen}),
    setScrollPosition: (scrollPosition) => set({scrollPosition}),

    saveState: () => {
        const {activeTab, searchQuery, viewMode, language} = get();
        const stateToSave = {activeTab, searchQuery, viewMode, language};
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));

        // [KO] URL 쿼리 파라미터 업데이트
        // [EN] Update URL query parameters
        const url = new URL(window.location.href);
        url.searchParams.set('tab', activeTab);
        if (searchQuery) url.searchParams.set('q', searchQuery);
        else url.searchParams.delete('q');
        window.history.replaceState({}, '', url.toString());
    },

    restoreState: () => {
        // [KO] 1. URL 파라미터에서 먼저 복원 시도
        // [EN] 1. Try to restore from URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        const qParam = urlParams.get('q');

        if (tabParam) set({activeTab: tabParam});
        if (qParam) set({searchQuery: qParam});

        if (tabParam || qParam) return;

        // [KO] 2. 없으면 세션 스토리지에서 복원
        // [EN] 2. If not, restore from session storage
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                set(parsed);
            } catch (e) {
                console.error('Failed to restore examples state:', e);
            }
        }
    }
}));
