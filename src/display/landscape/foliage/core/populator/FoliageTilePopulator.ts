import FoliageType from "../../FoliageType";

/**
 * [KO] 지형 타일 단위 절차적(Procedural) 식생 인스턴스 배치기 (단일 책임: 타일 영역 난수/스케일/회전 연산 및 부분 GPU 업로드)
 * [EN] Procedural Foliage Instance Tile Populator (Single Responsibility: Random/Scale/Rotation Calculation & Partial GPU Upload)
 */
class FoliageTilePopulator {
    /**
     * 지형 타일(LandscapeComponent) 1개 영역에 식생 인스턴스 절차적 배치
     */
    static populateTile(
        comp: any,
        foliageType: FoliageType,
        targetCountPerTile?: number
    ): boolean {
        const landscape = foliageType.foliageManager?.landscape;
        const compCountX = landscape?.componentCount?.[0] ?? 8;
        const totalTiles = compCountX * compCountX;

        const maxInstances = foliageType.options.maxInstances;
        const countForThisTile = targetCountPerTile ?? Math.floor(maxInstances / totalTiles);
        if (countForThisTile <= 0) return false;

        const tileSizeMeters = comp.componentSizeQuads || ((landscape && landscape.worldSize) ? landscape.worldSize[0] / compCountX : 1000);
        const halfTile = tileSizeMeters * 0.5;

        const minX = comp.worldX - halfTile;
        const maxX = comp.worldX + halfTile;
        const minZ = comp.worldZ - halfTile;
        const maxZ = comp.worldZ + halfTile;

        const startIdx = foliageType.activeInstanceCount;
        const endIdx = Math.min(startIdx + countForThisTile, maxInstances);
        const actualCount = endIdx - startIdx;
        if (actualCount <= 0) return false;

        const {minScale, maxScale, randomRotationY} = foliageType.options;
        const rangeX = maxX - minX;
        const rangeZ = maxZ - minZ;

        const scaleDiffX = maxScale[0] - minScale[0];
        const scaleDiffY = maxScale[1] - minScale[1];
        const scaleDiffZ = maxScale[2] - minScale[2];

        const instanceBuffer = foliageType.instanceBuffer;

        for (let i = 0; i < actualCount; i++) {
            const idx = startIdx + i;
            const posX = minX + Math.random() * rangeX;
            const posZ = minZ + Math.random() * rangeZ;

            const scaleX = minScale[0] + Math.random() * scaleDiffX;
            const scaleY = minScale[1] + Math.random() * scaleDiffY;
            const scaleZ = minScale[2] + Math.random() * scaleDiffZ;

            const posY = 0.0;

            let rotX = 0, rotY = 0, rotZ = 0, rotW = 1;
            if (randomRotationY) {
                const angle = Math.random() * Math.PI * 2;
                rotY = Math.sin(angle * 0.5);
                rotW = Math.cos(angle * 0.5);
            }

            instanceBuffer.setInstanceData(idx, posX, posY, posZ, rotX, rotY, rotZ, rotW, scaleX, scaleY, scaleZ, 1.0, 0);
        }

        foliageType.incrementActiveInstanceCount(actualCount);

        // 해당 타일 영역 식생 인스턴스 데이터만 GPU 버퍼 부분 패치 업로드
        instanceBuffer.uploadRangeToGPU(startIdx, actualCount);
        foliageType.updateIndirectBuffer();

        return true;
    }
}

Object.freeze(FoliageTilePopulator);
export default FoliageTilePopulator;
