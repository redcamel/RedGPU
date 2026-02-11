import RedGPUContext from "../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../../resources/core/ManagementResourceBase";

const MANAGED_STATE_KEY = 'managedBitmapTextureState'

/**
 * [KO] 최종 하늘색 데이터를 담는 Sky-View LUT 전용 텍스처 클래스입니다.
 * [EN] Texture class dedicated to Sky-View LUT containing the final sky colors.
 *
 * @category Texture
 */
class SkyViewLUTTexture extends ManagementResourceBase {
	#gpuTexture: GPUTexture;
	#gpuTextureView: GPUTextureView;
	#width: number;
	#height: number;

	/**
	 * [KO] SkyViewLUTTexture 인스턴스를 생성합니다.
	 * @param redGPUContext - RedGPUContext 인스턴스
	 * @param width - 텍스처 너비 (기본 200)
	 * @param height - 텍스처 높이 (기본 200)
	 */
	constructor(redGPUContext: RedGPUContext, width: number = 200, height: number = 200) {
		super(redGPUContext, MANAGED_STATE_KEY);
		this.#width = width;
		this.#height = height;
		this.#init();
	}

	#init(): void {
		const {gpuDevice} = this.redGPUContext;
		this.#gpuTexture = gpuDevice.createTexture({
			label: 'SkyViewLUTTexture',
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

Object.freeze(SkyViewLUTTexture);
export default SkyViewLUTTexture;
