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
    if (!currentExample || !currentExample.description) {
        return null;
    }

    const description = currentExample.description[language] || currentExample.description['en'] || '';
    if (!description) return null;

    return (
        <div
            style={{
                ...containerStyle,
                top: isNarrow ? '58px' : '68px',
                left: isNarrow ? '10px' : '16px',
                right: showSettingsPanel && !isNarrow ? '336px' : '16px'
            }}
        >
            <div style={pillWrapperStyle}>
                <div style={contentStyle}>
                    <span dangerouslySetInnerHTML={{__html: description}}/>
                </div>
                <button
                    style={toggleButtonStyle}
                    onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
                    title={language === 'ko' ? 'Switch to English' : '한국어로 전환'}
                >
                    {language === 'ko' ? 'EN' : 'KO'}
                </button>
            </div>
        </div>
    );
};

// Styles
const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '68px',
    left: '16px',
    right: '16px',
    backgroundColor: 'transparent',
    padding: 0,
    zIndex: 10002,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    pointerEvents: 'none'
};

const pillWrapperStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    maxWidth: '580px',
    padding: '0 4px',
    backgroundColor: 'transparent',
    pointerEvents: 'auto'
};

const contentStyle: React.CSSProperties = {
    fontSize: '12.5px',
    color: 'rgba(245, 245, 247, 0.96)',
    lineHeight: '1.55',
    wordBreak: 'keep-all',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.9), 0 0 12px rgba(0, 0, 0, 0.65)'
};

const toggleButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    height: '20px',
    padding: '0 7px',
    backgroundColor: 'transparent',
    color: '#fdb48d',
    border: '1px solid rgba(253, 180, 141, 0.45)',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '0.04em',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.9)',
    cursor: 'pointer',
    borderRadius: '5px',
    flexShrink: 0,
    transition: 'all 0.2s'
};

export default Description;
