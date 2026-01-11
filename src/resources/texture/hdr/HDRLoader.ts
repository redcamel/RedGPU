import {keepLog} from "../../../utils";

export interface HDRData {
    data: Float32Array;
    width: number;
    height: number;
    exposure?: number;          // 파일에서 읽은 노출값
    recommendedExposure?: number; // 자동 계산된 권장 노출값
    luminanceStats?: {         // 휘도 통계
        min: number;
        max: number;
        average: number;
        median: number;
    };
}

export interface FileValidation {
    isValid: boolean;
    format: string;
    error?: string;
}

class HDRLoader {
    #enableDebugLogs: boolean = true;

    constructor(enableDebugLogs: boolean = true) {
        this.#enableDebugLogs = enableDebugLogs;
    }

    get enableDebugLogs(): boolean {
        return this.#enableDebugLogs;
    }

    set enableDebugLogs(value: boolean) {
        this.#enableDebugLogs = value;
    }

    /**
     * HDR 파일 로드 (원본 데이터 보존, 분석만 수행)
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
        // 원본 데이터는 보존하고 분석만 수행
        return this.#analyzeHDRData(rawHdrData);
    }

    /**
     * 🔍 HDR 데이터 분석 (원본 데이터 보존)
     */
    #analyzeHDRData(hdrData: HDRData): HDRData {
        if (this.#enableDebugLogs) {
            keepLog('HDR 데이터 분석 시작 (원본 데이터 보존)...');
        }
        // 🔍 휘도 분석
        const luminanceStats = this.#analyzeLuminance(hdrData);
        // 자동 노출 계산 (적용하지 않고 권장값만 계산)
        const recommendedExposure = this.#calculateOptimalExposure(luminanceStats);
        if (this.#enableDebugLogs) {
            keepLog(`권장 노출값 계산: ${recommendedExposure.toFixed(3)} (원본 데이터는 보존)`);
        }
        // 원본 데이터는 그대로 유지, 분석 결과만 추가
        return {
            ...hdrData,
            recommendedExposure,
            luminanceStats
        };
    }

    /**
     * 🔍 휘도 분석
     */




    /**
     * 🔍 휘도 분석
     */
    #analyzeLuminance(hdrData: HDRData) {
        const { data, width, height } = hdrData;
        const pixelCount = width * height; // 픽셀 개수
        const epsilon = 1e-6;

        let min = Infinity;
        let max = -Infinity;
        let logSum = 0;
        let linearSum = 0;
        let validCount = 0;

        // 상대 휘도 계수 (BT.709)
        const R_COEFF = 0.2126, G_COEFF = 0.7152, B_COEFF = 0.0722;

        // 픽셀 단위로 순회 (stride = 4)
        for (let i = 0; i < pixelCount; i++) {
            const offset = i * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];

            // 휘도 계산
            const luminance = R_COEFF * r + G_COEFF * g + B_COEFF * b;

            // 음수 방지
            const safeLuminance = Math.max(0, luminance);

            // 거의 검은색 픽셀 제외 (더 관대한 임계값)
            if (safeLuminance > epsilon) {
                if (safeLuminance < min) min = safeLuminance;
                if (safeLuminance > max) max = safeLuminance;

                logSum += Math.log(safeLuminance + epsilon);
                linearSum += safeLuminance;
                validCount++;
            }
        }

        if (validCount === 0) {
            console.warn('⚠️ 유효한 픽셀이 없습니다!');
            return { min: 0, max: 0, average: 0, median: 0 };
        }

        const linearAverage = linearSum / validCount;
        const logAverage = Math.exp(logSum / validCount);

        // Scene key 계산 (로그 평균 기반)
        const sceneKey = logAverage;

        if (this.#enableDebugLogs) {
            keepLog(`📊 휘도 통계:`);
            keepLog(`  - 최소: ${min.toFixed(6)}`);
            keepLog(`  - 최대: ${max.toFixed(6)}`);
            keepLog(`  - 선형 평균: ${linearAverage.toFixed(6)}`);
            keepLog(`  - 로그 평균: ${logAverage.toFixed(6)}`);
            keepLog(`  - 다이나믹 레인지: ${(max / (min + epsilon)).toFixed(2)}:1`);
            keepLog(`  - 유효 픽셀: ${validCount} / ${pixelCount}`);
        }

        return {
            min: min === Infinity ? 0 : min,
            max: max === -Infinity ? 0 : max,
            average: linearAverage,
            median: sceneKey
        };
    }


    /**
     * HDR 이미지의 최적 노출값 계산
     */
    #calculateOptimalExposure(stats: { min: number; max: number; average: number; median: number }): number {
        const logAverageLuminance = stats.median;

        if (this.#enableDebugLogs) {
            keepLog(`📷 노출 계산:`);
            keepLog(`  - 로그 평균 휘도 (Lw): ${logAverageLuminance.toFixed(6)}`);
        }

        // 1. 표준 Middle Gray 기준 (0.18)
        const MIDDLE_GRAY = 0.18;

        // 2. 기본 노출 계산
        let exposure = MIDDLE_GRAY / Math.max(logAverageLuminance, 1e-6);

        if (this.#enableDebugLogs) {
            keepLog(`  - 기본 노출: ${exposure.toFixed(3)}`);
        }

        // 3. 극단적인 다이나믹 레인지 보정
        const dynamicRange = stats.max / Math.max(stats.min, 1e-6);

        if (dynamicRange > 10000) {
            // 매우 높은 다이나믹 레인지 (예: 태양 포함)
            exposure *= 0.7;
            if (this.#enableDebugLogs) {
                keepLog(`  - 높은 DR 보정 (${dynamicRange.toFixed(0)}:1): x0.7`);
            }
        } else if (dynamicRange > 1000) {
            exposure *= 0.85;
            if (this.#enableDebugLogs) {
                keepLog(`  - 중간 DR 보정 (${dynamicRange.toFixed(0)}:1): x0.85`);
            }
        }

        // 4. 평균 휘도 기반 추가 보정
        if (stats.average > 2.0) {
            // 전반적으로 밝은 씬
            exposure *= 0.8;
            if (this.#enableDebugLogs) {
                keepLog(`  - 밝은 씬 보정: x0.8`);
            }
        } else if (stats.average < 0.1) {
            // 전반적으로 어두운 씬
            exposure *= 1.2;
            if (this.#enableDebugLogs) {
                keepLog(`  - 어두운 씬 보정: x1.2`);
            }
        }

        // 5. 최종 클램핑
        const finalExposure = Math.max(0.1, Math.min(10.0, exposure));

        if (this.#enableDebugLogs) {
            keepLog(`  - 최종 노출: ${finalExposure.toFixed(3)}`);
        }

        return finalExposure;
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
            exposure: fileExposure
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
