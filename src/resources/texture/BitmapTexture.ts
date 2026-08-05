import RedGPUContext from "../../context/RedGPUContext";
import getAbsoluteURL from "../../utils/file/getAbsoluteURL";
import calculateTextureByteSize from "../../utils/texture/calculateTextureByteSize";
import getMipLevelCount from "../../utils/texture/getMipLevelCount";
import loadImageToImageBitmap from "../../utils/texture/textureParser/imageBitmap/loadImageToImageBitmap";
import convertSvgToImageBitmap from "../../utils/texture/textureParser/imageBitmap/convertSvgToImageBitmap";
import imageBitmapToGPUTexture from "../../utils/texture/textureParser/imageBitmap/imageBitmapToGPUTexture";
import ManagementResourceBase from "../core/ManagementResourceBase";
import ResourceStateBitmapTexture from "../core/resourceManager/resourceState/texture/ResourceStateBitmapTexture";
import getFileExtension from "../../utils/file/getFileExtension";
import keepLog from "../../utils/keepLog";
import {KTX2Container, read} from "ktx-parse";
import {createGPUTextureFromKTX2} from "../../utils/texture/textureParser/createGPUTextureFromKTX2";

const MANAGED_STATE_KEY = 'managedBitmapTextureState'
/**
 * [KO] 텍스처 소스 정보 타입입니다. 이미지 URL 문자열이거나 src와 cacheKey를 가진 객체일 수 있습니다.
 * [EN] Texture source information type. Can be an image URL string or an object with src and cacheKey.
 */
