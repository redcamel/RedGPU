import validatePositiveNumberRange from "../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../runtimeChecker/validateFunc/validateUintRange";
import calculateTextureByteSize from "../utils/texture/calculateTextureByteSize";
class DirectionalShadowManager {
    #shadowDepthTextureSize = 2048;
    #bias = 0.005;
    #shadowDepthTexture;
    #shadowDepthTextureView;
    #shadowDepthTextureViewEmpty;
    #redGPUContext;
    #castingList = [];
    #videoMemorySize = 0;
    get videoMemorySize() {
        return this.#videoMemorySize;
    }
    get castingList() {
        return this.#castingList;
    }
    get shadowDepthTextureView() {
        return this.#shadowDepthTextureView;
    }
    get shadowDepthTextureViewEmpty() {
        return this.#shadowDepthTextureViewEmpty;
    }
    get bias() {
        return this.#bias;
    }
    set bias(value) {
        validatePositiveNumberRange(value, 0, 1);
        this.#bias = value;
    }
    get shadowDepthTextureSize() {
        return this.#shadowDepthTextureSize;
    }
    set shadowDepthTextureSize(value) {
        validateUintRange(value, 1);
        this.#shadowDepthTextureSize = value;
        this.#checkDepthTexture();
    }
    reset() {
        this.destroy();
    }
    resetCastingList() {
        this.#castingList.length = 0;
    }
    updateViewSystemUniforms(redGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#checkDepthTexture();
    }
    destroy() {
        if (this.#shadowDepthTexture) {
            this.#shadowDepthTexture.destroy();
            this.#shadowDepthTexture = null;
            this.#shadowDepthTextureView = null;
        }
    }
    #calcVideoMemory() {
        const texture = this.#shadowDepthTexture;
        if (!texture)
            return 0;
        this.#videoMemorySize = calculateTextureByteSize(texture);
    }
    #checkDepthTexture() {
        if (this.#shadowDepthTexture?.width !== this.#shadowDepthTextureSize) {
            this.destroy();
            this.#createDepthTexture();
            this.#calcVideoMemory();
        }
    }
    #createEmptyDepthTexture(gpuDevice) {
        const t0 = gpuDevice.createTexture({
            size: [1, 1, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: 'depth32float',
            label: `DirectionalShadowManager_EmptyDepthTexture_1x1_${Date.now()}`,
        });
        this.#shadowDepthTextureViewEmpty = t0.createView({ label: t0.label });
    }
    #createDepthTexture() {
        const { gpuDevice, resourceManager } = this.#redGPUContext;
        this.#shadowDepthTexture = resourceManager.createManagedTexture({
            size: [this.#shadowDepthTextureSize, this.#shadowDepthTextureSize, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: 'depth32float',
            label: `DirectionalShadowManager_shadowDepthTextureSize_${this.#shadowDepthTextureSize}x${this.#shadowDepthTextureSize}_${Date.now()}`,
        });
        this.#shadowDepthTextureView = this.#shadowDepthTexture.createView({ label: this.#shadowDepthTexture.label });
        if (!this.#shadowDepthTextureViewEmpty)
            this.#createEmptyDepthTexture(gpuDevice);
    }
}
Object.freeze(DirectionalShadowManager);
export default DirectionalShadowManager;
