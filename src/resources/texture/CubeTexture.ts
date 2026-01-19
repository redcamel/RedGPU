import RedGPUContext from "../../context/RedGPUContext";
import calculateTextureByteSize from "../../utils/texture/calculateTextureByteSize";
import getMipLevelCount from "../../utils/texture/getMipLevelCount";
import imageBitmapToGPUTexture from "../../utils/texture/imageBitmapToGPUTexture";
import loadAndCreateBitmapImage from "../../utils/texture/loadAndCreateBitmapImage";
import ManagementResourceBase from "../core/ManagementResourceBase";
import ResourceStateCubeTexture from "../core/resourceManager/resourceState/texture/ResourceStateCubeTexture";

const MANAGED_STATE_KEY = 'managedCubeTextureState'
type SrcInfo = string[] | { srcList: string[], cacheKey: string }

/**
 * [KO] 6개의 이미지를 사용하는 큐브 텍스처 클래스입니다.
 * [EN] Cube texture class that uses 6 images.
 *
 * * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.CubeTexture(redGPUContext, [
 *   'right.png', 'left.png',
 *   'top.png', 'bottom.png',
 *   'front.png', 'back.png'
 * ]);
 * ```
 * @category Texture
 */
class CubeTexture extends ManagementResourceBase {
    /** [KO] 기본 뷰 디스크립터 [EN] Default view descriptor */
    static defaultViewDescriptor: GPUTextureViewDescriptor = {
        dimension: 'cube',
        aspect: 'all',
        baseMipLevel: 0,
        mipLevelCount: 1,
        baseArrayLayer: 0,
        arrayLayerCount: 6,
    }
    /** [KO] GPUTexture 객체 [EN] GPUTexture object */
    #gpuTexture: GPUTexture
    /** [KO] 텍스처 소스 경로 리스트 [EN] List of texture source paths */
    #srcList: string[]
    /** [KO] 밉맵 레벨 개수 [EN] Number of mipmap levels */
    #mipLevelCount: number
    /** [KO] 밉맵 사용 여부 [EN] Whether to use mipmaps */
    #useMipmap: boolean
    /** [KO] 이미지 비트맵 객체 리스트 [EN] List of image bitmap objects */
    #imgBitmaps: ImageBitmap[]
    /** [KO] 비디오 메모리 사용량(byte) [EN] Video memory usage in bytes */
    #videoMemorySize: number = 0
    /** [KO] 텍스처 포맷 [EN] Texture format */
    readonly #format: GPUTextureFormat
    /** [KO] 로드 완료 콜백 [EN] Load complete callback */
    readonly #onLoad: (cubeTextureInstance: CubeTexture) => void;
    /** [KO] 에러 콜백 [EN] Error callback */
    readonly #onError: (error: Error) => void;

    /**
     * [KO] CubeTexture 인스턴스를 생성합니다.
     * [EN] Creates a CubeTexture instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param srcList -
     * [KO] 큐브 텍스처 소스 정보 (URL 배열 또는 객체)
     * [EN] Cube texture source information (Array of URLs or object)
     * @param useMipMap -
     * [KO] 밉맵 사용 여부 (기본값: true)
     * [EN] Whether to use mipmaps (default: true)
     * @param onLoad -
     * [KO] 로드 완료 콜백
     * [EN] Load complete callback
     * @param onError -
     * [KO] 에러 콜백
     * [EN] Error callback
     * @param format -
     * [KO] 텍스처 포맷 (선택)
     * [EN] Texture format (optional)
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
        this.#format = format || `${navigator.gpu.getPreferredCanvasFormat()}-srgb` as GPUTextureFormat
        this.#srcList = this.#getParsedSrc(srcList);
        this.cacheKey = this.#getCacheKey(srcList);
        const {table} = this.targetResourceManagedState
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
        }
    }

    /** [KO] 뷰 디스크립터를 반환합니다. [EN] Returns the view descriptor. */
    get viewDescriptor() {
        return {
            ...CubeTexture.defaultViewDescriptor,
            mipLevelCount: this.#mipLevelCount
        }
    }

    /** [KO] 비디오 메모리 사용량(byte)을 반환합니다. [EN] Returns the video memory usage in bytes. */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /** [KO] GPUTexture 객체를 반환합니다. [EN] Returns the GPUTexture object. */
    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    /** [KO] 밉맵 레벨 개수를 반환합니다. [EN] Returns the number of mipmap levels. */
    get mipLevelCount(): number {
        return this.#mipLevelCount;
    }

    /** [KO] 텍스처 소스 경로 리스트를 반환합니다. [EN] Returns the list of texture source paths. */
    get srcList(): string[] {
        return this.#srcList;
    }

