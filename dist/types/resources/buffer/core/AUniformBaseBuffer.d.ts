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
    get dataView(): DataView;
    get size(): number;
    get uniformBufferDescriptor(): GPUBufferDescriptor;
    writeBuffers(targetList: [taregt: any, value: any][]): void;
    writeBuffer(target: any, value: any): void;
}
export default AUniformBaseBuffer;
