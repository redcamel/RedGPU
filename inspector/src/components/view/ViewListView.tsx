import React, {useState} from 'react';
import {useInspectorStore} from '../../store';
import View3D from "@redgpu/src/display/view/View3D";
import {TabBar, TabItem} from "../common/Tabs";
import ViewStateTab from "./ViewStateTab";
import ViewCommandsTab from "./ViewCommandsTab";
import ViewPostEffectsTab from "./ViewPostEffectsTab";

/**
 * [KO] 엔진의 모든 뷰(View3D)의 상태를 표시하는 컴포넌트입니다.
 * [EN] Component that displays the state of all views (View3D) in the engine.
 */
const ViewListView = () => {
    const {redGPUContext, lastUpdateTime} = useInspectorStore();
    const [activeViewIndex, setActiveViewIndex] = useState('0');
    const [activeDetailTab, setActiveDetailTab] = useState('STATE');

    if (!redGPUContext) {
        return <div style={placeholderStyle}>RedGPUContext not initialized</div>;
    }

    const {viewList} = redGPUContext;
    const activeView = viewList[parseInt(activeViewIndex)] || viewList[0];

    const viewTabs: TabItem[] = viewList.map((view: View3D, index: number) => ({
        id: index.toString(),
        label: view.name || `View ${index}`
    }));

    const detailTabs: TabItem[] = [
        {id: 'STATE', label: 'State'},
        {id: 'COMMANDS', label: 'Commands'},
        {id: 'POSTEFFECTS', label: 'PostEffects'}
    ];

    return (
        <div style={containerStyle}>
            <div style={stickyHeaderStyle}>
                {viewList.length > 1 && (
                    <TabBar
                        tabs={viewTabs}
                        activeTab={activeViewIndex}
                        onTabChange={setActiveViewIndex}
                        isSticky={false}
                    />
                )}
                <TabBar
                    tabs={detailTabs}
                    activeTab={activeDetailTab}
                    onTabChange={setActiveDetailTab}
                    isSticky={false}
                    style={{borderTop: 'none'}}
                />
            </div>

            <div style={contentAreaStyle}>
                {activeDetailTab === 'STATE' && <ViewStateTab view={activeView} lastUpdateTime={lastUpdateTime}/>}
                {activeDetailTab === 'COMMANDS' && <ViewCommandsTab view={activeView}/>}
                {activeDetailTab === 'POSTEFFECTS' && <ViewPostEffectsTab view={activeView}/>}
            </div>
        </div>
    );
};

// Styles
const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
};

const stickyHeaderStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: '#111'
};

const contentAreaStyle: React.CSSProperties = {
    padding: '12px'
};

const placeholderStyle: React.CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '12px',
    fontStyle: 'italic'
};

export default ViewListView;
