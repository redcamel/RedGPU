import {useEffect} from 'react';
import {useExamplesStore} from '../store/useExamplesStore';

/**
 * [KO] 애플리케이션 초기화 및 뷰포트 크기 변화를 관리하는 훅입니다.
 * [EN] Hook that manages application initialization and viewport resize events.
 */
export const useAppInitialization = () => {
    const restoreState = useExamplesStore(state => state.restoreState);
    const setIsNarrow = useExamplesStore(state => state.setIsNarrow);
    const setSidebarOpen = useExamplesStore(state => state.setSidebarOpen);

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