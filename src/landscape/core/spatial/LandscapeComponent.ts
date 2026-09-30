/**
 * [KO] Landscape를 구성하는 개별 타일(청크) 컴포넌트의 공간 위치 및 인덱스 메타데이터를 저장하는 불변 값 객체입니다.
 * [EN] Immutable value object storing the spatial world coordinates and grid component indices of an individual terrain tile (chunk).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(LandscapeSpatialGrid)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (LandscapeSpatialGrid).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class LandscapeComponent {
    #worldX: number = 0;
    #worldZ: number = 0;
    #componentX: number = 0;
    #componentZ: number = 0;
    #key: string = '';

    /**
     * [KO] LandscapeComponent 생성자입니다.
     * [EN] Constructor for LandscapeComponent.
     *
     * @param worldX - [KO] 타일 중심의 월드 X 좌표 / [EN] World X coordinate of the tile center
     * @param worldZ - [KO] 타일 중심의 월드 Z 좌표 / [EN] World Z coordinate of the tile center
     * @param componentX - [KO] 그리드 컬럼 인덱스 (X축 청크 번호) / [EN] Grid column index (chunk index along X axis)
     * @param componentZ - [KO] 그리드 행 인덱스 (Z축 청크 번호) / [EN] Grid row index (chunk index along Z axis)
     */
    constructor(
        worldX: number = 0,
        worldZ: number = 0,
        componentX: number = 0,
        componentZ: number = 0
    ) {
        this.#worldX = worldX;
        this.#worldZ = worldZ;
        this.#componentX = componentX;
        this.#componentZ = componentZ;
        this.#key = `${componentZ}_${componentX}`;
    }

    /**
     * [KO] 타일의 고유 식별자 키(`"{componentZ}_{componentX}"`)를 반환합니다.
     * [EN] Returns the unique tile identifier key (`"{componentZ}_{componentX}"`).
     */
    get key(): string {
        return this.#key;
    }

    /**
     * [KO] 타일 중심의 월드 X 좌표를 반환합니다.
     * [EN] Returns the world X coordinate of the tile center.
     */
    get worldX(): number {
        return this.#worldX;
    }

    /**
     * [KO] 타일 중심의 월드 Z 좌표를 반환합니다.
     * [EN] Returns the world Z coordinate of the tile center.
     */
    get worldZ(): number {
        return this.#worldZ;
    }

    /**
     * [KO] 타일의 그리드 컬럼 인덱스를 반환합니다.
     * [EN] Returns the grid column index of the tile.
     */
    get componentX(): number {
        return this.#componentX;
    }

    /**
     * [KO] 타일의 그리드 행 인덱스를 반환합니다.
     * [EN] Returns the grid row index of the tile.
     */
    get componentZ(): number {
        return this.#componentZ;
    }
}

Object.freeze(LandscapeComponent);
export default LandscapeComponent;
