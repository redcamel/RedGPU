import defineProperty_SETTING from "../old/funcs/defineProperty_SETTING";
import updateTargetUniform from "./updateTargetUniform";

/**
 * [KO] 유니폼 버퍼에 데이터를 쓰는 세터(Setter) 함수를 생성합니다.
 * [EN] Creates a setter function that writes data to the uniform buffer.
 *
 * @param propertyKey - [KO] 속성 키 이름 [EN] Property key name
 * @param symbol - [KO] 내부 데이터를 저장할 심볼 [EN] Symbol to store internal data
 */
function createSetter(propertyKey: string, symbol: symbol) {
    return function (newValue: any) {
        this[symbol] = newValue;
        updateTargetUniform(this, propertyKey, newValue);
    }
}

/**
 * [KO] 개별 벡터 속성에 대한 속성 기술자(Property Descriptor)를 생성하는 기본 함수입니다.
 * [EN] Base function that creates a property descriptor for an individual vector property.
 *
 * @param propertyKey - [KO] 속성 키 이름 [EN] Property key name
 * @param initValue - [KO] 초기값 [EN] Initial value
 */
function defineVector(propertyKey: string, initValue: number[]) {
    const symbol = Symbol(propertyKey);
    return {
        get: function (): number[] {
            if (this[symbol] === undefined) this[symbol] = initValue
            return this[symbol]
        },
        set: createSetter(propertyKey, symbol),
        ...defineProperty_SETTING
    }
}

Object.freeze(defineVector)
export default defineVector;
