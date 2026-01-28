/**
 * [KO] 머티리얼의 색상 및 알파 블렌딩 동작을 제어하는 상태 클래스입니다.
 * [EN] State class that controls color and alpha blending behavior for materials.
 *
 * [KO] 렌더 파이프라인에서 소스와 대상 색상을 어떻게 혼합할지 정의하며, 투명도나 합성 효과를 구현하는 데 사용됩니다.
 * [EN] Defines how source and destination colors are mixed in the render pipeline, used to implement transparency or compositing effects.
 *
 * * ### Example
 * ```typescript
 * const blendState = material.blendState;
 * blendState.operation = RedGPU.GPU_BLEND_OPERATION.ADD;
 * blendState.srcFactor = RedGPU.GPU_BLEND_FACTOR.SRC_ALPHA;
 * blendState.dstFactor = RedGPU.GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
 * ```
 * @category RenderState
 */
declare class BlendState {
    #private;
    /**
     * [KO] 최종 GPUBlendComponent 상태 객체
     * [EN] Final GPUBlendComponent state object
     */
    state: GPUBlendComponent;
    /**
     * [KO] BlendState 인스턴스를 생성합니다.
     * [EN] Creates an instance of BlendState.
     *
     * @param targetMaterial -
     * [KO] 블렌드 상태가 적용될 머티리얼
     * [EN] Material to which the blend state is applied
     * @param srcFactor -
     * [KO] 소스 블렌드 팩터
     * [EN] Source blend factor
     * @param dstFactor -
     * [KO] 대상 블렌드 팩터
     * [EN] Destination blend factor
     * @param operation -
     * [KO] 블렌드 연산
     * [EN] Blend operation
     */
    constructor(targetMaterial: any, srcFactor?: GPUBlendFactor, dstFactor?: GPUBlendFactor, operation?: GPUBlendOperation);
    /**
     * [KO] 블렌드 연산 방식을 가져오거나 설정합니다.
     * [EN] Gets or sets the blend operation.
     *
     * @returns
     * [KO] 현재 설정된 GPUBlendOperation
     * [EN] Current GPUBlendOperation
     */
    get operation(): GPUBlendOperation;
    set operation(newOperation: GPUBlendOperation);
    /**
     * [KO] 소스(Source) 블렌드 팩터를 가져오거나 설정합니다.
     * [EN] Gets or sets the source blend factor.
     *
     * @returns
     * [KO] 현재 설정된 GPUBlendFactor
     * [EN] Current GPUBlendFactor
     */
    get srcFactor(): GPUBlendFactor;
    set srcFactor(newSrcFactor: GPUBlendFactor);
    /**
     * [KO] 대상(Destination) 블렌드 팩터를 가져오거나 설정합니다.
     * [EN] Gets or sets the destination blend factor.
     *
     * @returns
     * [KO] 현재 설정된 GPUBlendFactor
     * [EN] Current GPUBlendFactor
     */
    get dstFactor(): GPUBlendFactor;
    set dstFactor(newDstFactor: GPUBlendFactor);
}
export default BlendState;
