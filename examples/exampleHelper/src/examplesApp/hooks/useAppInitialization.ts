import {useEffect} from 'react';
import {useExamplesStore} from '../store/useExamplesStore';

/**
 * [KO] 애플리케이션 초기화 및 뷰포트 크기 변화를 관리하는 훅입니다.
 * [EN] Hook that manages application initialization and viewport resize events.
 */
export const useAppInitialization = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const searchQuery = useExamplesStore(state => state.searchQuery);
    const restoreState = useExamplesStore(state => state.restoreState);
    const setIsNarrow = useExamplesStore(state => state.setIsNarrow);
    const setSidebarOpen = useExamplesStore(state => state.setSidebarOpen);

    // [KO] SEO: 활성 탭이나 검색어에 따라 문서 제목 업데이트
    // [EN] SEO: Update document title based on active tab or search query
    useEffect(() => {
        const baseTitle = 'RedGPU Examples';
        const metaDesc = document.querySelector('meta[name="description"]');
        
        if (searchQuery) {
            document.title = `${baseTitle} - Search: ${searchQuery}`;
            if (metaDesc) {
                metaDesc.setAttribute('content', `Search results for "${searchQuery}" in RedGPU WebGPU examples.`);
            }
        } else {
            document.title = `${baseTitle} - ${activeTab}`;
            if (metaDesc) {
                metaDesc.setAttribute('content', `Explore ${activeTab} examples in RedGPU - High-performance WebGPU library.`);
            }
        }
    }, [activeTab, searchQuery]);

    useEffect(() => {
        // [KO] 세션 스토리지/URL에서 상태 복원
        // [EN] Restore state from session storage or URL
        restoreState();

        const handleResize = () => {
            const width = window.innerWidth;
            const narrow = width <= 768;
            
            setIsNarrow(narrow);
            
            // [KO] 모바일에서는 사이드바를 자동으로 닫고, 넓은 화면에서는 열림 상태를 고려
            // [EN] Automatically close sidebar on mobile, consider open state on wide screens
            if (narrow) {
                setSidebarOpen(false);
            } else if (width > 1024) {
                // [KO] 충분히 넓은 화면으로 돌아오면 사이드바를 다시 열어줌 (선택사항)
                // [EN] Re-open sidebar when returning to a sufficiently wide screen (optional)
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // [KO] 초기 체크 [EN] Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, [restoreState, setIsNarrow, setSidebarOpen]);
};