import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import { IPostEffectResult } from "../../core/types";
/**
 * [KO] 깊이(Depth)와 법선(Normal) 버퍼를 기반으로 주변광 차폐(Ambient Occlusion) 음영을 생성하는 SSAO 후처리 이펙트입니다.
 * [EN] SSAO post-processing effect that generates ambient occlusion shadows based on depth and normal buffers.
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
 * const ssao = view.postEffectManager.ssao;
 * ssao.radius = 0.5;
 * ssao.intensity = 1.5;
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/ssao/" style="width:100%; height:500px;"></iframe>
 *
 * @see [SSAO example](/RedGPU/examples/postEffect/ssao/)
 * @category PostEffect
 */
declare class SSAO extends AMultiPassPostEffect {
    #private;
    /**
     * [KO] SSAO 인스턴스를 생성합니다.
     * [EN] Creates an SSAO instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] AO 노이즈 억제를 위한 가우시안 블러 패스 사용 여부를 반환하거나 설정합니다.
     * [EN] Returns or sets whether the Gaussian blur pass is used to suppress AO noise.
     *
     * @defaultValue true
     * @returns
     * [KO] 블러 사용 여부
     * [EN] Whether blur is used
     */
    get useBlur(): boolean;
    set useBlur(value: boolean);
    /**
     * [KO] 차폐를 계산할 월드 단위 샘플링 반경(0.01 ~ 5.0)을 반환하거나 설정합니다.
     * [EN] Returns or sets the sampling radius in world units (0.01 ~ 5.0) for occlusion calculation.
     *
     * @defaultValue 0.25
     * @returns
     * [KO] 샘플링 반경
     * [EN] Sampling radius
     */
    get radius(): number;
    set radius(value: number);
    /**
     * [KO] AO 음영의 강도(0 ~ 10)를 반환하거나 설정합니다.
     * [EN] Returns or sets the intensity (0 ~ 10) of the AO shadow.
     *
     * @defaultValue 1
     * @returns
     * [KO] AO 강도
     * [EN] AO intensity
     */
    get intensity(): number;
    set intensity(value: number);
    /**
     * [KO] 자기 차폐(Self-occlusion) 현상을 방지하기 위한 깊이 바이어스 값(0.0 ~ 0.1)을 반환하거나 설정합니다.
     * [EN] Returns or sets the depth bias value (0.0 ~ 0.1) to prevent self-occlusion artifacts.
     *
     * @defaultValue 0.02
     * @returns
     * [KO] 깊이 바이어스
     * [EN] Depth bias
     */
    get bias(): number;
    set bias(value: number);
    /**
     * [KO] 카메라 거리에 비례하여 적용되는 바이어스 스케일 계수(0.0 ~ 0.5)를 반환하거나 설정합니다.
     * [EN] Returns or sets the bias scale factor (0.0 ~ 0.5) applied proportionally to camera distance.
     *
     * @defaultValue 0.02
     * @returns
     * [KO] 거리별 바이어스 스케일
     * [EN] Bias distance scale
     */
    get biasDistanceScale(): number;
    set biasDistanceScale(value: number);
    /**
     * [KO] AO 효과가 감쇠되기 시작하는 카메라 거리(1.0 ~ 200.0)를 반환하거나 설정합니다.
     * [EN] Returns or sets the camera distance (1.0 ~ 200.0) at which the AO effect starts to fade out.
     *
     * @defaultValue 30.0
     * @returns
     * [KO] 페이드 시작 거리
     * [EN] Fade start distance
     */
    get fadeDistanceStart(): number;
    set fadeDistanceStart(value: number);
    /**
     * [KO] AO 효과가 완전히 사라지기까지의 페이드 거리 구간 길이(1.0 ~ 100.0)를 반환하거나 설정합니다.
     * [EN] Returns or sets the fade distance range (1.0 ~ 100.0) over which the AO effect completely fades out.
     *
     * @defaultValue 20.0
     * @returns
     * [KO] 페이드 거리 범위
     * [EN] Fade distance range
     */
    get fadeDistanceRange(): number;
    set fadeDistanceRange(value: number);
    /**
     * [KO] AO 음영의 대비(0.5 ~ 4.0)를 반환하거나 설정합니다.
     * [EN] Returns or sets the contrast (0.5 ~ 4.0) of the AO shadow.
     *
     * @defaultValue 1.5
     * @returns
     * [KO] 대비 값
     * [EN] Contrast value
     */
    get contrast(): number;
    set contrast(value: number);
    /**
     * [KO] SSAO 다중 패스 후처리 효과를 렌더링합니다.
     * [EN] Renders the multi-pass SSAO post-processing effect.
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
     * [KO] 원본 소스 텍스처 정보
     * [EN] Original source texture information
     * @returns
     * [KO] SSAO가 합성된 후처리 결과 (`IPostEffectResult`)
     * [EN] Post-effect result with SSAO composited (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
}
export default SSAO;
