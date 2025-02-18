import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import {getVertexBindGroupLayoutDescriptorFromShaderInfo} from "../../../material";
import Box from "../../../primitive/Box";
import Primitive from "../../../primitive/core/Primitive";
import RenderViewStateData from "../../../renderer/RenderViewStateData";
import VertexGPURenderInfo from "../../../renderInfos/VertexGPURenderInfo";
import DepthStencilState from "../../../renderState/DepthStencilState";
import PrimitiveState from "../../../renderState/PrimitiveState";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import ResourceManager from "../../../resources/resourceManager/ResourceManager";
import CubeTexture from "../../../resources/texture/CubeTexture";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import vertexModuleSource from './shader/vertex.wgsl';
import SkyBoxMaterial from "./SkyBoxMaterial";

const SHADER_INFO = parseWGSL(vertexModuleSource)
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SKYBOX'
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = 'VERTEX_BIND_GROUP_DESCRIPTOR_SKYBOX'
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_SKYBOX'

class SkyBox {
    dirtyPipeline: boolean = true
    modelMatrix = mat4.create()
    gpuRenderInfo: VertexGPURenderInfo
    _geometry: Primitive
    _material: SkyBoxMaterial
    #prevUseMSAA: boolean = true
    readonly #redGPUContext: RedGPUContext
    #primitiveState: PrimitiveState
    #depthStencilState: DepthStencilState

    constructor(redGPUContext: RedGPUContext, cubeTexture: CubeTexture) {
        validateRedGPUContext(redGPUContext)
        this.#redGPUContext = redGPUContext
        this._geometry = new Box(redGPUContext)
        this._material = new SkyBoxMaterial(redGPUContext, cubeTexture)
        this.#primitiveState = new PrimitiveState(this)
        this.#primitiveState.cullMode = GPU_CULL_MODE.NONE
        this.#depthStencilState = new DepthStencilState(this)
        this.#depthStencilState.depthWriteEnabled = false
    }

    render(debugViewRenderState: RenderViewStateData) {
        const {currentRenderPassEncoder,} = debugViewRenderState
        this.#updateMSAAStatus();
        if (!this.gpuRenderInfo) this.#initGPURenderInfos(this.#redGPUContext)
        if (this.dirtyPipeline) {
            this.gpuRenderInfo.pipeline = this.#updatePipeline()
            this.dirtyPipeline = false
            debugViewRenderState.numDirtyPipelines++
        }
        const {gpuRenderInfo} = this
        const {vertexUniformBindGroup, pipeline} = gpuRenderInfo
        const {indexBuffer} = this._geometry
        const {triangleCount, indexNum} = indexBuffer
        currentRenderPassEncoder.setPipeline(pipeline)
        currentRenderPassEncoder.setVertexBuffer(0, this._geometry.vertexBuffer.gpuBuffer)
        currentRenderPassEncoder.setBindGroup(1, vertexUniformBindGroup); // 버텍스 유니폼 버퍼 1번 고정
        currentRenderPassEncoder.setBindGroup(2, this._material.gpuRenderInfo.fragmentUniformBindGroup)
        currentRenderPassEncoder.setIndexBuffer(indexBuffer.gpuBuffer, 'uint32')
        currentRenderPassEncoder.drawIndexed(indexBuffer.indexNum, 1, 0, 0, 0);
        //
        debugViewRenderState.num3DObjects++
        debugViewRenderState.numDrawCalls++
        debugViewRenderState.numTriangles += triangleCount
        debugViewRenderState.numPoints += indexNum
    }

    #updateMSAAStatus() {
        const {useMSAA} = this.#redGPUContext
        if (useMSAA !== this.#prevUseMSAA) {
            this.#prevUseMSAA = useMSAA
            this.dirtyPipeline = true
        }
    }

    #initGPURenderInfos(redGPUContext: RedGPUContext) {
        const {resourceManager,} = this.#redGPUContext
        const vertex_BindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout('SKYBOX_VERTEX_BIND_GROUP_LAYOUT') || resourceManager.createBindGroupLayout(
            'SKYBOX_VERTEX_BIND_GROUP_LAYOUT',
            getVertexBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
        )
        // UniformBuffer
        const vertexUniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength)
        const vertexUniformBuffer: UniformBuffer = new UniformBuffer(redGPUContext, vertexUniformData)
        // modelMatrix
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [10000, 10000, 10000]); 	//TODO 카메라 farClip 받도록 수정
        vertexUniformBuffer.writeBuffer(UNIFORM_STRUCT.members.modelMatrix, this.modelMatrix)
        // GPUBindGroupDescriptor
        const vertexBindGroupDescriptor: GPUBindGroupDescriptor = {
            layout: vertex_BindGroupLayout,
            label: VERTEX_BIND_GROUP_DESCRIPTOR_NAME,
            entries: [{
                binding: 0,
                resource: {
                    buffer: vertexUniformBuffer.gpuBuffer,
                    offset: 0,
                    size: vertexUniformBuffer.size
                },
            }]
        }
        // GPUBindGroup
        const vertexUniformBindGroup: GPUBindGroup = redGPUContext.gpuDevice.createBindGroup(vertexBindGroupDescriptor)
        // 설명자를 이용해 랜더 파이프라인을 생성합니다.
        this.gpuRenderInfo = new VertexGPURenderInfo(
            null,
            UNIFORM_STRUCT,
            vertex_BindGroupLayout,
            vertexUniformBuffer,
            vertexUniformBindGroup,
            this.#updatePipeline(),
        )
    }

    #updatePipeline(): GPURenderPipeline {
        const {resourceManager, gpuDevice,} = this.#redGPUContext
        // 셰이더 모듈 설명자를 생성합니다.
        const vModuleDescriptor: GPUShaderModuleDescriptor = {code: vertexModuleSource}
        const vertexShaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(
            VERTEX_SHADER_MODULE_NAME,
            vModuleDescriptor
        )
        const vertexState: GPUVertexState = {
            module: vertexShaderModule,
            entryPoint: 'main',
            buffers: this._geometry.gpuRenderInfo.buffers
        }
        // BindGroup 레이아웃을 가져온다
        const vertex_BindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout('SKYBOX_VERTEX_BIND_GROUP_LAYOUT') || resourceManager.createBindGroupLayout(
            'SKYBOX_VERTEX_BIND_GROUP_LAYOUT',
            getVertexBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
        )
        const bindGroupLayouts: GPUBindGroupLayout[] = [
            resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
            vertex_BindGroupLayout,
            this._material.gpuRenderInfo.fragmentBindGroupLayout
        ]
        // 파이프라인 레이아웃 설명자를 생성합니다.
        const pipelineLayoutDescriptor: GPUPipelineLayoutDescriptor = {bindGroupLayouts: bindGroupLayouts}
        const pipelineLayout: GPUPipelineLayout = gpuDevice.createPipelineLayout(pipelineLayoutDescriptor);
        // 랜더 파이프라인 설명자를 생성합니다.
        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            label: PIPELINE_DESCRIPTOR_LABEL,
            layout: pipelineLayout,
            vertex: vertexState,
            fragment: this._material.gpuRenderInfo.fragmentState,
            primitive: this.#primitiveState.state,
            depthStencil: this.#depthStencilState.state,
            multisample: {
                count: this.#redGPUContext.useMSAA ? 4 : 1,
            },
        }
        return gpuDevice.createRenderPipeline(pipelineDescriptor)
    }
}

export default SkyBox
