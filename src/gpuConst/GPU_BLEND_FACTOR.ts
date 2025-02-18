/**
 * GPU_BLEND_FACTOR defines the available blending factors for GPU blending operations.
 */
const GPU_BLEND_FACTOR = {
    ZERO: "zero",
    ONE: 'one',
    SRC: "src",
    ONE_MINUS_SRC: "one-minus-src",
    SRC_ALPHA: "src-alpha",
    ONE_MINUS_SRC_ALPHA: "one-minus-src-alpha",
    DST: "dst",
    ONE_MINUS_DST: "one-minus-dst",
    DST_ALPHA: "dst-alpha",
    ONE_MINUS_DST_ALPHA: "one-minus-dst-alpha",
    SRC_ALPHA_SATURATED: "src-alpha-saturated",
    CONSTANT: "constant",
    ONE_MINUS_CONSTANT: "one-minus-constant",
    SRC1: "src1",
    ONE_MINUS_SRC1: "one-minus-src1",
    SRC1_ALPHA: "src1-alpha",
    ONE_MINUS_SRC1_ALPHA: "one-minus-src1-alpha",
} as const;
Object.freeze(GPU_BLEND_FACTOR)
export default GPU_BLEND_FACTOR
