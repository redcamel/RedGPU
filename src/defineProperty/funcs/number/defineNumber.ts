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
    propertyInfo: IDefineNumber
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
 * @param defineInfo - [KO] 단일 {@link IDefineNumber} 설정 또는 그 배열 [EN] A single {@link IDefineNumber} configuration or an array of configurations
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
const defineNumber = (target: any, defineInfo: IDefineNumber | IDefineNumber[]) => applyProperties(target, defineInfo, defineNumber_func);

Object.freeze(defineNumber);
export default defineNumber;
