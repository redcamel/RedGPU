import React, {useEffect, useRef, useState} from 'react';

/**
 * [KO] 커스텀 드롭다운 선택 박스 컴포넌트의 프롭스 정의입니다.
 */
interface SelectBoxProps {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    style?: React.CSSProperties;
}

/**
 * [KO] 커스텀 스타일이 적용된 선택 박스 컴포넌트입니다.
 */
const SelectBox: React.FC<SelectBoxProps> = ({label, value, options, onChange, style}) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [openDirection, setOpenDirection] = useState<'up' | 'down'>('down');
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

    const toggleDropdown = () => {
        if (!isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            // 화면 하단에 가까우면 위로 열기 (If close to the bottom of the screen, open upwards)
            if (rect.bottom > viewportHeight / 2) {
                setOpenDirection('up');
            } else {
                setOpenDirection('down');
            }
        }
        setIsOpen(!isOpen);
    };

    const currentLabel = options.find(opt => opt.value === value)?.label || value;

    return (
        <div
            ref={dropdownRef}
            style={{
                ...selectBoxStyle,
                backgroundColor: (isHovered || isOpen) ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                ...style
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={toggleDropdown}
        >
            <span style={titleLabelStyle}>{label}</span>
            <div style={customSelectTriggerStyle}>
                <span style={currentValueStyle} title={currentLabel}>{currentLabel}</span>
                <div style={{
                    ...arrowIconStyle,
                    transform: isOpen
                        ? (openDirection === 'up' ? 'rotate(0deg)' : 'rotate(180deg)')
                        : (openDirection === 'up' ? 'rotate(180deg)' : 'rotate(0deg)')
                }}/>
            </div>

            {isOpen && (
                <div style={{
                    ...optionsListStyle,
                    top: openDirection === 'down' ? 'calc(100% + 8px)' : 'auto',
                    bottom: openDirection === 'up' ? 'calc(100% + 8px)' : 'auto',
                    boxShadow: openDirection === 'down'
                        ? '0 12px 32px rgba(0,0,0,0.55)'
                        : '0 -12px 32px rgba(0,0,0,0.55)',
                }}>
                    {options.map(option => {
                        const isSelected = value === option.value;
                        const isItemHovered = hoveredOption === option.value;
                        return (
                            <div
                                key={option.value}
                                style={{
                                    ...optionItemStyle,
                                    backgroundColor: isSelected
                                        ? 'rgba(253, 180, 141, 0.16)'
                                        : (isItemHovered ? 'rgba(255, 255, 255, 0.06)' : 'transparent'),
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: '7px',
    height: '36px',
    padding: '0 12px',
    borderRadius: '9999px',
    backgroundColor: 'transparent',
    border: 'none',
    minWidth: 0,
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
};

const titleLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#8e8e93',
    fontWeight: 500,
    lineHeight: '1',
    whiteSpace: 'nowrap'
};

const customSelectTriggerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    minWidth: 0,
    gap: '5px'
};

const currentValueStyle: React.CSSProperties = {
    fontSize: '13px',
    lineHeight: '1.1',
    color: '#fdb48d',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: 0
};

const arrowIconStyle: React.CSSProperties = {
    width: '11px',
    height: '11px',
    marginLeft: '1px',
    flexShrink: 0,
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fdb48d%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    transition: 'transform 0.2s ease-in-out'
};

const optionsListStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    minWidth: '100%',
    width: 'max-content',
    backgroundColor: 'rgba(22, 22, 24, 0.94)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '14px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.55)',
    zIndex: 10004,
    display: 'flex',
    flexDirection: 'column',
    padding: '4px',
    gap: '1px',
    overflow: 'hidden'
};

const optionItemStyle: React.CSSProperties = {
    padding: '8px 13px',
    fontSize: '13px',
    fontWeight: 'bold',
    borderRadius: '9999px',
    cursor: 'pointer',
    transition: 'background-color 0.1s, color 0.1s',
    whiteSpace: 'nowrap'
};

export default SelectBox;
