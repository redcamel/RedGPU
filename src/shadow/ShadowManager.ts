import RedGPUContext from "../context/RedGPUContext";
import DirectionalShadowManager from "./DirectionalShadowManager";
import View3D from "../display/view/View3D";
import GPU_STORE_OP from "../gpuConst/GPU_STORE_OP";
import GPU_LOAD_OP from "../gpuConst/GPU_LOAD_OP";

class ShadowManager {
    #directionalShadowManager: DirectionalShadowManager = new DirectionalShadowManager()
    #shadowPassDescriptor: GPURenderPassDescriptor
    constructor() {
    }

    get directionalShadowManager(): DirectionalShadowManager {
        return this.#directionalShadowManager;
    }
    prepareRender(view: View3D) {
        this.#shadowPassDescriptor = {
            label: `${view.name} Shadow Render Pass`,
                colorAttachments: [],
            depthStencilAttachment: {
            view: this.#directionalShadowManager.shadowDepthTextureView,
                depthClearValue: 1.0,
                depthLoadOp: GPU_LOAD_OP.CLEAR,
                depthStoreOp: GPU_STORE_OP.STORE,
        },
        }
    }
    get shadowPassDescriptor(): GPURenderPassDescriptor {
        return this.#shadowPassDescriptor
    }

    update(redGPUContext: RedGPUContext) {
        this.#directionalShadowManager.update(redGPUContext)
    }
}

Object.freeze(ShadowManager)
export default ShadowManager
