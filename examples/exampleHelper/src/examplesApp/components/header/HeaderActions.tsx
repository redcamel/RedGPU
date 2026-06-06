import React from 'react';
import {useExamplesStore} from '../../store/useExamplesStore';
import {OutLinkIcon} from '../../../common/components/Icons';
import IconButton from '../../../common/components/basic/IconButton';

const HeaderActions: React.FC = () => {
    const isNarrow = useExamplesStore(state => state.isNarrow);
    const language = useExamplesStore(state => state.language);

    const openLink = (url: string) => window.open(url, '_blank');

    return (
        <div style={rightSection}>
            <IconButton
                icon={<OutLinkIcon color="#fff" size={isNarrow ? 14 : 18} />}
                label="GITHUB"
                onClick={() => openLink('https://github.com/redcamel/RedGPU')}
                title="GitHub Repository"
            />
            {!isNarrow && (
                <>
                    <button style={manualButtonStyle} onClick={() => openLink('/RedGPU/manual/')}>
                        MANUAL
                    </button>
                    <button style={manualButtonStyle}
                            onClick={() => openLink(`/RedGPU/manual/${language}/api/RedGPU-API/namespaces/RedGPU/README.html`)}>
                        API
                    </button>
                </>
            )}
        </div>
    );
};

const rightSection: React.CSSProperties = {
    display: 'flex',
    alignItems: 'stretch',
    gap: '1px',
};

const manualButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#e0e0e0',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '0 15px',
    transition: 'color 0.2s',
};

export default HeaderActions;