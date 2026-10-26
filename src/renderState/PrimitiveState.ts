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
 * [KO] 객체의 프리미티브(Primitive) 토폴로지, 앞면 방향 및 면 컬링 방식을 제어하는 렌더 상태 클래스입니다.
 * [EN] Render state class that controls primitive topology, front-face orientation, and face culling mode for objects.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * const primitiveState = mesh.primitiveState;
 * primitiveState.topology = RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP;
 * primitiveState.cullMode = RedGPU.GPU_CULL_MODE.BACK;
 * ```
 *
 * @category RenderState
 */
class PrimitiveState {
    /**
     * [KO] 파이프라인 갱신 필요 여부
     * [EN] Whether the pipeline requires an update
     */
    dirtyPipeline: boolean = false;
    /**
     * [KO] 최종 생성된 `GPUPrimitiveState` 상태 객체
     * [EN] Final generated `GPUPrimitiveState` state object
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
     * [EN] Creates a PrimitiveState instance.
     *
     * @param targetObject3D -
     * [KO] 상태가 적용될 대상 3D 객체
     * [EN] Target 3D object to which the state is applied
     */
    constructor(targetObject3D: any) {
        this.#targetObject3D = targetObject3D;
        this.#update();
    }

    /**
     * [KO] 프리미티브 토폴로지를 반환하거나 설정합니다.
     * [EN] Gets or sets the primitive topology.
     *
     * @returns
     * [KO] 현재 설정된 `GPUPrimitiveTopology` 값
     * [EN] Currently configured `GPUPrimitiveTopology` value
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
     * [KO] 스트립 토폴로지 사용 시 인덱스 포맷을 반환하거나 설정합니다.
     * [EN] Gets or sets the index format when using strip topology.
     *
     * @returns
     * [KO] 현재 설정된 `GPUIndexFormat` 값
     * [EN] Currently configured `GPUIndexFormat` value
     */
    get stripIndexFormat(): GPUIndexFormat {
        return this.#stripIndexFormat;
    }

    set stripIndexFormat(format: GPUIndexFormat | undefined) {
        if (format === undefined || validateStripIndex.includes(format)) {
            this.#stripIndexFormat = format;
            this.#update();
        } else consoleAndThrowError(`Invalid value for stripIndexFormat. Received ${format}. Expected one of: undefined, ${validateStripIndex.join(", ")}`);
    }

    /**
     * [KO] 폴리곤의 앞면(Front Face) 판별 방향을 반환하거나 설정합니다.
     * [EN] Gets or sets the winding order that defines the front face of polygons.
     *
     * @returns
     * [KO] 현재 설정된 `GPUFrontFace` 값
     * [EN] Currently configured `GPUFrontFace` value
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
     * [KO] 면 컬링(Culling) 모드를 반환하거나 설정합니다.
     * [EN] Gets or sets the face culling mode.
     *
     * @returns
     * [KO] 현재 설정된 `GPUCullMode` 값
     * [EN] Currently configured `GPUCullMode` value
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
     * [KO] 깊이 클리핑 비활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether depth clipping is disabled.
     *
     * @returns
     * [KO] 깊이 클리핑 비활성화 여부
     * [EN] Whether depth clipping is disabled
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