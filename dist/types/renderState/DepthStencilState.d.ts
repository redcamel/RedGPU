/**
 * [KO] 객체의 깊이(Depth) 및 스텐실(Stencil) 테스트 상태를 관리하는 클래스입니다.
 * [EN] Class that manages depth and stencil test states for objects.
 *
 * [KO] Z-버퍼 기반의 깊이 테스트 활성 여부, 쓰기 설정, 비교 함수 및 스텐실 마스킹 등을 제어합니다.
 * [EN] Controls whether Z-buffer based depth testing is active, write settings, comparison functions, and stencil masking.
 *
 * * ### Example
 * ```typescript
 * const dsState = mesh.depthStencilState;
 * dsState.depthWriteEnabled = true;
 * dsState.depthCompare = RedGPU.GPU_COMPARE_FUNCTION.LESS;
 * ```
 * @category RenderState
 */
declare class DepthStencilState {
    #private;
    /**
     * [KO] DepthStencilState 인스턴스를 생성합니다.
     * [EN] Creates an instance of DepthStencilState.
     *
     * @param targetObject3D -
     * [KO] 상태가 적용될 대상 객체
     * [EN] Target object to which the state is applied
     */
    constructor(targetObject3D: any);
    /**
     * [KO] 깊이/스텐실 텍스처 포맷을 가져오거나 설정합니다.
     * [EN] Gets or sets the depth/stencil texture format.
     *
     * @returns
     * [KO] 현재 설정된 GPUTextureFormat
     * [EN] Current GPUTextureFormat
     */
    get format(): GPUTextureFormat;
    set format(value: GPUTextureFormat);
    /**
     * [KO] 깊이 버퍼에 기록할지 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether to write to the depth buffer.
     */
    get depthWriteEnabled(): boolean;
    set depthWriteEnabled(value: boolean);
    /**
     * [KO] 깊이 비교 함수를 가져오거나 설정합니다.
     * [EN] Gets or sets the depth comparison function.
     *
     * @returns
     * [KO] 현재 설정된 GPUCompareFunction
     * [EN] Current GPUCompareFunction
     */
    get depthCompare(): GPUCompareFunction;
    set depthCompare(value: GPUCompareFunction);
    /**
     * [KO] 전면(Front) 스텐실 상태를 가져오거나 설정합니다.
     * [EN] Gets or sets the front stencil state.
     */
    get stencilFront(): GPUStencilFaceState;
    set stencilFront(value: GPUStencilFaceState);
    /**
     * [KO] 후면(Back) 스텐실 상태를 가져오거나 설정합니다.
     * [EN] Gets or sets the back stencil state.
     */
    get stencilBack(): GPUStencilFaceState;
    set stencilBack(value: GPUStencilFaceState);
    /**
     * [KO] 스텐실 읽기 마스크를 가져오거나 설정합니다.
     * [EN] Gets or sets the stencil read mask.
     */
    get stencilReadMask(): number;
    set stencilReadMask(value: number);
    /**
     * [KO] 스텐실 쓰기 마스크를 가져오거나 설정합니다.
     * [EN] Gets or sets the stencil write mask.
     */
    get stencilWriteMask(): number;
    set stencilWriteMask(value: number);
    /**
     * [KO] 깊이 바이어스(Depth Bias) 값을 가져오거나 설정합니다.
     * [EN] Gets or sets the depth bias value.
     */
    get depthBias(): GPUDepthBias;
    set depthBias(value: GPUDepthBias);
    /**
     * [KO] 깊이 바이어스 슬로프 스케일(Slope Scale)을 가져오거나 설정합니다.
     * [EN] Gets or sets the depth bias slope scale.
     */
    get depthBiasSlopeScale(): number;
    set depthBiasSlopeScale(value: number);
    /**
     * [KO] 깊이 바이어스 클램프(Clamp) 값을 가져오거나 설정합니다.
     * [EN] Gets or sets the depth bias clamp value.
     */
    get depthBiasClamp(): number;
    set depthBiasClamp(value: number);
    /**
     * [KO] 현재 설정된 값들을 기반으로 GPUDepthStencilState 형식의 객체를 반환합니다.
     * [EN] Returns an object in GPUDepthStencilState format based on the current settings.
     */
    get state(): {
        format: GPUTextureFormat;
        depthWriteEnabled: boolean;
        depthCompare: GPUCompareFunction;
        stencilFront: GPUStencilFaceState;
        stencilBack: GPUStencilFaceState;
        stencilReadMask: number;
        stencilWriteMask: number;
        depthBias: number;
        depthBiasSlopeScale: number;
        depthBiasClamp: number;
    };
}
export default DepthStencilState;
