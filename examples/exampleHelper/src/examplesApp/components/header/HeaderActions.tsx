import React from 'react';
import {useExamplesStore} from '../../store/useExamplesStore';
import {GitHubIcon} from '../../../common/components/Icons';
import IconButton from '../../../common/components/basic/IconButton';
import LabelButton from '../../../common/components/basic/LabelButton';

const HeaderActions: React.FC = () => {
    const isNarrow = useExamplesStore(state => state.isNarrow);
    const language = useExamplesStore(state => state.language);

    const openLink = (url: string) => window.open(url, '_blank');

    return (
        <div style={{
            ...rightSectionStyle,
            padding: isNarrow ? '4px' : '4px 8px 4px 6px',
        }}>
            {!isNarrow && (
                <>
                    <LabelButton
                        label="MANUAL"
                        style={labelButtonStyle}
                        onClick={() => openLink('/RedGPU/manual/')}
                    />
                    <div style={dividerStyle}/>
                    <LabelButton
                        label="API"
                        style={labelButtonStyle}
                        onClick={() => openLink(`/RedGPU/manual/${language}/api/RedGPU-API/namespaces/RedGPU/README.html`)}
                    />
                    <div style={dividerStyle}/>
                </>
            )}
            <div style={!isNarrow ? {display: 'flex', marginLeft: '2px'} : {display: 'flex'}}>
                <IconButton
                    icon={<GitHubIcon color="#fff" size={18}/>}
                    label="GITHUB"
                    onClick={() => openLink('https://github.com/redcamel/RedGPU')}
                    title="GitHub Repository"
                />
            </div>
        </div>
    );
};

const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '46px',
    flexShrink: 0,
    padding: '4px',
    gap: '4px',
    backgroundColor: 'rgba(18, 18, 20, 0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '9999px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    boxSizing: 'border-box',
    pointerEvents: 'auto',
};

const labelButtonStyle: React.CSSProperties = {
    padding: '0 11px',
};

const dividerStyle: React.CSSProperties = {
    width: '1px',
    height: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: '0 2px',
    flexShrink: 0,
};

export default HeaderActions;
