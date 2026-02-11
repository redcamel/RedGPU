import RedGPUContext from "../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../../resources/core/ManagementResourceBase";

const MANAGED_STATE_KEY = 'managedBitmapTextureState'

/**
 * [KO] 대기 투과율(Transmittance) LUT 전용 텍스처 클래스입니다.
 * [EN] Texture class dedicated to Atmospheric Transmittance LUT.
 *
 * @category Texture
 */
class TransmittanceLUTTexture extends ManagementResourceBase {
    #gpuTexture: GPUTexture;
    #gpuTextureView: GPUTextureView;
    #width: number;
    #height: number;

    /**
     * [KO] TransmittanceLUTTexture 인스턴스를 생성합니다.
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param width - 텍스처 너비
     * @param height - 텍스처 높이
     */
    constructor(redGPUContext: RedGPUContext, width: number, height: number) {
        super(redGPUContext, MANAGED_STATE_KEY);
        this.#width = width;
        this.#height = height;
        this.#init();
    }

    /**
     * [KO] 텍스처를 초기화합니다.
     */
    #init() {
        const {gpuDevice} = this.redGPUContext;
        this.#gpuTexture = gpuDevice.createTexture({
            label: 'TransmittanceLUTTexture',
            size: [this.#width, this.#height],
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING
        });
        this.#gpuTextureView = this.#gpuTexture.createView();
        this.__fireListenerList();
    }

    /**
     * [KO] GPUTexture 객체를 반환합니다.
     */
    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    /**
     * [KO] GPUTextureView 객체를 반환합니다.
     */
    get gpuTextureView(): GPUTextureView {
        return this.#gpuTextureView;
    }

    /**
     * [KO] 비디오 메모리 사용량(byte)을 반환합니다.
     */
    get videoMemorySize(): number {
        // width * height * 8 bytes (rgba16float = 4 channels * 2 bytes)
        return this.#width * this.#height * 8;
    }

    /**
     * [KO] 데이터 변경 시 리스너들에게 알립니다.
     */
    notifyUpdate() {
        this.__fireListenerList();
    }
}

Object.freeze(TransmittanceLUTTexture);
export default TransmittanceLUTTexture;
