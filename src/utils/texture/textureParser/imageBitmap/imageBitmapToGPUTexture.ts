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
