import React, {useState} from 'react';

interface IconToggleButtonProps {
    id?: string;
    icon?: string | React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    title?: string;
}

/**
 * [KO] 상태(Active/Inactive)를 가지는 토글 버튼 컴포넌트입니다.
 * - 동심원 곡률(Nested Radius): 외부(12px) - 패딩(4px) = 내부 칩(8px), 높이 36px
 * - 텍스트 토글 버튼: width: auto + 좌우 패딩 12px (Intrinsic Auto-Layout)
 * - 아이콘 토글 버튼: 36px × 36px 알약형 칩 버튼
 */
const IconToggleButton: React.FC<IconToggleButtonProps> = ({icon, label, isActive, onClick, title}) => {
    const [isHovered, setIsHovered] = useState(false);

    const renderIcon = () => {
        if (!icon) return label;
        if (typeof icon === 'string') {
            return <img src={icon} style={iconStyle} alt={label}/>;
        }
        return icon;
    };

    return (
        <button
            style={{
                ...baseButtonStyle,
                width: icon ? '36px' : 'auto',
                padding: icon ? '0' : '0 12px',
                backgroundColor: isActive
                    ? 'rgba(253, 180, 141, 0.16)'
                    : (isHovered ? 'rgba(255, 255, 255, 0.07)' : 'transparent'),
                boxShadow: isActive ? 'inset 0 0 0 1px rgba(253, 180, 141, 0.3)' : 'none',
                color: isActive ? '#fdb48d' : '#fff',
            }}
            onClick={onClick}
            title={title || label}
            aria-label={title || label}
            aria-pressed={isActive}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{
                opacity: isActive ? 1 : (isHovered ? 0.8 : 0.45),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                transition: 'opacity 0.2s'
            }}>
                {renderIcon()}
            </div>
        </button>
    );
};

const baseButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s, box-shadow 0.2s, opacity 0.2s',
    letterSpacing: '0.05em',
    flexShrink: 0,
    boxSizing: 'border-box'
};

const iconStyle: React.CSSProperties = {
    width: '18px',
    height: '18px'
};

export default IconToggleButton;
