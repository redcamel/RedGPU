import React, {useMemo} from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import {ExampleList} from '../../data/exampleList';
import {ExampleItem} from '../../types/example';
import ExampleSection from './ExampleSection';

const ExampleGrid: React.FC = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const searchQuery = useExamplesStore(state => state.searchQuery);

    const filteredItems = useMemo(() => {
        const currentCategory = ExampleList.find(cat => cat.name === activeTab);
        if (!currentCategory || !currentCategory.list) return [];

        if (!searchQuery) return currentCategory.list;

        const query = searchQuery.toLowerCase();

        const filterRecursive = (items: ExampleItem[]): ExampleItem[] => {
            return items.reduce((acc: ExampleItem[], item) => {
                const matchName = item.name.toLowerCase().includes(query);
                const matchDescKo = item.description?.ko?.toLowerCase().includes(query);
                const matchDescEn = item.description?.en?.toLowerCase().includes(query);

                if (matchName || matchDescKo || matchDescEn) {
                    acc.push(item);
                } else if (item.list) {
                    const filteredSubList = filterRecursive(item.list);
                    if (filteredSubList.length > 0) {
                        acc.push({...item, list: filteredSubList});
                    }
                }
                return acc;
            }, []);
        };

        return filterRecursive(currentCategory.list);
    }, [activeTab, searchQuery]);

    if (filteredItems.length === 0) {
        return (
            <div style={emptyStateStyle}>
                <div style={{fontSize: '48px', marginBottom: '20px'}}>🔍</div>
                <h3>No examples found</h3>
                <p style={{color: '#666'}}>Try searching for something else.</p>
            </div>
        );
    }

    return (
        <div className="example-grid-container">
            {filteredItems.map((item, idx) => (
                <ExampleSection key={item.name + idx} item={item} />
            ))}
        </div>
    );
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
