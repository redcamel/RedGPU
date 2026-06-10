import {ExampleItem} from '../../types/example';

/**
 * [KO] 섹션의 자식 항목들을 일반 예제(leaf)와 하위 그룹(group)으로 분리합니다.
 * [EN] Separates section children into individual examples (leaf) and sub-groups (group).
 */
export const splitSectionItems = (items: ExampleItem[]) => {
    return {
        leafItems: items.filter(subItem => !subItem.list),
        groupItems: items.filter(subItem => !!subItem.list)
    };
};