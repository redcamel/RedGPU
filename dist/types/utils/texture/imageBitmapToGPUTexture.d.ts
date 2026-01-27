/**
 * [KO] ImageBitmap 배열을 GPUTexture로 생성합니다.
 * [EN] Creates a GPUTexture from an array of ImageBitmaps.
 *
 * * ### Example
 * ```typescript
 * const texture = RedGPU.Util.imageBitmapToGPUTexture(device, [bitmap], descriptor);
 * ```
 *
 * @param gpuDevice -
 * [KO] GPUDevice 인스턴스
 * [EN] GPUDevice instance
 * @param imageBitmaps -
 * [KO] 복사할 ImageBitmap 배열
 * [EN] Array of ImageBitmaps to copy
 * @param textureDescriptor -
 * [KO] GPUTexture 디스크립터
 * [EN] GPUTexture descriptor
 * @param usePremultiplyAlpha -
 * [KO] 프리멀티플 알파 사용 여부 (기본값: true)
 * [EN] Whether to use premultiplied alpha (Default: true)
 * @returns
 * [KO] 생성된 GPUTexture 객체
 * [EN] Created GPUTexture object
 * @category Texture
 */
declare const imageBitmapToGPUTexture: (gpuDevice: GPUDevice, imageBitmaps: ImageBitmap[], textureDescriptor: GPUTextureDescriptor, usePremultiplyAlpha?: boolean) => GPUTexture;
export default imageBitmapToGPUTexture;
