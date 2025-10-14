import ResourceStateStorageBuffer from "../../core/resourceManager/resourceState/ResourceStateStorageBuffer";
import { GPU_BUFFER_CACHE_KEY } from "../core/ABaseBuffer";
import AUniformBaseBuffer from "../core/AUniformBaseBuffer";
const MANAGED_STATE_KEY = 'managedStorageBufferState';
/**
 * StorageBuffer
 * @category Buffer
 */
class StorageBuffer extends AUniformBaseBuffer {
    /**
     * StorageBuffer 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param uniformData - 업로드할 ArrayBuffer 데이터
     * @param label - 버퍼 레이블(옵션)
     * @param cacheKey - 버퍼 캐시 키(옵션)
     */
    constructor(redGPUContext, uniformData, label = '', cacheKey = '') {
        const usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
        super(redGPUContext, MANAGED_STATE_KEY, usage, uniformData, label);
        const { table } = this.targetResourceManagedState;
        const cacheBuffer = table.get(cacheKey);
        if (cacheBuffer) {
            return cacheBuffer.buffer;
        }
        else {
            if (cacheKey) {
                this.name = cacheKey;
                this[GPU_BUFFER_CACHE_KEY] = cacheKey;
            }
            this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateStorageBuffer(this));
        }
    }
}
Object.freeze(StorageBuffer);
export default StorageBuffer;
