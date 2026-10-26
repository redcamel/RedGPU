import RedGPUObject from "../base/RedGPUObject";
import View3D from "../display/view/View3D";
import UniformBuffer from "../resources/buffer/uniformBuffer/UniformBuffer";
import AMultiPassPostEffect from "./core/AMultiPassPostEffect";
import ASinglePassPostEffect from "./core/ASinglePassPostEffect";
import SSAO from "./effects/ssao/SSAO";
import SSR from "./effects/ssr/SSR";
import AutoExposure from "../camera/core/autoExposure/AutoExposure";
import PostEffectTexturePool from "./core/PostEffectTexturePool";
import { IPostEffectResult } from "./core/types";
/**
 * [KO] `View3D`의 HDR/LDR 후처리 파이프라인(SSAO, SSR, TAA, ToneMapping, FXAA 및 사용자 이펙트)을 통합 관리하는 클래스입니다.
 * [EN] Class that manages the HDR/LDR post-processing pipeline (SSAO, SSR, TAA, ToneMapping, FXAA, and user effects) of a `View3D`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 postEffectManager를 통해 접근
 * // [EN] Access via View3D's postEffectManager
 * const postEffectManager = view.postEffectManager;
 * postEffectManager.addEffect(new RedGPU.PostEffect.Sharpen(redGPUContext));
 * ```
 *
 * @category PostEffect
 */
