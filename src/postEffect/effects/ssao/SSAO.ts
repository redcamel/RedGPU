import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {IPostEffectResult} from "../../core/types";
import GaussianBlur from "../blur/GaussianBlur";
import SSAO_AO from "./ssao_ao/SSAO_AO";
import SSAOBlend from "./ssao_blend/SSAOBlend";

/**
 * [KO] 깊이(Depth)와 법선(Normal) 버퍼를 기반으로 주변광 차폐(Ambient Occlusion) 음영을 생성하는 SSAO 후처리 이펙트 클래스입니다.
 * [EN] SSAO post-processing effect class that generates ambient occlusion shadows based on depth and normal buffers.
 *
 * [KO] 1/2 해상도 차폐도 계산(`SSAO_AO`), 가우시안 블러(`GaussianBlur`), 깊이 인식 업샘플 합성(`SSAOBlend`)의 3단계 패스로 동작하며, `View3D`의 `PostEffectManager`에 의해 자동으로 생성됩니다.
 * [EN] Operates in a 3-pass pipeline consisting of half-resolution occlusion calculation (`SSAO_AO`), Gaussian blur (`GaussianBlur`), and depth-aware upsample blending (`SSAOBlend`), and is automatically created by `PostEffectManager` of `View3D`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 postEffectManager를 통해 SSAO 활성화 및 설정 제어
 * // [EN] Enable and configure SSAO through View3D's postEffectManager
 * view.postEffectManager.useSSAO = true;
 * const ssaoEffect = view.postEffectManager.ssao;
 * ssaoEffect.radius = 0.5;
 * ssaoEffect.intensity = 1.5;
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/ssao/"></iframe>
 * @see [SSAO example](/RedGPU/examples/postEffect/ssao/)
 * @category PostEffect
 */
class SSAO extends AMultiPassPostEffect {
    #effect_ao: SSAO_AO
    #effect_blur: GaussianBlur
    #effect_blend: SSAOBlend


    /**
     * [KO] SSAO 인스턴스를 생성합니다.
     * [EN] Creates an SSAO instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            [
                new SSAO_AO(redGPUContext),
                new GaussianBlur(redGPUContext),
                new SSAOBlend(redGPUContext),
            ],
        );
        this.#effect_ao = this.passList[0] as SSAO_AO
        this.#effect_blur = this.passList[1] as GaussianBlur
        this.#effect_blur.size = 1.5
        this.#effect_blend = this.passList[2] as SSAOBlend
    }

    /**
     * [KO] AO 노이즈 억제를 위한 가우시안 블러 패스 사용 여부를 반환하거나 설정합니다.
     * [EN] Returns or sets whether the Gaussian blur pass is used to suppress AO noise.
     *
     * @returns
     * [KO] 블러 사용 여부 (기본값: `true`)
     * [EN] Whether blur is used (default: `true`)
     */
    get useBlur(): boolean {
        return this.#effect_ao.useBlur;
    }

    set useBlur(value: boolean) {
        this.#effect_ao.useBlur = value;
    }

    /**
     * [KO] 차폐를 계산할 월드 단위 샘플링 반경을 반환하거나 설정합니다.
     * [EN] Returns or sets the sampling radius in world units for occlusion calculation.
     *
     * @returns
     * [KO] 샘플링 반경 (범위: 0.01 ~ 5.0, 기본값: 0.253)
     * [EN] Sampling radius (range: 0.01 ~ 5.0, default: 0.253)
     */
    get radius(): number {
        return this.#effect_ao.radius;
    }

    set radius(value: number) {
        this.#effect_ao.radius = value;
    }

    /**
     * [KO] AO 음영의 강도를 반환하거나 설정합니다.
     * [EN] Returns or sets the intensity of the AO shadow.
     *
     * @returns
     * [KO] AO 강도 (범위: 0 ~ 10, 기본값: 1)
     * [EN] AO intensity (range: 0 ~ 10, default: 1)
     */
    get intensity(): number {
        return this.#effect_ao.intensity;
    }

    set intensity(value: number) {
        this.#effect_ao.intensity = value;
    }

    /**
     * [KO] 자기 차폐(Self-occlusion) 현상을 방지하기 위한 깊이 바이어스 값을 반환하거나 설정합니다.
     * [EN] Returns or sets the depth bias value to prevent self-occlusion artifacts.
     *
     * @returns
     * [KO] 깊이 바이어스 (범위: 0.0 ~ 0.1, 기본값: 0.02)
     * [EN] Depth bias (range: 0.0 ~ 0.1, default: 0.02)
     */
    get bias(): number {
        return this.#effect_ao.bias;
    }

