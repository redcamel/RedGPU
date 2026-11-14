import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import {GitHubIcon} from '../../common/components/Icons';
import IconButton from '../../common/components/basic/IconButton';
import {glassPillContainerStyle, verticalDividerStyle} from '../../common/styles/uiStyles';

export const ViewModeLangButtons: React.FC<{ inline?: boolean }> = ({inline = false}) => {
    const viewMode = useExamplesStore(state => state.viewMode);
    const setViewMode = useExamplesStore(state => state.setViewMode);
    const language = useExamplesStore(state => state.language);
    const setLanguage = useExamplesStore(state => state.setLanguage);
    const isNarrow = useExamplesStore(state => state.isNarrow);
    const hideFooterLang = useExamplesStore(state => state.hideFooterLang);

    return (
        <>
            {inline && <div style={verticalDividerStyle}/>}
            <button
                style={buttonStyle}
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                title={viewMode === 'grid' ? 'Grid View' : 'List View'}
                aria-label={viewMode === 'grid' ? 'Grid View' : 'List View'}
            >
                {viewMode === 'grid' ? '▤' : '☰'}
            </button>
            {(inline || !isNarrow || !hideFooterLang) && (
                <>
                    <div style={verticalDividerStyle}/>
                    <button
                        style={{
                            ...langButtonStyle,
                            padding: inline ? '0 14px 0 12px' : (isNarrow ? '0 11px' : '0 13px 0 11px'),
                        }}
                        onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
                        aria-label={`Switch to ${language === 'ko' ? 'English' : 'Korean'}`}
                    >
                        {language === 'ko' ? 'KO' : 'EN'}
                    </button>
                </>
            )}
        </>
    );
};

const ViewControls: React.FC = () => {
    const isNarrow = useExamplesStore(state => state.isNarrow);

    return (
        <div style={{
            ...glassPillContainerStyle,
            padding: isNarrow ? '4px 8px 4px 6px' : '4px 4px 4px 6px',
        }}>
            <ViewModeLangButtons/>
            {isNarrow && (
                <>
                    <div style={verticalDividerStyle}/>
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
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    borderRadius: '9999px',
    color: '#fdb48d',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '0.04em',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    flexShrink: 0,
};

export default ViewControls;
