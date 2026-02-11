import RedGPUContext from "../../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../../../resources/core/ManagementResourceBase";

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

	constructor(redGPUContext: RedGPUContext, width: number, height: number) {
		super(redGPUContext, MANAGED_STATE_KEY);
		this.#width = width;
		this.#height = height;
		this.#init();
	}

	#init(): void {
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

	get gpuTexture(): GPUTexture { return this.#gpuTexture; }
	get gpuTextureView(): GPUTextureView { return this.#gpuTextureView; }

	get videoMemorySize(): number {
		return this.#width * this.#height * 8;
	}

	notifyUpdate(): void {
		this.__fireListenerList();
	}
}

Object.freeze(TransmittanceLUTTexture);
export default TransmittanceLUTTexture;
