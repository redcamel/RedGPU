import validateNumber from "../../../runtimeChecker/validateFunc/validateNumber";
import applyProperties from "../../core/applyProperties";
import updateTargetUniform from "../../core/updateTargetUniform";
import defineProperty_SETTING from "../../core/defineProperty_SETTING";

/**
 * `defineNumber` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.
 */
export interface DefineNumberInfo {
    /**
     * [KO] 속성의 키 이름. 대상 객체 프로토타입에 이 이름으로 정의됩니다.
     * [EN] Key name of the property. Defined on the target object's prototype under this name.
     */
    key: string;
    /**
     * [KO] 속성의 초기 숫자값.
     * [EN] Initial numeric value of the property.
     */
    value: number;
    /**
     * [KO] 허용할 최소값 (옵션). 설정 범위 미만의 값이 setter에 할당되면 경고를 내고 이 값으로 고정됩니다.
     * [EN] Optional minimum allowed value. Assigning a value below this limit will log a warning and clamp it.
     */
    min?: number;
    /**
     * [KO] 허용할 최대값 (옵션). 설정 범위 초과의 값이 setter에 할당되면 경고를 내고 이 값으로 고정됩니다.
     * [EN] Optional maximum allowed value. Assigning a value above this limit will log a warning and clamp it.
     */
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
    propertyInfo: DefineNumberInfo
) {
    const {key, value = 0, min: minVal, max: maxVal} = propertyInfo;
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
 * 지정된 클래스의 프로토타입에 GPU와 연동되는 일반 숫자(Number) 속성을 정의합니다.
 *
 * @remarks
 * **[KO]**
 * - 값 설정 시 {@link validateNumber}를 통해 런타임 타입 검사가 수행됩니다.
 * - `min`과 `max` 값이 설정된 경우, 범위 외의 값이 들어오면 `console.warn` 경고를 출력한 후 해당 최소/최대값으로 값을 조절하여 설정합니다.
 * - 값이 바뀌면 감지하여 자동으로 GPU의 유니폼 버퍼를 업데이트합니다.
 *
 * **[EN]**
 * - Performs runtime type check via {@link validateNumber} upon setting value.
 * - If `min` and `max` are set, values out of bounds trigger `console.warn` and are clamped to the boundaries.
 * - Automatically updates the GPU uniform buffer on value change.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 단일 {@link DefineNumberInfo} 설정 또는 그 배열 [EN] A single {@link DefineNumberInfo} configuration or an array of configurations
 *
 * @example
 * ```typescript
 * // 단일 설정 (범위 제한 포함)
 * RedGPU.DefineGPUProperty.defineNumber(MyMaterial, { key: 'roughness', value: 0.5, min: 0, max: 1 });
 *
 * // 여러 속성 일괄 정의
 * RedGPU.DefineGPUProperty.defineNumber(MyMaterial, [
 *   { key: 'opacity', value: 1.0, min: 0, max: 1 },
 *   { key: 'shininess', value: 30 }
 * ]);
 * ```
 */
const defineNumber = (target: any, defineInfo: DefineNumberInfo | DefineNumberInfo[]) => applyProperties(target, defineInfo, defineNumber_func);

Object.freeze(defineNumber);
export default defineNumber;
