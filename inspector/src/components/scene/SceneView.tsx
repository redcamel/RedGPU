import React, {useState} from 'react';
import {useInspectorStore} from '../../store';
import Section from '../common/Section';
import {TabBar, TabItem} from '../common/Tabs';
import HierarchyItem from './HierarchyItem';
import SceneInfoView from './SceneInfoView';
import View3D from "@redgpu/src/display/view/View3D";

/**
 * [KO] Scene의 정보와 계층 구조를 통합하여 표시하는 컴포넌트입니다.
 * [EN] Component that displays integrated Scene information and hierarchy.
 */
const SceneView = () => {
    const {hierarchy, redGPUContext, lastUpdateTime} = useInspectorStore();
    const viewNames = Object.keys(hierarchy);
    const [activeViewName, setActiveViewName] = useState(viewNames[0] || '');

    if (viewNames.length === 0 || !redGPUContext) {
        return <div style={placeholderStyle}>No scene data available.</div>;
    }

    const tabs: TabItem[] = viewNames.map(name => ({id: name, label: name}));

    // Find the actual View3D instance for the active view name
    const activeViewInstance = (redGPUContext.viewList as View3D[]).find((v, idx) => {
        const name = v.name || `View ${idx}`;
        return name === (activeViewName || viewNames[0]);
    });

    const activeHierarchy = hierarchy[activeViewName || viewNames[0]];

    return (
        <div style={containerStyle}>
            {viewNames.length > 1 && (
                <div style={tabWrapperStyle}>
                    <TabBar
                        tabs={tabs}
                        activeTab={activeViewName || viewNames[0]}
                        onTabChange={setActiveViewName}
                        isSticky={false}
                    />
                </div>
            )}
            <div style={contentStyle}>
                {activeViewInstance?.scene && (
                    <SceneInfoView scene={activeViewInstance.scene}/>
                )}

                {activeHierarchy && (
                    <Section title="Scene Tree">
                        <HierarchyItem node={activeHierarchy}/>
                    </Section>
                )}
            </div>
        </div>
    );
};

// Styles
const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
};

const tabWrapperStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)'
};

const contentStyle: React.CSSProperties = {
    padding: '12px',
};

const placeholderStyle: React.CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '12px',
    fontStyle: 'italic'
};

export default SceneView;
