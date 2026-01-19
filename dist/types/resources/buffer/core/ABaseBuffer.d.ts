import RedGPUContext from "../../../context/RedGPUContext";
import ManagementResourceBase from "../../core/ManagementResourceBase";
export declare const GPU_BUFFER_SYMBOL: unique symbol;
export declare const GPU_BUFFER_DATA_SYMBOL: unique symbol;
export declare const GPU_BUFFER_DATA_SYMBOL_F32: unique symbol;
export declare const GPU_BUFFER_DATA_SYMBOL_U32: unique symbol;
export declare const GPU_BUFFER_CACHE_KEY: unique symbol;
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
declare abstract class ABaseBuffer extends ManagementResourceBase {
    #private;
    [GPU_BUFFER_SYMBOL]: GPUBuffer;
    [GPU_BUFFER_CACHE_KEY]: string;
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
    protected constructor(redGPUContext: RedGPUContext, managedStateKey: string, usage: GPUBufferUsageFlags);
    /**
     * [KO] 캐시 키를 반환합니다.
     * [EN] Returns the cache key.
     */
    get cacheKey(): string;
    /**
     * [KO] GPUBuffer 객체를 반환합니다.
     * [EN] Returns the GPUBuffer object.
     */
    get gpuBuffer(): GPUBuffer;
    /**
     * [KO] GPUBufferUsageFlags를 반환합니다.
     * [EN] Returns the GPUBufferUsageFlags.
     */
    get usage(): GPUBufferUsageFlags;
    /**
     * [KO] 버퍼의 크기(byte)를 반환합니다.
     * [EN] Returns the size of the buffer in bytes.
     */
    get size(): number;
    /**
     * [KO] 비디오 메모리 사용량(byte)을 반환합니다.
     * [EN] Returns the video memory usage in bytes.
     */
    get videoMemorySize(): number;
    /**
     * [KO] 리소스를 파괴합니다.
     * [EN] Destroys the resource.
     */
    destroy(): void;
}
export default ABaseBuffer;
