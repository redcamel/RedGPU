import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";


interface OldBloomBlend {
    /**
     * [KO] 블룸 효과 강도 (0 이상)
     * [EN] Strength of the bloom effect (0 or greater)
     * @defaultValue 1
     */
    bloomStrength: number
    /**
     * [KO] 최종 합성 시 노출 보정값 (0 이상)
     * [EN] Exposure compensation value for final composition (0 or greater)
     * @defaultValue 1
     */
    exposure: number
}

/**
 * [KO] 블러 처리된 블룸 텍스처를 원본 이미지와 가산 합성하는 내부 후처리 패스입니다.
 * [EN] Internal post-processing pass that additively blends the blurred bloom texture with the original image.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @see [OldBloom example](/RedGPU/examples/postEffect/oldBloom/)
 * @category Visual Effects
 */
class OldBloomBlend extends ASinglePassPostEffect {
    /**
     * [KO] OldBloomBlend 인스턴스를 생성합니다.
     * [EN] Creates an OldBloomBlend instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);

        this.init(
            redGPUContext,
            'POST_EFFECT_OLD_BLOOM_BLEND',
            createBasicPostEffectCode(
                this,
                computeCode,
                uniformStructCode,
                [
                    {name: 'sourceTexture0'},
                    {name: 'sourceTexture1'}
                ]
            )
        );

    }

    /**
     * [KO] 원본 텍스처와 블러 처리된 블룸 텍스처를 합성하여 렌더링합니다.
     * [EN] Renders by blending the original texture and the blurred bloom texture.
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
     * [KO] 원본 소스 텍스처 정보
     * [EN] Original source texture information
     * @param sourceTextureInfo1 -
     * [KO] 블러 처리된 블룸 소스 텍스처 정보
     * [EN] Blurred bloom source texture information
     * @returns
     * [KO] 합성된 후처리 결과 (`IPostEffectResult`)
     * [EN] Blended post-effect result (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult, sourceTextureInfo1: IPostEffectResult) {
        return super.render(view, width, height, sourceTextureInfo, sourceTextureInfo1);
    }
}

definePositiveNumber(OldBloomBlend, [
    {key: 'bloomStrength', value: 1},
    {key: 'exposure', value: 1},
])
Object.freeze(OldBloomBlend);
export default OldBloomBlend;
