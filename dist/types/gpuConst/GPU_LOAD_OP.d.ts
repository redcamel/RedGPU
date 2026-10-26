/**
 * [KO] 렌더 패스(Render Pass) 시작 시 컬러 또는 깊이/스텐실 어태치먼트의 초기 데이터를 처리하는 로드 연산 상수입니다.
 * [EN] Load operation constants determining how initial data in color or depth/stencil attachments is handled at the start of a render pass.
 *
 * @category Constants
 */
declare const GPU_LOAD_OP: {
    /**
     * [KO] 어태치먼트에 기록되어 있던 이전 프레임 또는 이전 패스의 기존 내용을 그대로 유지하여 로드합니다.
     * [EN] Preserves and loads the existing contents of the attachment from the previous frame or pass.
     */
    readonly LOAD: "load";
    /**
     * [KO] 렌더 패스 시작 시 어태치먼트를 지정된 초기화 값(`clearValue` 또는 ` depthClearValue`)으로 지웁니다.
     * [EN] Clears the attachment to the specified clear value (`clearValue` or `depthClearValue`) at the start of the render pass.
     */
    readonly CLEAR: "clear";
};
export default GPU_LOAD_OP;
