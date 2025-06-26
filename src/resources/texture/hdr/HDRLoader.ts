import {keepLog} from "../../../utils";

export interface HDRData {
	data: Float32Array;
	width: number;
	height: number;
	// 🆕 HDR 메타데이터 추가
	exposure?: number;          // 파일에서 읽은 노출값
	whiteBalance?: number;      // 화이트 밸런스
	gamma?: number;            // 감마값
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

export interface HDRLoadOptions {
	autoExposure?: boolean;     // 자동 노출 계산
	targetExposure?: number;    // 수동 노출값
	preprocess?: boolean;       // 전처리 적용 여부
	brightnessBias?: number;    // 밝기 편향 (-2.0 ~ +2.0 EV)
}

class HDRLoader {
	#enableDebugLogs: boolean = true;

	constructor(enableDebugLogs: boolean = true) {
		this.#enableDebugLogs = enableDebugLogs;
	}

	set enableDebugLogs(value: boolean) {
		this.#enableDebugLogs = value;
	}

	get enableDebugLogs(): boolean {
		return this.#enableDebugLogs;
	}

	/**
	 * 🎯 개선된 HDR 파일 로드 (노출 옵션 포함)
	 */
	async loadHDRFile(src: string, options: HDRLoadOptions = {}): Promise<HDRData> {
		const {
			autoExposure = true,
			targetExposure,
			preprocess = true,
			brightnessBias = 0
		} = options;

		if (this.#enableDebugLogs) {
			keepLog(`HDR 파일 로딩 시작: ${src}`, options);
		}

		const response = await fetch(src);
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const buffer = await response.arrayBuffer();
		const uint8Array = new Uint8Array(buffer);

		// 🔍 기본 HDR 데이터 파싱
		const rawHdrData = this.#parseHDRFile(uint8Array, src);

		// 🎯 노출 및 전처리 적용
		if (preprocess) {
			return this.#preprocessHDRData(rawHdrData, {
				autoExposure,
				targetExposure,
				brightnessBias
			});
		}

