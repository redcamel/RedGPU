import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import {ExampleList} from '../../data/exampleList';
import {glassPillContainerStyle} from '../../common/styles/uiStyles';
import {ViewModeLangButtons} from './ViewControls';

const CategoryNav: React.FC = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const setActiveTab = useExamplesStore(state => state.setActiveTab);
    const isNarrow = useExamplesStore(state => state.isNarrow);
    const isCompact = useExamplesStore(state => state.isCompact);

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

                        return (
                            <button
                                key={cat}
                                style={{
                                    ...tabButtonStyle,
                                    flex: isCompact ? '1 0 auto' : '0 0 auto',
                                    padding: isNarrow ? '0 12px' : '0 14px',
                                    color: isActive ? '#fdb48d' : '#a0a0ab',
                                    backgroundColor: isActive ? 'rgba(253, 180, 141, 0.16)' : 'transparent',
                                    whiteSpace: 'nowrap',
                                }}
                                onClick={() => setActiveTab(cat)}
                            >
                                {cat}
                            </button>
                        );
                    })}
                    {!isNarrow && <ViewModeLangButtons inline/>}
                </div>
            </div>
        </nav>
    );
};

const navStyle: React.CSSProperties = {
    ...glassPillContainerStyle,
    display: 'inline-flex',
    maxWidth: '100%',
    minWidth: 0,
    padding: '4px',
    overflow: 'hidden',
};

const containerStyle: React.CSSProperties = {
    height: '100%',
    maxWidth: '100%',
};

const tabButtonStyle: React.CSSProperties = {
    position: 'relative',
    height: '36px',
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

export default CategoryNav;
