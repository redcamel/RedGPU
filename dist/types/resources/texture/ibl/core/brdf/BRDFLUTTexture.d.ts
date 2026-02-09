import RedGPUContext from "../../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../../core/ManagementResourceBase";
/**
 * [KO] BRDF LUT(Look-Up Table) 전용 텍스처 클래스입니다.
 * [EN] Texture class dedicated to BRDF LUT (Look-Up Table).
 *
 * @category Texture
 */
declare class BRDFLUTTexture extends ManagementResourceBase {
    #private;
    /**
     * [KO] BRDFLUTTexture 인스턴스를 생성합니다.
     * [EN] Creates a BRDFLUTTexture instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] GPUTexture 객체를 반환합니다.
     * [EN] Returns the GPUTexture object.
     */
    get gpuTexture(): GPUTexture;
    /**
     * [KO] 비디오 메모리 사용량(byte)
     * [EN] Video memory usage in bytes
     */
    get videoMemorySize(): number;
}
export default BRDFLUTTexture;
