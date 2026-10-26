import defineProperty_SETTING from "./defineProperty_SETTING";
import updateTargetUniform from "./updateTargetUniform";

function createSetter(propertyKey: string, symbol: symbol) {
    return function (newValue: any) {
        this[symbol] = newValue;
        updateTargetUniform(this, propertyKey, newValue);
    }
}

/**
 * [KO] 벡터 프로퍼티를 위한 `PropertyDescriptor`를 생성합니다.
 * [EN] Creates a `PropertyDescriptor` for a vector property.
 *
 * @param propertyKey -
 * [KO] 프로퍼티 키 이름
 * [EN] Property key name
 * @param initValue -
 * [KO] 초기 벡터 배열 값
 * [EN] Initial vector array value
 * @returns
 * [KO] 생성된 프로퍼티 디스크립터 객체
 * [EN] Created property descriptor object
 * @category DefineProperty
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
