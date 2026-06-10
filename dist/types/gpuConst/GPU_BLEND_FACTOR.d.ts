/**
 * [KO] 블렌딩 연산에 사용되는 팩터(계수) 옵션을 정의하는 상수군입니다.
 * [EN] Constants defining factor options used in blending operations.
 *
 * [KO] 소스(Source)와 대상(Destination) 색상을 혼합할 때 각 채널에 곱해지는 값을 결정합니다.
 * [EN] Determines the values multiplied by each channel when mixing source and destination colors.
 *
 * @category Constants
 */
declare const GPU_BLEND_FACTOR: {
    /**
     * [KO] 계수 0을 사용합니다.
     * [EN] Uses factor 0.
     */
    readonly ZERO: "zero";
    /**
     * [KO] 계수 1을 사용합니다.
     * [EN] Uses factor 1.
     */
    readonly ONE: "one";
    /**
     * [KO] 소스 색상 값을 계수로 사용합니다.
     * [EN] Uses the source color value as the factor.
     */
    readonly SRC: "src";
    /**
     * [KO] (1 - 소스 색상) 값을 계수로 사용합니다.
     * [EN] Uses (1 - source color) value as the factor.
     */
    readonly ONE_MINUS_SRC: "one-minus-src";
    /**
     * [KO] 소스 알파 값을 계수로 사용합니다.
     * [EN] Uses the source alpha value as the factor.
     */
    readonly SRC_ALPHA: "src-alpha";
    /**
     * [KO] (1 - 소스 알파) 값을 계수로 사용합니다.
     * [EN] Uses (1 - source alpha) value as the factor.
     */
    readonly ONE_MINUS_SRC_ALPHA: "one-minus-src-alpha";
    /**
     * [KO] 대상 색상 값을 계수로 사용합니다.
     * [EN] Uses the destination color value as the factor.
     */
    readonly DST: "dst";
    /**
     * [KO] (1 - 대상 색상) 값을 계수로 사용합니다.
     * [EN] Uses (1 - destination color) value as the factor.
     */
    readonly ONE_MINUS_DST: "one-minus-dst";
    /**
     * [KO] 대상 알파 값을 계수로 사용합니다.
     * [EN] Uses the destination alpha value as the factor.
     */
    readonly DST_ALPHA: "dst-alpha";
    /**
     * [KO] (1 - 대상 알파) 값을 계수로 사용합니다.
     * [EN] Uses (1 - destination alpha) value as the factor.
     */
    readonly ONE_MINUS_DST_ALPHA: "one-minus-dst-alpha";
    /**
     * [KO] 클램핑된 소스 알파 값을 계수로 사용합니다.
     * [EN] Uses the saturated source alpha value as the factor.
     */
    readonly SRC_ALPHA_SATURATED: "src-alpha-saturated";
    /**
     * [KO] 설정된 상수 색상을 계수로 사용합니다.
     * [EN] Uses the constant color as the factor.
     */
    readonly CONSTANT: "constant";
    /**
     * [KO] (1 - 상수 색상) 값을 계수로 사용합니다.
     * [EN] Uses (1 - constant color) value as the factor.
     */
    readonly ONE_MINUS_CONSTANT: "one-minus-constant";
    /**
     * [KO] 두 번째 소스 색상을 계수로 사용합니다.
     * [EN] Uses the second source color as the factor.
     */
    readonly SRC1: "src1";
    /**
     * [KO] (1 - 두 번째 소스 색상) 값을 계수로 사용합니다.
     * [EN] Uses (1 - second source color) value as the factor.
     */
    readonly ONE_MINUS_SRC1: "one-minus-src1";
    /**
     * [KO] 두 번째 소스 알파 값을 계수로 사용합니다.
     * [EN] Uses the second source alpha value as the factor.
     */
    readonly SRC1_ALPHA: "src1-alpha";
    /**
     * [KO] (1 - 두 번째 소스 알파) 값을 계수로 사용합니다.
     * [EN] Uses (1 - second source alpha) value as the factor.
     */
    readonly ONE_MINUS_SRC1_ALPHA: "one-minus-src1-alpha";
};
export default GPU_BLEND_FACTOR;
