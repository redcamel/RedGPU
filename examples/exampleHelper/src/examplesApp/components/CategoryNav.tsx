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
                    {categories.map(cat => {
                        const isActive = activeTab === cat;
                        return (
                            <button
                                key={cat}
                                style={{
                                    ...tabButtonStyle,
                                    padding: isNarrow ? '0 16px' : '0 32px',
                                    color: isActive ? '#fdb48d' : '#888',
                                    backgroundColor: isActive ? '#1a1a1c' : '#0a0a0b',
                                    borderBottom: isActive ? '1px solid #1a1a1c' : '1px solid #222',
                                    borderRight: '1px solid #222',
                                    borderTop: isActive ? '2px solid #fdb48d' : '2px solid transparent',
                                    whiteSpace: 'nowrap',
                                }}
                                onClick={() => setActiveTab(cat)}
                            >
                                {cat}
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
    borderBottom: '1px solid #222',
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

export default CategoryNav;
