import React from 'react';
import {useExamplesStore} from '../../store/useExamplesStore';

const Logo: React.FC = () => {
    const isNarrow = useExamplesStore(state => state.isNarrow);

    return (
        <div style={logoContainer}>
            <div style={{
                display: 'flex',
                flexDirection: isNarrow ? 'column' : 'row',
                alignItems: isNarrow ? 'flex-start' : 'center',
                gap: isNarrow ? '0' : '12px'
            }}>
                <span style={{...titleStyle, fontSize: isNarrow ? '14px' : '18px', lineHeight: '1.2'}}>
                    RedGPU
                </span>
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