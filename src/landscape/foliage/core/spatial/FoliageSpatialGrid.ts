/**
 * [KO] 식생 공간 분할 서브셀 그리드 모듈입니다.
 * [EN] Foliage spatial partitioning sub-cell grid module.
 * @packageDocumentation
 */
import type Landscape from "../../../Landscape";

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

    static readonly MAX_ACTIVE_SUB_CELLS: number = 2048;

    #landscape: Landscape;
    #subCellSize: number = 100.0;
    #streamingRadius: number = 600.0;

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
     * @param landscape -
     * [KO] 부모 Landscape 인스턴스
     * [EN] Parent Landscape instance
     * @param subCellSize -
     * [KO] 서브셀 크기(미터, 기본값: 100.0)
     * [EN] Sub-cell dimension in meters (default: 100.0)
     * @param streamingRadius -
     * [KO] 스트리밍 반경(미터, 기본값: 600.0)
     * [EN] Streaming radius in meters (default: 600.0)
     */
    constructor(landscape: Landscape, subCellSize: number = 100.0, streamingRadius: number = 600.0) {
        this.#landscape = landscape;
        this.#subCellSize = Math.max(10.0, subCellSize);
        this.#streamingRadius = Math.max(10.0, streamingRadius);
    }

    /**
     * [KO] 서브셀 공간 분할 격자 크기(미터)를 반환합니다.
     * [EN] Returns the sub-cell spatial partitioning grid size in meters.
     */
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

    /**
     * [KO] 서브셀 스트리밍 활성 반경(미터)을 반환합니다.
     * [EN] Returns the active sub-cell streaming radius in meters.
     */
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
     * [KO] 캐시된 카메라 위치 및 파라미터를 무효화하여 다음 업데이트 시 강제 재계산하도록 합니다.
     * [EN] Invalidates cached camera positions and parameters to force recalculation on the next update.
     */
    invalidateCache(): void {
        this.#lastCamX = 1e9;
        this.#lastCamZ = 1e9;
    }

    /**
     * [KO] 카메라 위치에 따라 활성 서브셀 목록을 갱신합니다.
     * [EN] Updates the active sub-cell list based on camera position.
     * @param camX -
     * [KO] 카메라 월드 X 좌표
     * [EN] Camera world X coordinate
     * @param camZ -
     * [KO] 카메라 월드 Z 좌표
     * [EN] Camera world Z coordinate
     * @param force -
     * [KO] 캐시 무시 강제 갱신 여부 (기본값: false)
     * [EN] Whether to force update ignoring cache (default: false)
     * @returns
     * [KO] 활성 서브셀 목록이 변경되어 갱신되었으면 true, 변동 없으면 false
     * [EN] True if active sub-cells changed and were updated, false if unchanged
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
                        keys[count] = ((sz << 16) | (sx & 0xFFFF)) | 0;
                        count++;
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
