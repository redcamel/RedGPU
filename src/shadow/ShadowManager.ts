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
import {renderLandscapeShadowLayer} from "../renderer/renderLayers/renderLandscapeLayer";
import {renderFoliageShadowLayer} from "../renderer/renderLayers/renderFoliageLayer";
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
                // 최초 1회 또는 캐스터가 꺼진 첫 프레임: 뎁스 텍스처를 1.0으로 초기화하여 잔상/아티팩트 방지
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
        for (let c = 0; c < cascadeCount; c++) {
            const cascadePassDescriptor: GPURenderPassDescriptor = {
                label: `${view.name} CSM Cascade ${c} Pass`,
                colorAttachments: [],
                depthStencilAttachment: {
                    view: this.#directionalShadowManager.getCascadeLayerView(c),
                    depthClearValue: 1.0,
                    depthLoadOp: GPU_LOAD_OP.CLEAR,
                    depthStoreOp: GPU_STORE_OP.STORE,
                },
            };
            redGPUContext.commandEncoderManager.addMainRenderPass(cascadePassDescriptor, (viewShadowRenderPassEncoder) => {
                view.currentCascadeIndex = c;
                updateViewportAndScissor(view, viewShadowRenderPassEncoder, 'SHADOW');
                renderLandscapeShadowLayer(view, viewShadowRenderPassEncoder);
                if (this.#directionalShadowManager.castingList.length) {
                    renderShadowLayer(view, viewShadowRenderPassEncoder);
                }
                renderFoliageShadowLayer(view, viewShadowRenderPassEncoder);
                view.currentCascadeIndex = undefined;
            });
        }

        this.#directionalShadowManager.resetCastingList()
    }

    /**
     * [KO] 현재 씬 내에 그림자를 투영할 대상(Mesh, Landscape, Foliage)이 하나라도 존재하는지 빠르게 검사합니다 (Zero-GC).
     * [EN] Quickly checks if there are any objects (Mesh, Landscape, Foliage) that cast shadows in the scene (Zero-GC).
     */
    #hasAnyShadowCaster(view: View3D): boolean {
        if (this.#directionalShadowManager.castingList.length > 0) return true;

        const scene = (view as any).rawScene || view.scene;
        if (!scene) return false;

        const landscapes = scene.landscapeChildren;
        if (!landscapes || landscapes.length === 0) return false;

        const count = landscapes.length;
        for (let i = 0; i < count; i++) {
            const landscape = landscapes[i];
            if (!landscape) continue;
            if (landscape.castShadow) return true;

            const foliage = landscape.foliageManager;
            if (foliage) {
                const types = foliage.types;
                const typeCount = types.length;
                for (let t = 0; t < typeCount; t++) {
                    if (types[t].castShadow) return true;
                }
            }
        }

        return false;
    }

    /**
     * [KO] 캐스터가 꺼지는 전환 프레임에서 잔상(Ghosting)을 지우기 위해 1회 뎁스 텍스처를 1.0으로 초기화합니다.
     * [EN] Clears depth textures to 1.0 once in the transition frame when casters turn off to eliminate ghosting.
     */
    #clearShadowDepthTextures(view: View3D): void {
        const {redGPUContext} = view;
        const cascadeCount = Math.min(4, Math.max(1, this.#directionalShadowManager.cascadeCount || 3));
        for (let c = 0; c < cascadeCount; c++) {
            const cascadePassDescriptor: GPURenderPassDescriptor = {
                label: `${view.name} CSM Cascade ${c} Cleanup Clear Pass`,
                colorAttachments: [],
                depthStencilAttachment: {
                    view: this.#directionalShadowManager.getCascadeLayerView(c),
                    depthClearValue: 1.0,
                    depthLoadOp: GPU_LOAD_OP.CLEAR,
                    depthStoreOp: GPU_STORE_OP.STORE,
                },
            };
            redGPUContext.commandEncoderManager.addMainRenderPass(cascadePassDescriptor, () => {
            });
        }
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

    /**
     * [KO] 사용 중인 그림자 GPU 리소스를 해제합니다.
     * [EN] Releases GPU resources in use for shadow rendering.
     */
    destroy() {
        if (this.#directionalShadowManager) {
            this.#directionalShadowManager.destroy();
            this.#directionalShadowManager = null;
        }
        keepLog("🧹 ShadowManager destroy 완료");
    }
}

Object.freeze(ShadowManager)
export default ShadowManager
