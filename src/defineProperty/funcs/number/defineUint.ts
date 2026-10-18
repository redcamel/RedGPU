import validateUintRange from "../../../runtimeChecker/validateFunc/validateUintRange";
import applyProperties from "../../core/applyProperties";
import updateTargetUniform from "../../core/updateTargetUniform";
import defineProperty_SETTING from "../../core/defineProperty_SETTING";

/**
 * [KO] `defineUint` 함수에 전달할 속성 정의 옵션 인터페이스입니다.
 * [EN] Interface for property definition options passed to the `defineUint` function.
 *
 * @category DefineProperty
 */
export interface DefineUintInfo {
    /**
     * [KO] 대상 객체 프로토타입에 정의할 속성 키 이름
     * [EN] Property key name to define on the target object's prototype
     */
    key: string;
    /**
     * [KO] 속성의 초기 부호 없는 정수(Uint) 값
     * [EN] Initial unsigned integer (Uint) value of the property
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
    propertyInfo: DefineUintInfo
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
 * [KO] 지정된 대상의 프로토타입에 GPU 유니폼 버퍼와 연동되는 부호 없는 정수(Uint) 속성을 정의합니다.
 * [EN] Defines unsigned integer (Uint) properties on the target's prototype that synchronize with GPU uniform buffers.
 *
 * [KO] 값 할당 시 0 이상의 정수 여부를 검사하며, `min`(기본값: 0) 및 `max` 범위를 벗어나면 경고 출력 후 경계값으로 클램핑하여 유니폼 버퍼를 갱신합니다.
 * [EN] Validates that the assigned value is an unsigned integer (`>= 0`), clamping out-of-bounds values to `min` (default: 0) or `max` with a warning before updating the uniform buffer.
 *
 * ### Example
 * ```typescript
 * // [KO] 단일 부호 없는 정수 속성 정의
 * // [EN] Define a single unsigned integer property
 * RedGPU.DefineGPUProperty.defineUint(MyMaterial, { key: 'lightType', value: 1, min: 0, max: 10 });
 *
 * // [KO] 다중 부호 없는 정수 속성 일괄 정의
 * // [EN] Define multiple unsigned integer properties at once
 * RedGPU.DefineGPUProperty.defineUint(MyMaterial, [
 *   { key: 'shadowMode', value: 0 },
 *   { key: 'maxLights', value: 4, min: 0, max: 16 }
 * ]);
 * ```
 *
 * @param target -
 * [KO] 속성을 정의할 대상 클래스 또는 프로토타입
 * [EN] Target class or prototype to define properties on
 * @param defineInfo -
 * [KO] 단일 `DefineUintInfo` 설정 또는 설정 배열
 * [EN] Single `DefineUintInfo` configuration or an array of configurations
 * @category DefineProperty
 */
const defineUint = (target: any, defineInfo: DefineUintInfo | DefineUintInfo[]) => applyProperties(target, defineInfo, defineUintRange_func);

Object.freeze(defineUint);
export default defineUint;
