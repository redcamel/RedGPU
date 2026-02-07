import RedGPUContext from "../../../context/RedGPUContext";
import getAbsoluteURL from "../../../utils/file/getAbsoluteURL";
import calculateTextureByteSize from "../../../utils/texture/calculateTextureByteSize";
import ManagementResourceBase from "../../core/ManagementResourceBase";
import ResourceStateHDRTexture from "../../core/resourceManager/resourceState/texture/ResourceStateHDRTexture";
import HDRLoader, {HDRData} from "./HDRLoader";
import {float32ToFloat16Linear} from "./tone/float32ToFloat16Linear";

const MANAGED_STATE_KEY = 'managedHDRTextureState'
type SrcInfo = string | { src: string, cacheKey: string }

/**
 * [KO] Radiance HDR(.hdr) 파일을 사용하는 2D 텍스처 클래스입니다.
 * [EN] 2D texture class that uses Radiance HDR (.hdr) files.
 *
 * [KO] .hdr 파일을 로드하여 rgba16float 포맷의 2D GPUTexture를 생성합니다. 라이트맵, 투영 텍스처 또는 IBL의 원천 데이터로 사용됩니다.
 * [EN] Loads .hdr files to create a 2D GPUTexture in rgba16float format. Used as source data for lightmaps, projected textures, or IBL.
 *
 * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.HDRTexture(redGPUContext, 'path/to/image.hdr');
 * ```
 * @category Texture
 */
class HDRTexture extends ManagementResourceBase {
    #gpuTexture: GPUTexture
    #src: string
    #videoMemorySize: number = 0
    #hdrLoader: HDRLoader = new HDRLoader()
    #format: GPUTextureFormat = 'rgba16float'
    #onLoad: (textureInstance: HDRTexture) => void;
    #onError: (error: Error) => void;
    #width: number = 0;
    #height: number = 0;

    /**
     * [KO] HDRTexture 인스턴스를 생성합니다.
     * [EN] Creates an HDRTexture instance.
     *
     * ### Example
     * ```typescript
     * const texture = new RedGPU.Resource.HDRTexture(redGPUContext, 'assets/hdr/sky.hdr', (v) => {
     *     console.log('Loaded:', v);
     * });
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param src -
     * [KO] HDR 파일 경로 또는 정보
     * [EN] HDR file path or information
     * @param onLoad -
     * [KO] 로드 완료 콜백
     * [EN] Load complete callback
     * @param onError -
     * [KO] 에러 콜백
     * [EN] Error callback
     */
    constructor(
        redGPUContext: RedGPUContext,
        src: SrcInfo,
        onLoad?: (textureInstance?: HDRTexture) => void,
        onError?: (error: Error) => void
    ) {
        super(redGPUContext, MANAGED_STATE_KEY);
        this.#onLoad = onLoad
        this.#onError = onError

        if (src) {
            const parsedSrc = this.#getParsedSrc(src)
            this.#validateHDRFormat(parsedSrc);
            this.#src = parsedSrc;
            this.cacheKey = this.#getCacheKey(src)
            const {table} = this.targetResourceManagedState
            let target: ResourceStateHDRTexture = table.get(this.cacheKey)
            if (target) {
                const targetTexture = target.texture as HDRTexture
                this.#onLoad?.(targetTexture)
                return targetTexture
            } else {
                this.src = src;
                this.#registerResource()
            }
        }
    }

