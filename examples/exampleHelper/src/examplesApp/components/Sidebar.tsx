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
            borderRight: sidebarOpen ? '1px solid #333' : '0',
            width: sidebarOpen ? '280px' : '0',
            opacity: sidebarOpen ? 1 : 0,
        }}>
            <div style={treeContainerStyle}>
                {currentCategory?.list && <SidebarTree items={currentCategory.list} />}
            </div>
        </aside>
    );
};

const sidebarStyle: React.CSSProperties = {
    backgroundColor: '#0a0a0b',
    borderRight: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width(0.3s cubic-bezier(0.4, 0, 0.2, 1)), opacity 0.2s',
    overflow: 'hidden',
    flexShrink: 0,
    height: '100%',
    minHeight: 0,
};

const treeContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 15px 100px 15px',
    minHeight: 0,
};

export default Sidebar;
