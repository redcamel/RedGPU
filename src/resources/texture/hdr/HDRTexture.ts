import RedGPUContext from "../../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../gpuConst/GPU_FILTER_MODE";
import getAbsoluteURL from "../../../utils/file/getAbsoluteURL";
import calculateTextureByteSize from "../../../utils/texture/calculateTextureByteSize";
import getMipLevelCount from "../../../utils/texture/getMipLevelCount";
import ManagementResourceBase from "../../core/ManagementResourceBase";
import ResourceManager from "../../core/resourceManager/ResourceManager";
import ResourceStateHDRTexture from "../../core/resourceManager/resourceState/texture/ResourceStateHDRTexture";
import Sampler from "../../sampler/Sampler";
import CubeTexture from "../CubeTexture";
import equirectangularToCubemapCode from "./equirectangularToCubeMap.wgsl"
import HDRLoader, {HDRData} from "./HDRLoader";
import {float32ToFloat16Linear} from "./tone/float32ToFloat16Linear";

const MANAGED_STATE_KEY = 'managedHDRTextureState'
type SrcInfo = string | { src: string, cacheKey: string }


/**
 * [KO] Radiance HDR(.hdr) 파일을 사용하는 텍스처 클래스입니다.
 * [EN] Texture class that uses Radiance HDR (.hdr) files.
 *
 * [KO] GGX 중요도 샘플링을 통해 거칠기별로 프리필터링된 큐브맵을 생성합니다.
 * [EN] Generates pre-filtered cubemaps for each roughness through GGX importance sampling.
 *
 * * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.HDRTexture(redGPUContext, 'path/to/image.hdr');
 * ```
 * @category Texture
 */
class HDRTexture extends ManagementResourceBase {
    #gpuTexture: GPUTexture
    #src: string
    #mipLevelCount: number
    #useMipmap: boolean
    #hdrData: HDRData
    #videoMemorySize: number = 0
    #cubeMapSize: number = 1024
    #hdrLoader: HDRLoader = new HDRLoader()
    #format: GPUTextureFormat
    #onLoad: (textureInstance: HDRTexture) => void;
    #onError: (error: Error) => void;
    #isCubeMapInitialized: boolean = false;
    #tempSourceTexture: GPUTexture = null;

    /**
     * [KO] HDRTexture 인스턴스를 생성합니다.
     * [EN] Creates an HDRTexture instance.
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
     * @param cubeMapSize -
     * [KO] 생성될 큐브맵의 한 면 크기
     * [EN] Size of one side of the generated cubemap
     * @param useMipMap -
     * [KO] 밉맵 사용 여부 (IBL 사용 시 필수)
     * [EN] Whether to use mipmaps (required for IBL)
     */
    constructor(
        redGPUContext: RedGPUContext,
        src: SrcInfo,
        onLoad?: (textureInstance?: HDRTexture) => void,
        onError?: (error: Error) => void,
        cubeMapSize: number = 1024,
        useMipMap: boolean = true,
    ) {
        super(redGPUContext, MANAGED_STATE_KEY);
        this.#onLoad = onLoad
        this.#onError = onError
        this.#format = 'rgba16float'
        this.#cubeMapSize = cubeMapSize
        this.#useMipmap = useMipMap
        this.#mipLevelCount = this.#useMipmap ? getMipLevelCount(this.#cubeMapSize, this.#cubeMapSize) : 1

        if (src) {
            const parsedSrc = this.#getParsedSrc(src)
            this.#validateHDRFormat(parsedSrc);
            this.#src = parsedSrc;
            this.cacheKey = this.#getCacheKey(src)
            const {table} = this.targetResourceManagedState
            let target: ResourceStateHDRTexture = table.get(this.cacheKey)
            if (target) {
                const targetTexture = target.texture
                this.#onLoad?.(targetTexture)
                return targetTexture
            } else {
                this.src = src;
                this.#registerResource()
            }
        }
    }

    /** [KO] 비디오 메모리 사용량(byte) [EN] Video memory usage in bytes */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /** [KO] GPUTexture 객체 [EN] GPUTexture object */
    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    /** [KO] 밉맵 레벨 개수 [EN] Number of mipmap levels */
    get mipLevelCount(): number {
        return this.#mipLevelCount;
    }