    /** [KO] 텍스처 소스 경로 리스트를 설정하고 로드를 시작합니다. [EN] Sets the list of texture source paths and starts loading. */
    set srcList(value: SrcInfo) {
        this.#srcList = this.#getParsedSrc(value);
        this.cacheKey = this.#getCacheKey(value);
        if (this.#srcList?.length) this.#loadBitmapTexture(this.#srcList);
    }

    /** [KO] 밉맵 사용 여부를 반환합니다. [EN] Returns whether mipmaps are used. */
    get useMipmap(): boolean {
        return this.#useMipmap;
    }

    /** [KO] 밉맵 사용 여부를 설정하고 텍스처를 재생성합니다. [EN] Sets whether to use mipmaps and recreates the texture. */
    set useMipmap(value: boolean) {
        this.#useMipmap = value;
        this.#createGPUTexture()
    }

    /** [KO] 텍스처 리소스를 파괴합니다. [EN] Destroys the texture resource. */
    destroy() {
        const temp = this.#gpuTexture
        this.#setGpuTexture(null);
        this.__fireListenerList(true)
        this.#unregisterResource()
        this.#srcList = null
        this.cacheKey = null
        if (temp) temp.destroy()
    }

    /**
     * [KO] GPUTexture를 직접 설정합니다.
     * [EN] Sets the GPUTexture directly.
     * @param gpuTexture -
     * [KO] 설정할 `GPUTexture` 객체
     * [EN] `GPUTexture` object to set
     * @param cacheKey -
     * [KO] 캐시 키 (선택)
     * [EN] Cache key (optional)
     * @param useMipmap -
     * [KO] 밉맵 사용 여부 (기본값: true)
     * [EN] Whether to use mipmaps (default: true)
     */
    setGPUTextureDirectly(
        gpuTexture: GPUTexture,
        cacheKey?: string,
        useMipmap: boolean = true
    ): void {
        if (this.#gpuTexture) {
            this.#gpuTexture.destroy();
            this.targetResourceManagedState.videoMemory -= this.#videoMemorySize;
        }
        this.#gpuTexture = gpuTexture;
        this.#useMipmap = useMipmap
        this.#mipLevelCount = gpuTexture.mipLevelCount;
        this.cacheKey = cacheKey || `direct_${this.uuid}`;
        this.#videoMemorySize = calculateTextureByteSize(gpuTexture);
        this.targetResourceManagedState.videoMemory += this.#videoMemorySize;
        this.__fireListenerList();
    }

    /**
     * [KO] SrcInfo로부터 캐시 키를 생성합니다.
     * [EN] Creates a cache key from SrcInfo.
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
     * [KO] SrcInfo로부터 srcList 배열을 추출합니다.
     * [EN] Extracts the srcList array from SrcInfo.
     */
    #getParsedSrc(srcInfo?: SrcInfo): string[] {
        return srcInfo instanceof Array ? srcInfo : srcInfo?.srcList
    }

    /**
     * [KO] GPUTexture 객체를 설정합니다.
     * [EN] Sets the GPUTexture object.
     */
    #setGpuTexture(value: GPUTexture) {
        this.#gpuTexture = value;
        if (!value) this.#imgBitmaps = null
        this.__fireListenerList();
    }

    /**
     * [KO] 리소스를 관리 대상으로 등록합니다.
     * [EN] Registers the resource for management.
     */
    #registerResource() {
        this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateCubeTexture(this));
    }

    /**
     * [KO] 리소스 등록을 해제합니다.
     * [EN] Unregisters the resource from management.
     */
    #unregisterResource() {
        this.redGPUContext.resourceManager.unregisterManagementResource(this);
    }

    /**
     * [KO] GPUTexture 객체를 생성합니다.
     * [EN] Creates the GPUTexture object.
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
     * [KO] 큐브 텍스처 이미지를 비동기로 로드합니다.
     * [EN] Loads cube texture images asynchronously.
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
 * [KO] 이미지 경로 리스트로부터 비트맵을 로드합니다.
 * [EN] Loads bitmaps from a list of image paths.
 * @param srcList -
 * [KO] 이미지 경로 리스트
 * [EN] List of image paths
 * @returns
 * [KO] 비트맵 배열을 담은 Promise
 * [EN] Promise containing an array of ImageBitmaps
 */
async function loadAndCreateBitmapImages(srcList: string[]): Promise<ImageBitmap[]> {
    const promises = srcList.map(src => loadAndCreateBitmapImage(src));
    return await Promise.all(promises)
}