import React, {useEffect, useRef} from 'react';
import {STORAGE_KEY, useExamplesStore} from '../store/useExamplesStore';
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
    useExamplesStore(state => state.saveState);

    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        const timer = setTimeout(() => {
            if (scrollAreaRef.current && scrollPosition > 0) {
                scrollAreaRef.current.scrollTop = scrollPosition;
            }
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = 0;
            setScrollPosition(0);
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    parsed.scrollPosition = 0;
                    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
                } catch (e) {
                }
            }
        }
    }, [activeTab, searchQuery]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const newPos = e.currentTarget.scrollTop;
        setScrollPosition(newPos);
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                parsed.scrollPosition = newPos;
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            } catch (e) {
            }
        }
    };

    return (
        <main style={mainStyle}>
            <div style={{
                ...topBar,
                margin: isNarrow
                    ? '10px 10px 0 10px'
                    : (sidebarOpen && !searchQuery ? '12px 20px 0 12px' : '12px 20px 0 20px'),
                padding: isNarrow ? '0 14px' : '0 18px',
            }}>
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
                            <span style={{opacity: 0.45, fontWeight: 500}}>Examples /</span>{' '}
                            <span style={{color: '#fdb48d'}}>{activeTab}</span>
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
                    padding: isNarrow ? '20px 15px 100px 15px' : '28px 36px 100px 36px'
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
    height: '44px',
    padding: '0 18px',
    backgroundColor: 'transparent',
    flexShrink: 0,
};

const toggleSidebarButton: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '9999px',
    backgroundColor: 'rgba(14, 14, 18, 0.68)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#fdb48d',
    cursor: 'pointer',
    marginRight: '12px',
    fontSize: '10px',
    transition: 'background-color 0.18s',
};

const pathStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#f8f9fa',
    letterSpacing: '-0.01em',
    textShadow: '0 1px 4px rgba(0, 0, 0, 0.65)',
    flex: 1,
};

const scrollArea: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '36px 40px 100px 40px',
};

export default MainContent;
