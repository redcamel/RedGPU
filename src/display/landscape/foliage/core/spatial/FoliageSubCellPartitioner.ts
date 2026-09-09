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
        subCellSize: number = 100.0
    ): Map<number, FoliageSubCellChunk> {
        const result = new Map<number, FoliageSubCellChunk>();

        const compCountX = landscape?.componentCount?.[0] ?? 8;
        const tileSizeMeters = comp.componentSizeQuads || ((landscape && landscape.worldSize) ? landscape.worldSize[0] / compCountX : 1000);
        const halfTile = tileSizeMeters * 0.5;

        const minX = comp.worldX - halfTile;
        const maxX = comp.worldX + halfTile;
        const minZ = comp.worldZ - halfTile;
        const maxZ = comp.worldZ + halfTile;

        const rangeX = maxX - minX;
        const rangeZ = maxZ - minZ;

        // [Phase 4] 타일의 실제 물리 면적 기반 헥타르(ha) 산출 및 목표 인스턴스 계산
        const tileAreaMetersSq = rangeX * rangeZ;
        const tileHectares = tileAreaMetersSq / 10000.0;
        const densityPerHectare = foliageType.densityPerHectare ?? 20.0;
        const baseCount = Math.floor(densityPerHectare * tileHectares);
        const densityMul = foliageType.densityMultiplier ?? 1.0;
        const targetCount = Math.max(0, Math.floor(baseCount * densityMul));
        if (targetCount <= 0) return result;

        const {minScale, maxScale, randomRotationY} = foliageType.options;
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

        // 스플랫맵 타겟 레이어 탐색
        let targetLayerObj: any = null;
        const targetLayer = foliageType.targetLayer;
        if (targetLayer !== undefined && landscape?.layers) {
            if (typeof targetLayer === 'string') {
                targetLayerObj = landscape.layers.find((l: any) => l.name === targetLayer);
            } else if (typeof targetLayer === 'number') {
                targetLayerObj = landscape.layers[targetLayer];
            }
        }

        const minWeightThreshold = foliageType.minWeightThreshold ?? 0.1;
        const densityScaleByWeight = foliageType.densityScaleByWeight !== false;
        const minSlope = foliageType.minSlope ?? 0.0;
        const maxSlope = foliageType.maxSlope ?? 45.0;
        const hasSlopeFilter = hasGetHeight && (minSlope > 0.0 || maxSlope < 90.0);

        // 🍃 [Phase 5] 지형 법선 정렬 옵션
        const alignToNormal = foliageType.alignToNormal ?? false;
        const alignFactor = foliageType.alignFactor ?? 0.0;
        const needNormalAlign = hasGetHeight && alignToNormal && alignFactor > 0.001;

        // 1. 임시 인스턴스 데이터를 서브셀 키별로 수집
        const tempBuckets = new Map<number, {
            subCellX: number;
            subCellZ: number;
            floats: number[];
            u32s: number[];
        }>();

        const invSubCell = 1.0 / subCellSize;

        const maxAttempts = targetLayerObj ? targetCount * 3 : targetCount;
        let spawned = 0;

        for (let i = 0; i < maxAttempts && spawned < targetCount; i++) {
            seed ^= seed << 13;
            seed ^= seed >>> 17;
            seed ^= seed << 5;
            const rX = (seed >>> 0) / 4294967296.0;

            seed ^= seed << 13;
            seed ^= seed >>> 17;
            seed ^= seed << 5;
            const rZ = (seed >>> 0) / 4294967296.0;

            const posX = minX + rX * rangeX;
            const posZ = minZ + rZ * rangeZ;

            // 1. 스플랫맵 레이어 가중치 검사 (Rejection Sampling)
            if (targetLayerObj) {
                const u = (posX + halfWorldX) / worldSizeX;
                const v = (posZ + halfWorldZ) / worldSizeZ;
                const weight = targetLayerObj.getWeightAtUV(u, v);
                if (weight < minWeightThreshold) {
                    continue;
                }
                if (densityScaleByWeight) {
                    seed ^= seed << 13;
                    seed ^= seed >>> 17;
                    seed ^= seed << 5;
                    const rReject = (seed >>> 0) / 4294967296.0;
                    if (rReject > weight) {
                        continue;
                    }
                }
            }

            // 2. 지형 경사도(Slope) 검사
            if (hasSlopeFilter) {
                const step = 1.0;
                const hL = landscape.getHeightAt(posX - step, posZ);
                const hR = landscape.getHeightAt(posX + step, posZ);
                const hD = landscape.getHeightAt(posX, posZ - step);
                const hU = landscape.getHeightAt(posX, posZ + step);
                const nx = (hL - hR) / (2 * step);
                const nz = (hD - hU) / (2 * step);
                const invLen = 1.0 / Math.sqrt(nx * nx + 1.0 + nz * nz);
                const slopeDeg = Math.acos(Math.min(1.0, invLen)) * 57.29577951308232;
                if (slopeDeg < minSlope || slopeDeg > maxSlope) {
                    continue;
                }
            }

            seed ^= seed << 13;
            seed ^= seed >>> 17;
            seed ^= seed << 5;
            const rScale = (seed >>> 0) / 4294967296.0;

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

            let rotX = 0.0;
            let rotY = 0.0;
            let rotZ = 0.0;
            let rotW = 1.0;

            if (randomRotationY) {
                seed ^= seed << 13;
                seed ^= seed >>> 17;
                seed ^= seed << 5;
                const rAngle = (seed >>> 0) / 4294967296.0;
                const angle = rAngle * (Math.PI * 2);
                const halfAngle = angle * 0.5;
                rotY = Math.sin(halfAngle);
                rotW = Math.cos(halfAngle);
            }

            // 🍃 [Phase 5] 지형 경사면 법선 정렬 쿼터니언 합성 (Slerp & Quaternion Multiply)
            if (needNormalAlign) {
                const step = 1.0;
                const hL = landscape.getHeightAt(posX - step, posZ);
                const hR = landscape.getHeightAt(posX + step, posZ);
                const hD = landscape.getHeightAt(posX, posZ - step);
                const hU = landscape.getHeightAt(posX, posZ + step);
                const nx = (hL - hR) / (2 * step);
                const nz = (hD - hU) / (2 * step);
                const invLen = 1.0 / Math.sqrt(nx * nx + 1.0 + nz * nz);
                const normalX = nx * invLen;
                const normalY = invLen;
                const normalZ = nz * invLen;

                // U(0,1,0) x N(normalX, normalY, normalZ) = (normalZ, 0, -normalX)
                const vx = normalZ;
                const vz = -normalX;
                const vw = 1.0 + normalY;
                const tiltLen = Math.sqrt(vx * vx + vz * vz + vw * vw);
                if (tiltLen > 0.0001) {
                    const invTilt = 1.0 / tiltLen;
                    const tx = (vx * invTilt) * alignFactor;
                    const tz = (vz * invTilt) * alignFactor;
                    const tw = (1.0 - alignFactor) + (vw * invTilt) * alignFactor;
                    const alignLen = Math.sqrt(tx * tx + tz * tz + tw * tw);
                    const invAlign = 1.0 / (alignLen > 0.0001 ? alignLen : 1.0);
                    const ax = tx * invAlign;
                    const az = tz * invAlign;
                    const aw = tw * invAlign;

                    // q_final = q_align(ax, 0, az, aw) * q_randY(0, rotY, 0, rotW)
                    const fx = ax * rotW - az * rotY;
                    const fy = aw * rotY;
                    const fz = az * rotW + ax * rotY;
                    const fw = aw * rotW;

                    rotX = fx;
                    rotY = fy;
                    rotZ = fz;
                    rotW = fw;
                }
            }

            const ix = Math.max(-32768, Math.min(32767, (rotX * 32767) | 0));
            const iy = Math.max(-32768, Math.min(32767, (rotY * 32767) | 0));
            const iz = Math.max(-32768, Math.min(32767, (rotZ * 32767) | 0));
            const iw = Math.max(-32768, Math.min(32767, (rotW * 32767) | 0));

            const rotPackedY = ((ix & 0xFFFF) | ((iy & 0xFFFF) << 16)) >>> 0;
            const rotPackedW = ((iz & 0xFFFF) | ((iw & 0xFFFF) << 16)) >>> 0;

            let scalePacked = isUniformXZ
                ? FoliageSubCellPartitioner.#fastPackUniformScale(scaleX)
                : FoliageSubCellPartitioner.#fastPack2x16float(scaleX, scaleZ);

            bucket.floats.push(posX, posY, posZ, scaleY);
            bucket.u32s.push(rotPackedY, rotPackedW, scalePacked, typeId);
            spawned++;
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
