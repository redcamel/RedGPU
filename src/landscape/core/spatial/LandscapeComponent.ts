/**
 * [KO] 지형 개별 타일(청크) 컴포넌트의 공간 위치 및 인덱스 메타데이터 모듈입니다.
 * [EN] Spatial world coordinates and grid index metadata module for individual terrain tiles (chunks).
 * @packageDocumentation
 */

/**
 * [KO] Landscape를 구성하는 개별 타일(청크) 컴포넌트의 공간 위치 및 인덱스 메타데이터를 저장하는 불변 값 객체입니다.
 * [EN] Immutable value object storing the spatial world coordinates and grid component indices of an individual terrain tile (chunk).
 *
 * **[KO] 아키텍처 및 역할:**
 * - **공간 분할의 최소 단위**: 전체 거대 지형을 바둑판 형태로 나눈 N x M 그리드 상에서 단일 타일 청크를 표현합니다.
 * - **불변 값 객체 (Immutable Value Object)**: 생성 시점에 월드 좌표(`worldX`, `worldZ`), 그리드 좌표(`componentX`, `componentZ`), 고유 키(`key`)가 결정되며 변경되지 않으므로, 비동기 스트리밍 및 공간 쿼리 시 완벽한 스레드 안전성과 참조 무결성을 보장합니다.
 * - **가상 텍스처 및 인스턴싱 인덱싱**: 타일의 고유 식별자 키(`"{componentZ}_{componentX}"`)를 통해 VHT/VNT/VBT 아틀라스 내의 오프셋 계산 및 렌더링 인스턴스 슬롯 매핑의 기준점이 됩니다.
 *
 * **[EN] Architecture & Role:**
 * - **Atomic Spatial Unit**: Represents an individual tile chunk on an N x M grid partitioning a large-scale landscape terrain.
 * - **Immutable Value Object**: Coordinates (`worldX`, `worldZ`), grid indices (`componentX`, `componentZ`), and unique key (`key`) are assigned at instantiation, guaranteeing thread-safety and referential integrity across async streaming pipelines.
 * - **Virtual Texture & Instancing Indexing**: The unique key (`"{componentZ}_{componentX}"`) serves as the lookup basis for calculating VHT/VNT/VBT atlas tile slots and GPU instance buffer indices.
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
    #minHeightNorm: number = 0.0;
    #maxHeightNorm: number = 1.0;
    #key: string = '';

    /**
     * [KO] LandscapeComponent 생성자입니다.
     * [EN] Constructor for LandscapeComponent.
     *
     * @param worldX - [KO] 타일 중심의 월드 X 좌표 / [EN] World X coordinate of the tile center
     * @param worldZ - [KO] 타일 중심의 월드 Z 좌표 / [EN] World Z coordinate of the tile center
     * @param componentX - [KO] 그리드 컬럼 인덱스 (X축 청크 번호) / [EN] Grid column index (chunk index along X axis)
     * @param componentZ - [KO] 그리드 행 인덱스 (Z축 청크 번호) / [EN] Grid row index (chunk index along Z axis)
     * @param minHeightNorm - [KO] 타일 영역 내 지형의 최소 정규화 높이 비율 (0.0~1.0) / [EN] Minimum normalized height ratio (0.0~1.0)
     * @param maxHeightNorm - [KO] 타일 영역 내 지형의 최대 정규화 높이 비율 (0.0~1.0) / [EN] Maximum normalized height ratio (0.0~1.0)
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

    /**
     * [KO] 타일 영역 내 지형의 최소 정규화 높이 비율(0.0~1.0)을 반환합니다.
     * [EN] Returns the minimum normalized height ratio (0.0 to 1.0) of terrain within the tile area.
     */
    get minHeightNorm(): number {
        return this.#minHeightNorm;
    }

    /**
     * [KO] 타일 영역 내 지형의 최대 정규화 높이 비율(0.0~1.0)을 반환합니다.
     * [EN] Returns the maximum normalized height ratio (0.0 to 1.0) of terrain within the tile area.
     */
    get maxHeightNorm(): number {
        return this.#maxHeightNorm;
    }

    /**
     * [KO] 타일 영역 내 지형의 최소/최대 정규화 높이 범위(0.0~1.0)를 갱신합니다.
     * [EN] Updates the minimum/maximum normalized height range (0.0 to 1.0) of terrain within the tile area.
     *
     * @param minHeightNorm - [KO] 최소 정규화 높이 비율 (0.0~1.0) / [EN] Minimum normalized height ratio (0.0 to 1.0)
     * @param maxHeightNorm - [KO] 최대 정규화 높이 비율 (0.0~1.0) / [EN] Maximum normalized height ratio (0.0 to 1.0)
     */
    setHeightBounds(minHeightNorm: number, maxHeightNorm: number): void {
        this.#minHeightNorm = minHeightNorm;
        this.#maxHeightNorm = maxHeightNorm;
    }
}

Object.freeze(LandscapeComponent);
export default LandscapeComponent;
