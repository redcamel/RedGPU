/**
 * GPU 블렌딩 연산 옵션
 *
 * 소스와 대상 색상을 결합하는 수학적 연산을 정의합니다.
 *
 * 블렌드 방정식: `result = srcFactor * srcColor [operation] dstFactor * dstColor`
 *
 * @constant
 */
const GPU_BLEND_OPERATION = {
    /**
     * 소스와 대상을 더합니다.
     *
     * `result = src + dst`
     */
    ADD: "add",

    /**
     * 대상에서 소스를 뺍니다.
     *
     * `result = src - dst`
     */
    SUBTRACT: "subtract",

    /**
     * 소스에서 대상을 뺍니다.
     *
     * `result = dst - src`
     */
    REVERSE_SUBTRACT: "reverse-subtract",

    /**
     * 소스와 대상 중 작은 값을 선택합니다.
     *
     * `result = min(src, dst)`
     */
    MIN: "min",

    /**
     * 소스와 대상 중 큰 값을 선택합니다.
     *
     * `result = max(src, dst)`
     */
    MAX: "max",
} as const;

Object.freeze(GPU_BLEND_OPERATION)

export default GPU_BLEND_OPERATION
