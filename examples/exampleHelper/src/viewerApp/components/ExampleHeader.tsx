import React, {useEffect, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../../store';
import {HomeIcon} from '../../common/components/Icons';
import IconButton from '../../common/components/basic/IconButton';
import IconToggleButton from '../../common/components/basic/IconToggleButton';
import LabelButton from '../../common/components/basic/LabelButton';
import SelectBox from '../../common/components/basic/SelectBox';
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
    const [bloom, setBloom] = useState<string>('NONE');

    useEffect(() => {
        if (redGPUContext) {
            if (redGPUContext.viewList.length > 0) {
                const firstView = redGPUContext.viewList[0];
                if (firstView.postEffectManager) {
                    setSSAO(firstView.postEffectManager.useSSAO);
                    setBloom(firstView.postEffectManager.useBloom ? 'NATURAL' : 'NONE');
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

    const handleBloomChange = (value: string) => {
        setBloom(value);
        if (redGPUContext) {
            redGPUContext.viewList.forEach((view: any) => {
                const postEffectManager = view.postEffectManager;
                if (postEffectManager) {
                    if (value === 'NONE') {
                        postEffectManager.useBloom = false;
                    } else {
                        postEffectManager.useBloom = true;
                        const bloomEffect = postEffectManager.bloom;
                        if (bloomEffect) {
                            if (value === 'NATURAL') bloomEffect.setNatural();
                            else if (value === 'CINEMATIC') bloomEffect.setCinematic();
                            else if (value === 'NEON_GLOW') bloomEffect.setNeonGlow();
                            else if (value === 'DREAMY') bloomEffect.setDreamy();
                            else if (value === 'SUBTLE') bloomEffect.setSubtle();
                        }
                    }
                }
            });
        }
    };

    const bloomOptions = [
        {value: 'NONE', label: 'None'},
        {value: 'NATURAL', label: 'Natural'},
        {value: 'CINEMATIC', label: 'Cinematic'},
        {value: 'NEON_GLOW', label: 'Neon Glow'},
        {value: 'DREAMY', label: 'Dreamy'},
        {value: 'SUBTLE', label: 'Subtle'},
    ];

    const viewportActions = topBarRightActions.filter((action) => action.id !== 'setting-toggle');
    const settingAction = topBarRightActions.find((action) => action.id === 'setting-toggle');

    return (
        <header
            style={{
                ...containerStyle,
                top: isNarrow ? '16px' : '20px',
                left: isNarrow ? '16px' : '20px',
                right: isNarrow ? '16px' : '20px',
                height: '46px'
            }}
        >
            <div style={navBarStyle}>
                <div style={{...leftGroupStyle, gap: '8px'}}>
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
                            <div style={{...leftSectionStyle, flexShrink: 0}}>
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
                    <SelectBox
                        label="Bloom"
                        value={bloom}
                        options={bloomOptions}
                        onChange={handleBloomChange}
                    />
                    <div style={dividerStyle}/>
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
    top: '20px',
    left: '20px',
    right: '20px',
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
    width: '46px',
    height: '46px',
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
    height: '46px',
    minWidth: 0,
    padding: '4px',
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
    height: '46px',
    flexShrink: 0,
    padding: '4px',
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
