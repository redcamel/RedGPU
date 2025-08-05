import RedGPUContext from "../../context/RedGPUContext";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import calculateTextureByteSize from "../../utils/math/calculateTextureByteSize";
import getMipLevelCount from "../../utils/math/getMipLevelCount";
import View3D from "./View3D";

class ViewRenderTextureManager {
	#colorTexture: GPUTexture
	#renderPath1ResultTexture: GPUTexture
	#renderPath1ResultTextureView: GPUTextureView
	#renderPath1ResultTextureDescriptor: GPUTextureDescriptor
	#colorResolveTexture: GPUTexture
	#depthTexture: GPUTexture
	#colorTextureView: GPUTextureView
	#colorResolveTextureView: GPUTextureView
	#depthTextureView: GPUTextureView
	//
	#useMSAAColor: boolean = true
	#useMSAADepth: boolean = true
	#videoMemorySize: number = 0
	readonly #redGPUContext: RedGPUContext
	readonly #view: View3D

	constructor(view: View3D) {
		validateRedGPUContext(view.redGPUContext)
		this.#redGPUContext = view.redGPUContext
		this.#view = view
	}

	get videoMemorySize(): number {
		return this.#videoMemorySize;
	}

	get renderPath1ResultTextureDescriptor(): GPUTextureDescriptor {
		return this.#renderPath1ResultTextureDescriptor;
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

	#checkVideoMemorySize() {
		const textures = [
			this.#colorTexture, this.#depthTexture, this.#colorResolveTexture, this.#renderPath1ResultTexture
		].filter(Boolean);
		this.#videoMemorySize = textures.reduce((total, texture) => {
				const videoMemory = calculateTextureByteSize(texture)
				return total + videoMemory
			}, 0
		)
	}

	#createRender2PathTexture() {
		const {gpuDevice, resourceManager} = this.#redGPUContext
		const currentTexture = this.#renderPath1ResultTexture
		const {pixelRectObject, name} = this.#view
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
				mipLevelCount: getMipLevelCount(pixelRectObjectW, pixelRectObjectH),
				label: `${name}_renderPath1ResultTexture_${pixelRectObjectW}x${pixelRectObjectH}`
			}
			this.#renderPath1ResultTexture = resourceManager.createManagedTexture(this.#renderPath1ResultTextureDescriptor);
			this.#renderPath1ResultTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#renderPath1ResultTexture)
			this.#checkVideoMemorySize()
		}
	}

	#createTextureIfNeeded(textureType: 'depth' | 'color'): void {
		const depthYn = textureType === 'depth'
		const {antialiasingManager, gpuDevice, resourceManager} = this.#redGPUContext
		const {useMSAA} = antialiasingManager
		const currentTexture = depthYn ? this.#depthTexture : this.#colorTexture;
		const {pixelRectObject, name} = this.#view
		const {width: pixelRectObjectW, height: pixelRectObjectH} = pixelRectObject
		const changedSize = currentTexture?.width !== pixelRectObjectW || currentTexture?.height !== pixelRectObjectH
		const changeUseMSAA = depthYn ? this.#useMSAADepth !== useMSAA : this.#useMSAAColor !== useMSAA
		const needCreateTexture = !currentTexture || changedSize || changeUseMSAA
		if (depthYn) this.#useMSAADepth = useMSAA
		else this.#useMSAAColor = useMSAA
		if (needCreateTexture) {
			if (currentTexture) {
				currentTexture?.destroy()
				if (depthYn) {
					this.#depthTexture = null
					this.#depthTextureView = null
				} else {
					this.#colorResolveTexture?.destroy()
					this.#colorTexture = null
					this.#colorTextureView = null
					this.#colorResolveTexture = null
					this.#colorResolveTextureView = null
				}
			}
			const newTexture = resourceManager.createManagedTexture({
				size: [
					Math.max(pixelRectObjectW, 1),
					Math.max(pixelRectObjectH, 1),
					1
				],
				sampleCount: useMSAA ? 4 : 1,
				label: `${name}_${textureType}_${pixelRectObjectW}x${pixelRectObjectH}`,
				format: depthYn ? 'depth32float' : navigator.gpu.getPreferredCanvasFormat(),
				// usage: GPUTextureUsage.RENDER_ATTACHMENT | (textureType === 'color' ? GPUTextureUsage.TEXTURE_BINDING : 0)
				usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | (!depthYn && !useMSAA ? GPUTextureUsage.COPY_SRC : 0)
			})
			if (depthYn) {
				this.#depthTexture = newTexture;
				this.#depthTextureView = resourceManager.getGPUResourceBitmapTextureView(newTexture);
			} else {
				this.#colorTexture = newTexture;
				this.#colorTextureView = resourceManager.getGPUResourceBitmapTextureView(newTexture);
				if (useMSAA) {
					const newResolveTexture = resourceManager.createManagedTexture({
						size: {
							width: Math.max(pixelRectObjectW, 1),
							height: Math.max(pixelRectObjectH, 1),
							depthOrArrayLayers: 1
						},
						sampleCount: 1,
						label: `${name}_${textureType}_resolve_${pixelRectObjectW}x${pixelRectObjectH}`,
						format: navigator.gpu.getPreferredCanvasFormat(),
						usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
					})
					this.#colorResolveTexture = newResolveTexture
					this.#colorResolveTextureView = resourceManager.getGPUResourceBitmapTextureView(newResolveTexture)
				}
			}
			this.#checkVideoMemorySize()
		}
	}
}

Object.freeze(ViewRenderTextureManager)
export default ViewRenderTextureManager
