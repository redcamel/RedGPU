import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import ShaderVariantGenerator from "../../../resources/wgslParser/core/ShaderVariantGenerator";
/**
 * [KO] GPU 버텍스 렌더링 작업에 대한 정보를 나타내는 클래스입니다.
 * [EN] Class representing information about a GPU vertex render operation.
 * @category Core
 */
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
