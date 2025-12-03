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
