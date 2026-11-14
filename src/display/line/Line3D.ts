import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import GPU_PRIMITIVE_TOPOLOGY from "../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import Primitive from "../../primitive/core/Primitive";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../resources/buffer/vertexBuffer/VertexInterleaveType";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import Mesh from "../mesh/Mesh";
import lineGetPointsOnBezierCurves from "./core/lineGetPointsOnBezierCurves";
import LineMaterial from "./core/LineMaterial";
import LinePoint from "./core/LinePoint";
import LinePointWithInOut from "./core/LinePointWithInOut";
import lineSerializePoints from "./core/lineSerializePoints";
import lineSimplifyPoints from "./core/lineSimplifyPoints";
import lineSolveCatmullRomPoint from "./core/lineSolveCatmullRomPoint";
import LINE_TYPE from "./LINE_TYPE";
import vertexModuleSource from "./shader/lineVertex.wgsl";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_LINE_3D'


/**
 * [KO] 3D 공간에서 점들을 연결하여 직선 또는 곡선(Bezier, Catmull-Rom)을 렌더링하는 클래스입니다.
 * [EN] Class that renders straight lines or curves (Bezier, Catmull-Rom) by connecting points in 3D space.
 *
 * [KO] `geometry`와 `material`은 인스턴스 생성 시 내부적으로 자동 할당되며 임의로 변경할 수 없습니다.
 * [EN] `geometry` and `material` are automatically assigned internally upon instantiation and cannot be changed.
 *
 * ### Example
 * ```typescript
 * const line = new RedGPU.Display.Line3D(redGPUContext, RedGPU.Display.LINE_TYPE.LINEAR);
 * line.addPoint(0, 0, 0);
 * line.addPoint(10, 10, 10);
 * scene.addChild(line);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/line3D/linear/"></iframe>
 *
 * @see [Line3D Linear Type example](/RedGPU/examples/3d/line3D/linear/)
 * @see [Line3D Bezier Type example](/RedGPU/examples/3d/line3D/bezier/)
 * @see [Line3D CatmullRom Type example](/RedGPU/examples/3d/line3D/catmullRom/)
 * @category Line
 */
class Line3D extends Mesh {
    /**
     * [KO] 기본 선 색상 (HEX 문자열)
     * [EN] Base line color (HEX string)
     */
    baseColor
    #type: LINE_TYPE
    #tension: number = 1
    #tolerance: number = 0.01
    #distance: number = 0.01
    #interleaveData: number[] = []
    #originalPoints: LinePointWithInOut[] = []
    #serializedLinePoints: LinePoint[]

    /**
     * [KO] `Line3D` 인스턴스를 생성합니다.
     * [EN] Creates a `Line3D` instance.
     *
     * ### Example
     * ```typescript
     * const line = new RedGPU.Display.Line3D(redGPUContext, RedGPU.Display.LINE_TYPE.LINEAR, '#ffffff');
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
    constructor(redGPUContext: RedGPUContext, type: LINE_TYPE = LINE_TYPE.LINEAR, baseColor: string = '#fff') {
        super(redGPUContext);
        this.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_STRIP
        this.baseColor = baseColor
        this.#type = type;
        this._geometry = new Geometry(
            redGPUContext,
            new VertexBuffer(
                redGPUContext,
                this.#interleaveData,
                new VertexInterleavedStruct(
                    {
                        vertexPosition: VertexInterleaveType.float32x3,
                        vertexColor: VertexInterleaveType.float32x4,
                    }
                )
            ),
        );
        this._material = new LineMaterial(redGPUContext)
    }

    /**
     * [KO] 입·출력 탄젠트 제어점을 포함한 원본 정점(`LinePointWithInOut`) 배열을 반환합니다.
     * [EN] Returns the array of original points (`LinePointWithInOut`) including in/out tangent control points.
     *
     * @returns
     * [KO] `LinePointWithInOut` 배열
     * [EN] Array of `LinePointWithInOut`
     */
    get originalPoints(): LinePointWithInOut[] {
        return this.#originalPoints;
    }

    /**
     * [KO] 라인의 곡선 보간 타입(`LINE_TYPE`)을 반환하거나 설정합니다.
     * [EN] Returns or sets the curve interpolation type (`LINE_TYPE`) of the line.
     *
     * @returns
     * [KO] 현재 설정된 `LINE_TYPE` 값
     * [EN] Currently set `LINE_TYPE` value
     */
    get type(): LINE_TYPE {
        return this.#type;
    }

    set type(value: LINE_TYPE) {
        this.#type = value;
        this.#parsePointsByType();
    }

    /**
     * [KO] 정점 위치와 색상 정보가 인터리브(Interleaved) 형태로 직렬화된 숫자 배열을 반환합니다.
     * [EN] Returns the number array of vertex positions and colors serialized in interleaved format.
     *
     * @returns
     * [KO] 인터리브 정점 데이터 배열 (`number[]`)
     * [EN] Interleaved vertex data array (`number[]`)
     */
    get interleaveData(): number[] {
        return this.#interleaveData;
    }

