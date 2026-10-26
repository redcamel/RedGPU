import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import Line3D from "./Line3D";
import LINE_TYPE from "./LINE_TYPE";
/**
 * [KO] 2D 평면에서 점들을 연결하여 직선 또는 곡선(Bezier, Catmull-Rom)을 렌더링하는 클래스입니다.
 * [EN] Class that renders straight lines or curves (Bezier, Catmull-Rom) by connecting points on a 2D plane.
 *
 * [KO] `geometry`와 `material`은 인스턴스 생성 시 내부적으로 자동 할당되며 임의로 변경할 수 없습니다.
 * [EN] `geometry` and `material` are automatically assigned internally upon instantiation and cannot be changed.
 *
 * ### Example
 * ```typescript
 * const line = new RedGPU.Display.Line2D(redGPUContext);
 * line.addPoint(0, 0);
 * line.addPoint(100, 100);
 * scene.addChild(line);
 * ```
 *
 * @see [Line2D Linear example](/RedGPU/examples/2d/line2D/linear/)
 * @category Line
 */
declare class Line2D extends Line3D {
    /**
     * [KO] `Line2D` 인스턴스를 생성합니다.
     * [EN] Creates a `Line2D` instance.
     *
     * ### Example
     * ```typescript
     * const line = new RedGPU.Display.Line2D(redGPUContext, RedGPU.Display.LINE_TYPE.LINEAR, '#ffffff');
     * ```
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param type -
     * [KO] 라인 보간 타입 (기본값: `LINE_TYPE.LINEAR`)
     * [EN] Line interpolation type (default: `LINE_TYPE.LINEAR`)
     * @param baseColor -
     * [KO] 기본 선 색상 (HEX 문자열, 기본값: `'#fff'`)
     * [EN] Base line color (HEX string, default: `'#fff'`)
     */
    constructor(redGPUContext: RedGPUContext, type?: LINE_TYPE, baseColor?: string);
    /**
     * [KO] 라인에 자동 할당된 지오메트리를 반환합니다. 외부에서 변경할 수 없습니다.
     * [EN] Returns the geometry automatically assigned to the line. Cannot be modified externally.
     *
     * @returns
     * [KO] 라인 지오메트리 객체
     * [EN] Line geometry object
     */
    get geometry(): Geometry | Primitive;
    set geometry(value: Geometry | Primitive);
    /**
     * [KO] 라인에 자동 할당된 전용 재질(`LineMaterial`)을 반환합니다. 외부에서 변경할 수 없습니다.
     * [EN] Returns the dedicated material (`LineMaterial`) automatically assigned to the line. Cannot be modified externally.
     *
     * @returns
     * [KO] 라인 재질 객체
     * [EN] Line material object
     */
    get material(): any;
    set material(value: any);
    /**
     * [KO] `Line2D` 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a custom vertex shader module dedicated to `Line2D`.
     *
     * @returns
     * [KO] 생성된 `GPUShaderModule` 인스턴스
     * [EN] Created `GPUShaderModule` instance
     */
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
    /**
     * [KO] 2D 평면 경로의 끝에 새로운 정점(Point)을 추가합니다.
     * [EN] Appends a new point to the end of the 2D plane path.
     *
     * ### Example
     * ```typescript
     * line.addPoint(100, 50, '#ff0000', 1.0);
     * ```
     *
     * @param x -
     * [KO] X 좌표 (기본값: `0`)
     * [EN] X coordinate (default: `0`)
     * @param y -
     * [KO] Y 좌표 (기본값: `0`)
     * [EN] Y coordinate (default: `0`)
     * @param color -
     * [KO] 정점 색상 HEX 문자열 (기본값: `this.baseColor`)
     * [EN] Point color HEX string (default: `this.baseColor`)
     * @param colorAlpha -
     * [KO] 색상 불투명도 (`0` ~ `1`, 기본값: `1`)
     * [EN] Color opacity (`0` to `1`, default: `1`)
     * @param inX -
     * [KO] 진입 제어점(In Tangent) X 좌표 (기본값: `0`)
     * [EN] In-tangent control point X coordinate (default: `0`)
     * @param inY -
     * [KO] 진입 제어점(In Tangent) Y 좌표 (기본값: `0`)
     * [EN] In-tangent control point Y coordinate (default: `0`)
     * @param outX -
     * [KO] 진출 제어점(Out Tangent) X 좌표 (기본값: `0`)
     * [EN] Out-tangent control point X coordinate (default: `0`)
     * @param outY -
     * [KO] 진출 제어점(Out Tangent) Y 좌표 (기본값: `0`)
     * [EN] Out-tangent control point Y coordinate (default: `0`)
     */
    addPoint(x?: number, y?: number, color?: string, colorAlpha?: number, inX?: number, inY?: number, outX?: number, outY?: number): void;
    /**
     * [KO] 2D 평면 경로의 지정된 인덱스에 정점(Point)을 삽입합니다.
     * [EN] Inserts a point at the specified index in the 2D plane path.
     *
     * ### Example
     * ```typescript
     * line.addPointAt(1, 50, 50, '#00ff00', 1.0);
     * ```
     *
     * @param index -
     * [KO] 정점을 삽입할 인덱스
     * [EN] Index at which to insert the point
     * @param x -
     * [KO] X 좌표 (기본값: `0`)
     * [EN] X coordinate (default: `0`)
     * @param y -
     * [KO] Y 좌표 (기본값: `0`)
     * [EN] Y coordinate (default: `0`)
     * @param color -
     * [KO] 정점 색상 HEX 문자열 (기본값: `this.baseColor`)
     * [EN] Point color HEX string (default: `this.baseColor`)
     * @param colorAlpha -
     * [KO] 색상 불투명도 (`0` ~ `1`, 기본값: `1`)
     * [EN] Color opacity (`0` to `1`, default: `1`)
     * @param inX -
     * [KO] 진입 제어점(In Tangent) X 좌표 (기본값: `0`)
     * [EN] In-tangent control point X coordinate (default: `0`)
     * @param inY -
     * [KO] 진입 제어점(In Tangent) Y 좌표 (기본값: `0`)
     * [EN] In-tangent control point Y coordinate (default: `0`)
     * @param outX -
     * [KO] 진출 제어점(Out Tangent) X 좌표 (기본값: `0`)
     * [EN] Out-tangent control point X coordinate (default: `0`)
     * @param outY -
     * [KO] 진출 제어점(Out Tangent) Y 좌표 (기본값: `0`)
     * [EN] Out-tangent control point Y coordinate (default: `0`)
     */
    addPointAt(index: number, x?: number, y?: number, color?: string, colorAlpha?: number, inX?: number, inY?: number, outX?: number, outY?: number): void;
}
export default Line2D;
