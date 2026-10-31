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
                border: sidebarOpen ? '1px solid rgba(255, 255, 255, 0.1)' : '0',
                boxShadow: sidebarOpen ? '0 8px 24px rgba(0, 0, 0, 0.4)' : 'none',
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
                            backgroundColor: isToggleHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                        }}
                        title="Hide Sidebar"
                        aria-label="Hide Sidebar"
                    >
                        <ChevronLeft color="#fdb48d" size={15}/>
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
    backgroundColor: 'rgba(18, 18, 20, 0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '18px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s, margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    flexShrink: 0,
    minHeight: 0,
};

const openToggleButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 10,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fdb48d',
    cursor: 'pointer',
    padding: 0,
    transition: 'background-color 0.18s',
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
    padding: '16px 16px 32px 18px',
    minHeight: 0,
};

export default Sidebar;
