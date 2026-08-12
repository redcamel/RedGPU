export interface TerrainTileKey {
    gridX: number;
    gridZ: number;
    key: string;
}

export type TileState = 'UNLOADED' | 'LOADING' | 'LOADED';

/**
 * Terrain GPU 인스턴싱 버퍼 레이아웃 명세 (Float32Array 16개 = 64 Bytes per Instance)
 * [0..3]   : worldMinX, worldMinZ, scaleX, scaleZ
 * [4..7]   : atlasTileCol, atlasTileRow, lodLevel, rvtPageIndex
 * [8..11]  : minY, maxY, distanceToCamera, priority
 * [12..15] : reserved / flags (padded for 16-float GPU alignment)
 */
export const TERRAIN_INSTANCE_FLOAT_STRIDE = 16;

export interface SpatialTileInfo {
    gridX: number;
    gridZ: number;
    worldBounds: [number, number, number, number];
    distanceToCamera: number;
    priority: number;
    state: TileState;

    // LOD & RVT & Culling 속성 (Primary Tile)
    lodLevel?: number;
    rvtPageIndex?: number;
    minY?: number;
    maxY?: number;
    inFrustum?: boolean;

    cellKey?: string;
    tileCol?: number;
    tileRow?: number;
    atlasKey?: string;
    tileColStr?: string;
    tileRowStr?: string;
}

export function getSpatialTileHash(lodLevel: number, gridX: number, gridZ: number): number {
    return ((lodLevel & 0xF) << 28) | (((gridX + 8192) & 0x3FFF) << 14) | ((gridZ + 8192) & 0x3FFF);
}

