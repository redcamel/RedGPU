import LandscapeComponent from "./LandscapeComponent";

/**
 * [KO] 전체 지형의 2D 타일 그리드 분할, 월드-그리드 좌표 변환 및 반경 기반 타일 쿼리를 담당하는 공간 관리 클래스입니다.
 * [EN] Spatial management class responsible for 2D tile grid partitioning, world-to-grid coordinate conversion, and radius-based tile querying for the landscape.
 *
 * **[KO] 아키텍처 및 역할:**
 * - **2D 공간 그리드 분할**: 거대한 지형 월드를 컬럼(X)과 행(Z)의 2D 타일 배열(`flatCells`)로 평탄화하여 캐싱합니다.
 * - **O(1) 월드-그리드 고속 투영**: 월드 좌표(X, Z)를 그리드 정규화 수식(`(worldX + halfWorldSizeX) / tileSizeX`)을 통해 연산 오버헤드 없이 즉시 특정 타일 컴포넌트로 변환합니다.
 * - **반경 및 영역 기반 타일 쿼리 (`getComponentsInRadius`)**: 카메라나 플레이어 위치를 중심으로 일정 거리 내에 존재하는 모든 활성 타일을 수집하여 비동기 타일 스트리머(`LandscapeTileStreamer`)의 로딩 파이프라인에 공급합니다.
 *
 * **[EN] Architecture & Role:**
 * - **2D Spatial Grid Partitioning**: Partitions extensive landscape worlds into a flattened 2D tile array (`flatCells`) indexed by column (X) and row (Z).
 * - **O(1) World-to-Grid Projection**: Instantaneously projects world coordinates (X, Z) to tile components via normalized mapping formulas (`(worldX + halfWorldSizeX) / tileSizeX`) with zero query overhead.
 * - **Radius-based Spatial Querying (`getComponentsInRadius`)**: Gathers all active components within Euclidean distance from camera/player positions to feed the asynchronous streaming pipeline of `LandscapeTileStreamer`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(Landscape)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (Landscape).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class LandscapeSpatialGrid {
    #tileCountX: number;
    #tileCountZ: number;
    #tileSizeX: number;
    #tileSizeZ: number;
    #halfWorldSizeX: number;
    #halfWorldSizeZ: number;

    #worldSizeTuple: [number, number] = [0, 0];
    #invWorldSizeX: number = 0;
    #invWorldSizeZ: number = 0;
    #componentCountTuple: [number, number] = [0, 0];
    #tileSizeTuple: [number, number] = [0, 0];

    #flatCells: LandscapeComponent[] = [];

    /**
     * [KO] LandscapeSpatialGrid 생성자입니다.
     * [EN] Constructor for LandscapeSpatialGrid.
     *
     * @param tileCountX - [KO] X축 타일 개수 / [EN] Tile count along X axis
     * @param tileCountZ - [KO] Z축 타일 개수 / [EN] Tile count along Z axis
     * @param tileSizeX - [KO] 단일 타일의 X축 월드 크기 / [EN] World size of a single tile along X axis
     * @param tileSizeZ - [KO] 단일 타일의 Z축 월드 크기 / [EN] World size of a single tile along Z axis
     */
    constructor(tileCountX: number, tileCountZ: number, tileSizeX: number, tileSizeZ: number) {
        this.#tileCountX = tileCountX;
        this.#tileCountZ = tileCountZ;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#halfWorldSizeX = (tileCountX * tileSizeX) / 2;
        this.#halfWorldSizeZ = (tileCountZ * tileSizeZ) / 2;
        this.#updateTuples();
    }

    /**
     * [KO] 전체 월드 가로/세로 크기 튜플 `[worldSizeX, worldSizeZ]`를 반환합니다.
     * [EN] Returns the full world dimensions tuple `[worldSizeX, worldSizeZ]`.
     */
    get worldSize(): [number, number] {
        return this.#worldSizeTuple;
    }

    /**
     * [KO] 전체 타일(컴포넌트) 개수 튜플 `[tileCountX, tileCountZ]`를 반환합니다.
     * [EN] Returns the component count tuple `[tileCountX, tileCountZ]`.
     */
    get componentCount(): [number, number] {
        return this.#componentCountTuple;
    }

    /**
     * [KO] 단일 타일의 가로/세로 크기 튜플 `[tileSizeX, tileSizeZ]`를 반환합니다.
     * [EN] Returns the single tile size tuple `[tileSizeX, tileSizeZ]`.
     */
    get tileSize(): [number, number] {
        return this.#tileSizeTuple;
    }

    /**
     * [KO] 전체 월드의 X축 크기를 반환합니다.
     * [EN] Returns the full world size along X axis.
     */
    get worldSizeX(): number {
        return this.#worldSizeTuple[0];
    }

    /**
     * [KO] 전체 월드의 Z축 크기를 반환합니다.
     * [EN] Returns the full world size along Z axis.
     */
    get worldSizeZ(): number {
        return this.#worldSizeTuple[1];
    }

    /**
     * [KO] 전체 월드 X축 크기의 역수(1.0 / worldSizeX)를 반환합니다. (Zero-GC 캐싱)
     * [EN] Returns the reciprocal of full world size along X axis (1.0 / worldSizeX). (Zero-GC cached)
     */
    get invWorldSizeX(): number {
        return this.#invWorldSizeX;
    }

    /**
     * [KO] 전체 월드 Z축 크기의 역수(1.0 / worldSizeZ)를 반환합니다. (Zero-GC 캐싱)
     * [EN] Returns the reciprocal of full world size along Z axis (1.0 / worldSizeZ). (Zero-GC cached)
     */
    get invWorldSizeZ(): number {
        return this.#invWorldSizeZ;
    }

    /**
     * [KO] 1차원 평탄화된 타일 컴포넌트 목록 배열을 반환합니다.
     * [EN] Returns the flat 1D array of landscape tile components.
     */
    get flatCells(): LandscapeComponent[] {
        return this.#flatCells;
    }

    /**
     * [KO] X축 타일 개수를 반환합니다.
     * [EN] Returns the tile count along X axis.
     */
    get tileCountX(): number {
        return this.#tileCountX;
    }

    /**
     * [KO] Z축 타일 개수를 반환합니다.
     * [EN] Returns the tile count along Z axis.
     */
    get tileCountZ(): number {
        return this.#tileCountZ;
    }

    /**
     * [KO] 단일 타일의 X축 크기를 반환합니다.
     * [EN] Returns the tile size along X axis.
     */
    get tileSizeX(): number {
        return this.#tileSizeX;
    }

    /**
     * [KO] 단일 타일의 Z축 크기를 반환합니다.
     * [EN] Returns the tile size along Z axis.
     */
    get tileSizeZ(): number {
        return this.#tileSizeZ;
    }

    /**
     * [KO] X축 월드 반폭(Half World Size)을 반환합니다.
     * [EN] Returns the half world size along X axis.
     */
    get halfWorldSizeX(): number {
        return this.#halfWorldSizeX;
    }

    /**
     * [KO] Z축 월드 반폭(Half World Size)을 반환합니다.
     * [EN] Returns the half world size along Z axis.
     */
    get halfWorldSizeZ(): number {
        return this.#halfWorldSizeZ;
    }

    /**
     * [KO] 공간 그리드의 타일 구성 설정을 갱신하고 기존 타일 목록을 비웁니다.
     * [EN] Updates the spatial grid tile configuration and clears existing tiles.
     *
     * @param tileCountX - [KO] 새로운 X축 타일 개수 / [EN] New tile count along X axis
     * @param tileCountZ - [KO] 새로운 Z축 타일 개수 / [EN] New tile count along Z axis
     * @param tileSizeX - [KO] 새로운 단일 타일 X축 크기 / [EN] New single tile size along X axis
     * @param tileSizeZ - [KO] 새로운 단일 타일 Z축 크기 / [EN] New single tile size along Z axis
     */
    setConfig(tileCountX: number, tileCountZ: number, tileSizeX: number, tileSizeZ: number): void {
        this.#tileCountX = tileCountX;
        this.#tileCountZ = tileCountZ;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#halfWorldSizeX = (tileCountX * tileSizeX) / 2;
        this.#halfWorldSizeZ = (tileCountZ * tileSizeZ) / 2;
        this.#updateTuples();
        this.clearTiles();
    }

    /**
     * [KO] 설정된 그리드 규격에 따라 전체 타일 컴포넌트들을 새로 인스턴스화하고 등록합니다.
     * [EN] Reconstructs and registers all tile components based on current grid settings.
     *
     * @param onTileCreated - [KO] 각 타일 생성 시 호출될 콜백 / [EN] Optional callback invoked upon each tile creation
     */
    rebuildTiles(onTileCreated?: (comp: LandscapeComponent, index: number) => void): void {
        this.#flatCells.length = 0;
        let index = 0;
        const countX = this.#tileCountX;
        const countZ = this.#tileCountZ;
        const sizeX = this.#tileSizeX;
        const sizeZ = this.#tileSizeZ;
        const halfX = this.#halfWorldSizeX;
        const halfZ = this.#halfWorldSizeZ;

        for (let row = 0; row < countZ; row++) {
            for (let col = 0; col < countX; col++) {
                const posX = col * sizeX - halfX + sizeX / 2;
                const posZ = row * sizeZ - halfZ + sizeZ / 2;
                const comp = new LandscapeComponent(posX, posZ, col, row);
                this.#flatCells.push(comp);
                onTileCreated?.(comp, index);
                index++;
            }
        }
    }

    /**
     * [KO] 등록된 모든 타일 컴포넌트 목록을 초기화합니다.
     * [EN] Clears all registered tile components.
     */
    clearTiles(): void {
        this.#flatCells.length = 0;
    }

    #updateTuples(): void {
        const wx = this.#tileCountX * this.#tileSizeX;
        const wz = this.#tileCountZ * this.#tileSizeZ;
        this.#worldSizeTuple[0] = wx;
        this.#worldSizeTuple[1] = wz;
        this.#invWorldSizeX = wx > 0 ? 1.0 / wx : 0;
        this.#invWorldSizeZ = wz > 0 ? 1.0 / wz : 0;
        this.#componentCountTuple[0] = this.#tileCountX;
        this.#componentCountTuple[1] = this.#tileCountZ;
        this.#tileSizeTuple[0] = this.#tileSizeX;
        this.#tileSizeTuple[1] = this.#tileSizeZ;
    }

    /**
     * [KO] 지정된 행과 열에 위치한 타일 컴포넌트를 반환합니다. 범위를 벗어날 경우 null을 반환합니다.
     * [EN] Returns the tile component at the specified row and column, or null if out of bounds.
     *
     * @param row - [KO] 그리드 행 인덱스 / [EN] Grid row index
     * @param col - [KO] 그리드 컬럼 인덱스 / [EN] Grid column index
     */
    getComponent(row: number, col: number): LandscapeComponent | null {
        if (row < 0 || row >= this.#tileCountZ || col < 0 || col >= this.#tileCountX) return null;
        return this.#flatCells[row * this.#tileCountX + col] || null;
    }

    /**
     * [KO] 월드 X, Z 좌표를 해당하는 그리드 셀 컬럼 및 행 인덱스로 변환하여 출력 버퍼에 기록합니다.
     * [EN] Converts world X, Z coordinates to grid cell column and row indices, writing them to an output buffer.
     *
     * @param x - [KO] 월드 X 좌표 / [EN] World X coordinate
     * @param z - [KO] 월드 Z 좌표 / [EN] World Z coordinate
     * @param outBuffer - [KO] `[col, row]` 결과를 기록할 Int32Array(2) 버퍼 / [EN] Output Int32Array(2) buffer for `[col, row]`
     */
    getCellCoordinates(x: number, z: number, outBuffer: Int32Array): void {
        const col = Math.floor((x + this.#halfWorldSizeX) / this.#tileSizeX);
        const row = Math.floor((z + this.#halfWorldSizeZ) / this.#tileSizeZ);

        outBuffer[0] = Math.min(Math.max(0, col), this.#tileCountX - 1);
        outBuffer[1] = Math.min(Math.max(0, row), this.#tileCountZ - 1);
    }

    /**
     * [KO] 카메라 위치와 로딩 반경 내에 포함되는 활성 타일 컴포넌트들을 필터링하여 출력 배열에 채웁니다.
     * [EN] Filters active tile components within the camera loading radius and fills the output array.
     *
     * @param camX - [KO] 카메라 월드 X 좌표 / [EN] Camera world X coordinate
     * @param camZ - [KO] 카메라 월드 Z 좌표 / [EN] Camera world Z coordinate
     * @param tileLoadingRadius - [KO] 타일 활성화 로딩 반경 / [EN] Tile activation loading radius
     * @param outArray - [KO] 결과 타일들이 채워질 재사용 컴포넌트 배열 / [EN] Reusable output array to receive matching components
     * @returns [KO] 활성화된 타일의 총 개수 / [EN] Total count of active tiles
     */
    getActiveComponentsInRadius(camX: number, camZ: number, tileLoadingRadius: number, outArray: LandscapeComponent[]): number {
        outArray.length = 0;
        const radiusSq = tileLoadingRadius * tileLoadingRadius;

        const minCol = Math.max(0, Math.floor((camX - tileLoadingRadius + this.#halfWorldSizeX) / this.#tileSizeX));
        const maxCol = Math.min(this.#tileCountX - 1, Math.floor((camX + tileLoadingRadius + this.#halfWorldSizeX) / this.#tileSizeX));

        const minRow = Math.max(0, Math.floor((camZ - tileLoadingRadius + this.#halfWorldSizeZ) / this.#tileSizeZ));
        const maxRow = Math.min(this.#tileCountZ - 1, Math.floor((camZ + tileLoadingRadius + this.#halfWorldSizeZ) / this.#tileSizeZ));

        for (let r = minRow; r <= maxRow; r++) {
            const rowOffset = r * this.#tileCountX;
            for (let c = minCol; c <= maxCol; c++) {
                const comp = this.#flatCells[rowOffset + c];
                if (comp) {
                    const dx = comp.worldX - camX;
                    const dz = comp.worldZ - camZ;
                    if (dx * dx + dz * dz <= radiusSq) {
                        outArray.push(comp);
                    }
                }
            }
        }
        return outArray.length;
    }
}

Object.freeze(LandscapeSpatialGrid);
export default LandscapeSpatialGrid;
