/**
 * [KO] 소스 텍스처를 배열 텍스처의 특정 슬라이스(Slice)로 복사합니다.
 * [EN] Copies a source texture to a specific slice of a texture array.
 *
 * * ### Example
 * ```typescript
 * RedGPU.Util.copyToTextureArray(commandEncoder, sourceTex, targetArrayTex, 0);
 * ```
 *
 * @param commandEncoder - [KO] 커맨드 인코더 [EN] Command Encoder
 * @param sourceTexture - [KO] 복사할 소스 텍스처 [EN] Source texture
 * @param targetArrayTexture - [KO] 대상 배열 텍스처 [EN] Target texture array
 * @param sliceIndex - [KO] 대상 슬라이스 인덱스 [EN] Target slice index
 * @category Texture
 */
function copyToTextureArray(
    commandEncoder: GPUCommandEncoder,
    sourceTexture: GPUTexture,
    targetArrayTexture: GPUTexture,
    sliceIndex: number,
) {
    commandEncoder.copyTextureToTexture(
        {texture: sourceTexture},
        {
            texture: targetArrayTexture,
            origin: [0, 0, sliceIndex]
        },
        [sourceTexture.width, sourceTexture.height, 1]
    );
}

export default copyToTextureArray;
