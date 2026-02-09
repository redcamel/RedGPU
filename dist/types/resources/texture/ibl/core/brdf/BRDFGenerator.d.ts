import RedGPUContext from "../../../../../context/RedGPUContext";
/**
 * [KO] BRDF LUT(Look-Up Table)를 생성하는 클래스입니다.
 * [EN] Class that generates BRDF LUT (Look-Up Table).
 *
 * [KO] Split Sum Approximation 기법을 위해 2D BRDF 통합 텍스처를 사전 베이킹합니다.
 * [EN] Pre-bakes a 2D BRDF integration texture for the Split Sum Approximation technique.
 *
 * @category IBL
 */
declare class BRDFGenerator {
    #private;
    /**
     * [KO] BRDFGenerator 인스턴스를 생성합니다.
     * [EN] Creates a BRDFGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] BRDF LUT 텍스처를 반환합니다.
     * [EN] Returns the BRDF LUT texture.
     *
     * ### Example
     * ```typescript
     * const brdfLUT = redGPUContext.resourceManager.brdfGenerator.brdfLUTTexture;
     * ```
     */
    get brdfLUTTexture(): GPUTexture;
}
export default BRDFGenerator;
