import type Landscape from "../../../core/Landscape";

/**
 * LandscapeFoliageSpatialGrid
 *
 * [KO] 식생(Foliage) 스트리밍을 위한 가변 서브셀(Sub-Cell) 공간 분할 및 카메라 반경 쿼리 엔진.
 * [EN] Variable Sub-Cell spatial partitioning and camera radius query engine for foliage streaming.
 *
 * - 힙 메모리 할당 및 가비지 컬렉션(GC) 0 보장 (Zero-GC with preallocated Int32Array & V8 SMI bitmask).
 * - 1차 AABB 바운드 계산 -> 2차 서브셀 중심점 원형 거리 제곱(Sphere distance) 필터링.
 * - 카메라 5m 이동 히스테리시스(Hysteresis) 캐싱으로 CPU 연산 부하 < 0.01ms 유지.
 */
export class LandscapeFoliageSpatialGrid {
    /** 최대 활성 서브셀 수용 버퍼 크기 */
    static readonly MAX_ACTIVE_SUB_CELLS: number = 2048;

    #landscape: Landscape;
    #subCellSize: number = 100.0;
    #streamingRadius: number = 600.0;

    // Zero-GC 재사용 버퍼
    readonly #activeSubCellKeys: Int32Array = new Int32Array(LandscapeFoliageSpatialGrid.MAX_ACTIVE_SUB_CELLS);
    readonly #activeSubCellKeySet: Set<number> = new Set();
    #activeSubCellCount: number = 0;

    // 히스테리시스 캐싱
    #lastCamX: number = 1e9;
    #lastCamZ: number = 1e9;
    #lastRadius: number = -1;
    #lastCellSize: number = -1;
    #updateThresholdSq: number = 25.0; // 5미터 이동 (5^2 = 25)

    constructor(landscape: Landscape, subCellSize: number = 100.0, streamingRadius: number = 600.0) {
        this.#landscape = landscape;
        this.#subCellSize = Math.max(10.0, subCellSize);
        this.#streamingRadius = Math.max(10.0, streamingRadius);
    }

    get subCellSize(): number {
        return this.#subCellSize;
    }

    set subCellSize(val: number) {
        const clamped = Math.max(10.0, val);
        if (this.#subCellSize !== clamped) {
            this.#subCellSize = clamped;
            this.invalidateCache();
        }
    }

    get streamingRadius(): number {
        return this.#streamingRadius;
    }

    set streamingRadius(val: number) {
        const clamped = Math.max(10.0, val);
        if (this.#streamingRadius !== clamped) {
            this.#streamingRadius = clamped;
            this.invalidateCache();
        }
    }

    get activeSubCellCount(): number {
        return this.#activeSubCellCount;
    }

    get activeSubCellKeys(): Int32Array {
        return this.#activeSubCellKeys;
    }

    get activeSubCellKeySet(): ReadonlySet<number> {
        return this.#activeSubCellKeySet;
    }



    /** 캐시 무효화 (다음 update 시 강제 재계산) */
    invalidateCache(): void {
        this.#lastCamX = 1e9;
        this.#lastCamZ = 1e9;
    }

    /**
     * 카메라 위치를 기준으로 활성 서브셀 집합을 갱신 (Zero-GC)
     *
     * @param camX 카메라 월드 X 좌표
     * @param camZ 카메라 월드 Z 좌표
     * @param force 강제 갱신 여부
     * @returns 갱신 여부 (true: 변경됨, false: 캐시 유지)
     */
    update(camX: number, camZ: number, force: boolean = false): boolean {
        const dx = camX - this.#lastCamX;
        const dz = camZ - this.#lastCamZ;
        const distSq = dx * dx + dz * dz;

        if (!force && distSq < this.#updateThresholdSq &&
            this.#lastRadius === this.#streamingRadius &&
            this.#lastCellSize === this.#subCellSize) {
            return false;
        }

        this.#lastCamX = camX;
        this.#lastCamZ = camZ;
        this.#lastRadius = this.#streamingRadius;
        this.#lastCellSize = this.#subCellSize;

        const worldSizeX = this.#landscape.worldSize[0] || 16000.0;
        const worldSizeZ = this.#landscape.worldSize[1] || 16000.0;
        const halfWorldX = worldSizeX * 0.5;
        const halfWorldZ = worldSizeZ * 0.5;
        const cellSize = this.#subCellSize;
        const radius = this.#streamingRadius;

        const totalCellsX = Math.max(1, Math.floor(worldSizeX / cellSize));
        const totalCellsZ = Math.max(1, Math.floor(worldSizeZ / cellSize));

        // 1단계: AABB 바운딩 박스 계산
        const minSX = Math.max(0, Math.min(totalCellsX - 1, Math.floor((camX - radius + halfWorldX) / cellSize)));
        const maxSX = Math.max(0, Math.min(totalCellsX - 1, Math.floor((camX + radius + halfWorldX) / cellSize)));
        const minSZ = Math.max(0, Math.min(totalCellsZ - 1, Math.floor((camZ - radius + halfWorldZ) / cellSize)));
        const maxSZ = Math.max(0, Math.min(totalCellsZ - 1, Math.floor((camZ + radius + halfWorldZ) / cellSize)));

        // 2단계: 서브셀 원형 거리 판정 (셀 중심점과 카메라 간의 거리 검사)
        // 셀 외접원 반경 여유 = cellSize * sqrt(2)/2 ~= cellSize * 0.7071
        const effectiveRadius = radius + cellSize * 0.70710678;
        const effectiveRadiusSq = effectiveRadius * effectiveRadius;

        let count = 0;
        const keys = this.#activeSubCellKeys;
        const maxCapacity = LandscapeFoliageSpatialGrid.MAX_ACTIVE_SUB_CELLS;

        for (let sz = minSZ; sz <= maxSZ; sz++) {
            const cellCenterZ = (sz + 0.5) * cellSize - halfWorldZ;
            const diffZ = cellCenterZ - camZ;
            const diffZSq = diffZ * diffZ;

            for (let sx = minSX; sx <= maxSX; sx++) {
                const cellCenterX = (sx + 0.5) * cellSize - halfWorldX;
                const diffX = cellCenterX - camX;

                if (diffX * diffX + diffZSq <= effectiveRadiusSq) {
                    if (count < maxCapacity) {
                        keys[count] = ((sz << 16) | (sx & 0xFFFF)) | 0;
                        count++;
                    }
                }
            }
        }

        this.#activeSubCellCount = count;
        this.#activeSubCellKeySet.clear();
        for (let i = 0; i < count; i++) {
            this.#activeSubCellKeySet.add(keys[i]);
        }
        return true;
    }
}

Object.freeze(LandscapeFoliageSpatialGrid);
export default LandscapeFoliageSpatialGrid;