    /** [KO] 텍스처 소스 경로 [EN] Texture source path */
    get src(): string {
        return this.#src;
    }

    /** [KO] 텍스처 소스 경로 설정 및 로드를 시작합니다. [EN] Sets the texture source path and starts loading. */
    set src(value: SrcInfo) {
        const newSrc = this.#getParsedSrc(value)
        this.#validateHDRFormat(newSrc);
        this.#src = newSrc;
        this.cacheKey = this.#getCacheKey(value);
        this.#isCubeMapInitialized = false;
        if (this.#src) this.#loadHDRTexture(this.#src);
    }

    /** [KO] 밉맵 사용 여부 [EN] Whether to use mipmaps */
    get useMipmap(): boolean {
        return this.#useMipmap;
    }

    /** [KO] 밉맵 사용 여부를 설정하고 텍스처를 재생성합니다. [EN] Sets whether to use mipmaps and recreates the texture. */
    set useMipmap(value: boolean) {
        if (this.#useMipmap !== value) {
            this.#useMipmap = value;
            this.#mipLevelCount = this.#useMipmap ? getMipLevelCount(this.#cubeMapSize, this.#cubeMapSize) : 1
            this.#isCubeMapInitialized = false;
            this.#createGPUTexture();
        }
    }

    /** [KO] 뷰 디스크립터를 반환합니다. [EN] Returns the view descriptor. */
    get viewDescriptor() {
        return {
            ...CubeTexture.defaultViewDescriptor,
            mipLevelCount: this.#mipLevelCount
        }
    }

    /**
     * [KO] 지정된 경로가 지원하는 HDR 형식인지 확인합니다.
     * [EN] Checks if the specified path is a supported HDR format.
     */
    static isSupportedFormat(src: string): boolean {
        if (!src || typeof src !== 'string') return false;
        return src.toLowerCase().endsWith('.hdr');
    }

    /**
     * [KO] 지원하는 파일 형식 확장자 목록을 반환합니다.
     * [EN] Returns the list of supported file format extensions.
     */
    static getSupportedFormats(): string[] {
        return ['.hdr'];
    }

    /** [KO] 텍스처 리소스를 파괴합니다. [EN] Destroys the texture resource. */
    destroy() {
        const temp = this.#gpuTexture
        this.#setGpuTexture(null);
        if (this.#tempSourceTexture) {
            this.#tempSourceTexture.destroy();
            this.#tempSourceTexture = null;
        }
        this.#isCubeMapInitialized = false;
        this.__fireListenerList(true)
        this.#unregisterResource()
        this.#src = null
        this.cacheKey = null
        if (temp) temp.destroy()
    }

    /**
     * [KO] SrcInfo로부터 캐시 키를 생성합니다.
     * [EN] Creates a cache key from SrcInfo.
     */
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

    /**
     * [KO] SrcInfo로부터 src 문자열을 추출합니다.
     * [EN] Extracts the src string from SrcInfo.
     */
    #getParsedSrc(srcInfo?: SrcInfo): string {
        return typeof srcInfo === 'string' ? srcInfo : srcInfo.src
    }

