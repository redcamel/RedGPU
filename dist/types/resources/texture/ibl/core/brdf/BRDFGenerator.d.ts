import RedGPUContext from "../../../../../context/RedGPUContext";
import RedGPUObject from "../../../../../base/RedGPUObject";
/**
 * [KO] Split Sum Approximation용 2D BRDF LUT(Look-Up Table) 텍스처를 생성하는 클래스입니다.
 * [EN] Class that generates a 2D BRDF LUT (Look-Up Table) texture for the Split Sum Approximation.
 *
 * [KO] LUT는 최초 접근 시 128x128 `rg16float` 포맷으로 한 번만 렌더링되며, 시스템에 의해 자동으로 생성됩니다.
 * [EN] The LUT is rendered only once in `rg16float` format at 128x128 on first access, and is created automatically by the system.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const brdfGenerator = redGPUContext.resourceManager.brdfGenerator;
 * ```
 *
 * @see [BRDF LUT test example](/RedGPU/examples/3d/skybox/ibl/brdfLutTest/)
 * @category IBL
 */
declare class BRDFGenerator extends RedGPUObject {
    #private;
    /**
     * [KO] BRDFGenerator 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates a BRDFGenerator instance. (Internal system only)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] BRDF LUT `GPUTexture`를 반환합니다. 아직 생성되지 않았다면 즉시 생성합니다.
     * [EN] Returns the BRDF LUT `GPUTexture`, generating it immediately if it does not exist yet.
     *
     * ### Example
     * ```typescript
     * const brdfLUT = redGPUContext.resourceManager.brdfGenerator.brdfLUTTexture;
     * ```
     *
     * @returns
     * [KO] BRDF LUT 텍스처
     * [EN] BRDF LUT texture
     */
    get brdfLUTTexture(): GPUTexture;
    /**
     * [KO] 생성된 BRDF LUT 텍스처를 파괴하고 셰이더 모듈 및 파이프라인 참조를 해제합니다.
     * [EN] Destroys the generated BRDF LUT texture and releases the shader module and pipeline references.
     */
    destroy(): void;
}
export default BRDFGenerator;
