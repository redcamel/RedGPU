import View3D from "../display/view/View3D";
import UniformBuffer from "../resources/buffer/uniformBuffer/UniformBuffer";
import AMultiPassPostEffect from "./core/AMultiPassPostEffect";
import ASinglePassPostEffect from "./core/ASinglePassPostEffect";
import SSAO from "./effects/ssao/SSAO";
import SSR from "./effects/ssr/SSR";
/**
 * [KO] 후처리 이펙트(PostEffect) 관리 클래스입니다.
 * [EN] Class for managing post-processing effects.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다. <br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system. <br/> Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * * ### Example
 * ```typescript
 * const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
 * const effect = new RedGPU.PostEffect.Bloom(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * @category Core
 */
declare class PostEffectManager {
    #private;
    /**
     * [KO] PostEffectManager 인스턴스를 생성합니다.
     * [EN] Creates a PostEffectManager instance.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     */
    constructor(view: View3D);
    /**
     * [KO] SSAO 사용 여부를 반환합니다.
     * [EN] Returns whether SSAO is used.
     *
     * @returns
     * [KO] SSAO 사용 여부
     * [EN] Whether SSAO is used
     */
    get useSSAO(): boolean;
    /**
     * [KO] SSAO 사용 여부를 설정합니다.
     * [EN] Sets whether SSAO is used.
     *
     * @param value -
     * [KO] SSAO 사용 여부
     * [EN] Whether SSAO is used
     */
    set useSSAO(value: boolean);
    /**
     * [KO] SSAO 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the SSAO effect instance.
     *
     * @returns
     * [KO] SSAO 인스턴스
     * [EN] SSAO instance
     */
    get ssao(): SSAO;
    /**
     * [KO] SSR 사용 여부를 반환합니다.
     * [EN] Returns whether SSR is used.
     *
     * @returns
     * [KO] SSR 사용 여부
     * [EN] Whether SSR is used
     */
    get useSSR(): boolean;
    /**
     * [KO] SSR 사용 여부를 설정합니다.
     * [EN] Sets whether SSR is used.
     *
     * @param value -
     * [KO] SSR 사용 여부
     * [EN] Whether SSR is used
     */
    set useSSR(value: boolean);
    /**
     * [KO] SSR 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the SSR effect instance.
     *
     * @returns
     * [KO] SSR 인스턴스
     * [EN] SSR instance
     */
    get ssr(): SSR;
    /**
     * [KO] 시스템 유니폼 버퍼를 반환합니다.
     * [EN] Returns the system uniform buffer.
     *
     * @returns
     * [KO] UniformBuffer 인스턴스
     * [EN] UniformBuffer instance
     */
    get postEffectSystemUniformBuffer(): UniformBuffer;
    /**
     * [KO] 연결된 View3D 인스턴스를 반환합니다.
     * [EN] Returns the connected View3D instance.
     *
     * @returns
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     */
    get view(): View3D;
    /**
     * [KO] 등록된 이펙트 리스트를 반환합니다.
     * [EN] Returns the list of registered effects.
     *
     * @returns
     * [KO] 후처리 이펙트 배열
     * [EN] Array of post-processing effects
     */
    get effectList(): Array<ASinglePassPostEffect | AMultiPassPostEffect>;
    /**
     * [KO] 비디오 메모리 사용량을 반환합니다.
     * [EN] Returns video memory usage.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (bytes)
     * [EN] Video memory usage (bytes)
     */
    get videoMemorySize(): number;
    /**
     * [KO] 이펙트를 추가합니다.
     * [EN] Adds an effect.
     *
     * * ### Example
     * ```typescript
     * view.postEffectManager.addEffect(new RedGPU.PostEffect.Bloom(redGPUContext));
     * ```
     *
     * @param v -
     * [KO] 추가할 이펙트
     * [EN] Effect to add
     */
    addEffect(v: ASinglePassPostEffect | AMultiPassPostEffect): void;
    /**
     * [KO] 특정 인덱스의 이펙트를 반환합니다.
     * [EN] Returns the effect at a specific index.
     *
     * @param index -
     * [KO] 인덱스
     * [EN] Index
     * @returns
     * [KO] 해당 인덱스의 이펙트
     * [EN] Effect at the given index
     */
    getEffectAt(index: number): ASinglePassPostEffect | AMultiPassPostEffect;
    /**
     * [KO] 모든 이펙트를 제거합니다.
     * [EN] Removes all effects.
     */
    removeAllEffect(): void;
    /**
     * [KO] 후처리 파이프라인을 렌더링합니다.
     * [EN] Renders the post-processing pipeline.
     *
     * @returns
     * [KO] 렌더링 결과 텍스처 정보
     * [EN] Rendering result texture information
     */
    render(): {
        texture: GPUTexture;
        textureView: GPUTextureView;
    };
    /**
     * [KO] 모든 이펙트 리소스를 정리합니다.
     * [EN] Clears all effect resources.
     */
    clear(): void;
}
export default PostEffectManager;
