import RedGPUContext from "../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../../resources/core/ManagementResourceBase";

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

	/**
	 * [KO] MultiScatteringLUTTexture 인스턴스를 생성합니다.
	 * @param redGPUContext - RedGPUContext 인스턴스
	 * @param width - 텍스처 너비 (기본 32)
	 * @param height - 텍스처 높이 (기본 32)
	 */
	constructor(redGPUContext: RedGPUContext, width: number = 32, height: number = 32) {
		super(redGPUContext, MANAGED_STATE_KEY);
		this.#width = width;
		this.#height = height;
		this.#init();
	}

	/**
	 * [KO] 텍스처를 초기화합니다.
	 */
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

	/**
	 * [KO] 비디오 메모리 사용량(byte)을 반환합니다.
	 */
	get videoMemorySize(): number {
		return this.#width * this.#height * 8;
	}

	/**
	 * [KO] 데이터 변경 시 리스너들에게 알립니다.
	 */
	notifyUpdate(): void {
		this.__fireListenerList();
	}
}

Object.freeze(MultiScatteringLUTTexture);
export default MultiScatteringLUTTexture;
