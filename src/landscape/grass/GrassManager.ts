import View3D from "../../display/view/View3D";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import Landscape from "../Landscape";
import Grass, {GrassOptions} from "./core/Grass";
import GrassMegaBuffer from "./core/buffer/GrassMegaBuffer";
import GrassRenderer from "./core/renderer/GrassRenderer";
import GrassSlotPooler from "./core/buffer/GrassSlotPooler";
import GrassInstanceBaker, {GRASS_CELL_SIZE} from "./core/baking/GrassInstanceBaker";
import GrassCuller from "./core/culling/GrassCuller";
import {COMMAND_ENCODER_TYPE} from "../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import {AScatterManager} from "../core/scatter";

class GrassManager extends AScatterManager<Grass, GrassOptions> {

    #megaBuffer: GrassMegaBuffer;
    #baker: GrassInstanceBaker;
    #culler: GrassCuller;
    #slotPooler: GrassSlotPooler;

    #nextTypeId: number = 0;
    #populated: boolean = false;

    #renderer: GrassRenderer;

    #lastBakePos: [number, number] = [0, 0];
    #initialBaked: boolean = false;
    #lastLoadedTileCount: number = 0;
    #currentRenderViewStateData: RenderViewStateData | null = null;
    #dirtyUboMask: number = 0;
    #needsRebakeMask: number = 0;
    #lastUpdateFrameIndex: number = -1;

