import React, {useState} from 'react';
import {TopBarAction} from '../../store';

/**
 * [KO] 상단 바의 개별 액션 버튼 컴포넌트입니다.
 */
const IconButton: React.FC<{ action: TopBarAction }> = ({ action }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            style={{
                ...actionButtonStyle,
                width: action.icon ? '52px' : 'auto',
                padding: action.icon ? '0' : '0 20px',
                backgroundColor: isHovered ? '#1a1a1c' : '#111112',
            }}
            onClick={action.onClick}
            title={action.label}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {action.icon ? (
                <img src={action.icon} style={actionIconStyle} alt={action.label} />
            ) : (
                action.label
            )}
        </button>
    );
};

const actionButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 20px',
    height: '100%',
    backgroundColor: '#111112',
    color: '#fdb48d',
    border: 'none',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s',
    letterSpacing: '0.05em'
};

const actionIconStyle: React.CSSProperties = {
    width: '18px',
    height: '18px'
};

export default IconButton;
