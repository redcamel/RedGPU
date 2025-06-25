export interface HDRData {
	data: Float32Array;
	width: number;
	height: number;
}

export interface FileValidation {
	isValid: boolean;
	format: string;
	error?: string;
}

class HDRLoader {
	#enableDebugLogs: boolean = false;

	constructor(enableDebugLogs: boolean = false) {
		this.#enableDebugLogs = enableDebugLogs;
	}

	/**
	 * HDR 파일을 로드하고 파싱합니다
	 */
	async loadHDRFile(src: string): Promise<HDRData> {
		if (this.#enableDebugLogs) {
			console.log(`HDR 파일 로딩 시작: ${src}`);
		}

		const response = await fetch(src);
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const buffer = await response.arrayBuffer();
		const uint8Array = new Uint8Array(buffer);

		if (this.#enableDebugLogs) {
			console.log(`파일 크기: ${uint8Array.length} bytes`);
		}

		return this.#parseHDRFile(uint8Array, src);
	}

	/**
	 * HDR 파일 데이터를 파싱합니다
	 */
	#parseHDRFile(uint8Array: Uint8Array, src: string): HDRData {
		const validation = this.#validateHDRFile(uint8Array);

		if (this.#enableDebugLogs) {
			console.log(`파일 형식: ${validation.format}`);
		}

		if (!validation.isValid) {
			throw new Error(validation.error || '지원되지 않는 파일 형식입니다');
		}

		if (src.toLowerCase().endsWith('.hdr')) {
			if (this.#enableDebugLogs) {
				console.log('파일 첫 200바이트:');
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
	 * 디버그 로그 활성화/비활성화
	 */
	setDebugLogs(enabled: boolean): void {
		this.#enableDebugLogs = enabled;
	}

	/**
	 * RGBE 포맷 파싱
	 */
	#parseRGBE(uint8Array: Uint8Array): HDRData {
		let offset = 0;
		let line = '';
		const header: Record<string, string> = {};

		// 첫 번째 라인 ('#?RADIANCE' 또는 '#?RGBE')
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

			if (line.trim() === '') break; // 빈 줄이면 헤더 끝

			const equalIndex = line.indexOf('=');
			if (equalIndex > 0) {
				const key = line.substring(0, equalIndex).trim();
				const value = line.substring(equalIndex + 1).trim();
				header[key] = value;
			}
		}

		// 해상도 라인 파싱 (-Y height +X width)
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

		if (this.#enableDebugLogs) {
			console.log(`HDR 해상도: ${width} x ${height}`);
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

				// RGBE를 Float RGB로 변환
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

		return { data: pixelData, width, height };
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

		console.log(`HDR 정보:`);
		console.log(`크기: ${hdrData.width} x ${hdrData.height}`);
		console.log(`데이터 길이: ${hdrData.data.length}`);
		console.log(`예상 픽셀 수: ${hdrData.width * hdrData.height * 4}`);

		// 첫 몇 픽셀의 값 확인
		console.log('첫 4픽셀 값:');
		for (let i = 0; i < Math.min(16, hdrData.data.length); i += 4) {
			const r = hdrData.data[i];
			const g = hdrData.data[i + 1];
			const b = hdrData.data[i + 2];
			const a = hdrData.data[i + 3];
			console.log(`픽셀 ${i/4}: R=${r.toFixed(3)}, G=${g.toFixed(3)}, B=${b.toFixed(3)}, A=${a.toFixed(3)}`);
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
			console.log(`${i.toString(16).padStart(8, '0')}: ${hex.padEnd(48, ' ')} |${ascii}|`);
		}
	}
}

export default HDRLoader;
