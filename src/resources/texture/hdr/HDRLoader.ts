import {keepLog} from "../../../utils";

/**
 * [KO] HDR 텍스처 데이터를 나타내는 인터페이스입니다.
 * [EN] Interface representing HDR texture data.
 */
export interface HDRData {
    /**
     * [KO] 부동 소수점 픽셀 데이터 (RGBA 순서)
     * [EN] Floating-point pixel data (RGBA order)
     */
    data: Float32Array;
    /**
     * [KO] 이미지 너비
     * [EN] Image width
     */
    width: number;
    /**
     * [KO] 이미지 높이
     * [EN] Image height
     */
    height: number;
}

/**
 * [KO] 파일 유효성 검사 결과를 나타내는 인터페이스입니다.
 * [EN] Interface representing file validation results.
 */
export interface FileValidation {
    /**
     * [KO] 유효 여부
     * [EN] Whether the file is valid
     */
    isValid: boolean;
    /**
     * [KO] 파일 포맷 정보
     * [EN] File format information
     */
    format: string;
    /**
     * [KO] 에러 메시지 (선택적)
     * [EN] Error message (optional)
     */
    error?: string;
}

/**
 * [KO] Radiance HDR(.hdr) 파일을 파싱하고 로드하는 클래스입니다.
 * [EN] Class that parses and loads Radiance HDR (.hdr) files.
 *
 * [KO] RGBE 포맷의 HDR 데이터를 읽어 들여 CPU 메모리에 Float32Array 형태로 변환합니다.
 * [EN] Reads HDR data in RGBE format and converts it into a Float32Array in CPU memory.
 *
 * ### Example
 * ```typescript
 * const loader = new RedGPU.Resource.HDRLoader();
 * const hdrData = await loader.loadHDRFile('path/to/environment.hdr');
 * ```
 * @category IBL
 */
class HDRLoader {
    #enableDebugLogs: boolean = true;

    /**
     * [KO] HDRLoader 인스턴스를 생성합니다.
     * [EN] Creates an HDRLoader instance.
     * @param enableDebugLogs -
     * [KO] 디버그 로그 활성화 여부 (기본값: true)
     * [EN] Whether to enable debug logs (default: true)
     */
    constructor(enableDebugLogs: boolean = true) {
        this.#enableDebugLogs = enableDebugLogs;
    }

    /**
     * [KO] 디버그 로그 활성화 여부를 반환합니다.
     * [EN] Returns whether debug logs are enabled.
     */
    get enableDebugLogs(): boolean {
        return this.#enableDebugLogs;
    }

    /**
     * [KO] 디버그 로그 활성화 여부를 설정합니다.
     * [EN] Sets whether to enable debug logs.
     */
    set enableDebugLogs(value: boolean) {
        this.#enableDebugLogs = value;
    }

    /**
     * [KO] HDR 파일을 로드하고 데이터를 반환합니다.
     * [EN] Loads an HDR file and returns the data.
     *
     * ### Example
     * ```typescript
     * const hdrData = await loader.loadHDRFile('assets/sky.hdr');
     * ```
     *
     * @param src -
     * [KO] HDR 파일 경로
     * [EN] HDR file path
     * @returns
     * [KO] 파싱된 HDR 데이터 (픽셀, 크기 정보 포함)
     * [EN] Parsed HDR data (including pixel and size information)
     * @throws
     * [KO] HTTP 로드 실패 또는 잘못된 포맷일 경우 Error 발생
     * [EN] Throws Error on HTTP failure or invalid format
     */
    async loadHDRFile(src: string): Promise<HDRData> {
        if (this.#enableDebugLogs) {
            keepLog(`HDR 파일 로딩 시작: ${src}`);
        }
        const response = await fetch(src);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        // 🔍 기본 HDR 데이터 파싱
        const rawHdrData = this.#parseHDRFile(uint8Array, src);
        keepLog(
            {
                ...rawHdrData,
            }
        )
        return {
            ...rawHdrData,
        }
    }


