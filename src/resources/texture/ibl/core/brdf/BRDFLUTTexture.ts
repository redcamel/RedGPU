import RedGPUContext from "../../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../../core/ManagementResourceBase";

const MANAGED_STATE_KEY = 'managedBitmapTextureState'

/**
 * [KO] BRDF LUT(Look-Up Table) 전용 텍스처 클래스입니다.
 * [EN] Texture class dedicated to BRDF LUT (Look-Up Table).
 *
 * @category Texture
 */
class BRDFLUTTexture extends ManagementResourceBase {
    #gpuTexture: GPUTexture;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, MANAGED_STATE_KEY);
        this.#init();
    }

    async #init() {
        this.#gpuTexture = await this.redGPUContext.resourceManager.brdfGenerator.getBRDFLUTTexture();
        this.__fireListenerList();
    }

    /** [KO] GPUTexture 객체를 반환합니다. [EN] Returns the GPUTexture object. */
    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    /** [KO] 비디오 메모리 사용량(byte) [EN] Video memory usage in bytes */
    get videoMemorySize(): number {
        // 512 * 512 * 8 bytes (rgba16float)
        return 512 * 512 * 8;
    }
}

Object.freeze(BRDFLUTTexture);
export default BRDFLUTTexture;
