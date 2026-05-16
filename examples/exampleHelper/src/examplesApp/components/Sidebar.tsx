import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import {ExampleList} from '../../data/exampleList';
import {ExampleItem} from '../../types/example';

const Sidebar: React.FC = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const setActiveTab = useExamplesStore(state => state.setActiveTab);
    const sidebarOpen = useExamplesStore(state => state.sidebarOpen);

    const categories = ExampleList.map(cat => cat.name);

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
            <div style={tabContainerStyle}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        style={{
                            ...tabButtonStyle,
                            color: activeTab === cat ? '#fdb48d' : '#888',
                            borderBottom: activeTab === cat ? '2px solid #fdb48d' : 'none',
                        }}
                        onClick={() => setActiveTab(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

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
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s',
    overflow: 'hidden',
    flexShrink: 0,
    height: '100%',
    minHeight: 0, // [KO] 부모 높이 안에서만 줄어들도록 강제 [EN] Force shrink within parent height
};

const tabContainerStyle: React.CSSProperties = {
    display: 'flex',
    overflowX: 'auto',
    backgroundColor: '#111112',
    borderBottom: '1px solid #222',
    flexShrink: 0, // [KO] 탭 영역 높이 고정 [EN] Fix tab area height
};

const tabButtonStyle: React.CSSProperties = {
    flex: 1,
    minWidth: '70px',
    height: '40px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'color 0.2s',
    flexShrink: 0,
};

const treeContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 15px 100px 15px', // [KO] 하단 푸터에 가려지지 않게 여백 추가 [EN] Add padding to avoid overlap with footer
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
