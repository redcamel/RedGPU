import validateUintRange from "../../../runtimeChecker/validateFunc/validateUintRange";
import applyProperties from "../../core/applyProperties";
import updateTargetUniform from "../../core/updateTargetUniform";
import defineProperty_SETTING from "../../core/defineProperty_SETTING";

export interface IDefineUint {
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
        updateTargetUniform(this, propertyKey, newValue)
    };
}

function defineUintRange_func(
    propertyInfo: IDefineUint
) {
    const {key, value = 0, min: minVal = 0, max: maxVal} = propertyInfo;
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
 * [KO] 지정된 클래스에 Uint 범위(Uint Range) 속성들을 정의합니다.
 * [EN] Defines Uint range properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 정의할 속성 설정(IDefineUint) 또는 설정 배열 [EN] Configuration (IDefineUint) or array of configurations
 *
 * @example
 * ```typescript
 * // 설정 객체 방식 (IDefineUint)
 * DefineGPUProperty.defineUint(MyMaterial, { key: 'myUint', value: 1, min: 0, max: 10 });
 * DefineGPUProperty.defineUint(MyMaterial, [{ key: 'myUint', value: 1, min: 0, max: 10 }]);
 * ```
 */
const defineUint = (target: any, defineInfo: IDefineUint | IDefineUint[]) => applyProperties(target, defineInfo, defineUintRange_func);

Object.freeze(defineUint);
export default defineUint;
