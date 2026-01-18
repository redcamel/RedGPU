/**
 * [KO] ImageBitmap 배열을 GPUTexture로 복사하여 생성합니다.
 * [EN] Creates a GPUTexture by copying an array of ImageBitmaps.
 *
 * * ### Example
 * ```typescript
 * const texture = imageBitmapToGPUTexture(device, [bitmap], descriptor);
 * ```
 *
 * @param gpuDevice
 * [KO] GPUDevice 인스턴스
 * [EN] GPUDevice instance
 * @param imageBitmaps
 * [KO] 복사할 ImageBitmap 배열
 * [EN] Array of ImageBitmaps to copy
 * @param textureDescriptor
 * [KO] GPUTexture 디스크립터
 * [EN] GPUTexture descriptor
 * @param [usePremultiplyAlpha=true]
 * [KO] 프리멀티플 알파 사용 여부
 * [EN] Whether to use premultiplied alpha
 *
 * @returns
 * [KO] 생성된 GPUTexture 객체
 * [EN] Created GPUTexture object
 *
 * @category Texture
 */
const imageBitmapToGPUTexture = (
    gpuDevice: GPUDevice,
    imageBitmaps: ImageBitmap[],
    textureDescriptor: GPUTextureDescriptor,
    usePremultiplyAlpha: boolean = true
) => {
    const newGPUTexture = gpuDevice.createTexture(textureDescriptor);
    //
    for (let i = 0; i < imageBitmaps.length; i++) {
        const targetImgBitmap = imageBitmaps[i]
        const source: GPUCopyExternalImageSourceInfo = {source: targetImgBitmap}
        const destination: GPUCopyExternalImageDestInfo = {
            texture: newGPUTexture,
            origin: [0, 0, i],
            premultipliedAlpha: usePremultiplyAlpha
        }
        if (textureDescriptor.format.includes('srgb')) {
            destination.colorSpace = 'srgb'
        }
        const copySize: GPUExtent3DStrict = [targetImgBitmap.width, targetImgBitmap.height]
        // 생성한 텍스쳐에 데이터를 밀어넣는다.
        gpuDevice.queue.copyExternalImageToTexture(
            source,
            destination,
            copySize
        );
    }
    return newGPUTexture
}
export default imageBitmapToGPUTexture