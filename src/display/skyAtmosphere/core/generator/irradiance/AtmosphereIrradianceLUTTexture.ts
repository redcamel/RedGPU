import RedGPUContext from "../../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../../../resources/core/ManagementResourceBase";

const MANAGED_STATE_KEY = 'managedBitmapTextureState'

/**
 * [KO] SkyAtmosphere의 실시간 조도(Irradiance) 데이터를 담는 LUT 텍스처 클래스입니다.
 * [EN] LUT texture class containing real-time irradiance data for SkyAtmosphere.
 */
class AtmosphereIrradianceLUTTexture extends ManagementResourceBase {
    #gpuTexture: GPUTexture;
    #gpuTextureView: GPUTextureView;
    #width: number;
    #height: number;

    constructor(redGPUContext: RedGPUContext, width: number, height: number) {
        super(redGPUContext, MANAGED_STATE_KEY);
        this.#width = width;
        this.#height = height;
        this.#init();
    }

    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    get gpuTextureView(): GPUTextureView {
        return this.#gpuTextureView;
    }

    /** [KO] 비디오 메모리 사용량을 바이트 단위로 반환합니다. [EN] Returns video memory usage in bytes. */
    get videoMemorySize(): number {
        return this.#width * this.#height * 8;
    }

    /** [KO] 텍스처 업데이트가 완료되었음을 알립니다. [EN] Notifies that the texture update is complete. */
    notifyUpdate(): void {
        this.__fireListenerList();
    }

    #init(): void {
        const {gpuDevice} = this.redGPUContext;
        this.#gpuTexture = gpuDevice.createTexture({
            label: 'AtmosphereIrradianceLUTTexture',
            size: [this.#width, this.#height],
            format: 'rgba16float',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING
        });
        this.#gpuTextureView = this.#gpuTexture.createView({label: 'AtmosphereIrradianceLUTTextureView'});
        this.__fireListenerList();
    }
}

Object.freeze(AtmosphereIrradianceLUTTexture);
export default AtmosphereIrradianceLUTTexture;
