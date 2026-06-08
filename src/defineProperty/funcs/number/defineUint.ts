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
 * 지정된 클래스의 프로토타입에 GPU와 연동되는 부호 없는 정수(Uint) 속성을 정의합니다.
 *
 * @remarks
 * **[KO]**
 * - 값 설정 시 {@link validateUintRange}를 통해 0 이상의 정수(unsigned integer)인지 검사합니다.
 * - 범위 외의 정수나 실수가 들어오면 `console.warn` 경고를 출력한 후 최소/최대 범위 및 정수 값으로 조절하여 저장하고 GPU 버퍼에 반영합니다.
 *
 * **[EN]**
 * - Validates that the input is an unsigned integer (>= 0) via {@link validateUintRange}.
 * - Values outside the range print a `console.warn` and are clamped/adjusted before writing to the GPU buffer.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 단일 {@link IDefineUint} 설정 또는 그 배열 [EN] A single {@link IDefineUint} configuration or an array of configurations
 *
 * @example
 * ```typescript
 * // 단일 설정
 * RedGPU.DefineGPUProperty.defineUint(MyMaterial, { key: 'lightType', value: 1, min: 0, max: 10 });
 *
 * // 여러 속성 일괄 정의
 * RedGPU.DefineGPUProperty.defineUint(MyMaterial, [
 *   { key: 'shadowMode', value: 0 },
 *   { key: 'maxLights', value: 4, min: 0, max: 16 }
 * ]);
 * ```
 */
const defineUint = (target: any, defineInfo: IDefineUint | IDefineUint[]) => applyProperties(target, defineInfo, defineUintRange_func);

Object.freeze(defineUint);
export default defineUint;
