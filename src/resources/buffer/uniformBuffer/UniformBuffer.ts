import RedGPUContext from "../../../context/RedGPUContext";
import basicRegisterResource from "../../resourceManager/core/basicRegisterResource";
import ResourceStateUniformBuffer from "../../resourceManager/resourceState/ResourceStateUniformBuffer";
import AUniformBaseBuffer from "../core/AUniformBaseBuffer";
import getCacheBufferFromResourceState from "../core/getCacheBufferFromResourceState";

const MANAGED_STATE_KEY = 'managedUniformBufferState'

class UniformBuffer extends AUniformBaseBuffer {
	constructor(redGPUContext: RedGPUContext, uniformData: ArrayBuffer, label: string = '', cacheKey: string = '') {
		const usage: GPUBufferUsageFlags = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		super(
			redGPUContext,
			MANAGED_STATE_KEY,
			usage,
			uniformData,
			label,
		)
		const cacheBuffer = getCacheBufferFromResourceState(this, cacheKey) as UniformBuffer
		if (cacheBuffer) {
			return cacheBuffer
		} else {
			if (cacheKey) this.name = cacheKey
			basicRegisterResource(
				this,
				new ResourceStateUniformBuffer(this)
			)
		}
	}
}

Object.freeze(UniformBuffer)
export default UniformBuffer
