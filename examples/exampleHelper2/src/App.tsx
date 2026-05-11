import React, {useEffect, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from './store';
import Footer from './components/Footer';
import ExampleHeader from './components/ExampleHeader';
import Description from './components/Description';
import SourceModal from './components/basic/SourceModal';
import debugIcon from './assets/icons/debug.svg';
import axisIcon from './assets/icons/axis.svg';
import gridIcon from './assets/icons/grid.svg';
import settingIcon from './assets/icons/gears-solid-full.svg';
import GuiPanel from './components/GuiPanel';

/**
 * [KO] 예제 헬퍼의 메인 애플리케이션 컴포넌트입니다.
 * [EN] Main application component of the example helper.
 */
const App = () => {
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);
    const addTopBarRightAction = useExampleHelperStore((state: ExampleHelperState) => state.addTopBarRightAction);
    const guiCallback = useExampleHelperStore((state: ExampleHelperState) => state.guiCallback);
    const showSettingsPanel = useExampleHelperStore((state: ExampleHelperState) => state.showSettingsPanel);
    const setShowSettingsPanel = useExampleHelperStore((state: ExampleHelperState) => state.setShowSettingsPanel);

    const [axisActive, setAxisActive] = useState(false);
    const [gridActive, setGridActive] = useState(false);
    const [debugActive, setDebugActive] = useState(false);

    // Sync state with last view
    useEffect(() => {
        if (redGPUContext && redGPUContext.viewList.length > 0) {
            const lastView = redGPUContext.viewList[redGPUContext.viewList.length - 1];
            setAxisActive(!!lastView.axis);
            setGridActive(!!lastView.grid);
            if (window.redGPUInspector) {
                setDebugActive(window.redGPUInspector.useDebugPanel);
            }
        }
    }, [redGPUContext]);

    // Inspector Initialization & Debug Button
    useEffect(() => {
        if (redGPUContext) {
            const initInspector = async () => {
                try {
                    // @ts-ignore
                    const {default: RedGPUInspector} = await import('../../../inspector/dist/index.js');
                    if (!window.redGPUInspector) {
                        window.redGPUInspector = new RedGPUInspector(redGPUContext);
                        setDebugActive(window.redGPUInspector.useDebugPanel);
                    }
                } catch (e) {
                    console.error('Failed to load Inspector:', e);
                }
            };
            initInspector();
        }
    }, [redGPUContext]);

    // Register Dynamic Buttons
    useEffect(() => {
        if (redGPUContext) {
            // AXIS Toggle
            addTopBarRightAction({
                id: 'axis-toggle',
                label: 'AXIS',
                icon: axisIcon,
                isActive: axisActive,
                onClick: () => {
                    const nextValue = !axisActive;
                    redGPUContext.viewList.forEach((view: any) => {
                        if ('axis' in view) view.axis = nextValue;
                    });
                    setAxisActive(nextValue);
                }
            });

            // GRID Toggle
            addTopBarRightAction({
                id: 'grid-toggle',
                label: 'GRID',
                icon: gridIcon,
                isActive: gridActive,
                onClick: () => {
                    const nextValue = !gridActive;
                    redGPUContext.viewList.forEach((view: any) => {
                        if ('grid' in view) view.grid = nextValue;
                    });
                    setGridActive(nextValue);
                }
            });

            // DEBUG Toggle
            addTopBarRightAction({
                id: 'debug-toggle',
                label: 'DEBUG',
                icon: debugIcon,
                isActive: debugActive,
                onClick: () => {
                    const nextValue = !debugActive;
                    if (window.redGPUInspector) {
                        window.redGPUInspector.useDebugPanel = nextValue;
                    }
                    setDebugActive(nextValue);
                }
            });

            // SETTING Toggle
            if (guiCallback) {
                addTopBarRightAction({
                    id: 'setting-toggle',
                    label: 'SETTING',
                    icon: settingIcon,
                    isActive: showSettingsPanel,
                    onClick: () => {
                        setShowSettingsPanel(!showSettingsPanel);
                    }
                });
            }
        }
    }, [redGPUContext, addTopBarRightAction, axisActive, gridActive, debugActive, guiCallback, showSettingsPanel, setShowSettingsPanel]);

    return (
        <>
            <ExampleHeader/>
            <Description/>

            <div style={{...panelStyle, display: showSettingsPanel ? 'flex' : 'none'}}>
                <div style={contentStyle}>
                    <GuiPanel/>
                </div>
            </div>

            <Footer/>
            <SourceModal/>
        </>
    );
};

// Styles
const panelStyle: React.CSSProperties = {
    position: 'fixed',
    right: 0,
    top: '53px', // 상단 헤더(52px) 바로 아래 위치
    width: '320px',
    maxHeight: 'calc(100vh - 103px)', // 전체(100vh) - 헤더(52px) - 푸터(50px)
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(17, 17, 18, 0.95)',
    color: 'white',
    fontFamily: 'monospace',
    zIndex: 10002,
    boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
    borderLeft: '1px solid rgba(255,255,255,0.05)',
    overflow: 'hidden'
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
