import React from 'react';
import {ExampleItem} from '../../../types/example';

interface CardProps {
    item: ExampleItem;
    language: 'ko' | 'en';
    hovered: boolean;
    isNarrow: boolean;
    isLCP: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export const ExampleListCard: React.FC<CardProps> = ({
                                                         item,
                                                         language,
                                                         hovered,
                                                         isNarrow,
                                                         isLCP,
                                                         onMouseEnter,
                                                         onMouseLeave
}) => {
    const thumbUrl = item.path ? `/RedGPU/examples/${item.path}/thumb.webp` : '';
    const description = item.description ? (item.description[language] || item.description['en']) : '';

    const plainDescription = description.replace(/<[^>]*>?/gm, '').trim();
    const altSuffix = language === 'ko' ? 'RedGPU WebGPU 예제' : 'RedGPU WebGPU Example';
    const imageAlt = `${item.name} - ${altSuffix}`;
    const imageTitle = plainDescription || item.name;

    const href = item.path ? `/RedGPU/examples/${item.path}/index.html` : '#';

    return (
        <a
            href={href}
            style={{...listCardStyle(hovered, isNarrow), textDecoration: 'none', display: 'flex'}}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={() => {
            }}
        >
            <img
                src={thumbUrl}
                style={listThumbStyle}
                alt={imageAlt}
                title={imageTitle}
                loading={isLCP ? "eager" : "lazy"}
                {...(isLCP ? { fetchPriority: "high" } : {})}
            />
            <div style={listContentStyle}>
                <div style={{...titleStyle, fontSize: isNarrow ? '12.5px' : '14px'}}>{item.name}</div>
                {!isNarrow && <div style={listDescStyle} dangerouslySetInnerHTML={{__html: description}} />}
            </div>
            {item.experimental && <span style={experimentalBadgeStyle}>EXP</span>}
        </a>
    );
};

const listCardStyle = (hovered: boolean, isNarrow: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: isNarrow ? '8px 12px' : '8px 14px',
    backgroundColor: hovered ? 'rgba(24, 24, 30, 0.82)' : 'rgba(18, 18, 20, 0.76)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1px solid ${hovered ? 'rgba(253, 180, 141, 0.45)' : 'rgba(255, 255, 255, 0.09)'}`,
    borderRadius: '12px',
    boxShadow: hovered ? '0 8px 24px rgba(0, 0, 0, 0.45)' : '0 4px 14px rgba(0, 0, 0, 0.25)',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    gap: isNarrow ? '10px' : '16px',
});

const listThumbStyle: React.CSSProperties = {
    width: '68px',
    height: '42px',
    borderRadius: '8px',
    objectFit: 'cover',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    flexShrink: 0,
};

const listContentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    minWidth: 0,
};

const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#f8f9fa',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flexShrink: 0,
};

const listDescStyle: React.CSSProperties = {
    fontSize: '12.5px',
    color: '#b0b0ba',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
    minWidth: 0,
};

const experimentalBadgeStyle: React.CSSProperties = {
    fontSize: '9px',
    backgroundColor: 'rgba(255, 90, 95, 0.16)',
    color: '#ff7b80',
    border: '1px solid rgba(255, 90, 95, 0.35)',
    padding: '2px 7px',
    borderRadius: '9999px',
    fontWeight: 700,
    lineHeight: '1.1',
    flexShrink: 0,
};

export default ExampleListCard;
