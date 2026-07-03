import RedGPUContext from "../context/RedGPUContext";
import InstancingMesh from "../display/instancingMesh/InstancingMesh";
import Mesh from "../display/mesh/Mesh";
import validatePositiveNumberRange from "../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../runtimeChecker/validateFunc/validateUintRange";
import calculateTextureByteSize from "../utils/texture/calculateTextureByteSize";

/**
 * [KO] 직사광(Directional Light)의 그림자 뎁스 텍스처와 관련 설정을 관리하는 클래스입니다.
 * [EN] Class that manages shadow depth textures and related settings for directional lights.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Shadow
 */
class DirectionalShadowManager {
    #shadowDepthTextureSize: number = 4096
    #bias: number = 0.0005
    #shadowDepthTexture: GPUTexture
    #shadowDepthTextureView: GPUTextureView
    #shadowDepthTextureEmpty: GPUTexture
    #shadowDepthTextureViewEmpty: GPUTextureView
    #redGPUContext: RedGPUContext
    #castingList: (Mesh | InstancingMesh)[] = []
    #videoMemorySize: number = 0

    /**
     * [KO] 현재 섀도우 맵이 사용하는 비디오 메모리 크기(Bytes)를 반환합니다.
     * [EN] Returns the video memory size (Bytes) used by the current shadow map.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (Bytes)
     * [EN] Video memory usage in bytes
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /**
     * [KO] 그림자를 생성할 대상 객체 리스트를 반환합니다.
     * [EN] Returns the list of objects that will cast shadows.
     *
     * @returns
     * [KO] 섀도우 캐스팅 대상 배열
     * [EN] Array of shadow casting objects
     */
    get castingList(): (Mesh | InstancingMesh)[] {
        return this.#castingList;
    }

    /**
     * [KO] 섀도우 뎁스 텍스처 뷰를 반환합니다.
     * [EN] Returns the shadow depth texture view.
     *
     * @returns
     * [KO] 섀도우 뎁스 GPUTextureView
     * [EN] Shadow depth GPUTextureView
     */
    get shadowDepthTextureView(): GPUTextureView {
        return this.#shadowDepthTextureView;
    }

    /**
     * [KO] 그림자가 없는 상태를 위한 빈(1x1) 뎁스 텍스처 뷰를 반환합니다.
     * [EN] Returns an empty (1x1) depth texture view for non-shadow states.
     *
     * @returns
     * [KO] 빈 뎁스 GPUTextureView
     * [EN] Empty depth GPUTextureView
     */
    get shadowDepthTextureViewEmpty(): GPUTextureView {
        return this.#shadowDepthTextureViewEmpty;
    }

    /**
     * [KO] 그림자 바이어스(Bias) 값을 반환합니다.
     * [EN] Returns the shadow bias value.
     *
     * @returns
     * [KO] 바이어스 값
     * [EN] Bias value
     */
    get bias(): number {
        return this.#bias;
    }

    /**
     * [KO] 그림자 바이어스(Bias) 값을 설정합니다. (0.0 ~ 1.0)
     * [EN] Sets the shadow bias value. (0.0 to 1.0)
     *
     * @param value -
     * [KO] 바이어스 값
     * [EN] Bias value
     */
    set bias(value: number) {
        validatePositiveNumberRange(value, 0, 1)
        this.#bias = value;
    }

    /**
     * [KO] 섀도우 뎁스 텍스처의 크기(해상도)를 반환합니다.
     * [EN] Returns the size (resolution) of the shadow depth texture.
     *
     * @returns
     * [KO] 해상도 값
     * [EN] Resolution value
     */
    get shadowDepthTextureSize(): number {
        return this.#shadowDepthTextureSize;
    }

    /**
     * [KO] 섀도우 뎁스 텍스처의 크기(해상도)를 설정합니다. (정수)
     * [EN] Sets the size (resolution) of the shadow depth texture. (Integer)
     *
     * @param value -
     * [KO] 해상도 값
     * [EN] Resolution value
     */
    set shadowDepthTextureSize(value: number) {
        validateUintRange(value, 1)
        this.#shadowDepthTextureSize = value;
    }

    /**
     * [KO] 매니저를 리셋하고 리소스를 파기합니다.
     * [EN] Resets the manager and destroys resources.
     */
    reset() {
        this.destroy()
    }

    /**
     * [KO] 섀도우 캐스팅 대상 리스트를 초기화합니다.
     * [EN] Resets the list of shadow casting objects.
     */
    resetCastingList() {
        this.#castingList.length = 0
    }

    /**
     * [KO] 내부 상태를 업데이트합니다. (주로 해상도 변경 체크)
     * [EN] Updates internal state. (Mainly checks for resolution changes)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    update(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext
        this.#checkDepthTexture()
    }

    /**
     * [KO] 사용 중인 GPU 리소스를 해제합니다.
     * [EN] Releases GPU resources in use.
     */
    destroy() {
        const {commandEncoderManager} = this.#redGPUContext
        if (this.#shadowDepthTexture) {
            commandEncoderManager.addDeferredDestroy(this.#shadowDepthTexture)
            this.#shadowDepthTexture = null
            this.#shadowDepthTextureView = null
        }
        if (this.#shadowDepthTextureEmpty) {
            commandEncoderManager.addDeferredDestroy(this.#shadowDepthTextureEmpty)
            this.#shadowDepthTextureEmpty = null
            this.#shadowDepthTextureViewEmpty = null
        }
    }

    /** 비디오 메모리 계산 */
    #calcVideoMemory() {
        const texture = this.#shadowDepthTexture
        if (!texture) return 0;
        this.#videoMemorySize = calculateTextureByteSize(texture)
    }

    /** 뎁스 텍스처 변경 여부 확인 및 재생성 */
    #checkDepthTexture() {
        if (this.#shadowDepthTexture?.width !== this.#shadowDepthTextureSize) {
            this.destroy()
            this.#createDepthTexture()
            this.#calcVideoMemory()
        }
    }

    /** 빈 뎁스 텍스처(1x1) 생성 */
    #createEmptyDepthTexture(gpuDevice: GPUDevice) {
        this.#shadowDepthTextureEmpty = gpuDevice.createTexture({
            size: [1, 1, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: 'depth32float',
            label: `DirectionalShadowManager_EmptyDepthTexture_1x1_${Date.now()}`,
        })
        this.#shadowDepthTextureViewEmpty = this.#shadowDepthTextureEmpty.createView({label: this.#shadowDepthTextureEmpty.label})
    }

    /** 실제 섀도우 뎁스 텍스처 생성 */
    #createDepthTexture() {
        const {gpuDevice, resourceManager} = this.#redGPUContext
        this.#shadowDepthTexture = resourceManager.createManagedTexture({
            size: [this.#shadowDepthTextureSize, this.#shadowDepthTextureSize, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: 'depth32float',
            label: `DirectionalShadowManager_shadowDepthTextureSize_${this.#shadowDepthTextureSize}x${this.#shadowDepthTextureSize}_${Date.now()}`,
        });
        this.#shadowDepthTextureView = this.#shadowDepthTexture.createView({label: this.#shadowDepthTexture.label})
        if (!this.#shadowDepthTextureViewEmpty) this.#createEmptyDepthTexture(gpuDevice)
    }
}

Object.freeze(DirectionalShadowManager)
export default DirectionalShadowManager
