import React from 'react';
import {COMMON_STYLES, THEME} from './Theme';

/**
 * [KO] RGBA 색상 값을 배경색과 보색 텍스트로 표시하는 컴포넌트입니다.
 */
const StatRGBAItem = ({label, value}: { label: string, value: number[] }) => {
    const [r, g, b] = value;
    const compColor = `rgb(${255 - r}, ${255 - g}, ${255 - b})`;

    return (
        <div style={statItemStyle}>
            <span style={COMMON_STYLES.label}>{label}</span>
            <span style={{
                ...COMMON_STYLES.value,
                backgroundColor: `rgba(${value.join(', ')})`,
                color: compColor,
                padding: '2px 4px'
            }}>
                {value.join(', ')}
            </span>
        </div>
    );
};

const statItemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
    fontSize: THEME.fontSize.content,
    fontFamily: THEME.fontFamily
};
export default StatRGBAItem;