    /**
     * HDR 파일 데이터를 파싱합니다
     */
    #parseHDRFile(uint8Array: Uint8Array, src: string): HDRData {
        const validation = this.#validateHDRFile(uint8Array);
        if (this.#enableDebugLogs) {
            keepLog(`파일 형식: ${validation.format}`);
        }
        if (!validation.isValid) {
            throw new Error(validation.error || '지원되지 않는 파일 형식입니다');
        }
        if (src.split('?')[0].toLowerCase().endsWith('.hdr')) {
            if (this.#enableDebugLogs) {
                // keepLog('파일 첫 200바이트:');
                this.#hexDump(uint8Array.slice(0, 200));
            }
            const hdrData = this.#parseRGBE(uint8Array);
            if (this.#enableDebugLogs) {
                this.#debugHDRInfo(hdrData);
            }
            return hdrData;
        } else if (src.split('?')[0].toLowerCase().endsWith('.exr')) {
            throw new Error('EXR format not supported yet');
        } else {
            throw new Error(`Unsupported HDR format: ${src}`);
        }
    }

    /**
     * RGBE 데이터 파싱
     */
    #parseRGBE(uint8Array: Uint8Array): HDRData {
        let offset = 0;
        let line = '';
        const header: Record<string, string> = {};
        // 첫 번째 라인
        while (offset < uint8Array.length) {
            const char = String.fromCharCode(uint8Array[offset++]);
            if (char === '\n') break;
            line += char;
        }
        if (!line.startsWith('#?RADIANCE') && !line.startsWith('#?RGBE')) {
            throw new Error('Invalid HDR file header');
        }
        // 헤더 정보 파싱
        while (offset < uint8Array.length) {
            line = '';
            while (offset < uint8Array.length) {
                const char = String.fromCharCode(uint8Array[offset++]);
                if (char === '\n') break;
                line += char;
            }
            if (line.trim() === '') break;
            const equalIndex = line.indexOf('=');
            if (equalIndex > 0) {
                const key = line.substring(0, equalIndex).trim();
                const value = line.substring(equalIndex + 1).trim();
                header[key] = value;
            }
        }
        // 해상도 파싱
        line = '';
        while (offset < uint8Array.length) {
            const char = String.fromCharCode(uint8Array[offset++]);
            if (char === '\n') break;
            line += char;
        }
        const resolutionMatch = line.match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);
        if (!resolutionMatch) {
            throw new Error('Invalid resolution format in HDR file');
        }
        const height = parseInt(resolutionMatch[1]);
        const width = parseInt(resolutionMatch[2]);
        // 헤더에서 노출 정보 추출
        let fileExposure: number | undefined;
        if (header.EXPOSURE) {
            fileExposure = parseFloat(header.EXPOSURE);
            if (this.#enableDebugLogs) {
                keepLog(`파일 노출값: ${fileExposure.toFixed(3)}`);
            }
        }
        // RGBE 데이터 파싱
        const pixelData = new Float32Array(width * height * 4);
        let pixelIndex = 0;
        for (let y = 0; y < height; y++) {
            const scanline = this.#readRGBEScanline(uint8Array, offset, width);
            offset = scanline.nextOffset;
            for (let x = 0; x < width; x++) {
                const rgbeIndex = x * 4;
                const r = scanline.data[rgbeIndex];
                const g = scanline.data[rgbeIndex + 1];
                const b = scanline.data[rgbeIndex + 2];
                const e = scanline.data[rgbeIndex + 3];
                if (e === 0) {
                    pixelData[pixelIndex++] = 0;
                    pixelData[pixelIndex++] = 0;
                    pixelData[pixelIndex++] = 0;
                    pixelData[pixelIndex++] = 1;
                } else {
                    const f = Math.pow(2, e - 128 - 8);
                    pixelData[pixelIndex++] = r * f;
                    pixelData[pixelIndex++] = g * f;
                    pixelData[pixelIndex++] = b * f;
                    pixelData[pixelIndex++] = 1;
                }
            }
        }
        return {
            data: pixelData,
            width,
            height,
        };
    }

    /**
     * HDR 파일 유효성 검사
     */
    #validateHDRFile(data: Uint8Array): FileValidation {
        if (data.length < 50) {
            return {
                isValid: false,
                format: 'unknown',
                error: '파일이 너무 작습니다'
            };
        }
        const header = new TextDecoder('ascii', {fatal: false})
            .decode(data.slice(0, 50));
        if (header.startsWith('#?RADIANCE') || header.startsWith('#?RGBE')) {
            return {isValid: true, format: 'RGBE/Radiance'};
        }
        if (header.includes('RADIANCE') || header.includes('RGBE')) {
            return {isValid: true, format: 'RGBE/Radiance (variant)'};
        }
        return {
            isValid: false,
            format: 'unknown',
            error: '지원되지 않는 HDR 형식입니다'
        };
    }

    /**
     * RGBE 스캔라인 읽기 (RLE 압축 지원)
     */
    #readRGBEScanline(data: Uint8Array, offset: number, width: number): {
        data: Uint8Array,
        nextOffset: number
    } {
        const scanlineData = new Uint8Array(width * 4);
        // 새로운 RLE 포맷 확인
        if (data[offset] === 0x02 && data[offset + 1] === 0x02 &&
            data[offset + 2] === ((width >> 8) & 0xff) &&
            data[offset + 3] === (width & 0xff)) {
            offset += 4;
            // 각 채널(R,G,B,E)을 개별적으로 압축 해제
            for (let channel = 0; channel < 4; channel++) {
                let pixelIndex = channel;
                while (pixelIndex < width * 4) {
                    const code = data[offset++];
                    if (code > 128) {
                        // RLE 압축된 데이터
                        const count = code - 128;
                        const value = data[offset++];
                        for (let i = 0; i < count && pixelIndex < width * 4; i++) {
                            scanlineData[pixelIndex] = value;
                            pixelIndex += 4;
                        }
                    } else {
                        // 압축되지 않은 데이터
                        const count = code;
                        for (let i = 0; i < count && pixelIndex < width * 4; i++) {
                            scanlineData[pixelIndex] = data[offset++];
                            pixelIndex += 4;
                        }
                    }
                }
            }
        } else {
            // 구 포맷 또는 압축되지 않은 데이터
            for (let i = 0; i < width * 4; i++) {
                scanlineData[i] = data[offset++];
            }
        }
        return {data: scanlineData, nextOffset: offset};
    }

    /**
     * HDR 데이터 디버그 정보 출력
     */
    #debugHDRInfo(hdrData: HDRData): void {
        if (!this.#enableDebugLogs) return;
        keepLog(`HDR 정보:`);
        keepLog(`크기: ${hdrData.width} x ${hdrData.height}`);
        keepLog(`데이터 길이: ${hdrData.data.length}`);
        keepLog(`예상 픽셀 수: ${hdrData.width * hdrData.height * 4}`);
        // 첫 몇 픽셀의 값 확인
        // keepLog('첫 4픽셀 값 (원본):');
        for (let i = 0; i < Math.min(16, hdrData.data.length); i += 4) {
            const r = hdrData.data[i];
            const g = hdrData.data[i + 1];
            const b = hdrData.data[i + 2];
            const a = hdrData.data[i + 3];
            // keepLog(`픽셀 ${i / 4}: R=${r.toFixed(3)}, G=${g.toFixed(3)}, B=${b.toFixed(3)}, A=${a.toFixed(3)}`);
        }
    }

    /**
     * 헥스 덤프 출력
     */
    #hexDump(data: Uint8Array): void {
        if (!this.#enableDebugLogs) return;
        for (let i = 0; i < data.length; i += 16) {
            const hex = Array.from(data.slice(i, i + 16))
                .map(b => b.toString(16).padStart(2, '0'))
                .join(' ');
            const ascii = Array.from(data.slice(i, i + 16))
                .map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.')
                .join('');
            // keepLog(`${i.toString(16).padStart(8, '0')}: ${hex.padEnd(48, ' ')} |${ascii}|`);
        }
    }
}

export default HDRLoader;
