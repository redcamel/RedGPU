import RedGPUContext from "../../../context/RedGPUContext";
import ABaseBuffer, { GPU_BUFFER_DATA_SYMBOL } from "./ABaseBuffer";
/**
 * @class
 * @classdesc Represents a uniform buffer in RedGPU.
 * @extends ResourceBase
 */
declare abstract class AUniformBaseBuffer extends ABaseBuffer {
    #private;
    [GPU_BUFFER_DATA_SYMBOL]: ArrayBuffer;
    constructor(redGPUContext: RedGPUContext, MANAGED_STATE_KEY: string, usage: GPUBufferUsageFlags, data: ArrayBuffer, label?: string);
    get data(): ArrayBuffer;
    get dataViewF32(): Float32Array;
    get dataViewU32(): Uint32Array;
    get size(): number;
    get uniformBufferDescriptor(): GPUBufferDescriptor;
    writeOnlyBuffer(target: any, value: any): void;
}
export default AUniformBaseBuffer;
