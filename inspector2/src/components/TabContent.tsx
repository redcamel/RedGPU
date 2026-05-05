import React from 'react';
import { useInspectorStore } from '../store';
import TotalState from './TotalState';
import RedGPUContextView from './RedGPUContextView';

/**
 * [KO] 현재 선택된 탭에 해당하는 컨텐츠를 렌더링하는 컴포넌트입니다.
 * [EN] Component that renders content corresponding to the currently selected tab.
 */
const TabContent = () => {
    const currentTab = useInspectorStore(state => state.currentTab);

    switch (currentTab) {
        case 'STATE':
            return <TotalState />;
        case 'CONTEXT':
            return <RedGPUContextView />;
        case 'VIEWS':
            return <div style={placeholderStyle}>ViewList Inspector (Coming Soon)</div>;
        case 'RESOURCES':
            return <div style={placeholderStyle}>Resources Inspector (Coming Soon)</div>;
        default:
            return null;
    }
};

const placeholderStyle: React.CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '12px',
    fontStyle: 'italic'
};

export default TabContent;