    /**
     * [KO] `LINE_TYPE.CATMULL_ROM` 곡선의 장력(Tension) 값을 반환하거나 설정합니다. (기본값: `1`, 양수 범위)
     * [EN] Returns or sets the tension value for `LINE_TYPE.CATMULL_ROM` curves. (default: `1`, positive number)
     *
     * @returns
     * [KO] Catmull-Rom 곡선 장력 값
     * [EN] Catmull-Rom curve tension value
     */
    get tension(): number {
        return this.#tension;
    }

    set tension(value: number) {
        validatePositiveNumberRange(value)
        this.#tension = value;
        this.#parsePointsByType();
    }

    /**
     * [KO] 베지어 곡선 분할 샘플링 시 평탄도 허용 오차(Tolerance)를 반환하거나 설정합니다. (기본값: `0.01`, 양수 범위)
     * [EN] Returns or sets the flatness tolerance for Bezier curve subdivision sampling. (default: `0.01`, positive number)
     *
     * @returns
     * [KO] 곡선 샘플링 허용 오차
     * [EN] Curve sampling tolerance
     */
    get tolerance(): number {
        return this.#tolerance;
    }

    set tolerance(value: number) {
        validatePositiveNumberRange(value)
        this.#tolerance = value;
        this.#parsePointsByType();
    }

    /**
     * [KO] 곡선 정점 단순화(Simplification) 시 허용 거리 임계값을 반환하거나 설정합니다. (기본값: `0.01`, 양수 범위)
     * [EN] Returns or sets the distance threshold for curve point simplification. (default: `0.01`, positive number)
     *
     * @returns
     * [KO] 곡선 단순화 거리 임계값
     * [EN] Curve simplification distance threshold
     */
    get distance(): number {
        return this.#distance;
    }

    set distance(value: number) {
        validatePositiveNumberRange(value)
        this.#distance = value;
        this.#parsePointsByType();
    }

    /**
     * [KO] 현재 라인에 등록된 원본 정점 개수를 반환합니다.
     * [EN] Returns the number of original points registered in the line.
     *
     * @returns
     * [KO] 원본 정점 개수
     * [EN] Number of original points
     */
    get numPoints(): number {
        return this.#originalPoints.length
    }

    /**
     * [KO] 라인에 자동 할당된 지오메트리를 반환합니다. 외부에서 변경할 수 없습니다.
     * [EN] Returns the geometry automatically assigned to the line. Cannot be modified externally.
     *
     * @returns
     * [KO] 라인 지오메트리 객체
     * [EN] Line geometry object
     */
    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    set geometry(value: Geometry | Primitive) {
        consoleAndThrowError('Line3D can not change geometry')
    }

    /**
     * [KO] 라인에 자동 할당된 전용 재질(`LineMaterial`)을 반환합니다. 외부에서 변경할 수 없습니다.
     * [EN] Returns the dedicated material (`LineMaterial`) automatically assigned to the line. Cannot be modified externally.
     *
     * @returns
     * [KO] 라인 재질 객체
     * [EN] Line material object
     */
    get material() {
        return this._material
    }

    set material(value) {
        consoleAndThrowError('Line3D can not change material')
    }

    /**
     * [KO] `Line3D` 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a custom vertex shader module dedicated to `Line3D`.
     *
     * @returns
     * [KO] 생성된 `GPUShaderModule` 인스턴스
     * [EN] Created `GPUShaderModule` instance
     */
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('LINE3D_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
        return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
    }

