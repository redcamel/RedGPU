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
    padding: isNarrow ? '9px 12px' : '10px 16px',
    backgroundColor: hovered ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.18s',
    gap: isNarrow ? '10px' : '16px',
});

const listThumbStyle: React.CSSProperties = {
    width: '64px',
    height: '36px',
    borderRadius: '6px',
    objectFit: 'cover',
    border: '1px solid rgba(255, 255, 255, 0.08)',
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
};

const listDescStyle: React.CSSProperties = {
    fontSize: '12.5px',
    color: '#8e8e98',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '540px',
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
