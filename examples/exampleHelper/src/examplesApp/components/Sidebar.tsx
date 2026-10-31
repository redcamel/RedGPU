import React, {useState} from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import {ExampleList} from '../../data/exampleList';
import {ChevronLeft, ChevronRight} from '../../common/components/Icons';
import SidebarTree from './sidebar/SidebarTree';

const Sidebar: React.FC = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const sidebarOpen = useExamplesStore(state => state.sidebarOpen);
    const setSidebarOpen = useExamplesStore(state => state.setSidebarOpen);
    const isNarrow = useExamplesStore(state => state.isNarrow);
    const searchQuery = useExamplesStore(state => state.searchQuery);
    const [isToggleHovered, setIsToggleHovered] = useState(false);

    const currentCategory = ExampleList.find(cat => cat.name === activeTab);

    return (
        <>
            {!isNarrow && !searchQuery && !sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    onMouseEnter={() => setIsToggleHovered(true)}
                    onMouseLeave={() => setIsToggleHovered(false)}
                    style={{
                        ...collapsedToggleButtonStyle,
                        backgroundColor: isToggleHovered ? 'rgba(32, 32, 36, 0.92)' : 'rgba(18, 18, 20, 0.82)',
                    }}
                    title="Show Sidebar"
                    aria-label="Show Sidebar"
                >
                    <ChevronRight color="#fdb48d" size={15}/>
                </button>
            )}
            <aside style={{
                ...sidebarStyle,
                margin: sidebarOpen ? '12px 0 42px 20px' : '12px 0 42px 0',
                borderRight: sidebarOpen ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                width: sidebarOpen ? '272px' : '0',
                opacity: sidebarOpen ? 1 : 0,
            }}>
                {!isNarrow && !searchQuery && sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(false)}
                        onMouseEnter={() => setIsToggleHovered(true)}
                        onMouseLeave={() => setIsToggleHovered(false)}
                        style={{
                            ...openToggleButtonStyle,
                            backgroundColor: isToggleHovered ? 'rgba(36, 36, 40, 0.95)' : 'rgba(18, 18, 20, 0.85)',
                            borderColor: isToggleHovered ? 'rgba(253, 180, 141, 0.45)' : 'rgba(255, 255, 255, 0.16)',
                        }}
                        title="Hide Sidebar"
                        aria-label="Hide Sidebar"
                    >
                        <ChevronLeft color="#fdb48d" size={16}/>
                    </button>
                )}
                <div style={treeContainerStyle}>
                    {currentCategory?.list && <SidebarTree items={currentCategory.list}/>}
                </div>
            </aside>
        </>
    );
};

const sidebarStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s, margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    flexShrink: 0,
    minHeight: 0,
};

const openToggleButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '11px',
    right: '12px',
    zIndex: 10,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.16)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.45)',
    color: '#fdb48d',
    cursor: 'pointer',
    padding: 0,
    transition: 'all 0.18s ease',
    boxSizing: 'border-box',
};

const collapsedToggleButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    left: 0,
    zIndex: 20,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '36px',
    borderRadius: '0 10px 10px 0',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderLeft: 'none',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    color: '#fdb48d',
    cursor: 'pointer',
    padding: 0,
    transition: 'background-color 0.18s',
    boxSizing: 'border-box',
};

const treeContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '17px 14px 32px 2px',
    minHeight: 0,
};

export default Sidebar;
