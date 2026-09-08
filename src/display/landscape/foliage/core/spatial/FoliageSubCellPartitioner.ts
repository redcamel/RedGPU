/**
 * [KO] 1,000m 타일 내부의 식생 인스턴스를 100m 서브셀 단위로 공간 분할하는 청크 인터페이스 및 파티셔너
 * [EN] Foliage sub-cell chunk interface and partitioner dividing 1,000m tile instances into 100m sub-cells
 */

export interface FoliageSubCellChunk {
    /** [KO] 전역 서브셀 고유 키 ((SZ << 16) | (SX & 0xFFFF)) [EN] Global sub-cell key */
    readonly subCellKey: number;
    /** [KO] 서브셀 X 인덱스 [EN] Sub-cell X index */
    readonly subCellX: number;
    /** [KO] 서브셀 Z 인덱스 [EN] Sub-cell Z index */
    readonly subCellZ: number;
    /** [KO] 서브셀 중심 월드 X (m) [EN] Sub-cell center world X */
    readonly centerX: number;
    /** [KO] 서브셀 중심 월드 Z (m) [EN] Sub-cell center world Z */
    readonly centerZ: number;
    /** [KO] 인스턴스 데이터 (인스턴스당 8 floats) [EN] Instance data buffer */
    readonly instanceData: Float32Array;
    /** [KO] 해당 서브셀의 인스턴스 개수 [EN] Instance count in this sub-cell */
    readonly instanceCount: number;

    /** [KO] 현재 GPU 메가버퍼 마운트 여부 [EN] Whether currently mounted in GPU buffer */
    isMounted: boolean;
    /** [KO] 메가버퍼 내 할당된 시작 인덱스 (-1: 언마운트) [EN] GPU allocation slot index */
    mountedSlotIndex: number;
}

class FoliageSubCellPartitioner {
    static readonly #STRIDE: number = 8;
    static readonly #tempFloat32: Float32Array = new Float32Array(2);
    static readonly #tempUint32: Uint32Array = new Uint32Array(FoliageSubCellPartitioner.#tempFloat32.buffer);

    /**
     * [KO] 타일 단위로 인스턴스를 생성하고, 이를 100m 서브셀 단위의 청크 맵으로 분할하여 반환합니다.
     * [EN] Generates instances for a tile and partitions them into a 100m sub-cell chunk map.
     */
    static partitionTile(
        comp: any,
        foliageType: any,
        landscape: any,
        subCellSize: number = 100.0,
        targetCountPerTile?: number
    ): Map<number, FoliageSubCellChunk> {
        const result = new Map<number, FoliageSubCellChunk>();

        const compCountX = landscape?.componentCount?.[0] ?? 8;
        const totalTiles = compCountX * compCountX;
        const maxInstances = foliageType.options.maxInstances;
        const countForThisTile = targetCountPerTile ?? Math.floor(maxInstances / totalTiles);
        if (countForThisTile <= 0) return result;

        const tileSizeMeters = comp.componentSizeQuads || ((landscape && landscape.worldSize) ? landscape.worldSize[0] / compCountX : 1000);
        const halfTile = tileSizeMeters * 0.5;

        const minX = comp.worldX - halfTile;
        const maxX = comp.worldX + halfTile;
        const minZ = comp.worldZ - halfTile;
        const maxZ = comp.worldZ + halfTile;

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
        const typeId = foliageType.allocation?.typeId ?? 0;

        const worldSizeX = landscape?.worldSize?.[0] ?? 16000.0;
        const worldSizeZ = landscape?.worldSize?.[1] ?? 16000.0;
        const halfWorldX = worldSizeX * 0.5;
        const halfWorldZ = worldSizeZ * 0.5;

        // 1. 임시 인스턴스 데이터를 서브셀 키별로 수집
        const tempBuckets = new Map<number, {
            subCellX: number;
            subCellZ: number;
            floats: number[];
            u32s: number[];
        }>();

        const invSubCell = 1.0 / subCellSize;

        for (let i = 0; i < countForThisTile; i++) {
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

            const scX = Math.floor((posX + halfWorldX) * invSubCell);
            const scZ = Math.floor((posZ + halfWorldZ) * invSubCell);
            const key = ((scZ << 16) | (scX & 0xFFFF)) | 0;

            let bucket = tempBuckets.get(key);
            if (!bucket) {
                bucket = {
                    subCellX: scX,
                    subCellZ: scZ,
                    floats: [],
                    u32s: []
                };
                tempBuckets.set(key, bucket);
            }

            const scaleX = minScale[0] + rScale * scaleDiffX;
            const scaleY = minScale[1] + rScale * scaleDiffY;
            const scaleZ = isUniformXZ ? scaleX : (minScale[2] + rScale * scaleDiffZ);

            let posY = 0.0;
            if (hasGetHeight) {
                posY = landscape.getHeightAt(posX, posZ);
            }

            let rotPackedY = 0;
            let rotPackedW = (32767 << 16) >>> 0;
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
                rotPackedY = ((iy & 0xFFFF) << 16) >>> 0;
                rotPackedW = ((iw & 0xFFFF) << 16) >>> 0;
            }

            let scalePacked = isUniformXZ
                ? FoliageSubCellPartitioner.#fastPackUniformScale(scaleX)
                : FoliageSubCellPartitioner.#fastPack2x16float(scaleX, scaleZ);

            bucket.floats.push(posX, posY, posZ, scaleY);
            bucket.u32s.push(rotPackedY, rotPackedW, scalePacked, typeId);
        }

