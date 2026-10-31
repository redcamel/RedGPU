import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import {ExampleList} from '../../data/exampleList';
import SidebarTree from './sidebar/SidebarTree';

const Sidebar: React.FC = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const sidebarOpen = useExamplesStore(state => state.sidebarOpen);

    const currentCategory = ExampleList.find(cat => cat.name === activeTab);

    return (
        <aside style={{
            ...sidebarStyle,
            margin: sidebarOpen ? '12px 0 42px 20px' : '12px 0 42px 0',
            border: sidebarOpen ? '1px solid rgba(255, 255, 255, 0.1)' : '0',
            boxShadow: sidebarOpen ? '0 8px 24px rgba(0, 0, 0, 0.4)' : 'none',
            width: sidebarOpen ? '272px' : '0',
            opacity: sidebarOpen ? 1 : 0,
        }}>
            <div style={treeContainerStyle}>
                {currentCategory?.list && <SidebarTree items={currentCategory.list} />}
            </div>
        </aside>
    );
};

const sidebarStyle: React.CSSProperties = {
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

const treeContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 16px 32px 18px',
    minHeight: 0,
};

export default Sidebar;
