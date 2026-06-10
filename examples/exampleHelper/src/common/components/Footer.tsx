import React from 'react';
import LabelButton from '../../common/components/basic/LabelButton';

/**
 * [KO] 예제 헬퍼의 하단 푸터 컴포넌트입니다.
 * [EN] Bottom footer component of the example helper.
 */
interface FooterProps {
    useSourceModal?: boolean;
    narrowTitle?: React.ReactNode;
    narrowSettings?: React.ReactNode;
    isNarrow?: boolean; // [KO] 외부에서 주입받도록 변경 [EN] Injected from outside
    onShowSource?: () => void; // [KO] 외부에서 콜백으로 주입 [EN] Injected as callback
}

const Footer = ({useSourceModal = true, narrowTitle, narrowSettings, isNarrow = false, onShowSource}: FooterProps) => {
    const RELATIVE_PATH = './assets/github.png';
    const githubIcon = new URL(RELATIVE_PATH, import.meta.url).href;

    return (
        <div style={footerContainerStyle}>
            {useSourceModal && isNarrow && narrowTitle && <div style={titleContainerStyle}>{narrowTitle}</div>}
            {useSourceModal && isNarrow && narrowSettings && (
                <div style={mobileSelectContainerStyle}>
                    {narrowSettings}
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
                {
                    useSourceModal && <div style={footerRightStyle}>
                    <LabelButton
                        label="SOURCE"
                        onClick={() => onShowSource?.()}
                        style={sourceButtonStyle}
                    />
                </div>
                }
            </div>
        </div>
    );
};

// Styles
const titleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    height: '46px',

}
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
    height: '51px',
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
