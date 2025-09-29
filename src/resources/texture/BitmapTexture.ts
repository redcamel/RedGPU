
import RedGPUContext from "../../context/RedGPUContext";
import getAbsoluteURL from "../../utils/file/getAbsoluteURL";
import calculateTextureByteSize from "../../utils/texture/calculateTextureByteSize";
import getMipLevelCount from "../../utils/texture/getMipLevelCount";
import ManagementResourceBase from "../ManagementResourceBase";
import ResourceStateBitmapTexture from "../resourceManager/resourceState/texture/ResourceStateBitmapTexture";
import imageBitmapToGPUTexture from "./core/imageBitmapToGPUTexture";
import loadAndCreateBitmapImage from "./core/loadAndCreateBitmapImage";
const MANAGED_STATE_KEY = 'managedBitmapTextureState'
type SrcInfo = string | { src: string, cacheKey: string }

/**
 * BitmapTexture
 * @category Texture
 */
class BitmapTexture extends ManagementResourceBase {
	/** GPUTexture 객체 */
	#gpuTexture: GPUTexture
	/** 텍스처 소스 경로 */
	#src: string
	/** 밉맵 레벨 개수 */
	#mipLevelCount: number
	/** 밉맵 사용 여부 */
	#useMipmap: boolean
	/** 이미지 비트맵 객체 */
	#imgBitmap: ImageBitmap
	/** 비디오 메모리 사용량(byte) */
	#videoMemorySize: number = 0
	/** 프리멀티플 알파 사용 여부 */
	#usePremultiplyAlpha: boolean = true
	/** 텍스처 포맷 */
	readonly #format: GPUTextureFormat
	/** 로드 완료 콜백 */
	readonly #onLoad: (textureInstance: BitmapTexture) => void;
	/** 에러 콜백 */
	readonly #onError: (error: Error) => void;

	/**
	 * BitmapTexture 생성자
	 * @param redGPUContext - RedGPUContext 인스턴스
	 * @param src - 텍스처 소스 정보
	 * @param useMipMap - 밉맵 사용 여부(기본값: true)
	 * @param onLoad - 로드 완료 콜백
	 * @param onError - 에러 콜백
	 * @param format - 텍스처 포맷(옵션)
	 * @param usePremultiplyAlpha - 프리멀티플 알파 사용 여부(기본값: false)
	 */
	constructor(
		redGPUContext: RedGPUContext,
		src?: SrcInfo,
		useMipMap: boolean = true,
		onLoad?: (textureInstance?: BitmapTexture) => void,
		onError?: (error: Error) => void,
		format?: GPUTextureFormat,
		usePremultiplyAlpha: boolean = false
	) {
		super(redGPUContext, MANAGED_STATE_KEY);
		this.#onLoad = onLoad
		this.#onError = onError
		this.#usePremultiplyAlpha = usePremultiplyAlpha
		this.#useMipmap = useMipMap
		this.#format = format || navigator.gpu.getPreferredCanvasFormat()
		if (src) {
			this.#src = this.#getParsedSrc(src);
			this.cacheKey = this.#getCacheKey(src)
			const {table} = this.targetResourceManagedState
			let target: ResourceStateBitmapTexture = table.get(this.cacheKey)
			if (target) {
				// keepLog('cache target', target)
				const targetTexture = target.texture as BitmapTexture
				this.#onLoad?.(targetTexture)
				return targetTexture
			} else {
				this.src = src;
				this.#registerResource()
			}
		} else {
			// TODO - 없으면 등록을 안하는게 맞는건지 확인해야함
		}
	}

	/** 텍스처의 가로 크기 */
	get width(): number {
		return this.#imgBitmap?.width || 0
	}

	/** 텍스처의 세로 크기 */
	get height(): number {
		return this.#imgBitmap?.height || 0
	}

	/** 프리멀티플 알파 사용 여부 반환 */
	get usePremultiplyAlpha(): boolean {
		return this.#usePremultiplyAlpha;
	}

	/** 비디오 메모리 사용량(byte) 반환 */
	get videoMemorySize(): number {
		return this.#videoMemorySize;
	}

	/** GPUTexture 객체 반환 */
	get gpuTexture(): GPUTexture {
		return this.#gpuTexture;
	}

	/** 밉맵 레벨 개수 반환 */
	get mipLevelCount(): number {
		return this.#mipLevelCount;
	}

	/** 텍스처 소스 경로 반환 */
	get src(): string {
		return this.#src;
	}

	/** 텍스처 소스 경로 설정 및 로드 */
	set src(value: SrcInfo) {
		this.#src = this.#getParsedSrc(value);
		this.cacheKey = this.#getCacheKey(value);
		if (this.#src) this.#loadBitmapTexture(this.#src);
	}

	/** 밉맵 사용 여부 반환 */
	get useMipmap(): boolean {
		return this.#useMipmap;
	}

	/** 밉맵 사용 여부 설정 및 텍스처 재생성 */
	set useMipmap(value: boolean) {
		this.#useMipmap = value;
		this.#createGPUTexture()
	}

	/** 텍스처와 리소스 해제 */
	destroy() {
		//TODO 체크
		const temp = this.#gpuTexture
		this.#setGpuTexture(null);
		this.__fireListenerList(true)
		this.#unregisterResource()
		this.cacheKey = null
		this.#src = null
		if (temp) temp.destroy()
	}

	/**
	 * SrcInfo로부터 캐시 키를 생성합니다.
	 * @param srcInfo - 텍스처 소스 정보
	 * @returns 캐시 키 문자열
	 * @category Texture
	 */
	#getCacheKey(srcInfo?: SrcInfo): string {
		if (!srcInfo) {
			return this.uuid;
		}
		if (typeof srcInfo === 'string') {
			return getAbsoluteURL(window.location.href, srcInfo);
		} else {
			return srcInfo.cacheKey || getAbsoluteURL(window.location.href, srcInfo.src);
		}
	}

