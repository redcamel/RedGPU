import RedGPUContext from "../../context/RedGPUContext";
import UniformBufferDescriptor from "../../resource/buffers/uniformBuffer/UniformBufferDescriptor";
import BaseObject3DPipeline from "./BaseObject3DPipeline";

class BaseObject3D extends BaseObject3DPipeline {
	#vertexUniformBufferDescriptor: UniformBufferDescriptor
	#vertexUniformBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor

	constructor(
		redGPUContext: RedGPUContext,
		vertexUniformBufferDescriptor: UniformBufferDescriptor,
		vertexUniformBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor
	) {
		super(redGPUContext, vertexUniformBufferDescriptor, vertexUniformBindGroupLayoutDescriptor)
		this.#vertexUniformBufferDescriptor = vertexUniformBufferDescriptor
		this.#vertexUniformBindGroupLayoutDescriptor = vertexUniformBindGroupLayoutDescriptor
	}

	get vertexUniformBufferDescriptor(): UniformBufferDescriptor {
		return this.#vertexUniformBufferDescriptor;
	}

	get vertexUniformBindGroupLayoutDescriptor(): GPUBindGroupLayoutDescriptor {
		return this.#vertexUniformBindGroupLayoutDescriptor;
	}
}

export default BaseObject3D
