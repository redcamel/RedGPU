/**
 * GPU 로드 연산 옵션
 *
 * 렌더 패스 시작 시 어태치먼트(attachment)의 초기 상태를 어떻게 처리할지 정의합니다.
 * 컬러, 깊이, 스텐실 어태치먼트에 적용됩니다.
 *
 * @constant
 */
const GPU_LOAD_OP = {
    /**
     * 이전 내용을 로드합니다.
     *
     * 어태치먼트에 저장된 기존 값을 유지하고 사용합니다.
     */
    LOAD: 'load',
    /**
     * 이전 내용을 지웁니다.
     *
     * 어태치먼트를 지정된 클리어 값으로 초기화합니다.
     */
    CLEAR: 'clear',
} as const
Object.freeze(GPU_LOAD_OP)
export default GPU_LOAD_OP
