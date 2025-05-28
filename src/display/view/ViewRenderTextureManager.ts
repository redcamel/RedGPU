import RedGPUContext from "../../context/RedGPUContext";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import getMipLevelCount from "../../utils/math/getMipLevelCount";
import View3D from "./View3D";

class ViewRenderTextureManager {

	#colorTexture: GPUTexture
	#renderPath1ResultTexture: GPUTexture
	#renderPath1ResultTextureView: GPUTextureView
	#renderPath1ResultTextureDescriptor: GPUTextureDescriptor
	get renderPath1ResultTextureDescriptor(): GPUTextureDescriptor {
		return this.#renderPath1ResultTextureDescriptor;
	}

	#colorResolveTexture: GPUTexture
	#depthTexture: GPUTexture
	#colorTextureView: GPUTextureView
	#colorResolveTextureView: GPUTextureView
	#depthTextureView: GPUTextureView
	//
	#useMSAAColor: boolean = true
	#useMSAADepth: boolean = true
	readonly #redGPUContext: RedGPUContext
	readonly #view: View3D

	constructor(view: View3D) {
		validateRedGPUContext(view.redGPUContext)
		this.#redGPUContext = view.redGPUContext
		this.#view = view
	}

	get colorTexture(): GPUTexture {
		return this.#colorTexture;
	}

	get colorResolveTexture(): GPUTexture {
		return this.#colorResolveTexture;
	}

	get depthTexture(): GPUTexture {
		return this.#depthTexture;
	}

	get depthTextureView(): GPUTextureView {
		this.#createDepthTexture();
		return this.#depthTextureView;
	}

	get colorTextureView(): GPUTextureView {
		this.#createColorTexture();
		return this.#colorTextureView;
	}

	get colorResolveTextureView(): GPUTextureView {
		return this.#colorResolveTextureView;
	}
	get renderPath1ResultTexture(): GPUTexture {
		this.#createRenderPath1ResultTexture();
		return this.#renderPath1ResultTexture;
	}

	get renderPath1ResultTextureView(): GPUTextureView {
		return this.#renderPath1ResultTextureView
	}
	//
	get useMSAAColor(): boolean {
		return this.#useMSAAColor;
	}

	#createRenderPath1ResultTexture() {
		const {resourceManager, gpuDevice} = this.#redGPUContext
		const currentTexture = this.#renderPath1ResultTexture;
		const {pixelRectObject,viewRenderTextureManager} = this.#view
		const {width: pixelRectObjectW, height: pixelRectObjectH} = pixelRectObject
		const changedSize = currentTexture?.width !== pixelRectObjectW || currentTexture?.height !== pixelRectObjectH

		const needCreateTexture = !currentTexture || changedSize
		if (needCreateTexture) {
			if (currentTexture) {
				currentTexture?.destroy()
			}
			this.#renderPath1ResultTextureDescriptor = {
				size: {width: Math.max(1, pixelRectObjectW), height: Math.max(1, pixelRectObjectH), depthOrArrayLayers: 1},
				format: navigator.gpu.getPreferredCanvasFormat(),
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
					| GPUTextureUsage.COPY_SRC,
				mipLevelCount: getMipLevelCount(pixelRectObjectW, pixelRectObjectH)
			}
			this.#renderPath1ResultTexture = gpuDevice.createTexture(this.#renderPath1ResultTextureDescriptor);
			const {mipmapGenerator} = resourceManager
			mipmapGenerator.generateMipmap(this.#renderPath1ResultTexture, viewRenderTextureManager.renderPath1ResultTextureDescriptor)
			this.#renderPath1ResultTextureView = this.#renderPath1ResultTexture.createView()
		}
	}
	#createColorTexture() {
		const {useMSAA, gpuDevice} = this.#redGPUContext
		const currentTexture = this.#colorTexture;
		const {pixelRectObject} = this.#view
		const {width: pixelRectObjectW, height: pixelRectObjectH} = pixelRectObject
		const changedSize = currentTexture?.width !== pixelRectObjectW || currentTexture?.height !== pixelRectObjectH
		const changeUseMSAA = this.#useMSAAColor !== useMSAA
		const needCreateTexture = !currentTexture || changedSize || changeUseMSAA
		this.#useMSAAColor = useMSAA
		if (needCreateTexture) {
			if (currentTexture) {
				currentTexture?.destroy()
				this.#colorResolveTexture?.destroy()
			}
			const newTexture = gpuDevice.createTexture({
				size: [
					Math.max(pixelRectObjectW, 1),
					Math.max(pixelRectObjectH, 1),
					1
				],
				sampleCount: useMSAA ? 4 : 1,
				format: navigator.gpu.getPreferredCanvasFormat(),
				usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
			})
			this.#colorTexture = newTexture;
			this.#colorTextureView = newTexture.createView();
			if (useMSAA) {
				const newResolveTexture = gpuDevice.createTexture({
					size: {
						width: Math.max(pixelRectObjectW, 1),
						height: Math.max(pixelRectObjectH, 1),
						depthOrArrayLayers: 1
					},
					sampleCount: 1,
					format: navigator.gpu.getPreferredCanvasFormat(),
					usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
				})
				this.#colorResolveTexture = newResolveTexture
				this.#colorResolveTextureView = newResolveTexture.createView()
			}
		}
	}

	#createDepthTexture(): void {
		const {useMSAA, gpuDevice} = this.#redGPUContext
		const currentTexture = this.#depthTexture;
		const {pixelRectObject} = this.#view
		const {width: pixelRectObjectW, height: pixelRectObjectH} = pixelRectObject
		const changedSize = currentTexture?.width !== pixelRectObjectW || currentTexture?.height !== pixelRectObjectH
		const changeUseMSAA = this.#useMSAADepth !== useMSAA
		const needCreateTexture = !currentTexture || changedSize || changeUseMSAA
		this.#useMSAAColor = useMSAA
		if (needCreateTexture) {
			if (currentTexture) {
				currentTexture?.destroy()
			}
			const newTexture = gpuDevice.createTexture({
				size: [
					Math.max(pixelRectObjectW, 1),
					Math.max(pixelRectObjectH, 1),
					1
				],
				sampleCount: useMSAA ? 4 : 1,
				format: 'depth24plus',
				usage: GPUTextureUsage.RENDER_ATTACHMENT | 0
			})
			this.#depthTexture = newTexture;
			this.#depthTextureView = newTexture.createView();
		}
	}
}

Object.freeze(ViewRenderTextureManager)
export default ViewRenderTextureManager
