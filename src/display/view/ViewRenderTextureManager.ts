import RedGPUContext from "../../context/RedGPUContext";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import {keepLog} from "../../utils";
import calculateTextureByteSize from "../../utils/math/calculateTextureByteSize";
import getMipLevelCount from "../../utils/math/getMipLevelCount";
import View3D from "./View3D";

class ViewRenderTextureManager {
	// 렌더 패스 1 결과 텍스처 관련 속성
	#renderPath1ResultTexture: GPUTexture
	#renderPath1ResultTextureView: GPUTextureView
	#renderPath1ResultTextureDescriptor: GPUTextureDescriptor
	// 깊이 텍스처 관련 속성
	#depthTexture: GPUTexture
	#depthTextureView: GPUTextureView
	// 메모리 및 컨텍스트 관련 속성
	#videoMemorySize: number = 0
	readonly #redGPUContext: RedGPUContext
	readonly #view: View3D
	// G-Buffer 관련 속성
	#gBuffers: Map<string, {
		texture: GPUTexture,
		textureView: GPUTextureView,
		resolveTexture: GPUTexture,
		resolveTextureView: GPUTextureView,
		frameIndex: number,
	}> = new Map()
	#gBuffersMSAAState: { [key: string]: boolean } = {}

	constructor(view: View3D) {
		validateRedGPUContext(view.redGPUContext)
		this.#redGPUContext = view.redGPUContext
		this.#view = view
	}

	// 메모리 및 설정 관련 getter
	get videoMemorySize(): number {
		return this.#videoMemorySize;
	}

	get renderPath1ResultTextureDescriptor(): GPUTextureDescriptor {
		return this.#renderPath1ResultTextureDescriptor;
	}

	// 깊이 텍스처 관련 getter
	get depthTexture(): GPUTexture {
		return this.#depthTexture;
	}

	get depthTextureView(): GPUTextureView {
		this.#createDepthTexture();
		return this.#depthTextureView;
	}

	// 렌더 패스 1 텍스처 관련 getter
	get renderPath1ResultTextureView(): GPUTextureView {
		return this.#renderPath1ResultTextureView;
	}

	get renderPath1ResultTexture(): GPUTexture {
		this.#createRender2PathTexture();
		return this.#renderPath1ResultTexture;
	}

	// G-Buffer Color 텍스처 관련 getter
	get gBufferColorTexture(): GPUTexture {
		return this.#gBuffers.get('gBufferColor' + this.#frameIndex)?.texture
	}

	get gBufferColorResolveTexture(): GPUTexture {
		return this.#gBuffers.get('gBufferColor' + this.#frameIndex)?.resolveTexture
	}

	get gBufferColorTextureView(): GPUTextureView {
		this.#createGBuffer('gBufferColor' + this.#frameIndex);
		return this.#gBuffers.get('gBufferColor' + this.#frameIndex)?.textureView
	}

	get gBufferColorResolveTextureView(): GPUTextureView {
		return this.#gBuffers.get('gBufferColor' + this.#frameIndex)?.resolveTextureView
	}

	// G-Buffer Normal 텍스처 관련 getter
	get gBufferNormalTexture(): GPUTexture {
		return this.#gBuffers.get('gBufferNormal')?.texture
	}

	get gBufferNormalResolveTexture(): GPUTexture {
		return this.#gBuffers.get('gBufferNormal')?.resolveTexture
	}

	get gBufferNormalTextureView(): GPUTextureView {
		this.#createGBuffer('gBufferNormal');
		return this.#gBuffers.get('gBufferNormal')?.textureView
	}

	get gBufferNormalResolveTextureView(): GPUTextureView {
		return this.#gBuffers.get('gBufferNormal')?.resolveTextureView
	}

	#gBufferColorHistories: Array<{
		texture: GPUTexture,
		textureView: GPUTextureView,
		resolveTexture: GPUTexture,
		resolveTextureView: GPUTextureView,
		frameIndex: number
	}> = []
	#frameIndex: number = 0

	updateHistory() {
		const currentFrame = this.#gBuffers.get('gBufferColor' + this.#frameIndex)
		if (currentFrame) {
			// 배열 앞쪽에 추가 (0번이 최신 프레임이 되도록)
			this.#gBufferColorHistories.unshift(currentFrame)
		}
		if (this.#gBufferColorHistories.length > 4) {
			const oldFrame = this.#gBufferColorHistories.pop()
		}
		this.#frameIndex++
		this.#frameIndex = this.#frameIndex % 4
		// keepLog(
		// 	this.#gBufferColorHistories[0]?.frameIndex, // 바로 이전 프레임
		// 	this.#gBufferColorHistories[1]?.frameIndex, // 2프레임 전
		// 	this.#gBufferColorHistories[2]?.frameIndex, // 3프레임 전
		// 	this.#gBufferColorHistories[3]?.frameIndex, // 4프레임 전
		// )
	}

	// 비디오 메모리 크기 계산
	#checkVideoMemorySize() {
		const textures = [
			this.#gBuffers.get('gBufferColor' + this.#frameIndex)?.texture,
			this.#gBuffers.get('gBufferColor' + this.#frameIndex)?.resolveTexture,
			this.#depthTexture,
			this.#renderPath1ResultTexture,
			this.#gBuffers.get('gBufferNormal')?.texture,
			this.#gBuffers.get('gBufferNormal')?.resolveTexture,
		].filter(Boolean);
		this.#videoMemorySize = textures.reduce((total, texture) => {
			const videoMemory = calculateTextureByteSize(texture)
			return total + videoMemory
		}, 0)
	}

	// G-Buffer 생성 메서드
	#createGBuffer(type: string) {
		const {antialiasingManager, resourceManager} = this.#redGPUContext
		const {useMSAA} = antialiasingManager
		const targetInfo = this.#gBuffers.get(type)
		const currentTexture = targetInfo?.texture;
		const {pixelRectObject, name} = this.#view
		const {width: pixelRectObjectW, height: pixelRectObjectH} = pixelRectObject
		const changedSize = currentTexture?.width !== pixelRectObjectW || currentTexture?.height !== pixelRectObjectH
		const changeUseMSAA = this.#gBuffersMSAAState[type] !== useMSAA
		const needCreateTexture = !currentTexture || changedSize || changeUseMSAA
		this.#gBuffersMSAAState[type] = useMSAA
		if (needCreateTexture) {
			keepLog(`새 텍스처 생성 중: ${type}`, this.#frameIndex)
			// 기존 텍스처 정리
			if (currentTexture) {
				currentTexture?.destroy()
				targetInfo.texture = null
				targetInfo.textureView = null
				targetInfo.resolveTexture?.destroy()
				targetInfo.resolveTexture = null
				targetInfo.resolveTextureView = null
				this.#gBuffers.delete(type)
			}
			// 새로운 텍스처 정보 객체 생성
			const newInfo = {
				texture: null,
				textureView: null,
				resolveTexture: null,
				resolveTextureView: null,
				frameIndex: this.#frameIndex,
			}
			// 메인 텍스처 생성
			const newTexture = resourceManager.createManagedTexture({
				size: [
					Math.max(pixelRectObjectW, 1),
					Math.max(pixelRectObjectH, 1),
					1
				],
				sampleCount: useMSAA ? 4 : 1,
				label: `${name}_${type}_texture_${this.#frameIndex}_${pixelRectObjectW}x${pixelRectObjectH}`,
				format: navigator.gpu.getPreferredCanvasFormat(),
				usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
			})
			newInfo.texture = newTexture;
			newInfo.textureView = resourceManager.getGPUResourceBitmapTextureView(newTexture);
			// MSAA 사용 시 Resolve 텍스처 생성
			if (useMSAA) {
				const newResolveTexture = resourceManager.createManagedTexture({
					size: {
						width: Math.max(pixelRectObjectW, 1),
						height: Math.max(pixelRectObjectH, 1),
						depthOrArrayLayers: 1
					},
					sampleCount: 1,
					label: `${name}_${type}_resolveTexture_${this.#frameIndex}_${pixelRectObjectW}x${pixelRectObjectH}`,
					format: navigator.gpu.getPreferredCanvasFormat(),
					usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
				})
				newInfo.resolveTexture = newResolveTexture
				newInfo.resolveTextureView = resourceManager.getGPUResourceBitmapTextureView(newResolveTexture)
			}
			this.#gBuffers.set(type, newInfo)
			this.#checkVideoMemorySize()
		}
	}

	// 렌더 패스 2 텍스처 생성 메서드
	#createRender2PathTexture() {
		const {resourceManager} = this.#redGPUContext
		const currentTexture = this.#renderPath1ResultTexture
		const {pixelRectObject, name} = this.#view
		const {width: pixelRectObjectW, height: pixelRectObjectH} = pixelRectObject
		const changedSize = currentTexture?.width !== pixelRectObjectW || currentTexture?.height !== pixelRectObjectH
		const needCreateTexture = !currentTexture || changedSize
		if (needCreateTexture) {
			// 기존 텍스처 정리
			if (currentTexture) {
				currentTexture?.destroy()
				this.#renderPath1ResultTexture = null
				this.#renderPath1ResultTextureView = null
			}
			// 텍스처 디스크립터 생성
			this.#renderPath1ResultTextureDescriptor = {
				size: {
					width: Math.max(1, pixelRectObjectW),
					height: Math.max(1, pixelRectObjectH),
					depthOrArrayLayers: 1
				},
				format: navigator.gpu.getPreferredCanvasFormat(),
				usage: GPUTextureUsage.TEXTURE_BINDING |
					GPUTextureUsage.COPY_DST |
					GPUTextureUsage.RENDER_ATTACHMENT |
					GPUTextureUsage.COPY_SRC,
				mipLevelCount: getMipLevelCount(pixelRectObjectW, pixelRectObjectH),
				label: `${name}_renderPath1ResultTexture_${pixelRectObjectW}x${pixelRectObjectH}`
			}
			// 텍스처 및 텍스처 뷰 생성
			this.#renderPath1ResultTexture = resourceManager.createManagedTexture(this.#renderPath1ResultTextureDescriptor);
			this.#renderPath1ResultTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#renderPath1ResultTexture)
			this.#checkVideoMemorySize()
		}
	}

	// 깊이 텍스처 생성 메서드
	#createDepthTexture(): void {
		const {antialiasingManager, resourceManager} = this.#redGPUContext
		const {useMSAA} = antialiasingManager
		const currentTexture = this.#depthTexture;
		const {pixelRectObject, name} = this.#view
		const {width: pixelRectObjectW, height: pixelRectObjectH} = pixelRectObject
		const changedSize = currentTexture?.width !== pixelRectObjectW || currentTexture?.height !== pixelRectObjectH
		const changeUseMSAA = this.#gBuffersMSAAState['depth'] !== useMSAA
		const needCreateTexture = !currentTexture || changedSize || changeUseMSAA
		this.#gBuffersMSAAState['depth'] = useMSAA
		if (needCreateTexture) {
			// 기존 텍스처 정리
			if (currentTexture) {
				currentTexture?.destroy()
				this.#depthTexture = null
				this.#depthTextureView = null
			}
			// 새로운 깊이 텍스처 생성
			const newTexture = resourceManager.createManagedTexture({
				size: [
					Math.max(pixelRectObjectW, 1),
					Math.max(pixelRectObjectH, 1),
					1
				],
				sampleCount: useMSAA ? 4 : 1,
				label: `${name}_depth_${pixelRectObjectW}x${pixelRectObjectH}`,
				format: 'depth32float',
				usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
			})
			this.#depthTexture = newTexture;
			this.#depthTextureView = resourceManager.getGPUResourceBitmapTextureView(newTexture);
			this.#checkVideoMemorySize()
		}
	}
}

Object.freeze(ViewRenderTextureManager)
export default ViewRenderTextureManager
