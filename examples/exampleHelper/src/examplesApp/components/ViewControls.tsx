import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import {GitHubIcon} from '../../common/components/Icons';
import IconButton from '../../common/components/basic/IconButton';

const ViewControls: React.FC = () => {
    const viewMode = useExamplesStore(state => state.viewMode);
    const setViewMode = useExamplesStore(state => state.setViewMode);
    const language = useExamplesStore(state => state.language);
    const setLanguage = useExamplesStore(state => state.setLanguage);
    const isNarrow = useExamplesStore(state => state.isNarrow);

    return (
        <div style={{
            ...containerStyle,
            padding: isNarrow ? '4px 8px 4px 6px' : '4px 4px 4px 6px',
        }}>
            <button
                style={buttonStyle}
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                title={viewMode === 'grid' ? 'Grid View' : 'List View'}
                aria-label={viewMode === 'grid' ? 'Grid View' : 'List View'}
            >
                {viewMode === 'grid' ? '▤' : '☰'}
            </button>

            <div style={divider} />

            <button
                style={{
                    ...langButtonStyle,
                    padding: isNarrow ? '0 11px' : '0 13px 0 11px',
                }}
                onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
                aria-label={`Switch to ${language === 'ko' ? 'English' : 'Korean'}`}
            >
                {language === 'ko' ? 'KO' : 'EN'}
            </button>

            {isNarrow && (
                <>
                    <div style={divider}/>
                    <div style={{display: 'flex', marginLeft: '2px'}}>
                        <IconButton
                            icon={<GitHubIcon color="#fff" size={18}/>}
                            label="GITHUB"
                            onClick={() => window.open('https://github.com/redcamel/RedGPU', '_blank')}
                            title="GitHub Repository"
                        />
                    </div>
                </>
            )}
        </div>
    );
};

const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '46px',
    padding: '4px',
    gap: '4px',
    backgroundColor: 'rgba(18, 18, 20, 0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '9999px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    boxSizing: 'border-box',
    flexShrink: 0,
};

const buttonStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color: '#fdb48d',
    border: 'none',
    outline: 'none',
    borderRadius: '9999px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.18s ease',
    padding: 0,
    flexShrink: 0,
};

const langButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    height: '36px',
    padding: '0 11px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '9999px',
    color: '#fdb48d',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '0.04em',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
};

const divider: React.CSSProperties = {
    width: '1px',
    height: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: '0 2px',
    flexShrink: 0,
};

export default ViewControls;
