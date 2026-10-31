import React from 'react';
import {useExamplesStore} from '../../store/useExamplesStore';

const Logo: React.FC = () => {
    const isNarrow = useExamplesStore(state => state.isNarrow);

    return (
        <div style={logoContainer}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: isNarrow ? '8px' : '12px',
                whiteSpace: 'nowrap',
            }}>
                <h1 style={{...titleStyle, fontSize: isNarrow ? '16px' : '18px', lineHeight: '1.2', margin: 0}}>
                    <a href="../" style={titleLinkStyle}>
                        RedGPU
                    </a>
                </h1>
                <span style={{
                    ...subTitleStyle,
                    fontSize: isNarrow ? '16px' : '18px',
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
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '0.02em',
    color: '#fff',
};

const titleLinkStyle: React.CSSProperties = {
    color: 'inherit',
    textDecoration: 'none',
    cursor: 'pointer',
};

const subTitleStyle: React.CSSProperties = {
    color: '#fdb48d',
    fontWeight: 'normal',
};

export default Logo;
