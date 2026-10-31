import React from 'react';
import {useExamplesStore} from '../../store/useExamplesStore';

const Logo: React.FC = () => {
    const isNarrow = useExamplesStore(state => state.isNarrow);

    return (
        <div style={{
            ...logoContainer,
            height: isNarrow ? '38px' : '44px',
            padding: isNarrow ? '0 14px' : '0 20px',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: isNarrow ? 'column' : 'row',
                alignItems: isNarrow ? 'flex-start' : 'center',
                gap: isNarrow ? '0' : '12px'
            }}>
                <h1 style={{...titleStyle, fontSize: isNarrow ? '14px' : '18px', lineHeight: '1.2', margin: 0}}>
                    RedGPU
                </h1>
                <span style={{
                    ...subTitleStyle,
                    fontSize: isNarrow ? '12px' : '18px',
                    marginTop: isNarrow ? '-2px' : '0',
                    opacity: isNarrow ? 0.7 : 1
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
    backgroundColor: 'rgba(14, 14, 18, 0.72)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '9999px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    flexShrink: 0,
};

const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '0.02em',
    color: '#fff',
};

const subTitleStyle: React.CSSProperties = {
    color: '#fdb48d',
    fontWeight: 'normal',
};

export default Logo;
