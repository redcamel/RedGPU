import React from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../store';
import githubIcon from '../assets/github.png';
import RenderingSettingsGroup from './RenderingSettingsGroup';
import LabelButton from './basic/LabelButton';
import {useMediaQuery} from '../utils/useMediaQuery';

/**
 * [KO] 예제 헬퍼의 하단 푸터 컴포넌트입니다.
 * [EN] Bottom footer component of the example helper.
 */
const Footer = () => {
    const setShowSourceModal = useExampleHelperStore((state: ExampleHelperState) => state.setShowSourceModal);
    const isNarrow = useMediaQuery(768);

    return (
        <div style={footerContainerStyle}>
            {isNarrow && (
                <div style={mobileSelectContainerStyle}>
                    <RenderingSettingsGroup />
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
                    <LabelButton
                        label="SOURCE"
                        onClick={() => setShowSourceModal(true)}
                        style={sourceButtonStyle}
                    />
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
    backgroundColor: '#1e1e1e',
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
