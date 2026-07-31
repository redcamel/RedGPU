/**
 * [KO] GPUTexture의 전체 바이트 크기를 계산합니다.
 * [EN] Calculates the total byte size of a GPUTexture.
 *
 * [KO] 가로, 세로, 레이어(또는 깊이) 수와 샘플 수를 기반으로 텍스처가 사용하는 실제 메모리 크기를 계산합니다.
 * [EN] Calculates the actual memory size used by the texture based on its width, height, layers (or depth), and sample count.
 *
 * * ### Example
 * ```typescript
 * const byteSize = RedGPU.Util.calculateTextureByteSize(gpuTexture);
 * ```
 *
 * @param texture - [KO] 대상 GPUTexture 객체 [EN] Target GPUTexture object
 * @returns [KO] 계산된 전체 바이트 크기 [EN] Calculated total byte size
 * @category Texture
 */
function calculateTextureByteSize(texture: GPUTexture): number {
    const bytesPerTexel = getTextureFormatByteSize(texture.format);
    // [KO] depthOrArrayLayers는 GPUTexture의 필수 속성이며, 최소 1 이상의 값을 가집니다.
    // [EN] depthOrArrayLayers is a mandatory attribute of GPUTexture and has a minimum value of 1.
    const texelCount = texture.width * texture.height * (texture.depthOrArrayLayers || 1);
    const sampleCount = texture.sampleCount || 1;
    return bytesPerTexel * texelCount * sampleCount;
}

/**
 * [KO] GPUTextureFormat의 텍셀당 바이트 크기를 반환합니다.
 * [EN] Returns the byte size per texel for a GPUTextureFormat.
 *
 * @param format - [KO] 텍스처 포맷 문자열 [EN] Texture format string
 * @returns [KO] 해당 포맷의 텍셀당 바이트 수 [EN] Number of bytes per texel for the format
 * @category Texture
 */
function getTextureFormatByteSize(format: GPUTextureFormat): number {
    switch (format) {
        case 'r8unorm':
        case 'r8snorm':
        case 'r8uint':
        case 'r8sint':
            return 1;
        case 'r16uint':
        case 'r16sint':
        case 'r16float':
        case 'r16unorm':
        case 'r16snorm':
        case 'rg8unorm':
        case 'rg8snorm':
        case 'rg8uint':
        case 'rg8sint':
            return 2;
        case 'r32uint':
        case 'r32sint':
        case 'r32float':
        case 'rg16uint':
        case 'rg16sint':
        case 'rg16float':
        case 'rg16unorm':
        case 'rg16snorm':
        case 'rgba8unorm':
        case 'rgba8unorm-srgb':
        case 'rgba8snorm':
        case 'rgba8uint':
        case 'rgba8sint':
        case 'bgra8unorm':
        case 'bgra8unorm-srgb':
        case 'rgb9e5ufloat':
        case 'rg11b10ufloat':
            return 4;
        case 'rg32uint':
        case 'rg32sint':
        case 'rg32float':
        case 'rgba16uint':
        case 'rgba16sint':
        case 'rgba16float':
        case 'rgba16unorm':
        case 'rgba16snorm':
            return 8;
        case 'rgba32uint':
        case 'rgba32sint':
        case 'rgba32float':
            return 16;
        case 'depth16unorm':
            return 2;
        case 'depth24plus':
        case 'depth32float':
            return 4;
        default:
            // BC / ETC2 / ASTC 등의 블록 압축 포맷
            if (format.startsWith('bc1') || format.startsWith('bc4') || format.startsWith('etc2-rgb8')) {
                return 0.5; // 8 bytes / 16 texels
            }
            if (format.startsWith('bc') || format.startsWith('etc') || format.startsWith('astc')) {
                return 1; // 16 bytes / 16 texels
            }
            throw new Error(`Unrecognized texture format: ${format}`);
    }
}

export default calculateTextureByteSize
