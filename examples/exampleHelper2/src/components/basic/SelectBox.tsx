import React, {useEffect, useRef, useState} from 'react';

/**
 * [KO] 커스텀 드롭다운 선택 박스 컴포넌트의 프롭스 정의입니다.
 */
interface SelectBoxProps {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
}

/**
 * [KO] 커스텀 스타일이 적용된 선택 박스 컴포넌트입니다.
 */
const SelectBox: React.FC<SelectBoxProps> = ({ label, value, options, onChange }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLabel = options.find(opt => opt.value === value)?.label || value;

    return (
        <div
            ref={dropdownRef}
            style={{
                ...selectBoxStyle,
                backgroundColor: (isHovered || isOpen) ? '#1a1a1c' : '#111112',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsOpen(!isOpen)}
        >
            <span style={titleLabelStyle}>{label}</span>
            <div style={customSelectTriggerStyle}>
                <span style={currentValueStyle}>{currentLabel}</span>
                <div style={{
                    ...arrowIconStyle,
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }} />
            </div>

            {isOpen && (
                <div style={optionsListStyle}>
                    {options.map(option => {
                        const isSelected = value === option.value;
                        const isItemHovered = hoveredOption === option.value;
                        return (
                            <div
                                key={option.value}
                                style={{
                                    ...optionItemStyle,
                                    backgroundColor: isSelected ? '#2a2a2c' : (isItemHovered ? '#252527' : 'transparent'),
                                    color: (isSelected || isItemHovered) ? '#fff' : '#fdb48d'
                                }}
                                onMouseEnter={() => setHoveredOption(option.value)}
                                onMouseLeave={() => setHoveredOption(null)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                {option.label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// Styles
const selectBoxStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 16px',
    backgroundColor: '#111112',
    minWidth: '110px',
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    userSelect: 'none'
};

const titleLabelStyle: React.CSSProperties = {
    fontSize: '9px',
    color: '#666',
    fontWeight: 'bold',
    marginBottom: '2px'
};

const customSelectTriggerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
};

const currentValueStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#fdb48d',
    fontWeight: 'bold',
};

const arrowIconStyle: React.CSSProperties = {
    width: '10px',
    height: '10px',
    marginLeft: '8px',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fdb48d%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    transition: 'transform 0.2s ease-in-out'
};

const optionsListStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1c',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
    zIndex: 10004,
    display: 'flex',
    flexDirection: 'column',
    padding: '4px 0',
};

const optionItemStyle: React.CSSProperties = {
    padding: '10px 16px',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.1s, color 0.1s',
};

export default SelectBox;
