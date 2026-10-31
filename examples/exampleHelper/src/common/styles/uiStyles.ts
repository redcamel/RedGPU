import React from 'react';

export const glassSurfaceStyle: React.CSSProperties = {
    backgroundColor: 'rgba(18, 18, 20, 0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    boxSizing: 'border-box',
};

export const glassPillContainerStyle: React.CSSProperties = {
    ...glassSurfaceStyle,
    display: 'flex',
    alignItems: 'center',
    height: '46px',
    gap: '4px',
    borderRadius: '9999px',
    flexShrink: 0,
};

export const glassCircleIslandStyle: React.CSSProperties = {
    ...glassSurfaceStyle,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    flexShrink: 0,
};

export const verticalDividerStyle: React.CSSProperties = {
    width: '1px',
    height: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: '0 2px',
    flexShrink: 0,
};

export const expBadgePillStyle: React.CSSProperties = {
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
