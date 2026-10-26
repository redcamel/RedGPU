/**
 * [KO] `defineSampler` 함수에 전달할 속성 정의 옵션 인터페이스입니다.
 * [EN] Interface for property definition options passed to the `defineSampler` function.
 *
 * @category DefineProperty
 */
export interface DefineSamplerInfo {
    /**
     * [KO] 대상 객체 프로토타입에 정의할 속성 키 이름
     * [EN] Property key name to define on the target object's prototype
     */
    key: string;
}
/**
 * [KO] 지정된 대상의 프로토타입에 GPU 바인드 그룹과 연동되는 텍스처 샘플러 속성을 정의합니다.
 * [EN] Defines texture sampler properties on the target's prototype that synchronize with GPU bind groups.
 *
 * [KO] 샘플러 변경 시 대상의 `updateSampler(prevSampler, sampler)`를 호출하여 바인드 그룹을 자동 갱신합니다.
 * [EN] Invokes `updateSampler(prevSampler, sampler)` on the target when changed to automatically update the bind group.
 *
 * ### Example
 * ```typescript
 * // [KO] 단일 샘플러 속성 정의
 * // [EN] Define a single sampler property
 * RedGPU.DefineGPUProperty.defineSampler(MyMaterial, { key: 'diffuseSampler' });
 *
 * // [KO] 다중 샘플러 속성 일괄 정의
 * // [EN] Define multiple sampler properties at once
 * RedGPU.DefineGPUProperty.defineSampler(MyMaterial, [
 *   { key: 'diffuseSampler' },
 *   { key: 'normalSampler' }
 * ]);
 * ```
 *
 * @param target -
 * [KO] 속성을 정의할 대상 클래스 또는 프로토타입
 * [EN] Target class or prototype to define properties on
 * @param defineInfo -
 * [KO] 단일 `DefineSamplerInfo` 설정 또는 설정 배열
 * [EN] Single `DefineSamplerInfo` configuration or an array of configurations
 * @category DefineProperty
 */
declare const defineSampler: (target: any, defineInfo: DefineSamplerInfo | DefineSamplerInfo[]) => void;
export default defineSampler;
