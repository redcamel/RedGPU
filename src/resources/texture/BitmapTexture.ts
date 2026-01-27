import RedGPUContext from "../../context/RedGPUContext";
import getAbsoluteURL from "../../utils/file/getAbsoluteURL";
import calculateTextureByteSize from "../../utils/texture/calculateTextureByteSize";
import getMipLevelCount from "../../utils/texture/getMipLevelCount";
import imageBitmapToGPUTexture from "../../utils/texture/imageBitmapToGPUTexture";
import loadAndCreateBitmapImage from "../../utils/texture/loadAndCreateBitmapImage";
import ManagementResourceBase from "../core/ManagementResourceBase";
import ResourceStateBitmapTexture from "../core/resourceManager/resourceState/texture/ResourceStateBitmapTexture";

const MANAGED_STATE_KEY = 'managedBitmapTextureState'
type SrcInfo = string | { src: string, cacheKey: string }

/**
 * [KO] 비트맵 이미지를 사용하는 텍스처 클래스입니다.
 * [EN] Texture class that uses bitmap images.
 *
 * * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'path/to/image.png');
 * ```
 * @category Texture
 */
class BitmapTexture extends ManagementResourceBase {
    /** [KO] GPUTexture 객체 [EN] GPUTexture object */
    #gpuTexture: GPUTexture
    /** [KO] 텍스처 소스 경로 [EN] Texture source path */
    #src: string
    /** [KO] 밉맵 레벨 개수 [EN] Number of mipmap levels */
    #mipLevelCount: number
    /** [KO] 밉맵 사용 여부 [EN] Whether to use mipmaps */
    #useMipmap: boolean
    /** [KO] 이미지 비트맵 객체 [EN] Image bitmap object */
    #imgBitmap: ImageBitmap
    /** [KO] 비디오 메모리 사용량(byte) [EN] Video memory usage in bytes */
    #videoMemorySize: number = 0
    /** [KO] 프리멀티플 알파 사용 여부 [EN] Whether to use premultiplied alpha */
    #usePremultiplyAlpha: boolean = true
    /** [KO] 텍스처 포맷 [EN] Texture format */
    readonly #format: GPUTextureFormat
    /** [KO] 로드 완료 콜백 [EN] Load complete callback */
    readonly #onLoad: (textureInstance: BitmapTexture) => void;
    /** [KO] 에러 콜백 [EN] Error callback */
    readonly #onError: (error: Error) => void;

    /**
     * [KO] BitmapTexture 인스턴스를 생성합니다.
     * [EN] Creates a BitmapTexture instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param src -
     * [KO] 텍스처 소스 정보 (URL 또는 객체)
     * [EN] Texture source information (URL or object)
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
     * @param usePremultiplyAlpha -
     * [KO] 프리멀티플 알파 사용 여부 (기본값: false)
     * [EN] Whether to use premultiplied alpha (default: false)
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
        this.#format = format || `${navigator.gpu.getPreferredCanvasFormat()}-srgb` as GPUTextureFormat
        if (src) {
            this.#src = this.#getParsedSrc(src);
            this.cacheKey = this.#getCacheKey(src)
            const {table} = this.targetResourceManagedState
            let target: ResourceStateBitmapTexture = table.get(this.cacheKey)
            if (target) {
                const targetTexture = target.texture as BitmapTexture
                this.#onLoad?.(targetTexture)
                return targetTexture
            } else {
                this.src = src;
                this.#registerResource()
            }
        }
    }

    /** [KO] 텍스처 가로 크기 [EN] Texture width */
    get width(): number {
        return this.#imgBitmap?.width || 0
    }

    /** [KO] 텍스처 세로 크기 [EN] Texture height */
    get height(): number {
        return this.#imgBitmap?.height || 0
    }

