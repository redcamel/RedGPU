import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "./ASinglePassPostEffect";

/**
 * [KO] 다중 패스 후처리 이펙트(AMultiPassPostEffect) 추상 클래스입니다.
 * [EN] Abstract class for multi-pass post-processing effects (AMultiPassPostEffect).
 *
 * [KO] 여러 개의 단일 패스 이펙트를 순차적으로 적용할 수 있습니다.
 * [EN] Can apply multiple single-pass effects sequentially.
 *
 * @category PostEffect
 */
abstract class AMultiPassPostEffect extends ASinglePassPostEffect {
    /** 
     * [KO] 내부 패스 리스트 
     * [EN] Internal pass list
     */
    #passList: ASinglePassPostEffect[] = []
    /** 
     * [KO] 비디오 메모리 사용량(byte)
     * [EN] Video memory usage (bytes)
     */
    #videoMemorySize: number = 0

    /**
     * [KO] AMultiPassPostEffect 인스턴스를 생성합니다.
     * [EN] Creates an AMultiPassPostEffect instance.
     *
     * @param redGPUContext 
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     * @param passList 
     * [KO] 적용할 단일 패스 이펙트 배열
     * [EN] Array of single-pass effects to apply
     */
    constructor(redGPUContext: RedGPUContext, passList: ASinglePassPostEffect[]) {
        super(redGPUContext);
        this.#passList.push(
            ...passList
        )
    }

    /** 
     * [KO] 비디오 메모리 사용량 (바이트)
     * [EN] Video memory usage (bytes)
     */
    get videoMemorySize(): number {
        this.#calcVideoMemory()
        return this.#videoMemorySize
    }

    /** 
     * [KO] 내부 패스 리스트
     * [EN] Internal pass list
     */
    get passList(): ASinglePassPostEffect[] {
        return this.#passList;
    }

    /** 
     * [KO] 모든 패스의 리소스를 정리합니다.
     * [EN] Clears resources of all passes.
     */
    clear() {
        this.#passList.forEach(v => v.clear())
    }

    /**
     * [KO] 모든 패스를 순차적으로 렌더링합니다.
     * [EN] Renders all passes sequentially.
     *
     * @param view 
     * [KO] 렌더링할 뷰
     * [EN] View to render
     * @param width 
     * [KO] 렌더링 너비
     * [EN] Render width
     * @param height 
     * [KO] 렌더링 높이
     * [EN] Render height
     * @param sourceTextureInfo 
     * [KO] 입력 텍스처 정보
     * [EN] Input texture information
     * @returns 
     * [KO] 마지막 패스의 결과
     * [EN] Result of the last pass
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult {
        let targetOutputInfo: ASinglePassPostEffectResult
        this.#passList.forEach((effect: ASinglePassPostEffect, index) => {
            if (index) sourceTextureInfo = targetOutputInfo
            targetOutputInfo = effect.render(
                view, width, height, sourceTextureInfo
            )
        })
        return targetOutputInfo
    }

    /** 
     * [KO] 내부 비디오 메모리 계산
     * [EN] Calculate internal video memory
     */
    #calcVideoMemory() {
        this.#videoMemorySize = 0
        this.#passList.forEach(texture => {
            this.#videoMemorySize += texture.videoMemorySize
        })
    }
}

Object.freeze(AMultiPassPostEffect)
export default AMultiPassPostEffect