    set bias(value: number) {
        this.#effect_ao.bias = value;
    }

    /**
     * [KO] 카메라 거리에 비례하여 적용되는 바이어스 스케일 계수를 반환하거나 설정합니다.
     * [EN] Returns or sets the bias scale factor applied proportionally to camera distance.
     *
     * @returns
     * [KO] 거리별 바이어스 스케일 (범위: 0.0 ~ 0.5, 기본값: 0.02)
     * [EN] Bias distance scale (range: 0.0 ~ 0.5, default: 0.02)
     */
    get biasDistanceScale(): number {
        return this.#effect_ao.biasDistanceScale;
    }

    set biasDistanceScale(value: number) {
        this.#effect_ao.biasDistanceScale = value;
    }

    /**
     * [KO] AO 효과가 감쇠되기 시작하는 카메라 거리를 반환하거나 설정합니다.
     * [EN] Returns or sets the camera distance at which the AO effect starts to fade out.
     *
     * @returns
     * [KO] 페이드 시작 거리 (범위: 1.0 ~ 200.0, 기본값: 30.0)
     * [EN] Fade start distance (range: 1.0 ~ 200.0, default: 30.0)
     */
    get fadeDistanceStart(): number {
        return this.#effect_ao.fadeDistanceStart;
    }

    set fadeDistanceStart(value: number) {
        this.#effect_ao.fadeDistanceStart = value;
    }

    /**
     * [KO] AO 효과가 완전히 사라지기까지의 페이드 거리 구간 길이를 반환하거나 설정합니다.
     * [EN] Returns or sets the fade distance range over which the AO effect completely fades out.
     *
     * @returns
     * [KO] 페이드 거리 범위 (범위: 1.0 ~ 100.0, 기본값: 20.0)
     * [EN] Fade distance range (range: 1.0 ~ 100.0, default: 20.0)
     */
    get fadeDistanceRange(): number {
        return this.#effect_ao.fadeDistanceRange;
    }

    set fadeDistanceRange(value: number) {
        this.#effect_ao.fadeDistanceRange = value;
    }

    /**
     * [KO] AO 음영의 대비(Contrast)를 반환하거나 설정합니다.
     * [EN] Returns or sets the contrast of the AO shadow.
     *
     * @returns
     * [KO] 대비 값 (범위: 0.5 ~ 4.0, 기본값: 1.5)
     * [EN] Contrast value (range: 0.5 ~ 4.0, default: 1.5)
     */
    get contrast(): number {
        return this.#effect_ao.contrast;
    }

    set contrast(value: number) {
        this.#effect_ao.contrast = value;
    }


    /**
     * [KO] SSAO 다중 패스 효과를 렌더링합니다.
     * [EN] Renders the multi-pass SSAO effect.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width -
     * [KO] 렌더링 너비 (픽셀 단위)
     * [EN] Rendering width (in pixels)
     * @param height -
     * [KO] 렌더링 높이 (픽셀 단위)
     * [EN] Rendering height (in pixels)
     * @param sourceTextureInfo -
     * [KO] 원본 소스 텍스처 정보
     * [EN] Original source texture information
     * @returns
     * [KO] SSAO가 합성된 후처리 결과 (`IPostEffectResult`)
     * [EN] Post-effect result with SSAO composited (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult) {
        const pool = view.postEffectManager.texturePool;
        const downW = Math.max(1, (width * 0.5) | 0);
        const downH = Math.max(1, (height * 0.5) | 0);

        const aoResult = this.#effect_ao.render(
            view, downW, downH, sourceTextureInfo
        );

        if (this.useBlur) {
            const blurResult = this.#effect_blur.render(
                view, downW, downH, aoResult
            );
            pool.release(aoResult.texture);

            const blendResult = this.#effect_blend.render(
                view, width, height, sourceTextureInfo, blurResult
            );
            pool.release(blurResult.texture);

            return blendResult;
        } else {
            const blendResult = this.#effect_blend.render(
                view, width, height, sourceTextureInfo, aoResult
            );
            pool.release(aoResult.texture);

            return blendResult;
        }
    }
}

Object.freeze(SSAO)
export default SSAO
