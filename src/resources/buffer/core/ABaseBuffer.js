import ManagementResourceBase from "../../core/ManagementResourceBase";
export const GPU_BUFFER_SYMBOL = Symbol('gpuBuffer');
export const GPU_BUFFER_DATA_SYMBOL = Symbol('gpuBufferData');
export const GPU_BUFFER_CACHE_KEY = Symbol('gpuBufferCacheKey');
/**
 * @class
 * @classdesc Represents a uniform buffer in RedGPU.
 * @extends ResourceBase
 */
class ABaseBuffer extends ManagementResourceBase {
    [GPU_BUFFER_SYMBOL];
    [GPU_BUFFER_CACHE_KEY];
    #usage;
    constructor(redGPUContext, managedStateKey, usage) {
        super(redGPUContext, managedStateKey);
        this.#usage = usage;
    }
    get cacheKey() {
        return this[GPU_BUFFER_CACHE_KEY] || this.uuid;
    }
    get gpuBuffer() {
        return this[GPU_BUFFER_SYMBOL];
    }
    get usage() {
        return this.#usage;
    }
    get size() {
        return this[GPU_BUFFER_DATA_SYMBOL].byteLength || 0;
    }
    get videoMemorySize() {
        return this.size;
    }
    destroy() {
        const temp = this[GPU_BUFFER_SYMBOL];
        if (temp) {
            this[GPU_BUFFER_SYMBOL] = null;
            this.__fireListenerList(true);
            this.redGPUContext.resourceManager.unregisterManagementResource(this);
            if (temp)
                temp.destroy();
        }
    }
}
export default ABaseBuffer;
