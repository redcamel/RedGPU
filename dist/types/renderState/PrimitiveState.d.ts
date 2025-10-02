/**
 * PrimitiveState
 *
 * Mesh 등 Object3D의 GPU 렌더 파이프라인에서 도형(Primitive) 렌더링 방식, 컬링, 프론트페이스 등 원시 렌더 상태를 관리하는 객체입니다.
 * 각종 도형 렌더링 관련 설정을 통해 삼각형/라인/포인트 등 다양한 토폴로지, 컬링 모드, 프론트페이스, 인덱스 포맷, unclippedDepth 등 렌더링 동작을 제어할 수 있습니다.
 *
 */
declare class PrimitiveState {
    #private;
    dirtyPipeline: boolean;
    state: GPUPrimitiveState;
    /**
     * Creates a new instance of the Constructor class.
     *
     * @constructor
     * @param targetObject3D - 상태가 적용될 Mesh 또는 Object3D 객체
     * @category Buffer
     */
    constructor(targetObject3D: any);
    /**
     * GPU 도형 토폴로지 반환
     * @category Buffer
     */
    get topology(): GPUPrimitiveTopology;
    /**
     * GPU 도형 토폴로지 설정
     * @param value - GPUPrimitiveTopology 값
     * @category Buffer
     */
    set topology(value: GPUPrimitiveTopology);
    /**
     * 스트립 인덱스 포맷 반환
     * @category Buffer
     */
    get stripIndexFormat(): GPUIndexFormat;
    /**
     * 스트립 인덱스 포맷 설정
     * @param format - GPUIndexFormat 값
     * @category Buffer
     */
    set stripIndexFormat(format: GPUIndexFormat);
    /**
     * 프론트페이스(FrontFace) 반환
     * @category Buffer
     */
    get frontFace(): GPUFrontFace;
    /**
     * 프론트페이스(FrontFace) 설정
     * @param face - GPUFrontFace 값
     * @category Buffer
     */
    set frontFace(face: GPUFrontFace);
    /**
     * 컬링 모드 반환
     * @category Buffer
     */
    get cullMode(): GPUCullMode;
    /**
     * 컬링 모드 설정
     * @param mode - GPUCullMode 값
     * @category Buffer
     */
    set cullMode(mode: GPUCullMode);
    /**
     * unclippedDepth 반환
     * @category Buffer
     */
    get unclippedDepth(): boolean;
    /**
     * unclippedDepth 설정
     * @param state - boolean 값
     * @category Buffer
     */
    set unclippedDepth(state: boolean);
}
export default PrimitiveState;
