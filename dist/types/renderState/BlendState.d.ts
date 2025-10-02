/**
 * 머티리얼(Material)의 GPU 렌더 파이프라인에서 색상 및 알파 블렌딩 동작을 제어하는 상태 객체입니다.
 *
 * BlendState를 통해 머티리얼별로 다양한 블렌드 팩터와 연산을 설정하여, 투명/반투명 효과 및 다양한 합성 효과를 구현할 수 있습니다.
 *
 */
declare class BlendState {
    #private;
    /** GPUBlendComponent 상태 객체 */
    state: GPUBlendComponent;
    /**
     * BlendState 생성자
     * @param targetMaterial - 블렌드 상태가 적용될 머티리얼 객체
     * @param srcFactor - 소스 블렌드 팩터
     * @param dstFactor - 대상 블렌드 팩터
     * @param operation - 블렌드 연산
     * @category Buffer
     */
    constructor(targetMaterial: any, srcFactor?: GPUBlendFactor, dstFactor?: GPUBlendFactor, operation?: GPUBlendOperation);
    /**
     * 블렌드 연산 반환
     * @category Buffer
     */
    get operation(): GPUBlendOperation;
    /**
     * 블렌드 연산 설정
     * @param newOperation - GPUBlendOperation 값
     * @category Buffer
     */
    set operation(newOperation: GPUBlendOperation);
    /**
     * 소스 블렌드 팩터 반환
     * @category Buffer
     */
    get srcFactor(): GPUBlendFactor;
    /**
     * 소스 블렌드 팩터 설정
     * @param newSrcFactor - GPUBlendFactor 값
     * @category Buffer
     */
    set srcFactor(newSrcFactor: GPUBlendFactor);
    /**
     * 대상 블렌드 팩터 반환
     * @category Buffer
     */
    get dstFactor(): GPUBlendFactor;
    /**
     * 대상 블렌드 팩터 설정
     * @param newDstFactor - GPUBlendFactor 값
     * @category Buffer
     */
    set dstFactor(newDstFactor: GPUBlendFactor);
}
export default BlendState;
