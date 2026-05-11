import React, {useEffect, useState} from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../store';
import githubIcon from '../assets/github.png';
import SelectBox from './basic/SelectBox';
import TONE_MAPPING_MODE from "@redgpu/src/toneMapping/TONE_MAPPING_MODE";

/**
 * [KO] 예제 헬퍼의 하단 푸터 컴포넌트입니다.
 * [EN] Bottom footer component of the example helper.
 */
const Footer = () => {
    const setShowSourceModal = useExampleHelperStore((state: ExampleHelperState) => state.setShowSourceModal);
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);

    const [antialiasing, setAntialiasing] = useState<string>('useMSAA');
    const [toneMapping, setToneMapping] = useState<string>(TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL);

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
        <div style={footerContainerStyle}>
            {isMobile && (
                <div style={mobileSelectContainerStyle}>
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
                </div>
            )}
            <div style={footerStyle}>
                <div style={footerLeftStyle}>
                    <span style={{color: '#b19898', fontSize: '11px'}}>This project is maintained by <b
                        style={{color: '#fdb48d'}}>RedCamel</b></span>
                    <a href="https://github.com/redcamel/RedGPU" target="_blank" rel="noreferrer" style={iconLinkStyle}>
                        <img src={githubIcon} width="16" height="16" alt="GitHub"/>
                    </a>
                </div>
                <div style={footerRightStyle}>
                    <button
                        style={sourceButtonStyle}
                        onClick={() => setShowSourceModal(true)}
                    >
                        SOURCE
                    </button>
                </div>
            </div>
        </div>
    );
};

// Styles
const footerContainerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10002,
    display: 'flex',
    flexDirection: 'column'
};

const mobileSelectContainerStyle: React.CSSProperties = {
    display: 'flex',
    height: '52px',
    backgroundColor: '#111112',
    borderTop: '1px solid #333',
    gap: '1px'
};

const footerStyle: React.CSSProperties = {
    height: '50px',
    backgroundColor: '#111112',
    borderTop: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    fontSize: '12px',
    color: '#b19898'
};

const footerLeftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
};

const footerRightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center'
};

const sourceButtonStyle: React.CSSProperties = {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    padding: '6px 16px',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    letterSpacing: '0.05em'
};

const iconLinkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    opacity: 0.7,
    transition: 'opacity 0.2s'
};

export default Footer;
