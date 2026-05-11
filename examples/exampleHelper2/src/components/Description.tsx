import React from 'react';
import {ExampleHelperState, useExampleHelperStore} from '../store';

/**
 * [KO] 예제 설명을 표시하는 컴포넌트입니다. 언어 토글 버튼을 통해 한국어/영어 설명을 전환할 수 있습니다.
 * [EN] Component that displays example descriptions. Switch between KO/EN descriptions via language toggle button.
 */
const Description = () => {
    const currentExample = useExampleHelperStore((state: ExampleHelperState) => state.currentExample);
    const language = useExampleHelperStore((state: ExampleHelperState) => state.language);
    const setLanguage = useExampleHelperStore((state: ExampleHelperState) => state.setLanguage);
    const showSettingsPanel = useExampleHelperStore((state: ExampleHelperState) => state.showSettingsPanel);

    if (!currentExample || !currentExample.description) {
        return null;
    }

    const description = currentExample.description[language] || currentExample.description['en'] || '';
    if (!description) return null;

    return (
        <div style={{...containerStyle, right: showSettingsPanel ? '320px' : 0}}>
            <div style={contentStyle}>
                <span dangerouslySetInnerHTML={{__html: description}}/>
            </div>
            <button
                style={toggleButtonStyle}
                onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
            >
                {language === 'ko' ? 'ENGLISH' : '한국어'}
            </button>
        </div>
    );
};

// Styles
const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '52px',
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    padding: '12px 20px',
    zIndex: 10002,
    display: 'flex',
    flexDirection: 'column', // 수직 배치로 변경
    alignItems: 'flex-start', // 왼쪽 정렬
    justifyContent: 'flex-start',
    gap: '10px', // 글과 버튼 사이 간격 축소
    pointerEvents: 'none'
};

const contentStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#eee',
    lineHeight: '1.6',
    maxWidth: '800px',
    wordBreak: 'keep-all',
    textShadow: '1px 1px 2px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)',
    pointerEvents: 'auto'
};

const toggleButtonStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // 배경 투명도 조정
    color: '#ccc',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '3px 10px',
    fontSize: '9px', // 버튼 크기 살짝 축소
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '4px',
    flexShrink: 0,
    transition: 'all 0.2s',
    pointerEvents: 'auto',
    backdropFilter: 'blur(4px)'
};

export default Description;
