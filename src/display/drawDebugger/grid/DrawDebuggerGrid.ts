import {vec3} from "gl-matrix";
import ColorRGBA from "../../../color/ColorRGBA";
import RedGPUContext from "../../../context/RedGPUContext";
import GPU_BLEND_FACTOR from "../../../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../../../gpuConst/GPU_BLEND_OPERATION";
import GPU_COMPARE_FUNCTION from "../../../gpuConst/GPU_COMPARE_FUNCTION";
import {getFragmentBindGroupLayoutDescriptorFromShaderInfo} from "../../../material";
import RenderViewStateData from "../../../renderer/RenderViewStateData";
import BlendState from "../../../renderState/BlendState";
import InterleaveType from "../../../resources/buffer/core/type/InterleaveType";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import InterleavedStruct from "../../../resources/buffer/vertexBuffer/InterleavedStruct";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import ResourceManager from "../../../resources/resourceManager/ResourceManager";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import InstanceIdGenerator from "../../../utils/InstanceIdGenerator";
import shaderSource from './shader.wgsl'

const SHADER_INFO = parseWGSL(shaderSource);
const FRAGMENT_UNIFORM_STRUCT = SHADER_INFO.uniforms.gridArgs;
console.log(SHADER_INFO)
const SHADER_MODULE_NAME = 'VERTEX_MODULE_GRID'
const FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME = 'FRAGMENT_BIND_GROUP_DESCRIPTOR_GRID'
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_GRID'

class DrawDebuggerGrid {
	#vertexBuffer: VertexBuffer
	#indexBuffer: IndexBuffer
	#uniformBuffer: UniformBuffer
	readonly #fragmentBindGroup: GPUBindGroup
	readonly #pipeline: GPURenderPipeline
	readonly #pipelineMSAA: GPURenderPipeline
	#blendColorState: BlendState
	#blendAlphaState: BlendState
	readonly #lineColor: ColorRGBA
	// #baseColor: ColorRGBA
	#size: number = 100
	#instanceId: number
	#name: string
	#lineWidth: number = 1

