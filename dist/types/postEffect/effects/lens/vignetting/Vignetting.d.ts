import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
interface Vignetting {
    /** [KO] 비네팅의 크기 (0 ~ 1). 값이 작을수록 중앙의 밝은 영역이 좁아집니다. [EN] Size of the vignette (0 to 1). Lower values narrow the central bright area. */
    size: number;
    /** [KO] 경계면의 부드러움 (0 ~ 1). [EN] Smoothness of the edges (0 to 1). */
    smoothness: number;
    /** [KO] 효과의 중심점 X 오프셋 (픽셀 단위, 0은 화면 중앙). [EN] Effect center X offset (in pixels, 0 is screen center). */
    centerX: number;
    /** [KO] 효과의 중심점 Y 오프셋 (픽셀 단위, 0은 화면 중앙). [EN] Effect center Y offset (in pixels, 0 is screen center). */
    centerY: number;
}
/**
 * [KO] 비네팅(Vignetting) 후처리 이펙트입니다.
 * [EN] Vignetting post-processing effect.
 *
 * [KO] 화면의 특정 지점(0,0은 정중앙)을 기준으로 가장자리를 어둡게 처리하여 시선을 집중시키고 시네마틱한 깊이감을 부여합니다.
 * [EN] Darkens the edges relative to a specific point (0,0 is exact center) to focus attention and provide a cinematic sense of depth.
 *
 * [KO] 픽셀 단위의 정밀한 중심점 오프셋 조절을 지원합니다.
 * [EN] Supports precise per-pixel center offset adjustment.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Vignetting(redGPUContext);
 * effect.size = 0.7;
 * effect.smoothness = 0.3;
 * effect.centerX = 100; // 중심을 오른쪽으로 100픽셀 이동
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/vignetting/"></iframe>
 * @category Lens
 */
declare class Vignetting extends ASinglePassPostEffect {
    /**
     * [KO] Vignetting 인스턴스를 생성합니다.
     * [EN] Creates a Vignetting instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
}
export default Vignetting;
