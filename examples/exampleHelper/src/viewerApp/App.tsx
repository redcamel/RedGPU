import React from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../store';
import Footer from '../common/components/Footer';
import ExampleHeader from './components/ExampleHeader';
import Description from './components/Description';
import SourceModal from './components/SourceModal';
import {useViewportSync} from './hooks/useViewportSync';
import {useInspectorInit} from './hooks/useInspectorInit';
import {useTopBarActions} from './hooks/useTopBarActions';
import GuiCompareLabelHelper from "./gui/GuiCompareLabelHelper";
import LoadingUI from './components/LoadingUI';
import RenderingSettingsGroup from './components/RenderingSettingsGroup';
import Title from './components/Title';

const LazyGuiPanel = React.lazy(() => import('./gui/GuiPanel'));

/**
 * [KO] 예제 헬퍼의 메인 애플리케이션 컴포넌트입니다.
 * [EN] Main application component of the example helper.
 */
const App = () => {
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);
    const showSettingsPanel = useExampleHelperStore((state: ExampleHelperState) => state.showSettingsPanel);

    // [KO] 뷰포트 상태 동기화
    const isNarrow = useViewportSync();

    // [KO] 상단 바 액션 및 인스펙터 상태 관리
    const {setDebugActive} = useTopBarActions();

    // [KO] 인스펙터 초기화
    useInspectorInit(redGPUContext, setDebugActive);

    const dynamicPanelStyle = {
        ...panelStyle,
        maxHeight: isNarrow ? 'calc(100vh - 160px)' : 'calc(100vh - 103px)',
        display: showSettingsPanel ? 'flex' : 'none'
    };

    return (
        <>
            <ExampleHeader/>
            <Description/>

            <div style={dynamicPanelStyle}>
                <div style={contentStyle}>
                    <React.Suspense fallback={null}>
                        {showSettingsPanel && <LazyGuiPanel/>}
                    </React.Suspense>
                </div>
            </div>

            <GuiCompareLabelHelper/>

            <Footer 
                narrowTitle={<Title />}
                narrowSettings={<RenderingSettingsGroup />}
            />
            <SourceModal/>
            <LoadingUI/>
        </>
    );
};

// Styles
const panelStyle: React.CSSProperties = {
    position: 'fixed',
    right: '6px',
    top: '60px',
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    fontFamily: 'monospace',
    zIndex: 10002,
    borderLeft: '1px solid rgba(255,255,255,0.05)',
    overflow: 'hidden',
};

const contentStyle: React.CSSProperties = {
    fontSize: '12px',
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
};

export default App;
