/**
 * [KO] Simplex 노이즈 생성 차원을 정의하는 상수입니다.
 * [EN] Constants defining the dimension used for Simplex noise generation.
 *
 * [KO] `MODE_1D`(1), `MODE_2D`(2), `MODE_3D`(3) 값을 가집니다.
 * [EN] Has the values `MODE_1D`(1), `MODE_2D`(2), and `MODE_3D`(3).
 *
 * ### Example
 * ```typescript
 * simplexTexture.noiseDimension = RedGPU.Resource.NOISE_DIMENSION.MODE_3D;
 * ```
 *
 * @experimental
 * @category NoiseTexture
 */
const NOISE_DIMENSION = {
    MODE_1D: 1,
    MODE_2D: 2,
    MODE_3D: 3,
} as const
Object.freeze(NOISE_DIMENSION)
export default NOISE_DIMENSION
