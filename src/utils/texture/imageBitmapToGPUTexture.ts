/**
 * [KO] ImageBitmap 배열을 사용하여 GPUTexture를 생성합니다.
 * [EN] Creates a GPUTexture using an array of ImageBitmaps.
 *
 * [KO] 내부적으로 copyExternalImageToTexture를 사용하며, 필요한 Usage 플래그를 자동으로 추가합니다.
 * [EN] Internally uses copyExternalImageToTexture and automatically adds necessary Usage flags.
 *
 * * ### Example
 * ```typescript
 * const texture = RedGPU.Util.imageBitmapToGPUTexture(device, [bitmap], descriptor);
 * ```
 *
 * @param gpuDevice - [KO] GPUDevice 인스턴스 [EN] GPUDevice instance
 * @param imageBitmaps - [KO] 소스 ImageBitmap 배열 [EN] Array of source ImageBitmaps
 * @param textureDescriptor - [KO] 생성할 텍스처 디스크립터 [EN] Texture descriptor to create
 * @param usePremultiplyAlpha - [KO] 프리멀티플 알파 사용 여부 (기본값: true) [EN] Whether to use premultiplied alpha (Default: true)
 * @returns [KO] 생성된 GPUTexture [EN] Created GPUTexture
 * @category Texture
 */
const imageBitmapToGPUTexture = (
    gpuDevice: GPUDevice,
    imageBitmaps: ImageBitmap[],
    textureDescriptor: GPUTextureDescriptor,
    usePremultiplyAlpha: boolean = true
) => {
    // [KO] copyExternalImageToTexture를 사용하려면 목적지 텍스처에 COPY_DST와 RENDER_ATTACHMENT 권한이 반드시 필요합니다.
    // [EN] To use copyExternalImageToTexture, the destination texture must have COPY_DST and RENDER_ATTACHMENT usage.
    textureDescriptor.usage |= GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;

    const newGPUTexture = gpuDevice.createTexture(textureDescriptor);

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
        gpuDevice.queue.copyExternalImageToTexture(
            source,
            destination,
            copySize
        );
    }
    return newGPUTexture
}
export default imageBitmapToGPUTexture
