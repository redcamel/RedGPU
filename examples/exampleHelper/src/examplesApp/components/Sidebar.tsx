import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import {ExampleList} from '../../data/exampleList';
import {ExampleItem} from '../../types/example';

const Sidebar: React.FC = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const sidebarOpen = useExamplesStore(state => state.sidebarOpen);

    const categories = ExampleList.map(cat => cat.name);
    // ... rest of tree rendering logic unchanged ...
    const renderTree = (items: ExampleItem[], depth: number = 0) => {
        return items.map((item, idx) => {
            if (item.list) {
                return (
                    <div key={item.name + idx} style={{marginLeft: depth * 12}}>
                        <div style={groupTitleStyle}>{item.name}</div>
                        {renderTree(item.list, depth + 1)}
                    </div>
                );
            }
            return (
                <div
                    key={item.name + idx}
                    style={{
                        ...itemStyle,
                        marginLeft: depth * 12,
                    }}
                    onClick={() => {
                        if (item.path) {
                            window.location.href = `/RedGPU/examples/${item.path}/index.html`;
                        }
                    }}
                >
                    {item.name}
                </div>
            );
        });
    };

    const currentCategory = ExampleList.find(cat => cat.name === activeTab);

    return (
        <aside style={{
            ...sidebarStyle,
            width: sidebarOpen ? '280px' : '0',
            opacity: sidebarOpen ? 1 : 0,
        }}>
            <div style={treeContainerStyle}>
                {currentCategory?.list && renderTree(currentCategory.list)}
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

const groupTitleStyle: React.CSSProperties = {
    fontSize: '10px',
    color: '#555',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: '15px',
    marginBottom: '8px',
    letterSpacing: '0.05em',
};

const itemStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#ccc',
    padding: '6px 0',
    cursor: 'pointer',
    transition: 'color 0.2s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

export default Sidebar;
