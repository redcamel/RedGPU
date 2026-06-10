import React from 'react';
import {COMMON_STYLES} from './Theme';

/**
 * [KO] 접고 펼치기 상태를 표시하고 전환하는 공통 토글 버튼 컴포넌트입니다.
 * [EN] A common toggle button component that displays and switches the expanded/collapsed state.
 */
interface ToggleButtonProps {
    isExpanded: boolean;
    onClick?: (e: React.MouseEvent) => void;
    visible?: boolean;
    style?: React.CSSProperties;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
                                                       isExpanded,
                                                       onClick,
                                                       visible = true,
                                                       style
                                                   }) => {
    return (
        <div
            onClick={onClick}
            style={{
                cursor: onClick ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                visibility: visible ? 'visible' : 'hidden',
                flexShrink: 0,
                ...style
            }}
        >
            <span style={COMMON_STYLES.toggleButton}>{isExpanded ? '-' : '+'}</span>
        </div>
    );
};

export default ToggleButton;
