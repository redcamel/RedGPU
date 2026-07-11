import RedGPUContext from "../context/RedGPUContext";
import DirectionalShadowManager from "./DirectionalShadowManager";
import View3D from "../display/view/View3D";
import Mesh from "../display/mesh/Mesh";
import createBasePipeline from "../display/mesh/core/pipeline/createBasePipeline";
import PIPELINE_TYPE from "../display/mesh/core/pipeline/PIPELINE_TYPE";
import GPU_STORE_OP from "../gpuConst/GPU_STORE_OP";
import GPU_LOAD_OP from "../gpuConst/GPU_LOAD_OP";
import updateViewportAndScissor from "../renderer/helperFunc/updateViewportAndScissor";
import renderShadowLayer from "../renderer/renderLayers/renderShadowLayer";

/**
 * [KO] 씬의 전체적인 그림자 렌더링을 총괄하는 관리자 클래스입니다.
 * [EN] Manager class that oversees the overall shadow rendering of the scene.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Shadow
 */
class ShadowManager {
    #directionalShadowManager: DirectionalShadowManager = new DirectionalShadowManager()
    #shadowPassDescriptor: GPURenderPassDescriptor

    constructor() {
    }

    /**
     * [KO] 직사광(Directional Light) 섀도우 매니저를 반환합니다.
     * [EN] Returns the DirectionalShadowManager.
     *
     * @returns
     * [KO] DirectionalShadowManager 인스턴스
     * [EN] DirectionalShadowManager instance
     */
    get directionalShadowManager(): DirectionalShadowManager {
        return this.#directionalShadowManager;
    }

    /**
     * [KO] 섀도우 렌더 패스 디스크립터를 반환합니다.
     * [EN] Returns the shadow render pass descriptor.
     *
     * @returns
     * [KO] GPURenderPassDescriptor 객체
     * [EN] GPURenderPassDescriptor object
     */
    get shadowPassDescriptor(): GPURenderPassDescriptor {
        return this.#shadowPassDescriptor
    }

    /**
     * [KO] 그림자 렌더링을 수행합니다.
     * [EN] Performs shadow rendering.
     *
     * @param view -
     * [KO] 대상 View3D
     * [EN] Target View3D
     */
    render(view: View3D) {
        if (this.#directionalShadowManager.castingList.length === 0) return
        const {redGPUContext} = view

        const list = this.#directionalShadowManager.castingList;
        let i = 0;
        const len = list.length;
        for (i; i < len; i++) {
            const target = list[i];
            const {gpuRenderInfo} = target;
            if (gpuRenderInfo && !gpuRenderInfo.shadowPipeline) {
                gpuRenderInfo.shadowPipeline = gpuRenderInfo.vertexStructInfo.vertexEntries.includes('entryPointShadowVertex') ? createBasePipeline(target as Mesh, gpuRenderInfo.vertexShaderModule, gpuRenderInfo.vertexBindGroupLayout, PIPELINE_TYPE.SHADOW) : null
            }
        }

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
            updateViewportAndScissor(view, viewShadowRenderPassEncoder, 'SHADOW')
            if (this.#directionalShadowManager.castingList.length) {
                renderShadowLayer(view, viewShadowRenderPassEncoder)
            }
        });

        this.#directionalShadowManager.resetCastingList()
    }

    /**
     * [KO] 매니저의 상태를 업데이트합니다.
     * [EN] Updates the state of the manager.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    update(redGPUContext: RedGPUContext) {
        this.#directionalShadowManager.update(redGPUContext)
    }

    /**
     * [KO] 사용 중인 그림자 GPU 리소스를 해제합니다.
     * [EN] Releases GPU resources in use for shadow rendering.
     */
    destroy() {
        if (this.#directionalShadowManager) {
            this.#directionalShadowManager.destroy();
            this.#directionalShadowManager = null;
        }
        this.#shadowPassDescriptor = null;
        console.log("🧹 ShadowManager destroy 완료");
    }
}

Object.freeze(ShadowManager)
export default ShadowManager
