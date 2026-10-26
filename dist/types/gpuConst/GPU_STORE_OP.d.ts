/**
 * [KO] 렌더 패스(Render Pass) 종료 시 컬러 또는 깊이/스텐실 어태치먼트의 렌더링 결과를 메모리에 보존할지 결정하는 저장 연산 상수입니다.
 * [EN] Store operation constants determining whether to preserve the rendered results of color or depth/stencil attachments in memory at the end of a render pass.
 *
 * @category Constants
 */
declare const GPU_STORE_OP: {
    /**
     * [KO] 렌더 패스에서 그려진 결과물을 어태치먼트 메모리에 저장합니다.
     * [EN] Stores the rendered results of the render pass into the attachment memory.
     */
    readonly STORE: "store";
    /**
     * [KO] 렌더 패스의 결과물을 메모리에 저장하지 않고 폐기하여 대역폭을 절약합니다.
     * [EN] Discards the rendered results without storing them to memory, conserving memory bandwidth.
     */
    readonly DISCARD: "discard";
};
export default GPU_STORE_OP;
