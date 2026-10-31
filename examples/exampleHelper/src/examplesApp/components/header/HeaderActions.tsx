import React from 'react';
import {useExamplesStore} from '../../store/useExamplesStore';
import {GitHubIcon} from '../../../common/components/Icons';
import IconButton from '../../../common/components/basic/IconButton';

const HeaderActions: React.FC = () => {
    const isNarrow = useExamplesStore(state => state.isNarrow);
    const language = useExamplesStore(state => state.language);

    const openLink = (url: string) => window.open(url, '_blank');

    return (
        <div style={{
            ...rightSection,
            height: isNarrow ? '38px' : '44px',
            padding: isNarrow ? '0 4px' : '0 6px',
        }}>
            {!isNarrow && (
                <>
                    <button style={pillButtonStyle} onClick={() => openLink('/RedGPU/manual/')}>
                        MANUAL
                    </button>
                    <button
                        style={pillButtonStyle}
                        onClick={() => openLink(`/RedGPU/manual/${language}/api/RedGPU-API/namespaces/RedGPU/README.html`)}
                    >
                        API
                    </button>
                    <div style={dividerStyle}/>
                </>
            )}
            <IconButton
                icon={<GitHubIcon color="#fff" size={isNarrow ? 17 : 18}/>}
                label="GITHUB"
                onClick={() => openLink('https://github.com/redcamel/RedGPU')}
                title="GitHub Repository"
            />
        </div>
    );
};

const rightSection: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(14, 14, 18, 0.72)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '9999px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    flexShrink: 0,
};

const dividerStyle: React.CSSProperties = {
    width: '1px',
    height: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: '0 2px',
};

const pillButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '32px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.09)',
    borderRadius: '9999px',
    color: '#fdb48d',
    fontSize: '11.5px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    cursor: 'pointer',
    padding: '0 14px',
    transition: 'all 0.18s ease',
};

export default HeaderActions;
