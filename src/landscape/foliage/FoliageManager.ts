import View3D from "../../display/view/View3D";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import type Landscape from "../Landscape";
import type {FoliageOptions} from "./core/Foliage";
import Foliage from "./core/Foliage";
import FoliagePipelineRegistry from "./core/pipeline/FoliagePipelineRegistry";
import FoliageRenderer from "./core/renderer/FoliageRenderer";
import FoliageCuller from "./core/culling/FoliageCuller";

import FoliageMegaBuffer from "./core/buffer/FoliageMegaBuffer";
import FoliageSlotPooler from "./core/buffer/FoliageSlotPooler";
import {AScatterManager} from "../core/scatter";
import {FOLIAGE_SUB_CELL_SIZE} from "./FOLIAGE_CONSTANTS";

const DEFAULT_MOUNT_BUDGET: number = 16;
const DEFAULT_UNMOUNT_BUDGET: number = 32;

class FoliageManager extends AScatterManager<Foliage, FoliageOptions> {
    #slotPooler: FoliageSlotPooler;

    #megaBuffer: FoliageMegaBuffer;

    #pipelineRegistry: FoliagePipelineRegistry;
    #renderer: FoliageRenderer;
    #culler: FoliageCuller;
    #useDepthPrepass: boolean = true;

    #roundRobinIndex: number = 0;
    #debugSubCellColoration: boolean = false;
    #onUniformUpdateNeeded: (() => void) | null = null;

    #dirtyUboMask: number = 0;
    #needsRepopulateMask: number = 0;
    #lastUpdateFrameIndex: number = -1;

