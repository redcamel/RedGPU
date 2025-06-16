import StorageBuffer from "../resources/buffer/storageBuffer/StorageBuffer";
import UniformBuffer from "../resources/buffer/uniformBuffer/UniformBuffer";

class VertexGPURenderInfo {
	vertexShaderModule: GPUShaderModule;
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
		vertexUniformInfo: any,
		vertexBindGroupLayout: GPUBindGroupLayout,
		vertexUniformBuffer: UniformBuffer | StorageBuffer,
		vertexUniformBindGroup: GPUBindGroup,
		pipeline: GPURenderPipeline,
		shadowPipeline?: GPURenderPipeline,
		pickingPipeline?: GPURenderPipeline,
	) {
		this.vertexShaderModule = vertexShaderModule;
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
