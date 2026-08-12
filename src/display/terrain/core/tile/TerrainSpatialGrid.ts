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

export function getSpatialTileHash(gridX: number, gridZ: number): number {
    return ((gridX + 32768) << 16) | ((gridZ + 32768) & 0xFFFF);
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

    constructor(cellSize: number = 256, loadingRadius: number = 2560) {
        this.#cellSize = cellSize;
        this.#loadingRadius = loadingRadius;
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

        const radiusInCells = Math.ceil(this.#loadingRadius / this.#cellSize);
        const currentFrameKeys = this.#currentFrameKeys;
        currentFrameKeys.clear();

        const [tbMinX, tbMinZ, tbMaxX, tbMaxZ] = this.#terrainBounds || [-Infinity, -Infinity, Infinity, Infinity];

        let dirX = 0, dirZ = 0;
        let hasDir = false;
        if (camera?.viewMatrix) {
            const vm = camera.viewMatrix;
            const fx = -vm[2];
            const fz = -vm[10];
            const len = Math.hypot(fx, fz);
            if (len > 0.0001) {
                dirX = fx / len;
                dirZ = fz / len;
                hasDir = true;
            }
        }

        const loadingRadiusSq = this.#loadingRadius * this.#loadingRadius;
        const baseCellSize = this.#cellSize;

        for (let gx = centerGridX - radiusInCells; gx <= centerGridX + radiusInCells; gx++) {
            for (let gz = centerGridZ - radiusInCells; gz <= centerGridZ + radiusInCells; gz++) {
                const minX = gx * baseCellSize;
                const minZ = gz * baseCellSize;
                const maxX = minX + baseCellSize;
                const maxZ = minZ + baseCellSize;

                if (maxX < tbMinX || minX > tbMaxX || maxZ < tbMinZ || minZ > tbMaxZ) {
                    continue;
                }

                const tileCenterX = minX + baseCellSize * 0.5;
                const tileCenterZ = minZ + baseCellSize * 0.5;
                const toTileX = tileCenterX - camX;
                const toTileZ = tileCenterZ - camZ;
                const distSq = toTileX * toTileX + toTileZ * toTileZ;

                // 제곱근 연산 없이 범위 판정
                if (distSq <= loadingRadiusSq) {
                    const dist = Math.sqrt(distSq);
                    const lodLevel = Math.min(4, Math.max(0, Math.floor(dist / (baseCellSize * 2.0))));

                    const inFrustum = this.#checkAABBInFrustum(
                        minX, paddedMinY, minZ,
                        maxX, paddedMaxY, maxZ,
                        frustumPlanes
                    );

                    const key = ((gx + 32768) << 16) | ((gz + 32768) & 0xFFFF);
                    currentFrameKeys.add(key);

                    let dotWeight = 1.0;
                    if (hasDir && dist > 0.0001) {
                        const nx = toTileX / dist;
                        const nz = toTileZ / dist;
                        const dot = nx * dirX + nz * dirZ;
                        dotWeight = Math.max(0.1, (dot + 1.0) * 0.5);
                    }
                    const priority = dotWeight / (dist + 1.0);

                    const existingActive = this.#activeTiles.get(key);
                    if (existingActive) {
                        existingActive.distanceToCamera = dist;
                        existingActive.priority = priority;
                        existingActive.lodLevel = lodLevel;
                        existingActive.inFrustum = inFrustum;
                    } else {
                        const existingPending = this.#pendingQueue.get(key);
                        if (existingPending) {
                            existingPending.distanceToCamera = dist;
                            existingPending.priority = priority;
                            existingPending.lodLevel = lodLevel;
                            existingPending.inFrustum = inFrustum;
                        } else {
                            const tileInfo = this.#acquireTileInfo(
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
            }
        }

        // Iterator 없이 고정 배열 #activeTileList에서 언로드 대상 탐색 및 O(1) Swap-Remove
        for (let i = this.#activeTileList.length - 1; i >= 0; i--) {
            const tile = this.#activeTileList[i];
            const key = ((tile.gridX + 32768) << 16) | ((tile.gridZ + 32768) & 0xFFFF);
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
            const key = ((pendingTile.gridX + 32768) << 16) | ((pendingTile.gridZ + 32768) & 0xFFFF);
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
            const key = ((tile.gridX + 32768) << 16) | ((tile.gridZ + 32768) & 0xFFFF);
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
        gx: number,
        gz: number,
        minX: number,
        minZ: number,
        maxX: number,
        maxZ: number,
        dist: number,
        priority: number
    ): SpatialTileInfo {
        const tileCol = gx + 16;
        const tileRow = gz + 16;
        const atlasKey = `${tileCol}_${tileRow}`;

        const pool = this.#tileInfoPool;
        if (pool.length > 0) {
            const tile = pool.pop() as SpatialTileInfo;
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
