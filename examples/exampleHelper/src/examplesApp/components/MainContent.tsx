import React, {useEffect, useRef} from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import CategoryNav from './CategoryNav';
import ExampleGrid from './ExampleGrid';

const MainContent: React.FC = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const sidebarOpen = useExamplesStore(state => state.sidebarOpen);
    const isNarrow = useExamplesStore(state => state.isNarrow);
    const isCompact = useExamplesStore(state => state.isCompact);
    const searchQuery = useExamplesStore(state => state.searchQuery);
    const scrollPosition = useExamplesStore(state => state.scrollPosition);
    const setScrollPosition = useExamplesStore(state => state.setScrollPosition);

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
        }
    }, [activeTab, searchQuery]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollPosition(e.currentTarget.scrollTop);
    };

    return (
        <main style={mainStyle}>
            {isCompact && !searchQuery && (
                <div style={{
                    ...topBar,
                    margin: '10px 16px 10px 16px',
                }}>
                    <div style={leftGroupStyle}>
                        <CategoryNav/>
                    </div>
                </div>
            )}

            <div
                ref={scrollAreaRef}
                onScroll={handleScroll}
                style={{
                    ...scrollArea,
                    marginTop: isNarrow ? ((isCompact && !searchQuery) ? '0' : '10px') : '12px',
                    padding: isNarrow
                        ? '8px 10px 24px 16px'
                        : (searchQuery ? '8px 14px 32px 20px' : (sidebarOpen ? '8px 14px 32px 16px' : '8px 14px 32px 36px'))
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
    minWidth: 0,
};

const topBar: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    height: '46px',
    padding: 0,
    backgroundColor: 'transparent',
    flexShrink: 0,
};

const leftGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: 0,
    flex: 1,
};

const scrollArea: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
};

export default MainContent;
