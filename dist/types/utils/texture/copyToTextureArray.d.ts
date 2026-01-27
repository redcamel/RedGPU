/**
 * [KO] 소스 텍스처를 배열 텍스처의 특정 슬라이스에 복사합니다.
 * [EN] Copies a source texture to a specific slice of a texture array.
 *
 * * ### Example
 * ```typescript
 * RedGPU.Util.copyToTextureArray(device, sourceTex, targetArrayTex, 0);
 * ```
 *
 * @param gpuDevice -
 * [KO] 복사 작업에 사용할 GPU 디바이스
 * [EN] GPU device to use for the copy operation
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
declare function copyToTextureArray(gpuDevice: GPUDevice, sourceTexture: GPUTexture, targetArrayTexture: GPUTexture, sliceIndex: number): void;
export default copyToTextureArray;
