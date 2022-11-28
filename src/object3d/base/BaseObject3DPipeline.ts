import RedGPUContext from "../../context/RedGPUContext";
import BaseGeometry from "../../resource/geometry/Geometry";
import UniformBufferFloat32 from "../../resource/buffers/uniformBuffer/UniformBufferFloat32";
import UniformBufferDescriptor from "../../resource/buffers/uniformBuffer/UniformBufferDescriptor";
import BaseObject3DTransform from "./BaseObject3DTransform";
import MeshPipeline from "../mesh/MeshPipeline";
import throwErrorInstanceOf from "../../util/errorFunc/throwErrorInstanceOf";

class BaseObject3DPipeline extends BaseObject3DTransform {
    dirtyPipeline: boolean = false
    ///////////////
    #geometry: BaseGeometry
    get geometry(): BaseGeometry {
        return this.#geometry;
    }

    set geometry(value: BaseGeometry) {
        this.#geometry = value;
        this.dirtyPipeline = true
        if (this.#geometry) {
            this.#renderInfo_pipeline_VertexBuffersInfo = [
                {
                    arrayStride: this.geometry.vertexBuffer.arrayStride,
                    attributes: this.geometry.vertexBuffer.attributes
                }
            ]
        }
    }

    #material
    get material() {
        return this.#material;
    }

    set material(value) {
        this.#material = value;
        this.materialBindGroupID = this.material?.bindGroupID
        this.dirtyPipeline = true
    }

    materialBindGroupID
    ///////////////

    #vertexUniformBuffer: UniformBufferFloat32
    get vertexUniformBuffer(): UniformBufferFloat32 {
        return this.#vertexUniformBuffer;
    }

    #renderInfo_VertexUniformBindGroupLayout: GPUBindGroupLayout
    get renderInfo_VertexUniformBindGroupLayout(): GPUBindGroupLayout {
        return this.#renderInfo_VertexUniformBindGroupLayout;
    }

    #renderInfo_pipeline_VertexBuffersInfo
    get renderInfo_pipeline_VertexBuffersInfo() {
        return this.#renderInfo_pipeline_VertexBuffersInfo;
    }

    #renderInfo_VertexUniformBindGroup: GPUBindGroup
    get renderInfo_VertexUniformBindGroup(): GPUBindGroup {
        return this.#renderInfo_VertexUniformBindGroup;
    }

    #renderInfo_VertexUniformBindGroupDescriptor: GPUBindGroupDescriptor

    #renderInfo_pipeline: MeshPipeline
    get renderInfo_pipeline(): MeshPipeline {
        return this.#renderInfo_pipeline;
    }

    ///////////////////////////////////////////////////
    #topology: GPUPrimitiveTopology = 'triangle-list'

    get topology(): GPUPrimitiveTopology {
        return this.#topology;
    }

    set topology(value: GPUPrimitiveTopology) {
        this.#topology = value;
        this.dirtyPipeline = true
    }

    #cullMode: GPUCullMode = 'none'
    get cullMode(): GPUCullMode {
        return this.#cullMode;
    }

    set cullMode(value: GPUCullMode) {
        this.#cullMode = value;
        this.dirtyPipeline = true
    }

    #frontFace: GPUFrontFace = 'ccw'
    get frontFace(): GPUFrontFace {
        return this.#frontFace;
    }

    set frontFace(value: GPUFrontFace) {
        this.#frontFace = value;
        this.dirtyPipeline = true
    }

    #depthWriteEnabled: boolean = true

    get depthWriteEnabled(): boolean {
        return this.#depthWriteEnabled;
    }

    set depthWriteEnabled(value: boolean) {
        this.#depthWriteEnabled = value;
        this.dirtyPipeline = true
    }

    #depthCompare: GPUCompareFunction = 'less-equal'

    get depthCompare(): GPUCompareFunction {
        return this.#depthCompare;
    }

    set depthCompare(value: GPUCompareFunction) {
        this.#depthCompare = value;
        this.dirtyPipeline = true
    }

    #depthStencilFormat: GPUTextureFormat = "depth24plus-stencil8"

    get depthStencilFormat(): GPUTextureFormat {
        return this.#depthStencilFormat;
    }

    set depthStencilFormat(value: GPUTextureFormat) {
        this.#depthStencilFormat = value;
        this.dirtyPipeline = true
    }

///////////////////////////////////////////////////
    #redGPUContext: RedGPUContext

    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }


    constructor(
        redGPUContext: RedGPUContext,
        vertexUniformBufferDescriptor: UniformBufferDescriptor,
        vertexUniformBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor
    ) {
        super()
        if (!(redGPUContext instanceof RedGPUContext)) throwErrorInstanceOf(this, 'redGPUContext', 'RedGPUContext')
        this.#redGPUContext = redGPUContext
        const {gpuDevice} = redGPUContext
        this.#vertexUniformBuffer = new UniformBufferFloat32(this.redGPUContext, vertexUniformBufferDescriptor)
        this.#renderInfo_VertexUniformBindGroupLayout = gpuDevice.createBindGroupLayout(vertexUniformBindGroupLayoutDescriptor);

    }

    updateVertexUniformBindGroup(renderInfo_VertexUniformBindGroupDescriptor: GPUBindGroupDescriptor) {
        const {gpuDevice} = this.redGPUContext
        // TODO 유니포내용중 텍스쳐 등이 변화하면 업데이트 해야함
        this.#renderInfo_VertexUniformBindGroupDescriptor = renderInfo_VertexUniformBindGroupDescriptor;
        // 모델유니폼
        this.#renderInfo_VertexUniformBindGroup = gpuDevice.createBindGroup(this.#renderInfo_VertexUniformBindGroupDescriptor);

    }

    updatePipeline(targetSystemUniformsBindGroupLayout: GPUBindGroupLayout) {
        // 재질 바인드 그룹이 변경되었나 체크
        if (this.materialBindGroupID !== this.material?.bindGroupID) {
            this.materialBindGroupID = this.material?.bindGroupID
            this.dirtyPipeline = true
        }

        if (this.dirtyPipeline) {

            if (this.material) {
                this.material.updateBindGroup()
            }
            if (this.geometry && this.material) {
                this.#renderInfo_pipeline = new MeshPipeline(this.redGPUContext, this, targetSystemUniformsBindGroupLayout)
            }
            this.dirtyPipeline = false
        }
    }

}

export default BaseObject3DPipeline
