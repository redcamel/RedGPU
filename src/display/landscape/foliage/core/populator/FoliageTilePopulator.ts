import FoliageType from "../../FoliageType";

class FoliageTilePopulator {
    static readonly #tempFloat32: Float32Array = new Float32Array(2);
    static readonly #tempUint32: Uint32Array = new Uint32Array(FoliageTilePopulator.#tempFloat32.buffer);

    static populateTile(
        comp: any,
        foliageType: FoliageType,
        landscape?: any,
        targetCountPerTile?: number
    ): number {
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
        const isUniformXZ = (scaleDiffX === scaleDiffZ && minScale[0] === minScale[2]);

        const tileX = comp.componentX ?? 0;
        const tileZ = comp.componentZ ?? 0;
        const nameHash = foliageType.nameHash;

        let seed = ((tileX * 73856093) ^ (tileZ * 19349663) ^ (nameHash * 83492791)) >>> 0;
        if (seed === 0) seed = 0x9e3779b9;

        const hasGetHeight = typeof landscape?.getHeightAt === 'function';

        const megaBuffer = foliageType.megaBuffer;
        const allocation = foliageType.allocation;

        if (megaBuffer && allocation) {
            const f32 = megaBuffer.cpuRawDataBuffer;
            const u32 = megaBuffer.cpuRawDataUint32;
            const baseFloat = (allocation.rawBaseOffset + startIdx) * 8;
            const typeId = allocation.typeId;

            for (let i = 0; i < actualCount; i++) {
                const offset = baseFloat + i * 8;

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
                const scaleZ = isUniformXZ ? scaleX : (minScale[2] + rScale * scaleDiffZ);

                let posY = 0.0;
                if (hasGetHeight) {
                    posY = landscape.getHeightAt(posX, posZ);
                }

                f32[offset] = posX;
                f32[offset + 1] = posY;
                f32[offset + 2] = posZ;
                f32[offset + 3] = scaleY;

                if (randomRotationY) {
                    seed ^= seed << 13;
                    seed ^= seed >>> 17;
                    seed ^= seed << 5;
                    const rAngle = (seed >>> 0) / 4294967296.0;
                    const angle = rAngle * (Math.PI * 2);
                    const halfAngle = angle * 0.5;
                    const rotY = Math.sin(halfAngle);
                    const rotW = Math.cos(halfAngle);

                    const iy = Math.max(-32768, Math.min(32767, (rotY * 32767) | 0));
                    const iw = Math.max(-32768, Math.min(32767, (rotW * 32767) | 0));

                    u32[offset + 4] = (iy & 0xFFFF) << 16;
                    u32[offset + 5] = (iw & 0xFFFF) << 16;
                } else {
                    u32[offset + 4] = 0;
                    u32[offset + 5] = 32767 << 16;
                }

                if (isUniformXZ) {
                    u32[offset + 6] = FoliageTilePopulator.#fastPackUniformScale(scaleX);
                } else {
                    u32[offset + 6] = FoliageTilePopulator.#fastPack2x16float(scaleX, scaleZ);
                }

                f32[offset + 7] = typeId;
            }
        } else {
            for (let i = 0; i < actualCount; i++) {
                const idx = startIdx + i;

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

                let posY = 0.0;
                if (hasGetHeight) {
                    posY = landscape.getHeightAt(posX, posZ);
                }

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

                foliageType.setInstanceData(idx, posX, posY, posZ, rotX, rotY, rotZ, rotW, scaleX, scaleY, scaleZ, 1.0);
            }
        }

        foliageType.uploadRangeToGPU(startIdx, actualCount);
        foliageType.resetIndirectBuffer();

        return actualCount;
    }

    static #fastFloatToHalf(val: number): number {
        FoliageTilePopulator.#tempFloat32[0] = val;
        const f = FoliageTilePopulator.#tempUint32[0];
        const sign = (f >> 16) & 0x8000;
        let exp = ((f >> 23) & 0xFF) - 127 + 15;
        let mant = (f >> 13) & 0x03FF;
        if (exp <= 0) return sign;
        if (exp >= 31) return sign | 0x7C00;
        return sign | (exp << 10) | mant;
    }

    static #fastPack2x16float(x: number, y: number): number {
        const tf = FoliageTilePopulator.#tempFloat32;
        const tu = FoliageTilePopulator.#tempUint32;
        tf[0] = x;
        tf[1] = y;

        const f0 = tu[0];
        const sign0 = (f0 >> 16) & 0x8000;
        let exp0 = ((f0 >> 23) & 0xFF) - 127 + 15;
        let mant0 = (f0 >> 13) & 0x03FF;
        const hx = sign0 | (exp0 <= 0 ? 0 : (exp0 >= 31 ? 0x7C00 : (exp0 << 10) | mant0));

        const f1 = tu[1];
        const sign1 = (f1 >> 16) & 0x8000;
        let exp1 = ((f1 >> 23) & 0xFF) - 127 + 15;
        let mant1 = (f1 >> 13) & 0x03FF;
        const hy = sign1 | (exp1 <= 0 ? 0 : (exp1 >= 31 ? 0x7C00 : (exp1 << 10) | mant1));

        return (hx & 0xFFFF) | ((hy & 0xFFFF) << 16);
    }

    static #fastPackUniformScale(scale: number): number {
        const h = FoliageTilePopulator.#fastFloatToHalf(scale) & 0xFFFF;
        return h | (h << 16);
    }
}

Object.freeze(FoliageTilePopulator);
export default FoliageTilePopulator;
