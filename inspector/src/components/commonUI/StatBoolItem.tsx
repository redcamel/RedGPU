import React from 'react';
import {COMMON_STYLES, THEME} from './Theme';

/**
 * [KO] 불린(boolean) 값을 배경색이 있는 뱃지 형태로 표시하는 컴포넌트입니다.
 * [EN] Component that displays a boolean value as a badge with a background color.
 */
const StatBoolItem = ({
                          label,
                          value,
                          trueLabel = 'TRUE',
                          falseLabel = 'FALSE'
                      }: {
    label: string,
    value: boolean,
    trueLabel?: string,
    falseLabel?: string
}) => {
    return (
        <div style={statItemStyle}>
            <span style={COMMON_STYLES.label}>{label}</span>
            <span style={{
                ...COMMON_STYLES.value,
                backgroundColor: value ? '#008000' : '#cc0000',
                color: 'white',
                padding: '2px 4px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 'bold',
                lineHeight: 1
            }}>
                {value ? trueLabel : falseLabel}
            </span>
        </div>
    );
};

const statItemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
    fontSize: THEME.fontSize.content,
    fontFamily: THEME.fontFamily,
    alignItems: 'center'
};

export default StatBoolItem;
