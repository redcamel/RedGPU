import Sampler from "../../resources/sampler/Sampler";
import applyProperties from "../core/applyProperties";
import defineProperty_SETTING from "../old/funcs/defineProperty_SETTING";

/**
 * [KO] 개별 샘플러 속성에 대한 속성 기술자(Property Descriptor)를 생성합니다.
 * [EN] Creates a property descriptor for an individual sampler property.
 *
 * @param propertyKey - [KO] 속성 키 이름 [EN] Property key name
 */
function defineSampler_func(propertyKey: string) {
    const symbol = Symbol(propertyKey)
    return {
        get: function (): Sampler {
            return this[symbol]
        },
        set: function (sampler: Sampler) {
            const prevSampler: Sampler = this[symbol]
            this[symbol] = sampler;
            this.updateSampler(prevSampler, sampler)
        },
        ...defineProperty_SETTING
    }
}

/**
 * [KO] 지정된 클래스에 샘플러(Sampler) 속성들을 정의합니다.
 * [EN] Defines sampler properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param keys - [KO] 정의할 속성 키 또는 키 배열 [EN] Property key or array of keys to define
 *
 * @example
 * ```typescript
 * DefineProperty.defineSampler(MyMaterial, 'diffuseSampler');
 * DefineProperty.defineSampler(MyMaterial, ['sampler0', 'sampler1']);
 * ```
 */
const defineSampler = (target: any, keys: string | string[]) => applyProperties(target, keys, defineSampler_func);

Object.freeze(defineSampler)
export default defineSampler;
