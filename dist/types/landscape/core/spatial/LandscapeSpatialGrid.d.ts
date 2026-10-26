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
declare class LandscapeSpatialGrid {
    #private;
    /**
     * [KO] `LandscapeSpatialGrid` 인스턴스를 생성합니다.
     * [EN] Creates a `LandscapeSpatialGrid` instance.
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
    constructor(tileCountX: number, tileCountZ: number, tileSizeX: number, tileSizeZ: number);
    /**
     * [KO] 전체 지형의 월드 크기 튜플(`[worldSizeX, worldSizeZ]`)을 반환합니다.
     * [EN] Returns the world size tuple (`[worldSizeX, worldSizeZ]`) of the entire terrain.
     *
     * @returns
     * [KO] 전체 지형 월드 크기 튜플 (`[number, number]`)
     * [EN] Entire terrain world size tuple (`[number, number]`)
     */
    get worldSize(): [number, number];
    /**
     * [KO] 타일 컴포넌트 개수 튜플(`[tileCountX, tileCountZ]`)을 반환합니다.
     * [EN] Returns the tile component count tuple (`[tileCountX, tileCountZ]`).
     *
     * @returns
     * [KO] 타일 컴포넌트 개수 튜플 (`[number, number]`)
     * [EN] Tile component count tuple (`[number, number]`)
     */
    get componentCount(): [number, number];
    /**
     * [KO] 단일 타일의 월드 크기 튜플(`[tileSizeX, tileSizeZ]`)을 반환합니다.
     * [EN] Returns the single tile world size tuple (`[tileSizeX, tileSizeZ]`).
     *
     * @returns
     * [KO] 단일 타일 월드 크기 튜플 (`[number, number]`)
     * [EN] Single tile world size tuple (`[number, number]`)
     */
    get tileSize(): [number, number];
    /**
     * [KO] 전체 지형의 가로(X) 월드 크기를 반환합니다.
     * [EN] Returns the total world width (X) of the terrain.
     *
     * @returns
     * [KO] 전체 지형 가로(X) 월드 크기
     * [EN] Total terrain world width (X)
     */
    get worldSizeX(): number;
    /**
     * [KO] 전체 지형의 세로(Z) 월드 크기를 반환합니다.
     * [EN] Returns the total world depth (Z) of the terrain.
     *
     * @returns
     * [KO] 전체 지형 세로(Z) 월드 크기
     * [EN] Total terrain world depth (Z)
     */
    get worldSizeZ(): number;
    /**
     * [KO] 전체 지형 가로 월드 크기의 역수(`1 / worldSizeX`)를 반환합니다.
     * [EN] Returns the reciprocal of the total terrain world width (`1 / worldSizeX`).
     *
     * @returns
     * [KO] 가로 월드 크기의 역수
     * [EN] Reciprocal of the world width
     */
    get invWorldSizeX(): number;
    /**
     * [KO] 전체 지형 세로 월드 크기의 역수(`1 / worldSizeZ`)를 반환합니다.
     * [EN] Returns the reciprocal of the total terrain world depth (`1 / worldSizeZ`).
     *
     * @returns
     * [KO] 세로 월드 크기의 역수
     * [EN] Reciprocal of the world depth
     */
    get invWorldSizeZ(): number;
    /**
     * [KO] 그리드 내 모든 타일 컴포넌트의 1차원 배열(`Array<LandscapeComponent>`)을 반환합니다.
     * [EN] Returns the 1D array (`Array<LandscapeComponent>`) of all tile components in the grid.
     *
     * @returns
     * [KO] 타일 컴포넌트 1차원 배열 (`Array<LandscapeComponent>`)
     * [EN] 1D array of tile components (`Array<LandscapeComponent>`)
     */
    get flatCells(): LandscapeComponent[];
    /**
     * [KO] 가로(X) 방향 타일 개수를 반환합니다.
     * [EN] Returns the number of tiles along the X axis.
     *
     * @returns
     * [KO] 가로(X) 방향 타일 개수
     * [EN] Number of tiles along the X axis
     */
    get tileCountX(): number;
    /**
     * [KO] 세로(Z) 방향 타일 개수를 반환합니다.
     * [EN] Returns the number of tiles along the Z axis.
     *
     * @returns
     * [KO] 세로(Z) 방향 타일 개수
     * [EN] Number of tiles along the Z axis
     */
    get tileCountZ(): number;
    /**
     * [KO] 단일 타일의 가로(X) 월드 크기를 반환합니다.
     * [EN] Returns the world width (X) of a single tile.
     *
     * @returns
     * [KO] 단일 타일 가로(X) 월드 크기
     * [EN] Single tile world width (X)
     */
    get tileSizeX(): number;
    /**
     * [KO] 단일 타일의 세로(Z) 월드 크기를 반환합니다.
     * [EN] Returns the world depth (Z) of a single tile.
     *
     * @returns
     * [KO] 단일 타일 세로(Z) 월드 크기
     * [EN] Single tile world depth (Z)
     */
    get tileSizeZ(): number;
    /**
     * [KO] 전체 지형 가로 월드 크기의 절반(`worldSizeX / 2`)을 반환합니다.
     * [EN] Returns half of the total terrain world width (`worldSizeX / 2`).
     *
     * @returns
     * [KO] 전체 지형 가로 월드 크기의 절반
     * [EN] Half of the total terrain world width
     */
    get halfWorldSizeX(): number;
    /**
     * [KO] 전체 지형 세로 월드 크기의 절반(`worldSizeZ / 2`)을 반환합니다.
     * [EN] Returns half of the total terrain world depth (`worldSizeZ / 2`).
     *
     * @returns
     * [KO] 전체 지형 세로 월드 크기의 절반
     * [EN] Half of the total terrain world depth
     */
    get halfWorldSizeZ(): number;
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
    setConfig(tileCountX: number, tileCountZ: number, tileSizeX: number, tileSizeZ: number): void;
    /**
     * [KO] 현재 그리드 설정에 맞춰 모든 `LandscapeComponent` 타일 인스턴스를 재생성합니다.
     * [EN] Rebuilds all `LandscapeComponent` tile instances according to the current grid configuration.
     *
     * @param onTileCreated -
     * [KO] 각 타일 컴포넌트가 생성될 때 호출되는 콜백 함수 (선택)
     * [EN] Callback function invoked when each tile component is created (optional)
     */
    rebuildTiles(onTileCreated?: (comp: LandscapeComponent, index: number) => void): void;
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
    getComponent(row: number, col: number): LandscapeComponent | null;
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
    getCellCoordinates(x: number, z: number, outBuffer: Int32Array): void;
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
    getActiveComponentsInRadius(camX: number, camZ: number, tileLoadingRadius: number, outArray: LandscapeComponent[]): number;
}
export default LandscapeSpatialGrid;
