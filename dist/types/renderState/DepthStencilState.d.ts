/**
 * 3D Mesh 등 Object3D의 GPU 렌더 파이프라인에서 깊이(Depth) 및 스텐실(Stencil) 테스트 상태를 관리하는 객체입니다.
 *
 * 각종 깊이/스텐실 관련 설정을 통해 Z-버퍼 기반의 깊이 테스트, 스텐실 마스킹, 폴리곤 오프셋 등 다양한 렌더링 효과를 제어할 수 있습니다.
 *
 */
declare class DepthStencilState {
    #private;
    /**
     * DepthStencilState 생성자
     * @param targetObject3D - 상태가 적용될 Mesh 또는 Object3D 객체
     * @category Buffer
     */
    constructor(targetObject3D: any);
    /**
     * 깊이/스텐실 포맷 반환
     * @category Buffer
     */
    get format(): GPUTextureFormat;
    /**
     * 깊이/스텐실 포맷 설정
     * @param value - GPUTextureFormat 값
     * @category Buffer
     */
    set format(value: GPUTextureFormat);
    /**
     * 깊이 버퍼 쓰기 활성화 여부 반환
     * @category Buffer
     */
    get depthWriteEnabled(): boolean;
    /**
     * 깊이 버퍼 쓰기 활성화 여부 설정
     * @param value - true면 깊이 버퍼에 기록
     * @category Buffer
     */
    set depthWriteEnabled(value: boolean);
    /**
     * 깊이 비교 함수 반환
     * @category Buffer
     */
    get depthCompare(): GPUCompareFunction;
    /**
     * 깊이 비교 함수 설정
     * @param value - GPUCompareFunction 값
     * @category Buffer
     */
    set depthCompare(value: GPUCompareFunction);
    /**
     * 스텐실 전면 상태 반환
     * @category Buffer
     */
    get stencilFront(): GPUStencilFaceState;
    /**
     * 스텐실 전면 상태 설정
     * @param value - GPUStencilFaceState 값
     * @category Buffer
     */
    set stencilFront(value: GPUStencilFaceState);
    /**
     * 스텐실 후면 상태 반환
     * @category Buffer
     */
    get stencilBack(): GPUStencilFaceState;
    /**
     * 스텐실 후면 상태 설정
     * @param value - GPUStencilFaceState 값
     * @category Buffer
     */
    set stencilBack(value: GPUStencilFaceState);
    /**
     * 스텐실 읽기 마스크 반환
     * @category Buffer
     */
    get stencilReadMask(): number;
    /**
     * 스텐실 읽기 마스크 설정
     * @param value - 마스크 값
     * @category Buffer
     */
    set stencilReadMask(value: number);
    /**
     * 스텐실 쓰기 마스크 반환
     * @category Buffer
     */
    get stencilWriteMask(): number;
    /**
     * 스텐실 쓰기 마스크 설정
     * @param value - 마스크 값
     * @category Buffer
     */
    set stencilWriteMask(value: number);
    /**
     * 깊이 바이어스 반환
     * @category Buffer
     */
    get depthBias(): GPUDepthBias;
    /**
     * 깊이 바이어스 설정
     * @param value - 바이어스 값
     * @category Buffer
     */
    set depthBias(value: GPUDepthBias);
    /**
     * 깊이 바이어스 SlopeScale 반환
     * @category Buffer
     */
    get depthBiasSlopeScale(): number;
    /**
     * 깊이 바이어스 SlopeScale 설정
     * @param value - SlopeScale 값
     * @category Buffer
     */
    set depthBiasSlopeScale(value: number);
    /**
     * 깊이 바이어스 Clamp 반환
     * @category Buffer
     */
    get depthBiasClamp(): number;
    /**
     * 깊이 바이어스 Clamp 설정
     * @param value - Clamp 값
     * @category Buffer
     */
    set depthBiasClamp(value: number);
    /**
     * 현재 설정된 DepthStencil 상태 객체 반환
     * @category Buffer
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
