import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import {DefineUniformProperty} from "../../../../defineProperty";

interface OldBloomBlend {
    bloomStrength: number
    exposure: number
}

/**
 * [KO] 올드 블룸 블렌딩 이펙트입니다. (내부용)
 * [EN] Old Bloom blending effect. (Internal use)
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
            createBasicPostEffectCode(this, computeCode, uniformStructCode, ['sourceTexture0', 'sourceTexture1'])
        );

    }

    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult, sourceTextureInfo1: IPostEffectResult) {
        return super.render(view, width, height, sourceTextureInfo, sourceTextureInfo1);
    }
}

DefineUniformProperty.definePositiveNumber(OldBloomBlend, [
    {key: 'bloomStrength', value: 1},
    {key: 'exposure', value: 1},
])
Object.freeze(OldBloomBlend);
export default OldBloomBlend;
