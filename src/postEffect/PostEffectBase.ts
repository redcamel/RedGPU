import RedGPUContext from "../context/RedGPUContext";
import RedGPUContextBase from "../context/RedGPUContextBase";
import makeShaderModule from "../resource/makeShaderModule";
import throwError from "../util/errorFunc/throwError";
import PostEffectManager from "./PostEffectManager";

class PostEffectBase extends RedGPUContextBase {
	uniformsBindGroupLayout: GPUBindGroupLayout
	uniformBindGroup: GPUBindGroup
	pipeline: GPURenderPipeline
	#subPassList: [] = []
	#effectRenderTime: number = 0
	#vShaderModule: GPUShaderModule
	#fShaderModule: GPUShaderModule
	#renderTexture: GPUTexture
	#renderTextureView: GPUTextureView

	constructor(redGPUContext: RedGPUContext, vertexSource: string, fragmentSource: string) {
		super(redGPUContext);
		const {gpuDevice} = this.redGPUContext
		this.#vShaderModule = makeShaderModule(gpuDevice, vertexSource, `vertex_${this.constructor.name}`)
		this.#fShaderModule = makeShaderModule(gpuDevice, fragmentSource, `fragment_${this.constructor.name}`)
	}

	get effectRenderTime(): number {
		return this.#effectRenderTime;
	}

	set effectRenderTime(value: number) {
		this.#effectRenderTime = value;
	}

	get effectRenderTimeString(): string {
		return this.#effectRenderTime.toString().substring(0, 7);
	}

	get subPassList(): [] {
		return this.#subPassList;
	}

	get vShaderModule(): GPUShaderModule {
		return this.#vShaderModule;
	}

	get fShaderModule(): GPUShaderModule {
		return this.#fShaderModule;
	}

	setPipeline(postEffectManager) {
		const {gpuDevice} = this.redGPUContext
		const presentationFormat: GPUTextureFormat = navigator.gpu.getPreferredCanvasFormat();
		const pipeLineDescriptor: GPURenderPipelineDescriptor = {
			// set bindGroupLayouts
			layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [this.uniformsBindGroupLayout]}),
			vertex: {
				module: this.#vShaderModule,
				entryPoint: 'main',
				buffers: [
					{
						arrayStride: postEffectManager.vertexBuffer.arrayStride,
						attributes: postEffectManager.vertexBuffer.attributes.map((v, index) => {
							return {
								// position
								shaderLocation: index,
								offset: v.offset,
								format: v.format
							}
						})
					}
				]
			},
			fragment: {
				module: this.#fShaderModule,
				entryPoint: 'main',
				targets: [
					{
						format: presentationFormat,
						blend: {
							color: {
								srcFactor: "src-alpha",
								dstFactor: "one-minus-src-alpha",
								operation: "add"
							},
							alpha: {
								srcFactor: "one",
								dstFactor: "one-minus-src-alpha",
								operation: "add"
							}
						}
					},
				],
			},
		}
		this.pipeline = gpuDevice.createRenderPipeline(pipeLineDescriptor);
	}

	getRenderInfo(postEffectManager: PostEffectManager) {
		const redGPUContext = this.redGPUContext
		const {gpuDevice} = redGPUContext
		const {view} = postEffectManager
		const {pixelViewRectInt} = view
		if (this.#renderTexture) {
			if (
				this.#renderTexture.width !== pixelViewRectInt[2]
				|| this.#renderTexture.height !== pixelViewRectInt[3]
			) {
				this.#renderTexture.destroy()
				this.#renderTexture = null
			}
		}
		this.#renderTexture = gpuDevice.createTexture({
			label: `${this.constructor.name}_texture`,
			size: {
				width: pixelViewRectInt[2],
				height: pixelViewRectInt[3],
				depthOrArrayLayers: 1
			},
			sampleCount: 1,
			format: navigator.gpu.getPreferredCanvasFormat(),
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
		})
		this.#renderTextureView = this.#renderTexture.createView();
		const renderPassDescriptor: GPURenderPassDescriptor = {
			/**
			 * @typedef {GPURenderPassColorAttachment}
			 */
			colorAttachments: [
				{
					view: this.#renderTextureView,
					clearValue: {r: 0.0, g: 0.0, b: 0.0, a: 0.0},
					loadOp: 'clear',
					storeOp: 'store',
				},
			]
		};
		return {
			texture: this.#renderTexture,
			textureView: this.#renderTextureView,
			renderPassDescriptor
		}
	}

	render(postEffectManager: PostEffectManager, sourceTextureView: GPUTextureView): GPUTextureView {
		throwError('Must Override')
		return
	}
}

export default PostEffectBase
