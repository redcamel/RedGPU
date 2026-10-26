import {KTX2Container, read} from 'ktx-parse';
import {decompress as decompressZstd} from 'fzstd';
import keepLog from "../../keepLog";

const BASIS_JS_CDN_URL = 'https://unpkg.com/three@latest/examples/jsm/libs/basis/basis_transcoder.js';
const BASIS_WASM_CDN_URL = 'https://unpkg.com/three@latest/examples/jsm/libs/basis/basis_transcoder.wasm';

/**
 * [KO] KTX2 텍스처 생성을 위한 옵션 인터페이스입니다.
 * [EN] Options interface for creating a `GPUTexture` from KTX2 data.
 *
 * @category Texture
 */
export interface CreateKTX2Options {
    /**
     * [KO] WebGPU 디바이스(`GPUDevice`) 인스턴스
     * [EN] WebGPU device (`GPUDevice`) instance
     */
    device: GPUDevice;
    /**
     * [KO] KTX2 파일 경로(URL), `KTX2Container`, `ArrayBuffer`, 또는 `Uint8Array` 데이터
     * [EN] KTX2 file path (URL), `KTX2Container`, `ArrayBuffer`, or `Uint8Array` data
     */
    container: string | KTX2Container | ArrayBuffer | Uint8Array;
    /**
     * [KO] R 채널과 B 채널 스왑 여부
     * [EN] Whether to swap red and blue channels
     */
    swapRedBlue?: boolean;
    /**
     * [KO] 생성될 `GPUTexture`의 디버그 라벨
     * [EN] Debug label for the created `GPUTexture`
     */
    label?: string;
    /**
     * [KO] `GPUTexture` 사용 플래그(`GPUTextureUsageFlags`)
     * [EN] `GPUTexture` usage flags (`GPUTextureUsageFlags`)
     */
    usage?: GPUTextureUsageFlags;
}

/**
 * [KO] KTX2 컨테이너의 Key-Value 영역에서 추출된 메타데이터 인터페이스입니다.
 * [EN] Interface representing metadata extracted from the Key-Value section of a KTX2 container.
 *
 * @category Texture
 */
export interface KTX2Metadata {
    /**
     * [KO] KTX2 작성 도구 정보 (`KTXwriter`)
     * [EN] KTX2 writer tool information (`KTXwriter`)
     */
    writer?: string;
    /**
     * [KO] 텍스처 방향 정보 (`KTXorientation`)
     * [EN] Texture orientation information (`KTXorientation`)
     */
    orientation?: string;
    /**
     * [KO] 채널 스위즐 정보 (`KTXswizzle`)
     * [EN] Channel swizzle information (`KTXswizzle`)
     */
    swizzle?: string;
    /**
     * [KO] 노출값 메타데이터
     * [EN] Exposure metadata value
     */
    exposure?: number;
    /**
     * [KO] 톤매핑 메타데이터
     * [EN] Tonemapping metadata value
     */
    tonemapping?: number;
    /**
     * [KO] HDR 색상 원색(Primaries) 식별값
     * [EN] HDR color primaries identifier
     */
    hdrColorPrimaries?: number;
    /**
     * [KO] HDR 전송 함수(Transfer Function) 식별값
     * [EN] HDR transfer function identifier
     */
    hdrTransferFunction?: number;
    /**
     * [KO] 원본 Key-Value 맵 데이터 (`Record<string, string | Uint8Array>`)
     * [EN] Raw Key-Value map data (`Record<string, string | Uint8Array>`)
     */
    raw: Record<string, string | Uint8Array>;
}

