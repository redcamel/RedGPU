import RedGPUContext from "../../context/RedGPUContext";
import calculateTextureByteSize from "../../utils/texture/calculateTextureByteSize";
import getMipLevelCount from "../../utils/texture/getMipLevelCount";
import loadImageToImageBitmap from "../../utils/texture/textureParser/imageBitmap/loadImageToImageBitmap";
import imageBitmapToGPUTexture from "../../utils/texture/textureParser/imageBitmap/imageBitmapToGPUTexture";
import ManagementResourceBase from "../core/ManagementResourceBase";
import ResourceStateCubeTexture from "../core/resourceManager/resourceState/texture/ResourceStateCubeTexture";

const MANAGED_STATE_KEY = 'managedCubeTextureState'
/**
 * [KO] 큐브 텍스처 소스 정보 타입입니다. 6개의 이미지 URL 배열이거나 `srcList`와 `cacheKey`를 포함하는 객체입니다.
 * [EN] Cube texture source information type. Can be an array of 6 image URLs or an object containing `srcList` and `cacheKey`.
 *
 * @category Texture
 */
export type CubeSrcInfo = string[] | { srcList: string[], cacheKey: string }

/**
 * [KO] 6면(+X, -X, +Y, -Y, +Z, -Z) 이미지를 로드하여 GPU 큐브맵(`cube`) 텍스처로 관리하는 클래스입니다.
 * [EN] Class that loads 6 face (+X, -X, +Y, -Y, +Z, -Z) images and manages them as a GPU cubemap (`cube`) texture.
 *
 * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.CubeTexture(redGPUContext, [
 *     'right.png', 'left.png',
 *     'top.png', 'bottom.png',
 *     'front.png', 'back.png'
 * ]);
 * ```
 *
 * @see [SkyBox basic example](/RedGPU/examples/3d/skybox/skybox/)
 * @see [SkyBox transition example](/RedGPU/examples/3d/skybox/transition/skyboxTransition/)
 * @category Texture
 */
class CubeTexture extends ManagementResourceBase {
    /**
     * [KO] 큐브 텍스처의 기본 `GPUTextureViewDescriptor` 설정입니다.
     * [EN] Default `GPUTextureViewDescriptor` configuration for cube textures.
     */
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
    #videoMemorySize: number = 0
    readonly #format: GPUTextureFormat
    readonly #onLoad: (cubeTextureInstance: CubeTexture) => void;
    readonly #onError: (error: Error) => void;

