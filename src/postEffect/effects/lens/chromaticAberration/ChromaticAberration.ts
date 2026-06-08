import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";


interface ChromaticAberration {
    /** [KO] 색수차 강도. 값이 클수록 RGB 채널이 더 멀리 분리됩니다. [EN] Chromatic aberration strength. Higher values separate RGB channels further. */
    strength: number
    /** [KO] 효과의 중심점 X 오프셋 (픽셀 단위, 0은 화면 중앙). [EN] Effect center X offset (in pixels, 0 is screen center). */
    centerX: number
    /** [KO] 효과의 중심점 Y 오프셋 (픽셀 단위, 0은 화면 중앙). [EN] Effect center Y offset (in pixels, 0 is screen center). */
    centerY: number
    /** [KO] 중심으로부터의 효과 감쇠율. 값이 클수록 외곽에서 더 강하게 나타납니다. [EN] Effect falloff from center. Higher values make the effect stronger at the edges. */
    falloff: number
}

/**
 * [KO] 색수차(Chromatic Aberration) 후처리 이펙트입니다.
 * [EN] Chromatic Aberration post-processing effect.
 *
 * [KO] 실제 카메라 렌즈에서 빛의 파장에 따라 굴절률이 달라져 발생하는 색상 어긋남 현상을 시뮬레이션합니다. 화면의 특정 지점(기본 중앙)을 기준으로 외곽으로 갈수록 RGB 채널이 분리됩니다. (0,0)은 화면의 정중앙을 의미합니다.
 * [EN] Simulates the color fringing effect in real camera lenses where different light wavelengths refract at different angles. RGB channels separate towards the edges relative to a specific point (default center). (0,0) refers to the exact center of the screen.
 *
 * [KO] 하드웨어 선형 샘플러를 사용하여 채널 분리 경계면을 매우 부드럽게 표현합니다.
 * [EN] Uses a hardware linear sampler to represent the boundaries of channel separation very smoothly.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ChromaticAberration(redGPUContext);
 * effect.strength = 0.02;
 * effect.centerX = 100; // 중심을 오른쪽으로 100픽셀 이동
 * effect.falloff = 1.5;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/chromaticAberration/"></iframe>
 * @category Lens
 */
class ChromaticAberration extends ASinglePassPostEffect {

    /**
     * [KO] ChromaticAberration 인스턴스를 생성합니다.
     * [EN] Creates a ChromaticAberration instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.isLdr = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_CHROMATIC_ABERRATION',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
    }

}

defineNumber(ChromaticAberration, [
    {key: 'strength', value: 0.015, min: 0},
    {key: 'centerX', value: 0},
    {key: 'centerY', value: 0},
    {key: 'falloff', value: 0.5, min: 0, max: 5},
])

Object.freeze(ChromaticAberration)
export default ChromaticAberration
