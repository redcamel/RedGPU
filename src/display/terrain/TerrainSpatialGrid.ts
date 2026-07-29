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
    worldBounds: [number, number, number, number]; // [minX, minZ, maxX, maxZ]
    distanceToCamera: number;
    priority: number;
    state: TileState;
}

/**
 * [KO] 언리얼 엔진 스타일 카메라 중심 공간 그리드 스트리밍 관리자 클래스입니다.
 * [EN] Unreal Engine style camera-centric spatial grid streaming manager class.
 */
export class TerrainSpatialGrid {
    #cellSize: number = 512;          // 셀 하나의 가로세로 크기 (m)
    #loadingRadius: number = 2500;     // 카메라 기준 활성 스트리밍 반경 (m)
    #maxLoadsPerFrame: number = 2;     // 프레임당 최대 로드 수 (0: 제한 없음)
    #activeTiles: Map<string, SpatialTileInfo> = new Map();
    #pendingQueue: Map<string, SpatialTileInfo> = new Map(); // 로딩 대기 큐 (key -> tile)
    #lastCameraGridX: number = NaN;
    #lastCameraGridZ: number = NaN;

    #terrainBounds: [number, number, number, number] | null = [-5000, -5000, 5000, 5000]; // [minX, minZ, maxX, maxZ]

    constructor(cellSize: number = 512, loadingRadius: number = 2500) {
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

    get activeTiles(): Map<string, SpatialTileInfo> {
        return this.#activeTiles;
    }

    setTerrainBounds(minX: number, minZ: number, maxX: number, maxZ: number) {
        this.#terrainBounds = [minX, minZ, maxX, maxZ];
    }

    /**
     * [KO] 매 프레임 카메라 위치 및 시선 방향을 기준으로 그리드 세포의 로딩/언로딩 상태를 갱신합니다.
     * [EN] Updates the loading/unloading state of grid cells based on camera position and view direction every frame.
     */
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

        // 카메라 중심 cell 좌표가 변경되었을 때 전체 원형 스트리밍 구역 갱신
        if (centerGridX !== this.#lastCameraGridX || centerGridZ !== this.#lastCameraGridZ) {
            this.#lastCameraGridX = centerGridX;
            this.#lastCameraGridZ = centerGridZ;
        }

        const radiusInCells = Math.ceil(this.#loadingRadius / this.#cellSize);
        const currentFrameKeys = new Set<string>();

        const [tbMinX, tbMinZ, tbMaxX, tbMaxZ] = this.#terrainBounds || [-Infinity, -Infinity, Infinity, Infinity];

        // 카메라 정면 벡터 (존재하는 경우)
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

                // 지형 경계(Terrain World Bounds)를 벗어난 세포는 스트리밍 대상에서 제외
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

                    // 우선순위 계산: 거리 가중치 + (시선 방향 내적 가중치)
                    let dotWeight = 1.0;
                    if (hasDir && dist > 0.0001) {
                        const nx = toTileX / dist;
                        const nz = toTileZ / dist;
                        const dot = nx * dirX + nz * dirZ; // -1 ~ 1
                        dotWeight = Math.max(0.1, (dot + 1.0) * 0.5); // 0.1 ~ 1.0
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
                        // 새로운 로딩 대상 타일을 대기 큐에 등록
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

        // 반경을 벗어난 타일 처리
        // 1) 활성 타일 중 반경 밖으로 벗어난 경우 Unload
        for (const [key, tile] of this.#activeTiles.entries()) {
            if (!currentFrameKeys.has(key)) {
                tile.state = 'UNLOADED';
                toUnload.push(tile);
                this.#activeTiles.delete(key);
            }
        }

        // 2) 대기 큐 타일 중 반경 밖으로 벗어난 경우 큐에서 제거
        for (const [key] of this.#pendingQueue.entries()) {
            if (!currentFrameKeys.has(key)) {
                this.#pendingQueue.delete(key);
            }
        }

        // 대기 큐 타일들을 우선순위(Priority) 내림차순 정렬 (시선 정면에 가깝고 가까운 타일 우선)
        const pendingArray = Array.from(this.#pendingQueue.values());
        pendingArray.sort((a, b) => b.priority - a.priority);

        // maxLoadsPerFrame (Frame Budgeting) 수량만큼 대기 큐에서 꺼내어 활성화(Load)
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
