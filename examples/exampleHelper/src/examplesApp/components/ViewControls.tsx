import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';

const ViewControls: React.FC = () => {
    const viewMode = useExamplesStore(state => state.viewMode);
    const setViewMode = useExamplesStore(state => state.setViewMode);
    const language = useExamplesStore(state => state.language);
    const setLanguage = useExamplesStore(state => state.setLanguage);

    return (
        <div style={containerStyle}>
            <div style={groupStyle}>
                <button
                    style={buttonStyle(viewMode === 'grid')}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                    aria-label="Grid View"
                    aria-pressed={viewMode === 'grid'}
                >
                    ▤
                </button>
                <button
                    style={buttonStyle(viewMode === 'list')}
                    onClick={() => setViewMode('list')}
                    title="List View"
                    aria-label="List View"
                    aria-pressed={viewMode === 'list'}
                >
                    ☰
                </button>
            </div>

            <div style={divider} />

            <button
                style={langButtonStyle}
                onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
                aria-label={`Switch to ${language === 'ko' ? 'English' : 'Korean'}`}
            >
                {language === 'ko' ? 'KOREAN' : 'ENGLISH'}
            </button>
        </div>
    );
};

const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
};

const groupStyle: React.CSSProperties = {
    display: 'flex',
    backgroundColor: 'rgba(14, 14, 18, 0.68)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '9999px',
    padding: '2px',
    gap: '2px',
};

const buttonStyle = (active: boolean): React.CSSProperties => ({
    width: '30px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: active ? 'rgba(253, 180, 141, 0.18)' : 'transparent',
    color: active ? '#fdb48d' : '#a0a0ab',
    border: 'none',
    borderRadius: '9999px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.18s ease',
});

const langButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '26px',
    padding: '0 11px',
    backgroundColor: 'rgba(14, 14, 18, 0.68)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(253, 180, 141, 0.42)',
    borderRadius: '9999px',
    color: '#fdb48d',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
};

const divider: React.CSSProperties = {
    width: '1px',
    height: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
};

export default ViewControls;
