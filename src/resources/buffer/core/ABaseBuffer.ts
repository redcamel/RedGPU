import RedGPUContext from "../../../context/RedGPUContext";
import ManagementResourceBase from "../../core/ManagementResourceBase";

export const GPU_BUFFER_SYMBOL = Symbol('gpuBuffer');
export const GPU_BUFFER_DATA_SYMBOL = Symbol('gpuBufferData');
export const GPU_BUFFER_DATA_SYMBOL_F32 = Symbol('gpuBufferDataViewF32');
export const GPU_BUFFER_DATA_SYMBOL_U32 = Symbol('gpuBufferDataViewU32');
export const GPU_BUFFER_CACHE_KEY = Symbol('gpuBufferCacheKey');

/**
 * [KO] RedGPU에서 사용하는 모든 버퍼 리소스의 기본 추상 클래스입니다.
 * [EN] Abstract base class for all buffer resources used in RedGPU.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>상속을 통해 사용하십시오.
 * [EN] This class is an abstract class and cannot be instantiated directly.<br/>Use it through inheritance.
 * :::
 *
 * @category Buffer
 */
abstract class ABaseBuffer extends ManagementResourceBase {
    [GPU_BUFFER_SYMBOL]: GPUBuffer
    [GPU_BUFFER_CACHE_KEY]: string
    readonly #usage: GPUBufferUsageFlags

    /**
     * [KO] ABaseBuffer 인스턴스를 초기화합니다.
     * [EN] Initializes an ABaseBuffer instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param managedStateKey -
     * [KO] 관리 상태 키
     * [EN] Managed state key
     * @param usage -
     * [KO] GPU 버퍼 사용 플래그
     * [EN] GPU buffer usage flags
     */
    protected constructor(
        redGPUContext: RedGPUContext,
        managedStateKey: string,
        usage: GPUBufferUsageFlags,
    ) {
        super(redGPUContext, managedStateKey)
        this.#usage = usage
    }

    /**
     * [KO] 캐시 키를 반환합니다.
     * [EN] Returns the cache key.
     */
    get cacheKey(): string {
        return this[GPU_BUFFER_CACHE_KEY] || this.uuid;
    }

    /**
     * [KO] GPUBuffer 객체를 반환합니다.
     * [EN] Returns the GPUBuffer object.
     */
    get gpuBuffer(): GPUBuffer {
        return this[GPU_BUFFER_SYMBOL];
    }

    /**
     * [KO] GPUBufferUsageFlags를 반환합니다.
     * [EN] Returns the GPUBufferUsageFlags.
     */
    get usage(): GPUBufferUsageFlags {
        return this.#usage;
    }

    /**
     * [KO] 버퍼의 크기(byte)를 반환합니다.
     * [EN] Returns the size of the buffer in bytes.
     */
    get size(): number {
        return this[GPU_BUFFER_DATA_SYMBOL]?.byteLength || 0
    }

    /**
     * [KO] 비디오 메모리 사용량(byte)을 반환합니다.
     * [EN] Returns the video memory usage in bytes.
     */
    get videoMemorySize(): number {
        return this.size
    }

    /**
     * [KO] 리소스를 파괴합니다.
     * [EN] Destroys the resource.
     */
    destroy() {
        const temp = this[GPU_BUFFER_SYMBOL]
        if (temp) {
            this[GPU_BUFFER_SYMBOL] = null
            this.__fireListenerList(true)
            this.redGPUContext.resourceManager.unregisterManagementResource(this)
            if (temp) temp.destroy()
        }
    }
}

export default ABaseBuffer