export class TerrainSpatialGrid {
    #cellSize: number = 256;
    #loadingRadius: number = 2560;
    #maxLoadsPerFrame: number = 2;
    #activeTiles: Map<number, SpatialTileInfo> = new Map();
    #activeTileList: SpatialTileInfo[] = [];
    #pendingQueue: Map<number, SpatialTileInfo> = new Map();
    #pendingTileList: SpatialTileInfo[] = [];
    #pendingBuffer: SpatialTileInfo[] = [];
    readonly #buckets: SpatialTileInfo[][] = Array.from({length: 64}, () => []);
    #tileInfoPool: SpatialTileInfo[] = [];
    readonly #currentFrameKeys: Set<number> = new Set();
    readonly #toLoadBuffer: SpatialTileInfo[] = [];
    readonly #toUnloadBuffer: SpatialTileInfo[] = [];
    readonly #result: { toLoad: SpatialTileInfo[]; toUnload: SpatialTileInfo[] } = {
        toLoad: this.#toLoadBuffer,
        toUnload: this.#toUnloadBuffer
    };
    #lastCameraGridX: number = NaN;
    #lastCameraGridZ: number = NaN;

    #terrainBounds: [number, number, number, number] | null = [-5000, -5000, 5000, 5000];

    #maxLOD: number = 4;

    constructor(cellSize: number = 256, loadingRadius: number = 2560) {
        this.#cellSize = cellSize;
        this.#loadingRadius = loadingRadius;
    }

    get maxLOD(): number {
        return this.#maxLOD;
    }

    set maxLOD(val: number) {
        this.#maxLOD = val;
    }

    get terrainBounds(): [number, number, number, number] | null {
        return this.#terrainBounds;
    }

    get cellSize(): number {
        return this.#cellSize;
    }

    set cellSize(val: number) {
        this.#cellSize = val;
    }

    get loadingRadius(): number {
        return this.#loadingRadius;
    }

    set loadingRadius(val: number) {
        this.#loadingRadius = val;
    }

    get maxLoadsPerFrame(): number {
        return this.#maxLoadsPerFrame;
    }

    set maxLoadsPerFrame(val: number) {
        this.#maxLoadsPerFrame = val;
    }

    get pendingQueueSize(): number {
        return this.#pendingQueue.size;
    }

    get activeTiles(): Map<number, SpatialTileInfo> {
        return this.#activeTiles;
    }

    get activeTileList(): readonly SpatialTileInfo[] {
        return this.#activeTileList;
    }


    update(
        camera: any,
        worldOffset?: [number, number],
        worldSize?: [number, number],
        renderViewStateData?: any,
        minY: number = -100,
        maxY: number = 1000
    ): {
        toLoad: SpatialTileInfo[];
        toUnload: SpatialTileInfo[];
    } {
        if (worldOffset && worldSize) {
            const minX = worldOffset[0];
            const minZ = worldOffset[1];
            const maxX = minX + worldSize[0];
            const maxZ = minZ + worldSize[1];
            this.#terrainBounds = [minX, minZ, maxX, maxZ];
        }

        const camX = camera.x;
        const camZ = camera.z;

        const frustumPlanes = renderViewStateData?.frustumPlanes || renderViewStateData?.view?.frustumPlanes;
        const heightRange = Math.abs(maxY - minY);
        const heightPadding = Math.max(20.0, heightRange * 0.1);
        const paddedMinY = minY - heightPadding;
        const paddedMaxY = maxY + heightPadding;

        const centerGridX = Math.floor(camX / this.#cellSize);
        const centerGridZ = Math.floor(camZ / this.#cellSize);
        const toLoad = this.#toLoadBuffer;
        const toUnload = this.#toUnloadBuffer;
        toLoad.length = 0;
        toUnload.length = 0;

        if (centerGridX !== this.#lastCameraGridX || centerGridZ !== this.#lastCameraGridZ) {
            this.#lastCameraGridX = centerGridX;
            this.#lastCameraGridZ = centerGridZ;
        }

        const currentFrameKeys = this.#currentFrameKeys;
        currentFrameKeys.clear();

        const [tbMinX, tbMinZ, tbMaxX, tbMaxZ] = this.#terrainBounds || [-Infinity, -Infinity, Infinity, Infinity];

        let dirX = 0, dirY = 0, dirZ = 0;
        let hasDir = false;
        if (camera?.viewMatrix) {
            const vm = camera.viewMatrix;
            const fx = -vm[2];
            const fy = -vm[6];
            const fz = -vm[10];
            const len = Math.hypot(fx, fy, fz);
            if (len > 0.0001) {
                dirX = fx / len;
                dirY = fy / len;
                dirZ = fz / len;
                hasDir = true;
            }
        }

        const baseCellSize = this.#cellSize;
        const tileCenterY = (minY + maxY) * 0.5;
        const maxLOD = Math.max(0, Math.min(7, this.#maxLOD));
        const rootCellSize = baseCellSize * (1 << maxLOD);

        const startGX = Math.floor(tbMinX / rootCellSize);
        const endGX = Math.ceil(tbMaxX / rootCellSize);
        const startGZ = Math.floor(tbMinZ / rootCellSize);
        const endGZ = Math.ceil(tbMaxZ / rootCellSize);

        for (let gx = startGX; gx <= endGX; gx++) {
            for (let gz = startGZ; gz <= endGZ; gz++) {
                this.#evaluateLODNode(
                    maxLOD,
                    gx, gz,
                    camX, camZ,
                    camera,
                    frustumPlanes,
                    paddedMinY, paddedMaxY,
                    hasDir, dirX, dirY, dirZ,
                    currentFrameKeys,
                    tbMinX, tbMinZ, tbMaxX, tbMaxZ,
                    tileCenterY
                );
            }
        }

        // Iterator 없이 고정 배열 #activeTileList에서 언로드 대상 탐색 및 O(1) Swap-Remove
        for (let i = this.#activeTileList.length - 1; i >= 0; i--) {
            const tile = this.#activeTileList[i];
            const key = getSpatialTileHash(tile.lodLevel ?? 0, tile.gridX, tile.gridZ);
            if (!currentFrameKeys.has(key)) {
                tile.state = 'UNLOADED';
                toUnload.push(tile);
                this.#activeTiles.delete(key);

                const lastIdx = this.#activeTileList.length - 1;
                if (i < lastIdx) {
                    this.#activeTileList[i] = this.#activeTileList[lastIdx];
                }
                this.#activeTileList.pop();
            }
        }

        // Iterator 없이 #pendingTileList 고정 배열에서 해제 대상 탐색 및 O(1) Swap-Remove
        for (let i = this.#pendingTileList.length - 1; i >= 0; i--) {
            const pendingTile = this.#pendingTileList[i];
            const key = getSpatialTileHash(pendingTile.lodLevel ?? 0, pendingTile.gridX, pendingTile.gridZ);
            if (!currentFrameKeys.has(key)) {
                this.#pendingQueue.delete(key);
                this.#recycleTileInfo(pendingTile);

                const lastIdx = this.#pendingTileList.length - 1;
                if (i < lastIdx) {
                    this.#pendingTileList[i] = this.#pendingTileList[lastIdx];
                }
                this.#pendingTileList.pop();
            }
        }

        const pendingBuffer = this.#pendingBuffer;
        pendingBuffer.length = 0;

        const buckets = this.#buckets;
        for (let i = 0; i < 64; i++) {
            buckets[i].length = 0;
        }

        // Iterator 없이 인덱스 기반 버킷 정렬
        const pendingTileCount = this.#pendingTileList.length;
        for (let i = 0; i < pendingTileCount; i++) {
            const tile = this.#pendingTileList[i];
            const bIdx = Math.max(0, Math.min(63, Math.floor(tile.priority)));
            buckets[bIdx].push(tile);
        }

        for (let b = 63; b >= 0; b--) {
            const bucket = buckets[b];
            for (let i = 0; i < bucket.length; i++) {
                pendingBuffer.push(bucket[i]);
            }
        }

        const pendingCount = pendingBuffer.length;
        const loadBudget = (this.#maxLoadsPerFrame > 0 && this.#maxLoadsPerFrame < pendingCount)
            ? this.#maxLoadsPerFrame
            : pendingCount;

        for (let i = 0; i < loadBudget; i++) {
            const tile = pendingBuffer[i];
            const key = getSpatialTileHash(tile.lodLevel ?? 0, tile.gridX, tile.gridZ);
            tile.state = 'LOADED';
            this.#removeFromPending(key);
            this.#activeTiles.set(key, tile);
            this.#activeTileList.push(tile);
            toLoad.push(tile);
        }

        return this.#result;
    }

    destroy(): void {
        this.#activeTiles.clear();
        this.#activeTileList.length = 0;
        this.#pendingQueue.clear();
        this.#pendingTileList.length = 0;
        this.#pendingBuffer.length = 0;
        this.#tileInfoPool.length = 0;
        this.#currentFrameKeys.clear();
        this.#toLoadBuffer.length = 0;
        this.#toUnloadBuffer.length = 0;
        for (let i = 0; i < 64; i++) {
            this.#buckets[i].length = 0;
        }
    }

    #addToPending(key: number, tileInfo: SpatialTileInfo) {
        this.#pendingQueue.set(key, tileInfo);
        this.#pendingTileList.push(tileInfo);
    }

    #checkAABBInFrustum(
        minX: number, minY: number, minZ: number,
        maxX: number, maxY: number, maxZ: number,
        frustumPlanes: any
    ): boolean {
        if (!frustumPlanes || frustumPlanes.length < 6) return true;

        for (let i = 0; i < 6; i++) {
            const plane = frustumPlanes[i];
            const a = plane[0];
            const b = plane[1];
            const c = plane[2];
            const d = plane[3];

            const pX = a > 0 ? maxX : minX;
            const pY = b > 0 ? maxY : minY;
            const pZ = c > 0 ? maxZ : minZ;

            if (a * pX + b * pY + c * pZ + d < 0) {
                return false;
            }
        }
        return true;
    }

    #evaluateLODNode(
        lodLevel: number,
        gx: number,
        gz: number,
        camX: number,
        camZ: number,
        camera: any,
        frustumPlanes: any[],
        paddedMinY: number,
        paddedMaxY: number,
        hasDir: boolean,
        dirX: number, dirY: number, dirZ: number,
        currentFrameKeys: Set<number>,
        tbMinX: number, tbMinZ: number, tbMaxX: number, tbMaxZ: number,
        tileCenterY: number
    ): void {
        const curCellSize = this.#cellSize * (1 << lodLevel);
        const minX = gx * curCellSize;
        const minZ = gz * curCellSize;
        const maxX = minX + curCellSize;
        const maxZ = minZ + curCellSize;

        if (maxX < tbMinX || minX > tbMaxX || maxZ < tbMinZ || minZ > tbMaxZ) {
            return;
        }

        const tileCenterX = (minX + maxX) * 0.5;
        const tileCenterZ = (minZ + maxZ) * 0.5;
        const toTileX = tileCenterX - camX;
        const toTileZ = tileCenterZ - camZ;
        const distSq = toTileX * toTileX + toTileZ * toTileZ;

        const splitDist = curCellSize * 1.75;
        if (lodLevel > 0 && distSq < splitDist * splitDist) {
            const childLod = lodLevel - 1;
            const childGx = gx * 2;
            const childGz = gz * 2;

            this.#evaluateLODNode(childLod, childGx, childGz, camX, camZ, camera, frustumPlanes, paddedMinY, paddedMaxY, hasDir, dirX, dirY, dirZ, currentFrameKeys, tbMinX, tbMinZ, tbMaxX, tbMaxZ, tileCenterY);
            this.#evaluateLODNode(childLod, childGx + 1, childGz, camX, camZ, camera, frustumPlanes, paddedMinY, paddedMaxY, hasDir, dirX, dirY, dirZ, currentFrameKeys, tbMinX, tbMinZ, tbMaxX, tbMaxZ, tileCenterY);
            this.#evaluateLODNode(childLod, childGx, childGz + 1, camX, camZ, camera, frustumPlanes, paddedMinY, paddedMaxY, hasDir, dirX, dirY, dirZ, currentFrameKeys, tbMinX, tbMinZ, tbMaxX, tbMaxZ, tileCenterY);
            this.#evaluateLODNode(childLod, childGx + 1, childGz + 1, camX, camZ, camera, frustumPlanes, paddedMinY, paddedMaxY, hasDir, dirX, dirY, dirZ, currentFrameKeys, tbMinX, tbMinZ, tbMaxX, tbMaxZ, tileCenterY);
            return;
        }

        const dist = Math.sqrt(distSq);
        const inFrustum = this.#checkAABBInFrustum(
            minX, paddedMinY, minZ,
            maxX, paddedMaxY, maxZ,
            frustumPlanes
        );

        const key = getSpatialTileHash(lodLevel, gx, gz);
        currentFrameKeys.add(key);

        const toTileY = tileCenterY - camera.y;
        const dist3D = Math.sqrt(distSq + toTileY * toTileY);

        let priority = 0;
        if (dist3D > 0.0001) {
            const nx = toTileX / dist3D;
            const ny = toTileY / dist3D;
            const nz = toTileZ / dist3D;

            let viewFocusFactor = 0.0;
            if (hasDir) {
                const dot3D = nx * dirX + ny * dirY + nz * dirZ;
                if (dot3D > 0.0) {
                    viewFocusFactor = dot3D * dot3D * dot3D * dot3D;
                }
            }
            priority = (curCellSize / dist3D) * (1.0 + 10.0 * viewFocusFactor) * 10.0;
        }

        const existingActive = this.#activeTiles.get(key);
        if (existingActive) {
            existingActive.distanceToCamera = dist;
            existingActive.priority = priority;
            existingActive.lodLevel = lodLevel;
            existingActive.inFrustum = inFrustum;
            existingActive.worldBounds[0] = minX;
            existingActive.worldBounds[1] = minZ;
            existingActive.worldBounds[2] = maxX;
            existingActive.worldBounds[3] = maxZ;
        } else {
            const existingPending = this.#pendingQueue.get(key);
            if (existingPending) {
                existingPending.distanceToCamera = dist;
                existingPending.priority = priority;
                existingPending.lodLevel = lodLevel;
                existingPending.inFrustum = inFrustum;
                existingPending.worldBounds[0] = minX;
                existingPending.worldBounds[1] = minZ;
                existingPending.worldBounds[2] = maxX;
                existingPending.worldBounds[3] = maxZ;
            } else {
                const tileInfo = this.#acquireTileInfo(
                    lodLevel,
                    gx, gz,
                    minX, minZ,
                    maxX, maxZ,
                    dist, priority
                );
                tileInfo.lodLevel = lodLevel;
                tileInfo.inFrustum = inFrustum;
                this.#addToPending(key, tileInfo);
            }
        }
    }

    #removeFromPending(key: number) {
        const tile = this.#pendingQueue.get(key);
        if (tile) {
            this.#pendingQueue.delete(key);
            const idx = this.#pendingTileList.indexOf(tile);
            if (idx !== -1) {
                const lastIdx = this.#pendingTileList.length - 1;
                if (idx < lastIdx) {
                    this.#pendingTileList[idx] = this.#pendingTileList[lastIdx];
                }
                this.#pendingTileList.pop();
            }
        }
    }

    #acquireTileInfo(
        lodLevel: number,
        gx: number,
        gz: number,
        minX: number,
        minZ: number,
        maxX: number,
        maxZ: number,
        dist: number,
        priority: number
    ): SpatialTileInfo {
        const baseGridX = Math.floor(minX / this.#cellSize);
        const baseGridZ = Math.floor(minZ / this.#cellSize);
        const tileCol = baseGridX + 16;
        const tileRow = baseGridZ + 16;
        const atlasKey = `${tileCol}_${tileRow}`;

        const pool = this.#tileInfoPool;
        if (pool.length > 0) {
            const tile = pool.pop() as SpatialTileInfo;
            tile.lodLevel = lodLevel;
            tile.gridX = gx;
            tile.gridZ = gz;
            tile.worldBounds[0] = minX;
            tile.worldBounds[1] = minZ;
            tile.worldBounds[2] = maxX;
            tile.worldBounds[3] = maxZ;
            tile.distanceToCamera = dist;
            tile.priority = priority;
            tile.state = 'LOADING';
            tile.tileCol = tileCol;
            tile.tileRow = tileRow;
            tile.atlasKey = atlasKey;
            tile.tileColStr = undefined;
            tile.tileRowStr = undefined;
            return tile;
        }
        return {
            lodLevel,
            gridX: gx,
            gridZ: gz,
            worldBounds: [minX, minZ, maxX, maxZ],
            distanceToCamera: dist,
            priority,
            state: 'LOADING',
            tileCol,
            tileRow,
            atlasKey
        };
    }

    #recycleTileInfo(tile: SpatialTileInfo): void {
        if (!tile || this.#tileInfoPool.length >= 256) return;
        this.#tileInfoPool.push(tile);
    }
}
