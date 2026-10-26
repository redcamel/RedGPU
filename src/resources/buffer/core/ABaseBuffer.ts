import RedGPUContext from "../../../context/RedGPUContext";
import ManagementResourceBase from "../../core/ManagementResourceBase";

export const GPU_BUFFER_SYMBOL = Symbol('gpuBuffer');
export const GPU_BUFFER_DATA_SYMBOL = Symbol('gpuBufferData');
export const GPU_BUFFER_DATA_SYMBOL_F32 = Symbol('gpuBufferDataViewF32');
export const GPU_BUFFER_DATA_SYMBOL_U32 = Symbol('gpuBufferDataViewU32');
export const GPU_BUFFER_CACHE_KEY = Symbol('gpuBufferCacheKey');

/**
 * [KO] RedGPU의 모든 GPU 버퍼 리소스가 상속하는 기본 추상 클래스입니다.
 * [EN] Abstract base class inherited by all GPU buffer resources in RedGPU.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Buffer
 */
abstract class ABaseBuffer extends ManagementResourceBase {
    [GPU_BUFFER_SYMBOL]: GPUBuffer
    [GPU_BUFFER_CACHE_KEY]: string
    readonly #usage: GPUBufferUsageFlags

    /**
     * [KO] 버퍼 공통 상태를 초기화합니다.
     * [EN] Initializes the common buffer state.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param managedStateKey -
     * [KO] 리소스 매니저의 관리 상태 키
     * [EN] Managed state key of the resource manager
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
     * [KO] 버퍼 캐시 키를 반환합니다. 지정되지 않은 경우 uuid를 반환합니다.
     * [EN] Returns the buffer cache key. Returns the uuid if not specified.
     *
     * @returns
     * [KO] 캐시 키
     * [EN] Cache key
     */
    get cacheKey(): string {
        return this[GPU_BUFFER_CACHE_KEY] || this.uuid;
    }

    /**
     * [KO] 내부 GPUBuffer 객체를 반환합니다.
     * [EN] Returns the internal GPUBuffer object.
     *
     * @returns
     * [KO] GPUBuffer 객체
     * [EN] GPUBuffer object
     */
    get gpuBuffer(): GPUBuffer {
        return this[GPU_BUFFER_SYMBOL];
    }

    /**
     * [KO] GPU 버퍼 사용 플래그를 반환합니다.
     * [EN] Returns the GPU buffer usage flags.
     *
     * @returns
     * [KO] GPUBufferUsageFlags 값
     * [EN] GPUBufferUsageFlags value
     */
    get usage(): GPUBufferUsageFlags {
        return this.#usage;
    }

    /**
     * [KO] 버퍼 데이터 크기(byte)를 반환합니다.
     * [EN] Returns the buffer data size in bytes.
     *
     * @returns
     * [KO] 바이트 크기 (데이터가 없으면 0)
     * [EN] Size in bytes (0 if no data)
     */
    get size(): number {
        return this[GPU_BUFFER_DATA_SYMBOL]?.byteLength || 0
    }

    /**
     * [KO] 비디오 메모리 사용량(byte)을 반환합니다.
     * [EN] Returns the video memory usage in bytes.
     *
     * @returns
     * [KO] 비디오 메모리 사용량
     * [EN] Video memory usage
     */
    get videoMemorySize(): number {
        return this.size
    }

    /**
     * [KO] GPU 버퍼를 해제하고 리소스 매니저에서 등록을 해제합니다.
     * [EN] Releases the GPU buffer and unregisters it from the resource manager.
     *
     * [KO] GPUBuffer 파괴는 CommandEncoderManager를 통해 지연 처리됩니다.
     * [EN] GPUBuffer destruction is deferred through CommandEncoderManager.
     */
    destroy() {
        const temp = this[GPU_BUFFER_SYMBOL]
        if (temp) {
            this[GPU_BUFFER_SYMBOL] = null
            this.notifyUpdate(true)
            this.redGPUContext.resourceManager.unregisterManagementResource(this)
            this.redGPUContext.commandEncoderManager.addDeferredDestroy(temp)
        }
    }
}

export default ABaseBuffer