    /**
     * [KO] 3D 공간 경로의 끝에 새로운 정점(Point)을 추가합니다.
     * [EN] Appends a new point to the end of the 3D space path.
     *
     * ### Example
     * ```typescript
     * line.addPoint(10, 20, 30, '#ff0000', 1.0);
     * ```
     *
     * @param x -
     * [KO] X 좌표 (기본값: `0`)
     * [EN] X coordinate (default: `0`)
     * @param y -
     * [KO] Y 좌표 (기본값: `0`)
     * [EN] Y coordinate (default: `0`)
     * @param z -
     * [KO] Z 좌표 (기본값: `0`)
     * [EN] Z coordinate (default: `0`)
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
     * @param inZ -
     * [KO] 진입 제어점(In Tangent) Z 좌표 (기본값: `0`)
     * [EN] In-tangent control point Z coordinate (default: `0`)
     * @param outX -
     * [KO] 진출 제어점(Out Tangent) X 좌표 (기본값: `0`)
     * [EN] Out-tangent control point X coordinate (default: `0`)
     * @param outY -
     * [KO] 진출 제어점(Out Tangent) Y 좌표 (기본값: `0`)
     * [EN] Out-tangent control point Y coordinate (default: `0`)
     * @param outZ -
     * [KO] 진출 제어점(Out Tangent) Z 좌표 (기본값: `0`)
     * [EN] Out-tangent control point Z coordinate (default: `0`)
     */
    addPoint(
        x = 0, y = 0, z = 0,
        color: string = this.baseColor, colorAlpha = 1,
        inX = 0, inY = 0, inZ = 0,
        outX = 0, outY = 0, outZ = 0
    ) {
        this.#originalPoints.push(
            new LinePointWithInOut(
                x, y, z,
                inX, inY, inZ,
                outX, outY, outZ,
                color,
                colorAlpha
            )
        );
        this.#parsePointsByType();
    }

    /**
     * [KO] 3D 공간 경로의 지정된 인덱스에 정점(Point)을 삽입합니다.
     * [EN] Inserts a point at the specified index in the 3D space path.
     *
     * ### Example
     * ```typescript
     * line.addPointAt(1, 5, 5, 5, '#00ff00', 1.0);
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
     * @param z -
     * [KO] Z 좌표 (기본값: `0`)
     * [EN] Z coordinate (default: `0`)
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
     * @param inZ -
     * [KO] 진입 제어점(In Tangent) Z 좌표 (기본값: `0`)
     * [EN] In-tangent control point Z coordinate (default: `0`)
     * @param outX -
     * [KO] 진출 제어점(Out Tangent) X 좌표 (기본값: `0`)
     * [EN] Out-tangent control point X coordinate (default: `0`)
     * @param outY -
     * [KO] 진출 제어점(Out Tangent) Y 좌표 (기본값: `0`)
     * [EN] Out-tangent control point Y coordinate (default: `0`)
     * @param outZ -
     * [KO] 진출 제어점(Out Tangent) Z 좌표 (기본값: `0`)
     * [EN] Out-tangent control point Z coordinate (default: `0`)
     */
    addPointAt(
        index: number,
        x = 0, y = 0, z = 0,
        color: string = this.baseColor, colorAlpha = 1,
        inX = 0, inY = 0, inZ = 0,
        outX = 0, outY = 0, outZ = 0
    ) {
        if (this.#originalPoints.length < index) index = this.#originalPoints.length;
        if (index != undefined) this.#originalPoints.splice(index, 0, new LinePointWithInOut(x, y, z, inX, inY, inZ, outX, outY, outZ, color, colorAlpha));
        else this.#originalPoints.push(new LinePointWithInOut(x, y, z, inX, inY, inZ, outX, outY, outZ, color, colorAlpha));
        this.#parsePointsByType()
    }

    /**
     * [KO] 지정된 인덱스의 정점(Point)을 제거합니다.
     * [EN] Removes the point at the specified index.
     *
     * ### Example
     * ```typescript
     * line.removePointAt(0);
     * ```
     *
     * @param index -
     * [KO] 제거할 정점의 인덱스 (양의 정수)
     * [EN] Index of the point to remove (unsigned integer)
     */
    removePointAt(index: number) {
        validateUintRange(index)
        if (this.#originalPoints[index]) this.#originalPoints.splice(index, 1);
        else consoleAndThrowError('removeChildAt', 'index 해당인덱스에 위치한 포인트가 없음.', '입력값 : ' + index);
        this.#parsePointsByType()
    }

    /**
     * [KO] 라인에 등록된 모든 정점(Point)을 제거합니다.
     * [EN] Removes all points registered in the line.
     *
     * ### Example
     * ```typescript
     * line.removeAllPoint();
     * ```
     */
    removeAllPoint() {
        this.#originalPoints.length = 0;
        this.#parsePointsByType()
    };

    #update() {
        if (this._geometry) {
        }
        if (this.#originalPoints.length) {
            const {redGPUContext} = this
            this._geometry = new Geometry(
                redGPUContext,
                new VertexBuffer(
                    redGPUContext,
                    this.#interleaveData,
                    new VertexInterleavedStruct(
                        {
                            vertexPosition: VertexInterleaveType.float32x3,
                            vertexColor: VertexInterleaveType.float32x4,
                        }
                    )
                ),
            );
        } else {
        }
        this.dirtyPipeline = true
    }

    #parsePointsByType() {
        const originalPoints = this.#originalPoints
        const tension = this.#tension
        const tolerance = this.#tolerance
        const distance = this.#distance
        this.#interleaveData.length = 0;
        let newPointList;
        let i, len;
        let tData: LinePoint;
        switch (this.#type) {
            case LINE_TYPE.CATMULL_ROM :
            case LINE_TYPE.BEZIER :
                if (originalPoints.length > 1) {
                    this.#serializedLinePoints = lineSerializePoints(LINE_TYPE.CATMULL_ROM === this.#type ? lineSolveCatmullRomPoint(originalPoints, tension) : originalPoints);
                    newPointList = lineGetPointsOnBezierCurves(this.#serializedLinePoints, tolerance);
                    newPointList = lineSimplifyPoints(newPointList, 0, newPointList.length, distance);
                    i = 0;
                    len = newPointList.length;
                    for (i; i < len; i++) {
                        tData = newPointList[i];
                        this.#interleaveData.push(...tData.position, ...tData.colorRGBA);
                    }
                } else this.#interleaveData.push(0, 0, 0, 1, 1, 1, 1);
                break;
            default :
                i = 0;
                len = originalPoints.length;
                for (i; i < len; i++) {
                    const {linePoint} = originalPoints[i];
                    const colorRGBA = linePoint.colorRGBA
                    this.interleaveData.push(...linePoint.position, ...colorRGBA);
                }
        }
        this.#update()
    };
}

Object.freeze(Line3D)
export default Line3D
