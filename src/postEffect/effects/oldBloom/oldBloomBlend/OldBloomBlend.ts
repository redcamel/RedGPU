import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";


interface OldBloomBlend {
    bloomStrength: number
    exposure: number
}

/**
 * [KO] 올드 블룸 블렌딩 이펙트입니다.
 * [EN] Old Bloom blending effect.
 *
 * [KO] 추출되어 블러 처리된 블룸 텍스처를 원본 이미지와 합성하는 마지막 단계를 담당합니다.
 * [EN] Responsible for the final step of blending the extracted and blurred bloom texture with the original image.
 *
 * [KO] YCoCg 색공간을 사용하여 밝기 정보를 보존하며 가산 혼합을 수행합니다.
 * [EN] Performs additive blending while preserving luminance information using the YCoCg color space.
 *
 * @category Visual Effects
 */
class OldBloomBlend extends ASinglePassPostEffect {


    /**
     * [KO] OldBloomBlend 인스턴스를 생성합니다.
     * [EN] Creates an OldBloomBlend instance.
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
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
     * [KO] 블룸 블렌딩 효과를 렌더링합니다.
     * [EN] Renders the bloom blending effect.
     *
     * @param view - [KO] View3D 인스턴스 [EN] View3D instance
     * @param width - [KO] 너비 [EN] Width
     * @param height - [KO] 높이 [EN] Height
     * @param sourceTextureInfo - [KO] 원본 소스 텍스처 [EN] Original source texture
     * @param sourceTextureInfo1 - [KO] 블러 처리된 블룸 소스 텍스처 [EN] Blurred bloom source texture
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
