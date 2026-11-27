import React from 'react';
import {useExamplesStore} from '../../store/useExamplesStore';

const Logo: React.FC = () => {
    const isNarrow = useExamplesStore(state => state.isNarrow);

    return (
        <div style={logoContainer}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'baseline',
                gap: isNarrow ? '8px' : '12px',
                whiteSpace: 'nowrap',
            }}>
                <h1 style={{...titleStyle, fontSize: isNarrow ? '16px' : '18px', lineHeight: 1, margin: 0}}>
                    <a href="../" style={titleLinkStyle}>
                        <img
                            src="./assets/logo/logo-64.png"
                            alt=""
                            style={logoImageStyle}
                        />
                        <span>RedGPU</span>
                    </a>
                </h1>
                <span style={{
                    ...subTitleStyle,
                    fontSize: isNarrow ? '16px' : '18px',
                    lineHeight: 1,
                }}>
                    Examples
                </span>
            </div>
        </div>
    );
};

const logoContainer: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
};

const titleStyle: React.CSSProperties = {
    fontWeight: 'bold',
    letterSpacing: '0.02em',
    color: '#fff',
};

const titleLinkStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '6px',
    color: 'inherit',
    textDecoration: 'none',
    cursor: 'pointer',
};

const logoImageStyle: React.CSSProperties = {
    display: 'block',
    width: '0.78em',
    height: '0.78em',
    objectFit: 'contain',
    flexShrink: 0,
    transform: 'translateY(0.03em)',
};

const subTitleStyle: React.CSSProperties = {
    color: '#fdb48d',
    fontWeight: 'normal',
};

export default Logo;
