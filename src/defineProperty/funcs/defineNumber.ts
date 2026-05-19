import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import applyProperties from "../core/applyProperties";
import updateTargetUniform from "../core/updateTargetUniform";
import defineProperty_SETTING from "../core/defineProperty_SETTING";

export interface INumberRange {
    key: string;
    value?: number;
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
    propertyKey: string | INumberRange,
    initValue: number = 0,
    min?: number,
    max?: number
) {
    if (typeof propertyKey === 'object') {
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
 * [KO] 지정된 클래스에 숫자(Number) 속성들을 정의합니다.
 * [EN] Defines number properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param keys - [KO] 정의할 속성 키, 키 배열 또는 설정 배열 [EN] Property keys, array of keys, or configuration array
 *
 * @example
 * ```typescript
 * // 단일 키 정의
 * DefineUniformProperty.defineNumber(MyMaterial, 'myValue');
 * // 초기값 및 범위와 함께 정의 (배열 방식)
 * DefineUniformProperty.defineNumber(MyMaterial, [['myValue', 0, -100, 100]]);
 * // 설정 객체 방식 (INumberRange)
 * DefineUniformProperty.defineNumber(MyMaterial, [{ key: 'myValue', value: 0, min: -100, max: 100 }]);
 * ```
 */
const defineNumber = (target: any, keys: string | (string | INumberRange | [string, number?, number?, number?])[]) => applyProperties(target, keys, defineNumber_func);

Object.freeze(defineNumber);
export default defineNumber;
