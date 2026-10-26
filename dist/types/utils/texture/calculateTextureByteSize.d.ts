/**
 * [KO] `GPUTexture`의 포맷, 해상도, 레이어 수, 샘플 수를 기반으로 총 바이트 크기를 계산합니다.
 * [EN] Calculates the total byte size of a `GPUTexture` based on its format, resolution, layer count, and sample count.
 *
 * @param texture -
 * [KO] 바이트 크기를 계산할 대상 `GPUTexture` 객체
 * [EN] Target `GPUTexture` object to calculate byte size
 * @returns
 * [KO] 계산된 텍스처의 총 바이트 크기
 * [EN] Calculated total byte size of the texture
 * @throws
 * [KO] 지원하지 않거나 인식할 수 없는 텍스처 포맷인 경우 `Error`가 발생합니다.
 * [EN] Throws `Error` if the texture format is unsupported or unrecognized.
 * @category Texture
 */
declare function calculateTextureByteSize(texture: GPUTexture): number;
export default calculateTextureByteSize;