	/**
	 * SrcInfo로부터 src 문자열을 추출합니다.
	 * @param srcInfo - 텍스처 소스 정보
	 * @returns src 문자열
	 * @category Texture
	 */
	#getParsedSrc(srcInfo?: SrcInfo): string {
		return typeof srcInfo === 'string' ? srcInfo : srcInfo.src
	}

	/**
	 * GPUTexture 객체를 설정합니다.
	 * @param value - GPUTexture 객체
	 * @category Texture
	 */
	#setGpuTexture(value: GPUTexture) {
		this.#gpuTexture = value;
		if (!value) this.#imgBitmap = null
		this.__fireListenerList();
	}

	/**
	 * 리소스를 등록합니다.
	 * @category Texture
	 */
	#registerResource() {
		this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateBitmapTexture(this));
	}

	/**
	 * 리소스 등록을 해제합니다.
	 * @category Texture
	 */
	#unregisterResource() {
		this.redGPUContext.resourceManager.unregisterManagementResource(this);
	}

	/**
	 * GPUTexture 객체를 생성합니다.
	 * @category Texture
	 */
	#createGPUTexture() {
		const {gpuDevice, resourceManager} = this.redGPUContext
		const {mipmapGenerator} = resourceManager
		if (this.#gpuTexture) {
			this.#gpuTexture.destroy()
			this.#gpuTexture = null
		}
		this.targetResourceManagedState.videoMemory -= this.#videoMemorySize
		this.#videoMemorySize = 0
		const {width: W, height: H} = this.#imgBitmap
		this.#mipLevelCount = 1
		// 텍스쳐 생성
		const textureDescriptor: GPUTextureDescriptor = {
			size: [W, H],
			format: this.#format,
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
			label: this.#src
		};
		// // 밉맵을 생성할꺼면 소스를 계산해서... 밉맵 카운트를 추가 정의한다.
		if (this.#useMipmap) {
			this.#mipLevelCount = getMipLevelCount(W, H)
			textureDescriptor.mipLevelCount = this.#mipLevelCount
			textureDescriptor.usage |= GPUTextureUsage.RENDER_ATTACHMENT;
		}
		const newGPUTexture = imageBitmapToGPUTexture(gpuDevice, [this.#imgBitmap], textureDescriptor, this.#usePremultiplyAlpha)
		this.#videoMemorySize = calculateTextureByteSize(newGPUTexture)
		this.targetResourceManagedState.videoMemory += this.#videoMemorySize
		//
		if (this.#useMipmap) mipmapGenerator.generateMipmap(newGPUTexture, textureDescriptor)
		this.#setGpuTexture(newGPUTexture)
		// console.log('오긴오나')
	}

	/**
	 * SVG 이미지를 ImageBitmap으로 변환합니다.
	 * @param src - SVG 이미지 경로
	 * @returns ImageBitmap 객체
	 * @category Texture
	 */
	async #convertSvgToImageBitmap(src: string): Promise<ImageBitmap> {
		return new Promise((resolve, reject) => {
			const svgImage = new Image();
			svgImage.src = src;
			svgImage.onload = () => {
				const canvas = document.createElement("canvas");
				canvas.width = svgImage.width || 512; // 기본 크기 설정 (512x512)
				canvas.height = svgImage.height || 512;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					reject(new Error("Canvas context could not be created."));
					return;
				}
				ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // 투명 배경으로 초기화
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				// SVG 이미지를 Canvas에 렌더링
				ctx.drawImage(svgImage, 0, 0, canvas.width, canvas.height);
				// Canvas 데이터를 ImageBitmap으로 변환
				createImageBitmap(canvas, {
					colorSpaceConversion: 'none',
					premultiplyAlpha: this.#usePremultiplyAlpha ? 'premultiply' : 'none'
				})
					.then(resolve)
					.catch(reject);
			};
			svgImage.onerror = (error) => {
				reject(new Error(`Failed to load SVG: ${error}`));
			};
		});
	}

	/**
	 * 비트맵 텍스처를 비동기 로드합니다.
	 * @param src - 이미지 경로
	 * @category Texture
	 */
	async #loadBitmapTexture(src: string) {
		try {
			if (src.endsWith(".svg")) {
				// SVG 파일일 경우 변환 처리
				this.#imgBitmap = await this.#convertSvgToImageBitmap(src);
			} else {
				// 기본 비트맵 로드 처리
				this.#imgBitmap = await loadAndCreateBitmapImage(src, "none", this.#usePremultiplyAlpha ? 'premultiply' : 'none');
			}
			this.#createGPUTexture();
			this.#onLoad?.(this);
		} catch (error) {
			console.error(error);
			this.#onError?.(error);
		}
	}
}

Object.freeze(BitmapTexture)
export default BitmapTexture
