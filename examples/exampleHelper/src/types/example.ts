/**
 * [KO] 예제 리스트 항목의 인터페이스입니다.
 * [EN] Interface for an example list item.
 */
export interface ExampleItem {
    name: string;
    path?: string;
    description?: {
        ko: string;
        en: string;
    };
    experimental?: boolean;
    extensionList?: string[];
    list?: ExampleItem[];
}

/**
 * [KO] 예제 리스트의 전체 타입입니다.
 */
export type ExampleListType = ExampleItem[];
