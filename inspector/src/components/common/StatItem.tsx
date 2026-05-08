import React, {memo} from 'react';
import {COMMON_STYLES, THEME} from './Theme';

/**
 * [KO] 라벨과 값을 쌍으로 표시하는 통계 항목 컴포넌트입니다.
 */
const StatItem = memo(({label, value, color = THEME.colors.value, isBold = false}: {
    label: string,
    value: any,
    color?: string,
    isBold?: boolean
}) => {
    const isZero = value === 0 || value === '0';

    return (
        <div style={{...statItemStyle, opacity: isZero ? 0.3 : 1}}>
            <span style={COMMON_STYLES.label}>{label}</span>
            <span style={{
                ...COMMON_STYLES.value,
                color,
                fontWeight: isBold ? 'bold' : 'normal'
            }}>
                {value !== undefined && value !== null ? value : 'N/A'}
            </span>
        </div>
    );
});

const statItemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
    fontSize: THEME.fontSize.content,
    fontFamily: THEME.fontFamily
};
export default StatItem;