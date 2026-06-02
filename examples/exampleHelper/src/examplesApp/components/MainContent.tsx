import React, {useEffect, useRef} from 'react';
import {useExamplesStore, STORAGE_KEY} from '../store/useExamplesStore';
import ExampleGrid from './ExampleGrid';
import ViewControls from './ViewControls';

const MainContent: React.FC = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const sidebarOpen = useExamplesStore(state => state.sidebarOpen);
    const setSidebarOpen = useExamplesStore(state => state.setSidebarOpen);
    const isNarrow = useExamplesStore(state => state.isNarrow);
    const searchQuery = useExamplesStore(state => state.searchQuery);
    const scrollPosition = useExamplesStore(state => state.scrollPosition);
    const setScrollPosition = useExamplesStore(state => state.setScrollPosition);
    const saveState = useExamplesStore(state => state.saveState);

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const isInitialMount = useRef(true);
// [KO] 스크롤 위치 복원
// [EN] Restore scroll position
useEffect(() => {
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }

    // [KO] 약간의 지연을 주어 레이아웃이 완료된 후 스크롤 이동
    // [EN] Apply scroll with a small delay to ensure layout completion
    const timer = setTimeout(() => {
        if (scrollAreaRef.current && scrollPosition > 0) {
            scrollAreaRef.current.scrollTop = scrollPosition;
        }
    }, 50);

    return () => clearTimeout(timer);
}, []);

// [KO] 탭이나 검색어가 변경될 때 스크롤을 상단으로 이동
// [EN] Reset scroll to top when tab or search query changes
useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = 0;
        setScrollPosition(0);

        // [KO] 세션 스토리지 즉시 업데이트
        // [EN] Update session storage immediately
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                parsed.scrollPosition = 0;
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            } catch (e) {}
        }
    }
}, [activeTab, searchQuery]);

const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newPos = e.currentTarget.scrollTop;

    // [KO] 매 스크롤마다 스토어와 세션 스토리지 업데이트
    // [EN] Update store and session storage on every scroll
    setScrollPosition(newPos);

    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            parsed.scrollPosition = newPos;
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        } catch (e) {}
    }
};

    return (
        <main style={mainStyle}>
            <div style={{...topBar, padding: isNarrow ? '0 10px' : '0 20px'}}>
                {!isNarrow && !searchQuery && (
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)} 
                        style={toggleSidebarButton}
                        title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                        aria-label={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                    >
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                )}
                <div style={{...pathStyle, fontSize: isNarrow ? '12px' : '13px'}}>
                    {searchQuery ? (
                        <span>Global Search</span>
                    ) : (
                        <>
                            <span style={{opacity: 0.5}}>Examples /</span> {activeTab}
                        </>
                    )}
                </div>
                <ViewControls />
            </div>
            
            <div 
                ref={scrollAreaRef}
                onScroll={handleScroll}
                style={{
                    ...scrollArea, 
                    padding: isNarrow ? '20px 15px 100px 15px' : '40px 40px 100px 40px'
                }}
            >
                <ExampleGrid />
            </div>
        </main>
    );
};

const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    // backgroundColor: '#000',
};

const topBar: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    padding: '0 20px',
    borderBottom: '1px solid #222',
    backgroundColor: '#0a0a0b',
};

const toggleSidebarButton: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fdb48d',
    cursor: 'pointer',
    padding: '5px 10px',
    marginRight: '10px',
    fontSize: '12px',
};

const pathStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#eee',
    flex: 1,
};

const scrollArea: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '40px 40px 100px 40px',
};

export default MainContent;
