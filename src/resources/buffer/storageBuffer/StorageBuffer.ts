import RedGPUContext from "../../../context/RedGPUContext";
import ResourceStateStorageBuffer from "../../resourceManager/resourceState/ResourceStateStorageBuffer";
import AUniformBaseBuffer from "../core/AUniformBaseBuffer";
import getCacheBufferFromResourceState from "../core/getCacheBufferFromResourceState";

const MANAGED_STATE_KEY = 'managedStorageBufferState'

class StorageBuffer extends AUniformBaseBuffer {
	constructor(redGPUContext: RedGPUContext, uniformData: ArrayBuffer, label: string = '', cacheKey = '') {
		const usage: GPUBufferUsageFlags = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
		super(
			redGPUContext,
			MANAGED_STATE_KEY,
			usage,
			uniformData,
			label
		)
		const cacheBuffer = getCacheBufferFromResourceState(this, cacheKey) as StorageBuffer
		if (cacheBuffer) {
			return cacheBuffer
		} else {
			if (cacheKey) this.name = cacheKey
			this.redGPUContext.resourceManager.registerResourceOld(
				this,
				new ResourceStateStorageBuffer(this)
			)
		}
	}
}

Object.freeze(StorageBuffer)
export default StorageBuffer
