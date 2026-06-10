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
                style={{...buttonStyle(true), fontSize: '10px', width: 'auto', padding: '0 10px'}}
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
    gap: '15px',
};

const groupStyle: React.CSSProperties = {
    display: 'flex',
    backgroundColor: '#1e1e1f',
    borderRadius: '4px',
    padding: '2px',
};

const buttonStyle = (active: boolean): React.CSSProperties => ({
    width: '32px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: active ? '#333' : 'transparent',
    color: active ? '#fdb48d' : '#666',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
});

const divider: React.CSSProperties = {
    width: '1px',
    height: '16px',
    backgroundColor: '#333',
};

export default ViewControls;
