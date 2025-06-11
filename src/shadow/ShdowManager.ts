import RedGPUContext from "../context/RedGPUContext";
import InstancingMesh from "../display/instancingMesh/InstancingMesh";
import Mesh from "../display/mesh/Mesh";
import validatePositiveNumberRange from "../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../runtimeChecker/validateFunc/validateUintRange";

class ShadowManager {
    #directionalLightShadowDepthTextureSize: number = 2048
    #directionalLightShadowBias: number = 0.005
    #shadowDepthGPUTexture: GPUTexture
    #shadowDepthGPUTextureView: GPUTextureView
    #shadowDepthGPUTextureViewEmpty: GPUTextureView
    #redGPUContext: RedGPUContext
    #castingList: (Mesh | InstancingMesh)[] = []
    get castingList(): (Mesh | InstancingMesh)[] {
        return this.#castingList;
    }

    get shadowDepthGPUTextureView(): GPUTextureView {
        return this.#shadowDepthGPUTextureView;
    }

    get shadowDepthGPUTextureViewEmpty(): GPUTextureView {
        return this.#shadowDepthGPUTextureViewEmpty;
    }

    get directionalLightShadowBias(): number {
        return this.#directionalLightShadowBias;
    }

    set directionalLightShadowBias(value: number) {
        validatePositiveNumberRange(value, 0, 1)
        this.#directionalLightShadowBias = value;
    }

    get directionalLightShadowDepthTextureSize(): number {
        return this.#directionalLightShadowDepthTextureSize;
    }

    set directionalLightShadowDepthTextureSize(value: number) {
        validateUintRange(value, 1)
        this.#directionalLightShadowDepthTextureSize = value;
        this.#checkDepthTexture()
    }

    resetCastingList() {
        this.#castingList.length = 0
    }

    updateViewSystemUniforms(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext
        this.#checkDepthTexture()
    }

    destroy() {
        if (this.#shadowDepthGPUTexture) {
            this.#shadowDepthGPUTexture.destroy()
            this.#shadowDepthGPUTexture = null
            this.#shadowDepthGPUTextureView = null
        }
    }

    #checkDepthTexture() {
        if (this.#shadowDepthGPUTexture?.width !== this.#directionalLightShadowDepthTextureSize) {
            this.destroy()
            this.#createDepthTexture()
        }
    }

    #createEmptyDepthTexture(gpuDevice: GPUDevice) {
        const t0 = gpuDevice.createTexture({
            size: [1, 1, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: 'depth32float',
            label: `ShadowManager_EmptyDepthTexture_1x1_${Date.now()}`,
        })
        this.#shadowDepthGPUTextureViewEmpty = t0.createView()
    }

    #createDepthTexture() {
        const {gpuDevice} = this.#redGPUContext
        this.#shadowDepthGPUTexture = gpuDevice.createTexture({
            size: [this.#directionalLightShadowDepthTextureSize, this.#directionalLightShadowDepthTextureSize, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: 'depth32float',
            label: `ShadowManager_directionalLightShadowDepthTextureSize_${this.#directionalLightShadowDepthTextureSize}x${this.#directionalLightShadowDepthTextureSize}_${Date.now()}`,
        });
        this.#shadowDepthGPUTextureView = this.#shadowDepthGPUTexture.createView()
        if (!this.#shadowDepthGPUTextureViewEmpty) this.#createEmptyDepthTexture(gpuDevice)
    }
}

Object.freeze(ShadowManager)
export default ShadowManager
