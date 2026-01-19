/**
 * [KO] GPUTexture의 바이트 크기를 계산합니다.
 * [EN] Calculates the byte size of a GPUTexture.
 *
 * * ### Example
 * ```typescript
 * const byteSize = RedGPU.Util.calculateTextureByteSize(gpuTexture);
 * ```
 *
 * @param texture -
 * [KO] 바이트 크기를 계산할 GPUTexture 객체
 * [EN] GPUTexture object to calculate byte size for
 * @returns
 * [KO] 계산된 전체 바이트 크기
 * [EN] Calculated total byte size
 * @category Texture
 */
declare function calculateTextureByteSize(texture: GPUTexture): number;
export default calculateTextureByteSize;