    constructor(landscape: Landscape, onUniformUpdateNeeded?: () => void) {
        super(landscape);
        this.#onUniformUpdateNeeded = onUniformUpdateNeeded ?? null;
        const {redGPUContext} = this;
        this.#slotPooler = new FoliageSlotPooler(redGPUContext);
        const renderUnitMegaUBO = this.#slotPooler.gpuBuffer;

        const {gpuDevice, resourceManager} = redGPUContext;
        const {VERTEX} = GPUShaderStage;
        const renderUnitVertexBindGroupLayout = resourceManager.createBindGroupLayout('Foliage_RenderUnit_BindGroupLayout', {
            label: 'Foliage_RenderUnit_BindGroupLayout',
            entries: [
                {
                    binding: 0,
                    visibility: VERTEX,
                    buffer: {
                        type: 'uniform',
                        hasDynamicOffset: true,
                        minBindingSize: 32
                    }
                }
            ]
        });

        const renderUnitDynamicBindGroup = gpuDevice.createBindGroup({
            label: 'Foliage_RenderUnit_DynamicBindGroup',
            layout: renderUnitVertexBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: renderUnitMegaUBO,
                        offset: 0,
                        size: 32
                    }
                }
            ]
        });

        this.#megaBuffer = new FoliageMegaBuffer(redGPUContext);
        this.#pipelineRegistry = new FoliagePipelineRegistry(redGPUContext);
        this.#renderer = new FoliageRenderer(
            redGPUContext,
            this.#pipelineRegistry,
            renderUnitVertexBindGroupLayout,
            renderUnitDynamicBindGroup
        );
        this.#culler = new FoliageCuller(redGPUContext, this.#megaBuffer);

        this.#megaBuffer.onRecreated = () => {
            this.#renderer.markAllBundlesDirty();
        };
    }

    get slotPooler(): FoliageSlotPooler {
        return this.#slotPooler;
    }

    get depthPrepassDrawCalls(): number {
        if (!this.enabled || !this.#useDepthPrepass) return 0;
        let count = 0;
        const {types} = this;
        const len = types.length;
        for (let i = 0; i < len; i++) {
            const foliage = types[i];
            const {
                activeInstanceCount,
                useDepthPrepass,
                depthPrepassOpaqueRenderUnits,
                depthPrepassMaskedRenderUnits
            } = foliage;
            if (activeInstanceCount > 0 && useDepthPrepass) {
                count += depthPrepassOpaqueRenderUnits.length + depthPrepassMaskedRenderUnits.length;
            }
        }
        return count;
    }

    get mainPassDrawCalls(): number {
        if (!this.enabled) return 0;
        let count = 0;
        const {types} = this;
        const len = types.length;
        for (let i = 0; i < len; i++) {
            const {activeInstanceCount, mainRenderUnits} = types[i];
            if (activeInstanceCount > 0) {
                count += mainRenderUnits.length;
            }
        }
        return count;
    }

    get useDepthPrepass(): boolean {
        return this.#useDepthPrepass;
    }

    set useDepthPrepass(val: boolean) {
        if (this.#useDepthPrepass !== val) {
            this.#useDepthPrepass = val;
            this.#renderer.useDepthPrepass = val;
        }
    }

    get totalInstanceCount(): number {
        let count = 0;
        const {types} = this;
        const len = types.length;
        for (let i = 0; i < len; i++) {
            const {activeInstanceCount} = types[i];
            count += activeInstanceCount;
        }
        return count;
    }

    recordResetCommands(encoder: GPUCommandEncoder): void {
        this.#culler.recordResetCommands(encoder);
    }

    dispatchCullingPass(computePass: GPUComputePassEncoder): void {
        this.#culler.dispatchPass(computePass);
    }

    destroy(): void {
        this.clearTypes();
        this.#megaBuffer.destroy();
        this.#pipelineRegistry.clearCache();
        this.#renderer.destroy();
        this.#culler.destroy();
        this.#slotPooler.destroy();
        this.#onUniformUpdateNeeded = null;
    }

    update(renderViewStateData: RenderViewStateData, standalone: boolean = false): void {
        const {enabled, types} = this;
        if (!enabled || types.length === 0) return;
        const {frameIndex} = renderViewStateData;
        if (this.#lastUpdateFrameIndex === frameIndex) return;
        this.#lastUpdateFrameIndex = frameIndex;

        const count = types.length;

        const repopMask = this.#needsRepopulateMask;
        if (repopMask !== 0) {
            for (let i = 0; i < count; i++) {
                const foliage = types[i];
                const typeId = foliage.typeId;
                if ((repopMask & (1 << typeId)) !== 0) {
                    this.#repopulateFoliage(foliage);
                }
            }
            this.#needsRepopulateMask = 0;
        }

        const uboMask = this.#dirtyUboMask;
        if (uboMask !== 0) {
            for (let i = 0; i < count; i++) {
                const foliage = types[i];
                const typeId = foliage.typeId;
                if ((uboMask & (1 << typeId)) !== 0) {
                    foliage.flushAllRenderUnitUBOs();
                }
            }
            this.#dirtyUboMask = 0;
        }

        const {view} = renderViewStateData;
        const {rawCamera} = view;
        const {x, z} = rawCamera;

        let remainingMount = DEFAULT_MOUNT_BUDGET;
        let remainingUnmount = DEFAULT_UNMOUNT_BUDGET;
        if (this.#roundRobinIndex >= count) {
            this.#roundRobinIndex = 0;
        }
        const startIdx = this.#roundRobinIndex;
        for (let i = 0; i < count; i++) {
            const idx = (startIdx + i) % count;
            const foliage = types[idx];
            foliage.updateStreaming(x, z, remainingMount, remainingUnmount);
            const {lastMountedCount, lastUnmountedCount} = foliage;
            remainingMount = Math.max(0, remainingMount - lastMountedCount);
            remainingUnmount = Math.max(0, remainingUnmount - lastUnmountedCount);
        }
        this.#roundRobinIndex = (this.#roundRobinIndex + 1) % count;

        if (standalone) {
            this.#culler.updateAndDispatch(types, renderViewStateData);
        } else {
            this.#culler.update(types, renderViewStateData);
        }
    }

    override computeTypeDrawCalls(foliage: Foliage): number {
        const {
            activeInstanceCount,
            mainRenderUnits,
            useDepthPrepass,
            depthPrepassOpaqueRenderUnits,
            depthPrepassMaskedRenderUnits
        } = foliage;
        if (activeInstanceCount <= 0) return 0;
        let count = mainRenderUnits.length;
        if (this.#useDepthPrepass && useDepthPrepass) {
            count += depthPrepassOpaqueRenderUnits.length + depthPrepassMaskedRenderUnits.length;
        }
        return count;
    }

    get instanceCapacity(): number {
        return this.#megaBuffer.instanceCapacity;
    }

    get subCellSize(): number {
        return FOLIAGE_SUB_CELL_SIZE;
    }

    get debugSubCellColoration(): boolean {
        return this.#debugSubCellColoration;
    }

    set debugSubCellColoration(val: boolean) {
        const boolVal = !!val;
        if (this.#debugSubCellColoration !== boolVal) {
            this.#debugSubCellColoration = boolVal;
            this.#onUniformUpdateNeeded?.();
        }
    }

    render(view: View3D, passEncoder: GPURenderPassEncoder): void {
        const {enabled, types} = this;
        if (!enabled || types.length === 0) return;
        this.#renderer.render(view, passEncoder, types);
    }

    renderShadow(view: View3D, passEncoder: GPURenderPassEncoder): void {
        const {enabled, types} = this;
        if (!enabled || types.length === 0) return;
        this.#renderer.renderShadow(view, passEncoder, types);
    }

    removeType(target: Foliage | string): boolean {
        const removed = this.unregisterTypeInternal(target);
        if (!removed) return false;

        const {typeId} = removed;
        const bit = 1 << typeId;
        this.#dirtyUboMask &= ~bit;
        this.#needsRepopulateMask &= ~bit;

        removed.destroy();
        this.#renderer.markAllBundlesDirty();
        return true;
    }

    override clearTypes(): void {
        this.#dirtyUboMask = 0;
        this.#needsRepopulateMask = 0;
        super.clearTypes();
    }

    addType(options: FoliageOptions): Foliage {
        const {name} = options;
        const existing = this.getTypeByName(name);
        if (existing) {
            console.warn(`[FoliageManager] Foliage with name '${name}' already exists.`);
            return existing;
        }

        const {redGPUContext, landscape} = this;
        const foliage = new Foliage(
            redGPUContext,
            options,
            this.#megaBuffer,
            this.#culler.baker,
            this.#slotPooler,
            landscape
        );
        foliage.onUniformDirty = this.#onFoliageUniformDirty;
        foliage.onRepopulateRequired = this.#onFoliageRepopulateRequired;
        this.registerTypeInternal(foliage);
        this.#renderer.markAllBundlesDirty();

        return foliage;
    }

    repopulateAll(): void {
        const {types} = this;
        const count = types.length;
        for (let i = 0; i < count; i++) {
            const foliage = types[i];
            const typeId = foliage.typeId;
            this.#needsRepopulateMask |= (1 << typeId);
            this.#dirtyUboMask |= (1 << typeId);
            this.#repopulateFoliage(foliage);
        }
    }

    rebakeAll(): void {
        const {types} = this;
        const count = types.length;
        for (let i = 0; i < count; i++) {
            types[i].rebake();
        }
        this.#renderer.markAllBundlesDirty();
    }

    #onFoliageUniformDirty = (typeId: number): void => {
        this.#dirtyUboMask |= (1 << typeId);
    };

    override computeTypeShadowDrawCalls(foliage: Foliage): number {
        const {
            shadowCullDistance,
            activeInstanceCount,
            hasImpostor,
            lodInfoList,
            hasMaskedLOD0,
            lod0RenderUnits
        } = foliage;
        if (shadowCullDistance <= 0 || activeInstanceCount <= 0) return 0;
        const num3DLODs = hasImpostor ? Math.max(1, lodInfoList.length - 1) : lodInfoList.length;
        const cascadeDraws = hasMaskedLOD0
            ? lod0RenderUnits.length + (num3DLODs > 1 ? 1 : 0)
            : 1;
        return cascadeDraws * 2 + 2;
    }

    #repopulateFoliage(type: Foliage): void {
        type.clearSubCellCache();
        this.#renderer.markShadowBundleDirty();
    }

    #onFoliageRepopulateRequired = ({typeId}: Foliage): void => {
        this.#needsRepopulateMask |= (1 << typeId);
        this.#dirtyUboMask |= (1 << typeId);
    };

}

Object.freeze(FoliageManager);
export default FoliageManager;

