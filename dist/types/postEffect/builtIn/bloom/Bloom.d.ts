import ColorRGB from "../../../color/ColorRGB";
import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import { IPostEffectResult } from "../../core/types";
/**
 * [KO] 5단계 밉체인 피라미드(13-Tap Dual-Grid 다운샘플 + 9-Tap Tent 업샘플), Soft-Knee HDR 임계값 및 Karis 가중 평균을 기반으로 물리적인 빛 산란을 구현하는 차세대 HDR 블룸(Bloom) 후처리 이펙트입니다.
 * [EN] Next-generation HDR Bloom post-processing effect that implements physical light scattering based on a 5-stage mip-chain pyramid (13-Tap Dual-Grid downsample + 9-Tap Tent upsample), Soft-Knee HDR threshold, and Karis weighted average.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * view.builtInEffectManager.useBloom = true;
 * const bloom = view.builtInEffectManager.bloom;
 * bloom.setCinematic();
 * bloom.intensity = 0.8;
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/builtIn/lens/bloom/"></iframe>
 *
 * @see [Bloom example](/RedGPU/examples/postEffect/builtIn/lens/bloom/)
 * @category PostEffect
 */
declare class Bloom extends AMultiPassPostEffect {
    #private;
    /**
     * [KO] Bloom 인스턴스를 생성합니다.
     * [EN] Creates a Bloom instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 블룸이 시작되는 선형 HDR 휘도 임계값(0.0 ~ 20.0)을 반환하거나 설정합니다.
     * [EN] Returns or sets the linear HDR luminance threshold (0.0 ~ 20.0) where bloom begins.
     *
     * @defaultValue 1.0
     * @returns
     * [KO] 선형 HDR 휘도 임계값
     * [EN] Linear HDR luminance threshold
     */
    get threshold(): number;
    set threshold(value: number);
    /**
     * [KO] 임계값 전이 구간의 부드러운 2차 곡선(Soft-Knee) 비율(0.0 ~ 1.0)을 반환하거나 설정합니다.
     * [EN] Returns or sets the Soft-Knee quadratic curve ratio (0.0 ~ 1.0) in the threshold transition zone.
     *
     * @defaultValue 0.5
     * @returns
     * [KO] Soft-Knee 비율
     * [EN] Soft-Knee ratio
     */
    get softKnee(): number;
    set softKnee(value: number);
    /**
     * [KO] 최종 블룸 합성 강도(0.0 ~ 10.0)를 반환하거나 설정합니다.
     * [EN] Returns or sets the final bloom composition intensity (0.0 ~ 10.0).
     *
     * @defaultValue 0.675
     * @returns
     * [KO] 블룸 합성 강도
     * [EN] Bloom composition intensity
     */
    get intensity(): number;
    set intensity(value: number);
    /**
     * [KO] 다단계 밉 간 빛 확산 반경 비율(0.0 ~ 1.0)을 반환하거나 설정합니다.
     * [EN] Returns or sets the light scatter radius ratio (0.0 ~ 1.0) between mip levels.
     *
     * @defaultValue 0.65
     * @returns
     * [KO] 빛 확산 반경 비율
     * [EN] Light scatter radius ratio
     */
    get radius(): number;
    set radius(value: number);
    /**
     * [KO] 스페큘러 파이어플라이 폭주 방지를 위한 최대 HDR 휘도 클램프(1.0 ~ 200.0)를 반환하거나 설정합니다.
     * [EN] Returns or sets the maximum HDR luminance clamp (1.0 ~ 200.0) to prevent specular firefly spikes.
     *
     * @defaultValue 32.0
     * @returns
     * [KO] 최대 HDR 휘도 클램프
     * [EN] Maximum HDR luminance clamp
     */
    get maxBrightness(): number;
    set maxBrightness(value: number);
    /**
     * [KO] 블룸 색조 필터 객체(`ColorRGB`)를 반환합니다.
     * [EN] Returns the bloom tint color filter object (`ColorRGB`).
     *
     * @returns
     * [KO] 블룸 색조 `ColorRGB` 인스턴스
     * [EN] Bloom tint `ColorRGB` instance
     */
    get tint(): ColorRGB;
    /**
     * [KO] 야외 대기 및 일반 PBR 씬에 가장 자연스러운 기본 물리 카메라 블룸 프리셋(`intensity = 0.675`)을 적용합니다.
     * [EN] Applies the default natural physical camera bloom preset (`intensity = 0.675`) suitable for outdoor atmosphere and standard PBR scenes.
     */
    setNatural(): void;
    /**
     * [KO] 넓고 부드러운 하이라이트 확산을 제공하는 시네마틱(Cinematic) 블룸 프리셋을 적용합니다.
     * [EN] Applies a cinematic bloom preset providing wide and smooth highlight diffusion.
     */
    setCinematic(): void;
    /**
     * [KO] 에미시브 네온사인, 마법 이펙트 및 SF 씬을 위한 강렬한 네온 글로우 프리셋을 적용합니다.
     * [EN] Applies an intense neon glow preset for emissive neon signs, magic effects, and sci-fi scenes.
     */
    setNeonGlow(): void;
    /**
     * [KO] 몽환적이고 부드러운 소프트 포커스 스타일의 드리미(Dreamy) 블룸 프리셋을 적용합니다.
     * [EN] Applies a dreamy bloom preset with an ethereal and soft-focus style.
     */
    setDreamy(): void;
    /**
     * [KO] 제품 컨피규레이터 및 건축 시각화를 위한 절제된 스페큘러 글로우(Subtle) 프리셋을 적용합니다.
     * [EN] Applies a subtle specular glow preset for product configurators and architectural visualization.
     */
    setSubtle(): void;
    /**
     * [KO] 5단계 밉체인 다운샘플링, 9-Tap Tent 업샘플링 및 최종 HDR 합성을 순차 실행합니다.
     * [EN] Sequentially executes 5-stage mip-chain downsampling, 9-Tap Tent upsampling, and final HDR composition.
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
     * [KO] 입력 원본 HDR 소스 텍스처 정보
     * [EN] Input original HDR source texture information
     * @returns
     * [KO] 블룸 합성된 최종 HDR 텍스처 정보 (`IPostEffectResult`)
     * [EN] Final HDR texture information with bloom composited (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
}
export default Bloom;
