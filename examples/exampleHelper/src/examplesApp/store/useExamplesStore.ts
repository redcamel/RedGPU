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
    isNarrow: boolean; // [KO] 모바일/협소 화면 여부 [EN] Narrow viewport flag

    setActiveTab: (tab: string) => void;
    setSearchQuery: (query: string) => void;
    setViewMode: (mode: ViewMode) => void;
    setLanguage: (lang: Language) => void;
    setSidebarOpen: (open: boolean) => void;
    setScrollPosition: (pos: number) => void;
    setIsNarrow: (isNarrow: boolean) => void;
    
    // [KO] 세션 스토리지에서 상태 복원
    // [EN] Restore state from session storage
    restoreState: () => void;
    // [KO] 세션 스토리지에 상태 저장
    // [EN] Save state to session storage
    saveState: () => void;
}

export const STORAGE_KEY = 'redgpu_examples_app_state';

export const useExamplesStore = create<ExamplesState>((set, get) => ({
    activeTab: '3D',
    searchQuery: '',
    viewMode: 'grid',
    language: (typeof navigator !== 'undefined' && navigator.language.startsWith('ko')) ? 'ko' : 'en',
    sidebarOpen: typeof window !== 'undefined' ? window.innerWidth > 1024 : true,
    scrollPosition: 0,
    isNarrow: typeof window !== 'undefined' ? window.innerWidth <= 768 : false,

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
    setIsNarrow: (isNarrow) => set({isNarrow}),

    saveState: () => {
        const {activeTab, searchQuery, viewMode, language, scrollPosition} = get();
        const stateToSave = {activeTab, searchQuery, viewMode, language, scrollPosition};
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));

        // [KO] URL 쿼리 파라미터 업데이트 (스크롤 위치는 제외)
        // [EN] Update URL query parameters (excluding scroll position)
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

        // [KO] 2. 세션 스토리지에서 복원 (URL 파라미터가 없거나 스크롤 위치 등 추가 정보 복원을 위해)
        // [EN] 2. Restore from session storage (even if URL params exist, for scroll position and other info)
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                
                // URL 파라미터가 있었다면 그것을 우선시하되, 나머지는 저장된 값 사용
                set((state) => ({
                    ...parsed,
                    activeTab: tabParam || parsed.activeTab || state.activeTab,
                    searchQuery: qParam || parsed.searchQuery || state.searchQuery,
                    scrollPosition: Number(parsed.scrollPosition) || 0,
                }));
            } catch (e) {
                console.error('Failed to restore examples state:', e);
            }
        }
    }
}));

// [KO] 스토어 생성 즉시 상태 복원 시도
// [EN] Attempt to restore state immediately after store creation
useExamplesStore.getState().restoreState();
