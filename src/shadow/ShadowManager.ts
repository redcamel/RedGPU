import RedGPUContext from "../context/RedGPUContext";
import DirectionalShadowManager from "./DirectionalShadowManager";
import View3D from "../display/view/View3D";
import GPU_STORE_OP from "../gpuConst/GPU_STORE_OP";
import GPU_LOAD_OP from "../gpuConst/GPU_LOAD_OP";
import updateViewportAndScissor from "../renderer/helperFunc/updateViewportAndScissor";
import renderShadowLayer from "../renderer/renderLayers/renderShadowLayer";

class ShadowManager {
    #directionalShadowManager: DirectionalShadowManager = new DirectionalShadowManager()
    #shadowPassDescriptor: GPURenderPassDescriptor

    constructor() {
    }

    get directionalShadowManager(): DirectionalShadowManager {
        return this.#directionalShadowManager;
    }

    get shadowPassDescriptor(): GPURenderPassDescriptor {
        return this.#shadowPassDescriptor
    }

    render(view: View3D) {
        if(this.#directionalShadowManager.castingList.length === 0) return
        const {redGPUContext} = view

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
        redGPUContext.commandEncoderManager.addMainRenderPass(this.shadowPassDescriptor, (viewShadowRenderPassEncoder) => {
            updateViewportAndScissor(view, viewShadowRenderPassEncoder, true)
            if (this.#directionalShadowManager.castingList.length) {
                renderShadowLayer(view, viewShadowRenderPassEncoder)
            }
        });

        this.#directionalShadowManager.resetCastingList()
    }

    //TODO update 함수를 숨길수있는지 확인해봐야함
    update(redGPUContext: RedGPUContext) {
        this.#directionalShadowManager.update(redGPUContext)
    }
}

Object.freeze(ShadowManager)
export default ShadowManager
