/**
 * [KO] 주어진 GPUTexture 객체의 바이트 크기를 계산합니다.
 * [EN] Calculates the byte size of a given GPUTexture object.
 *
 * * ### Example
 * ```typescript
 * const byteSize = calculateTextureByteSize(gpuTexture);
 * ```
 *
 * @param texture
 * [KO] 바이트 크기를 계산할 GPUTexture 객체
 * [EN] GPUTexture object to calculate byte size for
 *
 * @returns
 * [KO] 계산된 텍스처의 전체 바이트 크기
 * [EN] Calculated total byte size of the texture
 *
 * @category Texture
 */
function calculateTextureByteSize(texture: GPUTexture): number {
    const descriptor: GPUTextureDescriptor = {
        size: [texture.width, texture.height, texture.depthOrArrayLayers],
        format: texture.format,
        sampleCount: texture.sampleCount,
        usage: texture.usage
    }
    const bytesPerTexel = getTextureFormatByteSize(descriptor.format);
    const texelCount = descriptor.size[0] * descriptor.size[1] * (descriptor.size[2] || 1);
    const sampleCount = descriptor.sampleCount ? descriptor.sampleCount : 1;
    return bytesPerTexel * texelCount * sampleCount;
}

/**
 * [KO] 주어진 GPUTextureFormat에 해당하는 텍셀의 바이트 크기를 반환합니다.
 * [EN] Returns the byte size per texel for a given GPUTextureFormat.
 *
 * @category Texture
 * @param format
 * [KO] GPUTextureFormat 문자열
 * [EN] GPUTextureFormat string
 * @returns
 * [KO] 해당 포맷의 텍셀 바이트 크기
 * [EN] Byte size per texel for the format
 * @throws
 * [KO] 인식할 수 없는 포맷일 경우 예외 발생
 * [EN] Throws an exception if the format is unrecognized
 */
function getTextureFormatByteSize(format: GPUTextureFormat): number {
    switch (format) {
        case 'r8unorm':
        case 'r8snorm':
        case 'r8uint':
        case 'r8sint':
            return 1;  // 1 byte for the R channel
        case 'r16uint':
        case 'r16sint':
        case 'r16float':
        case 'rg8unorm':
        case 'rg8snorm':
        case 'rg8uint':
        case 'rg8sint':
            return 2;  // 2 bytes for R and RG types
        case 'r32uint':
        case 'r32sint':
        case 'r32float':
        case 'rg16uint':
        case 'rg16sint':
        case 'rg16float':
        case 'rgba8unorm':
        case 'rgba8unorm-srgb':
        case 'rgba8snorm':
        case 'rgba8uint':
        case 'rgba8sint':
        case 'bgra8unorm':
        case 'bgra8unorm-srgb':
            return 4;  // 4 bytes for R, RG and RGBA types
        case 'rg32uint':
        case 'rg32sint':
        case 'rg32float':
        case 'rgba16uint':
        case 'rgba16sint':
        case 'rgba16float':
            return 8;  // 8 bytes for RG and RGBA types
        case 'rgba32uint':
        case 'rgba32sint':
        case 'rgba32float':
            return 16; // 16 bytes for RGBA type
        case 'depth16unorm':
            return 2;  // 2 bytes for 16-bit depth
        case 'depth24plus':
            return 4;  // 4 bytes for 24-bit depth, potentially plus 8 bits of stencil
        case 'depth32float':
            return 4;  // 4 bytes for 32-bit depth float
        default:
            throw new Error(`Unrecognized texture format: ${format}`);
    }
}

export default calculateTextureByteSize