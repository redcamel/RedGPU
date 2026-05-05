import React from 'react';
import {useInspectorStore} from '../../store';
import {THEME} from './Theme';

export interface TabItem {
    id: string;
    label: string;
}

/**
 * [KO] 인스펙터의 탭 메뉴와 컨텐츠 영역을 포함하는 컨테이너 컴포넌트입니다.
 */
const Tabs: React.FC<{ tabs: TabItem[], children: React.ReactNode }> = ({tabs, children}) => {
    const {currentTab, setCurrentTab} = useInspectorStore();

    return (
        <div style={tabsContainerStyle}>
            <div style={tabBarStyle}>
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        onClick={() => setCurrentTab(tab.id)}
                        style={{
                            ...tabItemStyle,
                            borderBottom: currentTab === tab.id ? `2px solid ${THEME.colors.primary}` : '2px solid transparent',
                            color: currentTab === tab.id ? THEME.colors.primary : THEME.colors.label,
                            backgroundColor: currentTab === tab.id ? THEME.colors.activeBg : 'transparent'
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

const tabsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
};

const tabBarStyle: React.CSSProperties = {
    display: 'flex',
    background: THEME.colors.background,
    borderTop: `1px solid ${THEME.colors.border}`,
    borderBottom: `1px solid ${THEME.colors.border}`
};

const tabItemStyle: React.CSSProperties = {
    padding: '8px 4px',
    fontSize: THEME.fontSize.small,
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flex: 1,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    fontFamily: THEME.fontFamily
};

const contentAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    background: 'rgba(0,0,0,0.2)'
};
export default Tabs;