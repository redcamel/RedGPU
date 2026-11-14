import RedGPUContext from "../../../../context/RedGPUContext";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import defineUint from "../../../../defineProperty/funcs/number/defineUint";
import View3D from "../../../../display/view/View3D";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
import createBasicComputePassPostEffectCode from "../../../core/createBasicComputePassPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

interface DirectionalBlur {
    /**
     * [KO] 블러 강도 (0 이상)
     * [EN] Blur strength (0 or greater)
     * @defaultValue 15
     */
    amount: number;
    /**
     * [KO] 샘플링 횟수 (1 ~ 100)
     * [EN] Number of samples (1 ~ 100)
     * @defaultValue 16
     */
    sampleCount: number;
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
class DirectionalBlur extends ASingleComputePassPostEffect {

    #angle: number = 0;

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
            createBasicComputePassPostEffectCode(this, computeCode, uniformStructCode)
        );
        this.#updateDirection();
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
        validateNumber(value);
        this.#angle = value % 360;
        this.#updateDirection();
    }

    /**
     * [KO] 방향성 블러(Directional Blur) 효과를 렌더링합니다.
     * [EN] Renders the directional blur effect.
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
     * [KO] 입력 소스 텍스처 정보
     * [EN] Input source texture information
     * @returns
     * [KO] 방향성 블러가 적용된 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] Result texture information with directional blur applied (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        if (this.amount <= 0) return sourceTextureInfo;
        return super.render(view, width, height, sourceTextureInfo);
    }

    #updateDirection() {
        const radians = this.#angle * Math.PI / 180;
        const directionX = Math.cos(radians);
        const directionY = Math.sin(radians);
        this.updateUniform('directionX', directionX);
        this.updateUniform('directionY', directionY);
    }
}

definePositiveNumber(DirectionalBlur, [
    {key: 'amount', value: 15}
]);
defineUint(DirectionalBlur, [
    {key: 'sampleCount', value: 16, min: 1, max: 100}
]);
Object.freeze(DirectionalBlur);
export default DirectionalBlur;
