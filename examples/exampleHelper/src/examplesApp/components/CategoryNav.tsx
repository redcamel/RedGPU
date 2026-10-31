import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import {ExampleList} from '../../data/exampleList';

const CategoryNav: React.FC = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const setActiveTab = useExamplesStore(state => state.setActiveTab);
    const isNarrow = useExamplesStore(state => state.isNarrow);
    const isCompact = useExamplesStore(state => state.isCompact);
    const viewMode = useExamplesStore(state => state.viewMode);
    const setViewMode = useExamplesStore(state => state.setViewMode);
    const language = useExamplesStore(state => state.language);
    const setLanguage = useExamplesStore(state => state.setLanguage);

    return (
        <nav style={{
            ...navStyle,
            width: isCompact ? '100%' : 'fit-content',
        }}>
            <div style={{
                ...containerStyle,
                width: isCompact ? '100%' : 'auto',
                overflowX: isNarrow ? 'auto' : 'visible',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}>
                <style>
                    {`
                    .category-nav-container::-webkit-scrollbar {
                        display: none;
                    }
                    `}
                </style>
                <div className="category-nav-container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCompact ? 'space-between' : 'flex-start',
                    width: isCompact ? '100%' : 'auto',
                    height: '100%',
                    padding: 0,
                    gap: '4px',
                }}>
                    {ExampleList.map(category => {
                        const cat = category.name;
                        const isActive = activeTab === cat;
                        const isExperimental = category.experimental;

                        return (
                            <button
                                key={cat}
                                style={{
                                    ...tabButtonStyle,
                                    flex: isCompact ? '1 0 auto' : '0 0 auto',
                                    padding: isNarrow ? '0 12px' : '0 16px',
                                    color: isActive ? '#fdb48d' : '#a0a0ab',
                                    backgroundColor: isActive ? 'rgba(253, 180, 141, 0.16)' : 'transparent',
                                    whiteSpace: 'nowrap',
                                    gap: '6px'
                                }}
                                onClick={() => setActiveTab(cat)}
                            >
                                {cat}
                                {isExperimental && (
                                    <span style={experimentalBadgeStyle}>EXP</span>
                                )}
                            </button>
                        );
                    })}
                    {!isNarrow && (
                        <>
                            <div style={dividerStyle}/>
                            <button
                                style={controlButtonStyle}
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                title={viewMode === 'grid' ? 'Grid View' : 'List View'}
                                aria-label={viewMode === 'grid' ? 'Grid View' : 'List View'}
                            >
                                {viewMode === 'grid' ? '▤' : '☰'}
                            </button>
                            <div style={dividerStyle}/>
                            <button
                                style={langButtonStyle}
                                onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
                                aria-label={`Switch to ${language === 'ko' ? 'English' : 'Korean'}`}
                            >
                                {language === 'ko' ? 'KO' : 'EN'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const navStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    maxWidth: '100%',
    minWidth: 0,
    height: '46px',
    padding: '4px',
    backgroundColor: 'rgba(18, 18, 20, 0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '9999px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    overflow: 'hidden',
    boxSizing: 'border-box',
    flexShrink: 0,
};

const containerStyle: React.CSSProperties = {
    height: '100%',
    maxWidth: '100%',
};

const tabButtonStyle: React.CSSProperties = {
    position: 'relative',
    height: '36px',
    padding: '0 16px',
    border: 'none',
    outline: 'none',
    borderRadius: '9999px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '0.02em',
    boxSizing: 'border-box',
    flexShrink: 0,
};

const dividerStyle: React.CSSProperties = {
    width: '1px',
    height: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: '0 2px',
    flexShrink: 0,
};

const controlButtonStyle: React.CSSProperties = {
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
    width: '36px',
    height: '36px',
    padding: 0,
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

const experimentalBadgeStyle: React.CSSProperties = {
    fontSize: '9px',
    backgroundColor: 'rgba(255, 90, 95, 0.16)',
    color: '#ff7b80',
    border: '1px solid rgba(255, 90, 95, 0.35)',
    padding: '2px 6px',
    borderRadius: '9999px',
    fontWeight: 700,
    lineHeight: '1',
    display: 'inline-block'
};

export default CategoryNav;
