import ColorRGB from "../../../../color/ColorRGB";
import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import defineColorRGB from "../../../../defineProperty/funcs/color/defineColorRGB";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

interface BloomComposite {
    /**
     * [KO] 최종 블룸 합성 강도 (0.0 ~ 10.0)
     * [EN] Final bloom composition intensity (0.0 ~ 10.0)
     * @defaultValue 0.6
     */
    intensity: number;
    /**
     * [KO] 블룸 색조 필터 객체 (`ColorRGB`)
     * [EN] Bloom tint color filter object (`ColorRGB`)
     * @defaultValue '#ffffff'
     */
    tint: ColorRGB;
}

/**
 * [KO] 업샘플링이 완료된 `1/2` 해상도 블룸 텍스처를 9-Tap Tent 필터로 풀해상도 업샘플링하여 원본 HDR 씬에 가산 합성하는 내부 패스입니다.
 * [EN] Internal pass that upsamples the final `1/2` resolution bloom texture to full resolution using a 9-Tap Tent filter and additively blends it onto the original HDR scene.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Visual Effects
 */
class BloomComposite extends ASinglePassPostEffect {
    /**
     * [KO] BloomComposite 인스턴스를 생성합니다.
     * [EN] Creates a BloomComposite instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_BLOOM_COMPOSITE',
            createBasicPostEffectCode(
                this,
                computeCode,
                uniformStructCode,
                [
                    {name: 'sourceTexture'},
                    {name: 'bloomTexture'}
                ]
            )
        );
    }

    /**
     * [KO] 원본 HDR 텍스처와 최종 블룸 텍스처를 합성하여 렌더링합니다.
     * [EN] Renders by compositing the original HDR texture and the final bloom texture.
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
     * [KO] 원본 HDR 씬 소스 텍스처 정보
     * [EN] Original HDR scene source texture information
     * @param bloomTextureInfo -
     * [KO] 업샘플 완료된 블룸 소스 텍스처 정보
     * [EN] Upsampled bloom source texture information
     * @returns
     * [KO] 블룸 합성된 최종 HDR 결과 (`IPostEffectResult`)
     * [EN] Final HDR result with bloom composited (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult, bloomTextureInfo: IPostEffectResult): IPostEffectResult {
        return super.render(view, width, height, sourceTextureInfo, bloomTextureInfo);
    }
}

definePositiveNumber(BloomComposite, [
    {key: 'intensity', value: 0.6, min: 0.0, max: 10.0},
]);
defineColorRGB(BloomComposite, [
    {key: 'tint', value: '#ffffff'},
]);
Object.freeze(BloomComposite);
export default BloomComposite;
