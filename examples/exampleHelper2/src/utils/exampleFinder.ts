import {ExampleList} from '../data/exampleList';
import {ExampleItem} from '../types/example';

/**
 * [KO] 현재 URL 경로를 기반으로 예제 리스트에서 해당 예제 정보를 찾습니다.
 * [EN] Finds the corresponding example information from the example list based on the current URL path.
 */
export const findCurrentExample = (pathname: string): ExampleItem | null => {
    // Normalize pathname (remove leading/trailing slashes and 'index.html')
    const normalizedPath = pathname
        .replace(/\/$/, '')
        .replace(/\/index\.html$/, '')
        .replace(/.*\/examples\//, ''); // Get path relative to examples/

    const search = (list: ExampleItem[]): ExampleItem | null => {
        for (const item of list) {
            if (item.path === normalizedPath) return item;
            if (item.list) {
                const found = search(item.list);
                if (found) return found;
            }
        }
        return null;
    };

    return search(ExampleList);
};

/**
 * [KO] 예제 리스트를 평면화하여 모든 리프 노드(path가 있는 항목)를 반환합니다.
 * [EN] Flattens the example list and returns all leaf nodes (items with a path).
 */
export const getFlatExampleList = (): ExampleItem[] => {
    const flatList: ExampleItem[] = [];
    const traverse = (list: ExampleItem[]) => {
        for (const item of list) {
            if (item.path) flatList.push(item);
            if (item.list) traverse(item.list);
        }
    };
    traverse(ExampleList);
    return flatList;
};
