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

export const ExampleGridCard: React.FC<CardProps> = ({
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
            style={{...cardStyle(hovered, isNarrow), textDecoration: 'none', display: 'block'}}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={() => {
            }}
        >
            <div style={thumbWrapperStyle}>
                <img
                    src={thumbUrl}
                    style={thumbStyle(hovered)}
                    alt={imageAlt}
                    title={imageTitle}
                    loading={isLCP ? "eager" : "lazy"}
                    {...(isLCP ? { fetchPriority: "high" } : {})}
                />
                {!isNarrow && (
                    <div style={overlayStyle(hovered)}>
                        <div style={viewButtonStyle}>VIEW EXAMPLE</div>
                    </div>
                )}
            </div>
            <div style={{...contentStyle, padding: isNarrow ? '13px 14px' : '16px 18px'}}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '7px',
                    gap: '8px'
                }}>
                    <div style={{...titleStyle, fontSize: isNarrow ? '13.5px' : '14.5px'}}>{item.name}</div>
                    {item.experimental && <span style={experimentalBadgeStyle}>EXP</span>}
                </div>
                <div style={{...descStyle, fontSize: isNarrow ? '11.5px' : '12.5px'}}
                     dangerouslySetInnerHTML={{__html: description}}/>
            </div>
        </a>
    );
};

const cardStyle = (hovered: boolean, isNarrow: boolean): React.CSSProperties => ({
    backgroundColor: '#121215',
    border: `1px solid ${hovered ? 'rgba(253, 180, 141, 0.45)' : 'rgba(255, 255, 255, 0.08)'}`,
    borderRadius: '14px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: (!isNarrow && hovered) ? 'translateY(-4px)' : 'none',
    boxShadow: hovered ? '0 14px 34px rgba(0, 0, 0, 0.55)' : '0 4px 14px rgba(0, 0, 0, 0.25)',
    width: '100%',
});

const thumbWrapperStyle: React.CSSProperties = {
    position: 'relative',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    backgroundColor: '#09090b',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
};

const thumbStyle = (hovered: boolean): React.CSSProperties => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)',
    transform: hovered ? 'scale(1.06)' : 'scale(1)',
});

const overlayStyle = (hovered: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(9, 9, 11, 0.45)',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: hovered ? 1 : 0,
    transition: 'opacity 0.25s ease',
});

const viewButtonStyle: React.CSSProperties = {
    padding: '8px 18px',
    backgroundColor: '#fdb48d',
    color: '#111113',
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '0.05em',
    borderRadius: '9999px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.45)',
};

const contentStyle: React.CSSProperties = {
    padding: '16px 18px',
};

const titleStyle: React.CSSProperties = {
    fontSize: '14.5px',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    color: '#f8f9fa',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const descStyle: React.CSSProperties = {
    fontSize: '12.5px',
    color: '#9898a2',
    lineHeight: '1.55',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    height: '39px',
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
