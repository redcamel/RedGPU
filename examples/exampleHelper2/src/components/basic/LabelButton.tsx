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
 */
const LabelButton: React.FC<LabelButtonProps> = ({ label, isActive = true, onClick, title, style }) => {
    const [isHovered, setIsHovered] = useState(false);

    const themeColor = '#fdb48d';
    const mutedColor = '#666';

    return (
        <button
            style={{
                ...baseButtonStyle,
                backgroundColor: isHovered ? '#1a1a1c' : '#111112',
                color: isActive ? themeColor : mutedColor,
                ...style
            }}
            onClick={onClick}
            title={title || label}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {label}
        </button>
    );
};

const baseButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '0 20px',
    backgroundColor: '#111112',
    border: 'none',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s',
    letterSpacing: '0.05em',
    flexShrink: 0
};

export default LabelButton;
