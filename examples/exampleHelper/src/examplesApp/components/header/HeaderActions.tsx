import React from 'react';
import {useExamplesStore} from '../../store/useExamplesStore';
import {GitHubIcon} from '../../../common/components/Icons';
import IconButton from '../../../common/components/basic/IconButton';
import LabelButton from '../../../common/components/basic/LabelButton';
import {glassPillContainerStyle, verticalDividerStyle} from '../../../common/styles/uiStyles';

const HeaderActions: React.FC = () => {
    const isNarrow = useExamplesStore(state => state.isNarrow);
    const hideManual = useExamplesStore(state => state.hideManual);
    const language = useExamplesStore(state => state.language);

    const openLink = (url: string) => window.open(url, '_blank');

    return (
        <div style={{
            ...rightSectionStyle,
            padding: isNarrow ? '4px' : '4px 8px 4px 6px',
        }}>
            {!isNarrow && (
                <>
                    {!hideManual && (
                        <>
                            <LabelButton
                                label="MANUAL"
                                style={labelButtonStyle}
                                onClick={() => openLink('/RedGPU/manual/')}
                            />
                            <div style={verticalDividerStyle}/>
                        </>
                    )}
                    <LabelButton
                        label="API"
                        style={labelButtonStyle}
                        onClick={() => openLink(`/RedGPU/manual/${language}/api/RedGPU-API/namespaces/RedGPU/README.html`)}
                    />
                    <div style={verticalDividerStyle}/>
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
    ...glassPillContainerStyle,
    pointerEvents: 'auto',
};

const labelButtonStyle: React.CSSProperties = {
    padding: '0 11px',
};

export default HeaderActions;
