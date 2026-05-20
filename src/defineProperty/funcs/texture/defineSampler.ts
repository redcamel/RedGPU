import Sampler from "../../../resources/sampler/Sampler";
import applyProperties from "../../core/applyProperties";
import defineProperty_SETTING from "../../core/defineProperty_SETTING";

export interface IDefineSampler {
    key: string;
}

function defineSampler_func(propertyKey: IDefineSampler) {
    const {key} = propertyKey;
    const symbol = Symbol(key);
    return {
        get: function (): Sampler {
            return this[symbol];
        },
        set: function (sampler: Sampler) {
            const prevSampler: Sampler = this[symbol];
            this[symbol] = sampler;
            this.updateSampler(prevSampler, sampler);
        },
        ...defineProperty_SETTING,
    };
}

/**
 * [KO] 지정된 클래스에 샘플러(Sampler) 속성들을 정의합니다.
 * [EN] Defines sampler properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param keys - [KO] 정의할 속성 설정(IDefineSampler) 또는 설정 배열 [EN] Configuration (IDefineSampler) or array of configurations
 *
 * @example
 * ```typescript
 * // 설정 객체 방식 (IDefineSampler)
 * DefineUniformProperty.defineSampler(MyMaterial, { key: 'diffuseSampler' });
 * DefineUniformProperty.defineSampler(MyMaterial, [{ key: 'diffuseSampler' }]);
 * ```
 */
const defineSampler = (target: any, keys: IDefineSampler | IDefineSampler[]) => applyProperties(target, keys, defineSampler_func);

Object.freeze(defineSampler);
export default defineSampler;
