import {KTX2Container, read} from 'ktx-parse';
import {decompress as decompressZstd} from 'fzstd';
import keepLog from "../../keepLog";

const BASIS_JS_CDN_URL = 'https://unpkg.com/three@latest/examples/jsm/libs/basis/basis_transcoder.js';
const BASIS_WASM_CDN_URL = 'https://unpkg.com/three@latest/examples/jsm/libs/basis/basis_transcoder.wasm';

export interface CreateKTX2Options {
    device: GPUDevice;
    /**
     * KTX2 파일 URL(string), 바이너리(ArrayBuffer / Uint8Array), 또는 파싱된 KTX2Container
     */
    container: string | KTX2Container | ArrayBuffer | Uint8Array;
    /** Red 채널과 Blue 채널 스와이프(Swizzle) 여부 (BGRA <-> RGBA 색상 반전 보정) */
    swapRedBlue?: boolean;
    /** 디버깅을 위한 GPU 리소스 라벨 */
    label?: string;
    /** 추가적인 GPUTextureUsage 플래그 (기본: TEXTURE_BINDING | COPY_DST) */
    usage?: GPUTextureUsageFlags;
}

/** Basis Universal WASM Singleton 인스턴스 관리 */
let basisTranscoderPromise: Promise<any> | null = null;
let basisModule: any = null;

async function initBasisTranscoder(): Promise<any> {
    if (basisModule) return basisModule;
    if (!basisTranscoderPromise) {
        basisTranscoderPromise = (async () => {
            let BASIS = (window as any).BASIS;

            if (typeof BASIS !== 'function') {
                await new Promise<void>((resolve, reject) => {
                    const existingScript = document.querySelector(`script[src="${BASIS_JS_CDN_URL}"]`);
                    if (existingScript) {
                        existingScript.addEventListener('load', () => resolve());
                        existingScript.addEventListener('error', (e) => reject(e));
                        return;
                    }

                    const script = document.createElement('script');
                    script.src = BASIS_JS_CDN_URL;
                    script.async = true;
                    script.onload = () => resolve();
                    script.onerror = (err) => reject(new Error(`[KTX2 Loader ❌] basis_transcoder.js 스크립트 로드 실패: ${BASIS_JS_CDN_URL}`));
                    document.head.appendChild(script);
                });

                BASIS = (window as any).BASIS;
            }

            if (typeof BASIS !== 'function') {
                throw new Error('[KTX2 Loader ❌] window.BASIS 트랜스코더 함수를 찾을 수 없습니다.');
            }

            const module = await BASIS({
                locateFile: (path: string) => {
                    if (path.endsWith('.wasm')) {
                        return BASIS_WASM_CDN_URL;
                    }
                    return path;
                }
            });

            module.initializeBasis();
            basisModule = module;
            return module;
        })();
    }
    return basisTranscoderPromise;
}

/**
 * Vulkan Format ID -> WebGPU GPUTextureFormat 매핑 테이블
 */
