import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import {ExampleList} from '../../data/exampleList';

const CategoryNav: React.FC = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const setActiveTab = useExamplesStore(state => state.setActiveTab);
    const isNarrow = useExamplesStore(state => state.isNarrow);
    
    const categories = ExampleList.map(cat => cat.name);

    return (
        <nav style={navStyle}>
            <div style={{
                ...containerStyle,
                overflowX: isNarrow ? 'auto' : 'visible',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE 10+
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
                    height: '100%',
                    padding: '0',
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
                                    padding: isNarrow ? '0 16px' : '0 32px',
                                    color: isActive ? '#fdb48d' : '#aaa',
                                    backgroundColor: isActive ? '#1a1a1c' : '#0a0a0b',
                                    borderBottom: isActive ? '1px solid #1a1a1c' : '1px solid #333',
                                    borderRight: '1px solid #333',
                                    borderTop: isActive ? '2px solid #fdb48d' : '2px solid transparent',
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
    backgroundColor: '#0a0a0b',
    height: '44px',
    flexShrink: 0,
    zIndex: 90,
    borderBottom: '1px solid #333',
    overflow: 'hidden',
};

const containerStyle: React.CSSProperties = {
    height: '100%',
};

const tabButtonStyle: React.CSSProperties = {
    position: 'relative',
    height: '100%',
    padding: '0 32px',
    border: 'none',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
};

const experimentalBadgeStyle: React.CSSProperties = {
    fontSize: '8px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    padding: '2px 4px',
    borderRadius: '4px',
    fontWeight: 'bold',
    lineHeight: '1',
    display: 'inline-block'
};

export default CategoryNav;
