/**
 * [KO] GPUTexture의 전체 바이트 크기를 계산합니다.
 * [EN] Calculates the total byte size of a GPUTexture.
 *
 * [KO] 가로, 세로, 레이어(또는 깊이) 수와 샘플 수를 기반으로 텍스처가 사용하는 실제 메모리 크기를 계산합니다.
 * [EN] Calculates the actual memory size used by the texture based on its width, height, layers (or depth), and sample count.
 *
 * * ### Example
 * ```typescript
 * const byteSize = RedGPU.Util.calculateTextureByteSize(gpuTexture);
 * ```
 *
 * @param texture - [KO] 대상 GPUTexture 객체 [EN] Target GPUTexture object
 * @returns [KO] 계산된 전체 바이트 크기 [EN] Calculated total byte size
 * @category Texture
 */
declare function calculateTextureByteSize(texture: GPUTexture): number;
export default calculateTextureByteSize;
