import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";

interface BloomUpsample {
    /**
     * [KO] 다단계 밉 간 빛 확산 반경 비율 (0.0 ~ 1.0)
     * [EN] Light scatter radius ratio between mip levels (0.0 ~ 1.0)
     * @defaultValue 0.65
     */
    radius: number;
}

/**
 * [KO] 9-Tap Tent 필터를 사용하여 하위 밉(`lowMipTexture`)을 부드럽게 업샘플링하고 상위 밉(`highMipTexture`)과 합성하는 내부 패스입니다.
 * [EN] Internal pass that smoothly upsamples the lower mip (`lowMipTexture`) using a 9-Tap Tent filter and blends it with the higher mip (`highMipTexture`).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Visual Effects
 */
class BloomUpsample extends ASinglePassPostEffect {
    /**
     * [KO] BloomUpsample 인스턴스를 생성합니다.
     * [EN] Creates a BloomUpsample instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_BLOOM_UPSAMPLE',
            createBasicPostEffectCode(
                this,
                computeCode,
                uniformStructCode,
                [
                    {name: 'highMipTexture'},
                    {name: 'lowMipTexture'}
                ]
            )
        );
    }

    /**
     * [KO] 상위 밉 텍스처와 업샘플된 하위 밉 텍스처를 합성하여 렌더링합니다.
     * [EN] Renders by blending the higher mip texture and the upsampled lower mip texture.
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
     * @param highMipInfo -
     * [KO] 상위 해상도 밉 텍스처 정보
     * [EN] Higher-resolution mip texture information
     * @param lowMipInfo -
     * [KO] 하위 해상도 밉 텍스처 정보
     * [EN] Lower-resolution mip texture information
     * @returns
     * [KO] 업샘플 합성된 블룸 밉 결과 (`IPostEffectResult`)
     * [EN] Upsampled and blended bloom mip result (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, highMipInfo: IPostEffectResult, lowMipInfo: IPostEffectResult): IPostEffectResult {
        return super.render(view, width, height, highMipInfo, lowMipInfo);
    }
}

definePositiveNumber(BloomUpsample, [
    {key: 'radius', value: 0.65, min: 0.0, max: 1.0},
]);
Object.freeze(BloomUpsample);
export default BloomUpsample;
