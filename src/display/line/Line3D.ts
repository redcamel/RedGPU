import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import GPU_PRIMITIVE_TOPOLOGY from "../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import Primitive from "../../primitive/core/Primitive";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../resources/buffer/vertexBuffer/VertexInterleaveType";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
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
const SHADER_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;

/**
 * 3D 공간에서 선(라인)을 표현하는 클래스입니다.
 *
 * 3D 공간상에서 여러 점을 연결하여 선을 그릴 수 있습니다.
 *
 * geometry와 material은 생성 시 자동으로 할당되며, 이후 변경이 불가능합니다.
 *
 * <iframe src="/RedGPU/examples/3d/line3D/linear/"></iframe>
 *
 * 아래는 Line3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [Line3D Bezier Type example](/RedGPU/examples/3d/line3D/bezier/)
 * @see [Line3D CatmullRom Type example](/RedGPU/examples/3d/line3D/catmullRom/)
 *
 * @experimental
 * @category Line
 */
class Line3D extends Mesh {
    /** 기본 색상 */
    baseColor
    /** 라인 타입 (LINE_TYPE) */
    #type: LINE_TYPE
    /** Catmull-Rom 곡선의 텐션 값 */
    #tension: number = 1
    /** 곡선 샘플링 허용 오차 */
    #tolerance: number = 0.01
    /** 곡선 단순화 허용 거리 */
    #distance: number = 0.01
    /** 버텍스 interleave 데이터 배열 */
    #interleaveData: number[] = []
    /** 원본 점(LinePointWithInOut) 배열 */
    #originalPoints: LinePointWithInOut[] = []
    /** 곡선 타입별 직렬화된 점(LinePoint) 배열 */
    #serializedLinePoints: LinePoint[]

    /**
     * Line3D 인스턴스를 생성합니다.
     * @param redGPUContext RedGPU 컨텍스트
     * @param type 라인 타입 (기본값: LINE_TYPE.LINEAR)
     * @param baseColor 기본 색상 (기본값: #fff)
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
     * 원본 점(LinePointWithInOut) 배열을 반환합니다.
     */
    get originalPoints(): LinePointWithInOut[] {
        return this.#originalPoints;
    }

    /**
     * 라인 타입을 반환/설정합니다.
     */
    get type(): LINE_TYPE {
        return this.#type;
    }

    set type(value: LINE_TYPE) {
        this.#type = value;
        this.#parsePointsByType();
    }

    /**
     * 버텍스 interleave 데이터 배열을 반환합니다.
     */
    get interleaveData(): number[] {
        return this.#interleaveData;
    }

    /**
     * Catmull-Rom 곡선의 텐션 값을 반환/설정합니다.
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
     * 곡선 샘플링 허용 오차를 반환/설정합니다.
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
     * 곡선 단순화 허용 거리를 반환/설정합니다.
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
     * 현재 라인의 점 개수를 반환합니다.
     */
    get numPoints(): number {
        return this.#originalPoints.length
    }

    /**
     * geometry를 반환합니다. (생성 시 자동 할당, 변경 불가)
     */
    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    /**
     * geometry를 변경할 수 없습니다.
     */
    set geometry(value: Geometry | Primitive) {
        consoleAndThrowError('Line3D can not change geometry')
    }

    /**
     * material을 반환합니다. (생성 시 자동 할당, 변경 불가)
     */
    get material() {
        return this._material
    }

    /**
     * material을 변경할 수 없습니다.
     */
    set material(value) {
        consoleAndThrowError('Line3D can not change material')
    }

    /**
     * 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * @returns 생성된 셰이더 모듈
     */
    createCustomMeshVertexShaderModule() {
        return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
    }

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
     * 지정한 위치의 점을 삭제합니다.
     * @param index 삭제할 위치 인덱스
     */
    removePointAt(index: number) {
        validateUintRange(index)
        if (this.#originalPoints[index]) this.#originalPoints.splice(index, 1);
        else consoleAndThrowError('removeChildAt', 'index 해당인덱스에 위치한 포인트가 없음.', '입력값 : ' + index);
        this.#parsePointsByType()
    }

    /**
     * 모든 점을 삭제합니다.
     */
    removeAllPoint() {
        this.#originalPoints.length = 0;
        this.#parsePointsByType()
    };

    //TODO 포인트 추가 삭제메서드 점검
    #update() {
        if (this._geometry) {
            //TODO Destroy추가
            // this._geometry.vertexBuffer.destroy()
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
            // this._geometry = null;
        }
        this.dirtyPipeline = true
    }

    #parsePointsByType() {
        const originalPoints = this.#originalPoints
        const tension = this.#tension
        const tolerance = this.#tolerance
        const distance = this.#distance
        // 타입별로 파서 분기
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
