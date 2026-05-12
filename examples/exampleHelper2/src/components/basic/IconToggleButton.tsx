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
 */
const IconToggleButton: React.FC<IconToggleButtonProps> = ({icon, label, isActive, onClick, title}) => {
    const [isHovered, setIsHovered] = useState(false);

    const themeColor = '#fff';
    const idleBgColor = '#111112';
    const hoverBgColor = '#1a1a1c';

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
                width: icon ? '52px' : 'auto',
                padding: icon ? '0' : '0 20px',
                backgroundColor: isHovered ? hoverBgColor : idleBgColor,
                color: themeColor,
            }}
            onClick={onClick}
            title={title || label}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{
                opacity: isActive ? 1 : 0.2,
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
    height: '100%',
    backgroundColor: '#111112',
    border: 'none',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s, opacity 0.2s',
    letterSpacing: '0.05em',
    flexShrink: 0,
    boxSizing: 'border-box'
};

const iconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px'
};

export default IconToggleButton;
