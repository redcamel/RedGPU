/**
 * [KO] 지형 컴포넌트 타일 내 식생 인스턴스를 서브셀 단위로 분할 배치하는 파티셔너 모듈입니다.
 * [EN] Foliage sub-cell partitioner module for dividing and distributing instances into sub-cells within terrain tiles.
 * @packageDocumentation
 */

import {
    computeScatterGridSeed,
    fastPack2x16float,
    fastPackUniformScale,
    packSubCellKey,
    sampleNormalizedLayerWeight
} from "../../../core/scatter";

/**
 * [KO] 식생 인스턴스의 불변 월드 배치 좌표 및 의사난수 시드를 산출하는 고정 스캐터 그리드 크기 (단위: 미터, 100m = 1 헥타르).
 *      서브셀 스트리밍 크기(subCellSize)가 변경되어도 월드 상의 나무 위치, 회전, 스케일이 100% 불변으로 유지되도록 보장합니다.
 * [EN] Fixed scatter grid size (100m = 1 hectare) for computing immutable world placement coordinates and PRNG seeds.
 *      Ensures tree positions, rotations, and scales remain 100% invariant in the world even if subCellSize changes.
 */
export const FIXED_SCATTER_GRID_SIZE: number = 100.0;

/**
 * [KO] 식생 서브셀 데이터 인터페이스입니다. (인스턴스 배열을 상시 보관하지 않는 경량 메타데이터 구조체)
 * [EN] Foliage subcell data interface. (Lightweight metadata struct without persistent instance array)
 */
export interface FoliageSubCell {
    /**
     * [KO] 서브셀 고유 정수 키
     * [EN] Unique integer key for the sub-cell
     */
    subCellKey: number;
    /**
     * [KO] 서브셀 정수 그리드 X 좌표
     * [EN] Sub-cell integer grid X coordinate
     */
    subCellX: number;
    /**
     * [KO] 서브셀 정수 그리드 Z 좌표
     * [EN] Sub-cell integer grid Z coordinate
     */
    subCellZ: number;
    /**
     * [KO] 서브셀 월드 중심 X 좌표
     * [EN] Sub-cell world center X coordinate
     */
    centerX: number;
    /**
     * [KO] 서브셀 월드 중심 Z 좌표
     * [EN] Sub-cell world center Z coordinate
     */
    centerZ: number;
    /**
     * [KO] 서브셀 내 유효 인스턴스 수
     * [EN] Number of valid instances in the sub-cell
     */
    instanceCount: number;
    /**
     * [KO] 메가 버퍼에 마운트(업로드)되었는지 여부
     * [EN] Whether currently mounted (uploaded) into mega buffer
     */
    isMounted: boolean;
    /**
     * [KO] 메가 버퍼 내 할당된 슬롯 인덱스 (-1이면 미마운트)
     * [EN] Allocated slot index in mega buffer (-1 if unmounted)
     */
    mountedSlotIndex: number;
}


