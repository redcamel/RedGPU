import RedGPUContext from "../../../context/RedGPUContext";
import ManagementResourceBase from "../../core/ManagementResourceBase";
export declare const GPU_BUFFER_SYMBOL: unique symbol;
export declare const GPU_BUFFER_DATA_SYMBOL: unique symbol;
export declare const GPU_BUFFER_DATA_SYMBOL_F32: unique symbol;
export declare const GPU_BUFFER_DATA_SYMBOL_U32: unique symbol;
export declare const GPU_BUFFER_CACHE_KEY: unique symbol;
/**
 * @class
 * @classdesc Represents a uniform buffer in RedGPU.
 * @extends ResourceBase
 */
declare abstract class ABaseBuffer extends ManagementResourceBase {
    #private;
    [GPU_BUFFER_SYMBOL]: GPUBuffer;
    [GPU_BUFFER_CACHE_KEY]: string;
    constructor(redGPUContext: RedGPUContext, managedStateKey: string, usage: GPUBufferUsageFlags);
    get cacheKey(): string;
    get gpuBuffer(): GPUBuffer;
    get usage(): GPUBufferUsageFlags;
    get size(): number;
    get videoMemorySize(): number;
    destroy(): void;
}
export default ABaseBuffer;
