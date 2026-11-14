import RedGPUContext from "../../../../context/RedGPUContext";
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";
import View3D from "../../../../display/view/View3D";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
import createBasicComputePassPostEffectCode from "../../../core/createBasicComputePassPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

interface BrightnessContrast {
    /**
     * [KO] 밝기 조절 값 (-150 ~ 150)
     * [EN] Brightness adjustment value (-150 ~ 150)
     * @defaultValue 0
     */
    brightness: number;
    /**
     * [KO] 대비 조절 값 (-50 ~ 100)
     * [EN] Contrast adjustment value (-50 ~ 100)
     * @defaultValue 0
     */
    contrast: number;
}

/**
 * [KO] 이미지의 명도(Brightness)와 대비(Contrast)를 조절하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that adjusts the brightness and contrast of an image.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.BrightnessContrast(redGPUContext);
 * effect.brightness = 50;
 * effect.contrast = 20;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/brightnessContrast/" style="width:100%; height:500px;"></iframe>
 *
 * @see [BrightnessContrast example](/RedGPU/examples/postEffect/adjustments/brightnessContrast/)
 * @category Adjustments
 */
class BrightnessContrast extends ASingleComputePassPostEffect {
    /**
     * [KO] BrightnessContrast 인스턴스를 생성합니다.
     * [EN] Creates a BrightnessContrast instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.BrightnessContrast(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {isLdr: true});
        this.init(
            redGPUContext,
            'POST_EFFECT_BRIGHTNESS_CONTRAST',
            createBasicComputePassPostEffectCode(this, computeCode, uniformStructCode, undefined, true, false)
        );
    }

    /**
     * [KO] 밝기 및 대비 조절 효과를 렌더링합니다.
     * [EN] Renders the brightness and contrast adjustment effect.
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
     * [KO] 밝기 및 대비가 적용된 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] Result texture information with brightness and contrast applied (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        if (this.brightness === 0 && this.contrast === 0) return sourceTextureInfo;
        return super.render(view, width, height, sourceTextureInfo);
    }
}

defineNumber(BrightnessContrast,
    [
        {key: 'brightness', value: 0, min: -150, max: 150},
        {key: 'contrast', value: 0, min: -50, max: 100}
    ]
);

Object.freeze(BrightnessContrast);
export default BrightnessContrast;
