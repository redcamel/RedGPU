/**
 * ImageBitmap 배열을 GPUTexture로 복사하여 생성합니다.
 *
 * @param gpuDevice - GPUDevice 인스턴스
 * @param imageBitmaps - 복사할 ImageBitmap 배열 (큐브맵 등 다중 텍스처 지원)
 * @param textureDescriptor - 생성할 GPUTexture의 디스크립터
 * @param usePremultiplyAlpha - 프리멀티플 알파 사용 여부(기본값: true)
 * @returns 생성된 GPUTexture 객체
 * @category Texture
 */
declare const imageBitmapToGPUTexture: (gpuDevice: GPUDevice, imageBitmaps: ImageBitmap[], textureDescriptor: GPUTextureDescriptor, usePremultiplyAlpha?: boolean) => GPUTexture;
export default imageBitmapToGPUTexture;