    /**
     * [KO] HDR 파일 형식의 유효성을 검사합니다.
     * [EN] Validates the HDR file format.
     */
    #validateHDRFormat(src: string): void {
        if (!src || typeof src !== 'string') {
            throw new Error('HDR 파일 경로가 필요합니다');
        }
        const cleanSrc = src.split('?')[0].split('#')[0].toLowerCase();
        if (!cleanSrc.endsWith('.hdr')) {
            throw new Error(`지원되지 않는 형식입니다. .hdr 형식만 지원됩니다. 입력된 파일: ${src}`);
        }
    }

    /**
     * [KO] HDR 파일을 비동기로 로드합니다.
     * [EN] Loads the HDR file asynchronously.
     */
    async #loadHDRTexture(src: string) {
        try {
            const hdrData = await this.#hdrLoader.loadHDRFile(src);
            this.#hdrData = hdrData;
            await this.#createGPUTexture();
            this.#onLoad?.(this);
        } catch (error) {
            console.error('HDR loading error (.hdr 형식):', error);
            this.#onError?.(error);
        }
    }

    /**
     * [KO] GPUTexture 객체를 설정하고 리스너를 호출합니다.
     * [EN] Sets the GPUTexture object and calls listeners.
     */
    #setGpuTexture(value: GPUTexture) {
        this.#gpuTexture = value;
        if (!value) {
            this.#hdrData = null
            this.#isCubeMapInitialized = false;
        }
        this.__fireListenerList();
    }

    /**
     * [KO] 리소스를 관리 대상으로 등록합니다.
     * [EN] Registers the resource for management.
     */
    #registerResource() {
        this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateHDRTexture(this));
    }

    /**
     * [KO] 리소스 등록을 해제합니다.
     * [EN] Unregisters the resource from management.
     */
    #unregisterResource() {
        this.redGPUContext.resourceManager.unregisterManagementResource(this);
    }

    /**
     * [KO] GPUTexture 객체를 생성하고 큐브맵을 초기화합니다.
     * [EN] Creates the GPUTexture object and initializes the cubemap.
     */
    async #createGPUTexture() {
        const {gpuDevice, resourceManager} = this.redGPUContext
        if (this.#isCubeMapInitialized && this.#gpuTexture) {
            await this.#updateCubeMapContent();
            return;
        }
        await gpuDevice.queue.onSubmittedWorkDone();
        const oldTexture = this.#gpuTexture;
        this.#gpuTexture = null;
        const cubeDescriptor: GPUTextureDescriptor = {
            size: [this.#cubeMapSize, this.#cubeMapSize, 6],
            format: this.#format,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST,
            mipLevelCount: this.#mipLevelCount,
            dimension: '2d',
            label: `${this.#src}_cubemap`
        };
        const newGPUTexture = resourceManager.createManagedTexture(cubeDescriptor);
        this.#setGpuTexture(newGPUTexture);
        this.#mipLevelCount = cubeDescriptor.mipLevelCount || 1
        await this.#updateCubeMapContent();
        this.#isCubeMapInitialized = true;
        if (oldTexture) {
            await gpuDevice.queue.onSubmittedWorkDone();
            oldTexture.destroy();
        }
    }

    /**
     * [KO] 큐브맵의 내용을 갱신합니다.
     * [EN] Updates the contents of the cubemap.
     */
    async #updateCubeMapContent(onlyExposureUpdate: boolean = false) {
        const {gpuDevice, resourceManager} = this.redGPUContext;
        if (!this.#gpuTexture || !this.#hdrData) return;

        if (!onlyExposureUpdate || !this.#tempSourceTexture) {
            if (this.#tempSourceTexture) this.#tempSourceTexture.destroy();
            const {width: W, height: H} = this.#hdrData;
            const tempTextureDescriptor: GPUTextureDescriptor = {
                size: [W, H],
                format: this.#format,
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
                label: `${this.#src}_temp_source`
            };
            this.#tempSourceTexture = await this.#hdrDataToGPUTexture(gpuDevice, resourceManager, this.#hdrData, tempTextureDescriptor);
        }

        for (let mip = 0; mip < this.#mipLevelCount; mip++) {
            const roughness = mip / (this.#mipLevelCount - 1);
            await this.#generateEquirectangularToCubeMapCode(this.#tempSourceTexture, mip, roughness * roughness);
        }

        this.targetResourceManagedState.videoMemory -= this.#videoMemorySize
        this.#videoMemorySize = calculateTextureByteSize(this.#gpuTexture)
        this.targetResourceManagedState.videoMemory += this.#videoMemorySize
    }

    /**
     * [KO] 에퀴렉탱귤러 텍스처를 큐브맵으로 변환합니다.
     * [EN] Converts an equirectangular texture to a cubemap.
     */
    async #generateEquirectangularToCubeMapCode(sourceTexture: GPUTexture, mipLevel: number = 0, roughness: number = 0) {
        const {gpuDevice} = this.redGPUContext;
        const shaderModule = gpuDevice.createShaderModule({
            code: equirectangularToCubemapCode
        });
        const renderPipeline = gpuDevice.createRenderPipeline({
            layout: 'auto',
            vertex: {module: shaderModule, entryPoint: 'vs_main'},
            fragment: {module: shaderModule, entryPoint: 'fs_main', targets: [{format: this.#format}]},
        });
        const sampler = new Sampler(this.redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
        })
        const faceMatrices = this.#getCubeMapFaceMatrices();
        for (let face = 0; face < 6; face++) {
            await this.#renderCubeMapFace(renderPipeline, sampler, face, faceMatrices[face], sourceTexture, mipLevel, roughness);
        }
    }

    /**
     * [KO] Float32 데이터를 Float16으로 변환합니다.
     * [EN] Converts Float32 data to Float16.
     */
    async #float32ToFloat16Linear(float32Data: Float32Array): Promise<Uint16Array> {
        const result = await float32ToFloat16Linear(
            this.redGPUContext,
            float32Data,
            {
                width: this.#hdrData.width,
                height: this.#hdrData.height,
                workgroupSize: [8, 8]
            }
        );
        return result.data;
    }

    /**
     * [KO] HDR 데이터를 GPUTexture로 변환합니다.
     * [EN] Converts HDR data to a GPUTexture.
     */
    async #hdrDataToGPUTexture(device: GPUDevice, resourceManager: ResourceManager, hdrData: HDRData, textureDescriptor: GPUTextureDescriptor): Promise<GPUTexture> {
        const texture = device.createTexture(textureDescriptor);
        let bytesPerPixel: number;
        let uploadData: ArrayBuffer;
        switch (this.#format) {
            case 'rgba16float':
                bytesPerPixel = 8;
                const float16Data = await this.#float32ToFloat16Linear(hdrData.data);
                uploadData = float16Data.buffer as ArrayBuffer;
                break;

            default:
                throw new Error(`지원되지 않는 텍스처 포맷: ${this.#format}`);
        }
        device.queue.writeTexture(
            {texture},
            uploadData,
            {
                bytesPerRow: hdrData.width * bytesPerPixel,
                rowsPerImage: hdrData.height
            },
            {width: hdrData.width, height: hdrData.height}
        );
        return texture;
    }

    /** [KO] 큐브맵의 각 면에 대한 변환 행렬을 반환합니다. [EN] Returns the transformation matrices for each face of the cubemap. */
    #getCubeMapFaceMatrices(): Float32Array[] {
        return [
            new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]),
            new Float32Array([0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]),
            new Float32Array([1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
            new Float32Array([1, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 1]),
            new Float32Array([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
            new Float32Array([-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1])
        ];
    }

    /**
     * [KO] 큐브맵의 특정 면을 렌더링합니다.
     * [EN] Renders a specific face of the cubemap.
     */
    async #renderCubeMapFace(renderPipeline: GPURenderPipeline, sampler: Sampler, face: number, faceMatrix: Float32Array, sourceTexture: GPUTexture, mipLevel: number = 0, roughness: number = 0) {
        const {gpuDevice} = this.redGPUContext;

        const uniformData = new Float32Array(32);
        uniformData.set(faceMatrix, 0);
        uniformData[16] = roughness;

        const uniformBuffer = gpuDevice.createBuffer({
            size: uniformData.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        gpuDevice.queue.writeBuffer(uniformBuffer, 0, uniformData);

        const bindGroup = gpuDevice.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: sourceTexture.createView()},
                {binding: 1, resource: sampler.gpuSampler},
                {binding: 2, resource: {buffer: uniformBuffer}}
            ]
        });

        const commandEncoder = gpuDevice.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: this.#gpuTexture.createView({
                    dimension: '2d',
                    baseMipLevel: mipLevel,
                    mipLevelCount: 1,
                    baseArrayLayer: face,
                    arrayLayerCount: 1
                }),
                clearValue: {r: 0, g: 0, b: 0, a: 0},
                loadOp: 'clear',
                storeOp: 'store'
            }]
        });
        renderPass.setPipeline(renderPipeline);
        renderPass.setBindGroup(0, bindGroup);
        renderPass.draw(6, 1, 0, 0);
        renderPass.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);
        uniformBuffer.destroy();
    }
}

Object.freeze(HDRTexture)
export default HDRTexture
