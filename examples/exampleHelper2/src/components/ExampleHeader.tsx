import React, {useEffect, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../store';
import homeIcon from '../assets/icons/home.svg';
import IconButton from './basic/IconButton';
import IconToggleButton from './basic/IconToggleButton';
import SelectBox from './basic/SelectBox';
import TONE_MAPPING_MODE from "@redgpu/src/toneMapping/TONE_MAPPING_MODE";

/**
 * [KO] 예제 헬퍼의 상단 네비게이션 바 컴포넌트입니다.
 * [EN] Top navigation bar component of the example helper.
 */
const ExampleHeader = () => {
    const currentExample = useExampleHelperStore((state: ExampleHelperState) => state.currentExample);
    const topBarRightActions = useExampleHelperStore((state: ExampleHelperState) => state.topBarRightActions);
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);

    const [antialiasing, setAntialiasing] = useState<string>('useMSAA');
    const [toneMapping, setToneMapping] = useState<string>(TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL);
    const [ssao, setSSAO] = useState<boolean>(false);

    useEffect(() => {
        if (redGPUContext) {
            const aaManager = redGPUContext.antialiasingManager;
            if (aaManager.useMSAA) setAntialiasing('useMSAA');
            else if (aaManager.useFXAA) setAntialiasing('useFXAA');
            else if (aaManager.useTAA) setAntialiasing('useTAA');
            else setAntialiasing('NONE');

            if (redGPUContext.viewList.length > 0) {
                const firstView = redGPUContext.viewList[0];
                if (firstView.toneMappingManager) {
                    setToneMapping(firstView.toneMappingManager.mode);
                }
                if (firstView.postEffectManager) {
                    setSSAO(firstView.postEffectManager.useSSAO);
                }
            }
        }
    }, [redGPUContext]);

    const handleAntialiasingChange = (value: string) => {
        setAntialiasing(value);
        if (redGPUContext) {
            const manager = redGPUContext.antialiasingManager;
            manager.useMSAA = false;
            manager.useFXAA = false;
            manager.useTAA = false;
            if (value === 'useMSAA') manager.useMSAA = true;
            else if (value === 'useFXAA') manager.useFXAA = true;
            else if (value === 'useTAA') manager.useTAA = true;
        }
    };

    const handleToneMappingChange = (value: string) => {
        setToneMapping(value);
        if (redGPUContext) {
            redGPUContext.viewList.forEach((view: any) => {
                if (view.toneMappingManager) {
                    view.toneMappingManager.mode = value as TONE_MAPPING_MODE;
                }
            });
        }
    };

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

    const aaOptions = [
        { value: 'NONE', label: 'NONE' },
        { value: 'useMSAA', label: 'MSAA' },
        { value: 'useFXAA', label: 'FXAA' },
        { value: 'useTAA', label: 'TAA' },
    ];

    const tmOptions = Object.entries(TONE_MAPPING_MODE).map(([key, value]) => ({
        value,
        label: key.replace(/_/g, ' ')
    }));

    const isMobile = redGPUContext?.detector?.isMobile;

    return (
        <header style={containerStyle}>
            <div style={navBarStyle}>
                <div style={leftSectionStyle}>
                    <IconButton
                        icon={homeIcon}
                        label="HOME"
                        onClick={() => { window.location.href = '../../index.html' }}
                        title="HOME"
                    />
                    <div style={titleBoxStyle}>
                        <span style={titleLabelStyle}>TITLE</span>
                        <span style={titleValueStyle}>
                          {currentExample ? currentExample.name : 'empty example name'}
                        </span>
                    </div>
                </div>

                <div style={rightSectionStyle}>
                    {!isMobile && (
                        <>


                            <SelectBox
                                label="TONE MAPPING"
                                value={toneMapping}
                                options={tmOptions}
                                onChange={handleToneMappingChange}
                            />

                            <SelectBox
                                label="ANTIALIASING"
                                value={antialiasing}
                                options={aaOptions}
                                onChange={handleAntialiasingChange}
                            />
                        </>
                    )}
                    <IconToggleButton
                        label="SSAO"
                        onClick={handleSSAOChange}
                        isActive={ssao}
                    />
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
    top: 0,
    left: 0,
    right: 0,
    height: '52px',
    backgroundColor: '#202020',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    zIndex: 10003,
    display: 'flex',
    flexDirection: 'column',
    wordBreak: 'keep-all'
};

const navBarStyle: React.CSSProperties = {
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)' // For the 1px gap line effect
};

const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'stretch',
    gap: '1px'
};

const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'stretch',
    gap: '1px'
};

const homeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '52px',
    height: '100%',
    backgroundColor: '#111112',
    color: 'white',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
    flexShrink: 0
};

const homeIconStyle: React.CSSProperties = {
    width: '18px',
    height: '18px'
};

const titleBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 16px',
    backgroundColor: '#111112',
    minWidth: '120px',
    flexShrink: 0
};

const titleLabelStyle: React.CSSProperties = {
    fontSize: '9px',
    color: '#666',
    fontWeight: 'bold',
    marginBottom: '2px'
};

const titleValueStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#ccc',
    fontWeight: 'bold'
};

export default ExampleHeader;
