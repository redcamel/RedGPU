import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import {ExampleList} from '../../data/exampleList';

const CategoryNav: React.FC = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const setActiveTab = useExamplesStore(state => state.setActiveTab);
    const isNarrow = useExamplesStore(state => state.isNarrow);

    return (
        <nav style={{
            ...navStyle,
            margin: isNarrow ? '8px 10px 0 10px' : '10px 20px 0 20px',
        }}>
            <div style={{
                ...containerStyle,
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
                    height: '100%',
                    padding: isNarrow ? '0 10px' : '0 18px',
                    gap: '4px',
                    maxWidth: '1600px',
                    margin: '0',
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
                                    padding: isNarrow ? '0 14px' : '0 22px',
                                    color: isActive ? '#fdb48d' : '#9898a0',
                                    backgroundColor: isActive ? 'rgba(253, 180, 141, 0.08)' : 'transparent',
                                    borderBottom: isActive ? '2px solid #fdb48d' : '2px solid transparent',
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
                </div>
            </div>
        </nav>
    );
};

const navStyle: React.CSSProperties = {
    backgroundColor: 'rgba(12, 12, 16, 0.72)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    height: '42px',
    flexShrink: 0,
    zIndex: 90,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '14px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    overflow: 'hidden',
};

const containerStyle: React.CSSProperties = {
    height: '100%',
};

const tabButtonStyle: React.CSSProperties = {
    position: 'relative',
    height: '100%',
    padding: '0 22px',
    border: 'none',
    fontSize: '11.5px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
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
