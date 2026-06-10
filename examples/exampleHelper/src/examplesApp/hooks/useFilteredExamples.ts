import {useMemo} from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import {ExampleList} from '../../data/exampleList';
import {ExampleItem} from '../../types/example';

/**
 * [KO] 검색어와 선택된 탭에 따라 예제 리스트를 필터링하는 훅입니다.
 * [EN] Hook that filters the example list based on search query and selected tab.
 */
export const useFilteredExamples = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const searchQuery = useExamplesStore(state => state.searchQuery);

    /**
     * [KO] 검색된 개별 예제의 총 개수를 재귀적으로 계산합니다.
     * [EN] Recursively calculates the total number of individual examples found.
     */
    const countResults = (items: ExampleItem[]): number => {
        return items.reduce((acc, item) => {
            if (item.list) return acc + countResults(item.list);
            return acc + 1;
        }, 0);
    };

    const filteredItems = useMemo(() => {
        const query = searchQuery.toLowerCase();

        /**
         * [KO] 주어진 아이템 리스트에서 검색어와 일치하는 항목을 재귀적으로 찾습니다.
         * [EN] Recursively finds items matching the search query in a given item list.
         */
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
            // [KO] 전역 검색 모드: 모든 카테고리를 대상으로 필터링
            // [EN] Global search mode: Filter across all categories
            return ExampleList.reduce((acc: ExampleItem[], category) => {
                const filteredSubList = filterRecursive(category.list || []);
                if (filteredSubList.length > 0) {
                    acc.push({...category, list: filteredSubList});
                }
                return acc;
            }, []);
        } else {
            // [KO] 일반 탭 뷰 모드: 현재 선택된 탭의 내용만 표시
            // [EN] Standard tab view mode: Display only the contents of the active tab
            const currentCategory = ExampleList.find(cat => cat.name === activeTab);
            return currentCategory?.list || [];
        }
    }, [activeTab, searchQuery]);

    const resultCount = useMemo(() => countResults(filteredItems), [filteredItems]);

    return {
        filteredItems,
        resultCount,
        searchQuery
    };
};