		return rawHdrData;
	}

	/**
	 * 🎯 HDR 데이터 전처리 (노출, 휘도 분석 등)
	 */
	#preprocessHDRData(hdrData: HDRData, options: {
		autoExposure: boolean;
		targetExposure?: number;
		brightnessBias: number;
	}): HDRData {
		if (this.#enableDebugLogs) {
			keepLog('HDR 전처리 시작...');
		}

		// 🔍 휘도 분석
		const luminanceStats = this.#analyzeLuminance(hdrData);

		// 🎯 노출값 결정
		let finalExposure: number;

		if (options.targetExposure !== undefined) {
			// 수동 노출값 사용
			finalExposure = options.targetExposure;
			if (this.#enableDebugLogs) {
				keepLog(`수동 노출값 사용: ${finalExposure.toFixed(3)}`);
			}
		} else if (options.autoExposure) {
			// 자동 노출 계산
			finalExposure = this.#calculateOptimalExposure(luminanceStats);
			if (this.#enableDebugLogs) {
				keepLog(`자동 노출값 계산: ${finalExposure.toFixed(3)}`);
			}
		} else {
			// 기본값 (파일에서 읽은 값 또는 1.0)
			finalExposure = hdrData.exposure || 1.0;
		}

		// 🔧 밝기 편향 적용 (EV 단위)
		if (options.brightnessBias !== 0) {
			const biasMultiplier = Math.pow(2, options.brightnessBias);
			finalExposure *= biasMultiplier;
			if (this.#enableDebugLogs) {
				keepLog(`밝기 편향 적용: ${options.brightnessBias.toFixed(2)} EV (×${biasMultiplier.toFixed(3)})`);
			}
		}

		// 🎞️ 노출 적용
		const processedData = this.#applyExposureToData(hdrData.data, finalExposure);

		return {
			...hdrData,
			data: processedData,
			recommendedExposure: finalExposure,
			luminanceStats
		};
	}

	/**
	 * 🔍 휘도 분석 (HDRTexture에서 이동)
	 */
	#analyzeLuminance(hdrData: HDRData): { min: number; max: number; average: number; median: number } {
		const luminanceValues: number[] = [];
		const totalPixels = hdrData.width * hdrData.height;

		// 휘도 계산 (ITU-R BT.709)
		for (let i = 0; i < hdrData.data.length; i += 4) {
			const r = hdrData.data[i];
			const g = hdrData.data[i + 1];
			const b = hdrData.data[i + 2];
			const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
			luminanceValues.push(luminance);
		}

		// 통계 계산
		luminanceValues.sort((a, b) => a - b);

		const min = luminanceValues[0];
		const max = luminanceValues[luminanceValues.length - 1];
		const average = luminanceValues.reduce((sum, val) => sum + val, 0) / totalPixels;
		const median = luminanceValues[Math.floor(totalPixels / 2)];

		if (this.#enableDebugLogs) {
			keepLog('휘도 분석 결과:', {
				최소: min.toFixed(4),
				최대: max.toFixed(4),
				평균: average.toFixed(4),
				중간: median.toFixed(4)
			});
		}

		return { min, max, average, median };
	}

	/**
	 * 🎯 최적 노출값 계산 (간소화된 버전)
	 */
	#calculateOptimalExposure(stats: { min: number; max: number; average: number; median: number }): number {
		const { average, median, max } = stats;

		// 🔸 기본 키값 (라인하르트 기준)
		let keyValue = 0.18;

		// 🔸 장면 분석에 따른 키값 조정
		if (average < 0.01) {
			keyValue = 0.5;  // 매우 어두운 장면
		} else if (average < 0.05) {
			keyValue = 0.36; // 어두운 장면
		} else if (average > 2.0) {
			keyValue = 0.09; // 밝은 장면
		}

		// 🔸 로그 평균 근사 (단순화)
		const logAverage = Math.max(
			Math.pow(average * median, 0.5), // 기하평균 근사
			0.001
		);

		// 🔸 기본 노출 계산
		let exposure = keyValue / logAverage;

		// 🔸 어두운 장면 부스트
		if (average < 0.05) {
			exposure *= 2.5; // 어두운 장면 더 밝게
		}

		// 🔸 하이라이트 클리핑 방지
		if (max > 5.0) {
			exposure *= 0.7; // 너무 밝은 부분 억제
		}

		// 🔸 실용적 범위 제한
		exposure = Math.max(0.1, Math.min(10.0, exposure));

		return exposure;
	}

	/**
	 * 🎞️ 데이터에 노출 적용
	 */
	#applyExposureToData(data: Float32Array, exposure: number): Float32Array {
		const result = new Float32Array(data.length);

		for (let i = 0; i < data.length; i += 4) {
			result[i] = data[i] * exposure;       // R
			result[i + 1] = data[i + 1] * exposure; // G
			result[i + 2] = data[i + 2] * exposure; // B
			result[i + 3] = data[i + 3];          // A
		}

		return result;
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

		if (src.toLowerCase().endsWith('.hdr')) {
			if (this.#enableDebugLogs) {
				keepLog('파일 첫 200바이트:');
				this.#hexDump(uint8Array.slice(0, 200));
			}

			const hdrData = this.#parseRGBE(uint8Array);

			if (this.#enableDebugLogs) {
				this.#debugHDRInfo(hdrData);
			}

			return hdrData;

		} else if (src.toLowerCase().endsWith('.exr')) {
			throw new Error('EXR format not supported yet');
		} else {
			throw new Error(`Unsupported HDR format: ${src}`);
		}
	}

	/**
	 * 🔍 RGBE 헤더에서 노출 정보 추출
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

		// 🆕 헤더 정보 파싱 (노출 정보 포함)
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

		// 🆕 헤더에서 노출 정보 추출
		let fileExposure: number | undefined;
		if (header.EXPOSURE) {
			fileExposure = parseFloat(header.EXPOSURE);
		}

		if (this.#enableDebugLogs && fileExposure) {
			keepLog(`파일 노출값 발견: ${fileExposure.toFixed(3)}`);
		}

		// RGBE 데이터 파싱 (기존 코드와 동일)
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
			exposure: fileExposure // 🆕 파일 노출값 포함
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

		const header = new TextDecoder('ascii', { fatal: false })
			.decode(data.slice(0, 50));

		if (header.startsWith('#?RADIANCE') || header.startsWith('#?RGBE')) {
			return { isValid: true, format: 'RGBE/Radiance' };
		}

		if (header.includes('RADIANCE') || header.includes('RGBE')) {
			return { isValid: true, format: 'RGBE/Radiance (variant)' };
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

		// 새로운 RLE 포맷 확인 (첫 4바이트가 0x02, 0x02, width>>8, width&0xff)
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

		return { data: scanlineData, nextOffset: offset };
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
		keepLog('첫 4픽셀 값:');
		for (let i = 0; i < Math.min(16, hdrData.data.length); i += 4) {
			const r = hdrData.data[i];
			const g = hdrData.data[i + 1];
			const b = hdrData.data[i + 2];
			const a = hdrData.data[i + 3];
			keepLog(`픽셀 ${i/4}: R=${r.toFixed(3)}, G=${g.toFixed(3)}, B=${b.toFixed(3)}, A=${a.toFixed(3)}`);
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
			keepLog(`${i.toString(16).padStart(8, '0')}: ${hex.padEnd(48, ' ')} |${ascii}|`);
		}
	}
}

export default HDRLoader;
