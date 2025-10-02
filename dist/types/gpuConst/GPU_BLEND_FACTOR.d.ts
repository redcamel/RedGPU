/**
 * GPU 블렌딩 연산을 위한 블렌드 팩터 옵션
 *
 * 소스와 대상 색상을 어떻게 혼합할지 결정하는 팩터를 정의합니다.
 * 블렌드 방정식: `result = srcFactor * srcColor op dstFactor * dstColor`
 * @constant
 */
declare const GPU_BLEND_FACTOR: {
    /**
     * 0을 사용합니다.
     *
     * 해당 색상 성분을 완전히 무시합니다.
     */
    readonly ZERO: "zero";
    /**
     * 1을 사용합니다.
     *
     * 해당 색상 성분을 그대로 사용합니다.
     */
    readonly ONE: "one";
    /**
     * 소스 색상을 사용합니다.
     *
     * 각 색상 채널(R, G, B)의 값을 팩터로 사용합니다.
     */
    readonly SRC: "src";
    /**
     * (1 - 소스 색상)을 사용합니다.
     *
     * 소스 색상의 보수를 팩터로 사용합니다.
     */
    readonly ONE_MINUS_SRC: "one-minus-src";
    /**
     * 소스 알파 값을 사용합니다.
     *
     * 소스의 알파 채널 값을 모든 색상 채널의 팩터로 사용합니다.
     */
    readonly SRC_ALPHA: "src-alpha";
    /**
     * (1 - 소스 알파)를 사용합니다.
     *
     * 소스 알파의 보수를 팩터로 사용합니다. 일반적인 알파 블렌딩에 사용됩니다.
     */
    readonly ONE_MINUS_SRC_ALPHA: "one-minus-src-alpha";
    /**
     * 대상 색상을 사용합니다.
     *
     * 프레임버퍼에 이미 있는 색상 값을 팩터로 사용합니다.
     */
    readonly DST: "dst";
    /**
     * (1 - 대상 색상)을 사용합니다.
     *
     * 대상 색상의 보수를 팩터로 사용합니다.
     */
    readonly ONE_MINUS_DST: "one-minus-dst";
    /**
     * 대상 알파 값을 사용합니다.
     *
     * 프레임버퍼의 알파 채널 값을 팩터로 사용합니다.
     */
    readonly DST_ALPHA: "dst-alpha";
    /**
     * (1 - 대상 알파)를 사용합니다.
     *
     * 대상 알파의 보수를 팩터로 사용합니다.
     */
    readonly ONE_MINUS_DST_ALPHA: "one-minus-dst-alpha";
    /**
     * 소스 알파를 1로 클램핑한 값을 사용합니다.
     *
     * min(srcAlpha, 1 - dstAlpha)를 팩터로 사용합니다.
     */
    readonly SRC_ALPHA_SATURATED: "src-alpha-saturated";
    /**
     * 블렌드 상수 색상을 사용합니다.
     *
     * 파이프라인에 설정된 상수 색상 값을 팩터로 사용합니다.
     */
    readonly CONSTANT: "constant";
    /**
     * (1 - 블렌드 상수 색상)을 사용합니다.
     *
     * 블렌드 상수 색상의 보수를 팩터로 사용합니다.
     */
    readonly ONE_MINUS_CONSTANT: "one-minus-constant";
    /**
     * 두 번째 소스 색상을 사용합니다.
     *
     * 듀얼 소스 블렌딩에서 두 번째 출력 색상을 팩터로 사용합니다.
     */
    readonly SRC1: "src1";
    /**
     * (1 - 두 번째 소스 색상)을 사용합니다.
     *
     * 두 번째 소스 색상의 보수를 팩터로 사용합니다.
     */
    readonly ONE_MINUS_SRC1: "one-minus-src1";
    /**
     * 두 번째 소스 알파 값을 사용합니다.
     *
     * 듀얼 소스 블렌딩에서 두 번째 출력의 알파 값을 팩터로 사용합니다.
     */
    readonly SRC1_ALPHA: "src1-alpha";
    /**
     * (1 - 두 번째 소스 알파)를 사용합니다.
     *
     * 두 번째 소스 알파의 보수를 팩터로 사용합니다.
     */
    readonly ONE_MINUS_SRC1_ALPHA: "one-minus-src1-alpha";
};
export default GPU_BLEND_FACTOR;
