import RedGPUContext from "../../../context/RedGPUContext";
import ManagementResourceBase from "../../core/ManagementResourceBase";

export const GPU_BUFFER_SYMBOL = Symbol('gpuBuffer');
export const GPU_BUFFER_DATA_SYMBOL = Symbol('gpuBufferData');
export const GPU_BUFFER_CACHE_KEY = Symbol('gpuBufferCacheKey');

/**
 * @class
 * @classdesc Represents a uniform buffer in RedGPU.
 * @extends ResourceBase
 */
abstract class ABaseBuffer extends ManagementResourceBase {
	[GPU_BUFFER_SYMBOL]: GPUBuffer
	[GPU_BUFFER_CACHE_KEY]: string
	readonly #usage: GPUBufferUsageFlags

	constructor(
		redGPUContext: RedGPUContext,
		managedStateKey: string,
		usage: GPUBufferUsageFlags,
	) {
		super(redGPUContext, managedStateKey)
		this.#usage = usage
	}

	get cacheKey(): string {
		return this[GPU_BUFFER_CACHE_KEY] || this.uuid;
	}

	get gpuBuffer(): GPUBuffer {
		return this[GPU_BUFFER_SYMBOL];
	}

	get usage(): GPUBufferUsageFlags {
		return this.#usage;
	}


	get size(): number {
		return this[GPU_BUFFER_DATA_SYMBOL].byteLength || 0
	}

	get videoMemorySize(): number {
		return this.size
	}

	destroy() {
		const temp = this[GPU_BUFFER_SYMBOL]
		if (temp) {
			this[GPU_BUFFER_SYMBOL] = null
			this.__fireListenerList(true)
			this.redGPUContext.resourceManager.unregisterManagementResource(this)
			if (temp) temp.destroy()
		}
	}
}

export default ABaseBuffer
