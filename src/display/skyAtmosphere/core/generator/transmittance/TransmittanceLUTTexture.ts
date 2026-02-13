import RedGPUContext from "../../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../../../resources/core/ManagementResourceBase";

const MANAGED_STATE_KEY = 'managedBitmapTextureState'

/**
 * [KO] 대기 투과율(Transmittance) LUT 전용 텍스처 클래스입니다.
 * [EN] Texture class dedicated to Atmospheric Transmittance LUT.
 *
 * ### Example
 * ```typescript
 * const texture = new RedGPU.TransmittanceLUTTexture(redGPUContext, 256, 64);
 * ```
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
	 * [EN] Creates a TransmittanceLUTTexture instance.
	 *
	 * @param redGPUContext -
	 * [KO] RedGPU 컨텍스트
	 * [EN] RedGPU context
	 * @param width -
	 * [KO] 텍스처 가로 크
	 * [EN] Texture width
	 * @param height -
	 * [KO] 텍스처 세로 크기
	 * [EN] Texture height
	 */
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
