import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import applyProperties from "../core/applyProperties";
import updateTargetUniform from "../core/updateTargetUniform";
import defineProperty_SETTING from "../core/defineProperty_SETTING";

export interface IDefinePositiveNumber {
    key: string;
    value: number;
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
        validatePositiveNumberRange(newValue);
        if (min !== undefined && newValue < min) {
            console.warn(`Value for ${propertyKey} is below the minimum (${min}). Adjusted to ${min}.`);
            newValue = min;
        }
        if (max !== undefined && newValue > max) {
            console.warn(`Value for ${propertyKey} exceeds the maximum (${max}). Adjusted to ${max}.`);
            newValue = max;
        }

        this[symbol] = newValue;
        updateTargetUniform(this, propertyKey, newValue)
    };
}

function definePositiveNumberRange_func(
    propertyKey: IDefinePositiveNumber
) {
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

/**
 * [KO] 지정된 클래스에 양수 범위(Positive Number Range) 속성들을 정의합니다.
 * [EN] Defines positive number range properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param keys - [KO] 정의할 속성 설정(IDefinePositiveNumber) 또는 설정 배열 [EN] Configuration (IDefinePositiveNumber) or array of configurations
 *
 * @example
 * ```typescript
 * // 설정 객체 방식 (IDefinePositiveNumber)
 * DefineUniformProperty.definePositiveNumber(MyMaterial, { key: 'shininess', value: 30, min: 0, max: 100 });
 * DefineUniformProperty.definePositiveNumber(MyMaterial, [{ key: 'shininess', value: 30, min: 0, max: 100 }]);
 * ```
 */
const definePositiveNumber = (target: any, keys: IDefinePositiveNumber | IDefinePositiveNumber[]) => applyProperties(target, keys, definePositiveNumberRange_func);

Object.freeze(definePositiveNumber);
export default definePositiveNumber;
