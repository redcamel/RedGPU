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
import HDRTexture from "../../../resources/texture/hdr/HDRTexture";
import ANoiseTexture from "../../../resources/texture/noiseTexture/core/ANoiseTexture";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import {keepLog} from "../../../utils";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import vertexModuleSource from './shader/vertex.wgsl';
import SkyBoxMaterial from "./SkyBoxMaterial";

const SHADER_INFO = parseWGSL(vertexModuleSource)
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SKYBOX'
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = 'VERTEX_BIND_GROUP_DESCRIPTOR_SKYBOX'
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_SKYBOX'

class SkyBox {
	#dirtyPipeline: boolean = true
	modelMatrix = mat4.create()
	gpuRenderInfo: VertexGPURenderInfo
	#geometry: Primitive
	#material: SkyBoxMaterial
	#redGPUContext: RedGPUContext
	#primitiveState: PrimitiveState
	#depthStencilState: DepthStencilState
	#skyboxTexture: CubeTexture | HDRTexture
	#transitionTexture: CubeTexture | HDRTexture
	#transitionStartTime: number = 0
	#transitionDuration:number=0
	#transitionElapsed:number=0
	constructor(redGPUContext: RedGPUContext, cubeTexture: CubeTexture | HDRTexture) {
		validateRedGPUContext(redGPUContext)
		this.#redGPUContext = redGPUContext
		this.#geometry = new Box(redGPUContext)
		this.#skyboxTexture = cubeTexture
		this.#material = new SkyBoxMaterial(redGPUContext, this.#skyboxTexture)
		this.#primitiveState = new PrimitiveState(this)
		this.#primitiveState.cullMode = GPU_CULL_MODE.NONE
		this.#depthStencilState = new DepthStencilState(this)
		this.#depthStencilState.depthWriteEnabled = false
	}


	get transitionDuration(): number {
		return this.#transitionDuration;
	}


	get transitionElapsed(): number {
		return this.#transitionElapsed;
	}

	get transitionProgress(): number {
		return this.#material.transitionProgress;
	}

	get blur(): number {
		return this.#material.blur;
	}

	set blur(value: number) {
		validatePositiveNumberRange(1, 0, 1)
		this.#material.blur = value;
	}

	get exposure(): number {
		if(this.#skyboxTexture instanceof HDRTexture)	{
			return this.#skyboxTexture.exposure;
		}
		return 1
	}

