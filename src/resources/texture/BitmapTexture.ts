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
import {KTX2Container, read} from "ktx-parse";
import {createGPUTextureFromKTX2} from "../../utils/texture/textureParser/createGPUTextureFromKTX2";

const MANAGED_STATE_KEY = 'managedBitmapTextureState'
/**
 * [KO] 비트맵 텍스처 소스 정보 타입입니다. 이미지 URL 문자열이거나 `src`와 `cacheKey`를 포함하는 객체입니다.
 * [EN] Bitmap texture source information type. Can be an image URL string or an object containing `src` and `cacheKey`.
 *
 * @category Texture
 */
export type BitmapSrcInfo = string | { src: string, cacheKey: string }

/**
 * [KO] 일반 이미지(PNG, JPG, WebP, SVG) 및 KTX2 압축 텍스처를 로드하여 GPU 2D 텍스처로 관리하는 클래스입니다.
 * [EN] Class that loads standard images (PNG, JPG, WebP, SVG) and KTX2 compressed textures and manages them as GPU 2D textures.
 *
 * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'path/to/image.png');
 * ```
 *
 * @see [BitmapTexture Sampler example](/RedGPU/examples/3d/texture/bitmapTextureSampler/)
 * @see [BitmapMaterial example](/RedGPU/examples/3d/material/bitmapMaterial/)
 * @see [KTX2 basic example](/RedGPU/examples/3d/texture/ktx2/basic/)
 * @category Texture
 */
class BitmapTexture extends ManagementResourceBase {
    #gpuTexture: GPUTexture
    #src: string
    #mipLevelCount: number
    #useMipmap: boolean
    #width: number = 0
    #height: number = 0
    #videoMemorySize: number = 0
    #usePremultiplyAlpha: boolean = true
    #format: GPUTextureFormat
    #onLoadListeners: Array<(textureInstance: BitmapTexture) => void> = [];
    #onErrorListeners: Array<(error: Error) => void> = [];
    #isLoaded: boolean = false;
    #loadError: Error | null = null;

    /**
     * [KO] BitmapTexture 인스턴스를 생성합니다. 동일한 `cacheKey`가 이미 존재할 경우 기존 캐시된 인스턴스를 반환합니다.
     * [EN] Creates a BitmapTexture instance. Returns the existing cached instance if the same `cacheKey` already exists.
     *
     * ### Example
     * ```typescript
     * const texture = new RedGPU.Resource.BitmapTexture(
     *     redGPUContext,
     *     'assets/diffuse.png',
     *     true,
     *     (loadedTexture) => {
     *         console.log('Loaded:', loadedTexture);
     *     }
     * );
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param src -
     * [KO] 텍스처 소스 경로 또는 캐시 키 포함 정보
     * [EN] Texture source path or information including cache key
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
     * @param usePremultiplyAlpha -
     * [KO] 알파 프리멀티플라이 적용 여부 (기본값: `false`)
     * [EN] Whether to apply premultiplied alpha (default: `false`)
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
     * [KO] 텍스처의 가로 크기(픽셀)를 반환합니다.
     * [EN] Returns the width of the texture in pixels.
     *
     * @returns
     * [KO] 가로 크기 (픽셀)
     * [EN] Width in pixels
     */
    get width(): number {
        return this.#width
    }

    /**
     * [KO] 텍스처의 세로 크기(픽셀)를 반환합니다.
     * [EN] Returns the height of the texture in pixels.
     *
     * @returns
     * [KO] 세로 크기 (픽셀)
     * [EN] Height in pixels
     */
    get height(): number {
        return this.#height
    }

