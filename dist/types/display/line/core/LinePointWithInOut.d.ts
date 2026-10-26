import LinePoint from "./LinePoint";
/**
 * [KO] 선 정점과 진입(in)/진출(out) 제어점 정보를 함께 관리하는 내부 데이터 클래스입니다.
 * [EN] Internal data class that manages a line vertex along with its incoming (in) and outgoing (out) control point information.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Line
 */
declare class LinePointWithInOut {
    /**
     * [KO] 진입(in) 제어점 데이터
     * [EN] Incoming (in) control point data
     */
    inLinePoint: LinePoint;
    /**
     * [KO] 기준 정점 데이터
     * [EN] Base vertex data
     */
    linePoint: LinePoint;
    /**
     * [KO] 진출(out) 제어점 데이터
     * [EN] Outgoing (out) control point data
     */
    outLinePoint: LinePoint;
    /**
     * [KO] LinePointWithInOut 인스턴스를 생성합니다.
     * [EN] Creates a LinePointWithInOut instance.
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
     * @param inX -
     * [KO] 진입 제어점의 X 좌표 (기본값: 0)
     * [EN] X coordinate of the incoming control point (default: 0)
     * @param inY -
     * [KO] 진입 제어점의 Y 좌표 (기본값: 0)
     * [EN] Y coordinate of the incoming control point (default: 0)
     * @param inZ -
     * [KO] 진입 제어점의 Z 좌표 (기본값: 0)
     * [EN] Z coordinate of the incoming control point (default: 0)
     * @param outX -
     * [KO] 진출 제어점의 X 좌표 (기본값: 0)
     * [EN] X coordinate of the outgoing control point (default: 0)
     * @param outY -
     * [KO] 진출 제어점의 Y 좌표 (기본값: 0)
     * [EN] Y coordinate of the outgoing control point (default: 0)
     * @param outZ -
     * [KO] 진출 제어점의 Z 좌표 (기본값: 0)
     * [EN] Z coordinate of the outgoing control point (default: 0)
     * @param color -
     * [KO] 정점 색상 (Hex 문자열)
     * [EN] Vertex color (Hex string)
     * @param colorAlpha -
     * [KO] 정점 색상 투명도 (0~1)
     * [EN] Vertex color alpha (0 to 1)
     */
    constructor(x: number, y: number, z: number, inX: number, inY: number, inZ: number, outX: number, outY: number, outZ: number, color: any, colorAlpha: any);
}
export default LinePointWithInOut;
