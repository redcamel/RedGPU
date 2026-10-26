/**
 * [KO] 객체의 깊이(Depth) 및 스텐실(Stencil) 테스트 상태를 관리하는 클래스입니다.
 * [EN] Class that manages depth and stencil test states for objects.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * const depthStencilState = mesh.depthStencilState;
 * depthStencilState.depthWriteEnabled = true;
 * depthStencilState.depthCompare = RedGPU.GPU_COMPARE_FUNCTION.LESS_EQUAL;
 * ```
 *
 * @category RenderState
 */
declare class DepthStencilState {
    #private;
    /**
     * [KO] DepthStencilState 인스턴스를 생성합니다.
     * [EN] Creates a DepthStencilState instance.
     *
     * @param targetObject3D -
     * [KO] 상태가 적용될 대상 3D 객체
     * [EN] Target 3D object to which the state is applied
     */
    constructor(targetObject3D: any);
    /**
     * [KO] 깊이/스텐실 텍스처 포맷을 반환하거나 설정합니다.
     * [EN] Gets or sets the depth/stencil texture format.
     *
     * @returns
     * [KO] 현재 설정된 `GPUTextureFormat` 값
     * [EN] Currently configured `GPUTextureFormat` value
     */
    get format(): GPUTextureFormat;
    set format(value: GPUTextureFormat);
    /**
     * [KO] 깊이 버퍼 쓰기 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether writing to the depth buffer is enabled.
     *
     * @returns
     * [KO] 깊이 버퍼 쓰기 활성화 여부
     * [EN] Whether depth buffer writing is enabled
     */
    get depthWriteEnabled(): boolean;
    set depthWriteEnabled(value: boolean);
    /**
     * [KO] 깊이 비교 함수를 반환하거나 설정합니다.
     * [EN] Gets or sets the depth comparison function.
     *
     * @returns
     * [KO] 현재 설정된 `GPUCompareFunction` 값
     * [EN] Currently configured `GPUCompareFunction` value
     */
    get depthCompare(): GPUCompareFunction;
    set depthCompare(value: GPUCompareFunction);
    /**
     * [KO] 전면(Front) 스텐실 상태를 반환하거나 설정합니다.
     * [EN] Gets or sets the front stencil face state.
     *
     * @returns
     * [KO] 전면 `GPUStencilFaceState` 객체
     * [EN] Front `GPUStencilFaceState` object
     */
    get stencilFront(): GPUStencilFaceState;
    set stencilFront(value: GPUStencilFaceState);
    /**
     * [KO] 후면(Back) 스텐실 상태를 반환하거나 설정합니다.
     * [EN] Gets or sets the back stencil face state.
     *
     * @returns
     * [KO] 후면 `GPUStencilFaceState` 객체
     * [EN] Back `GPUStencilFaceState` object
     */
    get stencilBack(): GPUStencilFaceState;
    set stencilBack(value: GPUStencilFaceState);
    /**
     * [KO] 스텐실 읽기 마스크를 반환하거나 설정합니다.
     * [EN] Gets or sets the stencil read mask.
     *
     * @returns
     * [KO] 스텐실 읽기 마스크 값
     * [EN] Stencil read mask value
     */
    get stencilReadMask(): number;
    set stencilReadMask(value: number);
    /**
     * [KO] 스텐실 쓰기 마스크를 반환하거나 설정합니다.
     * [EN] Gets or sets the stencil write mask.
     *
     * @returns
     * [KO] 스텐실 쓰기 마스크 값
     * [EN] Stencil write mask value
     */
    get stencilWriteMask(): number;
    set stencilWriteMask(value: number);
    /**
     * [KO] 깊이 바이어스(Depth Bias) 값을 반환하거나 설정합니다.
     * [EN] Gets or sets the depth bias value.
     *
     * @returns
     * [KO] 현재 설정된 `GPUDepthBias` 값
     * [EN] Currently configured `GPUDepthBias` value
     */
    get depthBias(): GPUDepthBias;
    set depthBias(value: GPUDepthBias);
    /**
     * [KO] 깊이 바이어스 기울기 스케일(Slope Scale) 값을 반환하거나 설정합니다.
     * [EN] Gets or sets the depth bias slope scale value.
     *
     * @returns
     * [KO] 깊이 바이어스 기울기 스케일 값
     * [EN] Depth bias slope scale value
     */
    get depthBiasSlopeScale(): number;
    set depthBiasSlopeScale(value: number);
    /**
     * [KO] 깊이 바이어스 클램프(Clamp) 값을 반환하거나 설정합니다.
     * [EN] Gets or sets the depth bias clamp value.
     *
     * @returns
     * [KO] 깊이 바이어스 클램프 값
     * [EN] Depth bias clamp value
     */
    get depthBiasClamp(): number;
    set depthBiasClamp(value: number);
    /**
     * [KO] 현재 설정된 값들을 기반으로 `GPUDepthStencilState` 형식의 상태 객체를 반환합니다.
     * [EN] Returns a state object in `GPUDepthStencilState` format based on the current settings.
     *
     * @returns
     * [KO] 생성된 깊이/스텐실 상태 객체
     * [EN] Generated depth/stencil state object
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
