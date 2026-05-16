import React from 'react';
import ExampleSection from './ExampleSection';
import {useFilteredExamples} from '../hooks/useFilteredExamples';

const ExampleGrid: React.FC = () => {
    const {filteredItems, resultCount, searchQuery} = useFilteredExamples();

    if (filteredItems.length === 0) {
        return (
            <div style={emptyStateStyle}>
                <div style={{fontSize: '48px', marginBottom: '20px'}}>🔍</div>
                <h3>{searchQuery ? `No results for "${searchQuery}"` : 'No examples found'}</h3>
                <p style={{color: '#666'}}>Try searching for something else or check other categories.</p>
            </div>
        );
    }

    return (
        <div className="example-grid-container">
            {searchQuery && (
                <div style={searchHeaderStyle}>
                    <div style={{marginBottom: '4px'}}>
                        SEARCH RESULTS FOR <span style={{color: '#fdb48d'}}>"{searchQuery.toUpperCase()}"</span>
                    </div>
                    <div style={{fontSize: '14px', color: '#888', fontWeight: 'normal', textTransform: 'none'}}>
                        Found {resultCount} {resultCount === 1 ? 'example' : 'examples'}
                    </div>
                </div>
            )}
            {filteredItems.map((item, idx) => (
                <ExampleSection key={item.name + idx} item={item} />
            ))}
        </div>
    );
};

const searchHeaderStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: '0.15em',
    marginBottom: '40px',
    paddingBottom: '16px',
    borderBottom: '1px solid #222',
    display: 'flex',
    flexDirection: 'column',
};

const emptyStateStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 0',
    textAlign: 'center',
};

export default ExampleGrid;
