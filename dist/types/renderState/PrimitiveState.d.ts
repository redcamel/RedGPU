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
declare class PrimitiveState {
    #private;
    /**
     * [KO] 파이프라인 갱신 필요 여부
     * [EN] Whether the pipeline needs updating
     */
    dirtyPipeline: boolean;
    /**
     * [KO] 최종 GPUPrimitiveState 상태 객체
     * [EN] Final GPUPrimitiveState state object
     */
    state: GPUPrimitiveState;
    /**
     * [KO] PrimitiveState 인스턴스를 생성합니다.
     * [EN] Creates an instance of PrimitiveState.
     *
     * @param targetObject3D -
     * [KO] 상태가 적용될 대상 객체
     * [EN] Target object to which the state is applied
     */
    constructor(targetObject3D: any);
    /**
     * [KO] 도형 토폴로지를 가져오거나 설정합니다.
     * [EN] Gets or sets the primitive topology.
     *
     * @returns
     * [KO] 현재 설정된 GPUPrimitiveTopology
     * [EN] Current GPUPrimitiveTopology
     */
    get topology(): GPUPrimitiveTopology;
    set topology(value: GPUPrimitiveTopology);
    /**
     * [KO] 스트립 인덱스 포맷을 가져오거나 설정합니다.
     * [EN] Gets or sets the strip index format.
     *
     * @returns
     * [KO] 현재 설정된 GPUIndexFormat
     * [EN] Current GPUIndexFormat
     */
    get stripIndexFormat(): GPUIndexFormat;
    set stripIndexFormat(format: GPUIndexFormat);
    /**
     * [KO] 앞면(Front Face) 정의 방식을 가져오거나 설정합니다.
     * [EN] Gets or sets the front-face orientation.
     *
     * @returns
     * [KO] 현재 설정된 GPUFrontFace
     * [EN] Current GPUFrontFace
     */
    get frontFace(): GPUFrontFace;
    set frontFace(face: GPUFrontFace);
    /**
     * [KO] 컬링 모드를 가져오거나 설정합니다.
     * [EN] Gets or sets the culling mode.
     *
     * @returns
     * [KO] 현재 설정된 GPUCullMode
     * [EN] Current GPUCullMode
     */
    get cullMode(): GPUCullMode;
    set cullMode(mode: GPUCullMode);
    /**
     * [KO] 깊이 클리핑 비활성화 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether depth clipping is disabled (unclipped).
     */
    get unclippedDepth(): boolean;
    set unclippedDepth(state: boolean);
}
export default PrimitiveState;
