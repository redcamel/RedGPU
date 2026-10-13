import {mat4} from "gl-matrix";
import ScatterRenderUnit, {type ScatterRenderUnitInitOptions} from "../../core/scatter/ScatterRenderUnit";
import FoliagePipelineRegistry, {type FoliageDepthPassMode} from "./pipeline/FoliagePipelineRegistry";
import FoliageSlotPooler from "./buffer/FoliageSlotPooler";
import {PBR_STRIDE_BYTES, POSITION_ONLY_STRIDE_BYTES} from "../../core/scatter/ScatterVertexFormats";

export type FoliageRenderPassType = 'depthPrepass' | 'main';

export interface FoliageRenderUnitInitOptions extends ScatterRenderUnitInitOptions {
    slotIndex?: number;
    slotPooler?: FoliageSlotPooler | null;
    lodIndex?: number;
    relativeModelMatrix?: mat4 | null;
    isDepthPrepass?: boolean;
    isMainOpaqueOrMasked?: boolean;
    mainDepthMode?: FoliageDepthPassMode;
    isImpostor?: boolean;
    isShadowMerged?: boolean;
}

class FoliageRenderUnit extends ScatterRenderUnit {
    #slotIndex: number = -1;
    #slotPooler: FoliageSlotPooler | null = null;
    #isShadowMerged: boolean = false;

    #relativeModelMatrix: mat4 | null = null;

    #isDepthPrepass: boolean = false;
    #isMainOpaqueOrMasked: boolean = true;
    #mainDepthMode: FoliageDepthPassMode = 'normal';
    #isImpostor: boolean = false;

    constructor(init: FoliageRenderUnitInitOptions) {
        const {
            isShadowMerged = false,
            strideBytes = isShadowMerged ? POSITION_ONLY_STRIDE_BYTES : PBR_STRIDE_BYTES,
            isMasked = !isShadowMerged,
            indexFormat = 'uint32',
            instanceBufferOffset = 0,
            indirectOffsetBytes = 0,
            slotIndex = -1,
            slotPooler = null,
            relativeModelMatrix = null,
            isDepthPrepass = false,
            isMainOpaqueOrMasked = !isShadowMerged,
            mainDepthMode = 'normal',
            isImpostor = false,
        } = init;

        super({
            ...init,
            strideBytes,
            isMasked,
            indexFormat,
            instanceBufferOffset,
            indirectOffsetBytes,
        });

        this.#isShadowMerged = isShadowMerged;
        this.#slotIndex = slotIndex;
        this.#slotPooler = slotPooler;

        this.#relativeModelMatrix = relativeModelMatrix;

        this.#isDepthPrepass = isDepthPrepass;
        this.#isMainOpaqueOrMasked = isMainOpaqueOrMasked;
        this.#mainDepthMode = mainDepthMode;
        this.#isImpostor = isImpostor;
    }

    get slotIndex(): number {
        return this.#slotIndex;
    }

    get slotPooler(): FoliageSlotPooler | null {
        return this.#slotPooler;
    }

    get isShadowMerged(): boolean {
        return this.#isShadowMerged;
    }

    get relativeModelMatrix(): mat4 | null {
        return this.#relativeModelMatrix;
    }

    get mainDepthMode(): FoliageDepthPassMode {
        return this.#mainDepthMode;
    }

    get isImpostor(): boolean {
        return this.#isImpostor;
    }

    updateWindScales(
        trunkBendScale: number,
        leafFlutterScale: number,
        foliageHeight: number
    ): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.updateWindParams(
                this.#slotIndex,
                trunkBendScale,
                leafFlutterScale,
                foliageHeight
            );
        }
    }

    updateGroundBlendParams(
        groundBlendStrength: number,
        groundBlendRange: number
    ): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.updateGroundBlendParams(
                this.#slotIndex,
                groundBlendStrength,
                groundBlendRange
            );
        }
    }

    updateReceiveShadow(receiveShadow: boolean): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.updateReceiveShadow(this.#slotIndex, receiveShadow);
        }
    }

    flushSlotUBO(): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.flushSlotBytes(this.#slotIndex);
        }
    }

    override destroy(): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.freeSlot(this.#slotIndex);
            this.#slotIndex = -1;
        }
        this.#slotPooler = null;
        super.destroy();
    }

    canRenderInPass(passType: FoliageRenderPassType): boolean {
        if (this.#isShadowMerged) return false;
        switch (passType) {
            case 'depthPrepass':
                return this.#isDepthPrepass;
            case 'main':
                return this.#isMainOpaqueOrMasked;
            default:
                return false;
        }
    }

    getPipeline(
        registry: FoliagePipelineRegistry,
        sampleCount: number,
        msaaID: string,
        depthPassMode: FoliageDepthPassMode,
        renderUnitBindGroupLayout: GPUBindGroupLayout | null
    ): GPURenderPipeline | null {
        const {material, isMasked, strideBytes} = this;
        if (!material) return null;

        const {dirtyPipeline, gpuRenderInfo, doubleSided, cullMode = 'back'} = material;
        if (dirtyPipeline || !gpuRenderInfo?.fragmentUniformBindGroup) {
            material._updateFragmentState();
            material.dirtyPipeline = false;
        }

        const effectiveCullMode: GPUCullMode = (!isMasked)
            ? 'back'
            : (doubleSided ? 'none' : cullMode);

        return registry.getOrCreatePipeline(
            material,
            sampleCount,
            msaaID,
            strideBytes,
            effectiveCullMode,
            depthPassMode,
            renderUnitBindGroupLayout,
            isMasked
        );
    }
}

Object.freeze(FoliageRenderUnit);
export default FoliageRenderUnit;

