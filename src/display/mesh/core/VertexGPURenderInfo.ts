import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import ShaderVariantGenerator from "../../../resources/wgslParser/core/ShaderVariantGenerator";

class VertexGPURenderInfo {
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

	constructor(
		vertexShaderModule: GPUShaderModule,
		vertexShaderSourceVariant: ShaderVariantGenerator,
		vertexShaderVariantConditionalBlocks: string[],
		vertexUniformInfo: any,
		vertexBindGroupLayout: GPUBindGroupLayout,
		vertexUniformBuffer: UniformBuffer | StorageBuffer,
		vertexUniformBindGroup: GPUBindGroup,
		pipeline: GPURenderPipeline,
		shadowPipeline?: GPURenderPipeline,
		pickingPipeline?: GPURenderPipeline,
	) {
		this.vertexShaderModule = vertexShaderModule;
		this.vertexShaderSourceVariant = vertexShaderSourceVariant;
		this.vertexShaderVariantConditionalBlocks = vertexShaderVariantConditionalBlocks;
		this.vertexUniformInfo = vertexUniformInfo;
		this.vertexBindGroupLayout = vertexBindGroupLayout;
		this.vertexUniformBindGroup = vertexUniformBindGroup;
		this.vertexUniformBuffer = vertexUniformBuffer;
		this.pipeline = pipeline;
		this.shadowPipeline = shadowPipeline;
		this.pickingPipeline = pickingPipeline;
	}
}

Object.freeze(VertexGPURenderInfo)
export default VertexGPURenderInfo
