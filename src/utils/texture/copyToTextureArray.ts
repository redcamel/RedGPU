/**
 * [KO] 소스 텍스처를 배열 텍스처의 특정 슬라이스에 복사합니다.
 * [EN] Copies a source texture to a specific slice of a texture array.
 *
 * [KO] GPU 디바이스의 커맨드 인코더를 사용하여 sourceTexture의 내용을 targetArrayTexture의 지정된 sliceIndex에 복사합니다. 복사 크기는 소스 텍스처의 width, height, 깊이 1로 고정됩니다.
 * [EN] Copies the contents of sourceTexture into the specified sliceIndex of targetArrayTexture using a GPU command encoder. The copy size is fixed to the source texture's width, height, and a depth of 1.
 *
 * @category Texture
 * @param gpuDevice
 * [KO] 복사 작업에 사용할 GPU 디바이스
 * [EN] GPU device to use for the copy operation
 * @param sourceTexture
 * [KO] 복사할 소스 텍스처
 * [EN] Source texture to copy from
 * @param targetArrayTexture
 * [KO] 복사 대상 배열 텍스처
 * [EN] Target texture array to copy to
 * @param sliceIndex
 * [KO] 복사할 배열 텍스처의 슬라이스 인덱스
 * [EN] Slice index of the texture array to copy into
 */
function copyToTextureArray(
    gpuDevice: GPUDevice,
    sourceTexture: GPUTexture,
    targetArrayTexture: GPUTexture,
    sliceIndex: number
) {
    const encoder = gpuDevice.createCommandEncoder({
        label: 'COPY_TO_TEXTURE_ARRAY'
    });
    encoder.copyTextureToTexture(
        {texture: sourceTexture},
        {
            texture: targetArrayTexture,
            origin: [0, 0, sliceIndex]
        },
        [sourceTexture.width, sourceTexture.height, 1]
    );
    gpuDevice.queue.submit([encoder.finish()]);
}

export default copyToTextureArray;