import RedGPUContext from "../../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../../../resources/core/ManagementResourceBase";

const MANAGED_STATE_KEY = 'managedBitmapTextureState'

/**
 * [KO] 다중 산란(Multi-Scattering) 에너지 보정 데이터를 담는 전용 텍스처 클래스입니다.
 * [EN] Dedicated texture class containing Multi-Scattering energy compensation data.
 *
 * @category Texture
 */
class MultiScatteringLUTTexture extends ManagementResourceBase {
	#gpuTexture: GPUTexture;
	#gpuTextureView: GPUTextureView;
	#width: number;
	#height: number;

	constructor(redGPUContext: RedGPUContext, width: number = 32, height: number = 32) {
		super(redGPUContext, MANAGED_STATE_KEY);
		this.#width = width;
		this.#height = height;
		this.#init();
	}

	#init(): void {
		const {gpuDevice} = this.redGPUContext;
		this.#gpuTexture = gpuDevice.createTexture({
			label: 'MultiScatteringLUTTexture',
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

Object.freeze(MultiScatteringLUTTexture);
export default MultiScatteringLUTTexture;
