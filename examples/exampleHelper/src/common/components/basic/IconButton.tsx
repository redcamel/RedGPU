import React, {useState} from 'react';

interface IconButtonProps {
    icon: string | React.ReactNode;
    label: string;
    onClick: () => void;
    title?: string;
}

/**
 * [KO] 아이콘 전용 버튼 컴포넌트입니다.
 * 동심원 곡률(Nested Radius): 외부 컨테이너(12px) - 패딩(4px) = 내부 버튼(8px), 36px × 36px
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
                backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
            }}
            onClick={onClick}
            title={title || label}
            aria-label={title || label}
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
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    color: '#f4f4f5',
    border: 'none',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.15s, color 0.15s',
    padding: 0,
    flexShrink: 0
};

const iconStyle: React.CSSProperties = {
    width: '16px',
    height: '16px'
};

export default IconButton;
