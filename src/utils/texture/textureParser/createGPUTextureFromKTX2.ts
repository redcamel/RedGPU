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

/**
 * KTX2 keyValue 영역에서 파싱된 HDR/텍스처 메타데이터.
 *
 * @see https://registry.khronos.org/KTX/specs/2.0/ktxspec.v2.html#metadata
 */
export interface KTX2Metadata {
    /** KHR_texture_basisu 등 사용 writer 정보 (KTXwriter) */
    writer?: string;
    /** 텍스처 방향 (KTXorientation). 예: 'rd', 'ru' */
    orientation?: string;
    /** 스위즐 정보 (KTXswizzle). 예: 'rgba', 'rgb1' */
    swizzle?: string;
    /**
     * HDR 노출값 (KHRexposure).
     * 중간 밝기(linear scene) → 디스플레이 밝기 변환에 사용되는 EV 오프셋.
     * 0.0 = 노출 보정 없음, 양수 = 밝게, 음수 = 어둡게.
     */
    exposure?: number;
    /**
     * 톤매핑 방식 (KHRtonemapping).
     * 0 = None(Linear), 1 = PBR Neutral, 2 = ACES, 3 = Filmic
     */
    tonemapping?: number;
    /** HDR 색공간 원색(primaries) ID (KHRhdrColorSpace) */
    hdrColorPrimaries?: number;
    /** HDR 전달 함수(transfer function) ID (KHRhdrColorSpace) */
    hdrTransferFunction?: number;
    /** 파싱되지 않은 나머지 원시 keyValue 항목 */
    raw: Record<string, string | Uint8Array>;
}

/**
 * KTX2Container의 keyValue 영역을 파싱해 {@link KTX2Metadata}로 반환합니다.
 */
