import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import GPU_BLEND_FACTOR from "../../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../../gpuConst/GPU_BLEND_OPERATION";
import GPU_LOAD_OP from "../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../gpuConst/GPU_STORE_OP";
import {
    getFragmentBindGroupLayoutDescriptorFromShaderInfo,
    getVertexBindGroupLayoutDescriptorFromShaderInfo
} from "../../material";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import Sampler from "../../resources/sampler/Sampler";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from './fragment.wgsl'
import vertexModuleSource from './vertex.wgsl'

const VERTEX_SHADER_INFO = parseWGSL(vertexModuleSource)
const FRAGMENT_SHADER_INFO = parseWGSL(fragmentModuleSource)
const VERTEX_UNIFORM_STRUCT = VERTEX_SHADER_INFO.uniforms.vertexUniforms
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_FINAL_RENDER'
const FRAGMENT_SHADER_MODULE_NAME = 'FRAGMENT_MODULE_FINAL_RENDER'
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = 'VERTEX_BIND_GROUP_DESCRIPTOR_FINAL_RENDER'
const FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME = 'FRAGMENT_BIND_GROUP_DESCRIPTOR_FINAL_RENDER'
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_FINAL_RENDER'

/**
 * Class representing the final rendering process.
 * @class
 */
class FinalRender {
	#vertexUniformBuffers: UniformBuffer[] = []
	#vertexUniformBindGroups: GPUBindGroup[] = []
	#vertexBindGroupLayout: GPUBindGroupLayout
	#vertexShader: GPUShaderModule
	#vertexState: GPUVertexState
	//
	#fragmentBindGroupLayout: GPUBindGroupLayout
	#fragmentShader: GPUShaderModule
	#fragmentUniformBindGroups: GPUBindGroup[] = []
	//
	#pipeline: GPURenderPipeline
	//
	#viewSizes: { width; height }[] = []
	#viewGpuTextureViews: GPUTextureView[] = []
	#sampler: Sampler

	constructor() {
	}

	/**
	 * Renders the given list of render passes to the specified canvas.
	 *
	 * @param {RedGPUContext} redGPUContext - The RedGPUContext object.
	 * @param {GPURenderPassDescriptor[]} viewList_renderPassDescriptorList - The list of render passes to be rendered.
	 */
	render(redGPUContext: RedGPUContext, viewList_renderPassDescriptorList: GPURenderPassDescriptor[]) {
		const {sizeManager, gpuDevice, antialiasingManager} = redGPUContext
		const {changedMSAA, useMSAA} = antialiasingManager
		const {pixelRectObject: canvasPixelRectObject} = sizeManager
		const {width: canvasW, height: canvasH} = canvasPixelRectObject
		if (canvasW === 0 || canvasH === 0) return
		//
		const finalRenderPassDesc: GPURenderPassDescriptor = this.#getFinalRenderPassDesc(redGPUContext)
		const finalRenderCommandEnc: GPUCommandEncoder = gpuDevice.createCommandEncoder()
		const finalRenderPassEnc: GPURenderPassEncoder = finalRenderCommandEnc.beginRenderPass(finalRenderPassDesc)
		finalRenderPassEnc.setViewport(0, 0, canvasW, canvasH, 0, 1);
		finalRenderPassEnc.setScissorRect(0, 0, canvasW, canvasH);
		//
		if (!this.#vertexBindGroupLayout || changedMSAA) this.#initGPUDetails(redGPUContext)
		this.#renderViewList(
			redGPUContext,
			finalRenderPassEnc,
			viewList_renderPassDescriptorList.map((v: GPURenderPassDescriptor) => {
				const temp = v.colorAttachments[0]
				return temp.postEffectView || temp.pickingView || temp.resolveTarget || temp.view
			}), canvasW, canvasH,
			useMSAA
		)
		finalRenderPassEnc.end()
		gpuDevice.queue.submit([finalRenderCommandEnc.finish()])
	}

