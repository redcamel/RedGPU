import React, {useEffect, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../../store';
import {HomeIcon} from '../../common/components/Icons';
import IconButton from '../../common/components/basic/IconButton';
import IconToggleButton from '../../common/components/basic/IconToggleButton';
import LabelButton from '../../common/components/basic/LabelButton';
import RenderingSettingsGroup from '../../viewerApp/components/RenderingSettingsGroup';
import Title from '../../viewerApp/components/Title';

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
                if (firstView.postEffectManager) {
                    setSSAO(firstView.postEffectManager.useSSAO);
                }
            }
        }
    }, [redGPUContext]);

    const handleSSAOChange = () => {
        const nextValue = !ssao;
        setSSAO(nextValue);
        if (redGPUContext) {
            redGPUContext.viewList.forEach((view: any) => {
                if (view.postEffectManager) {
                    view.postEffectManager.useSSAO = nextValue;
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
                top: isNarrow ? '10px' : '16px',
                left: isNarrow ? '10px' : '16px',
                right: isNarrow ? '10px' : '16px',
                height: '42px'
            }}
        >
            <div style={navBarStyle}>
                <div style={{...leftGroupStyle, gap: isNarrow ? '6px' : '8px'}}>
                    <div style={circleIslandStyle}>
                        <IconButton
                            icon={<HomeIcon color="#fff" size={17}/>}
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
                            <div style={leftSectionStyle}>
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
                            <div style={dividerStyle}/>
                        </>
                    )}
                    <IconToggleButton
                        label="SSAO"
                        onClick={handleSSAOChange}
                        isActive={ssao}
                    />
                    <div style={dividerStyle}/>
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
                            <div style={dividerStyle}/>
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
    top: '16px',
    left: '16px',
    right: '16px',
    height: '42px',
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
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent'
};

const leftGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    gap: '8px',
    backgroundColor: 'transparent'
};

const rightGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    gap: '8px',
    backgroundColor: 'transparent'
};

const circleIslandStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '42px',
    height: '42px',
    padding: 0,
    backgroundColor: 'rgba(18, 18, 20, 0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    boxSizing: 'border-box',
    flexShrink: 0,
    pointerEvents: 'auto'
};

const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '42px',
    padding: '3px 6px',
    gap: '4px',
    backgroundColor: 'rgba(18, 18, 20, 0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '9999px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    boxSizing: 'border-box',
    pointerEvents: 'auto'
};

const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '42px',
    padding: '3px 6px',
    gap: '4px',
    backgroundColor: 'rgba(18, 18, 20, 0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '9999px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    boxSizing: 'border-box',
    pointerEvents: 'auto'
};

const dividerStyle: React.CSSProperties = {
    width: '1px',
    height: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: '0 2px',
    flexShrink: 0
};

export default ExampleHeader;
