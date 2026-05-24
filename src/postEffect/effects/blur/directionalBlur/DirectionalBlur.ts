import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import {DefineGPUProperty} from "../../../../defineProperty";

/**
 * [KO] 방향성 블러(Directional Blur) 후처리 이펙트입니다.
 * [EN] Directional Blur post-processing effect.
 *
 * [KO] 각도와 강도를 지정해 원하는 방향으로 블러를 적용할 수 있습니다.
 * [EN] Can apply blur in a desired direction by specifying angle and strength.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.DirectionalBlur(redGPUContext);
 * effect.angle = 45;   // 45도 방향 블러
 * effect.amount = 30;  // 블러 강도
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/directionalBlur/"></iframe>
 * @category Blur
 */
class DirectionalBlur extends ASinglePassPostEffect {

    /**
     * [KO] 블러 각도 (0 = 오른쪽)
     * [EN] Blur angle (0 = Right)
     * @defaultValue 0
     */
    #angle: number = 0

    /**
     * [KO] DirectionalBlur 인스턴스를 생성합니다.
     * [EN] Creates a DirectionalBlur instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_DIRECTIONAL_BLUR',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

    /**
     * [KO] 블러 각도를 반환합니다.
     * [EN] Returns the blur angle.
     */
    get angle(): number {
        return this.#angle;
    }

    /**
     * [KO] 블러 각도를 설정합니다. (0 = 오른쪽, 360도로 정규화됨)
     * [EN] Sets the blur angle. (0 = Right, Normalized to 360 degrees)
     *
     * @param value
     * [KO] 각도
     * [EN] Angle
     */
    set angle(value: number) {
        validateNumber(value)
        this.#angle = value % 360; // 360도로 정규화
        this.#updateDirection();
    }


    // 내부 메서드: 각도를 방향 벡터로 변환
    #updateDirection() {
        const radians = this.#angle * Math.PI / 180;
        const directionX = Math.cos(radians);
        const directionY = Math.sin(radians);
        this.updateUniform('directionX', directionX)
        this.updateUniform('directionY', directionY)
    }
}

DefineGPUProperty.definePositiveNumber(DirectionalBlur, [
    {key: 'amount', value: 15}
])
Object.freeze(DirectionalBlur)
export default DirectionalBlur
