import RedGPUContext from "../../context/RedGPUContext";
import calculateTextureByteSize from "../../utils/math/calculateTextureByteSize";
import getMipLevelCount from "../../utils/math/getMipLevelCount";
import ManagementResourceBase from "../ManagementResourceBase";
import ResourceStateCubeTexture from "../resourceManager/resourceState/texture/ResourceStateCubeTexture";
import imageBitmapToGPUTexture from "./core/imageBitmapToGPUTexture";
import loadAndCreateBitmapImage from "./core/loadAndCreateBitmapImage";

const MANAGED_STATE_KEY = 'managedCubeTextureState'
type SrcInfo = string[] | { srcList: string[], cacheKey: string }

class CubeTexture extends ManagementResourceBase {
	static defaultViewDescriptor: GPUTextureViewDescriptor = {
		dimension: 'cube',
		aspect: 'all',
		baseMipLevel: 0,
		mipLevelCount: 1,
		baseArrayLayer: 0,
		arrayLayerCount: 6,
	}
	#gpuTexture: GPUTexture
	#srcList: string[]
	#mipLevelCount: number
	#useMipmap: boolean
	#imgBitmaps: ImageBitmap[]
	#videoMemorySize: number = 0
	readonly #format: GPUTextureFormat
	readonly #onLoad: (cubeTextureInstance: CubeTexture) => void;
	readonly #onError: (error: Error) => void;

	constructor(
		redGPUContext: RedGPUContext,
		srcList: SrcInfo,
		useMipMap: boolean = true,
		onLoad?: (cubeTextureInstance?: CubeTexture) => void,
		onError?: (error: Error) => void,
		format?: GPUTextureFormat
	) {
		super(redGPUContext, MANAGED_STATE_KEY);
		this.#onLoad = onLoad
		this.#onError = onError
		this.#useMipmap = useMipMap
		this.#format = format || navigator.gpu.getPreferredCanvasFormat()
		this.#srcList = this.#getParsedSrc(srcList);
		this.cacheKey = this.#getCacheKey(srcList);
		const {table} = this.targetResourceManagedState
		// keepLog('srcList', srcList)
		if (srcList) {
			let target: ResourceStateCubeTexture = table.get(this.cacheKey)
			if (target) {
				const targetTexture = target.texture as CubeTexture
				this.#onLoad?.(targetTexture)
				return targetTexture
			} else {
				this.srcList = srcList;
				this.#registerResource()
			}
		} else {
		}
	}

	get viewDescriptor() {
		return {
			...CubeTexture.defaultViewDescriptor,
			mipLevelCount: this.#mipLevelCount
		}
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

	get srcList(): string[] {
		return this.#srcList;
	}

	set srcList(value: SrcInfo) {
		this.#srcList = this.#getParsedSrc(value);
		this.cacheKey = this.#getCacheKey(value);
		if (this.#srcList?.length) this.#loadBitmapTexture(this.#srcList);
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
		this.#unregisterResource()
		this.#srcList = null
		this.cacheKey = null
		if (temp) temp.destroy()
	}

	setGPUTextureDirectly(
		gpuTexture: GPUTexture,
		cacheKey?: string,
		useMipmap: boolean = true
	): void {
		// 기존 텍스처 정리
		if (this.#gpuTexture) {
			this.#gpuTexture.destroy();
			this.targetResourceManagedState.videoMemory -= this.#videoMemorySize;
		}
		// keepLog('gpuTexture', gpuTexture)
		// 새 텍스처 설정
		this.#gpuTexture = gpuTexture;
		this.#useMipmap = useMipmap
		this.#mipLevelCount = gpuTexture.mipLevelCount;
		// this.#mipLevelCount = getMipLevelCount(gpuTexture.width, gpuTexture.height);
		this.cacheKey = cacheKey || `direct_${this.uuid}`;
		// 메모리 사용량 계산
		this.#videoMemorySize = calculateTextureByteSize(gpuTexture);
		this.targetResourceManagedState.videoMemory += this.#videoMemorySize;
		// 리스너들에게 업데이트 알림
		this.__fireListenerList();
	}

	#getCacheKey(srcInfo?: SrcInfo): string {
		if (!srcInfo) return this.uuid;
		if (srcInfo instanceof Array) {
			if (!srcInfo.length) return this.uuid
			return srcInfo.toString();
		} else {
			return srcInfo.cacheKey || srcInfo.srcList.toString();
		}
	}

	#getParsedSrc(srcInfo?: SrcInfo): string[] {
		return srcInfo instanceof Array ? srcInfo : srcInfo?.srcList
	}

	#setGpuTexture(value: GPUTexture) {
		this.#gpuTexture = value;
		if (!value) this.#imgBitmaps = null
		this.__fireListenerList();
	}

	#registerResource() {
		this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateCubeTexture(this));
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
		this.#mipLevelCount = 1;
		{
			// 텍스쳐 생성
			const imgBitmaps = this.#imgBitmaps
			const firstImgBitmap = imgBitmaps[0]
			const {width: W, height: H} = firstImgBitmap
			const depthOrArrayLayers = 6
			const textureDescriptor: GPUTextureDescriptor = {
				size: [W, H, depthOrArrayLayers],
				format: this.#format,
				usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
				label: `cubeTexture_${this.#srcList?.toString() || this.uuid}`
			};
			// // 밉맵을 생성할꺼면 소스를 계산해서... 밉맵 카운트를 추가 정의한다.
			if (this.#useMipmap) {
				this.#mipLevelCount = getMipLevelCount(W, H);
				textureDescriptor.mipLevelCount = this.#mipLevelCount
				textureDescriptor.usage |= GPUTextureUsage.RENDER_ATTACHMENT;
			}
			const newGPUTexture = imageBitmapToGPUTexture(gpuDevice, imgBitmaps, textureDescriptor)
			this.targetResourceManagedState.videoMemory -= this.#videoMemorySize
			this.#videoMemorySize = calculateTextureByteSize(newGPUTexture)
			this.targetResourceManagedState.videoMemory += this.#videoMemorySize
			if (this.#useMipmap) mipmapGenerator.generateMipmap(newGPUTexture, textureDescriptor)
			this.#setGpuTexture(newGPUTexture)
		}
	}

	async #loadBitmapTexture(srcList: string[]) {
		this.#imgBitmaps = await loadAndCreateBitmapImages(srcList);
		try {
			this.#createGPUTexture()
			this.#onLoad?.(this)
		} catch (error) {
			console.error(error);
			this.#onError?.(error)
		}
	}
}

Object.freeze(CubeTexture)
export default CubeTexture

/**
 * Loads images from the given array of URLs and creates a bitmap image for each image.
 * @param {string[]} srcList - The array of image URLs to load and create bitmap images from.
 * @return {Promise<ImageBitmap[]>} - A promise that resolves to an array of ImageBitmap objects, representing the loaded bitmap images.
 */
async function loadAndCreateBitmapImages(srcList: string[]): Promise<ImageBitmap[]> {
	const promises = srcList.map(src => loadAndCreateBitmapImage(src));
	return await Promise.all(promises)
}
