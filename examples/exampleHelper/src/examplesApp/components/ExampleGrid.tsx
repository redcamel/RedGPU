import React, {useMemo} from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import {ExampleList} from '../../data/exampleList';
import {ExampleItem} from '../../types/example';
import ExampleSection from './ExampleSection';

const ExampleGrid: React.FC = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const searchQuery = useExamplesStore(state => state.searchQuery);

    // [KO] 검색된 개별 예제의 총 개수를 계산합니다.
    // [EN] Calculates the total number of individual examples searched.
    const countResults = (items: ExampleItem[]): number => {
        return items.reduce((acc, item) => {
            if (item.list) return acc + countResults(item.list);
            return acc + 1;
        }, 0);
    };

    const filteredItems = useMemo(() => {
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

        if (searchQuery) {
            // [KO] 전역 검색: 모든 카테고리를 순회하며 필터링
            // [EN] Global Search: Iterate through all categories and filter
            return ExampleList.reduce((acc: ExampleItem[], category) => {
                const filteredSubList = filterRecursive(category.list || []);
                if (filteredSubList.length > 0) {
                    acc.push({...category, list: filteredSubList});
                }
                return acc;
            }, []);
        } else {
            // [KO] 일반 탭 뷰: 현재 선택된 탭의 아이템만 표시
            // [EN] Standard Tab View: Display only items from the active tab
            const currentCategory = ExampleList.find(cat => cat.name === activeTab);
            return currentCategory?.list || [];
        }
    }, [activeTab, searchQuery]);

    const resultCount = useMemo(() => countResults(filteredItems), [filteredItems]);

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
