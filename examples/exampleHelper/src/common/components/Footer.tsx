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

    // [KO] 1. 예제 목록 페이지(ExamplesApp: useSourceModal === false)에서는 Flex 영역 내 하단 플로팅 글래스 바로 렌더링하여 컨텐츠 침범 방지
    if (!useSourceModal) {
        return (
            <div style={{
                ...staticFooterContainerStyle,
                margin: isNarrow ? '8px 10px 10px 10px' : '12px 20px 14px 20px',
                padding: isNarrow ? '0 14px' : '0 20px',
            }}>
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
                    <span style={{color: '#b19898', fontSize: '12.5px', letterSpacing: '0.02em'}}>
                        This project is maintained by <b style={{color: '#fdb48d', fontWeight: 700}}>RedCamel</b>
                    </span>
                    <span style={iconWrapperStyle}>
                        <img src={githubIcon} width="18" height="18" alt="GitHub"/>
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
                        style={{...footerLeftLinkStyle, width: '100%', justifyContent: 'space-between'}}
                    >
                        <span style={{color: '#b19898', fontSize: '12px', lineHeight: '1'}}>
                            This project is maintained by <b style={{color: '#fdb48d', fontWeight: 700}}>RedCamel</b>
                        </span>
                        <span style={iconWrapperStyle}>
                            <img src={githubIcon} width="18" height="18" style={{display: 'block'}} alt="GitHub"/>
                        </span>
                    </a>
                </div>
            </div>
        );
    }

    // [KO] 3. 데스크톱 3D 뷰어: 하단 좌측 저작자/GitHub 투명 플로팅 텍스트 (우측 및 중앙 100% 개방)
    return (
        <div style={footerContainerStyle}>
            <a
                href="https://github.com/redcamel/RedGPU"
                target="_blank"
                rel="noreferrer"
                style={{
                    ...leftCapsuleStyle,
                    opacity: isLinkHovered ? 1 : 0.85
                }}
                onMouseEnter={() => setIsLinkHovered(true)}
                onMouseLeave={() => setIsLinkHovered(false)}
            >
                <span style={{
                    color: 'rgba(220, 212, 212, 0.88)',
                    fontSize: '12.5px',
                    fontWeight: 500,
                    lineHeight: '1',
                    letterSpacing: '0.02em',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)'
                }}>
                    This project is maintained by <b style={{color: '#fdb48d', fontWeight: 700}}>RedCamel</b>
                </span>
                <span style={{...iconWrapperStyle, filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35))'}}>
                    <img src={githubIcon} width="18" height="18" style={{display: 'block'}} alt="GitHub"/>
                </span>
            </a>
        </div>
    );
};

// Styles
const staticFooterContainerStyle: React.CSSProperties = {
    height: '36px',
    backgroundColor: 'transparent',
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
    height: '46px',
    padding: '5px 6px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    boxSizing: 'border-box'
};

const footerContainerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    right: '20px',
    height: '24px',
    zIndex: 10002,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    pointerEvents: 'none'
};

const narrowFooterContainerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '16px',
    left: '16px',
    right: '16px',
    zIndex: 10002,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(18, 18, 20, 0.84)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.5)',
    overflow: 'visible',
    pointerEvents: 'auto'
};

const mobileSelectContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '4px',
    padding: '5px 6px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    boxSizing: 'border-box'
};

const leftCapsuleStyle: React.CSSProperties = {
    height: '22px',
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    lineHeight: '1',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    boxSizing: 'border-box',
    pointerEvents: 'auto'
};

const rightCapsuleStyle: React.CSSProperties = {
    height: '42px',
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
    height: '42px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 18px',
    fontSize: '12px',
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
    display: 'inline-flex',
    alignItems: 'center',
    transform: 'translateY(-1.5px)',
    opacity: 0.95,
    transition: 'opacity 0.2s'
};

export default Footer;
