import RedGPUContext from "../../context/RedGPUContext";
import calculateTextureByteSize from "../../utils/math/calculateTextureByteSize";
import getMipLevelCount from "../../utils/math/getMipLevelCount";
import ManagedResourceBase from "../ManagedResourceBase";
import basicRegisterResource from "../resourceManager/core/basicRegisterResource";
import basicUnregisterResource from "../resourceManager/core/basicUnregisterResource";
import ResourceStateHDRTexture from "../resourceManager/resourceState/ResourceStateHDRTexture";

const MANAGED_STATE_KEY = 'managedHDRTextureState'

interface HDRData {
	data: Float32Array;
	width: number;
	height: number;
}

class HDRTexture extends ManagedResourceBase {
	#gpuTexture: GPUTexture
	#src: string
	#cacheKey: string
	#mipLevelCount: number
	#useMipmap: boolean
	#hdrData: HDRData
	#videoMemorySize: number = 0
	readonly #format: GPUTextureFormat
	readonly #onLoad: (textureInstance: HDRTexture) => void;
	readonly #onError: (error: Error) => void;

	constructor(
		redGPUContext: RedGPUContext,
		src?: any,
		useMipMap: boolean = true,
		onLoad?: (textureInstance?: HDRTexture) => void,
		onError?: (error: Error) => void,
		format?: GPUTextureFormat
	) {
		super(redGPUContext, MANAGED_STATE_KEY);
		this.#onLoad = onLoad
		this.#onError = onError
		this.#useMipmap = useMipMap
		this.#format = format || 'rgba32float' // HDR용 기본 포맷

		if (src) {
			this.#src = src?.src || src;
			this.#cacheKey = src?.cacheKey || src || this.uuid;
			const {table} = this.targetResourceManagedState
			let target: ResourceStateHDRTexture
			for (const k in table) {
				if (table[k].cacheKey === this.#cacheKey) {
					target = table[k]
					break
				}
			}

			if (target) {
				this.#onLoad?.(this)
				return table[target.uuid].texture
			} else {
				this.src = src;
				this.#registerResource()
			}
		}
	}

	get cacheKey(): string {
		return this.#cacheKey;
	}

	get videoMemorySize(): number {
		return this.#videoMemorySize;
	}

	get gpuTexture(): GPUTexture {
		return this.#gpuTexture;
	}

	get mipLevelCount(): number {
		return this.#mipLevelCount;
	}

	get src(): string {
		return this.#src;
	}

	set src(value: string | any) {
		this.#src = value?.src || value;
		this.#cacheKey = value?.cacheKey || value || this.uuid;
		if (this.#src) this.#loadHDRTexture(this.#src);
	}

	get useMipmap(): boolean {
		return this.#useMipmap;
	}

	set useMipmap(value: boolean) {
		this.#useMipmap = value;
		this.#createGPUTexture()
	}

	destroy() {
		const temp = this.#gpuTexture
		this.#setGpuTexture(null);
		this.__fireListenerList(true)
		this.#src = null
		this.#cacheKey = null
		this.#unregisterResource()
		if (temp) temp.destroy()
	}

	#setGpuTexture(value: GPUTexture) {
		this.#gpuTexture = value;
		if (!value) this.#hdrData = null
		this.__fireListenerList();
	}

