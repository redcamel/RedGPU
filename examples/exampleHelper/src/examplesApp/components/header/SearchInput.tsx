import React from 'react';
import {useExamplesStore} from '../../store/useExamplesStore';

const SearchInput: React.FC = () => {
    const searchQuery = useExamplesStore(state => state.searchQuery);
    const setSearchQuery = useExamplesStore(state => state.setSearchQuery);
    const isNarrow = useExamplesStore(state => state.isNarrow);

    return (
        <div style={searchContainer}>
            <input
                type="text"
                placeholder={isNarrow ? "Search..." : "Search examples..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{...searchInputStyle, height: isNarrow ? '32px' : '36px'}}
            />
            {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={clearButtonStyle}>×</button>
            )}
        </div>
    );
};

const searchContainer: React.CSSProperties = {
    position: 'relative',
    width: '100%',
};

const searchInputStyle: React.CSSProperties = {
    width: '100%',
    height: '36px',
    backgroundColor: '#1e1e1f',
    border: '1px solid #333',
    borderRadius: '18px',
    padding: '0 40px 0 16px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
};

const clearButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '18px',
    cursor: 'pointer',
};

export default SearchInput;