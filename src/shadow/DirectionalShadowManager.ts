import RedGPUContext from "../context/RedGPUContext";
import InstancingMesh from "../display/instancingMesh/InstancingMesh";
import Mesh from "../display/mesh/Mesh";
import validatePositiveNumberRange from "../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../runtimeChecker/validateFunc/validateUintRange";
import calculateTextureByteSize from "../utils/texture/calculateTextureByteSize";

class DirectionalShadowManager {
	#shadowDepthTextureSize: number = 2048
	#bias: number = 0.005
	#shadowDepthTexture: GPUTexture
	#shadowDepthTextureView: GPUTextureView
	#shadowDepthTextureViewEmpty: GPUTextureView
	#redGPUContext: RedGPUContext
	#castingList: (Mesh | InstancingMesh)[] = []
	#videoMemorySize: number = 0
	get videoMemorySize(): number {
		return this.#videoMemorySize;
	}

	get castingList(): (Mesh | InstancingMesh)[] {
		return this.#castingList;
	}

	get shadowDepthTextureView(): GPUTextureView {
		return this.#shadowDepthTextureView;
	}

	get shadowDepthTextureViewEmpty(): GPUTextureView {
		return this.#shadowDepthTextureViewEmpty;
	}

	get bias(): number {
		return this.#bias;
	}

	set bias(value: number) {
		validatePositiveNumberRange(value, 0, 1)
		this.#bias = value;
	}

	get shadowDepthTextureSize(): number {
		return this.#shadowDepthTextureSize;
	}

	set shadowDepthTextureSize(value: number) {
		validateUintRange(value, 1)
		this.#shadowDepthTextureSize = value;
		this.#checkDepthTexture()
	}

	reset() {
		this.destroy()
	}

	resetCastingList() {
		this.#castingList.length = 0
	}

	updateViewSystemUniforms(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext
		this.#checkDepthTexture()
	}

	destroy() {
		if (this.#shadowDepthTexture) {
			this.#shadowDepthTexture.destroy()
			this.#shadowDepthTexture = null
			this.#shadowDepthTextureView = null
		}
	}

	#calcVideoMemory() {
		const texture = this.#shadowDepthTexture
		if (!texture) return 0;
		this.#videoMemorySize = calculateTextureByteSize(texture)
	}

	#checkDepthTexture() {
		if (this.#shadowDepthTexture?.width !== this.#shadowDepthTextureSize) {
			this.destroy()
			this.#createDepthTexture()
			this.#calcVideoMemory()
		}
	}

	#createEmptyDepthTexture(gpuDevice: GPUDevice) {
		const t0 = gpuDevice.createTexture({
			size: [1, 1, 1],
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
			format: 'depth32float',
			label: `DirectionalShadowManager_EmptyDepthTexture_1x1_${Date.now()}`,
		})
		this.#shadowDepthTextureViewEmpty = t0.createView({label: t0.label})
	}

	#createDepthTexture() {
		const {gpuDevice, resourceManager} = this.#redGPUContext
		this.#shadowDepthTexture = resourceManager.createManagedTexture({
			size: [this.#shadowDepthTextureSize, this.#shadowDepthTextureSize, 1],
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
			format: 'depth32float',
			label: `DirectionalShadowManager_shadowDepthTextureSize_${this.#shadowDepthTextureSize}x${this.#shadowDepthTextureSize}_${Date.now()}`,
		});
		this.#shadowDepthTextureView = this.#shadowDepthTexture.createView({label: this.#shadowDepthTexture.label})
		if (!this.#shadowDepthTextureViewEmpty) this.#createEmptyDepthTexture(gpuDevice)
	}
}

Object.freeze(DirectionalShadowManager)
export default DirectionalShadowManager
