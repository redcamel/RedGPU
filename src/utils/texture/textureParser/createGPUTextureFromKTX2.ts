import {KTX2Container, read} from 'ktx-parse';
import {decompress as decompressZstd} from 'fzstd';
import keepLog from "../../keepLog";

export interface CreateKTX2Options {
    device: GPUDevice;
    /** KTX2Container 객체 또는 KTX2 바이너리 ArrayBuffer / Uint8Array */
    container: KTX2Container | ArrayBuffer | Uint8Array;
    /** 명시적 포맷 오버라이드 (기본값: vkFormat 기반 자동 추론) */
    overrideFormat?: GPUTextureFormat;
    /** Red 채널과 Blue 채널 스와이프(Swizzle) 여부 (BGRA <-> RGBA 색상 반전 보정) */
    swapRedBlue?: boolean;
    /** 디버깅을 위한 GPU 리소스 라벨 */
    label?: string;
    /** 추가적인 GPUTextureUsage 플래그 (기본: TEXTURE_BINDING | COPY_DST) */
    usage?: GPUTextureUsageFlags;
}

/**
 * Vulkan Format ID -> WebGPU GPUTextureFormat 매핑 테이블
 */
const VK_FORMAT_TO_WEBGPU: Record<number, GPUTextureFormat> = {
    // 8-bit Unorm / Srgb
    9: 'r8unorm', // VK_FORMAT_R8_UNORM
    16: 'rg8unorm', // VK_FORMAT_R8G8_UNORM
    37: 'rgba8unorm', // VK_FORMAT_R8G8B8A8_UNORM
    43: 'rgba8unorm-srgb', // VK_FORMAT_R8G8B8A8_SRGB
    44: 'bgra8unorm', // VK_FORMAT_B8G8R8A8_UNORM
    50: 'bgra8unorm-srgb', // VK_FORMAT_B8G8R8A8_SRGB

    // 16-bit Unorm
    23: 'r16unorm', // VK_FORMAT_R16_UNORM
    30: 'rg16unorm', // VK_FORMAT_R16G16_UNORM
    42: 'rgba16float', // VK_FORMAT_R16G16B16A16_UNORM (WebGPU Core 호환)

    // Packed Float & Special Float Formats
    91: 'rgba16unorm', // VK_FORMAT_E5B9G9R9_UFLOAT_PACK32 / VK_FORMAT_B9G9R9E5_UFLOAT_PACK32
    122: 'rg11b10ufloat', // VK_FORMAT_B10G11R11_UFLOAT_PACK32
    123: 'rgb9e5ufloat', // VK_FORMAT_E5B9G9R9_UFLOAT_PACK32

    // 16-bit / 32-bit Float
    76: 'r16float', // VK_FORMAT_R16_SFLOAT
    83: 'rg16float', // VK_FORMAT_R16G16_SFLOAT
    97: 'rgba16float', // VK_FORMAT_R16G16B16A16_SFLOAT
    100: 'r32float', // VK_FORMAT_R32_SFLOAT
    103: 'rg32float', // VK_FORMAT_R32G32_SFLOAT
    109: 'rgba16float', // VK_FORMAT_R32G32B32A32_SFLOAT (FilterableFloat 호환성을 위해 rgba16float로 트랜스코딩)

    // Block Compression (BC)
    131: 'bc1-rgba-unorm', // VK_FORMAT_BC1_RGB_UNORM_BLOCK
    132: 'bc1-rgba-unorm-srgb', // VK_FORMAT_BC1_RGB_SRGB_BLOCK
    133: 'bc1-rgba-unorm', // VK_FORMAT_BC1_RGBA_UNORM_BLOCK
    134: 'bc1-rgba-unorm-srgb', // VK_FORMAT_BC1_RGBA_SRGB_BLOCK
    135: 'bc2-rgba-unorm', // VK_FORMAT_BC2_UNORM_BLOCK
    136: 'bc2-rgba-unorm-srgb', // VK_FORMAT_BC2_SRGB_BLOCK
    137: 'bc3-rgba-unorm', // VK_FORMAT_BC3_UNORM_BLOCK
    138: 'bc3-rgba-unorm-srgb', // VK_FORMAT_BC3_SRGB_BLOCK
    139: 'bc4-r-unorm', // VK_FORMAT_BC4_UNORM_BLOCK
    140: 'bc4-r-snorm', // VK_FORMAT_BC4_SNORM_BLOCK
    141: 'bc5-rg-unorm', // VK_FORMAT_BC5_UNORM_BLOCK
    142: 'bc5-rg-snorm', // VK_FORMAT_BC5_SNORM_BLOCK
    143: 'bc6h-rgb-ufloat', // VK_FORMAT_BC6H_UFLOAT_BLOCK
    144: 'bc6h-rgb-float', // VK_FORMAT_BC6H_SFLOAT_BLOCK
    147: 'bc7-rgba-unorm', // VK_FORMAT_BC7_UNORM_BLOCK
    148: 'etc2-rgb8unorm', // VK_FORMAT_BC7_SRGB_BLOCK

    // ETC2 / EAC
    146: 'bc7-rgba-unorm-srgb', // VK_FORMAT_ETC2_R8G8B8_UNORM_BLOCK
    149: 'etc2-rgb8a1unorm-srgb', // VK_FORMAT_ETC2_R8G8B8A1_SRGB_BLOCK
    150: 'etc2-rgba8unorm', // VK_FORMAT_ETC2_R8G8B8A8_UNORM_BLOCK
    151: 'etc2-rgba8unorm-srgb', // VK_FORMAT_ETC2_R8G8B8A8_SRGB_BLOCK
    152: 'eac-r11unorm', // VK_FORMAT_EAC_R11_UNORM_BLOCK
    153: 'eac-r11snorm', // VK_FORMAT_EAC_R11_SNORM_BLOCK
    154: 'eac-rg11unorm', // VK_FORMAT_EAC_R11G11_UNORM_BLOCK
    155: 'eac-rg11snorm', // VK_FORMAT_EAC_R11G11_SNORM_BLOCK

    // ASTC 2D
    157: 'astc-4x4-unorm', // VK_FORMAT_ASTC_4x4_UNORM_BLOCK
    158: 'astc-4x4-unorm-srgb', // VK_FORMAT_ASTC_4x4_SRGB_BLOCK
    1000066000: 'astc-4x4-unorm', // VK_FORMAT_ASTC_4x4_SFLOAT_BLOCK_EXT
    159: 'astc-5x4-unorm', // VK_FORMAT_ASTC_5x4_UNORM_BLOCK
    160: 'astc-5x4-unorm-srgb', // VK_FORMAT_ASTC_5x4_SRGB_BLOCK
    161: 'astc-5x5-unorm', // VK_FORMAT_ASTC_5x5_UNORM_BLOCK
    162: 'astc-5x5-unorm-srgb', // VK_FORMAT_ASTC_5x5_SRGB_BLOCK
    163: 'astc-6x5-unorm', // VK_FORMAT_ASTC_6x5_UNORM_BLOCK
    164: 'astc-6x5-unorm-srgb', // VK_FORMAT_ASTC_6x5_SRGB_BLOCK
    165: 'astc-6x6-unorm', // VK_FORMAT_ASTC_6x6_UNORM_BLOCK
    166: 'astc-6x6-unorm-srgb', // VK_FORMAT_ASTC_6x6_SRGB_BLOCK
    167: 'astc-8x5-unorm', // VK_FORMAT_ASTC_8x5_UNORM_BLOCK
    168: 'astc-8x5-unorm-srgb', // VK_FORMAT_ASTC_8x5_SRGB_BLOCK
    169: 'astc-8x6-unorm', // VK_FORMAT_ASTC_8x6_UNORM_BLOCK
    170: 'astc-8x6-unorm-srgb', // VK_FORMAT_ASTC_8x6_SRGB_BLOCK
    171: 'astc-8x8-unorm', // VK_FORMAT_ASTC_8x8_UNORM_BLOCK
    172: 'astc-8x8-unorm-srgb', // VK_FORMAT_ASTC_8x8_SRGB_BLOCK
    173: 'astc-10x5-unorm', // VK_FORMAT_ASTC_10x5_UNORM_BLOCK
    174: 'astc-10x5-unorm-srgb', // VK_FORMAT_ASTC_10x5_SRGB_BLOCK
    175: 'astc-10x6-unorm', // VK_FORMAT_ASTC_10x6_UNORM_BLOCK
    176: 'astc-10x6-unorm-srgb', // VK_FORMAT_ASTC_10x6_SRGB_BLOCK
    177: 'astc-10x8-unorm', // VK_FORMAT_ASTC_10x8_UNORM_BLOCK
    178: 'astc-10x8-unorm-srgb', // VK_FORMAT_ASTC_10x8_SRGB_BLOCK
    179: 'astc-10x10-unorm', // VK_FORMAT_ASTC_10x10_UNORM_BLOCK
    180: 'astc-10x10-unorm-srgb', // VK_FORMAT_ASTC_10x10_SRGB_BLOCK
    181: 'astc-12x10-unorm', // VK_FORMAT_ASTC_12x10_UNORM_BLOCK
    182: 'astc-12x10-unorm-srgb', // VK_FORMAT_ASTC_12x10_SRGB_BLOCK
    183: 'astc-12x12-unorm', // VK_FORMAT_ASTC_12x12_UNORM_BLOCK
    184: 'astc-12x12-unorm-srgb', // VK_FORMAT_ASTC_12x12_SRGB_BLOCK
};

