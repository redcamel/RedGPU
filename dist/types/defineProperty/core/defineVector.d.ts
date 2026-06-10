/**
 * [KO] 개별 벡터 속성에 대한 속성 기술자(Property Descriptor)를 생성하는 기본 함수입니다.
 * [EN] Base function that creates a property descriptor for an individual vector property.
 *
 * @param propertyKey - [KO] 속성 키 이름 [EN] Property key name
 * @param initValue - [KO] 초기값 [EN] Initial value
 */
declare function defineVector(propertyKey: string, initValue: number[]): {
    configurable?: boolean;
    enumerable?: boolean;
    value?: any;
    writable?: boolean;
    get: () => any;
    set: (v: any) => void;
};
export default defineVector;
