import Sampler from "../../../resources/sampler/Sampler";
import applyProperties from "../../core/applyProperties";
import defineProperty_SETTING from "../../core/defineProperty_SETTING";

/**
 * `defineSampler` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.
 */
export interface DefineSamplerInfo {
    /**
     * [KO] 속성의 키 이름. 대상 객체 프로토타입에 이 이름으로 정의됩니다.
     * [EN] Key name of the property. Defined on the target object's prototype under this name.
     */
    key: string;
}

function defineSampler_func(propertyInfo: DefineSamplerInfo) {
    const {key} = propertyInfo;
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
 * 지정된 클래스의 프로토타입에 GPU와 연동되는 텍스처 샘플러(Sampler) 속성을 정의합니다.
 *
 * @remarks
 * **[KO]**
 * - 해당 속성의 getter/setter는 {@link Sampler} 인스턴스를 처리합니다.
 * - 샘플러가 설정되면 자동으로 바인드 그룹을 업데이트하기 위해 대상 인스턴스의 `updateSampler(prevSampler, sampler)` 메서드가 호출됩니다.
 *
 * **[EN]**
 * - Handles {@link Sampler} instances.
 * - When a sampler is set, it invokes `updateSampler(prevSampler, sampler)` on the target instance to update bind groups.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 단일 {@link DefineSamplerInfo} 설정 또는 그 배열 [EN] A single {@link DefineSamplerInfo} configuration or an array of configurations
 *
 * @example
 * ```typescript
 * // 단일 설정
 * RedGPU.DefineGPUProperty.defineSampler(MyMaterial, { key: 'diffuseSampler' });
 *
 * // 여러 속성 일괄 정의
 * RedGPU.DefineGPUProperty.defineSampler(MyMaterial, [
 *   { key: 'diffuseSampler' },
 *   { key: 'normalSampler' }
 * ]);
 * ```
 */
const defineSampler = (target: any, defineInfo: DefineSamplerInfo | DefineSamplerInfo[]) => applyProperties(target, defineInfo, defineSampler_func);

Object.freeze(defineSampler);
export default defineSampler;
