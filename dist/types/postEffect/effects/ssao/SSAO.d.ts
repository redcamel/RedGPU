import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import { IPostEffectResult } from "../../core/types";
/**
 * [KO] SSAO(Screen Space Ambient Occlusion) 후처리 이펙트입니다.
 * [EN] SSAO (Screen Space Ambient Occlusion) post-processing effect.
 *
 * [KO] 깊이(Depth)와 법선(Normal) 정보를 분석하여 물체 간의 근접도를 계산하고, 구석진 곳이나 틈새에 부드러운 그림자를 생성하여 공간감을 극대화합니다.
 * [EN] Analyzes depth and normal information to calculate proximity between objects and generates soft shadows in corners or crevices to maximize the sense of space.
 *
 * [KO] AO 계산(SSAO_AO), 노이즈 제거(GaussianBlur), 원본 합성(SSAOBlend)의 3단계 패스로 구성되어 고품질의 폐쇄 음영을 제공합니다.
 * [EN] Consists of a three-pass process: AO calculation (SSAO_AO), denoising (GaussianBlur), and original composition (SSAOBlend) to provide high-quality ambient occlusion.
 *
 * * ### Example
 * ```typescript
 * // View3D의 postEffectManager를 통해 사용 여부를 제어합니다.
 * // Controlled through the useSSAO property of View3D's postEffectManager.
 * view.postEffectManager.useSSAO = true;
 * const ssaoEffect = view.postEffectManager.ssao;
 * ssaoEffect.radius = 0.5;
 * ssaoEffect.intensity = 1.5;
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/ssao/"></iframe>
 * @category PostEffect
 */
declare class SSAO extends AMultiPassPostEffect {
    #private;
    /**
     * [KO] SSAO 인스턴스를 생성합니다.
     * [EN] Creates an SSAO instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 블러 사용 여부를 반환합니다.
     * [EN] Returns whether blur is used.
     *
     * @returns
     * [KO] 블러 사용 여부
     * [EN] Whether blur is used
     */
    get useBlur(): boolean;
    /**
     * [KO] 블러 사용 여부를 설정합니다.
     * [EN] Sets whether blur is used.
     *
     * @param value -
     * [KO] 블러 사용 여부
     * [EN] Whether blur is used
     */
    set useBlur(value: boolean);
    /**
     * [KO] 반경을 반환합니다.
     * [EN] Returns the radius.
     *
     * @returns
     * [KO] 반경 값
     * [EN] Radius value
     */
    get radius(): number;
    /**
     * [KO] 반경을 설정합니다.
     * [EN] Sets the radius.
     *
     * @param value -
     * [KO] 설정할 반경
     * [EN] Radius to set
     */
    set radius(value: number);
    /**
     * [KO] 강도를 반환합니다.
     * [EN] Returns the intensity.
     *
     * @returns
     * [KO] 강도 값
     * [EN] Intensity value
     */
    get intensity(): number;
    /**
     * [KO] 강도를 설정합니다.
     * [EN] Sets the intensity.
     *
     * @param value -
     * [KO] 설정할 강도
     * [EN] Intensity to set
     */
    set intensity(value: number);
    /**
     * [KO] 바이어스를 반환합니다.
     * [EN] Returns the bias.
     *
     * @returns
     * [KO] 바이어스 값
     * [EN] Bias value
     */
    get bias(): number;
    /**
     * [KO] 바이어스를 설정합니다.
     * [EN] Sets the bias.
     *
     * @param value -
     * [KO] 설정할 바이어스
     * [EN] Bias to set
     */
    set bias(value: number);
    /**
     * [KO] 바이어스 거리 스케일을 반환합니다.
     * [EN] Returns the bias distance scale.
     *
     * @returns
     * [KO] 바이어스 거리 스케일
     * [EN] Bias distance scale
     */
    get biasDistanceScale(): number;
    /**
     * [KO] 바이어스 거리 스케일을 설정합니다.
     * [EN] Sets the bias distance scale.
     *
     * @param value -
     * [KO] 설정할 바이어스 거리 스케일
     * [EN] Bias distance scale to set
     */
    set biasDistanceScale(value: number);
    /**
     * [KO] 페이드 시작 거리를 반환합니다.
     * [EN] Returns the fade start distance.
     *
     * @returns
     * [KO] 페이드 시작 거리
     * [EN] Fade start distance
     */
    get fadeDistanceStart(): number;
    /**
     * [KO] 페이드 시작 거리를 설정합니다.
     * [EN] Sets the fade start distance.
     *
     * @param value -
     * [KO] 설정할 페이드 시작 거리
     * [EN] Fade start distance to set
     */
    set fadeDistanceStart(value: number);
    /**
     * [KO] 페이드 거리 범위를 반환합니다.
     * [EN] Returns the fade distance range.
     *
     * @returns
     * [KO] 페이드 거리 범위
     * [EN] Fade distance range
     */
    get fadeDistanceRange(): number;
    /**
     * [KO] 페이드 거리 범위를 설정합니다.
     * [EN] Sets the fade distance range.
     *
     * @param value -
     * [KO] 설정할 페이드 거리 범위
     * [EN] Fade distance range to set
     */
    set fadeDistanceRange(value: number);
    /**
     * [KO] 대비를 반환합니다.
     * [EN] Returns the contrast.
     *
     * @returns
     * [KO] 대비 값
     * [EN] Contrast value
     */
    get contrast(): number;
    /**
     * [KO] 대비를 설정합니다.
     * [EN] Sets the contrast.
     *
     * @param value -
     * [KO] 설정할 대비
     * [EN] Contrast to set
     */
    set contrast(value: number);
    /**
     * [KO] SSAO 효과를 렌더링합니다.
     * [EN] Renders the SSAO effect.
     *
     * @param view
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width
     * [KO] 너비
     * [EN] Width
     * @param height
     * [KO] 높이
     * [EN] Height
     * @param sourceTextureInfo
     * [KO] 소스 텍스처 정보
     * [EN] Source texture info
     * @returns
     * [KO] 렌더링 결과
     * [EN] Rendering result
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
}
export default SSAO;
