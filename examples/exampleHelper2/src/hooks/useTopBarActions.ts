import React, {useEffect, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../store';
import {AxisIcon, DebugIcon, GridIcon, SettingIcon} from '../components/Icons';

/**
 * [KO] 상단 바의 액션 버튼들을 관리하고 상태를 동기화하는 훅입니다.
 * [EN] Hook that manages action buttons in the top bar and synchronizes state.
 */
export const useTopBarActions = () => {
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);
    const addTopBarRightAction = useExampleHelperStore((state: ExampleHelperState) => state.addTopBarRightAction);
    const guiConfig = useExampleHelperStore((state: ExampleHelperState) => state.guiConfig);
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

    // Register Dynamic Buttons
    useEffect(() => {
        if (redGPUContext) {
            // AXIS Toggle
            addTopBarRightAction({
                id: 'axis-toggle',
                label: 'AXIS',
                icon: (React.createElement(AxisIcon, {color: "#ccc", size: 18})),
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
                icon: (React.createElement(GridIcon, {color: "#ccc", size: 24})),
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
                icon: (React.createElement(DebugIcon, {color: "#ccc", size: 24})),
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
            if (guiConfig) {
                addTopBarRightAction({
                    id: 'setting-toggle',
                    label: 'SETTING',
                    icon: (React.createElement(SettingIcon, {color: "#ccc", size: 24})),
                    isActive: showSettingsPanel,
                    onClick: () => {
                        setShowSettingsPanel(!showSettingsPanel);
                    }
                });
            }
        }
    }, [redGPUContext, addTopBarRightAction, axisActive, gridActive, debugActive, guiConfig, showSettingsPanel, setShowSettingsPanel]);

    return {
        debugActive,
        setDebugActive
    };
};
