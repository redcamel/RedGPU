import React from 'react';
import {useExamplesStore} from '../../store/useExamplesStore';

const SearchInput: React.FC = () => {
    const searchQuery = useExamplesStore(state => state.searchQuery);
    const setSearchQuery = useExamplesStore(state => state.setSearchQuery);
    const isNarrow = useExamplesStore(state => state.isNarrow);
    const [focused, setFocused] = React.useState(false);

    return (
        <div style={searchContainer}>
            <input
                type="text"
                placeholder={isNarrow ? "Search..." : "Search examples..."}
                aria-label="Search examples"
                value={searchQuery}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                    ...searchInputStyle,
                    height: '46px',
                    borderColor: focused ? 'rgba(253, 180, 141, 0.55)' : 'rgba(255, 255, 255, 0.1)',
                    backgroundColor: focused ? 'rgba(24, 24, 28, 0.9)' : 'rgba(18, 18, 20, 0.82)'
                }}
            />
            {searchQuery && (
                <button
                    onClick={() => setSearchQuery('')}
                    style={clearButtonStyle}
                    aria-label="Clear search"
                    title="Clear search"
                >
                    ×
                </button>
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
    height: '46px',
    backgroundColor: 'rgba(18, 18, 20, 0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '9999px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    padding: '0 40px 0 20px',
    color: '#f8f9fa',
    fontSize: '13.5px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s, background-color 0.2s',
};

const clearButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#8e8e93',
    fontSize: '18px',
    cursor: 'pointer',
};

export default SearchInput;
