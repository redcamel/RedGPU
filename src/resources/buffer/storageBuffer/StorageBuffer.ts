import RedGPUContext from "../../../context/RedGPUContext";
import ResourceStateStorageBuffer from "../../resourceManager/resourceState/ResourceStateStorageBuffer";
import AUniformBaseBuffer from "../core/AUniformBaseBuffer";

const MANAGED_STATE_KEY = 'managedStorageBufferState'

class StorageBuffer extends AUniformBaseBuffer {
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
