import React from 'react';
import {ExampleItem} from '../../../types/example';

interface CardProps {
    item: ExampleItem;
    language: 'ko' | 'en';
    hovered: boolean;
    isNarrow: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export const ExampleGridCard: React.FC<CardProps> = ({
    item, language, hovered, isNarrow, onClick, onMouseEnter, onMouseLeave
}) => {
    const thumbUrl = item.path ? `/RedGPU/examples/${item.path}/thumb.webp` : '';
    const description = item.description ? (item.description[language] || item.description['en']) : '';
    const href = item.path ? `/RedGPU/examples/${item.path}/index.html` : '#';

    return (
        <a 
            href={href}
            style={{...cardStyle(hovered, isNarrow), textDecoration: 'none', display: 'block'}}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={(e) => {
                // [KO] 기본 이동은 허용하되, 필요한 경우 추가 로직 수행 (현재는 그냥 이동)
                // [EN] Allow default navigation, perform additional logic if needed (currently just navigating)
            }}
        >
            <div style={thumbWrapperStyle}>
                <img src={thumbUrl} style={thumbStyle(hovered)} alt={item.name} loading="lazy" />
                {!isNarrow && (
                    <div style={overlayStyle(hovered)}>
                        <div style={viewButtonStyle}>VIEW EXAMPLE</div>
                    </div>
                )}
            </div>
            <div style={{...contentStyle, padding: isNarrow ? '12px' : '16px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                    <div style={{...titleStyle, fontSize: isNarrow ? '13px' : '14px'}}>{item.name}</div>
                    {item.experimental && <span style={{...experimentalBadgeStyle, fontSize: '8px'}}>EXP</span>}
                </div>
                <div style={{...descStyle, fontSize: isNarrow ? '11px' : '12px'}} dangerouslySetInnerHTML={{__html: description}} />
            </div>
        </a>
    );
};

// Styles for Grid Card
const cardStyle = (hovered: boolean, isNarrow: boolean): React.CSSProperties => ({
    backgroundColor: '#111112',
    border: `1px solid ${hovered ? '#444' : '#222'}`,
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: (!isNarrow && hovered) ? 'translateY(-5px)' : 'none',
    boxShadow: hovered ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
    maxWidth: isNarrow ? 'none' : '400px',
});

const thumbWrapperStyle: React.CSSProperties = {
    position: 'relative',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    backgroundColor: '#0a0a0b',
};

const thumbStyle = (hovered: boolean): React.CSSProperties => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
    transform: hovered ? 'scale(1.1)' : 'scale(1)',
});

const overlayStyle = (hovered: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: hovered ? 1 : 0,
    transition: 'opacity 0.3s ease',
});

const viewButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: '#fdb48d',
    color: '#000',
    fontSize: '11px',
    fontWeight: 'bold',
    borderRadius: '4px',
};

const contentStyle: React.CSSProperties = {
    padding: '16px',
};

const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#eee',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const descStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#888',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    height: '36px',
};

const experimentalBadgeStyle: React.CSSProperties = {
    fontSize: '9px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 'bold',
};