	set exposure(value: number) {
		validatePositiveNumberRange(1)
		if(this.#skyboxTexture instanceof HDRTexture)	this.#skyboxTexture.exposure = value;
	}


	get opacity(): number {
		return this.#material.opacity;
	}

	set opacity(value: number) {
		validatePositiveNumberRange(1, 0, 1)
		this.#material.opacity = value;
	}

	get skyboxTexture(): CubeTexture | HDRTexture {
		return this.#skyboxTexture
	}

	set skyboxTexture(texture: CubeTexture | HDRTexture) {
		if (!texture) {
			consoleAndThrowError('SkyBox requires a valid CubeTexture | HDRTexture')
		} else {
			this.#skyboxTexture = texture
			this.#material.skyboxTexture = texture
		}
	}
	get transitionTexture(): CubeTexture | HDRTexture {
		return this.#transitionTexture
	}


	transition(transitionTexture:CubeTexture|HDRTexture,duration:number=300,transitionAlphaTexture:ANoiseTexture) {
		this.#transitionTexture = transitionTexture
		this.#material.transitionTexture = transitionTexture
		this.#transitionDuration = duration
		this.#transitionStartTime = performance.now()
		this.#material.transitionAlphaTexture = transitionAlphaTexture
	}
	render(debugViewRenderState: RenderViewStateData) {
		const {currentRenderPassEncoder,startTime} = debugViewRenderState
		this.#updateMSAAStatus();
		if (!this.gpuRenderInfo) this.#initGPURenderInfos(this.#redGPUContext)
		if (this.#dirtyPipeline) {
			this.gpuRenderInfo.pipeline = this.#updatePipeline()
			this.#dirtyPipeline = false
			debugViewRenderState.numDirtyPipelines++
		}

		if(this.#transitionStartTime) {
			this.#transitionElapsed = Math.max(startTime - this.#transitionStartTime, 0)
			if(this.#transitionElapsed > this.#transitionDuration) {
				this.#transitionStartTime = 0
				this.#material.transitionProgress = 0
				this.skyboxTexture = this.#transitionTexture
				this.#material.transitionTexture = null
				this.#dirtyPipeline = true
			}else{
				const value = this.#transitionElapsed / this.#transitionDuration
				this.#material.transitionProgress = value < 0 ? 0 : value > 1 ? 1 : value
			}
		}

		const {gpuRenderInfo} = this
		const {vertexUniformBindGroup, pipeline} = gpuRenderInfo
		const {indexBuffer} = this.#geometry
		const {triangleCount, indexNum} = indexBuffer
		currentRenderPassEncoder.setPipeline(pipeline)
		currentRenderPassEncoder.setVertexBuffer(0, this.#geometry.vertexBuffer.gpuBuffer)
		currentRenderPassEncoder.setBindGroup(1, vertexUniformBindGroup); // 버텍스 유니폼 버퍼 1번 고정
		currentRenderPassEncoder.setBindGroup(2, this.#material.gpuRenderInfo.fragmentUniformBindGroup)
		currentRenderPassEncoder.setIndexBuffer(indexBuffer.gpuBuffer, 'uint32')
		currentRenderPassEncoder.drawIndexed(indexBuffer.indexNum, 1, 0, 0, 0);
		//
		debugViewRenderState.num3DObjects++
		debugViewRenderState.numDrawCalls++
		debugViewRenderState.numTriangles += triangleCount
		debugViewRenderState.numPoints += indexNum
	}

	#updateMSAAStatus() {
		const {changedMSAA} = this.#redGPUContext.antialiasingManager
		if (changedMSAA) {
			this.#dirtyPipeline = true
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
		const vertexUniformBindGroup: GPUBindGroup = redGPUContext.gpuDevice.createBindGroup(vertexBindGroupDescriptor)
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
		const {resourceManager, gpuDevice, antialiasingManager} = this.#redGPUContext
		// 셰이더 모듈 설명자를 생성합니다.
		const vModuleDescriptor: GPUShaderModuleDescriptor = {code: vertexModuleSource}
		const vertexShaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(
			VERTEX_SHADER_MODULE_NAME,
			vModuleDescriptor
		)
		const vertexState: GPUVertexState = {
			module: vertexShaderModule,
			entryPoint: 'main',
			buffers: this.#geometry.gpuRenderInfo.buffers
		}
		// BindGroup 레이아웃을 가져온다
		const vertex_BindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout('SKYBOX_VERTEX_BIND_GROUP_LAYOUT') || resourceManager.createBindGroupLayout(
			'SKYBOX_VERTEX_BIND_GROUP_LAYOUT',
			getVertexBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
		)
		const bindGroupLayouts: GPUBindGroupLayout[] = [
			resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
			vertex_BindGroupLayout,
			this.#material.gpuRenderInfo.fragmentBindGroupLayout
		]
		const pipelineLayoutDescriptor: GPUPipelineLayoutDescriptor = {bindGroupLayouts: bindGroupLayouts}
		const pipelineLayout: GPUPipelineLayout = gpuDevice.createPipelineLayout(pipelineLayoutDescriptor);
		const pipelineDescriptor: GPURenderPipelineDescriptor = {
			label: PIPELINE_DESCRIPTOR_LABEL,
			layout: pipelineLayout,
			vertex: vertexState,
			fragment: this.#material.gpuRenderInfo.fragmentState,
			primitive: this.#primitiveState.state,
			depthStencil: this.#depthStencilState.state,
			multisample: {
				count: antialiasingManager.useMSAA ? 4 : 1,
			},
		}
		return gpuDevice.createRenderPipeline(pipelineDescriptor)
	}
}

export default SkyBox
