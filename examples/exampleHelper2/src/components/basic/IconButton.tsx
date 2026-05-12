import React, {useState} from 'react';

interface IconButtonProps {
    icon: string | React.ReactNode;
    label: string;
    onClick: () => void;
    title?: string;
}

/**
 * [KO] 아이콘 전용 버튼 컴포넌트입니다.
 */
const IconButton: React.FC<IconButtonProps> = ({icon, label, onClick, title}) => {
    const [isHovered, setIsHovered] = useState(false);

    const renderIcon = () => {
        if (typeof icon === 'string') {
            return <img src={icon} style={iconStyle} alt={label}/>;
        }
        return icon;
    };

    return (
        <button
            style={{
                ...baseButtonStyle,
                width: '52px',
                backgroundColor: isHovered ? '#1a1a1c' : '#111112',
            }}
            onClick={onClick}
            title={title || label}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {renderIcon()}
        </button>
    );
};

const baseButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#111112',
    color: '#fdb48d',
    border: 'none',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s',
    letterSpacing: '0.05em',
    padding: 0,
    flexShrink: 0
};

const iconStyle: React.CSSProperties = {
    width: '18px',
    height: '18px'
};

export default IconButton;
