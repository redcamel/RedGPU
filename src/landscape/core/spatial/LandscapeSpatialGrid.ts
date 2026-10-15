import LandscapeComponent from "./LandscapeComponent";

/**
 * [KO] 지형(Landscape)의 전체 월드 영역을 2D 타일 그리드로 분할하고 공간 질의(Spatial Query)를 처리하는 클래스입니다.
 * [EN] Class that partitions the entire world area of the Landscape into a 2D tile grid and processes spatial queries.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
class LandscapeSpatialGrid {
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
     * [KO] LandscapeSpatialGrid 인스턴스를 생성합니다.
     * [EN] Creates a LandscapeSpatialGrid instance.
     *
     * @param tileCountX -
     * [KO] 가로(X) 방향 타일 개수
     * [EN] Number of tiles along the X axis
     * @param tileCountZ -
     * [KO] 세로(Z) 방향 타일 개수
     * [EN] Number of tiles along the Z axis
     * @param tileSizeX -
     * [KO] 단일 타일의 가로(X) 월드 크기
     * [EN] World width (X) of a single tile
     * @param tileSizeZ -
     * [KO] 단일 타일의 세로(Z) 월드 크기
     * [EN] World depth (Z) of a single tile
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
     * [KO] 전체 지형의 월드 크기 튜플(`[worldSizeX, worldSizeZ]`)을 반환합니다.
     * [EN] Returns the world size tuple (`[worldSizeX, worldSizeZ]`) of the entire terrain.
     */
    get worldSize(): [number, number] {
        return this.#worldSizeTuple;
    }

    /**
     * [KO] 타일 컴포넌트 개수 튜플(`[tileCountX, tileCountZ]`)을 반환합니다.
     * [EN] Returns the tile component count tuple (`[tileCountX, tileCountZ]`).
     */
    get componentCount(): [number, number] {
        return this.#componentCountTuple;
    }

    /**
     * [KO] 단일 타일의 월드 크기 튜플(`[tileSizeX, tileSizeZ]`)을 반환합니다.
     * [EN] Returns the single tile world size tuple (`[tileSizeX, tileSizeZ]`).
     */
    get tileSize(): [number, number] {
        return this.#tileSizeTuple;
    }

    /**
     * [KO] 전체 지형의 가로(X) 월드 크기를 반환합니다.
     * [EN] Returns the total world width (X) of the terrain.
     */
    get worldSizeX(): number {
        return this.#worldSizeTuple[0];
    }

    /**
     * [KO] 전체 지형의 세로(Z) 월드 크기를 반환합니다.
     * [EN] Returns the total world depth (Z) of the terrain.
     */
    get worldSizeZ(): number {
        return this.#worldSizeTuple[1];
    }

    /**
     * [KO] 전체 지형 가로 월드 크기의 역수(`1 / worldSizeX`)를 반환합니다.
     * [EN] Returns the reciprocal of the total terrain world width (`1 / worldSizeX`).
     */
    get invWorldSizeX(): number {
        return this.#invWorldSizeX;
    }

    /**
     * [KO] 전체 지형 세로 월드 크기의 역수(`1 / worldSizeZ`)를 반환합니다.
     * [EN] Returns the reciprocal of the total terrain world depth (`1 / worldSizeZ`).
     */
    get invWorldSizeZ(): number {
        return this.#invWorldSizeZ;
    }

    /**
     * [KO] 그리드 내 모든 타일 컴포넌트의 1차원 배열(`Array<LandscapeComponent>`)을 반환합니다.
     * [EN] Returns the 1D array (`Array<LandscapeComponent>`) of all tile components in the grid.
     */
    get flatCells(): LandscapeComponent[] {
        return this.#flatCells;
    }

    /**
     * [KO] 가로(X) 방향 타일 개수를 반환합니다.
     * [EN] Returns the number of tiles along the X axis.
     */
    get tileCountX(): number {
        return this.#tileCountX;
    }

    /**
     * [KO] 세로(Z) 방향 타일 개수를 반환합니다.
     * [EN] Returns the number of tiles along the Z axis.
     */
    get tileCountZ(): number {
        return this.#tileCountZ;
    }

    /**
     * [KO] 단일 타일의 가로(X) 월드 크기를 반환합니다.
     * [EN] Returns the world width (X) of a single tile.
     */
    get tileSizeX(): number {
        return this.#tileSizeX;
    }

    /**
     * [KO] 단일 타일의 세로(Z) 월드 크기를 반환합니다.
     * [EN] Returns the world depth (Z) of a single tile.
     */
    get tileSizeZ(): number {
        return this.#tileSizeZ;
    }

    /**
     * [KO] 전체 지형 가로 월드 크기의 절반(`worldSizeX / 2`)을 반환합니다.
     * [EN] Returns half of the total terrain world width (`worldSizeX / 2`).
     */
    get halfWorldSizeX(): number {
        return this.#halfWorldSizeX;
    }

    /**
     * [KO] 전체 지형 세로 월드 크기의 절반(`worldSizeZ / 2`)을 반환합니다.
     * [EN] Returns half of the total terrain world depth (`worldSizeZ / 2`).
     */
    get halfWorldSizeZ(): number {
        return this.#halfWorldSizeZ;
    }

    /**
     * [KO] 그리드의 타일 개수 및 타일 크기 설정을 변경하고 기존 셀 목록을 초기화합니다.
     * [EN] Updates the tile count and tile size configuration of the grid and clears the existing cell list.
     *
     * @param tileCountX -
     * [KO] 가로(X) 방향 타일 개수
     * [EN] Number of tiles along the X axis
     * @param tileCountZ -
     * [KO] 세로(Z) 방향 타일 개수
     * [EN] Number of tiles along the Z axis
     * @param tileSizeX -
     * [KO] 단일 타일의 가로(X) 월드 크기
     * [EN] World width (X) of a single tile
     * @param tileSizeZ -
     * [KO] 단일 타일의 세로(Z) 월드 크기
     * [EN] World depth (Z) of a single tile
     */
    setConfig(tileCountX: number, tileCountZ: number, tileSizeX: number, tileSizeZ: number): void {
        this.#tileCountX = tileCountX;
        this.#tileCountZ = tileCountZ;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#halfWorldSizeX = (tileCountX * tileSizeX) / 2;
        this.#halfWorldSizeZ = (tileCountZ * tileSizeZ) / 2;
        this.#updateTuples();
        this.#flatCells.length = 0;
    }

    /**
     * [KO] 현재 그리드 설정에 맞춰 모든 `LandscapeComponent` 타일 인스턴스를 재생성합니다.
     * [EN] Rebuilds all `LandscapeComponent` tile instances according to the current grid configuration.
     *
     * @param onTileCreated -
     * [KO] 각 타일 컴포넌트가 생성될 때 호출되는 콜백 함수 (선택)
     * [EN] Callback function invoked when each tile component is created (optional)
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
     * [KO] 지정된 행(Row)과 열(Column) 인덱스에 위치한 타일 컴포넌트를 반환합니다.
     * [EN] Returns the tile component located at the specified row and column indices.
     *
     * @param row -
     * [KO] 행(Z) 인덱스
     * [EN] Row (Z) index
     * @param col -
     * [KO] 열(X) 인덱스
     * [EN] Column (X) index
     * @returns
     * [KO] 해당 위치의 `LandscapeComponent` 또는 범위를 벗어난 경우 `null`
     * [EN] `LandscapeComponent` at the position, or `null` if out of bounds
     */
    getComponent(row: number, col: number): LandscapeComponent | null {
        if (row < 0 || row >= this.#tileCountZ || col < 0 || col >= this.#tileCountX) return null;
        return this.#flatCells[row * this.#tileCountX + col] || null;
    }

    /**
     * [KO] 월드 `(x, z)` 좌표를 그리드 셀 좌표(`[col, row]`)로 변환하여 출력 버퍼에 기록합니다.
     * [EN] Converts world `(x, z)` coordinates to grid cell coordinates (`[col, row]`) and writes them into the output buffer.
     *
     * @param x -
     * [KO] 월드 X 좌표
     * [EN] World X coordinate
     * @param z -
     * [KO] 월드 Z 좌표
     * [EN] World Z coordinate
     * @param outBuffer -
     * [KO] `[col, row]` 결과를 저장할 길이가 2 이상인 `Int32Array` 버퍼
     * [EN] `Int32Array` buffer of length 2 or greater to store the `[col, row]` result
     */
    getCellCoordinates(x: number, z: number, outBuffer: Int32Array): void {
        const col = Math.floor((x + this.#halfWorldSizeX) / this.#tileSizeX);
        const row = Math.floor((z + this.#halfWorldSizeZ) / this.#tileSizeZ);

        outBuffer[0] = Math.min(Math.max(0, col), this.#tileCountX - 1);
        outBuffer[1] = Math.min(Math.max(0, row), this.#tileCountZ - 1);
    }

    /**
     * [KO] 주어진 카메라 월드 좌표 반경 내에 포함되는 활성 타일 컴포넌트들을 검색하여 출력 배열에 담습니다.
     * [EN] Searches for active tile components within the given radius around the camera world coordinates and populates the output array.
     *
     * @param camX -
     * [KO] 기준 중심(카메라) 월드 X 좌표
     * [EN] Reference center (camera) world X coordinate
     * @param camZ -
     * [KO] 기준 중심(카메라) 월드 Z 좌표
     * [EN] Reference center (camera) world Z coordinate
     * @param tileLoadingRadius -
     * [KO] 검색 반경 (월드 단위)
     * [EN] Search radius (in world units)
     * @param outArray -
     * [KO] 검색된 `LandscapeComponent` 목록이 채워질 재사용 배열 (`Array<LandscapeComponent>`)
     * [EN] Reusable array (`Array<LandscapeComponent>`) to be populated with the found `LandscapeComponent` list
     * @returns
     * [KO] 반경 내에서 검색된 타일 컴포넌트의 개수
     * [EN] Number of tile components found within the radius
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
