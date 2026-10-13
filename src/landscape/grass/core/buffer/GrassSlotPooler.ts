import RedGPUContext from "../../../../context/RedGPUContext";
import type Grass from "../Grass";
import AScatterSlotPooler from "../../../core/scatter/AScatterSlotPooler";

class GrassSlotPooler extends AScatterSlotPooler {
    static MAX_SLOTS: number = 256;
    static PARAMS_SIZE_BYTES: number = 96;

    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            GrassSlotPooler.MAX_SLOTS,
            GrassSlotPooler.PARAMS_SIZE_BYTES,
            'Grass_SlotPooler_MegaUBO'
        );
    }

    writeGrassSlot(slot: number, grass: Grass, hasValidVbt: boolean): void {
        const {maxSlots, paramsSizeBytes, cpuBuffer: f32, cpuUint32View: u32} = this;
        if (slot < 0 || slot >= maxSlots) return;

        const baseFloat = slot * AScatterSlotPooler.SLOT_STRIDE_FLOATS;

        const {
            cullingDistance,
            height,
            minY,
            shadowCullDistance,
            shadowFadeStartDistance,
            groundBlendStrength,
            alphaCutoff,
            exposureBoost,
            subsurfaceColor,
            subsurfaceStrength,
            roughness,
            shadowStrength,
            receiveShadow
        } = grass;

        const effShadowFadeStart = Math.min(shadowFadeStartDistance, shadowCullDistance);
        const fadeStartDistance = cullingDistance * 0.75;

        f32[baseFloat + 0] = cullingDistance;
        f32[baseFloat + 1] = fadeStartDistance;
        f32[baseFloat + 2] = height;
        f32[baseFloat + 3] = minY;
        f32[baseFloat + 4] = shadowCullDistance;
        f32[baseFloat + 5] = Math.min(0.30, Math.max(0.10, alphaCutoff * 0.55));
        f32[baseFloat + 6] = 1.0 / Math.max(0.01, height);
        f32[baseFloat + 7] = 1.0 / Math.max(0.001, cullingDistance - fadeStartDistance);

        f32[baseFloat + 8] = groundBlendStrength;
        f32[baseFloat + 9] = alphaCutoff;
        u32[baseFloat + 10] = hasValidVbt ? 1 : 0;
        f32[baseFloat + 11] = exposureBoost;

        const [subR, subG, subB] = subsurfaceColor;
        f32[baseFloat + 12] = subR;
        f32[baseFloat + 13] = subG;
        f32[baseFloat + 14] = subB;
        f32[baseFloat + 15] = subsurfaceStrength;

        f32[baseFloat + 16] = roughness;
        f32[baseFloat + 17] = shadowStrength;
        u32[baseFloat + 18] = receiveShadow ? 1 : 0;
        f32[baseFloat + 19] = shadowCullDistance * shadowCullDistance;

        f32[baseFloat + 20] = effShadowFadeStart * effShadowFadeStart;
        f32[baseFloat + 21] = 1.0 / Math.max(0.001, shadowCullDistance - effShadowFadeStart);
        u32[baseFloat + 22] = 0;
        u32[baseFloat + 23] = 0;

        this.uploadSlotBytes(slot, paramsSizeBytes);
    }
}

Object.freeze(GrassSlotPooler);
export default GrassSlotPooler;