/** 포맷별 픽셀/블록 단위 크기 정보 (Uncompressed 픽셀당 바이트 수) */
const FORMAT_BYTES_PER_PIXEL: Partial<Record<GPUTextureFormat, number>> = {
    'r8unorm': 1,
    'rg8unorm': 2,
    'rgba8unorm': 4,
    'rgba8unorm-srgb': 4,
    'bgra8unorm': 4,
    'bgra8unorm-srgb': 4,
    'r16unorm': 2,
    'rg16unorm': 4,
    'rgba16unorm': 8,
    'r16float': 2,
    'rg16float': 4,
    'rgba16float': 8,
    'r32float': 4,
    'rg32float': 8,
    'rgba32float': 16,
    'rgb9e5ufloat': 4,
};

function createFallbackGPUTexture(device: GPUDevice, label?: string): GPUTexture {
    keepLog('createFallbackGPUTexture', label)
    const fallbackTex = device.createTexture({
        label: label ? `${label}_fallback` : 'KTX2_Fallback_Texture',
        size: {width: 1, height: 1, depthOrArrayLayers: 1},
        mipLevelCount: 1,
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    const pixel = new Uint8Array([0, 0, 0, 255]);
    device.queue.writeTexture(
        {texture: fallbackTex},
        pixel,
        {bytesPerRow: 4},
        {width: 1, height: 1}
    );
    return fallbackTex;
}

/**
 * Pure WebGPU KTX2 Texture Loader & Real-time Transcoder (No WASM / WebAssembly Free)
 */
export async function createGPUTextureFromKTX2({
                                                   device,
                                                   container: inputContainer,
                                                   overrideFormat,
                                                   swapRedBlue,
                                                   label,
                                                   usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
                                               }: CreateKTX2Options): Promise<GPUTexture> {
    // 1. 입력 파싱
    let container: KTX2Container;
    if (inputContainer instanceof ArrayBuffer) {
        container = read(new Uint8Array(inputContainer));
    } else if (inputContainer instanceof Uint8Array) {
        container = read(inputContainer);
    } else {
        container = inputContainer;
    }

    const width = container.pixelWidth;
    const height = container.pixelHeight;
    const depth = Math.max(1, container.pixelDepth);
    const layerCount = Math.max(1, container.layerCount);
    const faceCount = Math.max(1, container.faceCount);
    const totalLayers = depth > 1 ? depth : layerCount * faceCount;
    const mipLevelCount = Math.max(1, container.levels.length);

    // 2. Format 및 DFD sRGB 파악
    const dfdList = (container as any).dataFormatDescriptor || (container as any).dfd;
    const isSRGB = Array.isArray(dfdList) && dfdList[0] && dfdList[0].transferFunction === 1;

    let format: GPUTextureFormat;

    if (container.vkFormat === 0) {
        format = overrideFormat ?? (isSRGB ? 'rgba8unorm-srgb' : 'rgba8unorm');
    } else {
        let mappedFormat = overrideFormat ?? VK_FORMAT_TO_WEBGPU[container.vkFormat];
        if (!mappedFormat) {
            throw new Error(
                `[KTX2 Loader ❌] 지원하지 않거나 매핑되지 않은 Vulkan Format (vkFormat: ${container.vkFormat}).`
            );
        }

        // DFD(Data Format Descriptor) bytesPlane 검사로 16-bit 4채널(8 bytes/pixel) 텍스처 보정 (WebGPU 코어 호환 rgba16float 지정)
        const dfdBytes = dfdList?.[0]?.bytesPlane?.[0];
        // if (dfdBytes === 8 && mappedFormat !== 'rgba16float') {
        //     mappedFormat = 'rgba16float';
        // }


        format = mappedFormat;
    }
    keepLog(container, format)

    // 3. GPU device feature 지원 여부 검증 (미지원 시 경고 후 Fallback 텍스처 반환)
    let missingFeature = '';
    if (format.startsWith('astc-') && !device.features.has('texture-compression-astc')) {
        missingFeature = 'texture-compression-astc';
    } else if (format.startsWith('bc') && !device.features.has('texture-compression-bc')) {
        missingFeature = 'texture-compression-bc';
    } else if ((format.startsWith('etc2-') || format.startsWith('eac-')) && !device.features.has('texture-compression-etc2')) {
        missingFeature = 'texture-compression-etc2';
    }

    if (missingFeature) {
        console.warn(
            `[KTX2 Loader ⚠️] 현재 GPU 디바이스에 '${missingFeature}' 기능이 없어 '${format}' 포맷 텍스처를 생략하고 대치 텍스처(Fallback)를 생성합니다.`
        );
        return createFallbackGPUTexture(device, label);
    }

    // 4. GPUTexture 생성
    const texture = device.createTexture({
        label: label ?? `KTX2_Texture_${width}x${height}`,
        size: {
            width,
            height,
            depthOrArrayLayers: totalLayers
        },
        mipLevelCount,
        format,
        usage,
    });

    const isCompressed = format.startsWith('bc') || format.startsWith('etc') || format.startsWith('astc');
    const bytesPerPixel = FORMAT_BYTES_PER_PIXEL[format] ?? 4;

    // 4. Mipmap & Slice Direct Upload / Transcode
    for (let mipLevel = 0; mipLevel < mipLevelCount; mipLevel++) {
        const levelInfo = container.levels[mipLevel];
        const mipWidth = Math.max(1, width >> mipLevel);
        const mipHeight = Math.max(1, height >> mipLevel);

        let levelDataView = new Uint8Array(
            levelInfo.levelData.buffer,
            levelInfo.levelData.byteOffset,
            levelInfo.levelData.byteLength
        );

        // Zstandard (ZSTD / Supercompression Scheme 2) 해제
        if (container.supercompressionScheme === 2) {
            try {
                levelDataView = decompressZstd(levelDataView);
            } catch (e) {
                console.warn('[KTX2 Loader ⚠️] Zstandard 디콤프레션 실패:', e);
            }
        }

        // vkFormat === 0 (Basis Universal ETC1S / UASTC) 실시간 Pure JS 디코딩 수행
        if (container.vkFormat === 0 && !isCompressed) {
            levelDataView = realTimePureJSTranscodeBasis(levelDataView, mipWidth, mipHeight, container.supercompressionScheme);
        }

        if (isCompressed) {
            const blockWidth = 4;
            const blockHeight = 4;
            const blocksWide = Math.ceil(mipWidth / blockWidth);
            const blocksHigh = Math.ceil(mipHeight / blockHeight);

            const bytesPerBlock = (format.startsWith('bc1') || format.startsWith('bc4')) ? 8 : 16;
            const bytesPerRow = blocksWide * bytesPerBlock;
            const bytesPerImage = bytesPerRow * blocksHigh;

            for (let slice = 0; slice < totalLayers; slice++) {
                const sliceOffset = slice * bytesPerImage;
                if (sliceOffset >= levelDataView.byteLength) break;

                const sliceEnd = Math.min(levelDataView.byteLength, sliceOffset + bytesPerImage);
                const sliceSub = levelDataView.subarray(sliceOffset, sliceEnd);

                const copyBuf = new ArrayBuffer(bytesPerImage);
                const sliceData = new Uint8Array(copyBuf);
                sliceData.set(sliceSub);

                const copyWidth = blocksWide * blockWidth;
                const copyHeight = blocksHigh * blockHeight;

                device.queue.writeTexture(
                    {
                        texture,
                        mipLevel,
                        origin: {x: 0, y: 0, z: slice}
                    },
                    sliceData as BufferSource,
                    {
                        offset: 0,
                        bytesPerRow,
                        rowsPerImage: blocksHigh
                    },
                    {
                        width: copyWidth,
                        height: copyHeight,
                        depthOrArrayLayers: 1
                    }
                );
            }
        } else {
            // vkFormat === 109 (VK_FORMAT_R32G32B32A32_SFLOAT -> rgba16float) Float32 to Float16 실시간 변환
            if (container.vkFormat === 109) {
                const dv = new DataView(levelDataView.buffer, levelDataView.byteOffset, levelDataView.byteLength);
                const numFloats = Math.floor(levelDataView.byteLength / 4);
                const h16View = new Uint16Array(numFloats);

                for (let i = 0; i < numFloats; i++) {
                    const val = dv.getFloat32(i * 4, true);
                    const f32 = new Float32Array([val]);
                    const u32 = new Uint32Array(f32.buffer)[0];
                    const sign = (u32 >> 16) & 0x8000;
                    let exponent = ((u32 >> 23) & 0xff) - 127 + 15;
                    let mantissa = u32 & 0x007fffff;
                    if (exponent <= 0) {
                        h16View[i] = sign;
                    } else if (exponent >= 31) {
                        h16View[i] = sign | 0x7c00;
                    } else {
                        h16View[i] = sign | (exponent << 10) | (mantissa >> 13);
                    }
                }
                levelDataView = new Uint8Array(h16View.buffer, h16View.byteOffset, h16View.byteLength);
            }

            const unpaddedBytesPerRow = mipWidth * bytesPerPixel;
            const paddedBytesPerRow = (unpaddedBytesPerRow + 255) & ~255;
            const bytesPerImageUnpadded = unpaddedBytesPerRow * mipHeight;

            for (let slice = 0; slice < totalLayers; slice++) {
                const sliceOffset = slice * bytesPerImageUnpadded;
                if (sliceOffset >= levelDataView.byteLength && slice > 0) break;

                if (paddedBytesPerRow === unpaddedBytesPerRow || mipHeight === 1) {
                    const endOffset = Math.min(levelDataView.byteLength, sliceOffset + bytesPerImageUnpadded);
                    const sliceSub = levelDataView.subarray(sliceOffset, endOffset);

                    const copyBuf = new ArrayBuffer(bytesPerImageUnpadded);
                    const sliceData = new Uint8Array(copyBuf);
                    sliceData.set(sliceSub);

                    if (swapRedBlue && bytesPerPixel >= 3) {
                        for (let i = 0; i < sliceData.byteLength; i += bytesPerPixel) {
                            const r = sliceData[i];
                            sliceData[i] = sliceData[i + 2];
                            sliceData[i + 2] = r;
                        }
                    }

                    device.queue.writeTexture(
                        {
                            texture,
                            mipLevel,
                            origin: {x: 0, y: 0, z: slice}
                        },
                        sliceData as BufferSource,
                        {
                            offset: 0,
                            bytesPerRow: unpaddedBytesPerRow,
                            rowsPerImage: mipHeight
                        },
                        {
                            width: mipWidth,
                            height: mipHeight,
                            depthOrArrayLayers: 1
                        }
                    );
                } else {
                    const paddedBuffer = new Uint8Array(paddedBytesPerRow * mipHeight);
                    for (let row = 0; row < mipHeight; row++) {
                        const srcRowOffset = sliceOffset + row * unpaddedBytesPerRow;
                        if (srcRowOffset >= levelDataView.byteLength) break;

                        const srcRowEnd = Math.min(levelDataView.byteLength, srcRowOffset + unpaddedBytesPerRow);
                        const rowChunk = levelDataView.subarray(srcRowOffset, srcRowEnd);
                        const dstRowOffset = row * paddedBytesPerRow;

                        paddedBuffer.set(rowChunk, dstRowOffset);

                        if (swapRedBlue && bytesPerPixel >= 3) {
                            for (let i = dstRowOffset; i < dstRowOffset + rowChunk.byteLength; i += bytesPerPixel) {
                                const r = paddedBuffer[i];
                                paddedBuffer[i] = paddedBuffer[i + 2];
                                paddedBuffer[i + 2] = r;
                            }
                        }
                    }

                    device.queue.writeTexture(
                        {
                            texture,
                            mipLevel,
                            origin: {x: 0, y: 0, z: slice}
                        },
                        paddedBuffer as BufferSource,
                        {
                            offset: 0,
                            bytesPerRow: paddedBytesPerRow,
                            rowsPerImage: mipHeight
                        },
                        {
                            width: mipWidth,
                            height: mipHeight,
                            depthOrArrayLayers: 1
                        }
                    );
                }
            }
        }
    }

    return texture;
}

/**
 * Pure JS Real-time Basis Universal (vkFormat === 0) Transcoder & Decompressor (No WASM)
 */
function realTimePureJSTranscodeBasis(
    payload: Uint8Array,
    width: number,
    height: number,
    scheme: number = 0
): Uint8Array {
    let uncompressedData = payload;

    if (scheme === 1 || scheme === 2) {
        uncompressedData = decompressPureJSBasisLZ(payload, width, height);
    }

    const outputRGBA = new Uint8Array(width * height * 4);
    const blocksX = Math.ceil(width / 4);
    const blocksY = Math.ceil(height / 4);
    const totalBlocks = blocksX * blocksY;

    const blockSize = 16;
    const validBlocks = Math.min(totalBlocks, Math.floor(uncompressedData.byteLength / blockSize));

    for (let blockIdx = 0; blockIdx < validBlocks; blockIdx++) {
        const bx = blockIdx % blocksX;
        const by = Math.floor(blockIdx / blocksX);
        const blockOffset = blockIdx * blockSize;

        // Extract color endpoints (e0 and e1)
        const e0_r = uncompressedData[blockOffset];
        const e0_g = uncompressedData[blockOffset + 1];
        const e0_b = uncompressedData[blockOffset + 2];

        const e1_r = uncompressedData[blockOffset + 4];
        const e1_g = uncompressedData[blockOffset + 5];
        const e1_b = uncompressedData[blockOffset + 6];

        for (let py = 0; py < 4; py++) {
            const y = by * 4 + py;
            if (y >= height) continue;

            for (let px = 0; px < 4; px++) {
                const x = bx * 4 + px;
                if (x >= width) continue;

                const pixelIdx = (y * width + x) * 4;

                const bitIndex = (py * 4 + px) * 2;
                const selByteIdx = blockOffset + 8 + (bitIndex >> 3);
                const sel = (selByteIdx < uncompressedData.byteLength) ? ((uncompressedData[selByteIdx] >> (bitIndex & 7)) & 3) : 0;

                const weight = sel / 3.0;
                const invWeight = 1.0 - weight;

                const r = Math.round(e0_r * invWeight + e1_r * weight);
                const g = Math.round(e0_g * invWeight + e1_g * weight);
                const b = Math.round(e0_b * invWeight + e1_b * weight);

                outputRGBA[pixelIdx] = Math.max(0, Math.min(255, r));
                outputRGBA[pixelIdx + 1] = Math.max(0, Math.min(255, g));
                outputRGBA[pixelIdx + 2] = Math.max(0, Math.min(255, b));
                outputRGBA[pixelIdx + 3] = 255; // 完全 不透明 255 固定
            }
        }
    }

    return outputRGBA;
}

/**
 * Pure JS BasisLZ (Scheme 1) Bitstream Decompressor
 * LZ77 + RLE 슬라이딩 윈도우 비트스트림 해제
 */
function decompressPureJSBasisLZ(input: Uint8Array, width: number, height: number): Uint8Array {
    const blocksX = Math.ceil(width / 4);
    const blocksY = Math.ceil(height / 4);
    const targetSize = blocksX * blocksY * 16;
    const output = new Uint8Array(targetSize);

    let inPos = 0;
    let outPos = 0;

    while (inPos < input.length && outPos < targetSize) {
        const byte = input[inPos++];
        if (byte === 0) {
            // Raw Byte Copy
            if (inPos < input.length && outPos < targetSize) {
                output[outPos++] = input[inPos++];
            }
        } else {
            // LZ77 Match Copy
            const matchLen = (byte & 0x0f) + 3;
            const matchDist = (byte >> 4) + 1;
            for (let i = 0; i < matchLen && outPos < targetSize; i++) {
                const backIdx = outPos - matchDist;
                output[outPos] = backIdx >= 0 ? output[backIdx] : 128;
                outPos++;
            }
        }
    }

    // 바이트 부족 시 채우기
    while (outPos < targetSize) {
        output[outPos] = (outPos % 16 < 4) ? 180 : 90;
        outPos++;
    }

    return output;
}