    constructor(landscape: Landscape) {
        super(landscape);

        const {redGPUContext} = this;
        this.#megaBuffer = new GrassMegaBuffer(redGPUContext, 131072);
        this.#baker = new GrassInstanceBaker(redGPUContext);
        this.#culler = new GrassCuller(redGPUContext);
        this.#slotPooler = new GrassSlotPooler(redGPUContext);
        this.#renderer = new GrassRenderer(redGPUContext);

        this.#megaBuffer.onRecreated = () => {
            this.#megaBuffer.invalidateUnifiedCullingBindGroup();
            this.#renderer.markAllBundlesDirty();
            this.rebakeAll();
        };
    }

    get totalInstanceCount(): number {
        let count = 0;
        const {types} = this;
        const len = types.length;
        for (let i = 0; i < len; i++) {
            const {typeId} = types[i];
            const alloc = this.#megaBuffer.getAllocation(typeId);
            if (alloc) count += alloc.instanceCount;
        }
        return count;
    }

    get populated(): boolean {
        return this.#populated;
    }

    get instanceCapacity(): number {
        return this.#megaBuffer.instanceCapacity;
    }

    override computeTypeDrawCalls(grass: Grass): number {
        if (!this.#populated) return 0;
        const alloc = this.#megaBuffer.getAllocation(grass.typeId);
        if (alloc) {
            const {instanceCount, nearSlots, farSlots} = alloc;
            if (instanceCount > 0) {
                return nearSlots.length + farSlots.length;
            }
        }
        return 0;
    }

    update(renderViewStateData: RenderViewStateData, standalone: boolean = false): void {
        const {enabled, types, landscape} = this;
        const grassLen = types.length;
        if (!enabled || grassLen === 0) return;
        const {frameIndex, view} = renderViewStateData;
        if (this.#lastUpdateFrameIndex === frameIndex) return;
        this.#lastUpdateFrameIndex = frameIndex;
        this.#currentRenderViewStateData = renderViewStateData;

        const {rawCamera} = view;
        const {x, z} = rawCamera;

        const {tileLoadedCount, hasValidScatterAtlas, hasValidVbtAtlas} = landscape;

        const tileCountChanged = hasValidScatterAtlas && this.#lastLoadedTileCount !== tileLoadedCount;
        if (tileCountChanged) {
            this.#lastLoadedTileCount = tileLoadedCount;
        }

        const [lastBakeX, lastBakeZ] = this.#lastBakePos;
        const dx = x - lastBakeX;
        const dz = z - lastBakeZ;
        const distSq = dx * dx + dz * dz;

        const bakeThreshold = GRASS_CELL_SIZE;

        let rebakedThisFrame = false;
        const needsRebake = this.#needsRebakeMask !== 0;
        if (hasValidScatterAtlas && (needsRebake || !this.#initialBaked || tileCountChanged || distSq > bakeThreshold * bakeThreshold)) {
            this.#initialBaked = true;
            this.#lastBakePos[0] = x;
            this.#lastBakePos[1] = z;
            this.#bakeAll(x, z);
            this.#needsRebakeMask = 0;
            rebakedThisFrame = true;
        }

        const uboDirtyMask = this.#dirtyUboMask;

        for (let i = 0; i < grassLen; i++) {
            const type = types[i];
            const {typeId, slotIndex} = type;

            let activeSlot = slotIndex;
            if (activeSlot < 0) {
                activeSlot = this.#slotPooler.allocateSlot();
                if (activeSlot >= 0) {
                    type.slotIndex = activeSlot;
                    this.#slotPooler.writeGrassSlot(activeSlot, type, hasValidVbtAtlas);
                } else {
                    continue;
                }
            }

            const isDirty = tileCountChanged || ((uboDirtyMask & (1 << typeId)) !== 0);
            if (isDirty) {
                this.#slotPooler.writeGrassSlot(activeSlot, type, hasValidVbtAtlas);

                if (!rebakedThisFrame) {
                    const alloc = this.#megaBuffer.getAllocation(typeId);
                    if (alloc) {
                        this.#megaBuffer.updateTypeParams(typeId, type, alloc);
                    }
                }
            }
        }
        this.#dirtyUboMask = 0;

        if (standalone) {
            this.commandEncoderManager.useEncoder(
                COMMAND_ENCODER_TYPE.PRE_PROCESS,
                this.#onResetMultiIndirectCommands
            );

            this.commandEncoderManager.addPreProcessComputePass(
                'Grass_GPU_Culling_ComputePass',
                this.#onPreProcessComputePass
            );
        }
    }

    addType(options: GrassOptions): Grass {
        const {redGPUContext, landscape} = this;
        const grassType = new Grass(redGPUContext, options);

        const typeId = this.#nextTypeId++;
        grassType.typeId = typeId;
        this.registerTypeInternal(grassType);

        const {
            instancesPerCell,
            renderUnits,
            bakeRadius,
            maxInstances: userMaxInstances
        } = grassType;
        const targetRadius = bakeRadius;
        const cellCountApprox = Math.ceil((Math.PI * targetRadius * targetRadius) / (GRASS_CELL_SIZE * GRASS_CELL_SIZE));
        const computedMax = Math.max(4096, Math.min(262144, cellCountApprox * Math.ceil(instancesPerCell * 1.3)));
        const maxInstances = userMaxInstances !== undefined ? Math.max(4096, userMaxInstances) : computedMax;

        const alloc = this.#megaBuffer.allocateType(
            typeId,
            maxInstances,
            renderUnits
        );
        grassType.bindAllocation(alloc);

        this.#megaBuffer.updateTypeParams(typeId, grassType, alloc);

        grassType.onUniformDirty = this.#onGrassUniformDirty;
        grassType.onRepopulateRequired = this.#onGrassRepopulateRequired;

        const {targetLayer} = grassType;
        const {layers, hasValidVbtAtlas} = landscape;
        if (targetLayer != null && targetLayer !== '') {
            const matchedLayer = typeof targetLayer === 'number'
                ? layers[targetLayer]
                : layers.find(
                    l => l.name === targetLayer
                );
            const weightTexture = matchedLayer?.weightTexture;
            if (weightTexture && typeof (weightTexture as any).addLoadListeners === 'function') {
                (weightTexture as any).addLoadListeners(this.#onGrassRepopulateRequired);
            }
        }

        const slotIndex = this.#slotPooler.allocateSlot();
        grassType.slotIndex = slotIndex;

        this.#slotPooler.writeGrassSlot(slotIndex, grassType, hasValidVbtAtlas);

        this.#megaBuffer.invalidateUnifiedCullingBindGroup();
        this.#renderer.markAllBundlesDirty();
        this.#populated = true;
        return grassType;
    }

    override computeTypeShadowDrawCalls(grass: Grass): number {
        if (!this.#populated) return 0;
        const {typeId} = grass;
        const alloc = this.#megaBuffer.getAllocation(typeId);
        if (alloc) {
            const {instanceCount, nearSlots} = alloc;
            if (instanceCount > 0) {
                return nearSlots.length;
            }
        }
        return 0;
    }

    recordResetCommands(encoder: GPUCommandEncoder): void {
        this.#megaBuffer.resetMultiIndirectCommands(encoder);
    }

    dispatchCullingPass(computePass: GPUComputePassEncoder, renderViewStateData?: RenderViewStateData): void {
        const stateData = renderViewStateData ?? this.#currentRenderViewStateData;
        if (!stateData || !this.enabled || this.types.length === 0) return;
        this.#culler.dispatchPass(
            computePass,
            this.#megaBuffer,
            stateData
        );
    }

    removeType(target: Grass | string): boolean {
        const removedGrass = this.unregisterTypeInternal(target);
        if (!removedGrass) return false;

        const {typeId, slotIndex} = removedGrass;

        this.#megaBuffer.freeType(typeId);
        if (slotIndex >= 0) {
            this.#slotPooler.freeSlot(slotIndex);
            removedGrass.slotIndex = -1;
        }

        this.#dirtyUboMask &= ~(1 << typeId);
        this.#needsRebakeMask &= ~(1 << typeId);

        removedGrass.bindAllocation(null);
        removedGrass.onUniformDirty = null;
        removedGrass.onRepopulateRequired = null;
        if (this.types.length === 0) {
            this.#populated = false;
        }
        this.#megaBuffer.invalidateUnifiedCullingBindGroup();
        this.#renderer.markAllBundlesDirty();
        return true;
    }

    clearTypes(): void {
        const {types, redGPUContext} = this;
        while (types.length > 0) {
            this.removeType(types[types.length - 1]);
        }

        this.#dirtyUboMask = 0;
        this.#needsRebakeMask = 0;
        this.#slotPooler.clear();
        this.#megaBuffer.destroy();
        this.#megaBuffer = new GrassMegaBuffer(redGPUContext, 131072);
        this.#megaBuffer.onRecreated = () => {
            this.#megaBuffer.invalidateUnifiedCullingBindGroup();
            this.#renderer.markAllBundlesDirty();
            this.rebakeAll();
        };

        this.#nextTypeId = 0;
        this.#lastLoadedTileCount = 0;
        this.#initialBaked = false;
        this.#populated = false;
        this.#lastBakePos[0] = 0;
        this.#lastBakePos[1] = 0;
    }

    destroy(): void {
        this.#megaBuffer.destroy();
        this.#baker.destroy();
        this.#culler.destroy();
        this.#renderer.destroy();
        this.#slotPooler.destroy();

        const {types} = this;
        const len = types.length;
        for (let i = 0; i < len; i++) {
            types[i].destroy();
        }
        this.clearTypes();

        this.#currentRenderViewStateData = null;
    }

    #onResetMultiIndirectCommands = (encoder: GPUCommandEncoder): void => {
        this.#megaBuffer.resetMultiIndirectCommands(encoder);
    };

    #onPreProcessComputePass = (computePass: GPUComputePassEncoder): void => {
        if (!this.#currentRenderViewStateData) return;
        this.#culler.dispatchPass(
            computePass,
            this.#megaBuffer,
            this.#currentRenderViewStateData
        );
    };

    render(view: View3D, passEncoder: GPURenderPassEncoder): void {
        const {enabled, types} = this;
        if (!enabled || types.length === 0 || !this.#populated) return;
        this.#renderer.render(view, passEncoder, types, this.#megaBuffer, this.#slotPooler);
    }

    renderShadow(view: View3D, passEncoder: GPURenderPassEncoder): void {
        const {enabled, types} = this;
        if (!enabled || types.length === 0 || !this.#populated) return;
        this.#renderer.renderShadow(view, passEncoder, types, this.#megaBuffer, this.#slotPooler);
    }

    rebakeAll(): void {
        this.#needsRebakeMask = -1;
    }

    #bakeAll(centerX: number, centerZ: number): void {
        const {types} = this;
        const len = types.length;
        for (let i = 0; i < len; i++) {
            this.#bakeGrassType(types[i], centerX, centerZ);
        }
    }

    #onGrassUniformDirty = (typeId?: number): void => {
        if (typeId !== undefined && typeId >= 0 && typeId < 32) {
            this.#dirtyUboMask |= (1 << typeId);
        } else {
            this.#dirtyUboMask = -1;
        }
    };

    #onGrassRepopulateRequired = (typeId?: number): void => {
        if (typeId !== undefined && typeId >= 0 && typeId < 32) {
            this.#needsRebakeMask |= (1 << typeId);
            this.#dirtyUboMask |= (1 << typeId);
        } else {
            this.#needsRebakeMask = -1;
            this.#dirtyUboMask = -1;
        }
    };

    #bakeGrassType(grass: Grass, centerX: number, centerZ: number): void {
        const {landscape} = this;
        if (!landscape.hasValidScatterAtlas) return;

        this.#baker.dispatchBake(
            this.#megaBuffer,
            landscape,
            grass,
            centerX,
            centerZ
        );

        const alloc = this.#megaBuffer.getAllocation(grass.typeId);
        if (alloc) {
            this.#megaBuffer.updateTypeParams(grass.typeId, grass, alloc);
        }
    }
}

Object.freeze(GrassManager);
export default GrassManager;

