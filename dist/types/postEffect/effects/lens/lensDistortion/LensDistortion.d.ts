import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
interface LensDistortion {
    /** [KO] 왜곡 강도. 양수일 때 배럴 왜곡(볼록), 음수일 때 핀쿠션 왜곡(오목)이 발생합니다. [EN] Distortion strength. Positive for barrel distortion (convex), negative for pincushion distortion (concave). */
    distortion: number;
    /** [KO] 왜곡의 중심점 X 오프셋 (픽셀 단위, 0은 화면 중앙). [EN] Distortion center X offset (in pixels, 0 is screen center). */
    centerX: number;
    /** [KO] 왜곡의 중심점 Y 오프셋 (픽셀 단위, 0은 화면 중앙). [EN] Distortion center Y offset (in pixels, 0 is screen center). */
    centerY: number;
}
/**
 * [KO] 렌즈 왜곡(Lens Distortion) 후처리 이펙트입니다.
 * [EN] Lens Distortion post-processing effect.
 *
 * [KO] 광각 렌즈나 어안 렌즈에서 발생하는 기하학적 왜곡을 시뮬레이션합니다. 화면의 특정 지점(0,0은 정중앙)을 기준으로 이미지를 볼록하게 하거나 오목하게 변형시킵니다.
 * [EN] Simulates geometric distortion found in wide-angle or fisheye lenses. It warps the image to be convex or concave relative to a specific point (0,0 is exact center).
 *
 * [KO] 하드웨어 선형 샘플러를 사용하여 왜곡된 이미지의 계단 현상을 제거하고 매끄러운 화질을 유지합니다.
 * [EN] Uses a hardware linear sampler to eliminate aliasing in the warped image and maintain smooth image quality.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.LensDistortion(redGPUContext);
 * effect.distortion = 0.2;  // 배럴 왜곡 적용
 * effect.centerX = 100;     // 중심을 오른쪽으로 100픽셀 이동
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/lensDistortion/"></iframe>
 * @category Lens
 */
declare class LensDistortion extends ASinglePassPostEffect {
    /**
     * [KO] LensDistortion 인스턴스를 생성합니다.
     * [EN] Creates a LensDistortion instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
}
export default LensDistortion;
