import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import defineUint from "../../../../defineProperty/funcs/number/defineUint";


interface DirectionalBlur {
    /**
     * [KO] 블러 강도 (0 이상)
     * [EN] Blur strength (0 or greater)
     * @defaultValue 15
     */
    amount: number,
    /**
     * [KO] 샘플링 횟수 (1 ~ 100)
     * [EN] Number of samples (1 ~ 100)
     * @defaultValue 16
     */
    sampleCount: number
}

/**
 * [KO] 지정한 각도와 강도로 방향성 블러를 적용하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that applies directional blur with a specified angle and strength.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.DirectionalBlur(redGPUContext);
 * effect.angle = 45;
 * effect.amount = 30;
 * effect.sampleCount = 40;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/directionalBlur/" style="width:100%; height:500px;"></iframe>
 *
 * @see [DirectionalBlur example](/RedGPU/examples/postEffect/blur/directionalBlur/)
 * @category Blur
 */
class DirectionalBlur extends ASinglePassPostEffect {

    #angle: number = 0

    /**
     * [KO] DirectionalBlur 인스턴스를 생성합니다.
     * [EN] Creates a DirectionalBlur instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.DirectionalBlur(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {workSizeX: 8, workSizeY: 8, workSizeZ: 1, isLdr: true});
        this.init(
            redGPUContext,
            'POST_EFFECT_DIRECTIONAL_BLUR',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

    /**
     * [KO] 블러 각도(단위: 도, 0 = 오른쪽, 360도로 정규화)를 반환하거나 설정합니다.
     * [EN] Returns or sets the blur angle (unit: degrees, 0 = right, normalized to 360 degrees).
     *
     * @defaultValue 0
     * @returns
     * [KO] 블러 각도
     * [EN] Blur angle
     */
    get angle(): number {
        return this.#angle;
    }

    set angle(value: number) {
        validateNumber(value)
        this.#angle = value % 360;
        this.#updateDirection();
    }


    #updateDirection() {
        const radians = this.#angle * Math.PI / 180;
        const directionX = Math.cos(radians);
        const directionY = Math.sin(radians);
        this.updateUniform('directionX', directionX)
        this.updateUniform('directionY', directionY)
    }
}

definePositiveNumber(DirectionalBlur, [
    {key: 'amount', value: 15}
])
defineUint(DirectionalBlur, [
    {key: 'sampleCount', value: 16, min: 1, max: 100}
])
Object.freeze(DirectionalBlur)
export default DirectionalBlur