    /** [KO] 텍스처 가로 크기 [EN] Texture width */
    get width(): number { return this.#width; }
    /** [KO] 텍스처 세로 크기 [EN] Texture height */
    get height(): number { return this.#height; }
    /** [KO] 비디오 메모리 사용량(byte) [EN] Video memory usage in bytes */
    get videoMemorySize(): number { return this.#videoMemorySize; }
    /** [KO] GPUTexture 객체 [EN] GPUTexture object */
    get gpuTexture(): GPUTexture { return this.#gpuTexture; }
    /** [KO] 텍스처 소스 경로 [EN] Texture source path */
    get src(): string { return this.#src; }

    /**
     * [KO] 텍스처 소스 경로 설정 및 로드를 시작합니다.
     * [EN] Sets the texture source path and starts loading.
     *
     * @param value -
     * [KO] 설정할 소스 정보
     * [EN] Source info to set
     */
    set src(value: SrcInfo) {
        const newSrc = this.#getParsedSrc(value)
        this.#validateHDRFormat(newSrc);
        this.#src = newSrc;
        this.cacheKey = this.#getCacheKey(value);
        if (this.#src) this.#loadHDRTexture(this.#src);
    }

    /** [KO] 리소스를 파괴합니다. [EN] Destroys the texture resource. */
    destroy() {
        const temp = this.#gpuTexture
        this.#setGpuTexture(null);
        this.__fireListenerList(true)
        this.#unregisterResource()
        this.#src = null
        this.cacheKey = null
        if (temp) temp.destroy()
    }

    #getCacheKey(srcInfo?: SrcInfo): string {
        let result
        if (!srcInfo) result = this.uuid;
        if (typeof srcInfo === 'string') {
            result = getAbsoluteURL(window.location.href, srcInfo);
        } else {
            result = srcInfo.cacheKey || getAbsoluteURL(window.location.href, srcInfo.src);
        }
        return `HDRTexture_${result}`
    }

    #getParsedSrc(srcInfo?: SrcInfo): string {
        return typeof srcInfo === 'string' ? srcInfo : srcInfo.src
    }

    #validateHDRFormat(src: string): void {
        if (!src || typeof src !== 'string') throw new Error('HDR 파일 경로가 필요합니다');
        const cleanSrc = src.split('?')[0].split('#')[0].toLowerCase();
        if (!cleanSrc.endsWith('.hdr')) throw new Error(`지원되지 않는 형식입니다. .hdr 형식만 지원됩니다. 입력된 파일: ${src}`);
    }

    async #loadHDRTexture(src: string) {
        try {
            const hdrData = await this.#hdrLoader.loadHDRFile(src);
            this.#width = hdrData.width;
            this.#height = hdrData.height;
            await this.#createGPUTexture(hdrData);
            this.#onLoad?.(this);
            this.__fireListenerList();
        } catch (error) {
            console.error('HDR loading error:', error);
            this.#onError?.(error);
        }
    }

    async #createGPUTexture(hdrData: HDRData) {
        const {gpuDevice} = this.redGPUContext
        const oldTexture = this.#gpuTexture;
        
        const textureDescriptor: GPUTextureDescriptor = {
            size: [this.#width, this.#height, 1],
            format: this.#format,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            label: `HDRTexture_2D_${this.#src}`
        };

        const newGPUTexture = gpuDevice.createTexture(textureDescriptor);
        
        // Float32 to Float16 conversion and upload
        const float16Data = await float32ToFloat16Linear(
            this.redGPUContext,
            hdrData.data,
            {
                width: this.#width,
                height: this.#height,
                workgroupSize: [8, 8]
            }
        );

        gpuDevice.queue.writeTexture(
            { texture: newGPUTexture },
            float16Data.data.buffer,
            { bytesPerRow: this.#width * 8, rowsPerImage: this.#height },
            { width: this.#width, height: this.#height }
        );

        this.#setGpuTexture(newGPUTexture);
        
        if (oldTexture) {
            await gpuDevice.queue.onSubmittedWorkDone();
            oldTexture.destroy();
        }
    }

    #setGpuTexture(value: GPUTexture) {
        this.targetResourceManagedState.videoMemory -= this.#videoMemorySize;
        this.#gpuTexture = value;
        this.#videoMemorySize = value ? calculateTextureByteSize(value) : 0;
        this.targetResourceManagedState.videoMemory += this.#videoMemorySize;
        this.__fireListenerList();
    }

    #registerResource() {
        this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateHDRTexture(this));
    }

    #unregisterResource() {
        this.redGPUContext.resourceManager.unregisterManagementResource(this);
    }
}

Object.freeze(HDRTexture)
export default HDRTexture