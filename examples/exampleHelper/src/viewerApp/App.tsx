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
 * [KO] 모바일 기기에서 가로(Landscape) 모드로 보고 있는지 여부를 판별합니다.
 * [EN] Determines whether the user is viewing in landscape mode on a mobile device.
 */
const checkIsMobileLandscape = (): boolean => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    const isCoarseNoHover = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const isMobileUA = (navigator as any).userAgentData?.mobile === true ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = isCoarseNoHover || navigator.maxTouchPoints > 0;
    const isLandscape = window.matchMedia('(orientation: landscape)').matches ||
        window.innerWidth > window.innerHeight;

    return isLandscape && (
        (isMobileUA && isTouchDevice) ||
        (isCoarseNoHover && window.innerHeight <= 600)
    );
};

/**
 * [KO] 예제 헬퍼의 메인 애플리케이션 컴포넌트입니다.
 * [EN] Main application component of the example helper.
 */
const App = () => {
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);
    const showSettingsPanel = useExampleHelperStore((state: ExampleHelperState) => state.showSettingsPanel);
    const isNarrow = useExampleHelperStore((state: ExampleHelperState) => state.isNarrow);
    const setShowSettingsPanel = useExampleHelperStore((state: ExampleHelperState) => state.setShowSettingsPanel);

    // [KO] 모바일 환경(세로 협소 화면 또는 모바일 가로 모드) 진입 시 설정 패널을 1초 후 자동으로 닫음 (사용자 경험 개선)
    // [EN] Automatically close the settings panel after 1 second on mobile (narrow portrait or mobile landscape) for better UX
    const autoCloseTriggered = React.useRef(false);
    React.useEffect(() => {
        if (autoCloseTriggered.current || !showSettingsPanel) return;
        const shouldAutoClose = isNarrow || checkIsMobileLandscape();
        if (shouldAutoClose) {
            const timer = setTimeout(() => {
                autoCloseTriggered.current = true;
                setShowSettingsPanel(false);
                keepLog('Auto close settings panel');
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            autoCloseTriggered.current = true;
        }
    }, [isNarrow, showSettingsPanel, setShowSettingsPanel]);

    // [KO] 뷰포트 상태 동기화
    useViewportSync();

    // [KO] 상단 바 액션 및 인스펙터 상태 관리
    const {setDebugActive} = useTopBarActions();

    // [KO] 인스펙터 초기화
    useInspectorInit(redGPUContext, setDebugActive);

    const dynamicPanelStyle: React.CSSProperties = {
        ...panelStyle,
        top: isNarrow ? '74px' : '80px',
        right: isNarrow ? '16px' : '20px',
        maxHeight: isNarrow ? 'calc(100dvh - 212px)' : 'calc(100dvh - 132px)',
        transform: showSettingsPanel ? 'translateX(0)' : 'translateX(calc(100% + 24px))',
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
                narrowTitle={<Title/>}
                narrowSettings={<RenderingSettingsGroup/>}
                isNarrow={isNarrow}
            />
            <SourceModal/>
            <LoadingUI/>
        </>
    );
};

// Styles
const panelStyle: React.CSSProperties = {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    fontFamily: 'monospace',
    zIndex: 10002,
    backgroundColor: 'rgba(18, 18, 20, 0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '18px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    padding: '8px',
    overflow: 'hidden',
};

const contentStyle: React.CSSProperties = {
    fontSize: '12px',
    flex: 1,
    overflowY: 'auto',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
};

export default App;
