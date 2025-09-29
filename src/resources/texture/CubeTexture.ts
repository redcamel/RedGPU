import RedGPUContext from "../../context/RedGPUContext";
import calculateTextureByteSize from "../../utils/texture/calculateTextureByteSize";
import getMipLevelCount from "../../utils/texture/getMipLevelCount";
import ManagementResourceBase from "../ManagementResourceBase";
import ResourceStateCubeTexture from "../resourceManager/resourceState/texture/ResourceStateCubeTexture";
import imageBitmapToGPUTexture from "../../utils/texture/imageBitmapToGPUTexture";
import loadAndCreateBitmapImage from "../../utils/texture/loadAndCreateBitmapImage";

const MANAGED_STATE_KEY = 'managedCubeTextureState'

type SrcInfo = string[] | { srcList: string[], cacheKey: string }

/**
 * CubeTexture
 * @category Texture
 */
class CubeTexture extends ManagementResourceBase {
	/** 기본 뷰 디스크립터 */
	static defaultViewDescriptor: GPUTextureViewDescriptor = {
		dimension: 'cube',
		aspect: 'all',
		baseMipLevel: 0,
		mipLevelCount: 1,
		baseArrayLayer: 0,
		arrayLayerCount: 6,
	}
	/** GPUTexture 객체 */
	#gpuTexture: GPUTexture
	/** 텍스처 소스 경로 리스트 */
	#srcList: string[]
	/** 밉맵 레벨 개수 */
	#mipLevelCount: number
	/** 밉맵 사용 여부 */
	#useMipmap: boolean
	/** 이미지 비트맵 객체 리스트 */
	#imgBitmaps: ImageBitmap[]
	/** 비디오 메모리 사용량(byte) */
	#videoMemorySize: number = 0
	/** 텍스처 포맷 */
	readonly #format: GPUTextureFormat
	/** 로드 완료 콜백 */
	readonly #onLoad: (cubeTextureInstance: CubeTexture) => void;
	/** 에러 콜백 */
	readonly #onError: (error: Error) => void;

	/**
	 * CubeTexture 생성자
	 * @param redGPUContext - RedGPUContext 인스턴스
	 * @param srcList - 큐브 텍스처 소스 정보
	 * @param useMipMap - 밉맵 사용 여부(기본값: true)
	 * @param onLoad - 로드 완료 콜백
	 * @param onError - 에러 콜백
	 * @param format - 텍스처 포맷(옵션)
	 */
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

	/** 뷰 디스크립터 반환 */
	get viewDescriptor() {
		return {
			...CubeTexture.defaultViewDescriptor,
			mipLevelCount: this.#mipLevelCount
		}
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

	/** 텍스처 소스 경로 리스트 반환 */
	get srcList(): string[] {
		return this.#srcList;
	}

	/** 텍스처 소스 경로 리스트 설정 및 로드 */
	set srcList(value: SrcInfo) {
		this.#srcList = this.#getParsedSrc(value);
		this.cacheKey = this.#getCacheKey(value);
		if (this.#srcList?.length) this.#loadBitmapTexture(this.#srcList);
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
		this.#srcList = null
		this.cacheKey = null
		if (temp) temp.destroy()
	}

	/**
	 * GPUTexture를 직접 설정합니다.
	 * @param gpuTexture - GPUTexture 객체
	 * @param cacheKey - 캐시 키(옵션)
	 * @param useMipmap - 밉맵 사용 여부(기본값: true)
	 * @category Texture
	 */
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

	/**
	 * SrcInfo로부터 캐시 키를 생성합니다.
	 * @param srcInfo - 큐브 텍스처 소스 정보
	 * @returns 캐시 키 문자열
	 * @category Texture
	 */
	#getCacheKey(srcInfo?: SrcInfo): string {
		if (!srcInfo) return this.uuid;
		if (srcInfo instanceof Array) {
			if (!srcInfo.length) return this.uuid
			return srcInfo.toString();
		} else {
			return srcInfo.cacheKey || srcInfo.srcList.toString();
		}
	}

	/**
	 * SrcInfo로부터 srcList 배열을 추출합니다.
	 * @param srcInfo - 큐브 텍스처 소스 정보
	 * @returns srcList 문자열 배열
	 * @category Texture
	 */
	#getParsedSrc(srcInfo?: SrcInfo): string[] {
		return srcInfo instanceof Array ? srcInfo : srcInfo?.srcList
	}

	/**
	 * GPUTexture 객체를 설정합니다.
	 * @param value - GPUTexture 객체
	 * @category Texture
	 */
	#setGpuTexture(value: GPUTexture) {
		this.#gpuTexture = value;
		if (!value) this.#imgBitmaps = null
		this.__fireListenerList();
	}

	/**
	 * 리소스를 등록합니다.
	 * @category Texture
	 */
	#registerResource() {
		this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateCubeTexture(this));
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

	/**
	 * 큐브 텍스처 이미지를 비동기 로드합니다.
	 * @param srcList - 이미지 경로 리스트
	 * @category Texture
	 */
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
 * 주어진 URL 배열로부터 이미지를 로드하고, 각 이미지를 비트맵으로 생성합니다.
 * @param srcList - 이미지 URL 배열
 * @returns ImageBitmap 객체 배열을 반환하는 Promise
 * @category Texture
 */
async function loadAndCreateBitmapImages(srcList: string[]): Promise<ImageBitmap[]> {
	const promises = srcList.map(src => loadAndCreateBitmapImage(src));
	return await Promise.all(promises)
}
