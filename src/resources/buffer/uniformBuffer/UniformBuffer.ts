import RedGPUContext from "../../../context/RedGPUContext";
import ResourceStateUniformBuffer from "../../resourceManager/resourceState/ResourceStateUniformBuffer";
import {GPU_BUFFER_CACHE_KEY} from "../core/ABaseBuffer";
import AUniformBaseBuffer from "../core/AUniformBaseBuffer";

const MANAGED_STATE_KEY = 'managedUniformBufferState'

class UniformBuffer extends AUniformBaseBuffer {
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
