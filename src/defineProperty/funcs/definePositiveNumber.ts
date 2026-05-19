import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import applyProperties from "../core/applyProperties";
import getTargetInfos from "../core/getTargetInfos";
import defineProperty_SETTING from "../old/funcs/defineProperty_SETTING";

export interface IPositiveNumberRange {
    key: string;
    value?: number;
    min?: number;
    max?: number;
}

function createSetter(
    propertyKey: string,
    symbol: symbol,
    min: number = 0,
    max?: number
) {
    return function (newValue: number) {
        if (min !== undefined && newValue < min) {
            console.warn(`Value for ${propertyKey} is below the minimum (${min}). Adjusted to ${min}.`);
            newValue = min;
        }
        if (max !== undefined && newValue > max) {
            console.warn(`Value for ${propertyKey} exceeds the maximum (${max}). Adjusted to ${max}.`);
            newValue = max;
        }

        validatePositiveNumberRange(newValue);

        this[symbol] = newValue;

        const {targetUniformInfo, targetUniformBuffer} = getTargetInfos(this);
        if (targetUniformBuffer) {
            targetUniformBuffer.writeOnlyBuffer(
                targetUniformInfo.members[propertyKey],
                newValue
            );
        }
    };
}

function definePositiveNumberRange_func(
    propertyKey: string | IPositiveNumberRange,
    initValue: number = 1,
    min: number = 0,
    max?: number
) {
    if (typeof propertyKey === 'object') {
        const {key, value = 1, min: minVal = 0, max: maxVal} = propertyKey;
        const symbol = Symbol(key);
        return {
            get: function (): number {
                if (this[symbol] === undefined) this[symbol] = value;
                return this[symbol];
            },
            set: createSetter(key, symbol, minVal, maxVal),
            ...defineProperty_SETTING,
        };
    }
    const symbol = Symbol(propertyKey);
    return {
        get: function (): number {
            if (this[symbol] === undefined) this[symbol] = initValue;
            return this[symbol];
        },
        set: createSetter(propertyKey, symbol, min, max),
        ...defineProperty_SETTING,
    };
}

/**
 * [KO] 지정된 클래스에 양수 범위(Positive Number Range) 속성들을 정의합니다.
 * [EN] Defines positive number range properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param keys - [KO] 정의할 속성 키, 키 배열 또는 설정 배열 [EN] Property keys, array of keys, or configuration array
 *
 * @example
 * ```typescript
 * // 단일 키 정의
 * DefineProperty.definePositiveNumber(MyMaterial, 'opacity');
 * // 초기값 및 범위와 함께 정의 (배열 방식)
 * DefineProperty.definePositiveNumber(MyMaterial, [['shininess', 30, 0, 100]]);
 * // 설정 객체 방식 (IPositiveNumberRange)
 * DefineProperty.definePositiveNumber(MyMaterial, [{ key: 'shininess', value: 30, min: 0, max: 100 }]);
 * ```
 */
const definePositiveNumber = (target: any, keys: string | (string | IPositiveNumberRange | [string, number?, number?, number?])[]) => applyProperties(target, keys, definePositiveNumberRange_func);

Object.freeze(definePositiveNumber);
export default definePositiveNumber;
