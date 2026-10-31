import React from 'react';
import {ExampleItem} from '../../../types/example';
import {useExamplesStore} from '../../store/useExamplesStore';

interface CardProps {
    item: ExampleItem;
    language: 'ko' | 'en';
    hovered: boolean;
    isNarrow: boolean;
    isLCP: boolean;
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
    const isCompact = useExamplesStore(state => state.isCompact);
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
            style={cardStyle(hovered, isNarrow)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div style={{
                ...thumbWrapperStyle,
                aspectRatio: isCompact ? '8 / 3' : '16 / 10',
            }}>
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
            <div style={{
                padding: isCompact ? '8px 8px 4px' : (isNarrow ? '10px 8px 6px' : '11px 10px 7px')
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                    gap: '8px'
                }}>
                    <div style={{...titleStyle, fontSize: isNarrow ? '13px' : '14px'}}>{item.name}</div>
                    {item.experimental && <span style={experimentalBadgeStyle}>EXP</span>}
                </div>
                <div style={{...descStyle, fontSize: isNarrow ? '11.5px' : '12px'}}
                     title={plainDescription}
                     dangerouslySetInnerHTML={{__html: description}}/>
            </div>
        </a>
    );
};

const cardStyle = (hovered: boolean, isNarrow: boolean): React.CSSProperties => ({
    display: 'block',
    textDecoration: 'none',
    backgroundColor: hovered ? 'rgba(22, 22, 28, 0.78)' : 'rgba(14, 14, 18, 0.68)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1px solid ${hovered ? 'rgba(253, 180, 141, 0.45)' : 'rgba(255, 255, 255, 0.09)'}`,
    borderRadius: '16px',
    padding: '6px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: (!isNarrow && hovered) ? 'translateY(-4px)' : 'none',
    boxShadow: hovered ? '0 14px 34px rgba(0, 0, 0, 0.55)' : '0 6px 20px rgba(0, 0, 0, 0.3)',
    width: '100%',
});

const thumbWrapperStyle: React.CSSProperties = {
    position: 'relative',
    borderRadius: '11px',
    overflow: 'hidden',
    backgroundColor: '#09090b',
    border: '1px solid rgba(255, 255, 255, 0.06)',
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

const titleStyle: React.CSSProperties = {
    fontWeight: 600,
    letterSpacing: '-0.01em',
    color: '#f8f9fa',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const descStyle: React.CSSProperties = {
    color: '#9898a2',
    lineHeight: '1.4',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
