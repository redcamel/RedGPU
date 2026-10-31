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
    const setIsCompact = useExamplesStore(state => state.setIsCompact);
    const setHideManual = useExamplesStore(state => state.setHideManual);
    const setHideFooterLang = useExamplesStore(state => state.setHideFooterLang);
    const setSidebarOpen = useExamplesStore(state => state.setSidebarOpen);

    // [KO] SEO: 활성 탭이나 검색어에 따라 문서 제목 업데이트
    // [EN] SEO: Update document title based on active tab or search query
    useEffect(() => {
        const baseTitle = 'RedGPU Examples';
        const metaDesc = document.querySelector('meta[name="description"]');
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        const twitterDesc = document.querySelector('meta[property="twitter:description"]');
        
        let titleText = '';
        let descText = '';

        if (searchQuery) {
            titleText = `${baseTitle} - Search: ${searchQuery}`;
            descText = `Search results for "${searchQuery}" in RedGPU WebGPU examples.`;
        } else {
            titleText = `${baseTitle} - ${activeTab}`;
            descText = `Explore ${activeTab} examples in RedGPU - High-performance WebGPU library.`;
        }

        document.title = titleText;
        if (metaDesc) metaDesc.setAttribute('content', descText);
        if (ogTitle) ogTitle.setAttribute('content', titleText);
        if (ogDesc) ogDesc.setAttribute('content', descText);
        if (twitterTitle) twitterTitle.setAttribute('content', titleText);
        if (twitterDesc) twitterDesc.setAttribute('content', descText);

    }, [activeTab, searchQuery]);

    useEffect(() => {
        // [KO] 뷰포트 크기 변화 관리
        // [EN] Manage viewport resize events
        const handleResize = () => {
            const width = window.innerWidth;
            const narrow = width <= 1024;
            const compact = width <= 640;
            const hideManual = width <= 1260;
            const hideFooterLang = width <= 420;
            
            setIsNarrow(narrow);
            setIsCompact(compact);
            setHideManual(hideManual);
            setHideFooterLang(hideFooterLang);

            // [KO] 비PC(<= 1024px)에서는 사이드바를 닫고, PC(> 1024px)에서는 열어줌
            // [EN] Close sidebar on non-PC, open on PC
            if (narrow) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // [KO] 초기 체크 [EN] Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, [restoreState, setIsNarrow, setIsCompact, setHideManual, setHideFooterLang, setSidebarOpen]);
};
