import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import GPU_PRIMITIVE_TOPOLOGY from "../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import Primitive from "../../primitive/core/Primitive";
import InterleaveType from "../../resources/buffer/core/type/InterleaveType";
import InterleavedStruct from "../../resources/buffer/vertexBuffer/InterleavedStruct";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
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

class Line3D extends Mesh {
	baseColor
	#type: LINE_TYPE
	#tension: number = 1
	#tolerance: number = 0.01
	#distance: number = 0.01
	#interleaveData: number[] = []
	#originalPoints: LinePointWithInOut[] = []
	#serializedLinePoints: LinePoint[]

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
				new InterleavedStruct(
					{
						vertexPosition: InterleaveType.float32x3,
						vertexColor: InterleaveType.float32x4,
					}
				)
			),
		);
		this._material = new LineMaterial(redGPUContext)
	}

	get originalPoints(): LinePointWithInOut[] {
		return this.#originalPoints;
	}

	get type(): LINE_TYPE {
		return this.#type;
	}

	set type(value: LINE_TYPE) {
		this.#type = value;
		this.#parsePointsByType();
	}

	get interleaveData(): number[] {
		return this.#interleaveData;
	}

	get tension(): number {
		return this.#tension;
	}

	set tension(value: number) {
		validatePositiveNumberRange(value)
		this.#tension = value;
		this.#parsePointsByType();
	}

	get tolerance(): number {
		return this.#tolerance;
	}

	set tolerance(value: number) {
		validatePositiveNumberRange(value)
		this.#tolerance = value;
		this.#parsePointsByType();
	}

	get distance(): number {
		return this.#distance;
	}

	set distance(value: number) {
		validatePositiveNumberRange(value)
		this.#distance = value;
		this.#parsePointsByType();
	}

	get numPoints(): number {
		return this.#originalPoints.length
	}

	get geometry(): Geometry | Primitive {
		return this._geometry;
	}

	set geometry(value: Geometry | Primitive) {
		consoleAndThrowError('Line3D can not change geometry')
	}

	get material() {
		return this._material
	}

	set material(value) {
		consoleAndThrowError('Line3D can not change material')
	}

	createCustomMeshVertexShaderModule() {
		return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
	}

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

	removePointAt(index: number) {
		validateUintRange(index)
		if (this.#originalPoints[index]) this.#originalPoints.splice(index, 1);
		else consoleAndThrowError('removeChildAt', 'index 해당인덱스에 위치한 포인트가 없음.', '입력값 : ' + index);
		this.#parsePointsByType()
	};

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
					new InterleavedStruct(
						{
							vertexPosition: InterleaveType.float32x3,
							vertexColor: InterleaveType.float32x4,
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
