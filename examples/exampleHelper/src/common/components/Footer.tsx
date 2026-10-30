import React, {useState} from 'react';

/**
 * [KO] 예제 헬퍼의 하단 푸터 컴포넌트입니다.
 * [EN] Bottom footer component of the example helper.
 */
interface FooterProps {
    useSourceModal?: boolean;
    narrowTitle?: React.ReactNode;
    narrowSettings?: React.ReactNode;
    isNarrow?: boolean;
    onShowSource?: () => void;
}

const Footer = ({useSourceModal = true, narrowTitle, narrowSettings, isNarrow = false, onShowSource}: FooterProps) => {
    const RELATIVE_PATH = './assets/github.png';
    const githubIcon = new URL(RELATIVE_PATH, import.meta.url).href;
    const [isLinkHovered, setIsLinkHovered] = useState(false);

    // [KO] 1. 예제 목록 페이지(ExamplesApp: useSourceModal === false)에서는 일반 플렉스 하단 바로 렌더링하여 레이아웃 간섭 방지
    if (!useSourceModal) {
        return (
            <div style={staticFooterContainerStyle}>
                <a
                    href="https://github.com/redcamel/RedGPU"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        ...footerLeftLinkStyle,
                        opacity: isLinkHovered ? 1 : 0.88
                    }}
                    onMouseEnter={() => setIsLinkHovered(true)}
                    onMouseLeave={() => setIsLinkHovered(false)}
                >
                    <span style={{color: '#b19898', fontSize: '11.5px', letterSpacing: '0.02em'}}>
                        This project is maintained by <b style={{color: '#fdb48d', fontWeight: 700}}>RedCamel</b>
                    </span>
                    <span style={iconWrapperStyle}>
                        <img src={githubIcon} width="16" height="16" alt="GitHub"/>
                    </span>
                </a>
            </div>
        );
    }

    // [KO] 2. 모바일 3D 뷰어(isNarrow && useSourceModal): 하단 통합 플로팅 독(Dock)
    if (isNarrow) {
        return (
            <div style={narrowFooterContainerStyle}>
                {narrowTitle && <div style={titleContainerStyle}>{narrowTitle}</div>}
                {narrowSettings && (
                    <div style={mobileSelectContainerStyle}>
                        {narrowSettings}
                    </div>
                )}
                <div style={narrowFooterBarStyle}>
                    <a
                        href="https://github.com/redcamel/RedGPU"
                        target="_blank"
                        rel="noreferrer"
                        style={footerLeftLinkStyle}
                    >
                        <span style={{color: '#b19898', fontSize: '11px'}}>
                            This project is maintained by <b style={{color: '#fdb48d', fontWeight: 700}}>RedCamel</b>
                        </span>
                        <span style={iconWrapperStyle}>
                            <img src={githubIcon} width="16" height="16" alt="GitHub"/>
                        </span>
                    </a>
                </div>
            </div>
        );
    }

    // [KO] 3. 데스크톱 3D 뷰어: 하단 좌측 저작자/GitHub 플로팅 캡슐 (우측 및 중앙 100% 개방)
    return (
        <div style={footerContainerStyle}>
            <a
                href="https://github.com/redcamel/RedGPU"
                target="_blank"
                rel="noreferrer"
                style={{
                    ...leftCapsuleStyle,
                    backgroundColor: isLinkHovered ? 'rgba(28, 28, 30, 0.9)' : 'rgba(18, 18, 20, 0.82)',
                    borderColor: isLinkHovered ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.1)'
                }}
                onMouseEnter={() => setIsLinkHovered(true)}
                onMouseLeave={() => setIsLinkHovered(false)}
            >
                <span style={{color: '#b19898', fontSize: '11.5px', letterSpacing: '0.02em'}}>
                    This project is maintained by <b style={{color: '#fdb48d', fontWeight: 700}}>RedCamel</b>
                </span>
                <span style={iconWrapperStyle}>
                    <img src={githubIcon} width="16" height="16" alt="GitHub"/>
                </span>
            </a>
        </div>
    );
};

// Styles
const staticFooterContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '44px',
    backgroundColor: '#111112',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    boxSizing: 'border-box',
    flexShrink: 0,
    zIndex: 100
};

const titleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40px',
    padding: '4px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    boxSizing: 'border-box'
};

const footerContainerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '16px',
    left: '16px',
    right: '16px',
    height: '40px',
    zIndex: 10002,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    pointerEvents: 'none'
};

const narrowFooterContainerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    right: '10px',
    zIndex: 10002,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(17, 17, 18, 0.88)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '20px',
    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.55)',
    overflow: 'visible',
    pointerEvents: 'auto'
};

const mobileSelectContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '4px',
    padding: '4px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    boxSizing: 'border-box'
};

const leftCapsuleStyle: React.CSSProperties = {
    height: '40px',
    padding: '0 16px',
    backgroundColor: 'rgba(17, 17, 18, 0.84)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '9999px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
    boxSizing: 'border-box',
    pointerEvents: 'auto'
};

const rightCapsuleStyle: React.CSSProperties = {
    height: '40px',
    padding: '4px',
    backgroundColor: 'rgba(17, 17, 18, 0.84)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '9999px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    pointerEvents: 'auto'
};

const narrowFooterBarStyle: React.CSSProperties = {
    height: '40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 12px',
    fontSize: '11px',
    color: '#e8e8e8'
};

const footerLeftLinkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
};

const footerRightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'auto'
};

const narrowSourceButtonStyle: React.CSSProperties = {
    height: '28px',
    padding: '0 12px',
    fontSize: '10px',
    borderRadius: '7px'
};

const iconWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    opacity: 0.95,
    transition: 'opacity 0.2s'
};

export default Footer;
