import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";
import applyProperties from "../core/applyProperties";
import getTargetInfos from "../core/getTargetInfos";
import defineProperty_SETTING from "../old/funcs/defineProperty_SETTING";

export interface IUintRange {
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
        validateUintRange(newValue);
        if (min !== undefined && newValue < min) {
            console.warn(`Value for ${propertyKey} is below the minimum (${min}). Adjusted to ${min}.`);
            newValue = min;
        }
        if (max !== undefined && newValue > max) {
            console.warn(`Value for ${propertyKey} exceeds the maximum (${max}). Adjusted to ${max}.`);
            newValue = max;
        }

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

function defineUintRange_func(
    propertyKey: string | IUintRange,
    initValue: number = 0,
    min: number = 0,
    max?: number
) {
    if (typeof propertyKey === 'object') {
        const {key, value = 0, min: minVal = 0, max: maxVal} = propertyKey;
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
 * [KO] 지정된 클래스에 Uint 범위(Uint Range) 속성들을 정의합니다.
 * [EN] Defines Uint range properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param keys - [KO] 정의할 속성 키, 키 배열 또는 설정 배열 [EN] Property keys, array of keys, or configuration array
 *
 * @example
 * ```typescript
 * // 단일 키 정의
 * DefineProperty.defineUint(MyMaterial, 'myUint');
 * // 초기값 및 범위와 함께 정의 (배열 방식)
 * DefineProperty.defineUint(MyMaterial, [['myUint', 1, 0, 10]]);
 * // 설정 객체 방식 (IUintRange)
 * DefineProperty.defineUint(MyMaterial, [{ key: 'myUint', value: 1, min: 0, max: 10 }]);
 * ```
 */
const defineUint = (target: any, keys: string | (string | IUintRange | [string, number?, number?, number?])[]) => applyProperties(target, keys, defineUintRange_func);

Object.freeze(defineUint);
export default defineUint;
