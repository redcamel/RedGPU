import RedGPUContext from "../../../context/RedGPUContext";
import ResourceStateStorageBuffer from "../../core/resourceManager/resourceState/ResourceStateStorageBuffer";
import {GPU_BUFFER_CACHE_KEY} from "../core/ABaseBuffer";
import AUniformBaseBuffer from "../core/AUniformBaseBuffer";

const MANAGED_STATE_KEY = 'managedStorageBufferState'

/**
 * [KO] Storage 버퍼를 관리하는 클래스입니다.
 * [EN] Class that manages storage buffers.
 *
 * * ### Example
 * ```typescript
 * const storageBuffer = new RedGPU.Resource.StorageBuffer(redGPUContext, data);
 * ```
 * @category Buffer
 */
class StorageBuffer extends AUniformBaseBuffer {
    /**
     * [KO] StorageBuffer 인스턴스를 생성합니다.
     * [EN] Creates a StorageBuffer instance.
     *
     * * ### Example
     * ```typescript
     * const storageBuffer = new RedGPU.Resource.StorageBuffer(redGPUContext, data, 'MyStorageBuffer');
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param uniformData -
     * [KO] 업로드할 `ArrayBuffer` 데이터
     * [EN] `ArrayBuffer` data to upload
     * @param label -
     * [KO] 버퍼 레이블 (선택)
     * [EN] Buffer label (optional)
     * @param cacheKey -
     * [KO] 버퍼 캐시 키 (선택)
     * [EN] Buffer cache key (optional)
     */
    constructor(
        redGPUContext: RedGPUContext,
        uniformData: ArrayBuffer,
        label: string = '',
        cacheKey: string = ''
    ) {
        const usage: GPUBufferUsageFlags = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
        super(redGPUContext, MANAGED_STATE_KEY, usage, uniformData, label)
        const {table} = this.targetResourceManagedState
        const cacheBuffer = table.get(cacheKey)
        if (cacheBuffer) {
            return cacheBuffer.buffer
        } else {
            if (cacheKey) {
                this.name = cacheKey
                this[GPU_BUFFER_CACHE_KEY] = cacheKey
            }
            this.redGPUContext.resourceManager.registerManagementResource(
                this,
                new ResourceStateStorageBuffer(this)
            )
        }
    }
}

Object.freeze(StorageBuffer)
export default StorageBuffer