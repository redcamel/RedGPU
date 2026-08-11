export interface TerrainTileKey {
    gridX: number;
    gridZ: number;
    key: string;
}

export type TileState = 'UNLOADED' | 'LOADING' | 'LOADED';

export interface SpatialTileInfo {
    gridX: number;
    gridZ: number;
    worldBounds: [number, number, number, number];
    distanceToCamera: number;
    priority: number;
    state: TileState;

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
    #pendingQueue: Map<number, SpatialTileInfo> = new Map();
    #pendingBuffer: SpatialTileInfo[] = [];
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


    update(
        camera: any,
        worldOffset?: [number, number],
        worldSize?: [number, number]
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

        const centerGridX = Math.floor(camX / this.#cellSize);
        const centerGridZ = Math.floor(camZ / this.#cellSize);

        const toLoad: SpatialTileInfo[] = [];
        const toUnload: SpatialTileInfo[] = [];

        if (centerGridX !== this.#lastCameraGridX || centerGridZ !== this.#lastCameraGridZ) {
            this.#lastCameraGridX = centerGridX;
            this.#lastCameraGridZ = centerGridZ;
        }

        const radiusInCells = Math.ceil(this.#loadingRadius / this.#cellSize);
        const currentFrameKeys = new Set<number>();

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

        for (let gx = centerGridX - radiusInCells; gx <= centerGridX + radiusInCells; gx++) {
            for (let gz = centerGridZ - radiusInCells; gz <= centerGridZ + radiusInCells; gz++) {
                const minX = gx * this.#cellSize;
                const minZ = gz * this.#cellSize;
                const maxX = minX + this.#cellSize;
                const maxZ = minZ + this.#cellSize;

                if (maxX < tbMinX || minX > tbMaxX || maxZ < tbMinZ || minZ > tbMaxZ) {
                    continue;
                }

                const tileCenterX = minX + this.#cellSize * 0.5;
                const tileCenterZ = minZ + this.#cellSize * 0.5;
                const toTileX = tileCenterX - camX;
                const toTileZ = tileCenterZ - camZ;
                const distSq = toTileX * toTileX + toTileZ * toTileZ;

                // 제곱근 연산 없이 범위 판정
                if (distSq <= loadingRadiusSq) {
                    const key = ((gx + 32768) << 16) | ((gz + 32768) & 0xFFFF);
                    currentFrameKeys.add(key);

                    // 범위 내에 있을 때만 필요에 의해 제곱근 연산 실행
                    const dist = Math.sqrt(distSq);

                    let dotWeight = 1.0;
                    if (hasDir && dist > 0.0001) {
                        const nx = toTileX / dist;
                        const nz = toTileZ / dist;
                        const dot = nx * dirX + nz * dirZ;
                        dotWeight = Math.max(0.1, (dot + 1.0) * 0.5);
                    }
                    const priority = dotWeight / (dist + 1.0);

                    if (this.#activeTiles.has(key)) {
                        const existing = this.#activeTiles.get(key)!;
                        existing.distanceToCamera = dist;
                        existing.priority = priority;
                    } else if (this.#pendingQueue.has(key)) {
                        const existingPending = this.#pendingQueue.get(key)!;
                        existingPending.distanceToCamera = dist;
                        existingPending.priority = priority;
                    } else {
                        const tileInfo: SpatialTileInfo = {
                            gridX: gx,
                            gridZ: gz,
                            worldBounds: [minX, minZ, maxX, maxZ],
                            distanceToCamera: dist,
                            priority,
                            state: 'LOADING'
                        };
                        this.#pendingQueue.set(key, tileInfo);
                    }
                }
            }
        }

        for (const [key, tile] of this.#activeTiles.entries()) {
            if (!currentFrameKeys.has(key)) {
                tile.state = 'UNLOADED';
                toUnload.push(tile);
                this.#activeTiles.delete(key);
            }
        }

        for (const [key] of this.#pendingQueue.entries()) {
            if (!currentFrameKeys.has(key)) {
                this.#pendingQueue.delete(key);
            }
        }

        const pendingBuffer = this.#pendingBuffer;
        pendingBuffer.length = 0;
        for (const tile of this.#pendingQueue.values()) {
            pendingBuffer.push(tile);
        }
        pendingBuffer.sort((a, b) => b.priority - a.priority);

        const pendingCount = pendingBuffer.length;
        const loadBudget = (this.#maxLoadsPerFrame > 0 && this.#maxLoadsPerFrame < pendingCount)
            ? this.#maxLoadsPerFrame
            : pendingCount;

        for (let i = 0; i < loadBudget; i++) {
            const tile = pendingBuffer[i];
            const key = ((tile.gridX + 32768) << 16) | ((tile.gridZ + 32768) & 0xFFFF);
            tile.state = 'LOADED';
            this.#pendingQueue.delete(key);
            this.#activeTiles.set(key, tile);
            toLoad.push(tile);
        }

        return {toLoad, toUnload};
    }

    destroy(): void {
        this.#activeTiles.clear();
        this.#pendingQueue.clear();
        this.#pendingBuffer.length = 0;
    }
}