    /**
     * [KO] CubeTexture 인스턴스를 생성합니다. 동일한 `cacheKey`가 이미 존재할 경우 기존 캐시된 인스턴스를 반환합니다.
     * [EN] Creates a CubeTexture instance. Returns the existing cached instance if the same `cacheKey` already exists.
     *
     * ### Example
     * ```typescript
     * const cubeTexture = new RedGPU.Resource.CubeTexture(
     *     redGPUContext,
     *     ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'],
     *     true,
     *     (loadedTexture) => {
     *         console.log('CubeTexture loaded:', loadedTexture);
     *     }
     * );
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param srcList -
     * [KO] 6면 큐브 텍스처 소스 정보 (URL 배열 또는 캐시 키 포함 객체)
     * [EN] 6-face cube texture source information (array of URLs or object with cache key)
     * @param useMipMap -
     * [KO] 밉맵 생성 여부 (기본값: `true`)
     * [EN] Whether to generate mipmaps (default: `true`)
     * @param onLoad -
     * [KO] 로드 완료 시 호출될 콜백 함수
     * [EN] Callback function called when loading completes
     * @param onError -
     * [KO] 로드 실패 시 호출될 콜백 함수
     * [EN] Callback function called when loading fails
     * @param format -
     * [KO] GPU 텍스처 픽셀 포맷 (기본값: 선호 캔버스 포맷의 `-srgb`)
     * [EN] GPU texture pixel format (default: preferred canvas format with `-srgb`)
     */
    constructor(
        redGPUContext: RedGPUContext,
        srcList: CubeSrcInfo,
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

    /**
     * [KO] 현재 밉맵 레벨 개수가 반영된 `GPUTextureViewDescriptor` 객체를 반환합니다.
     * [EN] Returns the `GPUTextureViewDescriptor` object reflecting the current mipmap level count.
     *
     * @returns
     * [KO] `GPUTextureViewDescriptor` 객체
     * [EN] `GPUTextureViewDescriptor` object
     */
    get viewDescriptor() {
        return {
            ...CubeTexture.defaultViewDescriptor,
            mipLevelCount: this.#mipLevelCount
        }
    }

    /**
     * [KO] 텍스처가 점유 중인 비디오 메모리 크기(Byte)를 반환합니다.
     * [EN] Returns the video memory size in bytes occupied by the texture.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (Byte)
     * [EN] Video memory usage in bytes
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /**
     * [KO] 생성된 `GPUTexture` 인스턴스를 반환합니다.
     * [EN] Returns the created `GPUTexture` instance.
     *
     * @returns
     * [KO] `GPUTexture` 인스턴스
     * [EN] `GPUTexture` instance
     */
    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    /**
     * [KO] 생성된 밉맵 레벨 개수를 반환합니다.
     * [EN] Returns the number of generated mipmap levels.
     *
     * @returns
     * [KO] 밉맵 레벨 개수
     * [EN] Number of mipmap levels
     */
    get mipLevelCount(): number {
        return this.#mipLevelCount;
    }

    /**
     * [KO] 6면 이미지 소스 경로 배열을 반환하거나 설정합니다. 값을 변경하면 큐브 텍스처를 비동기로 다시 로드합니다.
     * [EN] Gets or sets the array of 6-face image source paths. Changing this value reloads the cube texture asynchronously.
     *
     * @returns
     * [KO] 이미지 소스 경로 배열 (`string[]`)
     * [EN] Array of image source paths (`string[]`)
     */
    get srcList(): string[] {
        return this.#srcList;
    }

    set srcList(value: CubeSrcInfo) {
        this.#srcList = this.#getParsedSrc(value);
        this.cacheKey = this.#getCacheKey(value);
        if (this.#srcList?.length) this.#loadBitmapTexture(this.#srcList);
    }

    /**
     * [KO] 밉맵 사용 여부를 반환하거나 설정합니다. 값을 변경하면 텍스처를 재생성합니다.
     * [EN] Gets or sets whether mipmaps are used. Changing this value recreates the texture.
     *
     * @returns
     * [KO] 밉맵 사용 여부
     * [EN] Whether mipmaps are used
     */
    get useMipmap(): boolean {
        return this.#useMipmap;
    }

    set useMipmap(value: boolean) {
        if (this.#useMipmap === value) return;
        this.#useMipmap = value;
        if (this.#srcList) this.#loadBitmapTexture(this.#srcList);
    }

    /**
     * [KO] 텍스처 GPU 리소스를 해제하고 리소스 매니저 등록을 취소합니다.
     * [EN] Releases the texture GPU resource and unregisters it from the resource manager.
     */
    destroy() {
        const temp = this.#gpuTexture
        this.#setGpuTexture(null);
        this.notifyUpdate(true)
        this.#unregisterResource()
        this.#srcList = null
        this.cacheKey = null
        if (temp) {
            this.redGPUContext.commandEncoderManager.addDeferredDestroy(temp)
        }
    }

    /**
     * [KO] 외부에서 생성된 `GPUTexture` 객체를 직접 주입하여 설정합니다.
     * [EN] Directly injects and sets an externally created `GPUTexture` object.
     *
     * @param gpuTexture -
     * [KO] 설정할 `GPUTexture` 객체
     * [EN] `GPUTexture` object to set
     * @param cacheKey -
     * [KO] 캐시 키 (생략 시 UUID 기반 키 사용)
     * [EN] Cache key (uses UUID-based key if omitted)
     * @param useMipmap -
     * [KO] 밉맵 사용 여부 (기본값: `true`)
     * [EN] Whether to use mipmaps (default: `true`)
     */
    setGPUTextureDirectly(
        gpuTexture: GPUTexture,
        cacheKey?: string,
        useMipmap: boolean = true
    ): void {
        if (this.#gpuTexture) {
            this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuTexture);
            this.targetResourceManagedState.videoMemory -= this.#videoMemorySize;
        }
        this.#gpuTexture = gpuTexture;
        this.#useMipmap = useMipmap
        this.#mipLevelCount = gpuTexture.mipLevelCount;
        this.cacheKey = cacheKey || `direct_${this.uuid}`;
        this.#videoMemorySize = calculateTextureByteSize(gpuTexture);
        this.targetResourceManagedState.videoMemory += this.#videoMemorySize;
        this.notifyUpdate();
    }

    #getCacheKey(srcInfo?: CubeSrcInfo): string {
        if (!srcInfo) return this.uuid;
        if (srcInfo instanceof Array) {
            if (!srcInfo.length) return this.uuid
            return srcInfo.toString();
        } else {
            return srcInfo.cacheKey || srcInfo.srcList.toString();
        }
    }

    #getParsedSrc(srcInfo?: CubeSrcInfo): string[] {
        return srcInfo instanceof Array ? srcInfo : srcInfo?.srcList
    }

    #setGpuTexture(value: GPUTexture) {
        this.#gpuTexture = value;
        this.notifyUpdate();
    }

    #registerResource() {
        this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateCubeTexture(this));
    }

    #unregisterResource() {
        this.redGPUContext.resourceManager.unregisterManagementResource(this);
    }

    #createGPUTextureFromImageBitmaps(imgBitmaps: ImageBitmap[]) {
        const {gpuDevice, resourceManager} = this.redGPUContext
        const {mipmapGenerator} = resourceManager
        if (this.#gpuTexture) {
            this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuTexture)
            this.#gpuTexture = null
        }
        this.#mipLevelCount = 1;
        {
            const firstImgBitmap = imgBitmaps[0]
            const {width: W, height: H} = firstImgBitmap
            const depthOrArrayLayers = 6
            const textureDescriptor: GPUTextureDescriptor = {
                size: [W, H, depthOrArrayLayers],
                format: this.#format,
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC,
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

            imgBitmaps.forEach(bitmap => {
                try {
                    bitmap?.close();
                } catch (e) {
                }
            });
        }
    }

    async #loadBitmapTexture(srcList: string[]) {
        try {
            const imgBitmaps = await loadAndCreateBitmapImages(srcList);
            this.#createGPUTextureFromImageBitmaps(imgBitmaps)
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
 * [KO] 이미지 경로 배열로부터 `ImageBitmap` 배열을 비동기로 로드합니다.
 * [EN] Asynchronously loads an array of `ImageBitmap` objects from an array of image paths.
 *
 * @param srcList -
 * [KO] 이미지 경로 배열
 * [EN] Array of image paths
 * @returns
 * [KO] `ImageBitmap` 배열을 담은 `Promise<ImageBitmap[]>`
 * [EN] `Promise<ImageBitmap[]>` containing an array of `ImageBitmap` objects
 */
async function loadAndCreateBitmapImages(srcList: string[]): Promise<ImageBitmap[]> {
    const promises = srcList.map(src => loadImageToImageBitmap(src));
    return await Promise.all(promises)
}