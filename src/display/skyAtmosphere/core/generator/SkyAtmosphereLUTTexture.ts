import RedGPUContext from "../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../../resources/core/ManagementResourceBase";

const MANAGED_STATE_KEY = 'managedBitmapTextureState';

/**
 * [KO] SkyAtmosphere 시스템에서 사용하는 LUT(Look-Up Table) 전용 텍스처 클래스입니다.
 * [EN] LUT (Look-Up Table) texture class used in the SkyAtmosphere system.
 *
 * [KO] 2D 및 3D 차원을 모두 지원하며, 대기 산란 연산을 위한 Storage 및 Texture 바인딩을 제공합니다.
 * [EN] Supports both 2D and 3D dimensions and provides Storage and Texture bindings for atmospheric scattering calculations.
 *
 * @category Texture
 */
class SkyAtmosphereLUTTexture extends ManagementResourceBase {
    #gpuTexture: GPUTexture;
    #gpuTextureView: GPUTextureView;
    #width: number;
    #height: number;
    #depth: number;
    #format: GPUTextureFormat = 'rgba16float';

    /**
     * [KO] SkyAtmosphereLUTTexture 인스턴스를 생성합니다.
     * [EN] Creates a SkyAtmosphereLUTTexture instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
     * @param label - [KO] 리소스 식별자 [EN] Resource label
     * @param width - [KO] 가로 크기 [EN] Width
     * @param height - [KO] 세로 크기 [EN] Height
     * @param depth - [KO] 깊이 크기 (1보다 크면 3D 텍스처로 생성됨) [EN] Depth (If greater than 1, created as a 3D texture)
     */
    constructor(redGPUContext: RedGPUContext, label: string, width: number, height: number, depth: number = 1) {
        super(redGPUContext, MANAGED_STATE_KEY);
        this.#width = width;
        this.#height = height;
        this.#depth = depth;
        this.#init(label);
    }

    /** [KO] 내부 GPUTexture 객체를 반환합니다. [EN] Returns the internal GPUTexture object. */
    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    /** [KO] 내부 GPUTextureView 객체를 반환합니다. [EN] Returns the internal GPUTextureView object. */
    get gpuTextureView(): GPUTextureView {
        return this.#gpuTextureView;
    }

    /** [KO] 비디오 메모리 사용량을 바이트 단위로 반환합니다. [EN] Returns video memory usage in bytes. */
    get videoMemorySize(): number {
        return this.#width * this.#height * this.#depth * 8; // RGBA16F = 8 bytes per pixel
    }

    /** [KO] 텍스처 업데이트가 완료되었음을 알립니다. [EN] Notifies that the texture update is complete. */
    notifyUpdate(): void {
        this.__fireListenerList();
    }

    #init(label: string): void {
        const {gpuDevice} = this.redGPUContext;
        const dimension: GPUTextureDimension = this.#depth > 1 ? '3d' : '2d';

        this.#gpuTexture = gpuDevice.createTexture({
            label: label,
            size: [this.#width, this.#height, this.#depth],
            dimension: dimension,
            format: this.#format,
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING
        });
        
        this.#gpuTextureView = this.#gpuTexture.createView({
            label: `${label}View`,
            dimension: dimension
        });
        
        this.__fireListenerList();
    }
}

Object.freeze(SkyAtmosphereLUTTexture);
export default SkyAtmosphereLUTTexture;
