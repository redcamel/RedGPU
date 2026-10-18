/**
 * [KO] `ImageBitmap` 배열을 기반으로 `GPUTexture`를 생성하고 각 레이어에 이미지 데이터를 복사합니다.
 * [EN] Creates a `GPUTexture` from an array of `ImageBitmap` objects and copies the image data into each layer.
 *
 * @param gpuDevice -
 * [KO] WebGPU 디바이스(`GPUDevice`) 인스턴스
 * [EN] WebGPU device (`GPUDevice`) instance
 * @param imageBitmaps -
 * [KO] 텍스처로 복사할 `ImageBitmap` 배열
 * [EN] Array of `ImageBitmap` objects to copy into the texture
 * @param textureDescriptor -
 * [KO] 생성할 텍스처의 디스크립터(`GPUTextureDescriptor`)
 * [EN] Descriptor (`GPUTextureDescriptor`) for the texture to be created
 * @param usePremultiplyAlpha -
 * [KO] 알파 프리멀티플라이 적용 여부 (기본값: `true`)
 * [EN] Whether to apply premultiplied alpha (default: `true`)
 * @returns
 * [KO] 이미지 데이터가 업로드된 `GPUTexture` 객체
 * [EN] `GPUTexture` object with the uploaded image data
 * @category Texture
 */
const imageBitmapToGPUTexture = (
    gpuDevice: GPUDevice,
    imageBitmaps: ImageBitmap[],
    textureDescriptor: GPUTextureDescriptor,
    usePremultiplyAlpha: boolean = true
) => {
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
