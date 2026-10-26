/**
 * [KO] 선을 구성하는 단일 정점의 위치와 색상 데이터를 저장하는 내부 데이터 클래스입니다.
 * [EN] Internal data class that stores position and color data for a single vertex constituting a line.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Line
 */
class LinePoint {
    /**
     * [KO] 정점의 3차원 위치 좌표 `[x, y, z]`
     * [EN] 3D position coordinates `[x, y, z]` of the vertex
     */
    position: [number, number, number]
    /**
     * [KO] 정점의 정규화된 RGBA 색상 배열 `[r, g, b, a]`
     * [EN] Normalized RGBA color array `[r, g, b, a]` of the vertex
     */
    colorRGBA: [number, number, number, number]

    /**
     * [KO] LinePoint 인스턴스를 생성합니다.
     * [EN] Creates a LinePoint instance.
     *
     * @param x -
     * [KO] 정점의 X 좌표 (기본값: 0)
     * [EN] X coordinate of the vertex (default: 0)
     * @param y -
     * [KO] 정점의 Y 좌표 (기본값: 0)
     * [EN] Y coordinate of the vertex (default: 0)
     * @param z -
     * [KO] 정점의 Z 좌표 (기본값: 0)
     * [EN] Z coordinate of the vertex (default: 0)
     * @param colorRGBA -
     * [KO] 정점의 정규화된 RGBA 색상 배열 `[r, g, b, a]`
     * [EN] Normalized RGBA color array `[r, g, b, a]` of the vertex
     */
    constructor(
        x = 0, y = 0, z = 0,
        colorRGBA: [number, number, number, number]
    ) {
        this.position = [x, y, z]
        this.colorRGBA = colorRGBA
    }
}

export default LinePoint
