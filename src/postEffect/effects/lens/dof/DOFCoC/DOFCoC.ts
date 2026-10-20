import RedGPUContext from "../../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../../../defineProperty/funcs/number/definePositiveNumber";


interface DOFCoC {
    /**
     * [KO] 초점 거리
     * [EN] Focus distance
     * @defaultValue 15
     */
    focusDistance: number;
    /**
     * [KO] 조리개 값 (F-number)
     * [EN] Aperture value (F-number)
     * @defaultValue 1.4
     */
    aperture: number;
    /**
     * [KO] 최대 착란원(CoC) 크기 (0 ~ 100)
     * [EN] Maximum Circle of Confusion (CoC) size (0 ~ 100)
     * @defaultValue 32
     */
    maxCoC: number;
    /**
     * [KO] 근평면 거리 (0 이상)
     * [EN] Near plane distance (0 or greater)
     * @defaultValue 0.1
     */
    nearPlane: number;
    /**
     * [KO] 원평면 거리 (0.1 이상)
     * [EN] Far plane distance (0.1 or greater)
     * @defaultValue 1000
     */
    farPlane: number;
}

/**
 * [KO] 깊이 텍스처를 기반으로 피사계 심도(DOF)의 착란원(CoC) 크기를 계산하는 내부 후처리 패스입니다.
 * [EN] Internal post-processing pass that calculates the Circle of Confusion (CoC) size for Depth of Field (DOF) based on the depth texture.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @see [DOF example](/RedGPU/examples/postEffect/lens/dof/)
 * @category Lens
 */
class DOFCoC extends ASinglePassPostEffect {

    /**
     * [KO] DOFCoC 인스턴스를 생성합니다.
     * [EN] Creates a DOFCoC instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
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

definePositiveNumber(DOFCoC, [
    {key: 'focusDistance', value: 15},
    {key: 'aperture', value: 1.4},
    {key: 'maxCoC', value: 32, min: 0, max: 100},
    {key: 'nearPlane', value: 0.1, min: 0,},
    {key: 'farPlane', value: 1000, min: 0.1,}
])
Object.freeze(DOFCoC);
export default DOFCoC;
