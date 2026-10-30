import React, {useState} from 'react';

interface LabelButtonProps {
    label: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    onClick: () => void;
    title?: string;
    style?: React.CSSProperties;
}

/**
 * [KO] 아이콘+텍스트 캡슐 버튼 컴포넌트입니다.
 */
const LabelButton: React.FC<LabelButtonProps> = ({label, icon, isActive = true, onClick, title, style}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            style={{
                ...baseButtonStyle,
                backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: '#fdb48d',
                ...style
            }}
            onClick={onClick}
            title={title || label}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {icon && <span style={{display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0.4}}>{icon}</span>}
            <span style={{
                opacity: isActive ? 1 : 0.4,
                fontSize: '12px',
                lineHeight: '1.1',
                color: '#fdb48d',
                fontWeight: 'bold',
                transition: 'opacity 0.2s'
            }}>
                {label}
            </span>
        </button>
    );
};

const baseButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    width: 'auto',
    height: '34px',
    padding: '0 12px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '9999px',
    fontSize: '12px',
    lineHeight: '1.1',
    color: '#fdb48d',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    boxSizing: 'border-box',
    pointerEvents: 'auto'
};

export default LabelButton;
