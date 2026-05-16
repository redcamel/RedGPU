import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import {ExampleList} from '../../data/exampleList';

const CategoryNav: React.FC = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const setActiveTab = useExamplesStore(state => state.setActiveTab);
    
    const categories = ExampleList.map(cat => cat.name);

    return (
        <nav style={navStyle}>
            <div style={containerStyle}>
                {categories.map(cat => {
                    const isActive = activeTab === cat;
                    return (
                        <button
                            key={cat}
                            style={{
                                ...tabButtonStyle,
                                color: isActive ? '#fdb48d' : '#888',
                                backgroundColor: isActive ? '#1a1a1c' : '#0a0a0b',
                                borderBottom: isActive ? '1px solid #1a1a1c' : '1px solid #222',
                                borderRight: '1px solid #222',
                                borderTop: isActive ? '2px solid #fdb48d' : '2px solid transparent',
                            }}
                            onClick={() => setActiveTab(cat)}
                        >
                            {cat}
                        </button>
                    );
                })}
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
};

const containerStyle: React.CSSProperties = {
    display: 'flex',
    height: '100%',
    padding: '0',
    maxWidth: '1600px',
    margin: '0',
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
