import RedGPUContext from "../../context/RedGPUContext";
import BaseObject3DPipeline from "./BaseObject3DPipeline";
import UniformBufferDescriptor from "../../resource/buffers/uniformBuffer/UniformBufferDescriptor";

class BaseObject3D extends BaseObject3DPipeline {
    #vertexUniformBufferDescriptor: UniformBufferDescriptor
    get vertexUniformBufferDescriptor(): UniformBufferDescriptor {
        return this.#vertexUniformBufferDescriptor;
    }

    #vertexUniformBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor
    get vertexUniformBindGroupLayoutDescriptor(): GPUBindGroupLayoutDescriptor {
        return this.#vertexUniformBindGroupLayoutDescriptor;
    }

    constructor(
        redGPUContext: RedGPUContext,
        vertexUniformBufferDescriptor: UniformBufferDescriptor,
        vertexUniformBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor
    ) {
        super(redGPUContext, vertexUniformBufferDescriptor, vertexUniformBindGroupLayoutDescriptor)
        this.#vertexUniformBufferDescriptor = vertexUniformBufferDescriptor
        this.#vertexUniformBindGroupLayoutDescriptor = vertexUniformBindGroupLayoutDescriptor
    }

}

export default BaseObject3D
