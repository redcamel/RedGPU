import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import LineMaterial from "./core/LineMaterial";
import Line3D from "./Line3D";
import LINE_TYPE from "./LINE_TYPE";
import vertexModuleSource from "./shader/lineVertex.wgsl";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_LINE_2D'
const SHADER_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;

/**
 * 2D 공간에서 선(라인)을 표현하는 클래스입니다.
 * 2D 평면상에서 여러 점을 연결하여 선을 그릴 수 있습니다.
 * geometry와 material은 생성 시 자동으로 할당되며, 이후 변경이 불가능합니다.
 *
 * @experimental
 * @category Line
 */
class Line2D extends Line3D {
	/**
	 * Line2D 인스턴스를 생성합니다.
	 * @param redGPUContext RedGPU 컨텍스트
	 * @param type 라인 타입 (기본값: LINE_TYPE.LINEAR)
	 * @param baseColor 기본 색상 (기본값: #fff)
	 */
	constructor(redGPUContext: RedGPUContext, type: LINE_TYPE = LINE_TYPE.LINEAR, baseColor: string = '#fff') {
		super(redGPUContext, type, baseColor)
		this._material = new LineMaterial(redGPUContext)
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
		consoleAndThrowError('Line2D can not change geometry')
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
		consoleAndThrowError('Line2D can not change material')
	}

	/**
	 * 커스텀 버텍스 셰이더 모듈을 생성합니다.
	 * @returns 생성된 셰이더 모듈
	 */
	createCustomMeshVertexShaderModule() {
		return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
	}

	/**
	 * 2D 평면상에 점을 추가합니다.
	 * @param x X 좌표
	 * @param y Y 좌표
	 * @param color 점 색상 (기본값: baseColor)
	 * @param colorAlpha 알파값 (기본값: 1)
	 * @param inX in tangent X (기본값: 0)
	 * @param inY in tangent Y (기본값: 0)
	 * @param outX out tangent X (기본값: 0)
	 * @param outY out tangent Y (기본값: 0)
	 */
	// @ts-ignore
	addPoint(
		x = 0, y = 0,
		color: string = this.baseColor, colorAlpha = 1,
		inX = 0, inY = 0,
		outX = 0, outY = 0,
	) {
		super.addPoint(x, y, 0, color, colorAlpha, inX, inY, 0, outX, outY, 0)
	}

	/**
	 * 2D 평면상에 지정한 위치에 점을 추가합니다.
	 * @param index 추가할 위치 인덱스
	 * @param x X 좌표
	 * @param y Y 좌표
	 * @param color 점 색상 (기본값: baseColor)
	 * @param colorAlpha 알파값 (기본값: 1)
	 * @param inX in tangent X (기본값: 0)
	 * @param inY in tangent Y (기본값: 0)
	 * @param outX out tangent X (기본값: 0)
	 * @param outY out tangent Y (기본값: 0)
	 */
	// @ts-ignore
	addPointAt(
		index: number,
		x = 0, y = 0,
		color: string = this.baseColor, colorAlpha = 1,
		inX = 0, inY = 0,
		outX = 0, outY = 0
	) {
		super.addPointAt(index, x, y, 0, color, colorAlpha, inX, inY, 0, outX, outY, 0)
	}
}

export default Line2D
