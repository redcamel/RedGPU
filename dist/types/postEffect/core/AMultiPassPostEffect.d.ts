import RedGPUObject from "../../base/RedGPUObject";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ASingleComputePassPostEffect from "./ASingleComputePassPostEffect";
import ASingleRenderPassPostEffect from "./ASingleRenderPassPostEffect";
import { IPostEffectResult } from "./types";
interface AMultiPassPostEffect {
    /**
     * [KO] 후처리 이펙트 인스턴스 여부
     * [EN] Whether the instance is a post-processing effect
     * @defaultValue true
     */
    isInstanceofPostEffect: boolean;
}
/**
 * [KO] 여러 개의 단일 패스(`ASingleComputePassPostEffect` 또는 `ASingleRenderPassPostEffect`) 이펙트를 순차적으로 연결해 실행하는 다중 패스 후처리 추상 클래스입니다.
 * [EN] Abstract class for multi-pass post-processing effects that sequentially chains and executes multiple single-pass (`ASingleComputePassPostEffect` or `ASingleRenderPassPostEffect`) effects.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
declare abstract class AMultiPassPostEffect extends RedGPUObject {
    #private;
    /**
     * [KO] AMultiPassPostEffect 인스턴스를 생성합니다.
     * [EN] Creates an AMultiPassPostEffect instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param passList -
     * [KO] 순차적으로 실행할 단일 패스 이펙트 배열
     * [EN] Array of single-pass effects to execute sequentially
     * @param isLdr -
     * [KO] 톤매핑 이후 LDR 공간 동작 여부
     * [EN] Whether the effect operates in LDR space after tone mapping
     */
    protected constructor(redGPUContext: RedGPUContext, passList: (ASingleComputePassPostEffect | ASingleRenderPassPostEffect | AMultiPassPostEffect)[], isLdr?: boolean);
    /**
     * [KO] 톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.
     * [EN] Returns whether the effect operates in LDR (Low Dynamic Range) space after tone mapping.
     *
     * @defaultValue false
     * @returns
     * [KO] LDR 공간 동작 여부
     * [EN] Whether the effect operates in LDR space
     */
    get isLdr(): boolean;
    /**
     * [KO] 모든 내부 패스의 비디오 메모리 사용량 합계(바이트)를 반환합니다.
     * [EN] Returns the sum of video memory usage (in bytes) of all internal passes.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Video memory usage (unit: bytes)
     */
    get videoMemorySize(): number;
    /**
     * [KO] 등록된 내부 단일 패스 이펙트 배열을 반환합니다.
     * [EN] Returns the array of registered internal single-pass effects.
     *
     * @returns
     * [KO] 내부 단일 패스 이펙트 배열 (`(ASingleComputePassPostEffect | ASingleRenderPassPostEffect | AMultiPassPostEffect)[]`)
     * [EN] Array of internal single-pass post effects (`(ASingleComputePassPostEffect | ASingleRenderPassPostEffect | AMultiPassPostEffect)[]`)
     */
    get passList(): (ASingleComputePassPostEffect | ASingleRenderPassPostEffect | AMultiPassPostEffect)[];
    /**
     * [KO] 모든 내부 패스 이펙트와 할당된 리소스를 파기합니다.
     * [EN] Destroys all internal pass effects and allocated resources.
     */
    destroy(): void;
    /**
     * [KO] 등록된 모든 내부 패스의 캐시 리소스를 비웁니다.
     * [EN] Clears cached resources of all registered internal passes.
     */
    clear(): void;
    /**
     * [KO] 내부 패스들을 순차적으로 실행하고 최종 패스의 렌더링 결과를 반환합니다.
     * [EN] Sequentially executes internal passes and returns the rendering result of the final pass.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     * @param width -
     * [KO] 렌더링 너비 (단위: 픽셀)
     * [EN] Rendering width (in pixels)
     * @param height -
     * [KO] 렌더링 높이 (단위: 픽셀)
     * [EN] Rendering height (in pixels)
     * @param sourceTextureInfo -
     * [KO] 최초 입력 소스 텍스처 정보
     * [EN] Initial input source texture information
     * @returns
     * [KO] 최종 패스의 출력 텍스처 정보 (`IPostEffectResult`)
     * [EN] Output texture information of the final pass (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
}
export default AMultiPassPostEffect;