/**
 * [KO] 지형 타일을 일정한 크기의 서브셀(SubCell) 그리드로 분할하고 식생 인스턴스를 배치하는 파티셔너 클래스입니다.
 * [EN] Partitioner class that divides terrain tiles into fixed-size subcell grids and places foliage instances.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export default class FoliageSubCellPartitioner {

    /**
     * [KO] 지형 컴포넌트 타일을 서브셀 그리드로 분할하고 서브셀별 유효 인스턴스 수량을 계산하여 경량 서브셀 맵을 생성합니다.
     * [EN] Partitions a terrain component tile into a sub-cell grid and computes valid instance count per sub-cell into a lightweight sub-cell map.
     *
     * @param comp - 대상 지형 컴포넌트(타일)
     * @param foliage - 배치할 식생 객체
     * @param landscape - 부모 Landscape 인스턴스
     * @param subCellSize - 서브셀 가로세로 크기(미터, 기본값: 100.0)
     * @returns 서브셀 키별 생성된 경량 서브셀 맵
     */
    static partitionTile(
        comp: any,
        foliageType: any,
        landscape: any,
        subCellSize: number = 100.0
    ): Map<number, FoliageSubCell> {
        const result = new Map<number, FoliageSubCell>();

        const compCountX = landscape?.componentCount?.[0] ?? 8;
        const tileSizeMeters = comp.componentSizeQuads || ((landscape && landscape.worldSize) ? landscape.worldSize[0] / compCountX : 1000);
        const halfTile = tileSizeMeters * 0.5;

        const tileMinX = comp.worldX - halfTile;
        const tileMaxX = comp.worldX + halfTile;
        const tileMinZ = comp.worldZ - halfTile;
        const tileMaxZ = comp.worldZ + halfTile;

        const worldSizeX = landscape?.worldSize?.[0] ?? 16000.0;
        const worldSizeZ = landscape?.worldSize?.[1] ?? 16000.0;
        const halfWorldX = worldSizeX * 0.5;
        const halfWorldZ = worldSizeZ * 0.5;

        const invSubCell = 1.0 / subCellSize;

        const startScX = Math.floor((tileMinX + halfWorldX) * invSubCell);
        const endScX = Math.floor((tileMaxX + halfWorldX - 0.001) * invSubCell);
        const startScZ = Math.floor((tileMinZ + halfWorldZ) * invSubCell);
        const endScZ = Math.floor((tileMaxZ + halfWorldZ - 0.001) * invSubCell);

        const densityPerHectare = foliageType.densityPerHectare !== undefined
            ? foliageType.densityPerHectare
            : (foliageType.instancesPerCell ?? 20);
        const densityMultiplier = foliageType.densityMultiplier ?? 1.0;
        const targetCountPerHectare = Math.max(0, Math.round(densityPerHectare * densityMultiplier));
        if (targetCountPerHectare <= 0) return result;

        const nameHash = foliageType.nameHash;
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

        const densityScaleByWeight = foliageType.densityScaleByWeight !== false;
        const hasGetHeight = typeof landscape?.getHeightAt === 'function';
        const minSlope = foliageType.minSlope ?? 0.0;
        const maxSlope = foliageType.maxSlope ?? 45.0;
        const hasSlopeFilter = hasGetHeight && (minSlope > 0.0 || maxSlope < 90.0);

        for (let scZ = startScZ; scZ <= endScZ; scZ++) {
            for (let scX = startScX; scX <= endScX; scX++) {
                const key = packSubCellKey(scX, scZ);

                const subMinX = scX * subCellSize - halfWorldX;
                const subMaxX = subMinX + subCellSize;
                const subMinZ = scZ * subCellSize - halfWorldZ;
                const subMaxZ = subMinZ + subCellSize;

                const startGx = Math.floor((subMinX + halfWorldX) / FIXED_SCATTER_GRID_SIZE);
                const endGx = Math.floor((subMaxX + halfWorldX - 0.001) / FIXED_SCATTER_GRID_SIZE);
                const startGz = Math.floor((subMinZ + halfWorldZ) / FIXED_SCATTER_GRID_SIZE);
                const endGz = Math.floor((subMaxZ + halfWorldZ - 0.001) / FIXED_SCATTER_GRID_SIZE);

                let validCount = 0;

                for (let gz = startGz; gz <= endGz; gz++) {
                    const gridMinZ = gz * FIXED_SCATTER_GRID_SIZE - halfWorldZ;
                    for (let gx = startGx; gx <= endGx; gx++) {
                        const gridMinX = gx * FIXED_SCATTER_GRID_SIZE - halfWorldX;
                        let seed = computeScatterGridSeed(gx, gz, nameHash);

                        const maxAttempts = densityScaleByWeight
                            ? targetCountPerHectare
                            : ((targetLayerObj || hasSlopeFilter) ? targetCountPerHectare * 2 : targetCountPerHectare);
                        let generatedInGrid = 0;

                        for (let i = 0; i < maxAttempts && generatedInGrid < targetCountPerHectare; i++) {
                            seed ^= seed << 13;
                            seed ^= seed >>> 17;
                            seed ^= seed << 5;
                            const rX = (seed >>> 0) / 4294967296.0;

                            seed ^= seed << 13;
                            seed ^= seed >>> 17;
                            seed ^= seed << 5;
                            const rZ = (seed >>> 0) / 4294967296.0;

                            const posX = gridMinX + rX * FIXED_SCATTER_GRID_SIZE;
                            const posZ = gridMinZ + rZ * FIXED_SCATTER_GRID_SIZE;

                            if (targetLayerObj) {
                                const u = (posX + halfWorldX) / worldSizeX;
                                const v = (posZ + halfWorldZ) / worldSizeZ;
                                const weight = sampleNormalizedLayerWeight(landscape, targetLayerObj, u, v);
                                if (weight < 0.1) continue;
                                if (densityScaleByWeight) {
                                    seed ^= seed << 13;
                                    seed ^= seed >>> 17;
                                    seed ^= seed << 5;
                                    const rReject = (seed >>> 0) / 4294967296.0;
                                    if (rReject > weight) continue;
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
                                if (slopeDeg < minSlope || slopeDeg > maxSlope) continue;
                            }

                            // 회전/스케일 난수 소비를 동기화하기 위한 난수 전진
                            seed ^= seed << 13;
                            seed ^= seed >>> 17;
                            seed ^= seed << 5; // rScale

                            if (foliageType.options?.randomRotationY) {
                                seed ^= seed << 13;
                                seed ^= seed >>> 17;
                                seed ^= seed << 5; // rAngle
                            }

                            generatedInGrid++;

                            if (posX >= subMinX && posX < subMaxX && posZ >= subMinZ && posZ < subMaxZ) {
                                validCount++;
                            }
                        }
                    }
                }

                if (validCount > 0) {
                    const centerX = (scX + 0.5) * subCellSize - halfWorldX;
                    const centerZ = (scZ + 0.5) * subCellSize - halfWorldZ;
                    result.set(key, {
                        subCellKey: key,
                        subCellX: scX,
                        subCellZ: scZ,
                        centerX,
                        centerZ,
                        instanceCount: validCount,
                        isMounted: false,
                        mountedSlotIndex: -1
                    });
                }
            }
        }

        return result;
    }

    /**
     * [KO] 서브셀이 GPU 메가버퍼에 마운트되는 시점에 호출되어, 사전 할당된 메가버퍼 스테이징 배열의 해당 슬롯 구간에 인스턴스 데이터를 직접 인라인 기록합니다. (Zero-GC & Zero-CPU-RAM)
     * [EN] Invoked when a sub-cell is mounted to the GPU mega-buffer, directly writing instance data inline into the pre-allocated staging buffer slot range. (Zero-GC & Zero-CPU-RAM)
     *
     * @param f32 - 메가버퍼의 사전 할당된 CPU 스테이징 Float32Array 뷰
     * @param u32 - 메가버퍼의 사전 할당된 CPU 스테이징 Uint32Array 뷰
     * @param baseFloat - 쓰기 시작할 float 오프셋
     * @param subCell - 마운트할 서브셀 객체
     * @param foliage - 식생 객체
     * @param landscape - 부모 Landscape 인스턴스
     * @param subCellSize - 서브셀 가로세로 크기(미터, 기본값: 100.0)
     */
    static populateSubCellInstances(
        f32: Float32Array,
        u32: Uint32Array,
        baseFloat: number,
        subCell: FoliageSubCell,
        foliage: any,
        landscape: any,
        subCellSize: number = 100.0
    ): void {
        const strideFloats = foliage?.megaBuffer?.strideFloats || 8;

        const densityPerHectare = foliage.densityPerHectare !== undefined
            ? foliage.densityPerHectare
            : (foliage.instancesPerCell ?? 20);
        const densityMultiplier = foliage.densityMultiplier ?? 1.0;
        const targetCountPerHectare = Math.max(0, Math.round(densityPerHectare * densityMultiplier));
        if (targetCountPerHectare <= 0 || subCell.instanceCount <= 0) return;

        const worldSizeX = landscape?.worldSize?.[0] ?? 16000.0;
        const worldSizeZ = landscape?.worldSize?.[1] ?? 16000.0;
        const halfWorldX = worldSizeX * 0.5;
        const halfWorldZ = worldSizeZ * 0.5;

        const subMinX = subCell.subCellX * subCellSize - halfWorldX;
        const subMaxX = subMinX + subCellSize;
        const subMinZ = subCell.subCellZ * subCellSize - halfWorldZ;
        const subMaxZ = subMinZ + subCellSize;

        const startGx = Math.floor((subMinX + halfWorldX) / FIXED_SCATTER_GRID_SIZE);
        const endGx = Math.floor((subMaxX + halfWorldX - 0.001) / FIXED_SCATTER_GRID_SIZE);
        const startGz = Math.floor((subMinZ + halfWorldZ) / FIXED_SCATTER_GRID_SIZE);
        const endGz = Math.floor((subMaxZ + halfWorldZ - 0.001) / FIXED_SCATTER_GRID_SIZE);

        const {minScale, maxScale, randomRotationY} = foliage.options || {};
        const optMinScale = minScale || [1.0, 1.0, 1.0];
        const optMaxScale = maxScale || [1.0, 1.0, 1.0];
        const scaleDiffX = optMaxScale[0] - optMinScale[0];
        const scaleDiffY = optMaxScale[1] - optMinScale[1];
        const scaleDiffZ = optMaxScale[2] - optMinScale[2];
        const isUniformXZ = (scaleDiffX === scaleDiffZ && optMinScale[0] === optMinScale[2]);

        const targetLayer = foliage.targetLayer;
        const hasTargetLayer = targetLayer !== undefined && targetLayer !== '';
        let targetLayerObj: any = null;
        if (hasTargetLayer && landscape?.layers) {
            if (typeof targetLayer === 'string') {
                targetLayerObj = landscape.layers.find((l: any) => l.name === targetLayer);
            } else if (typeof targetLayer === 'number') {
                targetLayerObj = landscape.layers[targetLayer];
            }
        }

        const densityScaleByWeight = foliage.densityScaleByWeight !== false;
        const hasGetHeight = typeof landscape?.getHeightAt === 'function';
        const minSlope = foliage.minSlope ?? 0.0;
        const maxSlope = foliage.maxSlope ?? 45.0;
        const hasSlopeFilter = hasGetHeight && (minSlope > 0.0 || maxSlope < 90.0);

        const alignToNormal = foliage.alignToNormal ?? false;
        const alignFactor = foliage.alignFactor ?? 1.0;
        const needNormalAlign = hasGetHeight && alignToNormal && alignFactor > 0.001;

        const typeId = foliage.allocation?.typeId ?? 0;
        let written = 0;

        for (let gz = startGz; gz <= endGz && written < subCell.instanceCount; gz++) {
            const gridMinZ = gz * FIXED_SCATTER_GRID_SIZE - halfWorldZ;
            for (let gx = startGx; gx <= endGx && written < subCell.instanceCount; gx++) {
                const gridMinX = gx * FIXED_SCATTER_GRID_SIZE - halfWorldX;
                let seed = computeScatterGridSeed(gx, gz, foliage.nameHash);

                const maxAttempts = densityScaleByWeight
                    ? targetCountPerHectare
                    : ((targetLayerObj || hasSlopeFilter) ? targetCountPerHectare * 2 : targetCountPerHectare);
                let generatedInGrid = 0;

                for (let i = 0; i < maxAttempts && generatedInGrid < targetCountPerHectare && written < subCell.instanceCount; i++) {
                    seed ^= seed << 13;
                    seed ^= seed >>> 17;
                    seed ^= seed << 5;
                    const rX = (seed >>> 0) / 4294967296.0;

                    seed ^= seed << 13;
                    seed ^= seed >>> 17;
                    seed ^= seed << 5;
                    const rZ = (seed >>> 0) / 4294967296.0;

                    const posX = gridMinX + rX * FIXED_SCATTER_GRID_SIZE;
                    const posZ = gridMinZ + rZ * FIXED_SCATTER_GRID_SIZE;

                    if (targetLayerObj) {
                        const u = (posX + halfWorldX) / worldSizeX;
                        const v = (posZ + halfWorldZ) / worldSizeZ;
                        const weight = sampleNormalizedLayerWeight(landscape, targetLayerObj, u, v);
                        if (weight < 0.1) continue;
                        if (densityScaleByWeight) {
                            seed ^= seed << 13;
                            seed ^= seed >>> 17;
                            seed ^= seed << 5;
                            const rReject = (seed >>> 0) / 4294967296.0;
                            if (rReject > weight) continue;
                        }
                    }

                    let normalX = 0.0;
                    let normalY = 1.0;
                    let normalZ = 0.0;

                    if (hasSlopeFilter || needNormalAlign) {
                        const step = 1.0;
                        const hL = landscape.getHeightAt(posX - step, posZ);
                        const hR = landscape.getHeightAt(posX + step, posZ);
                        const hD = landscape.getHeightAt(posX, posZ - step);
                        const hU = landscape.getHeightAt(posX, posZ + step);
                        const nx = (hL - hR) / (2 * step);
                        const nz = (hD - hU) / (2 * step);
                        const invLen = 1.0 / Math.sqrt(nx * nx + 1.0 + nz * nz);

                        if (hasSlopeFilter) {
                            const slopeDeg = Math.acos(Math.min(1.0, invLen)) * 57.29577951308232;
                            if (slopeDeg < minSlope || slopeDeg > maxSlope) continue;
                        }

                        if (needNormalAlign) {
                            normalX = nx * invLen;
                            normalY = invLen;
                            normalZ = nz * invLen;
                        }
                    }

                    seed ^= seed << 13;
                    seed ^= seed >>> 17;
                    seed ^= seed << 5;
                    const rScale = (seed >>> 0) / 4294967296.0;

                    const scaleX = optMinScale[0] + rScale * scaleDiffX;
                    const scaleY = optMinScale[1] + rScale * scaleDiffY;
                    const scaleZ = isUniformXZ ? scaleX : (optMinScale[2] + rScale * scaleDiffZ);

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

                    generatedInGrid++;

                    if (posX >= subMinX && posX < subMaxX && posZ >= subMinZ && posZ < subMaxZ) {
                        const ix = Math.max(-32768, Math.min(32767, (rotX * 32767) | 0));
                        const iy = Math.max(-32768, Math.min(32767, (rotY * 32767) | 0));
                        const iz = Math.max(-32768, Math.min(32767, (rotZ * 32767) | 0));
                        const iw = Math.max(-32768, Math.min(32767, (rotW * 32767) | 0));

                        const rotPackedY = ((ix & 0xFFFF) | ((iy & 0xFFFF) << 16)) >>> 0;
                        const rotPackedW = ((iz & 0xFFFF) | ((iw & 0xFFFF) << 16)) >>> 0;

                        const scalePacked = isUniformXZ
                            ? fastPackUniformScale(scaleX)
                            : fastPack2x16float(scaleX, scaleZ);

                        const outOffset = baseFloat + written * strideFloats;
                        f32[outOffset + 0] = posX;
                        f32[outOffset + 1] = posY;
                        f32[outOffset + 2] = posZ;
                        f32[outOffset + 3] = scaleY;

                        u32[outOffset + 4] = rotPackedY;
                        u32[outOffset + 5] = rotPackedW;
                        u32[outOffset + 6] = scalePacked;
                        u32[outOffset + 7] = typeId;

                        written++;
                    }
                }
            }
        }
    }
}

Object.freeze(FoliageSubCellPartitioner);
