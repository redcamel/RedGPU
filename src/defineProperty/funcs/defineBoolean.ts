import applyProperties from "../core/applyProperties";
import updateTargetUniform from "../core/updateTargetUniform";
import defineProperty_SETTING from "../core/defineProperty_SETTING";

export interface IDefineBoolean {
    key: string;
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
 * [KO] 지정된 클래스에 부울(Boolean) 속성들을 정의합니다.
 * [EN] Defines boolean properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 정의할 속성 설정(IDefineBoolean) 또는 설정 배열 [EN] Configuration (IDefineBoolean) or array of configurations
 *
 * @example
 * ```typescript
 * // 설정 객체 방식 (IDefineBoolean)
 * RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, { key: 'useAlphaTest', value: true });
 * RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, [{ key: 'useAlphaTest', value: true }]);
 * ```
 */
const defineBoolean = (target: any, defineInfo: IDefineBoolean | IDefineBoolean[]) => applyProperties(target, defineInfo, defineBoolean_func);

Object.freeze(defineBoolean);
export default defineBoolean;
