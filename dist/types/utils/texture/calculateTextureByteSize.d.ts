/**
 * 주어진 GPUTexture 객체의 바이트 크기를 계산합니다.
 *
 * 텍스처의 크기, 포맷, 샘플 수를 바탕으로 전체 바이트 크기를 반환합니다.
 *
 * @category Texture
 * @param texture 바이트 크기를 계산할 GPUTexture 객체
 * @returns 계산된 텍스처의 전체 바이트 크기
 */
declare function calculateTextureByteSize(texture: GPUTexture): number;
export default calculateTextureByteSize;