declare class PostEffectManager extends RedGPUObject {
    #private;
    /**
     * [KO] PostEffectManager 인스턴스를 생성합니다.
     * [EN] Creates a PostEffectManager instance.
     *
     * @param view -
     * [KO] 연결할 `View3D` 인스턴스
     * [EN] `View3D` instance to bind
     */
    constructor(view: View3D);
    /**
     * [KO] 현재 MSAA 상태에 맞는 공유 G-Buffer 바인드 그룹 레이아웃을 반환합니다.
     * [EN] Returns the shared G-Buffer bind group layout matching the current MSAA state.
     *
     * @returns
     * [KO] G-Buffer `GPUBindGroupLayout`
     * [EN] G-Buffer `GPUBindGroupLayout`
     */
    get gbufferBindGroupLayout(): GPUBindGroupLayout;
    /**
     * [KO] 현재 스왑 버퍼 인덱스에 맞는 공유 G-Buffer 바인드 그룹을 반환합니다.
     * [EN] Returns the shared G-Buffer bind group for the current swap buffer index.
     *
     * @returns
     * [KO] 공유 G-Buffer `GPUBindGroup`
     * [EN] Shared G-Buffer `GPUBindGroup`
     */
    get gbufferBindGroup(): GPUBindGroup;
    /**
     * [KO] 후처리 텍스처 풀 인스턴스를 반환합니다.
     * [EN] Returns the post-effect texture pool instance.
     *
     * @returns
     * [KO] `PostEffectTexturePool` 인스턴스
     * [EN] `PostEffectTexturePool` instance
     */
    get texturePool(): PostEffectTexturePool;
    /**
     * [KO] 자동 노출(`AutoExposure`) 인스턴스를 반환합니다.
     * [EN] Returns the `AutoExposure` instance.
     *
     * @returns
     * [KO] `AutoExposure` 인스턴스
     * [EN] `AutoExposure` instance
     */
    get autoExposure(): AutoExposure;
    /**
     * [KO] SSAO(Screen Space Ambient Occlusion) 활성화 여부입니다.
     * [EN] Whether SSAO (Screen Space Ambient Occlusion) is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] SSAO 활성화 여부
     * [EN] Whether SSAO is enabled
     */
    get useSSAO(): boolean;
    set useSSAO(value: boolean);
    /**
     * [KO] SSAO 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the SSAO effect instance.
     *
     * @returns
     * [KO] `SSAO` 인스턴스
     * [EN] `SSAO` instance
     */
    get ssao(): SSAO;
    /**
     * [KO] SSR(Screen Space Reflection) 활성화 여부입니다.
     * [EN] Whether SSR (Screen Space Reflection) is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] SSR 활성화 여부
     * [EN] Whether SSR is enabled
     */
    get useSSR(): boolean;
    set useSSR(value: boolean);
    /**
     * [KO] SSR 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the SSR effect instance.
     *
     * @returns
     * [KO] `SSR` 인스턴스
     * [EN] `SSR` instance
     */
    get ssr(): SSR;
    /**
     * [KO] 후처리 시스템 공용 유니폼 버퍼를 반환합니다.
     * [EN] Returns the post-effect system common uniform buffer.
     *
     * @returns
     * [KO] 시스템 `UniformBuffer` 인스턴스
     * [EN] System `UniformBuffer` instance
     */
    get postEffectSystemUniformBuffer(): UniformBuffer;
    /**
     * [KO] 연결된 `View3D` 인스턴스를 반환합니다.
     * [EN] Returns the bound `View3D` instance.
     *
     * @returns
     * [KO] `View3D` 인스턴스
     * [EN] `View3D` instance
     */
    get view(): View3D;
    /**
     * [KO] 등록된 사용자 후처리 이펙트 배열을 반환합니다.
     * [EN] Returns the array of registered user post-processing effects.
     *
     * @returns
     * [KO] 후처리 이펙트 배열 (`Array<ASinglePassPostEffect | AMultiPassPostEffect>`)
     * [EN] Array of post-processing effects (`Array<ASinglePassPostEffect | AMultiPassPostEffect>`)
     */
    get effectList(): Array<ASinglePassPostEffect | AMultiPassPostEffect>;
    /**
     * [KO] 텍스처 풀과 등록된 이펙트들의 총 비디오 메모리 사용량(바이트)을 반환합니다.
     * [EN] Returns the total video memory usage (in bytes) of the texture pool and registered effects.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Video memory usage (unit: bytes)
     */
    get videoMemorySize(): number;
    /**
     * [KO] 등록된 모든 후처리 이펙트, 텍스처 풀, 시스템 버퍼를 파기합니다.
     * [EN] Destroys all registered post-processing effects, texture pool, and system buffers.
     */
    destroy(): void;
    /**
     * [KO] 후처리 파이프라인에 이펙트를 추가합니다.
     * [EN] Adds an effect to the post-processing pipeline.
     *
     * ### Example
     * ```typescript
     * view.postEffectManager.addEffect(new RedGPU.PostEffect.Sharpen(redGPUContext));
     * ```
     *
     * @param v -
     * [KO] 추가할 후처리 이펙트 인스턴스
     * [EN] Post-processing effect instance to add
     */
    addEffect(v: ASinglePassPostEffect | AMultiPassPostEffect): void;
    /**
     * [KO] 지정된 인덱스의 후처리 이펙트를 반환합니다.
     * [EN] Returns the post-processing effect at the specified index.
     *
     * @param index -
     * [KO] 조회할 인덱스
     * [EN] Index to retrieve
     * @returns
     * [KO] 해당 인덱스의 후처리 이펙트 인스턴스
     * [EN] Post-processing effect instance at the specified index
     */
    getEffectAt(index: number): ASinglePassPostEffect | AMultiPassPostEffect;
    /**
     * [KO] 특정 후처리 이펙트를 파이프라인에서 제거하고 리소스를 정리합니다.
     * [EN] Removes a specific post-processing effect from the pipeline and clears its resources.
     *
     * @param v -
     * [KO] 제거할 후처리 이펙트 인스턴스
     * [EN] Post-processing effect instance to remove
     */
    removeEffect(v: ASinglePassPostEffect | AMultiPassPostEffect): void;
    /**
     * [KO] 지정된 인덱스의 후처리 이펙트를 파이프라인에서 제거하고 리소스를 정리합니다.
     * [EN] Removes the post-processing effect at the specified index from the pipeline and clears its resources.
     *
     * @param index -
     * [KO] 제거할 이펙트의 인덱스
     * [EN] Index of the effect to remove
     */
    removeEffectAt(index: number): void;
    /**
     * [KO] 등록된 모든 후처리 이펙트를 제거하고 리소스를 정리합니다.
     * [EN] Removes all registered post-processing effects and clears their resources.
     */
    removeAllEffect(): void;
    /**
     * [KO] 전체 후처리 파이프라인을 실행하고 최종 출력 텍스처 정보를 반환합니다.
     * [EN] Executes the entire post-processing pipeline and returns the final output texture information.
     *
     * @returns
     * [KO] 최종 렌더링 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] Final rendering result texture information (`IPostEffectResult`)
     */
    render(): IPostEffectResult;
    /**
     * [KO] 등록된 모든 이펙트와 텍스처 풀의 캐시된 리소스를 비웁니다.
     * [EN] Clears cached resources of all registered effects and the texture pool.
     */
    clear(): void;
}
export default PostEffectManager;
