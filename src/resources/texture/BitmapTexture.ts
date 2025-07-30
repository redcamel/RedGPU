import RedGPUContext from "../../context/RedGPUContext";
import {keepLog} from "../../utils";
import getAbsoluteURL from "../../utils/file/getAbsoluteURL";
import calculateTextureByteSize from "../../utils/math/calculateTextureByteSize";
import getMipLevelCount from "../../utils/math/getMipLevelCount";
import ManagementResourceBase from "../ManagementResourceBase";
import ResourceStateBitmapTexture from "../resourceManager/resourceState/texture/ResourceStateBitmapTexture";
import imageBitmapToGPUTexture from "./core/imageBitmapToGPUTexture";
import loadAndCreateBitmapImage from "./core/loadAndCreateBitmapImage";

const MANAGED_STATE_KEY = 'managedBitmapTextureState'
type SrcInfo = string | { src: string, cacheKey: string }

class BitmapTexture extends ManagementResourceBase {
	#gpuTexture: GPUTexture
	#src: string
	#mipLevelCount: number
	#useMipmap: boolean
	#imgBitmap: ImageBitmap
	#videoMemorySize: number = 0
	#usePremultiplyAlpha: boolean = true
	readonly #format: GPUTextureFormat
	readonly #onLoad: (textureInstance: BitmapTexture) => void;
	readonly #onError: (error: Error) => void;

	get width(): number {
		return this.#imgBitmap?.width || 0
	}

	get height(): number {
		return this.#imgBitmap?.height || 0
	}

	#getCacheKey(srcInfo?: SrcInfo): string {
		if (!srcInfo) return this.uuid;
		if (typeof srcInfo === 'string') {
			return getAbsoluteURL(window.location.href, srcInfo);
		} else {
			return srcInfo.cacheKey || getAbsoluteURL(window.location.href, srcInfo.src);
		}
	}
	#getParsedSrc(srcInfo?: SrcInfo): string {
		return typeof srcInfo === 'string' ? srcInfo : srcInfo.src
	}
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

	get usePremultiplyAlpha(): boolean {
		return this.#usePremultiplyAlpha;
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

	set src(value: SrcInfo) {
		this.#src = this.#getParsedSrc(value);;
		this.cacheKey = this.#getCacheKey(value);
		if (this.#src) this.#loadBitmapTexture(this.#src);
	}

	get useMipmap(): boolean {
		return this.#useMipmap;
	}

	set useMipmap(value: boolean) {
		this.#useMipmap = value;
		this.#createGPUTexture()
	}

	destroy() {
		//TODO 체크
		const temp = this.#gpuTexture
		this.#setGpuTexture(null);
		this.__fireListenerList(true)
		this.#src = null
		this.cacheKey = null
		this.#unregisterResource()
		if (temp) temp.destroy()
	}

	#setGpuTexture(value: GPUTexture) {
		this.#gpuTexture = value;
		if (!value) this.#imgBitmap = null
		this.__fireListenerList();
	}

	#registerResource() {
		this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateBitmapTexture(this));
	}

	#unregisterResource() {
		this.redGPUContext.resourceManager.unregisterManagementResource(this);
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
		this.#videoMemorySize = calculateTextureByteSize(textureDescriptor)
		this.targetResourceManagedState.videoMemory += this.#videoMemorySize
		//
		if (this.#useMipmap) mipmapGenerator.generateMipmap(newGPUTexture, textureDescriptor)
		this.#setGpuTexture(newGPUTexture)
		// console.log('오긴오나')
	}

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