function parseKTX2Metadata(container: KTX2Container): KTX2Metadata {
    const kv = container.keyValue ?? {};
    const raw: Record<string, string | Uint8Array> = {};

    const getString = (key: string): string | undefined => {
        const val = kv[key];
        if (val === undefined) return undefined;
        if (typeof val === 'string') {
            raw[key] = val;
            return val.replace(/\0+$/, '');
        }
        const str = new TextDecoder('utf-8').decode(val).replace(/\0+$/, '');
        raw[key] = val;
        return str;
    };

    const getFloat = (key: string): number | undefined => {
        const str = getString(key);
        if (str === undefined) return undefined;
        const n = parseFloat(str);
        return isNaN(n) ? undefined : n;
    };

    const getInt = (key: string): number | undefined => {
        const str = getString(key);
        if (str === undefined) return undefined;
        const n = parseInt(str, 10);
        return isNaN(n) ? undefined : n;
    };

    for (const key of Object.keys(kv)) {
        if (!raw[key]) raw[key] = kv[key];
    }

    let hdrColorPrimaries: number | undefined;
    let hdrTransferFunction: number | undefined;
    const hdrColorSpaceStr = getString('KHRhdrColorSpace');
    if (hdrColorSpaceStr) {
        const parts = hdrColorSpaceStr.trim().split(/\s+/);
        if (parts.length >= 2) {
            hdrColorPrimaries = parseInt(parts[0], 10);
            hdrTransferFunction = parseInt(parts[1], 10);
        }
    }

    return {
        writer: getString('KTXwriter'),
        orientation: getString('KTXorientation'),
        swizzle: getString('KTXswizzle'),
        exposure: getFloat('KHRexposure'),
        tonemapping: getInt('KHRtonemapping'),
        hdrColorPrimaries,
        hdrTransferFunction,
        raw,
    };
}

function parseWriterVersion(writerStr?: string): { name: string; major: number; minor: number } | null {
    if (!writerStr) return null;
    const match = writerStr.match(/(toktx|libktx|basisu)[_\s\/-]*v?(\d+)\.(\d+)/i);
    if (!match) return null;
    return {
        name: match[1].toLowerCase(),
        major: parseInt(match[2], 10),
        minor: parseInt(match[3], 10)
    };
}

function detectIsLegacyKTX2(container: KTX2Container, metadata: KTX2Metadata): {
    isLegacy: boolean;
    legacyReason?: string
} {
    const dfdList = (container as any).dataFormatDescriptor || (container as any).dfd;
    const dfd = Array.isArray(dfdList) ? dfdList[0] : dfdList;
    const reasons: string[] = [];

    if (metadata.swizzle && (metadata.swizzle.includes('r0') || metadata.swizzle === 'rrr1' || metadata.swizzle === 'rrrg' || metadata.swizzle === 'rrra')) {
        reasons.push(`폐기된 휘도/단채널 Swizzle (${metadata.swizzle})`);
    }

    if (container.vkFormat === 0) {
        const colorModel = dfd?.colorModel;
        if (colorModel === undefined || (colorModel !== 163 && colorModel !== 166)) {
            reasons.push(`비표준 DFD colorModel (${colorModel ?? '미지정'})`);
        }
    }

    if (!dfd || dfd.transferFunction === 0 || dfd.transferFunction === undefined) {
        reasons.push(`DFD 감마 미지정 (transferFunction: 0)`);
    }

    if (metadata.writer) {
        const ver = parseWriterVersion(metadata.writer);
        keepLog(ver)
        if (ver) {
            if ((ver.name === 'toktx' || ver.name === 'libktx') && (ver.major < 4 || (ver.major === 4 && ver.minor === 0))) {
                reasons.push(`구형 인코더 (${ver.name} ${ver.major} ${ver.minor} < v4.1)`);
            }
            if (ver.name === 'basisu' && (ver.major < 1 || (ver.major === 1 && ver.minor < 12))) {
                reasons.push(`1세대 BasisU 인코더 (${metadata.writer} < v1.12)`);
            }
        }
    }

    if (reasons.length > 0) {
        return {
            isLegacy: true,
            legacyReason: reasons.join('<br/>')
        };
    }

    return {isLegacy: false};
}

let basisTranscoderPromise: Promise<any> | null = null;
let basisModule: any = null;

const BASIS_FORMAT = {
    ETC1_RGB: 0,
    ETC2_RGBA: 1,
    BC1_RGB: 2,
    BC3_RGBA: 3,
    BC4_R: 4,
    BC5_RG: 5,
    BC7_RGBA: 6,
    PVRTC1_4_RGBA: 9,
    ASTC_4x4_RGBA: 10,
    RGBA32: 13,
    ETC2_EAC_RG11: 21,
    BC6H: 22,
    ASTC_HDR_4x4_RGBA: 23,
    RGB_HALF: 24,
    RGBA_HALF: 25,
    RGB_9E5: 26
};

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

