import RedGPUContext from "../../../../context/RedGPUContext";
import AScatterSlotPooler from "../../../core/scatter/AScatterSlotPooler";

class FoliageSlotPooler extends AScatterSlotPooler {
    static MAX_SLOTS: number = 1024;
    static PARAMS_SIZE_BYTES: number = 32;

    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            FoliageSlotPooler.MAX_SLOTS,
            FoliageSlotPooler.PARAMS_SIZE_BYTES,
            'Foliage_RenderUnit_MegaUBO'
        );
    }

    writePBRRenderUnitSlot(
        slot: number,
        globalSlot: number,
        receiveShadow: boolean,
        isMasked: boolean,
        applyGroundBlend: boolean,
        groundBlendStrength: number = 0.8,
        groundBlendRange: number = 1.5,
        trunkBendScale: number = 1.0,
        foliageHeight: number = 5.0,
        leafFlutterScale: number = 1.0
    ): void {
        const {maxSlots, paramsSizeBytes, cpuBuffer: f32, cpuUint32View: u32} = this;
        if (slot < 0 || slot >= maxSlots) return;

        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;

        u32[baseFloat + 0] = globalSlot;
        f32[baseFloat + 1] = receiveShadow ? 1.0 : 0.0;
        f32[baseFloat + 2] = trunkBendScale;
        f32[baseFloat + 3] = isMasked ? leafFlutterScale : 0.0;
        f32[baseFloat + 4] = foliageHeight;
        f32[baseFloat + 5] = applyGroundBlend ? groundBlendStrength : 0.0;
        f32[baseFloat + 6] = groundBlendRange;
        u32[baseFloat + 7] = 0;

        this.uploadSlotBytes(slot, paramsSizeBytes);
    }

    writeShadowRenderUnitSlot(
        slot: number,
        trunkBendScale: number = 1.0,
        foliageHeight: number = 5.0,
        leafFlutterScale: number = 1.0
    ): void {
        const {maxSlots, paramsSizeBytes, cpuBuffer: f32, cpuUint32View: u32} = this;
        if (slot < 0 || slot >= maxSlots) return;

        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;

        u32[baseFloat + 0] = 0;
        f32[baseFloat + 1] = 0.0;
        f32[baseFloat + 2] = trunkBendScale;
        f32[baseFloat + 3] = leafFlutterScale * 0.5;
        f32[baseFloat + 4] = foliageHeight;
        f32[baseFloat + 5] = 0.0;
        f32[baseFloat + 6] = 1.5;
        u32[baseFloat + 7] = 0;

        this.uploadSlotBytes(slot, paramsSizeBytes);
    }

    updateWindParams(
        slot: number,
        trunkBendScale: number,
        leafFlutterScale: number,
        foliageHeight: number
    ): void {
        const {maxSlots, cpuBuffer: f32} = this;
        if (slot < 0 || slot >= maxSlots) return;
        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;

        f32[baseFloat + 2] = trunkBendScale;
        f32[baseFloat + 3] = leafFlutterScale;
        f32[baseFloat + 4] = foliageHeight;
    }

    updateGroundBlendParams(
        slot: number,
        strength: number,
        range: number
    ): void {
        const {maxSlots, cpuBuffer: f32} = this;
        if (slot < 0 || slot >= maxSlots) return;
        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;

        f32[baseFloat + 5] = strength;
        f32[baseFloat + 6] = range;
    }

    flushSlotBytes(slot: number): void {
        const {maxSlots, paramsSizeBytes} = this;
        if (slot < 0 || slot >= maxSlots) return;
        this.uploadSlotBytes(slot, paramsSizeBytes);
    }

    updateReceiveShadow(slot: number, receiveShadow: boolean): void {
        const {maxSlots, paramsSizeBytes, cpuBuffer} = this;
        if (slot < 0 || slot >= maxSlots) return;
        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;
        cpuBuffer[baseFloat + 1] = receiveShadow ? 1.0 : 0.0;
        this.uploadSlotBytes(slot, paramsSizeBytes);
    }
}

Object.freeze(FoliageSlotPooler);
export default FoliageSlotPooler;

