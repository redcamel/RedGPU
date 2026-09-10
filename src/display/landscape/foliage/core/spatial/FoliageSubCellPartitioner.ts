

export interface FoliageSubCellChunk {

    readonly subCellKey: number;

    readonly subCellX: number;

    readonly subCellZ: number;

    readonly centerX: number;

    readonly centerZ: number;

    readonly instanceData: Float32Array;

    readonly instanceCount: number;

    isMounted: boolean;

    mountedSlotIndex: number;
}

class FoliageSubCellPartitioner {
    static readonly #STRIDE: number = 8;
    static readonly #tempFloat32: Float32Array = new Float32Array(2);
    static readonly #tempUint32: Uint32Array = new Uint32Array(FoliageSubCellPartitioner.#tempFloat32.buffer);

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

        const targetLayer = foliageType.targetLayer;
        const hasTargetLayer = targetLayer !== undefined && targetLayer !== '';
        let targetLayerObj: any = null;
        if (hasTargetLayer && landscape?.layers) {
            if (typeof targetLayer === 'string') {
                targetLayerObj = landscape.layers.find((l: any) => l.name === targetLayer);
            } else if (typeof targetLayer === 'number') {
                targetLayerObj = landscape.layers[targetLayer];
            }
        }

        if (hasTargetLayer && !targetLayerObj) {
            return result;
        }

        const minWeightThreshold = foliageType.minWeightThreshold ?? 0.1;
        const densityScaleByWeight = foliageType.densityScaleByWeight !== false;
        const minSlope = foliageType.minSlope ?? 0.0;
        const maxSlope = foliageType.maxSlope ?? 45.0;
        const hasSlopeFilter = hasGetHeight && (minSlope > 0.0 || maxSlope < 90.0);

        const alignToNormal = foliageType.alignToNormal ?? false;
        const alignFactor = foliageType.alignFactor ?? 0.0;
        const needNormalAlign = hasGetHeight && alignToNormal && alignFactor > 0.001;

        const tempBuckets = new Map<number, {
            subCellX: number;
            subCellZ: number;
            floats: number[];
            u32s: number[];
        }>();

        const invSubCell = 1.0 / subCellSize;

        const maxAttempts = densityScaleByWeight ? targetCount : ((targetLayerObj || hasSlopeFilter) ? targetCount * 2 : targetCount);
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

            if (targetLayerObj) {
                const u = (posX + halfWorldX) / worldSizeX;
                const v = (posZ + halfWorldZ) / worldSizeZ;
                const weight = FoliageSubCellPartitioner.#getLayerWeight(landscape, targetLayerObj, u, v);
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
                buffer[bOffset + 7] = bucket.u32s[fOffset + 3];
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

    static #getLayerWeight(landscape: any, targetLayer: any, u: number, v: number): number {
        const layers = landscape?.layers;
        if (!layers || layers.length <= 1) {
            return targetLayer.getWeightAtUV(u, v);
        }

        let activeWeightLayerCount = 0;
        let totalWeight = 0.0;
        let targetWeight = 0.0;

        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            if (!layer.enabled) continue;
            if (layer.weightTexture?.src) {
                activeWeightLayerCount++;
            }
            const w = layer.getWeightAtUV(u, v);
            totalWeight += w;
            if (layer === targetLayer) {
                targetWeight = w;
            }
        }

        if (activeWeightLayerCount <= 1 || totalWeight <= 0.001) {
            return targetWeight;
        }

        return targetWeight / totalWeight;
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
