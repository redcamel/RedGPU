function calculateTextureByteSize(texture: GPUTexture): number {
    const bytesPerTexel = getTextureFormatByteSize(texture.format);
    const texelCount = texture.width * texture.height * (texture.depthOrArrayLayers || 1);
    const sampleCount = texture.sampleCount || 1;
    return bytesPerTexel * texelCount * sampleCount;
}

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
            if (format.startsWith('bc1') || format.startsWith('bc4') || format.startsWith('etc2-rgb8')) {
                return 0.5;
            }
            if (format.startsWith('bc') || format.startsWith('etc') || format.startsWith('astc')) {
                return 1;
            }
            throw new Error(`Unrecognized texture format: ${format}`);
    }
}

export default calculateTextureByteSize