const VK_FORMAT_TO_WEBGPU: Record<number, GPUTextureFormat> = {
    9: 'r8unorm',
    16: 'rg8unorm',
    23: 'rgba8unorm',
    29: 'rgba8unorm-srgb',
    37: 'rgba8unorm',
    43: 'rgba8unorm-srgb',
    44: 'bgra8unorm',
    50: 'bgra8unorm-srgb',

    70: 'r16snorm',
    76: 'r16float',
    77: 'rg16unorm',
    91: 'rgba16float',

    122: 'rg11b10ufloat',
    123: 'rgb9e5ufloat',

    83: 'rg16float',
    97: 'rgba16float',
    100: 'r32float',
    103: 'rg32float',
    109: 'rgba16float',

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

/**
 * [KO] KTX2 컨테이너 또는 바이너리 데이터를 파싱 및 트랜스코딩하여 WebGPU `GPUTexture`를 생성합니다.
 * [EN] Parses and transcodes a KTX2 container or binary data to create a WebGPU `GPUTexture`.
 *
 * @param options -
 * [KO] KTX2 텍스처 생성 옵션 (`CreateKTX2Options`)
 * [EN] KTX2 texture creation options (`CreateKTX2Options`)
 * @returns
 * [KO] 생성된 `GPUTexture`를 반환하는 `Promise`
 * [EN] `Promise` resolving to the created `GPUTexture`
 * @throws
 * [KO] KTX2 파일 로드 또는 Basis 트랜스코더 초기화에 실패한 경우 `Error`가 발생합니다.
 * [EN] Throws `Error` if KTX2 file loading or Basis transcoder initialization fails.
 * @category Texture
 */
export async function createGPUTextureFromKTX2({
                                                   device,
                                                   container: inputContainer,
                                                   swapRedBlue,
                                                   label,
                                                   usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
                                               }: CreateKTX2Options): Promise<GPUTexture> {

    let rawBuffer: Uint8Array | null = null;
    let container: KTX2Container;

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
        rawBuffer = new Uint8Array(inputContainer.buffer, inputContainer.byteOffset, inputContainer.byteLength).slice(0);
        container = read(rawBuffer);
    } else {
        container = inputContainer;
        if ((container as any)._rawBuffer) {
            const b = (container as any)._rawBuffer;
            if (b instanceof Uint8Array) {
                rawBuffer = new Uint8Array(b.buffer, b.byteOffset, b.byteLength).slice(0);
            } else if (b instanceof ArrayBuffer) {
                rawBuffer = new Uint8Array(b.slice(0));
            } else {
                rawBuffer = new Uint8Array(b).slice(0);
            }
        } else {
            throw new Error('[KTX2 Loader ❌] KTX2Container 파싱용 _rawBuffer가 존재하지 않습니다.');
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

    const colorModel = (dfdList && dfdList[0]) ? dfdList[0].colorModel : null;
    const isBasisContainer = container.vkFormat === 0 || container.vkFormat === 1000066000 || colorModel === 166 || colorModel === 163;

    if (isBasisContainer) {
        const Module = await initBasisTranscoder();

        ktx2FileInstance = new Module.KTX2File(rawBuffer);

        if (!ktx2FileInstance.isValid() || !ktx2FileInstance.startTranscoding()) {
            if (ktx2FileInstance) {
                ktx2FileInstance.close();
                ktx2FileInstance.delete();
            }
            throw new Error('[KTX2 Loader ❌] Basis Transcoder 초기화 실패 (Invalid KTX2 Header)');
        }

        const isUASTC = ktx2FileInstance.isUASTC();
        const isHDR = typeof ktx2FileInstance.isHDR === 'function' ? ktx2FileInstance.isHDR() : false;
        const hasAlpha = ktx2FileInstance.getHasAlpha();

        const dfdIsSRGB = Array.isArray(dfdList) && !!dfdList[0] && dfdList[0].transferFunction === 2;
        const isSRGB = (typeof ktx2FileInstance.isSRGB === 'function' ? ktx2FileInstance.isSRGB() : false) || dfdIsSRGB;

        const hasASTC = device.features.has('texture-compression-astc');
        const hasBC = device.features.has('texture-compression-bc');
        const hasETC2 = device.features.has('texture-compression-etc2');


        if (isHDR) {
            if (hasBC) {
                format = 'bc6h-rgb-ufloat';
                basisTargetFormatEnum = BASIS_FORMAT.BC6H;
            } else {
                format = 'rgba16float';
                basisTargetFormatEnum = BASIS_FORMAT.RGBA_HALF;
                console.warn('[KTX2 Loader] BC6H not supported, using RGBA16F instead')
            }
        } else if (isUASTC) {
            if (hasASTC) {
                format = isSRGB ? 'astc-4x4-unorm-srgb' : 'astc-4x4-unorm';
                basisTargetFormatEnum = BASIS_FORMAT.ASTC_4x4_RGBA;
            } else if (hasBC) {
                format = isSRGB ? 'bc7-rgba-unorm-srgb' : 'bc7-rgba-unorm';
                basisTargetFormatEnum = BASIS_FORMAT.BC7_RGBA;
            } else if (hasETC2) {
                format = isSRGB ? 'etc2-rgba8unorm-srgb' : 'etc2-rgba8unorm';
                basisTargetFormatEnum = BASIS_FORMAT.ETC2_RGBA;
            } else {
                format = isSRGB ? 'rgba8unorm-srgb' : 'rgba8unorm';
                basisTargetFormatEnum = BASIS_FORMAT.RGBA32;
            }
        } else {
            if (hasASTC) {
                format = isSRGB ? 'astc-4x4-unorm-srgb' : 'astc-4x4-unorm';
                basisTargetFormatEnum = BASIS_FORMAT.ASTC_4x4_RGBA;
            } else if (hasBC) {
                if (hasAlpha) {
                    format = isSRGB ? 'bc3-rgba-unorm-srgb' : 'bc3-rgba-unorm';
                    basisTargetFormatEnum = BASIS_FORMAT.BC3_RGBA;
                } else {
                    format = isSRGB ? 'bc1-rgba-unorm-srgb' : 'bc1-rgba-unorm';
                    basisTargetFormatEnum = BASIS_FORMAT.BC1_RGB;
                }
            } else if (hasETC2) {
                if (hasAlpha) {
                    format = isSRGB ? 'etc2-rgba8unorm-srgb' : 'etc2-rgba8unorm';
                    basisTargetFormatEnum = BASIS_FORMAT.ETC2_RGBA;
                } else {
                    format = isSRGB ? 'etc2-rgb8unorm-srgb' : 'etc2-rgb8unorm';
                    basisTargetFormatEnum = BASIS_FORMAT.ETC1_RGB;
                }
            } else {
                format = isSRGB ? 'rgba8unorm-srgb' : 'rgba8unorm';
                basisTargetFormatEnum = BASIS_FORMAT.RGBA32;
            }
        }

        console.log(`[KTX2 Transcode Diagnosis] ${label ?? 'unknown'}`, {
            isUASTC, isHDR, isSRGB, hasAlpha,
            hasBC, hasASTC, hasETC2,
            format, basisTargetFormatEnum,
            colorModel,
            transferFunction: dfdList?.[0]?.transferFunction,
        });

        isBasisTranscoded = true;
    } else {
        const mappedFormat = VK_FORMAT_TO_WEBGPU[container.vkFormat];
        if (mappedFormat) {
            format = mappedFormat;
        } else {
            format = `${navigator.gpu.getPreferredCanvasFormat()}-srgb` as GPUTextureFormat;
        }
    }


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

    const isCompressed = format.startsWith('bc') || format.startsWith('etc') || format.startsWith('astc') || format.startsWith('eac');
    const bytesPerPixel = FORMAT_BYTES_PER_PIXEL[format] ?? 4;

    let textureWidth = width;
    let textureHeight = height;

    if (isCompressed) {
        let blockWidth = 4;
        let blockHeight = 4;
        if (format.startsWith('astc-')) {
            const parts = format.split('-');
            const dims = parts[1].split('x');
            blockWidth = parseInt(dims[0], 10);
            blockHeight = parseInt(dims[1], 10);
        }
        textureWidth = Math.ceil(width / blockWidth) * blockWidth;
        textureHeight = Math.ceil(height / blockHeight) * blockHeight;
    }

    const texture = device.createTexture({
        label: label ?? `KTX2_Texture_${width}x${height}`,
        size: {
            width: textureWidth,
            height: textureHeight,
            depthOrArrayLayers: totalLayers
        },
        dimension: '2d',
        mipLevelCount,
        format,
        usage,
    });

    try {
        for (let mipLevel = 0; mipLevel < mipLevelCount; mipLevel++) {
            const mipWidth = Math.max(1, width >> mipLevel);
            const mipHeight = Math.max(1, height >> mipLevel);

            if (isBasisTranscoded) {
                for (let slice = 0; slice < totalLayers; slice++) {
                    const layerIdx = faceCount === 6 ? Math.floor(slice / 6) : (depth > 1 ? 0 : slice);
                    const faceIdx = faceCount === 6 ? slice % 6 : 0;

                    const imageSize = ktx2FileInstance.getImageTranscodedSizeInBytes(
                        mipLevel, layerIdx, faceIdx, basisTargetFormatEnum
                    );

                    {

                        if (!imageSize || imageSize <= 0) {
                            console.error(`[ERROR] Invalid imageSize=${imageSize} at mipLevel=${mipLevel}`);
                            throw new Error(`Invalid imageSize: ${imageSize}`);
                        }

                    }

                    const transcodedBuffer = new Uint8Array(imageSize);

                    const success = ktx2FileInstance.transcodeImage(
                        transcodedBuffer,
                        mipLevel,
                        layerIdx,
                        faceIdx,
                        basisTargetFormatEnum,
                        0,
                        -1,
                        -1
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

                        const blocksWide = Math.max(1, Math.ceil(mipWidth / blockWidth));
                        const blocksHigh = Math.max(1, Math.ceil(mipHeight / blockHeight));

                        let bytesPerBlock = 16;
                        if (format.startsWith('bc1') || format.startsWith('bc4') ||
                            format === 'etc2-rgb8unorm' || format === 'etc2-rgb8unorm-srgb' ||
                            format === 'eac-r11unorm' || format === 'eac-r11snorm' ||
                            format === 'bc6h-rgb-ufloat' || format === 'bc6h-rgb-float') {
                            bytesPerBlock = format.startsWith('bc6h') ? 16 : 8;
                        }

                        const unpaddedBytesPerRow = blocksWide * bytesPerBlock;
                        const paddedBytesPerRow = (unpaddedBytesPerRow + 255) & ~255;
                        const requiredSize = unpaddedBytesPerRow * blocksHigh;

                        let uploadBuffer = transcodedBuffer;
                        if (unpaddedBytesPerRow % 256 !== 0 && blocksHigh > 1) {
                            const paddedBuffer = new Uint8Array(paddedBytesPerRow * blocksHigh);
                            for (let row = 0; row < blocksHigh; row++) {
                                const srcRow = transcodedBuffer.subarray(row * unpaddedBytesPerRow, Math.min(transcodedBuffer.byteLength, (row + 1) * unpaddedBytesPerRow));
                                paddedBuffer.set(srcRow, row * paddedBytesPerRow);
                            }
                            uploadBuffer = paddedBuffer;
                        } else if (transcodedBuffer.byteLength < requiredSize) {
                            uploadBuffer = new Uint8Array(requiredSize);
                            uploadBuffer.set(transcodedBuffer);
                        }

                        device.queue.writeTexture(
                            {
                                texture,
                                mipLevel,
                                origin: {x: 0, y: 0, z: slice}
                            },
                            uploadBuffer as BufferSource,
                            {
                                offset: 0,
                                bytesPerRow: (unpaddedBytesPerRow % 256 === 0 || blocksHigh === 1) ? unpaddedBytesPerRow : paddedBytesPerRow,
                                rowsPerImage: blocksHigh
                            },
                            {
                                width: blocksWide * blockWidth,
                                height: blocksHigh * blockHeight,
                                depthOrArrayLayers: 1
                            }
                        );
                    } else {
                        const unpaddedBytesPerRow = mipWidth * bytesPerPixel;
                        const paddedBytesPerRow = (unpaddedBytesPerRow + 255) & ~255;

                        let uploadBuffer = transcodedBuffer;
                        if (unpaddedBytesPerRow % 256 !== 0 && mipHeight > 1) {
                            const paddedBuffer = new Uint8Array(paddedBytesPerRow * mipHeight);
                            for (let row = 0; row < mipHeight; row++) {
                                const srcRow = transcodedBuffer.subarray(row * unpaddedBytesPerRow, (row + 1) * unpaddedBytesPerRow);
                                paddedBuffer.set(srcRow, row * paddedBytesPerRow);
                            }
                            uploadBuffer = paddedBuffer;
                        }

                        device.queue.writeTexture(
                            {
                                texture,
                                mipLevel,
                                origin: {x: 0, y: 0, z: slice}
                            },
                            uploadBuffer as BufferSource,
                            {
                                offset: 0,
                                bytesPerRow: (unpaddedBytesPerRow % 256 === 0 || mipHeight === 1) ? unpaddedBytesPerRow : paddedBytesPerRow,
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
            } else {
                const levelInfo = container.levels[mipLevel];
                let levelDataView: Uint8Array<any> = new Uint8Array(
                    levelInfo.levelData.buffer,
                    levelInfo.levelData.byteOffset,
                    levelInfo.levelData.byteLength
                );

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

                    const blocksWide = Math.max(1, Math.ceil(mipWidth / blockWidth));
                    const blocksHigh = Math.max(1, Math.ceil(mipHeight / blockHeight));

                    let bytesPerBlock = 16;
                    if (format.startsWith('bc1') || format.startsWith('bc4') ||
                        format === 'etc2-rgb8unorm' || format === 'etc2-rgb8unorm-srgb' ||
                        format === 'eac-r11unorm' || format === 'eac-r11snorm') {
                        bytesPerBlock = 8;
                    }

                    const unpaddedBytesPerRow = blocksWide * bytesPerBlock;
                    const paddedBytesPerRow = (unpaddedBytesPerRow + 255) & ~255;
                    const bytesPerImage = unpaddedBytesPerRow * blocksHigh;

                    for (let slice = 0; slice < totalLayers; slice++) {
                        const sliceOffset = slice * bytesPerImage;
                        if (sliceOffset >= levelDataView.byteLength) break;

                        const sliceSub = levelDataView.subarray(
                            sliceOffset,
                            Math.min(levelDataView.byteLength, sliceOffset + bytesPerImage)
                        );

                        let uploadBuf = sliceSub;
                        if (unpaddedBytesPerRow % 256 !== 0 && blocksHigh > 1) {
                            const paddedBuf = new Uint8Array(paddedBytesPerRow * blocksHigh);
                            for (let row = 0; row < blocksHigh; row++) {
                                const srcRow = sliceSub.subarray(row * unpaddedBytesPerRow, Math.min(sliceSub.byteLength, (row + 1) * unpaddedBytesPerRow));
                                paddedBuf.set(srcRow, row * paddedBytesPerRow);
                            }
                            uploadBuf = paddedBuf;
                        } else {
                            uploadBuf = new Uint8Array(bytesPerImage);
                            uploadBuf.set(sliceSub);
                        }

                        device.queue.writeTexture(
                            {
                                texture,
                                mipLevel,
                                origin: {x: 0, y: 0, z: slice}
                            },
                            uploadBuf as BufferSource,
                            {
                                offset: 0,
                                bytesPerRow: (unpaddedBytesPerRow % 256 === 0 || blocksHigh === 1) ? unpaddedBytesPerRow : paddedBytesPerRow,
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

    const metadata = parseKTX2Metadata(container);
    const legacyInfo = detectIsLegacyKTX2(container, metadata);

    //@ts-ignore
    texture.ktxInfo = {
        vkFormat: container.vkFormat,
        vkFormatName: VK_FORMAT_TO_WEBGPU[container.vkFormat ?? 0],
        isLegacy: legacyInfo.isLegacy,
        legacyReason: legacyInfo.legacyReason,
        writer: metadata.writer,
        orientation: metadata.orientation,
        swizzle: metadata.swizzle,
        exposure: metadata.exposure,
        tonemapping: metadata.tonemapping,
        hdrColorPrimaries: metadata.hdrColorPrimaries,
        hdrTransferFunction: metadata.hdrTransferFunction,
        metadataRaw: metadata.raw,
    };
    return texture;
}