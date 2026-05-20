import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import DefineUniformProperty from "../../defineProperty/DefineUniformProperty";
interface FXAA{
    subpix: number
    edgeThreshold: number
    edgeThresholdMin: number
}
/**
 * [KO] FXAA(Fast Approximate Anti-Aliasing) 후처리 이펙트입니다.
 * [EN] FXAA (Fast Approximate Anti-Aliasing) post-processing effect.
 *
 * [KO] 화면의 픽셀 정보를 분석하여 엣지 부분을 부드럽게 처리하는 저비용 안티앨리어싱 기법입니다.
 * [EN] A low-cost anti-aliasing technique that smoothens edges by analyzing screen pixel information.
 *
 * ::: warning
 * [KO] 이 클래스는 AntialiasingManager에 의해 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is managed by AntialiasingManager.<br/>Do not create an instance directly.
 * :::
 *
 * * ### Example
 * ```typescript
 * // AntialiasingManager를 통해 FXAA 설정 (Configure FXAA via AntialiasingManager)
 * redGPUContext.antialiasingManager.useFXAA = true;
 * ```
 *
 * @category PostEffect
 */
class FXAA extends ASinglePassPostEffect {
     /**
     * [KO] FXAA 인스턴스를 생성합니다.
     * [EN] Creates an FXAA instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);

        this.init(
            redGPUContext,
            'POST_EFFECT_FXAA',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

DefineUniformProperty.definePositiveNumber(FXAA, [
    {key: 'edgeThresholdMin', value: 0.0625, min: 0.00001, max: 0.1},
    {key: 'edgeThreshold', value: 0.125, min: 0.0001, max: 0.25},
    {key: 'subpix', value: 0.75, min: 0.0, max: 1},
])
Object.freeze(FXAA);
export default FXAA;
