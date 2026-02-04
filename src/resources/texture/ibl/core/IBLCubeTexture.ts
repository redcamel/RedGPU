import RedGPUContext from "../../../../context/RedGPUContext";
import calculateTextureByteSize from "../../../../utils/texture/calculateTextureByteSize";
import ManagementResourceBase from "../../../core/ManagementResourceBase";
import ResourceStateCubeTexture from "../../../core/resourceManager/resourceState/texture/ResourceStateCubeTexture";
import CubeTexture from "../../CubeTexture";

const MANAGED_STATE_KEY = 'managedCubeTextureState'

/**
 * [KO] IBL에서 내부적으로 사용하는 큐브 텍스처 클래스입니다.
 * [EN] Cube texture class used internally in IBL.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category IBL
 */
class IBLCubeTexture extends ManagementResourceBase {
    #gpuTexture: GPUTexture
    #mipLevelCount: number
    #useMipmap: boolean = true
    #videoMemorySize: number = 0
    #format: GPUTextureFormat

    /**
     * [KO] IBLCubeTexture 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates an IBLCubeTexture instance. (Internal system only)
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param cacheKey -
     * [KO] 캐시 키
     * [EN] Cache key
     * @param gpuTexture -
     * [KO] `GPUTexture` 객체 (선택)
     * [EN] `GPUTexture` object (optional)
     */
    constructor(
        redGPUContext: RedGPUContext,
        cacheKey: string,
        gpuTexture?: GPUTexture,
    ) {
        super(redGPUContext, MANAGED_STATE_KEY);
        this.cacheKey = cacheKey;
        const {table} = this.targetResourceManagedState
        if (cacheKey) {
            let target: ResourceStateCubeTexture = table.get(cacheKey)
            if (target) {
                return target.texture as IBLCubeTexture
            } else {
                if (gpuTexture) {
                    this.#setGpuTexture(gpuTexture)
                }
                this.#registerResource()
            }
        }
    }

    /** [KO] 뷰 디스크립터를 반환합니다. [EN] Returns the view descriptor. */
    get viewDescriptor() {
        return {
            ...CubeTexture.defaultViewDescriptor,
            mipLevelCount: this.#mipLevelCount
        }
    }

    /** [KO] 텍스처 포맷 [EN] Texture format */
    get format(): GPUTextureFormat {
        return this.#format;
    }

    /** [KO] 비디오 메모리 사용량(byte) [EN] Video memory usage in bytes */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /** [KO] GPUTexture 객체 [EN] GPUTexture object */
    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    /** [KO] GPUTexture 객체 설정 [EN] Sets the GPUTexture object */
    set gpuTexture(gpuTexture: GPUTexture) {
        this.#setGpuTexture(gpuTexture)
    }

    /** [KO] 밉맵 레벨 개수 [EN] Number of mipmap levels */
    get mipLevelCount(): number {
        return this.#mipLevelCount;
    }

    /** [KO] 밉맵 사용 여부 [EN] Whether to use mipmaps */
    get useMipmap(): boolean {
        return this.#useMipmap;
    }

    /** [KO] 리소스를 파괴합니다. [EN] Destroys the resource. */
    destroy() {
        const temp = this.#gpuTexture
        this.#setGpuTexture(null);
        this.__fireListenerList(true)
        this.#unregisterResource()
        this.cacheKey = null
        if (temp) temp.destroy()
    }

    /**
     * [KO] GPUTexture 객체를 설정하고 메모리 사용량을 갱신합니다.
     * [EN] Sets the GPUTexture object and updates video memory usage.
     */
    #setGpuTexture(value: GPUTexture) {
        this.targetResourceManagedState.videoMemory -= this.#videoMemorySize;
        this.#gpuTexture = value;
        if (value) {
            this.#mipLevelCount = value.mipLevelCount
            this.#useMipmap = value.mipLevelCount > 1
            this.#format = value.format
            this.#videoMemorySize = calculateTextureByteSize(value)
        }
        this.targetResourceManagedState.videoMemory += this.#videoMemorySize;
        this.__fireListenerList();
    }

    /**
     * [KO] 리소스를 관리 대상으로 등록합니다.
     * [EN] Registers the resource for management.
     */
    #registerResource() {
        this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateCubeTexture(this));
    }

    /**
     * [KO] 리소스 등록을 해제합니다.
     * [EN] Unregisters the resource from management.
     */
    #unregisterResource() {
        this.redGPUContext.resourceManager.unregisterManagementResource(this);
    }
}

Object.freeze(IBLCubeTexture)
export default IBLCubeTexture