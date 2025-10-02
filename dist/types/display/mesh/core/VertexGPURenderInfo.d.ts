import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import ShaderVariantGenerator from "../../../resources/wgslParser/core/ShaderVariantGenerator";
declare class VertexGPURenderInfo {
    vertexShaderModule: GPUShaderModule;
    vertexShaderSourceVariant: ShaderVariantGenerator;
    vertexShaderVariantConditionalBlocks: string[];
    vertexStructInfo: any;
    vertexUniformInfo: any;
    vertexBindGroupLayout: GPUBindGroupLayout;
    vertexUniformBindGroup: GPUBindGroup;
    vertexUniformBuffer: UniformBuffer | StorageBuffer;
    pipeline: GPURenderPipeline;
    shadowPipeline: GPURenderPipeline;
    pickingPipeline: GPURenderPipeline;
    constructor(vertexShaderModule: GPUShaderModule, vertexShaderSourceVariant: ShaderVariantGenerator, vertexShaderVariantConditionalBlocks: string[], vertexUniformInfo: any, vertexBindGroupLayout: GPUBindGroupLayout, vertexUniformBuffer: UniformBuffer | StorageBuffer, vertexUniformBindGroup: GPUBindGroup, pipeline: GPURenderPipeline, shadowPipeline?: GPURenderPipeline, pickingPipeline?: GPURenderPipeline);
}
export default VertexGPURenderInfo;
