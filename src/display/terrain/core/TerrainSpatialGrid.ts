import {vec3} from "gl-matrix";

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

export class TerrainSpatialGrid {
    #cellSize: number = 256;
    #loadingRadius: number = 2560;
    #maxLoadsPerFrame: number = 2;
    #activeTiles: Map<string, SpatialTileInfo> = new Map();
    #pendingQueue: Map<string, SpatialTileInfo> = new Map();
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

    get activeTiles(): Map<string, SpatialTileInfo> {
        return this.#activeTiles;
    }

    setTerrainBounds(minX: number, minZ: number, maxX: number, maxZ: number) {
        this.#terrainBounds = [minX, minZ, maxX, maxZ];
    }

    update(cameraPosition: [number, number, number] | vec3, cameraDirection?: [number, number, number]): {
        toLoad: SpatialTileInfo[];
        toUnload: SpatialTileInfo[];
    } {
        const camX = cameraPosition[0];
        const camY = cameraPosition[1];
        const camZ = cameraPosition[2];

        const centerGridX = Math.floor(camX / this.#cellSize);
        const centerGridZ = Math.floor(camZ / this.#cellSize);

        const toLoad: SpatialTileInfo[] = [];
        const toUnload: SpatialTileInfo[] = [];

        if (centerGridX !== this.#lastCameraGridX || centerGridZ !== this.#lastCameraGridZ) {
            this.#lastCameraGridX = centerGridX;
            this.#lastCameraGridZ = centerGridZ;
        }

        const radiusInCells = Math.ceil(this.#loadingRadius / this.#cellSize);
        const currentFrameKeys = new Set<string>();

        const [tbMinX, tbMinZ, tbMaxX, tbMaxZ] = this.#terrainBounds || [-Infinity, -Infinity, Infinity, Infinity];

        let dirX = 0, dirZ = 0;
        let hasDir = false;
        if (cameraDirection) {
            const len = Math.hypot(cameraDirection[0], cameraDirection[2]);
            if (len > 0.0001) {
                dirX = cameraDirection[0] / len;
                dirZ = cameraDirection[2] / len;
                hasDir = true;
            }
        }

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
                const distSq = toTileX ** 2 + toTileZ ** 2;
                const dist = Math.sqrt(distSq);

                if (dist <= this.#loadingRadius) {
                    const key = `${gx}_${gz}`;
                    currentFrameKeys.add(key);

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

        const pendingArray = Array.from(this.#pendingQueue.values());
        pendingArray.sort((a, b) => b.priority - a.priority);

        const loadBudget = this.#maxLoadsPerFrame > 0 ? this.#maxLoadsPerFrame : pendingArray.length;
        const tilesToProcess = pendingArray.slice(0, loadBudget);

        for (const tile of tilesToProcess) {
            const key = `${tile.gridX}_${tile.gridZ}`;
            tile.state = 'LOADED';
            this.#pendingQueue.delete(key);
            this.#activeTiles.set(key, tile);
            toLoad.push(tile);
        }

        return {toLoad, toUnload};
    }
}
