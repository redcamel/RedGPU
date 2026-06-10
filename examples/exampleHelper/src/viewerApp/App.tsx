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
import {keepLog} from "@redgpu/src/utils";

const LazyGuiPanel = React.lazy(() => import('./gui/GuiPanel'));

/**
 * [KO] 예제 헬퍼의 메인 애플리케이션 컴포넌트입니다.
 * [EN] Main application component of the example helper.
 */
const App = () => {
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);
    const showSettingsPanel = useExampleHelperStore((state: ExampleHelperState) => state.showSettingsPanel);
    const isNarrow = useExampleHelperStore((state: ExampleHelperState) => state.isNarrow);
    const setShowSourceModal = useExampleHelperStore((state: ExampleHelperState) => state.setShowSourceModal);
    const setShowSettingsPanel = useExampleHelperStore((state: ExampleHelperState) => state.setShowSettingsPanel);

    // [KO] 모바일 환경(isNarrow)에서 진입 시 설정 패널을 1초 후 자동으로 닫음 (사용자 경험 개선)
    // [EN] Automatically close the settings panel after 1 second on mobile (isNarrow) for better UX
    const autoCloseTriggered = React.useRef(false);
    React.useEffect(() => {
        if (isNarrow && showSettingsPanel && !autoCloseTriggered.current) {
            autoCloseTriggered.current = true;
            const timer = setTimeout(() => {
                setShowSettingsPanel(false);
                keepLog('Auto close settings panel');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    // [KO] 뷰포트 상태 동기화
    useViewportSync();

    // [KO] 상단 바 액션 및 인스펙터 상태 관리
    const {setDebugActive} = useTopBarActions();

    // [KO] 인스펙터 초기화
    useInspectorInit(redGPUContext, setDebugActive);

    const dynamicPanelStyle: React.CSSProperties = {
        ...panelStyle,
        maxHeight: isNarrow ? 'calc(100vh - 160px)' : 'calc(100vh - 103px)',
        transform: showSettingsPanel ? 'translateX(0)' : 'translateX(calc(100% + 10px))',
        opacity: showSettingsPanel ? 1 : 0,
        pointerEvents: showSettingsPanel ? 'auto' : 'none',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    };

    return (
        <>
            <ExampleHeader/>
            <Description/>

            <div style={dynamicPanelStyle}>
                <div style={contentStyle}>
                    <React.Suspense fallback={null}>
                        <LazyGuiPanel/>
                    </React.Suspense>
                </div>
            </div>

            <GuiCompareLabelHelper/>

            <Footer 
                narrowTitle={<Title />}
                narrowSettings={<RenderingSettingsGroup />}
                isNarrow={isNarrow}
                onShowSource={() => setShowSourceModal(true)}
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
