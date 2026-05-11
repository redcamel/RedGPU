import React, {useState} from 'react';

interface IconToggleButtonProps {
    id?: string;
    icon?: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
    title?: string;
}

/**
 * [KO] 상태(Active/Inactive)를 가지는 토글 버튼 컴포넌트입니다.
 */
const IconToggleButton: React.FC<IconToggleButtonProps> = ({ icon, label, isActive, onClick, title }) => {
    const [isHovered, setIsHovered] = useState(false);

    const themeColor = '#fdb48d';
    const mutedColor = '#666';

    const idleBgColor = '#111112';
    const hoverBgColor = '#1a1a1c';

    return (
        <button
            style={{
                ...baseButtonStyle,
                width: icon ? '52px' : 'auto',
                padding: icon ? '0' : '0 20px',
                backgroundColor: isHovered ? hoverBgColor : idleBgColor,
                color: isActive ? themeColor : mutedColor,
            }}
            onClick={onClick}
            title={title || label}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {icon ? (
                <img 
                    src={icon} 
                    style={{
                        ...iconStyle,
                        filter: isActive ? 'none' : 'grayscale(1)'
                    }} 
                    alt={label} 
                />
            ) : (
                label
            )}
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
    transition: 'background-color 0.2s, color 0.2s',
    letterSpacing: '0.05em',
    flexShrink: 0,
    boxSizing: 'border-box'
};

const iconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px'
};

export default IconToggleButton;