	constructor(redGPUContext: RedGPUContext) {
		validateRedGPUContext(redGPUContext)
		this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
		const {resourceManager, gpuDevice} = redGPUContext
		const moduleDescriptor: GPUShaderModuleDescriptor = {code: shaderSource}
		const shaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(SHADER_MODULE_NAME, moduleDescriptor)
		this.#blendColorState = new BlendState(this, GPU_BLEND_FACTOR.ONE, GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA, GPU_BLEND_OPERATION.ADD)
		this.#blendAlphaState = new BlendState(this, GPU_BLEND_FACTOR.SRC_ALPHA, GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA, GPU_BLEND_OPERATION.ADD)
		this.#lineColor = new ColorRGBA(128, 128, 128, 1)
		// this.#baseColor = new ColorRGBA(255, 128, 128, 0.5)
		const vertexBindGroupLayout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System)
		const fragmentBindGroupLayout = redGPUContext.resourceManager.getGPUBindGroupLayout('GRID_MATERIAL_BIND_GROUP_LAYOUT') || redGPUContext.resourceManager.createBindGroupLayout(
			'GRID_MATERIAL_BIND_GROUP_LAYOUT',
			getFragmentBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
		)
		this.#setBuffers(redGPUContext)
		this.#fragmentBindGroup = gpuDevice.createBindGroup({
			label: FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME,
			layout: fragmentBindGroupLayout,
			entries: [{
				binding: 0,
				resource: {
					buffer: this.#uniformBuffer.gpuBuffer,
					offset: 0,
					size: this.#uniformBuffer.size
				}
			}]
		});
		const basePipelineDescriptor: GPURenderPipelineDescriptor = {
			label: PIPELINE_DESCRIPTOR_LABEL,
			layout: gpuDevice.createPipelineLayout({
				label: 'DRAW_DEBUGGER_GRID_PIPELINE_LAYOUT',
				bindGroupLayouts: [
					vertexBindGroupLayout,
					fragmentBindGroupLayout,
				]
			}),
			vertex: {
				module: shaderModule,
				entryPoint: 'vertexMain',
				buffers: [{
					arrayStride: this.#vertexBuffer.interleavedStruct.arrayStride,
					attributes: this.#vertexBuffer.interleavedStruct.attributes
				}],
			},
			fragment: {
				module: shaderModule,
				entryPoint: 'fragmentMain',
				targets: [
					{
						format: navigator.gpu.getPreferredCanvasFormat(),
						blend: {
							color: this.#blendColorState.state,
							alpha: this.#blendAlphaState.state
						},
					},
					{
						format: navigator.gpu.getPreferredCanvasFormat(),
						blend: undefined,
					},
					{
						format: 'rgba16float',
						blend: undefined,
					},
				],

			},
			depthStencil: {
				format: 'depth32float',
				depthWriteEnabled: false,
				depthCompare: GPU_COMPARE_FUNCTION.LESS_EQUAL,
			}
		}
		this.#pipeline = gpuDevice.createRenderPipeline(basePipelineDescriptor)
		this.#pipelineMSAA = gpuDevice.createRenderPipeline({
			...basePipelineDescriptor,
			multisample: {
				count: 4
			}
		})
	}

	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	set name(value: string) {
		this.#name = value;
	}

	get size(): number {
		return this.#size;
	}

	set size(value: number) {
		this.#size = value;
	}

	get lineColor(): ColorRGBA {
		return this.#lineColor;
	}

	get lineWidth(): number {
		return this.#lineWidth;
	}

	set lineWidth(value: number) {
		validatePositiveNumberRange(value)
		this.#lineWidth = value;
	}

	render(debugViewRenderState: RenderViewStateData) {
		const {view, currentRenderPassEncoder} = debugViewRenderState
		const position = vec3.create()
		vec3.set(position, view.rawCamera.x, view.rawCamera.y, view.rawCamera.z)
		const distance = vec3.distance(position, [0, 0, 0])
		const size = this.#size
		debugViewRenderState.num3DObjects++
		debugViewRenderState.numDrawCalls++
		// const lineWidth = size / view.pixelRectObject.height * diatance / size * this.#lineWidth
		const lineWidth = 1 / view.pixelRectObject.width * distance * this.#lineWidth
		this.#uniformBuffer.writeBuffers([
			[FRAGMENT_UNIFORM_STRUCT.members.lineColor, this.#lineColor.rgbaNormal],
			// [FRAGMENT_UNIFORM_STRUCT2.uniforms.baseColor, this.#baseColor.rgbaNormal],
			[FRAGMENT_UNIFORM_STRUCT.members.lineWidth, [lineWidth, lineWidth]],
			[FRAGMENT_UNIFORM_STRUCT.members.size, size],
			[FRAGMENT_UNIFORM_STRUCT.members.distance, distance],
		])
		const vertexData = [
			// x   y   z     u  v
			-size / 2, -0, -size / 2, 0, 0,
			size / 2, -0, -size / 2, size, 0,
			-size / 2, -0, size / 2, 0, size,
			size / 2, -0, size / 2, size, size,
		]
		this.#vertexBuffer.changeData(vertexData)
		if (this.#pipeline) {
			const {triangleCount, indexNum} = this.#indexBuffer
			currentRenderPassEncoder.setPipeline(view.redGPUContext.antialiasingManager.useMSAA ? this.#pipelineMSAA : this.#pipeline);
			currentRenderPassEncoder.setBindGroup(1, this.#fragmentBindGroup);
			currentRenderPassEncoder.setVertexBuffer(0, this.#vertexBuffer.gpuBuffer);
			currentRenderPassEncoder.setIndexBuffer(this.#indexBuffer.gpuBuffer, 'uint32');
			currentRenderPassEncoder.drawIndexed(6);
			debugViewRenderState.numTriangles += triangleCount
			debugViewRenderState.numPoints += indexNum
		}
	}

	#setBuffers(redGPUContext: RedGPUContext) {
		const size = this.#size
		const {resourceManager} = redGPUContext
		const {cachedBufferState} = resourceManager
		{
			const uniqueKey = `VertexBuffer_Grid`;
			const vertexBuffer = cachedBufferState[uniqueKey]
			const vertexData = [
				// x   y   z     u  v
				-size, -0, -size, 0, 0,
				size, -0, -size, size, 0,
				-size, -0, size, 0, size,
				size, -0, size, size, size,
			]
			cachedBufferState[uniqueKey] = this.#vertexBuffer = vertexBuffer || new VertexBuffer(
				redGPUContext,
				vertexData,
				new InterleavedStruct({
						position: InterleaveType.float32x3,
						uv: InterleaveType.float32x2,
					}
				),
				undefined,
				uniqueKey
			)
		}
		{
			const uniqueKey = `IndexBuffer_Grid`;
			const indexBuffer = cachedBufferState[uniqueKey]
			const indexData = [
				0, 1, 2,
				1, 2, 3
			]
			cachedBufferState[uniqueKey] = this.#indexBuffer = indexBuffer || new IndexBuffer(
				redGPUContext,
				indexData,
				undefined,
				uniqueKey
			)
		}
		{
			const uniqueKey = `UniformBuffer_Grid`;
			const uniformBuffer = cachedBufferState[uniqueKey]
			const uniformData = new ArrayBuffer(FRAGMENT_UNIFORM_STRUCT.arrayBufferByteLength)
			cachedBufferState[uniqueKey] = this.#uniformBuffer = uniformBuffer || new UniformBuffer(redGPUContext, uniformData)
		}
	}
}

export default DrawDebuggerGrid