	#registerResource() {
		basicRegisterResource(
			this,
			new ResourceStateHDRTexture(this)
		)
	}

	#unregisterResource() {
		basicUnregisterResource(this)
	}

	#createGPUTexture() {
		const {gpuDevice, resourceManager} = this.redGPUContext
		const {mipmapGenerator} = resourceManager

		if (this.#gpuTexture) {
			this.#gpuTexture.destroy()
			this.#gpuTexture = null
		}

		this.targetResourceManagedState.videoMemory -= this.#videoMemorySize
		this.#videoMemorySize = 0

		const {width: W, height: H} = this.#hdrData
		this.#mipLevelCount = 1

		// HDR 텍스처 생성
		const textureDescriptor: GPUTextureDescriptor = {
			size: [W, H],
			format: this.#format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
			label: this.#src
		};

		// 밉맵 설정
		if (this.#useMipmap) {
			this.#mipLevelCount = getMipLevelCount(W, H)
			textureDescriptor.mipLevelCount = this.#mipLevelCount
			textureDescriptor.usage |= GPUTextureUsage.RENDER_ATTACHMENT;
		}

		const newGPUTexture = this.#hdrDataToGPUTexture(gpuDevice, this.#hdrData, textureDescriptor)
		this.#videoMemorySize = calculateTextureByteSize(textureDescriptor)
		this.targetResourceManagedState.videoMemory += this.#videoMemorySize

		if (this.#useMipmap) mipmapGenerator.generateMipmap(newGPUTexture, textureDescriptor)
		this.#setGpuTexture(newGPUTexture)
	}

	#hdrDataToGPUTexture(device: GPUDevice, hdrData: HDRData, textureDescriptor: GPUTextureDescriptor): GPUTexture {
		const texture = device.createTexture(textureDescriptor);

		// HDR 데이터를 GPU 텍스처에 업로드
		device.queue.writeTexture(
			{ texture },
			hdrData.data,
			{
				bytesPerRow: hdrData.width * 16, // rgba32float = 4 bytes * 4 channels
				rowsPerImage: hdrData.height
			},
			{ width: hdrData.width, height: hdrData.height }
		);

		return texture;
	}

	// RGBE 포맷 HDR 파일 파싱
	#parseRGBE(data: Uint8Array): HDRData {
		let pos = 0;
		let width = 0, height = 0;

		// HDR 헤더 파싱
		while (pos < data.length) {
			const line = this.#readLine(data, pos);
			pos += line.length + 1;

			if (line.startsWith('FORMAT=32-bit_rle_rgbe')) continue;
			if (line.startsWith('-Y')) {
				const match = line.match(/-Y (\d+) \+X (\d+)/);
				if (match) {
					height = parseInt(match[1]);
					width = parseInt(match[2]);
					break;
				}
			}
		}

		// RGBE 데이터를 Float32로 변환
		const floatData = new Float32Array(width * height * 4);
		let floatIndex = 0;

		for (let i = pos; i < data.length; i += 4) {
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];
			const e = data[i + 3];

			if (e === 0) {
				floatData[floatIndex++] = 0;
				floatData[floatIndex++] = 0;
				floatData[floatIndex++] = 0;
				floatData[floatIndex++] = 1;
			} else {
				const f = Math.pow(2, e - 128) / 256;
				floatData[floatIndex++] = r * f;
				floatData[floatIndex++] = g * f;
				floatData[floatIndex++] = b * f;
				floatData[floatIndex++] = 1;
			}
		}

		return { data: floatData, width, height };
	}

	#readLine(data: Uint8Array, start: number): string {
		let end = start;
		while (end < data.length && data[end] !== 10) end++;
		return new TextDecoder().decode(data.slice(start, end));
	}

	async #loadHDRTexture(src: string) {
		try {
			const response = await fetch(src);
			const buffer = await response.arrayBuffer();
			const uint8Array = new Uint8Array(buffer);

			if (src.toLowerCase().endsWith('.hdr')) {
				// RGBE HDR 포맷
				this.#hdrData = this.#parseRGBE(uint8Array);
			} else if (src.toLowerCase().endsWith('.exr')) {
				// EXR 포맷 (별도 파서 필요)
				throw new Error('EXR format not supported yet');
			} else {
				throw new Error(`Unsupported HDR format: ${src}`);
			}

			this.#createGPUTexture();
			this.#onLoad?.(this);
		} catch (error) {
			console.error('HDR loading error:', error);
			this.#onError?.(error);
		}
	}
}

Object.freeze(HDRTexture)
export default HDRTexture
