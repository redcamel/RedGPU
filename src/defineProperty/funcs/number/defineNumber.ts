import validateNumber from "../../../runtimeChecker/validateFunc/validateNumber";
import applyProperties from "../../core/applyProperties";
import updateTargetUniform from "../../core/updateTargetUniform";
import defineProperty_SETTING from "../../core/defineProperty_SETTING";

export interface IDefineNumber {
    key: string;
    value: number;
    min?: number;
    max?: number;
}

function createSetter(
    propertyKey: string,
    symbol: symbol,
    min?: number,
    max?: number
) {
    return function (newValue: number) {
        validateNumber(newValue);
        if (min !== undefined && newValue < min) {
            console.warn(`Value for ${propertyKey} is below the minimum (${min}). Received: ${newValue}. Adjusted to ${min}.`);
            newValue = min;
        }
        if (max !== undefined && newValue > max) {
            console.warn(`Value for ${propertyKey} exceeds the maximum (${max}). Received: ${newValue}. Adjusted to ${max}.`);
            newValue = max;
        }

        this[symbol] = newValue;
        updateTargetUniform(this, propertyKey, newValue)
    };
}

function defineNumber_func(
    propertyKey: IDefineNumber
) {
    const {key, value = 0, min: minVal, max: maxVal} = propertyKey;
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
 * [KO] 지정된 클래스에 숫자(Number) 속성들을 정의합니다.
 * [EN] Defines number properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param keys - [KO] 정의할 속성 설정(IDefineNumber) 또는 설정 배열 [EN] Configuration (IDefineNumber) or array of configurations
 *
 * @example
 * ```typescript
 * // 설정 객체 방식 (IDefineNumber)
 * DefineUniformProperty.defineNumber(MyMaterial, { key: 'myValue', value: 0, min: -100, max: 100 });
 * DefineUniformProperty.defineNumber(MyMaterial, [{ key: 'myValue', value: 0, min: -100, max: 100 }]);
 * ```
 */
const defineNumber = (target: any, keys: IDefineNumber | IDefineNumber[]) => applyProperties(target, keys, defineNumber_func);

Object.freeze(defineNumber);
export default defineNumber;
