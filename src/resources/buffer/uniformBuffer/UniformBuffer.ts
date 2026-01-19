import RedGPUContext from "../../../context/RedGPUContext";
import ResourceStateUniformBuffer from "../../core/resourceManager/resourceState/ResourceStateUniformBuffer";
import {GPU_BUFFER_CACHE_KEY} from "../core/ABaseBuffer";
import AUniformBaseBuffer from "../core/AUniformBaseBuffer";

const MANAGED_STATE_KEY = 'managedUniformBufferState'

/**
 * [KO] Uniform 버퍼를 관리하는 클래스입니다.
 * [EN] Class that manages uniform buffers.
 *
 * * ### Example
 * ```typescript
 * const uniformBuffer = new RedGPU.Resource.UniformBuffer(redGPUContext, data);
 * ```
 * @category Buffer
 */
class UniformBuffer extends AUniformBaseBuffer {
    /**
     * [KO] UniformBuffer 인스턴스를 생성합니다.
     * [EN] Creates a UniformBuffer instance.
     *
     * * ### Example
     * ```typescript
     * const uniformBuffer = new RedGPU.Resource.UniformBuffer(redGPUContext, data, 'MyUniformBuffer');
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