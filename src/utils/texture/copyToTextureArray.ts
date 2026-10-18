/**
 * [KO] 소스 텍스처를 배열 텍스처의 특정 슬라이스(Slice)로 복사합니다.
 * [EN] Copies a source texture to a specific slice of a texture array.
 *
 * ### Example
 * ```typescript
 * // [KO] 소스 텍스처를 배열 텍스처의 0번 슬라이스로 복사
 * // [EN] Copy source texture to slice 0 of the texture array
 * RedGPU.Util.copyToTextureArray(commandEncoder, sourceTexture, targetArrayTexture, 0);
 * ```
 *
 * @param commandEncoder -
 * [KO] 커맨드 인코더
 * [EN] Command encoder
 * @param sourceTexture -
 * [KO] 복사할 소스 텍스처
 * [EN] Source texture to copy
 * @param targetArrayTexture -
 * [KO] 대상 배열 텍스처
 * [EN] Target texture array
 * @param sliceIndex -
 * [KO] 대상 슬라이스 인덱스
 * [EN] Target slice index
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
