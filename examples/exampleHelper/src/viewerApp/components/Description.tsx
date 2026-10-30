import React from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../../store';

/**
 * [KO] 예제 설명을 표시하는 컴포넌트입니다. 언어 토글 버튼을 통해 한국어/영어 설명을 전환할 수 있습니다.
 * [EN] Component that displays example descriptions. Switch between KO/EN descriptions via language toggle button.
 */
const Description = () => {
    const currentExample = useExampleHelperStore((state: ExampleHelperState) => state.currentExample);
    const language = useExampleHelperStore((state: ExampleHelperState) => state.language);
    const setLanguage = useExampleHelperStore((state: ExampleHelperState) => state.setLanguage);
    const showSettingsPanel = useExampleHelperStore((state: ExampleHelperState) => state.showSettingsPanel);
    const isNarrow = useExampleHelperStore((state: ExampleHelperState) => state.isNarrow);
    const [isToggleHovered, setIsToggleHovered] = React.useState(false);

    if (!currentExample || !currentExample.description) {
        return null;
    }

    const description = currentExample.description[language] || currentExample.description['en'] || '';
    if (!description) return null;

    const categoryLabel = currentExample.path
        ? currentExample.path.split('/').slice(0, -1).join(' · ').replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase()
        : '';

    return (
        <>
            {!isNarrow && <div style={bottomScrimStyle}/>}
            <div
                style={{
                    ...containerStyle,
                    top: isNarrow ? '74px' : 'auto',
                    bottom: isNarrow ? 'auto' : '20px',
                    left: isNarrow ? '16px' : '20px',
                    right: isNarrow ? '16px' : '270px'
                }}
            >
                <div style={{...editorialWrapperStyle, maxWidth: isNarrow ? 'none' : '840px'}}>
                    {!isNarrow && <div style={accentBarStyle}/>}
                    <div style={textColumnStyle}>
                        {!isNarrow && (
                            <>
                                <div style={eyebrowRowStyle}>
                                    <span style={brandTagStyle}>RedGPU</span>
                                    <span style={eyebrowDotStyle}>·</span>
                                    <span style={brandSubStyle}>WebGPU Engine</span>
                                    {categoryLabel && (
                                        <>
                                            <span style={eyebrowDividerStyle}>/</span>
                                            <span style={eyebrowCategoryStyle}>{categoryLabel}</span>
                                        </>
                                    )}
                                </div>
                                <div style={titleRowStyle}>
                                    <span style={titleStyle}>
                                        {currentExample.name}
                                    </span>
                                    {currentExample.experimental && (
                                        <span style={experimentalBadgeStyle}>EXPERIMENTAL</span>
                                    )}
                                </div>
                            </>
                        )}
                        <div style={{
                            ...contentStyle,
                            fontSize: isNarrow ? '13px' : '14px',
                            fontWeight: isNarrow ? 500 : 400,
                            color: isNarrow ? 'rgba(255, 255, 255, 0.95)' : 'rgba(232, 235, 242, 0.86)'
                        }}>
                            <span style={{verticalAlign: 'middle'}} dangerouslySetInnerHTML={{__html: description}}/>
                            <button
                                style={{
                                    ...toggleButtonStyle,
                                    backgroundColor: isToggleHovered ? 'rgba(253, 180, 141, 0.24)' : 'rgba(253, 180, 141, 0.14)',
                                    borderColor: isToggleHovered ? 'rgba(253, 180, 141, 0.65)' : 'rgba(253, 180, 141, 0.38)',
                                    color: isToggleHovered ? '#fff' : '#fdb48d'
                                }}
                                onMouseEnter={() => setIsToggleHovered(true)}
                                onMouseLeave={() => setIsToggleHovered(false)}
                                onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
                                title={language === 'ko' ? 'Switch to English' : '한국어로 전환'}
                            >
                                {language === 'ko' ? 'EN' : 'KO'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Styles
const bottomScrimStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    height: '136px',
    background: 'linear-gradient(180deg, rgba(8, 8, 10, 0) 0%, rgba(8, 8, 10, 0.28) 52%, rgba(8, 8, 10, 0.56) 100%)',
    pointerEvents: 'none',
    zIndex: 10001
};
const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '80px',
    left: '22px',
    right: '22px',
    backgroundColor: 'transparent',
    padding: 0,
    zIndex: 10002,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    pointerEvents: 'none'
};

const editorialWrapperStyle: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: '12px',
    maxWidth: '840px',
    padding: 0,
    backgroundColor: 'transparent',
    pointerEvents: 'auto'
};

const accentBarStyle: React.CSSProperties = {
    width: '3px',
    borderRadius: '9999px',
    background: 'linear-gradient(180deg, #fdb48d 0%, rgba(253, 180, 141, 0.45) 70%, rgba(253, 180, 141, 0.08) 100%)',
    boxShadow: '0 0 12px rgba(253, 180, 141, 0.35)',
    flexShrink: 0,
    marginTop: '2px',
    marginBottom: '2px'
};

const textColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: '6px'
};

const eyebrowRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    minHeight: '12px',
    gap: '5px',
    flexWrap: 'wrap',
    opacity: 0.78,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)'
};

const brandTagStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '9.5px',
    fontWeight: 800,
    color: '#fdb48d',
    letterSpacing: '0.07em',
    lineHeight: '1',
    textTransform: 'uppercase'
};

const eyebrowDotStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '9.5px',
    fontWeight: 700,
    color: 'rgba(255, 255, 255, 0.45)',
    lineHeight: '1'
};

const brandSubStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '9.5px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.72)',
    letterSpacing: '0.06em',
    lineHeight: '1',
    textTransform: 'uppercase'
};

const eyebrowDividerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '9px',
    fontWeight: 600,
    color: 'rgba(253, 180, 141, 0.45)',
    margin: '0 1px',
    lineHeight: '1'
};

const eyebrowCategoryStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '9.5px',
    fontWeight: 700,
    color: 'rgba(253, 180, 141, 0.92)',
    letterSpacing: '0.07em',
    lineHeight: '1',
    textTransform: 'uppercase'
};

const titleRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap'
};

const titleStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '26px',
    fontWeight: 600,
    color: '#f8f9fa',
    lineHeight: '1.15',
    letterSpacing: '-0.015em',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
};

const experimentalBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '20px',
    fontSize: '10px',
    backgroundColor: 'rgba(255, 90, 95, 0.18)',
    color: '#ff7b80',
    border: '1px solid rgba(255, 90, 95, 0.4)',
    padding: '0 8px',
    borderRadius: '9999px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    lineHeight: '1',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)'
};

const contentStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 400,
    color: 'rgba(232, 235, 242, 0.86)',
    lineHeight: '1.6',
    letterSpacing: '-0.01em',
    wordBreak: 'keep-all',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)'
};

const toggleButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'middle',
    marginLeft: '8px',
    transform: 'translateY(-1px)',
    width: 'auto',
    height: '20px',
    padding: '0 8px',
    backgroundColor: 'rgba(253, 180, 141, 0.14)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: '#fdb48d',
    border: '1px solid rgba(253, 180, 141, 0.38)',
    fontSize: '10px',
    fontWeight: 800,
    lineHeight: '1',
    letterSpacing: '0.06em',
    textShadow: 'none',
    cursor: 'pointer',
    borderRadius: '9999px',
    flexShrink: 0,
    transition: 'all 0.18s ease'
};

export default Description;
