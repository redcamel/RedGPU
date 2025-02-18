const imageBitmapToGPUTexture = (
    gpuDevice: GPUDevice,
    imageBitmap: ImageBitmap[],
    textureDescriptor: GPUTextureDescriptor,
    usePremultiplyAlpha: boolean = true
) => {
    const newGPUTexture = gpuDevice.createTexture(textureDescriptor);
    //
    for (let i = 0; i < imageBitmap.length; i++) {
        const targetImgBitmap = imageBitmap[i]
        const source: GPUImageCopyExternalImage = {source: targetImgBitmap}
        const destination: GPUImageCopyTextureTagged = {
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
