import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ASinglePassPostEffect from "./ASinglePassPostEffect";
import {IPostEffectResult} from "./types";

/**
 * [KO] 여러 개의 단일 패스(`ASinglePassPostEffect`) 이펙트를 순차적으로 연결해 실행하는 다중 패스 후처리 추상 클래스입니다.
 * [EN] Abstract class for multi-pass post-processing effects that sequentially chains and executes multiple single-pass (`ASinglePassPostEffect`) effects.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
abstract class AMultiPassPostEffect extends ASinglePassPostEffect {
    #passList: ASinglePassPostEffect[] = []

    #videoMemorySize: number = 0
    #destroyed: boolean = false

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
    protected constructor(redGPUContext: RedGPUContext, passList: ASinglePassPostEffect[], isLdr: boolean = false) {
        super(redGPUContext, {isLdr});
        this.#passList.push(...passList);
    }

    /**
     * [KO] 모든 내부 패스의 비디오 메모리 사용량 합계(바이트)를 반환합니다.
     * [EN] Returns the sum of video memory usage (in bytes) of all internal passes.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Video memory usage (unit: bytes)
     */
    get videoMemorySize(): number {
        this.#calcVideoMemory();
        return this.#videoMemorySize;
    }

    /**
     * [KO] 등록된 내부 단일 패스 이펙트 배열을 반환합니다.
     * [EN] Returns the array of registered internal single-pass effects.
     *
     * @returns
     * [KO] 내부 단일 패스 이펙트 배열 (`ASinglePassPostEffect[]`)
     * [EN] Array of internal single-pass post effects (`ASinglePassPostEffect[]`)
     */
    get passList(): ASinglePassPostEffect[] {
        return this.#passList;
    }

    /**
     * [KO] 모든 내부 패스 이펙트와 할당된 리소스를 파기합니다.
     * [EN] Destroys all internal pass effects and allocated resources.
     */
    destroy() {
        if (this.#destroyed) return;
        this.#destroyed = true
        this.#passList.forEach(v => v.destroy());
        this.#passList = null
        super.destroy();
    }

    /**
     * [KO] 등록된 모든 내부 패스의 캐시 리소스를 비웁니다.
     * [EN] Clears cached resources of all registered internal passes.
     */
    clear() {
        this.#passList.forEach(v => v.clear());
    }

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
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        let targetOutputInfo: IPostEffectResult;
        const pool = view.postEffectManager.texturePool;
        const passList = this.#passList;

        for (let i = 0, len = passList.length; i < len; i++) {
            const effect = passList[i];
            const prevTemp = targetOutputInfo;

            if (i > 0) sourceTextureInfo = targetOutputInfo;

            targetOutputInfo = effect.render(view, width, height, sourceTextureInfo);

            if (prevTemp) {
                pool.release(prevTemp.texture);
            }
        }

        return targetOutputInfo;
    }

    #calcVideoMemory() {
        this.#videoMemorySize = 0;
        this.#passList.forEach(effect => {
            this.#videoMemorySize += effect.videoMemorySize;
        });
    }
}

Object.freeze(AMultiPassPostEffect);
export default AMultiPassPostEffect;