const VK_FORMAT_TO_WEBGPU: Record<number, GPUTextureFormat> = {
    // 8-bit Unorm / Srgb
    9: 'r8unorm',
    16: 'rg8unorm',
    23: 'rgba8unorm',
    29: 'rgba8unorm-srgb',
    37: 'rgba8unorm',
    43: 'rgba8unorm-srgb',
    44: 'bgra8unorm',
    50: 'bgra8unorm-srgb',

    // 16-bit Unorm / Snorm
    70: 'r16snorm',
    76: 'r16float',
    77: 'rg16unorm',
    91: 'rgba16float',

    // Packed Float & Special Float Formats
    122: 'rg11b10ufloat',
    123: 'rgb9e5ufloat',

    // 16-bit / 32-bit Float
    83: 'rg16float',
    97: 'rgba16float',
    100: 'r32float',
    103: 'rg32float',
    109: 'rgba16float',

    // Block Compression - BC
    131: 'bc1-rgba-unorm',
    132: 'bc1-rgba-unorm-srgb',
    133: 'bc1-rgba-unorm',
    134: 'bc1-rgba-unorm-srgb',
    135: 'bc2-rgba-unorm',
    136: 'bc2-rgba-unorm-srgb',
    137: 'bc3-rgba-unorm',
    138: 'bc3-rgba-unorm-srgb',
    139: 'bc4-r-unorm',
    140: 'bc4-r-snorm',
    141: 'bc5-rg-unorm',
    142: 'bc5-rg-snorm',
    143: 'bc6h-rgb-ufloat',
    144: 'bc6h-rgb-float',
    145: 'bc7-rgba-unorm',
    146: 'bc7-rgba-unorm-srgb',

    // Block Compression - ETC2 / EAC
    147: 'etc2-rgb8unorm',
    148: 'etc2-rgb8unorm-srgb',
    149: 'etc2-rgb8a1unorm',
    150: 'etc2-rgb8a1unorm-srgb',
    151: 'etc2-rgba8unorm',
    152: 'etc2-rgba8unorm-srgb',
    153: 'eac-r11unorm',
    154: 'eac-r11snorm',
    155: 'eac-rg11unorm',
    156: 'eac-rg11snorm',

    // Block Compression - ASTC 2D
    157: 'astc-4x4-unorm',
    158: 'astc-4x4-unorm-srgb',
    159: 'astc-5x4-unorm',
    160: 'astc-5x4-unorm-srgb',
    161: 'astc-5x5-unorm',
    162: 'astc-5x5-unorm-srgb',
    163: 'astc-6x5-unorm',
    164: 'astc-6x5-unorm-srgb',
    165: 'astc-6x6-unorm',
    166: 'astc-6x6-unorm-srgb',
    167: 'astc-8x5-unorm',
    168: 'astc-8x5-unorm-srgb',
    169: 'astc-8x6-unorm',
    170: 'astc-8x6-unorm-srgb',
    171: 'astc-8x8-unorm',
    172: 'astc-8x8-unorm-srgb',
    173: 'astc-10x5-unorm',
    174: 'astc-10x5-unorm-srgb',
    175: 'astc-10x6-unorm',
    176: 'astc-10x6-unorm-srgb',
    177: 'astc-10x8-unorm',
    178: 'astc-10x8-unorm-srgb',
    179: 'astc-10x10-unorm',
    180: 'astc-10x10-unorm-srgb',
    181: 'astc-12x10-unorm',
    182: 'astc-12x10-unorm-srgb',
    183: 'astc-12x12-unorm',
    184: 'astc-12x12-unorm-srgb',
    1000066000: 'astc-4x4-unorm',
};

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

function createFallbackGPUTexture(device: GPUDevice, label?: string, vkFormat?: any): GPUTexture {
    keepLog('createFallbackGPUTexture', label);
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
    //@ts-ignore
    fallbackTex.ktxInfo = {
        vkFormat: vkFormat,
        vkFormatName: VK_FORMAT_TO_WEBGPU[vkFormat ?? 0],
    };
    return fallbackTex;
}

