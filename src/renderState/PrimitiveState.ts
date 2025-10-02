import Mesh from "../display/mesh/Mesh";
import GPU_CULL_MODE from "../gpuConst/GPU_CULL_MODE";
import GPU_FRONT_FACE from "../gpuConst/GPU_FRONT_FACE";
import GPU_INDEX_FORMAT from "../gpuConst/GPU_INDEX_FORMAT";
import GPU_PRIMITIVE_TOPOLOGY from "../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import consoleAndThrowError from "../utils/consoleAndThrowError";

const validateStripIndex = Object.values(GPU_INDEX_FORMAT)
const validateFrontFaces = Object.values(GPU_FRONT_FACE)
const validateCullModes = Object.values(GPU_CULL_MODE)
const validatePrimitiveTopology = ['point-list', 'line-list', 'line-strip', 'triangle-list', 'triangle-strip']

/**
 * PrimitiveState
 *
 * Mesh 등 Object3D의 GPU 렌더 파이프라인에서 도형(Primitive) 렌더링 방식, 컬링, 프론트페이스 등 원시 렌더 상태를 관리하는 객체입니다.
 * 각종 도형 렌더링 관련 설정을 통해 삼각형/라인/포인트 등 다양한 토폴로지, 컬링 모드, 프론트페이스, 인덱스 포맷, unclippedDepth 등 렌더링 동작을 제어할 수 있습니다.
 *
 */
class PrimitiveState {
	dirtyPipeline: boolean = false
	state: GPUPrimitiveState
	#targetObject3D: Mesh
	#topology: GPUPrimitiveTopology = GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST
	#stripIndexFormat: GPUIndexFormat;
	/**
	 * Represents the front-face orientation for the GPU.
	 * Acceptable values are 'ccw' (counter-clockwise) and 'cw' (clockwise).
	 *
	 * @type {GPUFrontFace}
	 */
	#frontFace: GPUFrontFace = GPU_FRONT_FACE.CCW;
	/**
	 * Represents the culling mode used for GPU rendering.
	 *
	 * @typedef {('none' | 'front' | 'back')} GPUCullMode
	 */
	#cullMode: GPUCullMode = GPU_CULL_MODE.BACK;
	/**
	 * Represents the unclipped depth value.
	 *
	 * @type {boolean}
	 * @default false
	 */
	#unclippedDepth: boolean = false;

	/**
	 * Creates a new instance of the Constructor class.
	 *
	 * @constructor
	 * @param targetObject3D - 상태가 적용될 Mesh 또는 Object3D 객체
	 * @category Buffer
	 */
	constructor(targetObject3D: any) {
		this.#targetObject3D = targetObject3D
		this.#update()
	}

	/**
	 * GPU 도형 토폴로지 반환
	 * @category Buffer
	 */
	get topology(): GPUPrimitiveTopology {
		return this.#topology;
	}

	/**
	 * GPU 도형 토폴로지 설정
	 * @param value - GPUPrimitiveTopology 값
	 * @category Buffer
	 */
	set topology(value: GPUPrimitiveTopology) {
		if (validatePrimitiveTopology.includes(value)) {
			this.#topology = value;
			this.#update()
		} else consoleAndThrowError(`Invalid value for topology. Received ${value}. Expected one of: ${validatePrimitiveTopology.join(", ")}`);
	}

	/**
	 * 스트립 인덱스 포맷 반환
	 * @category Buffer
	 */
	get stripIndexFormat(): GPUIndexFormat {
		return this.#stripIndexFormat;
	}

	/**
	 * 스트립 인덱스 포맷 설정
	 * @param format - GPUIndexFormat 값
	 * @category Buffer
	 */
	set stripIndexFormat(format: GPUIndexFormat) {
		if (validateStripIndex.includes(format)) {
			this.#stripIndexFormat = format;
			this.#update()
		} else consoleAndThrowError(`Invalid value for stripIndexFormat. Received ${format}. Expected one of: ${validateStripIndex.join(", ")}`);
	}

	/**
	 * 프론트페이스(FrontFace) 반환
	 * @category Buffer
	 */
	get frontFace(): GPUFrontFace {
		return this.#frontFace;
	}

	/**
	 * 프론트페이스(FrontFace) 설정
	 * @param face - GPUFrontFace 값
	 * @category Buffer
	 */
	set frontFace(face: GPUFrontFace) {
		if (validateFrontFaces.includes(face)) {
			this.#frontFace = face;
			this.#update()
		} else consoleAndThrowError(`Invalid value for frontFace. Received ${face}. Expected one of: ${validateFrontFaces.join(", ")}`);
	}

	/**
	 * 컬링 모드 반환
	 * @category Buffer
	 */
	get cullMode(): GPUCullMode {
		return this.#cullMode;
	}

	/**
	 * 컬링 모드 설정
	 * @param mode - GPUCullMode 값
	 * @category Buffer
	 */
	set cullMode(mode: GPUCullMode) {
		if (validateCullModes.includes(mode)) {
			this.#cullMode = mode;
			this.#update()
		} else consoleAndThrowError(`Invalid value for cullMode. Received ${mode}. Expected one of: ${validateCullModes.join(", ")}`);
	}

	/**
	 * unclippedDepth 반환
	 * @category Buffer
	 */
	get unclippedDepth(): boolean {
		return this.#unclippedDepth;
	}

	/**
	 * unclippedDepth 설정
	 * @param state - boolean 값
	 * @category Buffer
	 */
	set unclippedDepth(state: boolean) {
		if (typeof state === 'boolean') {
			this.#unclippedDepth = state;
			this.#update()
		} else consoleAndThrowError(`Invalid type for unclippedDepth. Received ${typeof state}. Expected type: boolean.`);
	}

	/**
	 * 내부 상태를 갱신하고, Object3D의 파이프라인을 dirty 상태로 표시
	 * @private
	 * @category Buffer
	 */
	#update() {
		this.state = {
			topology: this.#topology,
			stripIndexFormat: this.#stripIndexFormat,
			frontFace: this.#frontFace,
			cullMode: this.#cullMode,
			unclippedDepth: this.#unclippedDepth,
		};
		this.#targetObject3D.dirtyPipeline = true
	}
}

export default PrimitiveState;
