import React from 'react';
import {useInspectorStore} from '../store';
import TotalState from './state/TotalState';
import RedGPUContextView from './context/RedGPUContextView';
import CommandBatchStatsView from './state/CommandBatchStatsView';
import ResourcesView from "./resource/ResourcesView";
import ViewListView from "./view/ViewListView";

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
                    <TotalState/>
                    <CommandBatchStatsView/>
                </Container>
            );
        case 'CONTEXT':
            return (
                <Container>
                    <RedGPUContextView/>
                </Container>
            );
        case 'VIEWS':
            return <ViewListView/>;
        case 'RESOURCES':
            return (
                <Container>
                    <ResourcesView/>
                </Container>
            );
        default:
            return null;
    }
};

/**
 * [KO] 탭 컨텐츠를 감싸는 컨테이너 컴포넌트입니다.
 * [EN] Container component that wraps tab content.
 */
const Container = ({children, style}: { children: React.ReactNode, style?: React.CSSProperties }) => (
    <div style={{...containerStyle, ...style}}>{children}</div>
);

// Styles
const containerStyle: React.CSSProperties = {
    padding: '12px'
};

export default TabContent;
