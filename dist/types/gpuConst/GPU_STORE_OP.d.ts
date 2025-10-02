/**
 * GPU 스토어 연산 옵션
 *
 * 렌더 패스 종료 시 어태치먼트(attachment)의 내용을 어떻게 처리할지 정의합니다.
 * 컬러, 깊이, 스텐실 어태치먼트에 적용됩니다.
 *
 * @constant
 */
declare const GPU_STORE_OP: {
    /**
     * 렌더링 결과를 저장합니다.
     *
     * 어태치먼트에 렌더링된 내용을 메모리에 기록하여 이후 사용할 수 있도록 합니다.
     */
    readonly STORE: "store";
    /**
     * 렌더링 결과를 버립니다.
     *
     * 어태치먼트의 내용을 저장하지 않고 폐기합니다. 성능 최적화에 유용합니다.
     */
    readonly DISCARD: "discard";
};
export default GPU_STORE_OP;