function parseKTX2Metadata(container: KTX2Container): KTX2Metadata {
    const kv = container.keyValue ?? {};
    const raw: Record<string, string | Uint8Array> = {};

    const getString = (key: string): string | undefined => {
        const val = kv[key];
        if (val === undefined) return undefined;
        if (typeof val === 'string') {
            // null terminator 제거
            raw[key] = val;
            return val.replace(/\0+$/, '');
        }
        // Uint8Array → UTF-8 문자열 변환
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

    // 파싱되지 않은 키도 raw에 보존
    for (const key of Object.keys(kv)) {
        if (!raw[key]) raw[key] = kv[key];
    }

    // KHRhdrColorSpace: "<primaries> <transferFunction>" 형식의 공백 구분 문자열
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

/**
 * KTXwriter 문자열에서 주 버전(Major) 및 부 버전(Minor) 번호를 수치(Number)로 스마트하게 파싱합니다.
 * 예: "toktx v4.0.__default__" → { major: 4, minor: 0 }
 *     "BasisU v1.12" → { major: 1, minor: 12 }
 */
function parseWriterVersion(writerStr?: string): { name: string; major: number; minor: number } | null {
    if (!writerStr) return null;
    // basisu, toktx, libktx 뒤의 v1.1, v1.11, /v1.11 등 다양한 구획 기호와 버전 번호 스마트 추출
    const match = writerStr.match(/(toktx|libktx|basisu)[_\s\/-]*v?(\d+)\.(\d+)/i);
    if (!match) return null;
    return {
        name: match[1].toLowerCase(),
        major: parseInt(match[2], 10),
        minor: parseInt(match[3], 10)
    };
}

/**
 * [KO] KTX2 바이너리 메타데이터(DFD, KTXwriter 버저닝, swizzle 등)를 분석하여
 * 1세대 구형(Legacy) 텍스처 여부와 모든 판별 원인들을 전수 종합 분석합니다.
 */
function detectIsLegacyKTX2(container: KTX2Container, metadata: KTX2Metadata): {
    isLegacy: boolean;
    legacyReason?: string
} {
    const dfdList = (container as any).dataFormatDescriptor || (container as any).dfd;
    const dfd = Array.isArray(dfdList) ? dfdList[0] : dfdList;
    const reasons: string[] = [];

    // 1. 레거시 swizzle 매핑 구조적 검사 (r001, rrr1, rrrg, rrra 등 1세대 휘도/단채널 스위즐)
    if (metadata.swizzle && (metadata.swizzle.includes('r0') || metadata.swizzle === 'rrr1' || metadata.swizzle === 'rrrg' || metadata.swizzle === 'rrra')) {
        reasons.push(`폐기된 휘도/단채널 Swizzle (${metadata.swizzle})`);
    }

    // 2. Transcodable (vkFormat === 0) 텍스처 중 DFD colorModel이 미지정이거나 163(ETC1S)/166(UASTC) 외 비표준 포맷인 경우
    if (container.vkFormat === 0) {
        const colorModel = dfd?.colorModel;
        if (colorModel === undefined || (colorModel !== 163 && colorModel !== 166)) {
            reasons.push(`비표준 DFD colorModel (${colorModel ?? '미지정'})`);
        }
    }

    // 3. DFD transferFunction 감마 스펙 수치 미지정(0/Undefined) 검사
    if (!dfd || dfd.transferFunction === 0 || dfd.transferFunction === undefined) {
        reasons.push(`DFD 감마 미지정 (transferFunction: 0)`);
    }

    // 4. KTXwriter 생성자 시만틱 버저닝(SemVer) 수치 검사 (존재할 경우에만 수치 검사)
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

/** Basis Universal WASM Singleton 인스턴스 관리 */
let basisTranscoderPromise: Promise<any> | null = null;
let basisModule: any = null;

// ✨ Basis Universal C++ 내부 열거형(Enum) 상수 하드코딩 (HDR 포맷 BC6H, RGBA16F 포함)
// https://github.com/BinomialLLC/basis_universal/blob/master/transcoder/basisu_transcoder.h
const BASIS_FORMAT = {
    ETC1_RGB: 0,
    ETC2_RGBA: 1,
    BC1_RGB: 2,
    BC3_RGBA: 3,
    BC4_R: 4,
    BC5_RG: 5,
    BC7_RGBA: 6,
    PVRTC1_4_RGBA: 9,
    ASTC_4x4_RGBA: 10,        // ✅ 9 → 10 수정
    RGBA32: 13,
    ETC2_EAC_RG11: 21,
    BC6H: 22,                  // ✅ 21 → 22 수정
    ASTC_HDR_4x4_RGBA: 23,
    RGB_HALF: 24,
    RGBA_HALF: 25,             // ✅ 22 → 25 수정 (RGBA16F는 RGBA_HALF)
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

/**
 * Vulkan Format ID -> WebGPU GPUTextureFormat 매핑 테이블
 *
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
    // keepLog('createFallbackGPUTexture', label);
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

    // 1. 순수 바이너리 사본 안전 분리
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

    // ✨ 핵심 수정: vkFormat이 0이거나, HDR ASTC 포맷(1000066000)이거나, DFD 컬러 모델이 UASTC(166)/ETC1S(163)인 경우 Basis 트랜스코더 진입
    const colorModel = (dfdList && dfdList[0]) ? dfdList[0].colorModel : null;
    const isBasisContainer = container.vkFormat === 0 || container.vkFormat === 1000066000 || colorModel === 166 || colorModel === 163;

    // 2. Format 판단 및 Basis WASM 초기화
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

        // KHR_DF_TRANSFER_SRGB = 2, KHR_DF_TRANSFER_LINEAR = 1
        // ktx2FileInstance.isSRGB() 와 DFD transferFunction 둘 다 체크 (OR 결합)
        const dfdIsSRGB = Array.isArray(dfdList) && !!dfdList[0] && dfdList[0].transferFunction === 2;
        const isSRGB = (typeof ktx2FileInstance.isSRGB === 'function' ? ktx2FileInstance.isSRGB() : false) || dfdIsSRGB;

        const hasASTC = device.features.has('texture-compression-astc');
        const hasBC = device.features.has('texture-compression-bc');
        const hasETC2 = device.features.has('texture-compression-etc2');


        // ✨ HDR 및 범용 KTX2 포맷 대응 매핑 분기
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
            // ETC1S 트랜스코딩 타겟
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

        // 🔍 진단 로그 - 색상 문제 디버깅용
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

    // keepLog(isBasisTranscoded, container, format, basisTargetFormatEnum);

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

    // 4. GPUTexture 생성
    const texture = device.createTexture({
        label: label ?? `KTX2_Texture_${width}x${height}`,
        size: {
            width: textureWidth,
            height: textureHeight,
            depthOrArrayLayers: totalLayers
        },
        mipLevelCount,
        format,
        usage,
    });

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

                    {
                        // keepLog(`[KTX2 Transcode] mipLevel=${mipLevel}, mipSize=${mipWidth}x${mipHeight}, imageSize=${imageSize}`);

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
                            format === 'bc6h-rgb-ufloat' || format === 'bc6h-rgb-float') { // BC6H 블록 바이트 수 대응 (16바이트)
                            bytesPerBlock = format.startsWith('bc6h') ? 16 : 8; // BC6H는 픽셀 블록 당 16바이트
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
                        // 비압축 포맷 (RGBA16F 등) 처리
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
                // Raw KTX2 (사전 압축 / 비압축 KTX2) 처리
                const levelInfo = container.levels[mipLevel];
                let levelDataView = new Uint8Array(
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
        /** 1세대 구형(Legacy) KTX2 텍스처 여부 */
        isLegacy: legacyInfo.isLegacy,
        /** 1세대 구형(Legacy) 판별 구체적 기술적 원인 */
        legacyReason: legacyInfo.legacyReason,
        // KTX2 keyValue 메타데이터
        writer: metadata.writer,
        orientation: metadata.orientation,
        swizzle: metadata.swizzle,
        /** HDR 노출 보정값 (EV 오프셋). 0.0 = 보정 없음 */
        exposure: metadata.exposure,
        /** 톤매핑 힌트 (0=None, 1=PBR Neutral, 2=ACES, 3=Filmic) */
        tonemapping: metadata.tonemapping,
        hdrColorPrimaries: metadata.hdrColorPrimaries,
        hdrTransferFunction: metadata.hdrTransferFunction,
        /** 파싱되지 않은 원시 keyValue 전체 */
        metadataRaw: metadata.raw,
    };
    return texture;
}