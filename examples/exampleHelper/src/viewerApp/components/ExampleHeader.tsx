import React, {useEffect, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../../store';
import {HomeIcon} from '../../common/components/Icons';
import IconButton from '../../common/components/basic/IconButton';
import IconToggleButton from '../../common/components/basic/IconToggleButton';
import LabelButton from '../../common/components/basic/LabelButton';
import RenderingSettingsGroup from '../../viewerApp/components/RenderingSettingsGroup';
import Title from '../../viewerApp/components/Title';
import {glassCircleIslandStyle, glassPillContainerStyle, verticalDividerStyle} from '../../common/styles/uiStyles';

/**
 * [KO] 예제 헬퍼의 상단 네비게이션 바 컴포넌트입니다.
 * [EN] Top navigation bar component of the example helper.
 */
const ExampleHeader = () => {
    const topBarRightActions = useExampleHelperStore((state: ExampleHelperState) => state.topBarRightActions);
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);
    const isNarrow = useExampleHelperStore((state: ExampleHelperState) => state.isNarrow);
    const showSourceModal = useExampleHelperStore((state: ExampleHelperState) => state.showSourceModal);
    const setShowSourceModal = useExampleHelperStore((state: ExampleHelperState) => state.setShowSourceModal);

    const [ssao, setSSAO] = useState<boolean>(false);

    useEffect(() => {
        if (redGPUContext) {
            if (redGPUContext.viewList.length > 0) {
                const firstView = redGPUContext.viewList[0];
                if (firstView.builtInEffectManager) {
                    setSSAO(firstView.builtInEffectManager.useSSAO);
                }
            }
        }
    }, [redGPUContext]);

    const handleSSAOChange = () => {
        const nextValue = !ssao;
        setSSAO(nextValue);
        if (redGPUContext) {
            redGPUContext.viewList.forEach((view: any) => {
                if (view.builtInEffectManager) {
                    view.builtInEffectManager.useSSAO = nextValue;
                }
            });
        }
    };

    const viewportActions = topBarRightActions.filter((action) => action.id !== 'setting-toggle');
    const settingAction = topBarRightActions.find((action) => action.id === 'setting-toggle');

    return (
        <header
            style={{
                ...containerStyle,
                top: isNarrow ? '16px' : '20px',
                left: isNarrow ? '16px' : '20px',
                right: isNarrow ? '16px' : '20px',
            }}
        >
            <div style={navBarStyle}>
                <div style={leftGroupStyle}>
                    <div style={circleIslandStyle}>
                        <IconButton
                            icon={<HomeIcon color="#fff" size={18}/>}
                            label="HOME"
                            onClick={() => {
                                window.location.href = '/RedGPU/examples/index.html'
                            }}
                            title="HOME"
                        />
                    </div>
                    {!isNarrow && (
                        <>
                            <div style={leftSectionStyle}>
                                <Title/>
                            </div>
                            <div style={rightSectionStyle}>
                                <LabelButton
                                    label="CODE"
                                    onClick={() => setShowSourceModal(!showSourceModal)}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div style={rightSectionStyle}>
                    {!isNarrow && (
                        <>
                            <RenderingSettingsGroup/>
                            <div style={verticalDividerStyle}/>
                        </>
                    )}
                    <IconToggleButton
                        label="SSAO"
                        onClick={handleSSAOChange}
                        isActive={ssao}
                    />
                    <div style={verticalDividerStyle}/>
                    {viewportActions.map((action) => (
                        <IconToggleButton
                            key={action.id}
                            icon={action.icon}
                            label={action.label}
                            onClick={action.onClick}
                            isActive={!!action.isActive}
                        />
                    ))}
                    {settingAction && (
                        <>
                            <div style={verticalDividerStyle}/>
                            <IconToggleButton
                                key={settingAction.id}
                                icon={settingAction.icon}
                                label={settingAction.label}
                                onClick={settingAction.onClick}
                                isActive={!!settingAction.isActive}
                            />
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

// Styles
const containerStyle: React.CSSProperties = {
    position: 'fixed',
    height: '46px',
    backgroundColor: 'transparent',
    zIndex: 10003,
    display: 'flex',
    flexDirection: 'column',
    wordBreak: 'keep-all',
    pointerEvents: 'none'
};

const navBarStyle: React.CSSProperties = {
    display: 'flex',
    height: '100%',
    width: '100%',
    gap: '12px',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent'
};

const leftGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    minWidth: 0,
    flex: '0 1 auto',
    gap: '8px',
    backgroundColor: 'transparent'
};

const circleIslandStyle: React.CSSProperties = {
    ...glassCircleIslandStyle,
    display: 'flex',
    padding: 0,
    pointerEvents: 'auto'
};

const rightSectionStyle: React.CSSProperties = {
    ...glassPillContainerStyle,
    padding: '4px',
    pointerEvents: 'auto'
};

const leftSectionStyle: React.CSSProperties = {
    ...rightSectionStyle,
    flexShrink: undefined,
    minWidth: 0,
};

export default ExampleHeader;
