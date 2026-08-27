import FoliageType from "../../FoliageType";

class FoliageTilePopulator {

    static populateTile(
        comp: any,
        foliageType: FoliageType,
        targetCountPerTile?: number
    ): number {
        const landscape = foliageType.foliageManager?.landscape;
        const compCountX = landscape?.componentCount?.[0] ?? 8;
        const totalTiles = compCountX * compCountX;

        const maxInstances = foliageType.options.maxInstances;
        const countForThisTile = targetCountPerTile ?? Math.floor(maxInstances / totalTiles);
        if (countForThisTile <= 0) return 0;

        const tileSizeMeters = comp.componentSizeQuads || ((landscape && landscape.worldSize) ? landscape.worldSize[0] / compCountX : 1000);
        const halfTile = tileSizeMeters * 0.5;

        const minX = comp.worldX - halfTile;
        const maxX = comp.worldX + halfTile;
        const minZ = comp.worldZ - halfTile;
        const maxZ = comp.worldZ + halfTile;

        const startIdx = foliageType.activeInstanceCount;
        const endIdx = Math.min(startIdx + countForThisTile, maxInstances);
        const actualCount = endIdx - startIdx;
        if (actualCount <= 0) return 0;

        const {minScale, maxScale, randomRotationY} = foliageType.options;
        const rangeX = maxX - minX;
        const rangeZ = maxZ - minZ;

        const scaleDiffX = maxScale[0] - minScale[0];
        const scaleDiffY = maxScale[1] - minScale[1];
        const scaleDiffZ = maxScale[2] - minScale[2];

        const tileX = comp.componentX ?? 0;
        const tileZ = comp.componentZ ?? 0;
        let nameHash = 0;
        const nameStr = foliageType.name || '';
        for (let c = 0; c < nameStr.length; c++) {
            nameHash = (nameHash * 31 + nameStr.charCodeAt(c)) | 0;
        }

        let seed = ((tileX * 73856093) ^ (tileZ * 19349663) ^ (nameHash * 83492791)) >>> 0;
        if (seed === 0) seed = 0x9e3779b9;

        for (let i = 0; i < actualCount; i++) {
            const idx = startIdx + i;

            // Xorshift32 PRNG (Zero Allocation / Deterministic)
            seed ^= seed << 13;
            seed ^= seed >>> 17;
            seed ^= seed << 5;
            const rX = (seed >>> 0) / 4294967296.0;

            seed ^= seed << 13;
            seed ^= seed >>> 17;
            seed ^= seed << 5;
            const rZ = (seed >>> 0) / 4294967296.0;

            seed ^= seed << 13;
            seed ^= seed >>> 17;
            seed ^= seed << 5;
            const rScale = (seed >>> 0) / 4294967296.0;

            const posX = minX + rX * rangeX;
            const posZ = minZ + rZ * rangeZ;

            const scaleX = minScale[0] + rScale * scaleDiffX;
            const scaleY = minScale[1] + rScale * scaleDiffY;
            const scaleZ = minScale[2] + rScale * scaleDiffZ;

            const posY = 0.0;

            let rotX = 0, rotY = 0, rotZ = 0, rotW = 1;
            if (randomRotationY) {
                seed ^= seed << 13;
                seed ^= seed >>> 17;
                seed ^= seed << 5;
                const rAngle = (seed >>> 0) / 4294967296.0;
                const angle = rAngle * Math.PI * 2;
                rotY = Math.sin(angle * 0.5);
                rotW = Math.cos(angle * 0.5);
            }

            foliageType.setInstanceData(idx, posX, posY, posZ, rotX, rotY, rotZ, rotW, scaleX, scaleY, scaleZ, 1.0, 0);
        }

        foliageType.uploadRangeToGPU(startIdx, actualCount);
        foliageType.resetIndirectBuffer();

        return actualCount;
    }
}

Object.freeze(FoliageTilePopulator);
export default FoliageTilePopulator;
