import React, {useState} from 'react';

interface LabelButtonProps {
    label: string;
    isActive?: boolean;
    onClick: () => void;
    title?: string;
    style?: React.CSSProperties;
}

/**
 * [KO] 텍스트 라벨 전용 버튼 컴포넌트입니다.
 * Intrinsic Auto-Layout: width: auto + 상하/좌우 비례 여백(height: 32px, padding: 0 14px, borderRadius: 8px)
 */
const LabelButton: React.FC<LabelButtonProps> = ({label, isActive = true, onClick, title, style}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            style={{
                ...baseButtonStyle,
                backgroundColor: isHovered ? '#fdb48d' : 'rgba(253, 180, 141, 0.14)',
                borderColor: isHovered ? '#fdb48d' : 'rgba(253, 180, 141, 0.4)',
                color: isHovered ? '#111112' : '#fdb48d',
                ...style
            }}
            onClick={onClick}
            title={title || label}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span style={{
                opacity: isActive ? 1 : 0.4,
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
    width: 'auto',
    height: '36px',
    padding: '0 13px',
    backgroundColor: 'rgba(253, 180, 141, 0.14)',
    border: '1px solid rgba(253, 180, 141, 0.4)',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    boxSizing: 'border-box',
    pointerEvents: 'auto'
};

export default LabelButton;