export type BitmapSrcInfo = string | { src: string, cacheKey: string }

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
    /** [KO] 텍스처 가로 크기 (픽셀) [EN] Texture width in pixels */
    #width: number = 0
    /** [KO] 텍스처 세로 크기 (픽셀) [EN] Texture height in pixels */
    #height: number = 0
    /** [KO] 비디오 메모리 사용량(byte) [EN] Video memory usage in bytes */
    #videoMemorySize: number = 0
    /** [KO] 프리멀티플 알파 사용 여부 [EN] Whether to use premultiplied alpha */
    #usePremultiplyAlpha: boolean = true
    /** [KO] 텍스처 포맷 [EN] Texture format */
    #format: GPUTextureFormat
    /** [KO] 로드 완료 리스너 배열 [EN] Load complete listeners array */
    #onLoadListeners: Array<(textureInstance: BitmapTexture) => void> = [];
    /** [KO] 에러 리스너 배열 [EN] Error listeners array */
    #onErrorListeners: Array<(error: Error) => void> = [];
    #isLoaded: boolean = false;
    #loadError: Error | null = null;

    /**
     * [KO] BitmapTexture 인스턴스를 생성합니다.
     * [EN] Creates a BitmapTexture instance.
     */
    constructor(
        redGPUContext: RedGPUContext,
        src?: BitmapSrcInfo,
        useMipMap: boolean = true,
        onLoad?: (textureInstance?: BitmapTexture) => void,
        onError?: (error: Error) => void,
        format?: GPUTextureFormat,
        usePremultiplyAlpha: boolean = false
    ) {
        super(redGPUContext, MANAGED_STATE_KEY);
        if (onLoad) this.#onLoadListeners.push(onLoad);
        if (onError) this.#onErrorListeners.push(onError);
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
                if (onLoad || onError) {
                    targetTexture.addLoadListeners(onLoad, onError);
                }
                return targetTexture
            } else {
                this.src = src;
                this.#registerResource()
            }
        }
    }

    /**
     * [KO] 로드 완료 및 에러 리스너를 추가합니다.
     * [EN] Adds load complete and error listeners.
     */
    addLoadListeners(onLoad?: (textureInstance: BitmapTexture) => void, onError?: (error: Error) => void) {
        if (this.#isLoaded || !!this.#gpuTexture) {
            if (onLoad) queueMicrotask(() => onLoad(this));
        } else if (this.#loadError) {
            if (onError) queueMicrotask(() => onError(this.#loadError!));
        } else {
            if (onLoad) this.#onLoadListeners.push(onLoad);
            if (onError) this.#onErrorListeners.push(onError);
        }
    }

    /**
     * [KO] 텍스처 가로 크기를 반환합니다.
     * [EN] Returns the texture width.
     *
     * @returns
     * [KO] 가로 크기 (픽셀)
     * [EN] Width in pixels
     */
    get width(): number {
        return this.#width
    }

    /**
     * [KO] 텍스처 세로 크기를 반환합니다.
     * [EN] Returns the texture height.
     *
     * @returns
     * [KO] 세로 크기 (픽셀)
     * [EN] Height in pixels
     */
    get height(): number {
        return this.#height
    }

    /**
     * [KO] 프리멀티플 알파 사용 여부를 반환합니다.
     * [EN] Returns whether premultiplied alpha is used.
     *
     * @returns
     * [KO] 프리멀티플 알파 사용 여부
     * [EN] Whether premultiplied alpha is used
     */
    get usePremultiplyAlpha(): boolean {
        return this.#usePremultiplyAlpha;
    }

    /**
     * [KO] 비디오 메모리 사용량(byte)을 반환합니다.
     * [EN] Returns the video memory usage in bytes.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (Bytes)
     * [EN] Video memory usage in bytes
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /**
     * [KO] GPUTexture 객체를 반환합니다.
     * [EN] Returns the GPUTexture object.
     *
     * @returns
     * [KO] GPUTexture 인스턴스
     * [EN] GPUTexture instance
     */
    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    /**
     * [KO] 밉맵 레벨 개수를 반환합니다.
     * [EN] Returns the number of mipmap levels.
     *
     * @returns
     * [KO] 밉맵 레벨 개수
     * [EN] Number of mipmap levels
     */
    get mipLevelCount(): number {
        return this.#mipLevelCount;
    }

    /**
     * [KO] 텍스처 소스 경로를 반환합니다.
     * [EN] Returns the texture source path.
     *
     * @returns
     * [KO] 소스 경로 문자열
     * [EN] Source path string
     */
    get src(): string {
        return this.#src;
    }

    /**
     * [KO] 텍스처 소스 경로 설정 및 로드를 시작합니다.
     * [EN] Sets the texture source path and starts loading.
     *
     * @param value -
     * [KO] 텍스처 소스 정보
     * [EN] Texture source info
     */
    set src(value: BitmapSrcInfo) {
        this.#src = this.#getParsedSrc(value);
        this.cacheKey = this.#getCacheKey(value);
        if (this.#src) this.#loadBitmapTexture(this.#src);
    }

    /**
     * [KO] 밉맵 사용 여부를 반환합니다.
     * [EN] Returns whether mipmaps are used.
     *
     * @returns
     * [KO] 밉맵 사용 여부
     * [EN] Whether mipmaps are used
     */
    get useMipmap(): boolean {
        return this.#useMipmap;
    }

    /**
     * [KO] 밉맵 사용 여부를 설정하고 텍스처를 재생성합니다.
     * [EN] Sets whether to use mipmaps and recreates the texture.
     *
     * @param value -
     * [KO] 밉맵 사용 여부
     * [EN] Whether to use mipmaps
     */
    set useMipmap(value: boolean) {
        if (this.#useMipmap === value) return;
        this.#useMipmap = value;
        if (this.#src) this.#loadBitmapTexture(this.#src);
    }

    /** [KO] 텍스처 리소스를 파괴합니다. [EN] Destroys the texture resource. */
    destroy() {
        const temp = this.#gpuTexture
        this.#setGpuTexture(null);
        this.notifyUpdate(true)
        this.#unregisterResource()
        this.cacheKey = null
        this.#src = null
        if (temp) {
            this.redGPUContext.commandEncoderManager.addDeferredDestroy(temp)
        }
    }

    /**
     * [KO] BitmapSrcInfo로부터 캐시 키를 생성합니다.
     * [EN] Creates a cache key from BitmapSrcInfo.
     */
    #getCacheKey(srcInfo?: BitmapSrcInfo): string {
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
     * [KO] BitmapSrcInfo로부터 src 문자열을 추출합니다.
     * [EN] Extracts the src string from BitmapSrcInfo.
     */
    #getParsedSrc(srcInfo?: BitmapSrcInfo): string {
        return typeof srcInfo === 'string' ? srcInfo : srcInfo.src
    }

    /**
     * [KO] GPUTexture 객체를 설정하고 리스너를 호출합니다.
     * [EN] Sets the GPUTexture object and calls listeners.
     */
    #setGpuTexture(value: GPUTexture) {
        this.#gpuTexture = value;
        this.notifyUpdate();
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
     * [KO] ImageBitmap으로부터 GPUTexture 객체를 생성합니다.
     * [EN] Creates a GPUTexture object from an ImageBitmap.
     */
    #createGPUTextureFromImageBitmap(imgBitmap: ImageBitmap) {
        const {gpuDevice, resourceManager} = this.redGPUContext
        const {mipmapGenerator} = resourceManager
        if (this.#gpuTexture) {
            this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuTexture)
            this.#gpuTexture = null
        }
        this.targetResourceManagedState.videoMemory -= this.#videoMemorySize
        this.#videoMemorySize = 0
        this.#width = imgBitmap.width
        this.#height = imgBitmap.height
        const W = this.#width
        const H = this.#height
        this.#mipLevelCount = 1
        const textureDescriptor: GPUTextureDescriptor = {
            size: [W, H],
            format: this.#format,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC,
            label: this.#src
        };
        if (this.#useMipmap) {
            this.#mipLevelCount = getMipLevelCount(W, H)
            textureDescriptor.mipLevelCount = this.#mipLevelCount
            textureDescriptor.usage |= GPUTextureUsage.RENDER_ATTACHMENT;
        }
        const newGPUTexture = imageBitmapToGPUTexture(gpuDevice, [imgBitmap], textureDescriptor, this.#usePremultiplyAlpha)
        // keepLog(newGPUTexture)
        this.#videoMemorySize = calculateTextureByteSize(newGPUTexture)
        this.targetResourceManagedState.videoMemory += this.#videoMemorySize
        if (this.#useMipmap) mipmapGenerator.generateMipmap(newGPUTexture, textureDescriptor)
        this.#setGpuTexture(newGPUTexture)

        try {
            imgBitmap.close();
        } catch (e) {
        }
    }

    /**
     * [KO] SVG 이미지를 ImageBitmap으로 변환합니다.
     * [EN] Converts an SVG image to an ImageBitmap.
    /**
     * [KO] 비트맵 이미지를 비동기로 로드합니다.
     * [EN] Loads a bitmap image asynchronously.
     */
    async #loadBitmapTexture(src: string) {
        try {
            let imgBitmap: ImageBitmap;
            const premultiplyAlpha = this.#usePremultiplyAlpha ? 'premultiply' : 'none';
            const ext = getFileExtension(src).toLowerCase();
            if (ext === "svg" || src.endsWith(".svg")) {
                imgBitmap = await convertSvgToImageBitmap(src, premultiplyAlpha);
            } else if (ext === "ktx2" || src.endsWith(".ktx2")) {
                const {container} = await loadKtx2Container(src);


                if (this.#gpuTexture) {
                    this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuTexture);
                    this.#gpuTexture = null;
                }
                this.targetResourceManagedState.videoMemory -= this.#videoMemorySize;
                this.#videoMemorySize = 0;

                const newGPUTexture = await createGPUTextureFromKTX2({
                    device: this.gpuDevice,
                    container: container,
                });

                this.#format = newGPUTexture.format;
                this.#width = container.pixelWidth;
                this.#height = container.pixelHeight;
                this.#mipLevelCount = Math.max(1, container.levels.length);
                this.#videoMemorySize = calculateTextureByteSize(newGPUTexture);
                this.targetResourceManagedState.videoMemory += this.#videoMemorySize;

                this.#setGpuTexture(newGPUTexture);
            } else {
                imgBitmap = await loadImageToImageBitmap(src, "none", premultiplyAlpha);
            }
            if (imgBitmap) {
                this.#createGPUTextureFromImageBitmap(imgBitmap);
            }

            this.#isLoaded = true;
            const listeners = [...this.#onLoadListeners];
            listeners.forEach(cb => cb(this));
        } catch (error) {
            console.error(error);
            this.#loadError = error as Error;
            const listeners = [...this.#onErrorListeners];
            listeners.forEach(cb => cb(error as Error));
        }
    }

}

export interface KTX2ParseResult {
    container: KTX2Container;
    arrayBuffer: ArrayBuffer;
}
export async function loadKtx2Container(src: string): Promise<KTX2ParseResult> {
    const response = await fetch(src);
    if (!response.ok) {
        throw new Error(`[loadKtx2Container ❌] Failed to fetch KTX2 from ${src}: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    // KTX2 Magic Identifier 검사: AB 4B 54 58 20 32 30 BB 0D 0A 1A 0A
    if (uint8.length < 12 || uint8[0] !== 0xAB || uint8[1] !== 0x4B || uint8[2] !== 0x54 || uint8[3] !== 0x58) {
        throw new Error(`[loadKtx2Container ❌] Invalid KTX2 magic identifier: ${src}. (Pointer text or non-binary file)`);
    }

    const container = read(uint8);

    if (!container || container.pixelWidth <= 0 || container.pixelHeight <= 0) {
        throw new Error(`[loadKtx2Container ❌] Invalid KTX2 header dimensions: ${src}`);
    }

    // ✨ WASM 트랜스코더를 위해 container 객체 내부에 원본 바이너리 참조 연결
    (container as any)._rawBuffer = uint8;

    return {container, arrayBuffer};
}
Object.freeze(BitmapTexture)
export default BitmapTexture
