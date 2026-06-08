import applyProperties from "../core/applyProperties";
import updateTargetUniform from "../core/updateTargetUniform";
import defineProperty_SETTING from "../core/defineProperty_SETTING";

/**
 * `defineBoolean` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.
 *
 * @remarks
 * [KO] GPU는 불리언(Boolean)을 직접 지원하지 않으므로, 유니폼 버퍼에 기록 시 정수 0 또는 1로 변환됩니다.
 * [EN] Since GPUs do not natively support booleans, they are converted to 0 or 1 integers when written to the uniform buffer.
 */
export interface IDefineBoolean {
    /**
     * [KO] 속성의 키 이름. 대상 객체 프로토타입에 이 이름으로 정의됩니다.
     * [EN] Key name of the property. Defined on the target object's prototype under this name.
     */
    key: string;
    /**
     * [KO] 속성의 초기 불리언 값.
     * [EN] Initial boolean value of the property.
     */
    value: boolean;
}

function createSetter(
    propertyKey: string,
    symbol: symbol
) {
    return function (newValue: boolean) {
        if (typeof newValue !== 'boolean') {
            console.warn(`Value for ${propertyKey} should be a boolean. Received: ${typeof newValue}.`);
        }

        this[symbol] = newValue;

        // GPU 버퍼에는 boolean 대신 1 또는 0으로 변환하여 저장
        updateTargetUniform(this, propertyKey, newValue ? 1 : 0);

        // 파이프라인 갱신 플래그 설정
        this.dirtyPipeline = true;
    };
}

function defineBoolean_func(
    propertyInfo: IDefineBoolean
) {
    const {key, value = false} = propertyInfo;
    const symbol = Symbol(key);
    return {
        get: function (): boolean {
            if (this[symbol] === undefined) this[symbol] = value;
            return this[symbol];
        },
        set: createSetter(key, symbol),
        ...defineProperty_SETTING,
    };
}

/**
 * 지정된 클래스의 프로토타입에 GPU와 연동되는 사용자 정의 불리언(Boolean) 속성을 정의합니다.
 *
 * @remarks
 * **[KO]**
 * - GPU 버퍼는 불리언을 지원하지 않으므로, setter는 `true` → `1`, `false` → `0`으로 변환하여 {@link updateTargetUniform}에 전달합니다.
 * - 속성에 `boolean`이 아닌 값을 할당하면 `console.warn`으로 경고합니다.
 * - 값 변경 시 `dirtyPipeline = true`로 설정하여 렌더 파이프라인 재빌드를 트리거합니다.
 *
 * **[EN]**
 * - Since GPU buffers do not support booleans, the setter converts `true` → `1` and `false` → `0` before calling {@link updateTargetUniform}.
 * - Assigning a non-boolean value emits a `console.warn`.
 * - Sets `dirtyPipeline = true` on change to trigger render pipeline rebuild.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 단일 {@link IDefineBoolean} 설정 또는 그 배열 [EN] A single {@link IDefineBoolean} configuration or an array of configurations
 *
 * @example
 * ```typescript
 * // 단일 설정
 * RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, { key: 'useAlphaTest', value: true });
 *
 * // 여러 속성 일괄 정의
 * RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, [
 *   { key: 'useAlphaTest', value: true },
 *   { key: 'useNormalMap', value: false },
 * ]);
 * ```
 */
const defineBoolean = (target: any, defineInfo: IDefineBoolean | IDefineBoolean[]) => applyProperties(target, defineInfo, defineBoolean_func);

Object.freeze(defineBoolean);
export default defineBoolean;
