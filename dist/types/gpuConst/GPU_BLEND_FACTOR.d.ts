/**
 * [KO] 렌더 파이프라인의 색상 및 알파 블렌딩 연산에서 소스(Source)와 대상(Destination) 값에 곱해지는 가중치 계수 상수입니다.
 * [EN] Weight factor constants multiplied with source and destination values in color and alpha blending operations of a render pipeline.
 *
 * @category Constants
 */
declare const GPU_BLEND_FACTOR: {
    /**
     * [KO] 가중치로 `0`을 적용합니다. `(0, 0, 0, 0)`
     * [EN] Applies a weight factor of `0`. `(0, 0, 0, 0)`
     */
    readonly ZERO: "zero";
    /**
     * [KO] 가중치로 `1`을 적용합니다. `(1, 1, 1, 1)`
     * [EN] Applies a weight factor of `1`. `(1, 1, 1, 1)`
     */
    readonly ONE: "one";
    /**
     * [KO] 프래그먼트 셰이더가 출력한 소스 색상값을 가중치로 적용합니다. `(Rs, Gs, Bs, As)`
     * [EN] Applies the source color output from the fragment shader as the weight factor. `(Rs, Gs, Bs, As)`
     */
    readonly SRC: "src";
    /**
     * [KO] `1`에서 소스 색상값을 뺀 보수 값을 가중치로 적용합니다. `(1-Rs, 1-Gs, 1-Bs, 1-As)`
     * [EN] Applies one minus the source color as the weight factor. `(1-Rs, 1-Gs, 1-Bs, 1-As)`
     */
    readonly ONE_MINUS_SRC: "one-minus-src";
    /**
     * [KO] 소스의 알파(Alpha) 값을 가중치로 적용합니다. `(As, As, As, As)`
     * [EN] Applies the source alpha value as the weight factor. `(As, As, As, As)`
     */
    readonly SRC_ALPHA: "src-alpha";
    /**
     * [KO] `1`에서 소스 알파 값을 뺀 보수 값을 가중치로 적용합니다. `(1-As, 1-As, 1-As, 1-As)`
     * [EN] Applies one minus the source alpha value as the weight factor. `(1-As, 1-As, 1-As, 1-As)`
     */
    readonly ONE_MINUS_SRC_ALPHA: "one-minus-src-alpha";
    /**
     * [KO] 렌더 타겟(프레임버퍼)에 기록된 대상 색상값을 가중치로 적용합니다. `(Rd, Gd, Bd, Ad)`
     * [EN] Applies the destination color currently stored in the render target as the weight factor. `(Rd, Gd, Bd, Ad)`
     */
    readonly DST: "dst";
    /**
     * [KO] `1`에서 대상 색상값을 뺀 보수 값을 가중치로 적용합니다. `(1-Rd, 1-Gd, 1-Bd, 1-Ad)`
     * [EN] Applies one minus the destination color as the weight factor. `(1-Rd, 1-Gd, 1-Bd, 1-Ad)`
     */
    readonly ONE_MINUS_DST: "one-minus-dst";
    /**
     * [KO] 대상의 알파(Alpha) 값을 가중치로 적용합니다. `(Ad, Ad, Ad, Ad)`
     * [EN] Applies the destination alpha value as the weight factor. `(Ad, Ad, Ad, Ad)`
     */
    readonly DST_ALPHA: "dst-alpha";
    /**
     * [KO] `1`에서 대상 알파 값을 뺀 보수 값을 가중치로 적용합니다. `(1-Ad, 1-Ad, 1-Ad, 1-Ad)`
     * [EN] Applies one minus the destination alpha value as the weight factor. `(1-Ad, 1-Ad, 1-Ad, 1-Ad)`
     */
    readonly ONE_MINUS_DST_ALPHA: "one-minus-dst-alpha";
    /**
     * [KO] 포화된 소스 알파 값(`min(As, 1-Ad)`)을 색상 가중치로, `1`을 알파 가중치로 적용합니다.
     * [EN] Applies saturated source alpha (`min(As, 1-Ad)`) for RGB channels and `1` for the alpha channel.
     */
    readonly SRC_ALPHA_SATURATED: "src-alpha-saturated";
    /**
     * [KO] 렌더 패스에 설정된 고정 블렌드 상수(`blendConstant`) 값을 가중치로 적용합니다. `(Rc, Gc, Bc, Ac)`
     * [EN] Applies the constant blend color (`blendConstant`) configured in the render pass as the weight factor. `(Rc, Gc, Bc, Ac)`
     */
    readonly CONSTANT: "constant";
    /**
     * [KO] `1`에서 고정 블렌드 상수 값을 뺀 보수 값을 가중치로 적용합니다. `(1-Rc, 1-Gc, 1-Bc, 1-Ac)`
     * [EN] Applies one minus the constant blend color as the weight factor. `(1-Rc, 1-Gc, 1-Bc, 1-Ac)`
     */
    readonly ONE_MINUS_CONSTANT: "one-minus-constant";
    /**
     * [KO] 듀얼 소스 블렌딩(Dual-Source Blending)의 두 번째 소스 색상값을 가중치로 적용합니다. `(Rs1, Gs1, Bs1, As1)`
     * [EN] Applies the secondary source color in dual-source blending as the weight factor. `(Rs1, Gs1, Bs1, As1)`
     */
    readonly SRC1: "src1";
    /**
     * [KO] `1`에서 두 번째 소스 색상값을 뺀 보수 값을 가중치로 적용합니다. `(1-Rs1, 1-Gs1, 1-Bs1, 1-As1)`
     * [EN] Applies one minus the secondary source color as the weight factor. `(1-Rs1, 1-Gs1, 1-Bs1, 1-As1)`
     */
    readonly ONE_MINUS_SRC1: "one-minus-src1";
    /**
     * [KO] 두 번째 소스의 알파 값을 가중치로 적용합니다. `(As1, As1, As1, As1)`
     * [EN] Applies the secondary source alpha value as the weight factor. `(As1, As1, As1, As1)`
     */
    readonly SRC1_ALPHA: "src1-alpha";
    /**
     * [KO] `1`에서 두 번째 소스 알파 값을 뺀 보수 값을 가중치로 적용합니다. `(1-As1, 1-As1, 1-As1, 1-As1)`
     * [EN] Applies one minus the secondary source alpha value as the weight factor. `(1-As1, 1-As1, 1-As1, 1-As1)`
     */
    readonly ONE_MINUS_SRC1_ALPHA: "one-minus-src1-alpha";
};
export default GPU_BLEND_FACTOR;
