import RedGPUContext from "../../../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../../../../resources/core/ManagementResourceBase";

const MANAGED_STATE_KEY = 'managedBitmapTextureState'

/**
 * [KO] 거리별 공중 투시(Aerial Perspective) 데이터를 담는 3D LUT 텍스처 클래스입니다.
 * [EN] 3D LUT texture class containing Aerial Perspective data by distance.
 *
 * ### Example
 * ```typescript
 * const texture = new RedGPU.CameraVolumeLUTTexture(redGPUContext, 64, 64, 32);
 * ```
 *
 * @category Texture
 */
class CameraVolumeLUTTexture extends ManagementResourceBase {
	#gpuTexture: GPUTexture;
	#gpuTextureView: GPUTextureView;
	#width: number;
	#height: number;
	#depth: number;

	/**
	 * [KO] CameraVolumeLUTTexture 인스턴스를 생성합니다.
	 * [EN] Creates a CameraVolumeLUTTexture instance.
	 *
	 * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
	 * @param width - [KO] 텍스처 가로 크기 [EN] Texture width
	 * @param height - [KO] 텍스처 세로 크기 [EN] Texture height
	 * @param depth - [KO] 텍스처 깊이 크기 [EN] Texture depth
	 */
	constructor(redGPUContext: RedGPUContext, width: number = 64, height: number = 64, depth: number = 32) {
		super(redGPUContext, MANAGED_STATE_KEY);
		this.#width = width;
		this.#height = height;
		this.#depth = depth;
		this.#init();
	}

	#init(): void {
		const {gpuDevice} = this.redGPUContext;
		this.#gpuTexture = gpuDevice.createTexture({
			label: 'CameraVolumeLUTTexture',
			size: [this.#width, this.#height, this.#depth],
			dimension: '3d',
			format: 'rgba16float',
			usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING
		});
		this.#gpuTextureView = this.#gpuTexture.createView();
		this.__fireListenerList();
	}

	/** [KO] 내부 GPUTexture 객체를 반환합니다. [EN] Returns the internal GPUTexture object. */
	get gpuTexture(): GPUTexture { return this.#gpuTexture; }
	/** [KO] 내부 GPUTextureView 객체를 반환합니다. [EN] Returns the internal GPUTextureView object. */
	get gpuTextureView(): GPUTextureView { return this.#gpuTextureView; }

	/** [KO] 비디오 메모리 사용량을 바이트 단위로 반환합니다. [EN] Returns video memory usage in bytes. */
	get videoMemorySize(): number {
		return this.#width * this.#height * this.#depth * 8;
	}

	/** [KO] 텍스처 업데이트가 완료되었음을 알립니다. [EN] Notifies that the texture update is complete. */
	notifyUpdate(): void {
		this.__fireListenerList();
	}
}

Object.freeze(CameraVolumeLUTTexture);
export default CameraVolumeLUTTexture;
