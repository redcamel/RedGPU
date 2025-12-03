import RedGPUContext from "../../../context/RedGPUContext";
import ResourceStateUniformBuffer from "../../core/resourceManager/resourceState/ResourceStateUniformBuffer";
import {GPU_BUFFER_CACHE_KEY} from "../core/ABaseBuffer";
import AUniformBaseBuffer from "../core/AUniformBaseBuffer";

const MANAGED_STATE_KEY = 'managedUniformBufferState'

/**
 * UniformBuffer
 * @category Buffer
 */
class UniformBuffer extends AUniformBaseBuffer {
    /**
     * UniformBuffer 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param uniformData - 업로드할 ArrayBuffer 데이터
     * @param label - 버퍼 레이블(옵션)
     * @param cacheKey - 버퍼 캐시 키(옵션)
     */
    constructor(
        redGPUContext: RedGPUContext,
        uniformData: ArrayBuffer,
        label: string = '',
        cacheKey: string = ''
    ) {
        const usage: GPUBufferUsageFlags = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
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
                new ResourceStateUniformBuffer(this)
            )
        }
    }
}

Object.freeze(UniformBuffer)
export default UniformBuffer
