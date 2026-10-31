import React from 'react';
import {CardProps} from '../ExampleCard';
import {expBadgePillStyle} from '../../../common/styles/uiStyles';

export const ExampleListCard: React.FC<CardProps> = ({
                                                         item,
                                                         hovered,
                                                         isNarrow,
                                                         isLCP,
                                                         thumbUrl,
                                                         description,
                                                         imageAlt,
                                                         imageTitle,
                                                         href,
                                                         onMouseEnter,
                                                         onMouseLeave
}) => {
    return (
        <a
            href={href}
            style={listCardStyle(hovered, isNarrow)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
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
            {item.experimental && <span style={expBadgePillStyle}>EXP</span>}
        </a>
    );
};

const listCardStyle = (hovered: boolean, isNarrow: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    width: '100%',
    minWidth: 0,
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
    fontWeight: 600,
    lineHeight: '1.35',
    color: '#f8f9fa',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flexShrink: 0,
};

const listDescStyle: React.CSSProperties = {
    fontSize: '12.5px',
    lineHeight: '1.5',
    color: '#b0b0ba',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
    minWidth: 0,
};