    /** [KO] 프리멀티플 알파 사용 여부를 반환합니다. [EN] Returns whether premultiplied alpha is used. */
    get usePremultiplyAlpha(): boolean {
        return this.#usePremultiplyAlpha;
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

    /** [KO] 텍스처 소스 경로를 반환합니다. [EN] Returns the texture source path. */
    get src(): string {
        return this.#src;
    }

    /** [KO] 텍스처 소스 경로 설정 및 로드를 시작합니다. [EN] Sets the texture source path and starts loading. */
    set src(value: SrcInfo) {
        this.#src = this.#getParsedSrc(value);
        this.cacheKey = this.#getCacheKey(value);
        if (this.#src) this.#loadBitmapTexture(this.#src);
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
        this.cacheKey = null
        this.#src = null
        if (temp) temp.destroy()
    }

    /**
     * [KO] SrcInfo로부터 캐시 키를 생성합니다.
     * [EN] Creates a cache key from SrcInfo.
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
     * [KO] SrcInfo로부터 src 문자열을 추출합니다.
     * [EN] Extracts the src string from SrcInfo.
     */
    #getParsedSrc(srcInfo?: SrcInfo): string {
        return typeof srcInfo === 'string' ? srcInfo : srcInfo.src
    }

    /**
     * [KO] GPUTexture 객체를 설정하고 리스너를 호출합니다.
     * [EN] Sets the GPUTexture object and calls listeners.
     */
    #setGpuTexture(value: GPUTexture) {
        this.#gpuTexture = value;
        if (!value) this.#imgBitmap = null
        this.__fireListenerList();
    }

    /**
     * [KO] 리소스를 관리 대상으로 등록합니다.
     * [EN] Registers the resource for management.
     */
    #registerResource() {
        this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateBitmapTexture(this));
    }

    /**
     * [KO] 리소스 등록을 해제합니다.
     * [EN] Unregisters the resource from management.
     */
    #unregisterResource() {
        this.redGPUContext.resourceManager.unregisterManagementResource(this);
    }

    /**
     * [KO] GPUTexture 객체를 실제로 생성합니다.
     * [EN] Actually creates the GPUTexture object.
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
        const textureDescriptor: GPUTextureDescriptor = {
            size: [W, H],
            format: this.#format,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            label: this.#src
        };
        if (this.#useMipmap) {
            this.#mipLevelCount = getMipLevelCount(W, H)
            textureDescriptor.mipLevelCount = this.#mipLevelCount
            textureDescriptor.usage |= GPUTextureUsage.RENDER_ATTACHMENT;
        }
        const newGPUTexture = imageBitmapToGPUTexture(gpuDevice, [this.#imgBitmap], textureDescriptor, this.#usePremultiplyAlpha)
        this.#videoMemorySize = calculateTextureByteSize(newGPUTexture)
        this.targetResourceManagedState.videoMemory += this.#videoMemorySize
        if (this.#useMipmap) mipmapGenerator.generateMipmap(newGPUTexture, textureDescriptor)
        this.#setGpuTexture(newGPUTexture)
    }

    /**
     * [KO] SVG 이미지를 ImageBitmap으로 변환합니다.
     * [EN] Converts an SVG image to an ImageBitmap.
     */
    async #convertSvgToImageBitmap(src: string): Promise<ImageBitmap> {
        return new Promise((resolve, reject) => {
            const svgImage = new Image();
            svgImage.src = src;
            svgImage.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = svgImage.width || 512;
                canvas.height = svgImage.height || 512;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Canvas context could not be created."));
                    return;
                }
                ctx.fillStyle = 'rgba(0, 0, 0, 0)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(svgImage, 0, 0, canvas.width, canvas.height);
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
     * [KO] 비트맵 이미지를 비동기로 로드합니다.
     * [EN] Loads a bitmap image asynchronously.
     */
    async #loadBitmapTexture(src: string) {
        try {
            if (src.endsWith(".svg")) {
                this.#imgBitmap = await this.#convertSvgToImageBitmap(src);
            } else {
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