    /**
     * [KO] 프리멀티플 알파(Premultiplied Alpha) 사용 여부를 반환합니다.
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
     * [KO] 텍스처 소스 경로를 반환하거나 설정합니다. 값을 변경하면 새 경로의 텍스처를 비동기로 다시 로드합니다.
     * [EN] Gets or sets the texture source path. Changing this value reloads the texture from the new path asynchronously.
     *
     * @returns
     * [KO] 텍스처 소스 경로 문자열
     * [EN] Texture source path string
     */
    get src(): string {
        return this.#src;
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

    set src(value: BitmapSrcInfo) {
        this.#src = this.#getParsedSrc(value);
        this.cacheKey = this.#getCacheKey(value);
        if (this.#src) this.#loadBitmapTexture(this.#src);
    }

    /**
     * [KO] 텍스처 로드 완료 및 에러 이벤트 리스너를 추가합니다. 이미 로드가 완료되었거나 실패한 경우 마이크로태스크로 즉시 호출됩니다.
     * [EN] Adds texture load complete and error event listeners. If already loaded or failed, invoked immediately via microtask.
     *
     * @param onLoad -
     * [KO] 로드 완료 콜백 함수
     * [EN] Load complete callback function
     * @param onError -
     * [KO] 에러 발생 콜백 함수
     * [EN] Error callback function
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

    set useMipmap(value: boolean) {
        if (this.#useMipmap === value) return;
        this.#useMipmap = value;
        if (this.#src) this.#loadBitmapTexture(this.#src);
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
        this.cacheKey = null
        this.#src = null
        if (temp) {
            this.redGPUContext.commandEncoderManager.addDeferredDestroy(temp)
        }
    }

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

    #getParsedSrc(srcInfo?: BitmapSrcInfo): string {
        return typeof srcInfo === 'string' ? srcInfo : srcInfo.src
    }

    #setGpuTexture(value: GPUTexture) {
        this.#gpuTexture = value;
        this.notifyUpdate();
    }

    #registerResource() {
        this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateBitmapTexture(this));
    }

    #unregisterResource() {
        this.redGPUContext.resourceManager.unregisterManagementResource(this);
    }

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
        this.#videoMemorySize = calculateTextureByteSize(newGPUTexture)
        this.targetResourceManagedState.videoMemory += this.#videoMemorySize
        if (this.#useMipmap) mipmapGenerator.generateMipmap(newGPUTexture, textureDescriptor)
        this.#setGpuTexture(newGPUTexture)

        try {
            imgBitmap.close();
        } catch (e) {
        }
    }

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

/**
 * [KO] KTX2 파일 파싱 결과 인터페이스입니다.
 * [EN] Interface representing the KTX2 file parsing result.
 *
 * @category Texture
 */
export interface KTX2ParseResult {
    /**
     * [KO] 파싱된 KTX2 컨테이너 객체
     * [EN] Parsed KTX2 container object
     */
    container: KTX2Container;
    /**
     * [KO] 원본 바이너리 `ArrayBuffer`
     * [EN] Raw binary `ArrayBuffer`
     */
    arrayBuffer: ArrayBuffer;
}

/**
 * [KO] 지정된 경로에서 KTX2 파일을 비동기로 로드하고 헤더 및 컨테이너 구조를 파싱합니다.
 * [EN] Asynchronously loads a KTX2 file from the specified path and parses its header and container structure.
 *
 * @param src -
 * [KO] KTX2 파일 URL 경로
 * [EN] KTX2 file URL path
 * @returns
 * [KO] 파싱된 `KTX2ParseResult` 객체를 담은 `Promise<KTX2ParseResult>`
 * [EN] `Promise<KTX2ParseResult>` containing the parsed `KTX2ParseResult` object
 * @throws
 * [KO] 네트워크 요청 실패, 잘못된 KTX2 매직 식별자, 또는 유효하지 않은 해상도일 경우 `Error` 발생
 * [EN] Throws `Error` if network request fails, KTX2 magic identifier is invalid, or dimensions are invalid
 * @category Texture
 */
export async function loadKtx2Container(src: string): Promise<KTX2ParseResult> {
    const response = await fetch(src);
    if (!response.ok) {
        throw new Error(`[loadKtx2Container ❌] Failed to fetch KTX2 from ${src}: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    if (uint8.length < 12 || uint8[0] !== 0xAB || uint8[1] !== 0x4B || uint8[2] !== 0x54 || uint8[3] !== 0x58) {
        throw new Error(`[loadKtx2Container ❌] Invalid KTX2 magic identifier: ${src}. (Pointer text or non-binary file)`);
    }

    const container = read(uint8);

    if (!container || container.pixelWidth <= 0 || container.pixelHeight <= 0) {
        throw new Error(`[loadKtx2Container ❌] Invalid KTX2 header dimensions: ${src}`);
    }

    (container as any)._rawBuffer = uint8;

    return {container, arrayBuffer};
}
Object.freeze(BitmapTexture)
export default BitmapTexture
