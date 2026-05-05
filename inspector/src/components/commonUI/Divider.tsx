import React from 'react';
import { THEME } from './Theme';

/**
 * [KO] 섹션 내의 항목들을 구분하는 선 컴포넌트입니다.
 * [EN] A divider component that separates items within a section.
 */
const Divider = ({ vertical, style }: { vertical?: boolean, style?: React.CSSProperties }) => {
    const combinedStyle: React.CSSProperties = vertical 
        ? { ...defaultVerticalStyle, ...style }
        : { ...defaultHorizontalStyle, ...style };
        
    return <div style={combinedStyle} />;
};

const defaultHorizontalStyle: React.CSSProperties = {
    height: '1px',
    background: THEME.colors.border,
    margin: '8px 0'
};

const defaultVerticalStyle: React.CSSProperties = {
    width: '1px',
    height: '36px',
    background: THEME.colors.border,
    margin: '0'
};

export default Divider;
