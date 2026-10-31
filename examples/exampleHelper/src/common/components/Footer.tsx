import React, {useState} from 'react';
import {GitHubIcon} from './Icons';
import {glassCircleIslandStyle} from '../styles/uiStyles';

/**
 * [KO] 예제 헬퍼의 하단 푸터 컴포넌트입니다.
 * [EN] Bottom footer component of the example helper.
 */
interface FooterProps {
    useSourceModal?: boolean;
    narrowTitle?: React.ReactNode;
    narrowSettings?: React.ReactNode;
    isNarrow?: boolean;
}

const Footer = ({useSourceModal = true, narrowTitle, narrowSettings, isNarrow = false}: FooterProps) => {
    const [isLinkHovered, setIsLinkHovered] = useState(false);

    // [KO] 1. 예제 목록 페이지(ExamplesApp: useSourceModal === false)
    // - 비PC(isNarrow): 컨텐츠 영역 아래 독립된 Flex 하단 행으로 분리하여 컨텐츠 침범 방지
    // - PC(!isNarrow): 좌측 사이드바 하단에 고정 플로팅하여 우측 본문 스크롤이 화면 끝까지 열리도록 처리
    if (!useSourceModal) {
        return (
            <div style={isNarrow ? {
                ...staticFooterContainerStyle,
                height: '46px',
                margin: '8px 16px 12px 16px',
            } : {
                position: 'fixed',
                left: '20px',
                bottom: '12px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                zIndex: 100,
                pointerEvents: 'none',
            }}>
                <a
                    href="https://github.com/redcamel/RedGPU"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        ...floatingFooterCapsuleStyle,
                        opacity: isLinkHovered ? 1 : 0.9
                    }}
                    onMouseEnter={() => setIsLinkHovered(true)}
                    onMouseLeave={() => setIsLinkHovered(false)}
                >
                    <span style={{
                        color: 'rgba(220, 212, 212, 0.92)',
                        fontSize: isNarrow ? '12px' : '12.5px',
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.75)'
                    }}>
                        This project is maintained by <b style={{color: '#fdb48d', fontWeight: 700}}>RedCamel</b>
                    </span>
                </a>
                {isNarrow && narrowSettings}
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
                            <GitHubIcon color="#fff" size={20}/>
                        </span>
                    </a>
                </div>
            </div>
        );
    }

    // [KO] 3. 데스크톱 3D 뷰어: 하단 우측 저작자 텍스트 + 46x46 원형 글래스 GitHub 버튼
    return (
        <div style={footerContainerStyle}>
            <a
                href="https://github.com/redcamel/RedGPU"
                target="_blank"
                rel="noreferrer"
                style={{
                    ...leftCapsuleStyle,
                    opacity: isLinkHovered ? 1 : 0.9
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
                <span style={{
                    ...githubCircleIslandStyle,
                    backgroundColor: isLinkHovered ? 'rgba(32, 32, 36, 0.88)' : 'rgba(18, 18, 20, 0.82)',
                }}>
                    <GitHubIcon color="#fff" size={20}/>
                </span>
            </a>
        </div>
    );
};

// Styles
const staticFooterContainerStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    boxSizing: 'border-box',
    flexShrink: 0,
    zIndex: 100,
};

const floatingFooterCapsuleStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    height: '100%',
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    boxSizing: 'border-box',
    pointerEvents: 'auto',
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
    height: '46px',
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
    height: '46px',
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    lineHeight: '1',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    boxSizing: 'border-box',
    pointerEvents: 'auto'
};

const githubCircleIslandStyle: React.CSSProperties = {
    ...glassCircleIslandStyle,
    transition: 'background-color 0.18s',
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

const iconWrapperStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.95,
    transition: 'opacity 0.2s'
};

export default Footer;
