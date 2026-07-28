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
    state: TileState;
}

/**
 * [KO] 언리얼 엔진 스타일 카메라 중심 공간 그리드 스트리밍 관리자 클래스입니다.
 * [EN] Unreal Engine style camera-centric spatial grid streaming manager class.
 */
export class TerrainSpatialGrid {
    #cellSize: number = 512;          // 셀 하나의 가로세로 크기 (m)
    #loadingRadius: number = 2500;     // 카메라 기준 활성 스트리밍 반경 (m)
    #activeTiles: Map<string, SpatialTileInfo> = new Map();
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

    get activeTiles(): Map<string, SpatialTileInfo> {
        return this.#activeTiles;
    }

    setTerrainBounds(minX: number, minZ: number, maxX: number, maxZ: number) {
        this.#terrainBounds = [minX, minZ, maxX, maxZ];
    }

    /**
     * [KO] 매 프레임 카메라 위치를 기준으로 그리드 세포의 로딩/언로딩 상태를 갱신합니다.
     * [EN] Updates the loading/unloading state of grid cells based on camera position every frame.
     */
    update(cameraPosition: [number, number, number] | vec3): {
        toLoad: SpatialTileInfo[];
        toUnload: SpatialTileInfo[];
    } {
        const camX = cameraPosition[0];
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
                const distSq = (tileCenterX - camX) ** 2 + (tileCenterZ - camZ) ** 2;

                if (distSq <= this.#loadingRadius ** 2) {
                    const key = `${gx}_${gz}`;
                    currentFrameKeys.add(key);

                    if (!this.#activeTiles.has(key)) {
                        const tileInfo: SpatialTileInfo = {
                            gridX: gx,
                            gridZ: gz,
                            worldBounds: [minX, minZ, maxX, maxZ],
                            distanceToCamera: Math.sqrt(distSq),
                            state: 'LOADING'
                        };
                        this.#activeTiles.set(key, tileInfo);
                        toLoad.push(tileInfo);
                    } else {
                        const existing = this.#activeTiles.get(key)!;
                        existing.distanceToCamera = Math.sqrt(distSq);
                    }
                }
            }
        }

        // 반경을 벗어난 타일 Unload 수집
        for (const [key, tile] of this.#activeTiles.entries()) {
            if (!currentFrameKeys.has(key)) {
                tile.state = 'UNLOADED';
                toUnload.push(tile);
                this.#activeTiles.delete(key);
            }
        }

        // 카메라 거리에 따라 로딩 우선순위 정렬 (가까운 타일 우선)
        toLoad.sort((a, b) => a.distanceToCamera - b.distanceToCamera);

        return {toLoad, toUnload};
    }
}
