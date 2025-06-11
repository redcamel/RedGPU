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
		this.#createTextureIfNeeded('depth');
		return this.#depthTextureView;
	}

	get colorTextureView(): GPUTextureView {
		this.#createTextureIfNeeded('color');
		return this.#colorTextureView;
	}

	get colorResolveTextureView(): GPUTextureView {
		return this.#colorResolveTextureView;
	}

	get renderPath1ResultTextureView(): GPUTextureView {
		return this.#renderPath1ResultTextureView;
	}

	get renderPath1ResultTexture(): GPUTexture {
		this.#createRender2PathTexture();
		return this.#renderPath1ResultTexture;
	}

	#createRender2PathTexture() {
		const {gpuDevice} = this.#redGPUContext
		const currentTexture = this.#renderPath1ResultTexture
		const {pixelRectObject} = this.#view
		const {width: pixelRectObjectW, height: pixelRectObjectH} = pixelRectObject
		const changedSize = currentTexture?.width !== pixelRectObjectW || currentTexture?.height !== pixelRectObjectH
		const needCreateTexture = !currentTexture || changedSize
		if (needCreateTexture) {
			if (currentTexture) {
				currentTexture?.destroy()
				this.#renderPath1ResultTexture = null
				this.#renderPath1ResultTextureView = null
			}
			this.#renderPath1ResultTextureDescriptor = {
				size: {width: Math.max(1, pixelRectObjectW), height: Math.max(1, pixelRectObjectH), depthOrArrayLayers: 1},
				format: navigator.gpu.getPreferredCanvasFormat(),
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
					| GPUTextureUsage.COPY_SRC,
				mipLevelCount: getMipLevelCount(pixelRectObjectW, pixelRectObjectH)
			}
			this.#renderPath1ResultTexture = gpuDevice.createTexture(this.#renderPath1ResultTextureDescriptor);
			this.#renderPath1ResultTextureView = this.#renderPath1ResultTexture.createView()
		}
	}

	#createTextureIfNeeded(textureType: 'depth' | 'color'): void {
		const depthYn = textureType === 'depth'
		const {useMSAA, gpuDevice} = this.#redGPUContext
		const currentTexture = depthYn ? this.#depthTexture : this.#colorTexture;
		const {pixelRectObject} = this.#view
		const {width: pixelRectObjectW, height: pixelRectObjectH} = pixelRectObject
		const changedSize = currentTexture?.width !== pixelRectObjectW || currentTexture?.height !== pixelRectObjectH
		const changeUseMSAA = depthYn ? this.#useMSAADepth !== useMSAA : this.#useMSAAColor !== useMSAA
		const needCreateTexture = !currentTexture || changedSize || changeUseMSAA
		if (depthYn) this.#useMSAADepth = useMSAA
		else this.#useMSAAColor = useMSAA
		if (needCreateTexture) {
			if (currentTexture) {
				currentTexture?.destroy()
				if (!depthYn) {
					this.#colorResolveTexture?.destroy()
					this.#colorResolveTexture = null
					this.#colorResolveTextureView = null
				}
			}
			const newTexture = gpuDevice.createTexture({
				size: [
					Math.max(pixelRectObjectW, 1),
					Math.max(pixelRectObjectH, 1),
					1
				],
				sampleCount: useMSAA ? 4 : 1,
				label: `${textureType}_${pixelRectObjectW}x${pixelRectObjectH}_${Date.now()}`,
				format: depthYn ? 'depth32float' : navigator.gpu.getPreferredCanvasFormat(),
				// usage: GPUTextureUsage.RENDER_ATTACHMENT | (textureType === 'color' ? GPUTextureUsage.TEXTURE_BINDING : 0)
				usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | (!depthYn && !useMSAA ? GPUTextureUsage.COPY_SRC : 0)
			})
			if (depthYn) {
				this.#depthTexture = newTexture;
				this.#depthTextureView = newTexture.createView();
			} else {
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
						label: `${textureType}_resolve_${pixelRectObjectW}x${pixelRectObjectH}_${Date.now()}`,
						format: navigator.gpu.getPreferredCanvasFormat(),
						usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
					})
					this.#colorResolveTexture = newResolveTexture
					this.#colorResolveTextureView = newResolveTexture.createView()
				}
			}
		}
	}
}

Object.freeze(ViewRenderTextureManager)
export default ViewRenderTextureManager
