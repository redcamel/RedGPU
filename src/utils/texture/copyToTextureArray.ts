/**
 * [KO] 소스 텍스처를 배열 텍스처의 특정 슬라이스에 복사합니다.
 * [EN] Copies a source texture to a specific slice of a texture array.
 *
 * * ### Example
 * ```typescript
 * RedGPU.Util.copyToTextureArray(commandEncoder, sourceTex, targetArrayTex, 0);
 * ```
 *
 * @param commandEncoder - [KO] 커맨드 인코더 [EN] Command Encoder
 * @param sourceTexture -
 * [KO] 복사할 소스 텍스처
 * [EN] Source texture to copy from
 * @param targetArrayTexture -
 * [KO] 복사 대상 배열 텍스처
 * [EN] Target texture array to copy to
 * @param sliceIndex -
 * [KO] 복사할 슬라이스 인덱스
 * [EN] Slice index to copy into
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