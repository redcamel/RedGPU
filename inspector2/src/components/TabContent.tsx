import React from 'react';
import { useInspectorStore } from '../store';
import TotalState from './TotalState';
import RedGPUContextView from './RedGPUContextView';
import CommandBatchStatsView from './CommandBatchStatsView';

/**
 * [KO] 현재 선택된 탭에 해당하는 컨텐츠를 렌더링하는 컴포넌트입니다.
 * [EN] Component that renders content corresponding to the currently selected tab.
 */
const TabContent = () => {
    const currentTab = useInspectorStore(state => state.currentTab);

    switch (currentTab) {
        case 'STATE':
            return (
                <Container>
                    <TotalState />
                    <CommandBatchStatsView />
                </Container>
            );
        case 'CONTEXT':
            return <Container><RedGPUContextView /></Container>;
        case 'VIEWS':
            return <Container style={placeholderStyle}>ViewList Inspector (Coming Soon)</Container>;
        case 'RESOURCES':
            return <Container style={placeholderStyle}>Resources Inspector (Coming Soon)</Container>;
        default:
            return null;
    }
};
const Container = ({ children,style }: { children: React.ReactNode,style?:React.CSSProperties }) => (
    <div style={{ padding: '12px',...style }}>{children}</div>
);
const placeholderStyle: React.CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '12px',
    fontStyle: 'italic'
};

export default TabContent;
