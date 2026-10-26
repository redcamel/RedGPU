import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import applyProperties from "../../core/applyProperties";
import updateTargetUniform from "../../core/updateTargetUniform";
import defineProperty_SETTING from "../../core/defineProperty_SETTING";

/**
 * [KO] `definePositiveNumber` 함수에 전달할 속성 정의 옵션 인터페이스입니다.
 * [EN] Interface for property definition options passed to the `definePositiveNumber` function.
 *
 * @category DefineProperty
 */
export interface DefinePositiveNumberInfo {
    /**
     * [KO] 대상 객체 프로토타입에 정의할 속성 키 이름
     * [EN] Property key name to define on the target object's prototype
     */
    key: string;
    /**
     * [KO] 속성의 초기 양수 값
     * [EN] Initial positive numeric value of the property
     */
    value: number;
    /**
     * [KO] 허용할 최소값 (선택, 기본값: 0). 범위 미만의 값이 할당되면 경고를 출력하고 이 값으로 클램핑됩니다.
     * [EN] Optional minimum allowed value (default: 0). Values below this limit log a warning and are clamped.
     */
    min?: number;
    /**
     * [KO] 허용할 최대값 (선택). 범위 초과의 값이 할당되면 경고를 출력하고 이 값으로 클램핑됩니다.
     * [EN] Optional maximum allowed value. Values above this limit log a warning and are clamped.
     */
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
    propertyInfo: DefinePositiveNumberInfo
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
 * [KO] 지정된 대상의 프로토타입에 GPU 유니폼 버퍼와 연동되는 양수(Positive Number) 범위 속성을 정의합니다.
 * [EN] Defines positive numeric properties on the target's prototype that synchronize with GPU uniform buffers.
 *
 * [KO] 값 할당 시 0 이상의 양수 여부를 검사하며, `min`(기본값: 0) 및 `max` 범위를 벗어나면 경고 출력 후 경계값으로 클램핑하여 유니폼 버퍼를 갱신합니다.
 * [EN] Validates that the assigned value is a non-negative number (`>= 0`), clamping out-of-bounds values to `min` (default: 0) or `max` with a warning before updating the uniform buffer.
 *
 * ### Example
 * ```typescript
 * // [KO] 단일 양수 속성 정의
 * // [EN] Define a single positive numeric property
 * RedGPU.DefineGPUProperty.definePositiveNumber(MyMaterial, { key: 'shininess', value: 30, min: 0, max: 100 });
 *
 * // [KO] 다중 양수 속성 일괄 정의
 * // [EN] Define multiple positive numeric properties at once
 * RedGPU.DefineGPUProperty.definePositiveNumber(MyMaterial, [
 *   { key: 'fogDensity', value: 0.01, min: 0 },
 *   { key: 'roughness', value: 0.5, min: 0, max: 1 }
 * ]);
 * ```
 *
 * @param target -
 * [KO] 속성을 정의할 대상 클래스 또는 프로토타입
 * [EN] Target class or prototype to define properties on
 * @param defineInfo -
 * [KO] 단일 `DefinePositiveNumberInfo` 설정 또는 설정 배열
 * [EN] Single `DefinePositiveNumberInfo` configuration or an array of configurations
 * @category DefineProperty
 */
const definePositiveNumber = (target: any, defineInfo: DefinePositiveNumberInfo | DefinePositiveNumberInfo[]) => applyProperties(target, defineInfo, definePositiveNumberRange_func);

Object.freeze(definePositiveNumber);
export default definePositiveNumber;
