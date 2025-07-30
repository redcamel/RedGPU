import RedGPUContext from "../../../context/RedGPUContext";
import ManagementResourceBase from "../../ManagementResourceBase";

export const GPU_BUFFER_SYMBOL = Symbol('gpuBuffer');
export const GPU_BUFFER_DATA_SYMBOL = Symbol('gpuBufferData');

/**
 * @class
 * @classdesc Represents a uniform buffer in RedGPU.
 * @extends ResourceBase
 */
class ABaseBuffer extends ManagementResourceBase {
	[GPU_BUFFER_SYMBOL]: GPUBuffer
	readonly #usage: GPUBufferUsageFlags

	constructor(
		redGPUContext: RedGPUContext,
		managedStateKey: string,
		usage: GPUBufferUsageFlags,
	) {
		super(redGPUContext, managedStateKey)
		this.#usage = usage
	}

	get gpuBuffer(): GPUBuffer {
		return this[GPU_BUFFER_SYMBOL];
	}

	get usage(): GPUBufferUsageFlags {
		return this.#usage;
	}

	get data(): Float32Array {
		return this[GPU_BUFFER_DATA_SYMBOL];
	}

	get size(): number {
		return this[GPU_BUFFER_DATA_SYMBOL].byteLength || 0
	}

	destroy() {
		const temp = this[GPU_BUFFER_SYMBOL]
		if (temp) {
			this[GPU_BUFFER_SYMBOL] = null
			this.__fireListenerList(true)
			this.redGPUContext.resourceManager.unregisterResourceOld(this)
			if (temp) temp.destroy()
		}
	}
}

export default ABaseBuffer
