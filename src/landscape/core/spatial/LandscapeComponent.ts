/**
 * [KO] 지형(Landscape) 공간 그리드를 구성하는 개별 타일 컴포넌트 데이터를 관리하는 클래스입니다.
 * [EN] Class that manages individual tile component data constituting the Landscape spatial grid.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
class LandscapeComponent {
    #worldX: number = 0;
    #worldZ: number = 0;
    #componentX: number = 0;
    #componentZ: number = 0;
    #minHeightNorm: number = 0.0;
    #maxHeightNorm: number = 1.0;
    #key: string = '';

    /**
     * [KO] `LandscapeComponent` 인스턴스를 생성합니다.
     * [EN] Creates a `LandscapeComponent` instance.
     *
     * @param worldX -
     * [KO] 타일 중심의 월드 X 좌표
     * [EN] World X coordinate of the tile center
     * @param worldZ -
     * [KO] 타일 중심의 월드 Z 좌표
     * [EN] World Z coordinate of the tile center
     * @param componentX -
     * [KO] 그리드 내 타일의 열(Column) 인덱스
     * [EN] Column index of the tile within the grid
     * @param componentZ -
     * [KO] 그리드 내 타일의 행(Row) 인덱스
     * [EN] Row index of the tile within the grid
     * @param minHeightNorm -
     * [KO] 정규화된 최소 높이값 (`0.0` ~ `1.0`)
     * [EN] Normalized minimum height value (`0.0` to `1.0`)
     * @param maxHeightNorm -
     * [KO] 정규화된 최대 높이값 (`0.0` ~ `1.0`)
     * [EN] Normalized maximum height value (`0.0` to `1.0`)
     */
    constructor(
        worldX: number = 0,
        worldZ: number = 0,
        componentX: number = 0,
        componentZ: number = 0,
        minHeightNorm: number = 0.0,
        maxHeightNorm: number = 1.0
    ) {
        this.#worldX = worldX;
        this.#worldZ = worldZ;
        this.#componentX = componentX;
        this.#componentZ = componentZ;
        this.#minHeightNorm = minHeightNorm;
        this.#maxHeightNorm = maxHeightNorm;
        this.#key = `${componentZ}_${componentX}`;
    }

    /**
     * [KO] 타일 컴포넌트를 식별하는 고유 키(`{componentZ}_{componentX}`)를 반환합니다.
     * [EN] Returns the unique key (`{componentZ}_{componentX}`) identifying the tile component.
     *
     * @returns
     * [KO] 타일 고유 식별 키 문자열
     * [EN] Unique tile identifier key string
     */
    get key(): string {
        return this.#key;
    }

    /**
     * [KO] 타일 중심의 월드 X 좌표를 반환합니다.
     * [EN] Returns the world X coordinate of the tile center.
     *
     * @returns
     * [KO] 타일 중심 월드 X 좌표
     * [EN] Tile center world X coordinate
     */
    get worldX(): number {
        return this.#worldX;
    }

    /**
     * [KO] 타일 중심의 월드 Z 좌표를 반환합니다.
     * [EN] Returns the world Z coordinate of the tile center.
     *
     * @returns
     * [KO] 타일 중심 월드 Z 좌표
     * [EN] Tile center world Z coordinate
     */
    get worldZ(): number {
        return this.#worldZ;
    }

    /**
     * [KO] 그리드 내 타일의 열(Column) 인덱스를 반환합니다.
     * [EN] Returns the column index of the tile within the grid.
     *
     * @returns
     * [KO] 타일 열(X) 인덱스
     * [EN] Tile column (X) index
     */
    get componentX(): number {
        return this.#componentX;
    }

    /**
     * [KO] 그리드 내 타일의 행(Row) 인덱스를 반환합니다.
     * [EN] Returns the row index of the tile within the grid.
     *
     * @returns
     * [KO] 타일 행(Z) 인덱스
     * [EN] Tile row (Z) index
     */
    get componentZ(): number {
        return this.#componentZ;
    }

    /**
     * [KO] 타일의 정규화된 최소 높이값을 반환합니다.
     * [EN] Returns the normalized minimum height value of the tile.
     *
     * @returns
     * [KO] 정규화된 최소 높이값 (`0.0` ~ `1.0`)
     * [EN] Normalized minimum height value (`0.0` to `1.0`)
     */
    get minHeightNorm(): number {
        return this.#minHeightNorm;
    }

    /**
     * [KO] 타일의 정규화된 최대 높이값을 반환합니다.
     * [EN] Returns the normalized maximum height value of the tile.
     *
     * @returns
     * [KO] 정규화된 최대 높이값 (`0.0` ~ `1.0`)
     * [EN] Normalized maximum height value (`0.0` to `1.0`)
     */
    get maxHeightNorm(): number {
        return this.#maxHeightNorm;
    }

    /**
     * [KO] 타일의 정규화된 최소 및 최대 높이 경계값을 설정합니다.
     * [EN] Sets the normalized minimum and maximum height bounds of the tile.
     *
     * @param minHeightNorm -
     * [KO] 정규화된 최소 높이값
     * [EN] Normalized minimum height value
     * @param maxHeightNorm -
     * [KO] 정규화된 최대 높이값
     * [EN] Normalized maximum height value
     */
    setHeightBounds(minHeightNorm: number, maxHeightNorm: number): void {
        this.#minHeightNorm = minHeightNorm;
        this.#maxHeightNorm = maxHeightNorm;
    }
}

Object.freeze(LandscapeComponent);
export default LandscapeComponent;
