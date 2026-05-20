import RedGPUContext from "../../../../../context/RedGPUContext";
import validateNumberRange from "../../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import {DefineUniformProperty} from "../../../../../defineProperty";

/**
 * [KO] DOFCoC의 속성 인터페이스입니다.
 * [EN] Property interface for DOFCoC.
 */
interface DOFCoC {
    /**
     * [KO] 초점 거리입니다. (값이 클수록 먼 곳에 초점이 맞습니다)
     * [EN] Focus distance. (Higher values focus on more distant objects)
     */
    focusDistance: number;
    /**
     * [KO] 조리개 값입니다. (값이 작을수록 심도가 얕아져 블러가 강해집니다)
     * [EN] Aperture value. (Lower values result in shallower depth of field and stronger blur)
     */
    aperture: number;
    /**
     * [KO] 최대 착란원(CoC) 크기입니다. (최대 블러 반경)
     * [EN] Maximum Circle of Confusion (CoC) size. (Maximum blur radius)
     */
    maxCoC: number;
    /**
     * [KO] 니어 평면 거리입니다.
     * [EN] Near plane distance.
     */
    nearPlane: number;
    /**
     * [KO] 파 평면 거리입니다.
     * [EN] Far plane distance.
     */
    farPlane: number;
}

/**
 * [KO] 피사체 심도(Depth of Field, DOF)의 착란원(Circle of Confusion, CoC) 값을 계산하는 후처리 이펙트입니다.
 * [EN] A post-processing effect that calculates the Circle of Confusion (CoC) value for Depth of Field (DOF).
 *
 * [KO] 깊이 텍스처를 기반으로 각 픽셀의 초점 상태에 따른 블러 정도를 계산하여 출력합니다.
 * [EN] Calculates and outputs the blur amount for each pixel based on its focus state using the depth texture.
 *
 * @category Lens
 */
class DOFCoC extends ASinglePassPostEffect {

    /**
     * [KO] DOFCoC 인스턴스를 생성합니다.
     * [EN] Creates a DOFCoC instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_DOF_COC',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

DefineUniformProperty.definePositiveNumber(DOFCoC, [
    {key: 'focusDistance', value: 15},
    {key: 'aperture', value: 1.4},
    {key: 'maxCoC', value: 32, min: 0, max: 100},
    {key: 'nearPlane', value: 0.1, min: 0,},
    {key: 'farPlane', value: 1000, min: 0.1,}
])
Object.freeze(DOFCoC);
export default DOFCoC;
