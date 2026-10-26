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
import keepLog from "../utils/keepLog";

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
    #directionalShadowManager: DirectionalShadowManager = new DirectionalShadowManager();
    #needsClear: boolean = true;
    #cascadePassDescriptors: GPURenderPassDescriptor[] = [];
    #clearPassDescriptors: GPURenderPassDescriptor[] = [];

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
     * [KO] 그림자 렌더링을 수행합니다.
     * [EN] Performs shadow rendering.
     *
     * @param view -
     * [KO] 대상 View3D
     * [EN] Target View3D
     */
    render(view: View3D) {
        const {redGPUContext, scene} = view;
        const lightManager = scene?.lightManager;
        if (!lightManager || lightManager.directionalLightCount === 0) {
            this.#directionalShadowManager.resetCastingList();
            this.#needsClear = true;
            return;
        }

        const hasCasters = this.#hasAnyShadowCaster(view);

        if (!hasCasters) {
            this.#directionalShadowManager.resetCastingList();
            if (this.#needsClear) {
                this.#clearShadowDepthTextures(view);
                this.#needsClear = false;
            }
            return;
        }

        this.#needsClear = true;

        const list = this.#directionalShadowManager.castingList;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            const target = list[i];
            const {gpuRenderInfo} = target;
            if (gpuRenderInfo && !gpuRenderInfo.shadowPipeline) {
                gpuRenderInfo.shadowPipeline = gpuRenderInfo.vertexStructInfo.vertexEntries.includes('entryPointShadowVertex') ? createBasePipeline(target as Mesh, gpuRenderInfo.vertexShaderModule, gpuRenderInfo.vertexBindGroupLayout, PIPELINE_TYPE.SHADOW) : null
            }
        }

        const cascadeCount = Math.min(4, Math.max(1, this.#directionalShadowManager.cascadeCount || 3));
        const {landscape} = scene;
        const foliageManager = landscape?.foliageManager;
        const grassManager = landscape?.grassManager;

        for (let c = 0; c < cascadeCount; c++) {
            const cascadePassDescriptor = this.#getCascadePassDescriptor(c);

            redGPUContext.commandEncoderManager.addMainRenderPass(cascadePassDescriptor, (viewShadowRenderPassEncoder) => {
                view.currentCascadeIndex = c;
                updateViewportAndScissor(view, viewShadowRenderPassEncoder, 'SHADOW');

                if (this.#directionalShadowManager.castingList.length) {
                    renderShadowLayer(view, viewShadowRenderPassEncoder, c);
                }

                foliageManager?.renderShadow(view, viewShadowRenderPassEncoder);

                if (c <= 1) {
                    grassManager?.renderShadow(view, viewShadowRenderPassEncoder);
                }

                view.currentCascadeIndex = undefined;
            });
        }
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
        this.#cascadePassDescriptors.length = 0;
        this.#clearPassDescriptors.length = 0;
        keepLog("🧹 ShadowManager destroy 완료");
    }

    #getCascadePassDescriptor(c: number): GPURenderPassDescriptor {
        let descriptor = this.#cascadePassDescriptors[c];
        const layerView = this.#directionalShadowManager.getCascadeLayerView(c);
        if (!descriptor) {
            const depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
                view: layerView,
                depthClearValue: 1.0,
                depthLoadOp: GPU_LOAD_OP.CLEAR,
                depthStoreOp: GPU_STORE_OP.STORE,
            };
            descriptor = {
                label: `CSM Cascade ${c} Pass`,
                colorAttachments: [],
                depthStencilAttachment,
            };
            this.#cascadePassDescriptors[c] = descriptor;
        } else if (descriptor.depthStencilAttachment) {
            descriptor.depthStencilAttachment.view = layerView;
        }
        return descriptor;
    }

    #hasAnyShadowCaster(view: View3D): boolean {
        if (this.#directionalShadowManager.castingList.length > 0) return true;

        const scene = view.scene;
        if (!scene) return false;

        const landscape = scene.landscape;
        if (landscape) {
            const foliage = landscape.foliageManager;
            if (foliage && foliage.enabled) {
                const types = foliage.types;
                const typeCount = types.length;
                for (let t = 0; t < typeCount; t++) {
                    if (types[t].castShadow) return true;
                }
            }

            const grass = landscape.grassManager;
            if (grass && grass.enabled) {
                const types = grass.types;
                const typeCount = types.length;
                for (let t = 0; t < typeCount; t++) {
                    if (types[t].castShadow) return true;
                }
            }
        }

        return false;
    }

    #getClearPassDescriptor(c: number): GPURenderPassDescriptor {
        let descriptor = this.#clearPassDescriptors[c];
        const layerView = this.#directionalShadowManager.getCascadeLayerView(c);
        if (!descriptor) {
            const depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
                view: layerView,
                depthClearValue: 1.0,
                depthLoadOp: GPU_LOAD_OP.CLEAR,
                depthStoreOp: GPU_STORE_OP.STORE,
            };
            descriptor = {
                label: `CSM Cascade ${c} Cleanup Clear Pass`,
                colorAttachments: [],
                depthStencilAttachment,
            };
            this.#clearPassDescriptors[c] = descriptor;
        } else if (descriptor.depthStencilAttachment) {
            descriptor.depthStencilAttachment.view = layerView;
        }
        return descriptor;
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
        if (this.#directionalShadowManager.update(redGPUContext)) {
            this.#needsClear = true;
        }
    }

    #clearShadowDepthTextures(view: View3D): void {
        const {redGPUContext} = view;
        const cascadeCount = Math.min(4, Math.max(1, this.#directionalShadowManager.cascadeCount || 3));
        for (let c = 0; c < cascadeCount; c++) {
            const cascadePassDescriptor = this.#getClearPassDescriptor(c);
            redGPUContext.commandEncoderManager.addMainRenderPass(cascadePassDescriptor, () => {
            });
        }
    }
}

Object.freeze(ShadowManager)
export default ShadowManager
