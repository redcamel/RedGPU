/**
 * 소스 텍스처를 배열 텍스처의 특정 슬라이스에 복사합니다.
 *
 * GPU 디바이스의 커맨드 인코더를 사용하여 sourceTexture의 내용을 targetArrayTexture의 지정된 sliceIndex에 복사합니다.
 * 복사 크기는 소스 텍스처의 width, height, 깊이 1로 고정됩니다.
 *
 * @category Texture
 * @param {GPUDevice} gpuDevice 복사 작업에 사용할 GPU 디바이스
 * @param {GPUTexture} sourceTexture 복사할 소스 텍스처
 * @param {GPUTexture} targetArrayTexture 복사 대상 배열 텍스처
 * @param {number} sliceIndex 복사할 배열 텍스처의 슬라이스 인덱스
 */
declare function copyToTextureArray(gpuDevice: GPUDevice, sourceTexture: GPUTexture, targetArrayTexture: GPUTexture, sliceIndex: number): void;
export default copyToTextureArray;
