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

    return (
        <header
            style={{
                ...containerStyle,
                top: isNarrow ? '10px' : '16px',
                left: isNarrow ? '10px' : '16px',
                right: isNarrow ? '10px' : '16px',
                height: isNarrow ? '42px' : '44px'
            }}
        >
            <div style={navBarStyle}>
                <div style={leftSectionStyle}>
                    <IconButton
                        icon={<HomeIcon color="#fff" size={18}/>}
                        label="HOME"
                        onClick={() => {
                            window.location.href = '/RedGPU/examples/index.html'
                        }}
                        title="HOME"
                    />
                    {!isNarrow && (
                        <>
                            <div style={dividerStyle}/>
                            <Title/>
                        </>
                    )}
                </div>

                <div style={rightSectionStyle}>
                    <LabelButton
                        label="</> SOURCE"
                        onClick={() => setShowSourceModal(true)}
                        style={isNarrow ? {height: '32px', padding: '0 10px', fontSize: '10px'} : undefined}
                    />
                    <div style={dividerStyle}/>
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
                    {topBarRightActions.map((action) => (
                        <IconToggleButton
                            key={action.id}
                            icon={action.icon}
                            label={action.label}
                            onClick={action.onClick}
                            isActive={!!action.isActive}
                        />
                    ))}
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
    height: '44px',
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

const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    padding: '4px',
    gap: '4px',
    backgroundColor: 'rgba(17, 17, 18, 0.84)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
    boxSizing: 'border-box',
    pointerEvents: 'auto'
};

const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    padding: '4px',
    gap: '4px',
    backgroundColor: 'rgba(17, 17, 18, 0.84)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
    boxSizing: 'border-box',
    pointerEvents: 'auto'
};

const dividerStyle: React.CSSProperties = {
    width: '1px',
    height: '18px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: '0 2px',
    flexShrink: 0
};

export default ExampleHeader;