	#renderViewList(
		redGPUContext: RedGPUContext,
		finalRenderPassEnc: GPURenderPassEncoder,
		resultTextureViews: GPUTextureView[],
		canvasW: number, canvasH: number,
		useMSAA: boolean
	) {
		//TODO - 여기도 멀티 샘플링 먹여야 되는지 체크
		const {gpuDevice} = redGPUContext
		resultTextureViews.forEach((gpuTextureView, index) => {
			const targetView = redGPUContext.viewList[index]
			const {x: viewX, y: viewY, width: viewW, height: viewH} = targetView.pixelRectObject
			const projectionMatrix = mat4.create()
			{
				mat4.ortho(projectionMatrix, 0., 1., 0., 1., -1000, 1000);
				mat4.scale(projectionMatrix, projectionMatrix, [1 / (canvasW), 1 / (canvasH), 1]);
				mat4.translate(projectionMatrix, projectionMatrix, [viewW / 2 + viewX, canvasH - viewH / 2 - viewY, 0]);
				mat4.scale(projectionMatrix, projectionMatrix, [viewW / 2, viewH / 2, 1]);
			}
			this.#validateViewGpuDetails(redGPUContext, index)
			const vertexUniformBuffer: UniformBuffer = this.#vertexUniformBuffers[index]
			const vertexUniformBindGroup: GPUBindGroup = this.#vertexUniformBindGroups[index]
			gpuDevice.queue.writeBuffer(
				vertexUniformBuffer.gpuBuffer,
				VERTEX_UNIFORM_STRUCT.members.modelMatrix.uniformOffset,
				new VERTEX_UNIFORM_STRUCT.members.modelMatrix.View(projectionMatrix),
			)
			//
			const needNewBindGroup =
				redGPUContext.antialiasingManager.changedMSAA
				|| !this.#viewSizes[index]
				|| this.#viewSizes[index].width !== viewW
				|| this.#viewSizes[index].height !== viewH
				|| this.#viewGpuTextureViews[index] !== gpuTextureView
			if (needNewBindGroup) {
				//TODO 포스트 이펙트 떄문에 바인드 그룹을 날려야하는건가...
				const fragmentBindGroupDesc: GPUBindGroupDescriptor = {
					layout: this.#fragmentBindGroupLayout,
					label: FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME,
					entries: [
						{binding: 0, resource: this.#sampler.gpuSampler},
						{binding: 1, resource: gpuTextureView}
					]
				}
				//TODO gpuTextureView를 캐싱해서 안변했으면 그대로 쓰는것도 가능해보이는듯
				this.#fragmentUniformBindGroups[index] = gpuDevice.createBindGroup(fragmentBindGroupDesc)
				this.#viewSizes[index] = {width: viewW || 1, height: viewH || 1}
				this.#viewGpuTextureViews[index] = gpuTextureView
			}
			finalRenderPassEnc.setPipeline(this.#getPipeline(redGPUContext))
			finalRenderPassEnc.setBindGroup(0, vertexUniformBindGroup);
			finalRenderPassEnc.setBindGroup(1, this.#fragmentUniformBindGroups[index])
			finalRenderPassEnc.draw(6, 1, 0, 0);
		})
	}

	/**
	 * Initializes GPU details for rendering.
	 * @param {RedGPUContext} redGPUContext - The RedGPUContext object.

	 */
	#initGPUDetails(redGPUContext: RedGPUContext) {
		const {resourceManager,} = redGPUContext
		this.#vertexBindGroupLayout = resourceManager.createBindGroupLayout(
			'FINAL_RENDER_VERTEX_BIND_GROUP_LAYOUT',
			getVertexBindGroupLayoutDescriptorFromShaderInfo(VERTEX_SHADER_INFO, 0)
		)
		this.#vertexShader = resourceManager.createGPUShaderModule(VERTEX_SHADER_MODULE_NAME, {code: vertexModuleSource})
		this.#vertexState = {module: this.#vertexShader, entryPoint: 'main'}
		this.#fragmentShader = resourceManager.createGPUShaderModule(FRAGMENT_SHADER_MODULE_NAME, {code: fragmentModuleSource})
		this.#fragmentBindGroupLayout = resourceManager.createBindGroupLayout(
			'FINAL_RENDER_BIND_GROUP_LAYOUT',
			getFragmentBindGroupLayoutDescriptorFromShaderInfo(FRAGMENT_SHADER_INFO, 1)
		)
		this.#sampler = new Sampler(redGPUContext, {minFilter: 'linear'})
	}

	/**
	 * Validates and sets up the necessary GPU bind groups for a given GPU texture view.
	 *
	 * @param {RedGPUContext} redGPUContext - The RedGPU context.
	 * @param {number} index - The index of the texture view in the bind groups array.
	 */
	#validateViewGpuDetails(redGPUContext: RedGPUContext, index: number) {
		const {gpuDevice} = redGPUContext
		if (!this.#vertexUniformBuffers[index]) {
			const vertexUniformData = new ArrayBuffer(VERTEX_UNIFORM_STRUCT.arrayBufferByteLength)
			const tVUniformBuffer: UniformBuffer = this.#vertexUniformBuffers[index] = new UniformBuffer(
				redGPUContext,
				vertexUniformData,
				`FinalRender_View(${index})_VertexUniform`
			)
			const vertexBindGroupDesc: GPUBindGroupDescriptor = {
				layout: this.#vertexBindGroupLayout,
				label: VERTEX_BIND_GROUP_DESCRIPTOR_NAME,
				entries: [{
					binding: 0,
					resource: {
						buffer: tVUniformBuffer.gpuBuffer,
						offset: 0,
						size: tVUniformBuffer.size
					},
				}]
			}
			this.#vertexUniformBindGroups[index] = gpuDevice.createBindGroup(vertexBindGroupDesc)
		}
	}

	#getFinalRenderPassDesc(redGPUContext: RedGPUContext): GPURenderPassDescriptor {
		const {backgroundColor, gpuContext} = redGPUContext
		const rgbaNormal = backgroundColor.rgbaNormal
		const finalRenderTextureView = gpuContext.getCurrentTexture().createView({label: 'finalRenderTextureView'})
		const colorAttachment: GPURenderPassColorAttachment = {
			view: finalRenderTextureView,
			clearValue: {
				r: rgbaNormal[0] * rgbaNormal[3],
				g: rgbaNormal[1] * rgbaNormal[3],
				b: rgbaNormal[2] * rgbaNormal[3],
				a: rgbaNormal[3]
			},
			loadOp: GPU_LOAD_OP.CLEAR,
			storeOp: GPU_STORE_OP.STORE
		}
		return {
			colorAttachments: [
				colorAttachment
			],
		}
	}

	#getPipeline(redGPUContext: RedGPUContext) {
		if (!this.#pipeline || redGPUContext.antialiasingManager.changedMSAA) {
			const {gpuDevice} = redGPUContext
			const pipelineLayout: GPUPipelineLayout = gpuDevice.createPipelineLayout({
				bindGroupLayouts: [
					this.#vertexBindGroupLayout,
					this.#fragmentBindGroupLayout
				]
			});
			const pipelineDesc: GPURenderPipelineDescriptor = {
				label: PIPELINE_DESCRIPTOR_LABEL,
				layout: pipelineLayout,
				vertex: this.#vertexState,
				fragment: {
					module: this.#fragmentShader,
					entryPoint: 'main',
					targets: [
						{
							format: navigator.gpu.getPreferredCanvasFormat(),
							blend: {
								color: {
									srcFactor: GPU_BLEND_FACTOR.ONE,
									dstFactor: GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA,
									operation: GPU_BLEND_OPERATION.ADD
								},
								alpha: {
									srcFactor: GPU_BLEND_FACTOR.ONE,
									dstFactor: GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA,
									operation: GPU_BLEND_OPERATION.ADD
								}
							}
						}
					]
				}
			}
			this.#pipeline = gpuDevice.createRenderPipeline(pipelineDesc)
		}
		return this.#pipeline
	}
}

export default FinalRender
