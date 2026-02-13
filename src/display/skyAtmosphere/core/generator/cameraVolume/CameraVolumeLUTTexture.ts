import RedGPUContext from "../../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../../../resources/core/ManagementResourceBase";

const MANAGED_STATE_KEY = 'managedBitmapTextureState'

/**
 * [KO] 거리별 공중 투시(Aerial Perspective) 데이터를 담는 3D LUT 텍스처 클래스입니다.
 * [EN] 3D LUT texture class containing Aerial Perspective data by distance.
 *
 * @category Texture
 */
class CameraVolumeLUTTexture extends ManagementResourceBase {
	#gpuTexture: GPUTexture;
	#gpuTextureView: GPUTextureView;
	#width: number;
	#height: number;
	#depth: number;

	constructor(redGPUContext: RedGPUContext, width: number = 32, height: number = 32, depth: number = 16) {
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

	get gpuTexture(): GPUTexture { return this.#gpuTexture; }
	get gpuTextureView(): GPUTextureView { return this.#gpuTextureView; }

	get videoMemorySize(): number {
		return this.#width * this.#height * this.#depth * 8;
	}

	notifyUpdate(): void {
		this.__fireListenerList();
	}
}

Object.freeze(CameraVolumeLUTTexture);
export default CameraVolumeLUTTexture;
