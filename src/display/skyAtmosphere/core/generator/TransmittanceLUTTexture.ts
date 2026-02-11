import RedGPUContext from "../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../../resources/core/ManagementResourceBase";

const MANAGED_STATE_KEY = 'managedBitmapTextureState'

/**
 * [KO] 대기 투과율(Transmittance) LUT 전용 텍스처 클래스입니다.
 * [EN] Texture class dedicated to Atmospheric Transmittance LUT.
 *
 * [KO] 이 클래스는 `ManagementResourceBase`를 상속받아 RedGPU의 표준 리소스 관리 시스템 내에서 캐싱 및 생명주기가 관리됩니다.
 * [EN] This class inherits from `ManagementResourceBase`, so its caching and lifecycle are managed within RedGPU's standard resource management system.
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
	 * [EN] Creates a new TransmittanceLUTTexture instance.
	 *
	 * @param redGPUContext -
	 * [KO] RedGPUContext 인스턴스
	 * [EN] RedGPUContext instance
	 * @param width -
	 * [KO] 텍스처 너비
	 * [EN] Texture width
	 * @param height -
	 * [KO] 텍스처 높이
	 * [EN] Texture height
	 */
	constructor(redGPUContext: RedGPUContext, width: number, height: number) {
		super(redGPUContext, MANAGED_STATE_KEY);
		this.#width = width;
		this.#height = height;
		this.#init();
	}

	/**
	 * [KO] 텍스처를 초기화하고 GPU 리소스를 생성합니다.
	 * @private
	 */
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

	/**
	 * [KO] 원시 GPUTexture 객체를 반환합니다.
	 * [EN] Returns the raw GPUTexture object.
	 *
	 * @returns
	 * [KO] GPU 텍스처
	 * [EN] GPU texture
	 */
	get gpuTexture(): GPUTexture {
		return this.#gpuTexture;
	}

	/**
	 * [KO] 원시 GPUTextureView 객체를 반환합니다.
	 * [EN] Returns the raw GPUTextureView object.
	 *
	 * @returns
	 * [KO] GPU 텍스처 뷰
	 * [EN] GPU texture view
	 */
	get gpuTextureView(): GPUTextureView {
		return this.#gpuTextureView;
	}

	/**
	 * [KO] 비디오 메모리 사용량(byte)을 반환합니다.
	 * [EN] Returns the video memory usage in bytes.
	 *
	 * @returns
	 * [KO] 비디오 메모리 크기 (bytes)
	 * [EN] Video memory size (bytes)
	 */
	get videoMemorySize(): number {
		// width * height * 8 bytes (rgba16float = 4 channels * 2 bytes)
		return this.#width * this.#height * 8;
	}

	/**
	 * [KO] 데이터 변경 시 등록된 리스너들에게 알림을 보냅니다.
	 * [EN] Notifies registered listeners when data changes.
	 */
	notifyUpdate(): void {
		this.__fireListenerList();
	}
}

Object.freeze(TransmittanceLUTTexture);
export default TransmittanceLUTTexture;
