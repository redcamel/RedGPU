import React from 'react';
import { useInspectorStore } from '../store';

interface TabsProps {
    children: React.ReactNode;
}

/**
 * [KO] 인스펙터의 탭 메뉴와 컨텐츠 영역을 포함하는 컨테이너 컴포넌트입니다.
 * [EN] Container component that includes the inspector's tab menu and content area.
 */
const Tabs: React.FC<TabsProps> = ({ children }) => {
    const { currentTab, setCurrentTab } = useInspectorStore();

    const tabs = [
        { id: 'STATE', label: 'State' },
        { id: 'CONTEXT', label: 'RedGPUContext' },
        { id: 'VIEWS', label: 'ViewList' },
        { id: 'RESOURCES', label: 'Resources' }
    ];

    return (
        <div style={containerStyle}>
            <div style={tabBarStyle}>
                {tabs.map(tab => (
                    <div 
                        key={tab.id}
                        onClick={() => setCurrentTab(tab.id)}
                        style={{
                            ...tabItemStyle,
                            borderBottom: currentTab === tab.id ? '2px solid #fdb48d' : '2px solid transparent',
                            color: currentTab === tab.id ? '#fdb48d' : '#888',
                            backgroundColor: currentTab === tab.id ? 'rgba(253, 180, 141, 0.1)' : 'transparent'
                        }}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            <div style={contentAreaStyle}>
                {children}
            </div>
        </div>
    );
};

// Styles
const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
};

const tabBarStyle: React.CSSProperties = {
    display: 'flex',
    background: '#111',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const tabItemStyle: React.CSSProperties = {
    padding: '8px 4px',
    fontSize: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flex: 1,
    textAlign: 'center',
    whiteSpace: 'nowrap'
};

const contentAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    background: 'rgba(0,0,0,0.2)'
};

export default Tabs;