export async function createGPUTextureFromKTX2({
                                                   device,
                                                   container: inputContainer,
                                                   swapRedBlue,
                                                   label,
                                                   usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
                                               }: CreateKTX2Options): Promise<GPUTexture> {

    let rawBuffer: Uint8Array | null = null;
    let container: KTX2Container;

    // ✨ 1. 사전처리: 독립된 순수 ArrayBuffer 사본 분리 추출 (Offset 오염 방지)
    if (typeof inputContainer === 'string') {
        const response = await fetch(inputContainer);
        if (!response.ok) {
            throw new Error(`[KTX2 Loader ❌] KTX2 파일 로드 실패 (${response.status}): ${inputContainer}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        rawBuffer = new Uint8Array(arrayBuffer);
        container = read(rawBuffer);
    } else if (inputContainer instanceof ArrayBuffer) {
        rawBuffer = new Uint8Array(inputContainer.slice(0));
        container = read(rawBuffer);
    } else if (inputContainer instanceof Uint8Array) {
        // Uint8Array의 Subarray/View 오프셋을 잘라내어 0부터 시작하는 사본 생성
        rawBuffer = inputContainer.slice(0);
        container = read(rawBuffer);
    } else {
        container = inputContainer;
        if ((container as any)._rawBuffer) {
            const b = (container as any)._rawBuffer;
            const srcView = new Uint8Array(b.buffer || b, b.byteOffset || 0, b.byteLength);
            rawBuffer = srcView.slice(0);
        } else {
            throw new Error('[KTX2 Loader ❌] KTX2Container 파싱용 rawBuffer가 필요합니다.');
        }
    }

    const width = container.pixelWidth;
    const height = container.pixelHeight;
    const depth = Math.max(1, container.pixelDepth);
    const layerCount = Math.max(1, container.layerCount);
    const faceCount = Math.max(1, container.faceCount);
    const totalLayers = depth > 1 ? depth : layerCount * faceCount;
    const mipLevelCount = Math.max(1, container.levels.length);

    const dfdList = (container as any).dataFormatDescriptor || (container as any).dfd;
    let format: GPUTextureFormat;
    let isBasisTranscoded = false;
    let ktx2FileInstance: any = null;
    let basisTargetFormatEnum: number = 0;

    // 2. Format 판단 및 Basis WASM 초기화
    if (container.vkFormat === 0) {
        const Module = await initBasisTranscoder();

        // 파싱 전용 완전한 독립 rawBuffer 넘기기
        ktx2FileInstance = new Module.KTX2File(rawBuffer);

        if (!ktx2FileInstance.isValid() || !ktx2FileInstance.startTranscoding()) {
            if (ktx2FileInstance) {
                ktx2FileInstance.close();
                ktx2FileInstance.delete();
            }
            throw new Error('[KTX2 Loader ❌] Basis Transcoder 초기화 실패');
        }

        const isUASTC = ktx2FileInstance.isUASTC();
        const hasAlpha = ktx2FileInstance.getHasAlpha();
        const isSRGB = typeof ktx2FileInstance.isSRGB === 'function'
            ? ktx2FileInstance.isSRGB()
            : (Array.isArray(dfdList) && dfdList[0] && dfdList[0].transferFunction === 1);

        const hasASTC = device.features.has('texture-compression-astc');
        const hasBC = device.features.has('texture-compression-bc');
        const hasETC2 = device.features.has('texture-compression-etc2');

        // Three.js 스펙 타겟 선택
        if (isUASTC) {
            if (hasASTC) {
                format = isSRGB ? 'astc-4x4-unorm-srgb' : 'astc-4x4-unorm';
                basisTargetFormatEnum = Module.transcoder_texture_format.cTFASTC_4x4;
            } else if (hasBC) {
                format = isSRGB ? 'bc7-rgba-unorm-srgb' : 'bc7-rgba-unorm';
                basisTargetFormatEnum = Module.transcoder_texture_format.cTFBC7_M5;
            } else if (hasETC2) {
                format = isSRGB ? 'etc2-rgba8unorm-srgb' : 'etc2-rgba8unorm';
                basisTargetFormatEnum = Module.transcoder_texture_format.cTFETC2_RGBA;
            } else {
                format = isSRGB ? 'rgba8unorm-srgb' : 'rgba8unorm';
                basisTargetFormatEnum = Module.transcoder_texture_format.cTFRGBA32;
            }
        } else {
            // ETC1S (2d_etc1s.ktx2)
            if (hasASTC) {
                format = isSRGB ? 'astc-4x4-unorm-srgb' : 'astc-4x4-unorm';
                basisTargetFormatEnum = Module.transcoder_texture_format.cTFASTC_4x4;
            } else if (hasBC) {
                if (hasAlpha) {
                    format = isSRGB ? 'bc3-rgba-unorm-srgb' : 'bc3-rgba-unorm';
                    basisTargetFormatEnum = Module.transcoder_texture_format.cTFBC3;
                } else {
                    format = isSRGB ? 'bc1-rgba-unorm-srgb' : 'bc1-rgba-unorm';
                    basisTargetFormatEnum = Module.transcoder_texture_format.cTFBC1;
                }
            } else if (hasETC2) {
                if (hasAlpha) {
                    format = isSRGB ? 'etc2-rgba8unorm-srgb' : 'etc2-rgba8unorm';
                    basisTargetFormatEnum = Module.transcoder_texture_format.cTFETC2_RGBA;
                } else {
                    format = isSRGB ? 'etc2-rgb8unorm-srgb' : 'etc2-rgb8unorm';
                    basisTargetFormatEnum = Module.transcoder_texture_format.cTFETC1;
                }
            } else {
                format = isSRGB ? 'rgba8unorm-srgb' : 'rgba8unorm';
                basisTargetFormatEnum = Module.transcoder_texture_format.cTFRGBA32;
            }
        }

        isBasisTranscoded = true;
    } else {
        const mappedFormat = VK_FORMAT_TO_WEBGPU[container.vkFormat];
        if (mappedFormat) {
            format = mappedFormat;
        } else {
            format = `${navigator.gpu.getPreferredCanvasFormat()}-srgb` as GPUTextureFormat;
        }
    }

    keepLog(container, format);

    // 3. GPU device feature 검증
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
        if (ktx2FileInstance) {
            ktx2FileInstance.close();
            ktx2FileInstance.delete();
        }
        return createFallbackGPUTexture(device, label, container.vkFormat);
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

    const isCompressed = format.startsWith('bc') || format.startsWith('etc') || format.startsWith('astc') || format.startsWith('eac');
    const bytesPerPixel = FORMAT_BYTES_PER_PIXEL[format] ?? 4;

    try {
        // 5. Mipmap & Layer 업로드
        for (let mipLevel = 0; mipLevel < mipLevelCount; mipLevel++) {
            const mipWidth = Math.max(1, width >> mipLevel);
            const mipHeight = Math.max(1, height >> mipLevel);

            if (isBasisTranscoded) {
                for (let slice = 0; slice < totalLayers; slice++) {
                    const layerIdx = depth > 1 ? 0 : slice;
                    const faceIdx = faceCount === 6 ? slice % 6 : 0;

                    const imageSize = ktx2FileInstance.getImageTranscodedSizeInBytes(
                        mipLevel, layerIdx, faceIdx, basisTargetFormatEnum
                    );
                    const transcodedBuffer = new Uint8Array(imageSize);

                    const success = ktx2FileInstance.transcodeImage(
                        transcodedBuffer,
                        mipLevel,
                        layerIdx,
                        faceIdx,
                        basisTargetFormatEnum,
                        0, -1, -1
                    );

                    if (!success) {
                        throw new Error(`[KTX2 Transcode ❌] Mip: ${mipLevel}, Slice: ${slice} 트랜스코딩 실패.`);
                    }

                    if (isCompressed) {
                        let blockWidth = 4;
                        let blockHeight = 4;

                        if (format.startsWith('astc-')) {
                            const parts = format.split('-');
                            const dims = parts[1].split('x');
                            blockWidth = parseInt(dims[0], 10);
                            blockHeight = parseInt(dims[1], 10);
                        }

                        const blocksWide = Math.ceil(mipWidth / blockWidth);
                        const blocksHigh = Math.ceil(mipHeight / blockHeight);

                        const bytesPerBlock = (format.startsWith('bc1') || format.startsWith('bc4')) ? 8 : 16;
                        const bytesPerRow = blocksWide * bytesPerBlock;
                        const requiredSize = bytesPerRow * blocksHigh;

                        let uploadBuffer = transcodedBuffer;
                        if (transcodedBuffer.byteLength < requiredSize) {
                            const paddedBuf = new Uint8Array(requiredSize);
                            paddedBuf.set(transcodedBuffer);
                            uploadBuffer = paddedBuf;
                        }

                        device.queue.writeTexture(
                            {
                                texture,
                                mipLevel,
                                origin: {x: 0, y: 0, z: slice}
                            },
                            uploadBuffer,
                            {
                                offset: 0,
                                bytesPerRow: bytesPerRow,
                                rowsPerImage: blocksHigh
                            },
                            {
                                width: blocksWide * blockWidth,
                                height: blocksHigh * blockHeight,
                                depthOrArrayLayers: 1
                            }
                        );
                    } else {
                        // RGBA32 Uncompressed 업로드
                        const unpaddedBytesPerRow = mipWidth * 4;
                        const paddedBytesPerRow = (unpaddedBytesPerRow + 255) & ~255;

                        if (unpaddedBytesPerRow % 256 === 0 || mipHeight === 1) {
                            device.queue.writeTexture(
                                {
                                    texture,
                                    mipLevel,
                                    origin: {x: 0, y: 0, z: slice}
                                },
                                transcodedBuffer,
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
                                const srcRow = transcodedBuffer.subarray(row * unpaddedBytesPerRow, (row + 1) * unpaddedBytesPerRow);
                                paddedBuffer.set(srcRow, row * paddedBytesPerRow);
                            }
                            device.queue.writeTexture(
                                {
                                    texture,
                                    mipLevel,
                                    origin: {x: 0, y: 0, z: slice}
                                },
                                paddedBuffer,
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
            } else {
                // Raw KTX2 (사전 압축 / 비압축 KTX2) 사전처리
                const levelInfo = container.levels[mipLevel];
                let levelDataView = new Uint8Array(
                    levelInfo.levelData.buffer,
                    levelInfo.levelData.byteOffset,
                    levelInfo.levelData.byteLength
                );

                // ✨ 사전처리: Zstandard 수퍼컴프레션 사전 디코딩
                if (container.supercompressionScheme === 2) {
                    try {
                        levelDataView = decompressZstd(levelDataView);
                    } catch (e) {
                        console.warn('[KTX2 Loader ⚠️] Zstandard 디콤프레션 실패:', e);
                    }
                }

                if (isCompressed) {
                    let blockWidth = 4;
                    let blockHeight = 4;

                    if (format.startsWith('astc-')) {
                        const parts = format.split('-');
                        const dims = parts[1].split('x');
                        blockWidth = parseInt(dims[0], 10);
                        blockHeight = parseInt(dims[1], 10);
                    }

                    const blocksWide = Math.ceil(mipWidth / blockWidth);
                    const blocksHigh = Math.ceil(mipHeight / blockHeight);

                    const bytesPerBlock = (format.startsWith('bc1') || format.startsWith('bc4')) ? 8 : 16;
                    const bytesPerRow = blocksWide * bytesPerBlock;
                    const bytesPerImage = bytesPerRow * blocksHigh;

                    for (let slice = 0; slice < totalLayers; slice++) {
                        const sliceOffset = slice * bytesPerImage;
                        if (sliceOffset >= levelDataView.byteLength) break;

                        const sliceSub = levelDataView.subarray(
                            sliceOffset,
                            Math.min(levelDataView.byteLength, sliceOffset + bytesPerImage)
                        );

                        const uploadBuf = new Uint8Array(bytesPerImage);
                        uploadBuf.set(sliceSub);

                        device.queue.writeTexture(
                            {
                                texture,
                                mipLevel,
                                origin: {x: 0, y: 0, z: slice}
                            },
                            uploadBuf,
                            {
                                offset: 0,
                                bytesPerRow: bytesPerRow,
                                rowsPerImage: blocksHigh
                            },
                            {
                                width: blocksWide * blockWidth,
                                height: blocksHigh * blockHeight,
                                depthOrArrayLayers: 1
                            }
                        );
                    }
                } else {
                    // ✨ 사전처리: RGB -> RGBA 4채널 보정
                    if (container.vkFormat === 23 || container.vkFormat === 29) {
                        const totalPixels = mipWidth * mipHeight * totalLayers;
                        const rgbaView = new Uint8Array(totalPixels * 4);
                        for (let i = 0; i < totalPixels; i++) {
                            const srcIdx = i * 3;
                            const dstIdx = i * 4;
                            if (srcIdx + 2 < levelDataView.byteLength) {
                                rgbaView[dstIdx + 0] = levelDataView[srcIdx + 0];
                                rgbaView[dstIdx + 1] = levelDataView[srcIdx + 1];
                                rgbaView[dstIdx + 2] = levelDataView[srcIdx + 2];
                                rgbaView[dstIdx + 3] = 255;
                            }
                        }
                        levelDataView = rgbaView;
                    }

                    // Float16/32 변환 사전처리
                    if (container.vkFormat === 91 || container.vkFormat === 109) {
                        const dv = new DataView(levelDataView.buffer, levelDataView.byteOffset, levelDataView.byteLength);
                        const numFloats = Math.floor(levelDataView.byteLength / (container.vkFormat === 91 ? 2 : 4));
                        const h16View = new Uint16Array(numFloats);

                        for (let i = 0; i < numFloats; i++) {
                            const val = container.vkFormat === 91 ? dv.getUint16(i * 2, true) / 65535.0 : dv.getFloat32(i * 4, true);
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

                        if (unpaddedBytesPerRow % 256 === 0 || mipHeight === 1) {
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
        }
    } finally {
        if (ktx2FileInstance) {
            ktx2FileInstance.close();
            ktx2FileInstance.delete();
        }
    }

    //@ts-ignore
    texture.ktxInfo = {
        vkFormat: container.vkFormat,
        vkFormatName: VK_FORMAT_TO_WEBGPU[container.vkFormat ?? 0],
    };
    return texture;
}