        // 2. 최종 TypedArray 청크 버퍼 구축
        tempBuckets.forEach((bucket, key) => {
            const instCount = bucket.floats.length / 4;
            if (instCount === 0) return;

            const buffer = new Float32Array(instCount * FoliageSubCellPartitioner.#STRIDE);
            const u32View = new Uint32Array(buffer.buffer);

            for (let i = 0; i < instCount; i++) {
                const bOffset = i * FoliageSubCellPartitioner.#STRIDE;
                const fOffset = i * 4;
                buffer[bOffset] = bucket.floats[fOffset];
                buffer[bOffset + 1] = bucket.floats[fOffset + 1];
                buffer[bOffset + 2] = bucket.floats[fOffset + 2];
                buffer[bOffset + 3] = bucket.floats[fOffset + 3];

                u32View[bOffset + 4] = bucket.u32s[fOffset];
                u32View[bOffset + 5] = bucket.u32s[fOffset + 1];
                u32View[bOffset + 6] = bucket.u32s[fOffset + 2];
                buffer[bOffset + 7] = bucket.u32s[fOffset + 3]; // typeId as float
            }

            const centerX = (bucket.subCellX + 0.5) * subCellSize - halfWorldX;
            const centerZ = (bucket.subCellZ + 0.5) * subCellSize - halfWorldZ;

            result.set(key, {
                subCellKey: key,
                subCellX: bucket.subCellX,
                subCellZ: bucket.subCellZ,
                centerX,
                centerZ,
                instanceData: buffer,
                instanceCount: instCount,
                isMounted: false,
                mountedSlotIndex: -1
            });
        });

        return result;
    }

    static #fastFloatToHalf(val: number): number {
        FoliageSubCellPartitioner.#tempFloat32[0] = val;
        const f = FoliageSubCellPartitioner.#tempUint32[0];
        const sign = (f >> 16) & 0x8000;
        let exp = ((f >> 23) & 0xFF) - 127 + 15;
        let mant = (f >> 13) & 0x03FF;
        if (exp <= 0) return sign;
        if (exp >= 31) return sign | 0x7C00;
        return sign | (exp << 10) | mant;
    }

    static #fastPack2x16float(x: number, y: number): number {
        const tf = FoliageSubCellPartitioner.#tempFloat32;
        const tu = FoliageSubCellPartitioner.#tempUint32;
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

        return ((hx & 0xFFFF) | ((hy & 0xFFFF) << 16)) >>> 0;
    }

    static #fastPackUniformScale(scale: number): number {
        const h = FoliageSubCellPartitioner.#fastFloatToHalf(scale) & 0xFFFF;
        return (h | (h << 16)) >>> 0;
    }
}

Object.freeze(FoliageSubCellPartitioner);
export default FoliageSubCellPartitioner;
