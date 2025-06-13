import RedGPUContext from "../context/RedGPUContext";
import InstancingMesh from "../display/instancingMesh/InstancingMesh";
import Mesh from "../display/mesh/Mesh";
import validatePositiveNumberRange from "../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../runtimeChecker/validateFunc/validateUintRange";

class ShadowManager {
    #directionalLightShadowDepthTextureSize: number = 2048
    #directionalLightShadowBias: number = 0.005
    #directionalShadowDepthTexture: GPUTexture
    #directionalShadowDepthTextureView: GPUTextureView
    #directionalShadowDepthTextureViewEmpty: GPUTextureView
    #redGPUContext: RedGPUContext
    #castingList: (Mesh | InstancingMesh)[] = []
    get castingList(): (Mesh | InstancingMesh)[] {
        return this.#castingList;
    }

    get directionalShadowDepthTextureView(): GPUTextureView {
        return this.#directionalShadowDepthTextureView;
    }

    get directionalShadowDepthTextureViewEmpty(): GPUTextureView {
        return this.#directionalShadowDepthTextureViewEmpty;
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
        if (this.#directionalShadowDepthTexture) {
            this.#directionalShadowDepthTexture.destroy()
            this.#directionalShadowDepthTexture = null
            this.#directionalShadowDepthTextureView = null
        }
    }

    #checkDepthTexture() {
        if (this.#directionalShadowDepthTexture?.width !== this.#directionalLightShadowDepthTextureSize) {
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
        this.#directionalShadowDepthTextureViewEmpty = t0.createView({label: t0.label})
    }

    #createDepthTexture() {
        const {gpuDevice} = this.#redGPUContext
        this.#directionalShadowDepthTexture = gpuDevice.createTexture({
            size: [this.#directionalLightShadowDepthTextureSize, this.#directionalLightShadowDepthTextureSize, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: 'depth32float',
            label: `ShadowManager_directionalLightShadowDepthTextureSize_${this.#directionalLightShadowDepthTextureSize}x${this.#directionalLightShadowDepthTextureSize}_${Date.now()}`,
        });
        this.#directionalShadowDepthTextureView = this.#directionalShadowDepthTexture.createView({label: this.#directionalShadowDepthTexture.label})
        if (!this.#directionalShadowDepthTextureViewEmpty) this.#createEmptyDepthTexture(gpuDevice)
    }
}

Object.freeze(ShadowManager)
export default ShadowManager
