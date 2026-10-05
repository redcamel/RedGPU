/**
 * [KO] 식생 공간 분할 서브셀 그리드 모듈입니다.
 * [EN] Foliage spatial partitioning sub-cell grid module.
 * @packageDocumentation
 */
import {packSubCellKey} from "../../../core/scatter/ScatterSpatialUtils";

/**
 * [KO] 카메라 위치와 스트리밍 반경에 따라 활성 서브셀 키 목록을 빠르게 계산하고 갱신하는 공간 분할 그리드 클래스입니다.
 * [EN] Spatial grid class that rapidly computes and updates active sub-cell keys based on camera position and streaming radius.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class FoliageSpatialGrid {

    static MAX_ACTIVE_SUB_CELLS: number = 2048;

    #activeSubCellKeys: Int32Array = new Int32Array(FoliageSpatialGrid.MAX_ACTIVE_SUB_CELLS);
    #activeSubCellCount: number = 0;

    #lastCamX: number = 1e9;
    #lastCamZ: number = 1e9;
    #lastRadius: number = -1;
    #lastCellSize: number = -1;
    #updateThresholdSq: number = 25.0;

    /**
     * [KO] FoliageSpatialGrid 인스턴스를 생성합니다.
     * [EN] Creates a FoliageSpatialGrid instance.
     */
    constructor() {
    }

    /**
     * [KO] 현재 활성화된 서브셀의 총 개수를 반환합니다.
     * [EN] Returns the total count of currently active sub-cells.
     */
    get activeSubCellCount(): number {
        return this.#activeSubCellCount;
    }

    /**
     * [KO] 현재 활성화된 서브셀 키(`Int32Array`) 버퍼를 반환합니다.
     * [EN] Returns the active sub-cell key (`Int32Array`) buffer.
     */
    get activeSubCellKeys(): Int32Array {
        return this.#activeSubCellKeys;
    }

    /**
     * [KO] 카메라 위치와 스트리밍 파라미터에 따라 활성 서브셀 목록을 갱신합니다.
     * [EN] Updates the active sub-cell list based on camera position and streaming parameters.
     * @param camX - 카메라 월드 X 좌표
     * @param camZ - 카메라 월드 Z 좌표
     * @param cellSize - 서브셀 크기 (미터)
     * @param radius - 스트리밍 반경 (미터)
     * @param worldSizeX - 지형 월드 X 크기 (기본값: 16000.0)
     * @param worldSizeZ - 지형 월드 Z 크기 (기본값: 16000.0)
     * @param force - 캐시 무시 강제 갱신 여부 (기본값: false)
     * @returns 활성 서브셀 목록이 갱신되었으면 true, 변동 없으면 false
     */
    update(
        camX: number,
        camZ: number,
        cellSize: number,
        radius: number,
        worldSizeX: number = 16000.0,
        worldSizeZ: number = 16000.0,
        force: boolean = false
    ): boolean {
        const dx = camX - this.#lastCamX;
        const dz = camZ - this.#lastCamZ;
        const distSq = dx * dx + dz * dz;

        if (!force && distSq < this.#updateThresholdSq &&
            this.#lastRadius === radius &&
            this.#lastCellSize === cellSize) {
            return false;
        }

        this.#lastCamX = camX;
        this.#lastCamZ = camZ;
        this.#lastRadius = radius;
        this.#lastCellSize = cellSize;

        const halfWorldX = worldSizeX * 0.5;
        const halfWorldZ = worldSizeZ * 0.5;

        const totalCellsX = Math.max(1, Math.floor(worldSizeX / cellSize));
        const totalCellsZ = Math.max(1, Math.floor(worldSizeZ / cellSize));

        const minSX = Math.max(0, Math.min(totalCellsX - 1, Math.floor((camX - radius + halfWorldX) / cellSize)));
        const maxSX = Math.max(0, Math.min(totalCellsX - 1, Math.floor((camX + radius + halfWorldX) / cellSize)));
        const minSZ = Math.max(0, Math.min(totalCellsZ - 1, Math.floor((camZ - radius + halfWorldZ) / cellSize)));
        const maxSZ = Math.max(0, Math.min(totalCellsZ - 1, Math.floor((camZ + radius + halfWorldZ) / cellSize)));

        const effectiveRadius = radius + cellSize * 0.70710678;
        const effectiveRadiusSq = effectiveRadius * effectiveRadius;

        let count = 0;
        const keys = this.#activeSubCellKeys;
        const maxCapacity = FoliageSpatialGrid.MAX_ACTIVE_SUB_CELLS;

        for (let sz = minSZ; sz <= maxSZ; sz++) {
            const cellCenterZ = (sz + 0.5) * cellSize - halfWorldZ;
            const diffZ = cellCenterZ - camZ;
            const diffZSq = diffZ * diffZ;

            for (let sx = minSX; sx <= maxSX; sx++) {
                const cellCenterX = (sx + 0.5) * cellSize - halfWorldX;
                const diffX = cellCenterX - camX;

                if (diffX * diffX + diffZSq <= effectiveRadiusSq) {
                    if (count < maxCapacity) {
                        keys[count++] = packSubCellKey(sx, sz);
                    }
                }
            }
        }

        this.#activeSubCellCount = count;
        return true;
    }
}

Object.freeze(FoliageSpatialGrid);
export default FoliageSpatialGrid;
