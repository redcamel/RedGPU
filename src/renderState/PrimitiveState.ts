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
 * [KO] 객체의 도형(Primitive) 렌더링 방식 및 면 처리를 관리하는 클래스입니다.
 * [EN] Class that manages primitive rendering methods and face handling for objects.
 *
 * [KO] 삼각형/라인/포인트 등의 토폴로지 설정, 컬링 모드, 앞면 정의 및 인덱스 포맷 등을 제어합니다.
 * [EN] Controls topology settings such as triangle/line/point, culling mode, front-face definition, and index format.
 *
 * * ### Example
 * ```typescript
 * const pState = mesh.primitiveState;
 * pState.topology = RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP;
 * pState.cullMode = RedGPU.GPU_CULL_MODE.BACK;
 * ```
 * @category RenderState
 */
class PrimitiveState {
	/**
	 * [KO] 파이프라인 갱신 필요 여부
	 * [EN] Whether the pipeline needs updating
	 */
	dirtyPipeline: boolean = false;
	/**
	 * [KO] 최종 GPUPrimitiveState 상태 객체
	 * [EN] Final GPUPrimitiveState state object
	 */
	state: GPUPrimitiveState;
	#targetObject3D: Mesh;
	#topology: GPUPrimitiveTopology = GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
	#stripIndexFormat: GPUIndexFormat;
	#frontFace: GPUFrontFace = GPU_FRONT_FACE.CCW;
	#cullMode: GPUCullMode = GPU_CULL_MODE.BACK;
	#unclippedDepth: boolean = false;

	/**
	 * [KO] PrimitiveState 인스턴스를 생성합니다.
	 * [EN] Creates an instance of PrimitiveState.
	 * 
	 * @param targetObject3D - 
	 * [KO] 상태가 적용될 대상 객체 
	 * [EN] Target object to which the state is applied
	 */
	constructor(targetObject3D: any) {
		this.#targetObject3D = targetObject3D;
		this.#update();
	}

	/**
	 * [KO] 도형 토폴로지를 가져오거나 설정합니다.
	 * [EN] Gets or sets the primitive topology.
	 * 
	 * @returns 
	 * [KO] 현재 설정된 GPUPrimitiveTopology 
	 * [EN] Current GPUPrimitiveTopology
	 */
	get topology(): GPUPrimitiveTopology {
		return this.#topology;
	}

	set topology(value: GPUPrimitiveTopology) {
		if (validatePrimitiveTopology.includes(value)) {
			this.#topology = value;
			this.#update();
		} else consoleAndThrowError(`Invalid value for topology. Received ${value}. Expected one of: ${validatePrimitiveTopology.join(", ")}`);
	}

	/**
	 * [KO] 스트립 인덱스 포맷을 가져오거나 설정합니다.
	 * [EN] Gets or sets the strip index format.
	 * 
	 * @returns 
	 * [KO] 현재 설정된 GPUIndexFormat 
	 * [EN] Current GPUIndexFormat
	 */
	get stripIndexFormat(): GPUIndexFormat {
		return this.#stripIndexFormat;
	}

	set stripIndexFormat(format: GPUIndexFormat) {
		if (validateStripIndex.includes(format)) {
			this.#stripIndexFormat = format;
			this.#update();
		} else consoleAndThrowError(`Invalid value for stripIndexFormat. Received ${format}. Expected one of: ${validateStripIndex.join(", ")}`);
	}

	/**
	 * [KO] 앞면(Front Face) 정의 방식을 가져오거나 설정합니다.
	 * [EN] Gets or sets the front-face orientation.
	 * 
	 * @returns 
	 * [KO] 현재 설정된 GPUFrontFace 
	 * [EN] Current GPUFrontFace
	 */
	get frontFace(): GPUFrontFace {
		return this.#frontFace;
	}

	set frontFace(face: GPUFrontFace) {
		if (validateFrontFaces.includes(face)) {
			this.#frontFace = face;
			this.#update();
		} else consoleAndThrowError(`Invalid value for frontFace. Received ${face}. Expected one of: ${validateFrontFaces.join(", ")}`);
	}

	/**
	 * [KO] 컬링 모드를 가져오거나 설정합니다.
	 * [EN] Gets or sets the culling mode.
	 * 
	 * @returns 
	 * [KO] 현재 설정된 GPUCullMode 
	 * [EN] Current GPUCullMode
	 */
	get cullMode(): GPUCullMode {
		return this.#cullMode;
	}

	set cullMode(mode: GPUCullMode) {
		if (validateCullModes.includes(mode)) {
			this.#cullMode = mode;
			this.#update();
		} else consoleAndThrowError(`Invalid value for cullMode. Received ${mode}. Expected one of: ${validateCullModes.join(", ")}`);
	}

	/**
	 * [KO] 깊이 클리핑 비활성화 여부를 가져오거나 설정합니다.
	 * [EN] Gets or sets whether depth clipping is disabled (unclipped).
	 */
	get unclippedDepth(): boolean {
		return this.#unclippedDepth;
	}

	set unclippedDepth(state: boolean) {
		if (typeof state === 'boolean') {
			this.#unclippedDepth = state;
			this.#update();
		} else consoleAndThrowError(`Invalid type for unclippedDepth. Received ${typeof state}. Expected type: boolean.`);
	}

	/**
	 * [KO] 내부 상태를 갱신하고 대상 객체의 파이프라인을 갱신 대상으로 표시합니다.
	 * [EN] Updates the internal state and marks the target object's pipeline as dirty.
	 * @internal
	 */
	#update() {
		this.state = {
			topology: this.#topology,
			stripIndexFormat: this.#stripIndexFormat,
			frontFace: this.#frontFace,
			cullMode: this.#cullMode,
			unclippedDepth: this.#unclippedDepth,
		};
		this.#targetObject3D.dirtyPipeline = true;
	}
}

export default PrimitiveState;