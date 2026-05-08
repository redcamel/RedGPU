import React from 'react';

/**
 * [KO] 예제 헬퍼의 하단 푸터 컴포넌트입니다.
 * [EN] Bottom footer component of the example helper.
 */
const Footer = () => {
    return (
        <div style={footerStyle}>
            <div style={footerLeftStyle}>
                <span style={{color: '#b19898', fontSize: '11px'}}>This project is maintained by <b style={{color: '#fdb48d'}}>RedCamel</b></span>
                <a href="https://github.com/redcamel/RedGPU" target="_blank" rel="noreferrer" style={iconLinkStyle}>
                    <img src="https://redcamel.github.io/RedGPU/examples/assets/github.png" width="16" height="16" alt="GitHub" />
                </a>
            </div>
        </div>
    );
};

// Styles
const footerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50px',
    backgroundColor: '#111112',
    borderTop: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    zIndex: 10002,
    fontSize: '12px',
    color: '#b19898'
};

const footerLeftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
};

const iconLinkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    opacity: 0.7,
    transition: 'opacity 0.2s'
};

export default Footer;
