import React from 'react';

// [KO] 공통 테마 설정
// [EN] Common theme settings
export const THEME = {
    fontFamily: '',
    fontSize: {
        title: '13px',
        content: '12px',
        small: '11px'
    },
    colors: {
        primary: '#fdb48d',
        label: '#888',
        value: '#ccc',
        background: '#111',
        border: 'rgba(255,255,255,0.1)',
        activeBg: 'rgba(253, 180, 141, 0.1)'
    }
};

// [KO] 공통으로 사용되는 스타일 조각들
// [EN] Commonly used style fragments
export const COMMON_STYLES = {
    label: {
        color: THEME.colors.label
    } as React.CSSProperties,
    value: {
        color: THEME.colors.value,
        textAlign: 'right',
        wordBreak: 'break-all',
        marginLeft: '10px'
    } as React.CSSProperties
};
