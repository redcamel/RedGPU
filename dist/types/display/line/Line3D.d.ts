import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import Mesh from "../mesh/Mesh";
import LinePointWithInOut from "./core/LinePointWithInOut";
import LINE_TYPE from "./LINE_TYPE";
/**
 * [KO] 3D 공간에서 선(라인)을 표현하는 클래스입니다.
 * [EN] Class representing a line in 3D space.
 *
 * [KO] 3D 공간상에서 여러 점을 연결하여 선을 그릴 수 있으며, 직선뿐만 아니라 베지어(Bezier), 캣멀-롬(Catmull-Rom) 곡선 타입을 지원합니다.
 * [EN] You can draw lines by connecting multiple points in 3D space, supporting not only straight lines but also Bezier and Catmull-Rom curve types.
 *
 * [KO] geometry와 material은 생성 시 자동으로 할당되며, 이후 변경이 불가능합니다.
 * [EN] Geometry and material are automatically assigned during creation and cannot be changed thereafter.
 *
 * * ### Example
 * ```typescript
 * const line = new RedGPU.Display.Line3D(redGPUContext, RedGPU.Display.LINE_TYPE.LINEAR);
 * line.addPoint(0, 0, 0);
 * line.addPoint(10, 10, 10);
 * scene.addChild(line);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/line3D/linear/"></iframe>
 *
 * [KO] 아래는 Line3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of Line3D.
 * @see [Line3D Bezier Type example](/RedGPU/examples/3d/line3D/bezier/)
 * @see [Line3D CatmullRom Type example](/RedGPU/examples/3d/line3D/catmullRom/)
 *
 * @experimental
 * @category Line
 */
declare class Line3D extends Mesh {
    #private;
    /**
     * [KO] 기본 색상
     * [EN] Base color
     */
    baseColor: any;
    /**
     * [KO] Line3D 인스턴스를 생성합니다.
     * [EN] Creates an instance of Line3D.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     * @param type -
     * [KO] 라인 타입 (기본값: LINE_TYPE.LINEAR)
     * [EN] Line type (default: LINE_TYPE.LINEAR)
     * @param baseColor -
     * [KO] 기본 색상 (기본값: #fff)
     * [EN] Base color (default: #fff)
     */
    constructor(redGPUContext: RedGPUContext, type?: LINE_TYPE, baseColor?: string);
    /**
     * 원본 점(LinePointWithInOut) 배열을 반환합니다.
     */
    get originalPoints(): LinePointWithInOut[];
    /**
     * 라인 타입을 반환/설정합니다.
     */
    get type(): LINE_TYPE;
    set type(value: LINE_TYPE);
    /**
     * 버텍스 interleave 데이터 배열을 반환합니다.
     */
    get interleaveData(): number[];
    /**
     * Catmull-Rom 곡선의 텐션 값을 반환/설정합니다.
     */
    get tension(): number;
    set tension(value: number);
    /**
     * 곡선 샘플링 허용 오차를 반환/설정합니다.
     */
    get tolerance(): number;
    set tolerance(value: number);
    /**
     * 곡선 단순화 허용 거리를 반환/설정합니다.
     */
    get distance(): number;
    set distance(value: number);
    /**
     * 현재 라인의 점 개수를 반환합니다.
     */
    get numPoints(): number;
    /**
     * geometry를 반환합니다. (생성 시 자동 할당, 변경 불가)
     */
    get geometry(): Geometry | Primitive;
    /**
     * geometry를 변경할 수 없습니다.
     */
    set geometry(value: Geometry | Primitive);
    /**
     * material을 반환합니다. (생성 시 자동 할당, 변경 불가)
     */
    get material(): any;
    /**
     * material을 변경할 수 없습니다.
     */
    set material(value: any);
    /**
     * 커스텀 버텍스 셰이더 모듈을 생성합니다.
     *
     */
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
    /**
     * 3D 공간상에 점을 추가합니다.
     * @param x X 좌표
     * @param y Y 좌표
     * @param z Z 좌표
     * @param color 점 색상 (기본값: baseColor)
     * @param colorAlpha 알파값 (기본값: 1)
     * @param inX in tangent X (기본값: 0)
     * @param inY in tangent Y (기본값: 0)
     * @param inZ in tangent Z (기본값: 0)
     * @param outX out tangent X (기본값: 0)
     * @param outY out tangent Y (기본값: 0)
     * @param outZ out tangent Z (기본값: 0)
     */
    addPoint(x?: number, y?: number, z?: number, color?: string, colorAlpha?: number, inX?: number, inY?: number, inZ?: number, outX?: number, outY?: number, outZ?: number): void;
    /**
     * 3D 공간상에 지정한 위치에 점을 추가합니다.
     * @param index 추가할 위치 인덱스
     * @param x X 좌표
     * @param y Y 좌표
     * @param z Z 좌표
     * @param color 점 색상 (기본값: baseColor)
     * @param colorAlpha 알파값 (기본값: 1)
     * @param inX in tangent X (기본값: 0)
     * @param inY in tangent Y (기본값: 0)
     * @param inZ in tangent Z (기본값: 0)
     * @param outX out tangent X (기본값: 0)
     * @param outY out tangent Y (기본값: 0)
     * @param outZ out tangent Z (기본값: 0)
     */
    addPointAt(index: number, x?: number, y?: number, z?: number, color?: string, colorAlpha?: number, inX?: number, inY?: number, inZ?: number, outX?: number, outY?: number, outZ?: number): void;
    /**
     * 지정한 위치의 점을 삭제합니다.
     * @param index 삭제할 위치 인덱스
     */
    removePointAt(index: number): void;
    /**
     * 모든 점을 삭제합니다.
     */
    removeAllPoint(): void;
}
export default Line3D;
