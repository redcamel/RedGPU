import RedGPUContext from "../../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import {keepLog} from "../../../utils";
import createUUID from "../../../utils/uuid/createUUID";
import Sampler from "../../sampler/Sampler";
import CubeTexture from "../CubeTexture";
import HDRTexture from "../hdr/HDRTexture";
import IBLCubeTexture from "./IBLCubeTexture";
import irradianceShaderCode from "./irradianceShaderCode.wgsl"

/**
 * [KO] Image-Based Lighting (IBL)을 관리하는 클래스입니다.
 * [EN] Class that manages Image-Based Lighting (IBL).
 *
 * [KO] HDR 또는 큐브맵 이미지를 기반으로 주변광(Ambient)과 반사광(Specular) 환경을 생성하여 보다 사실적인 렌더링을 가능하게 합니다.
 * [EN] Enables more realistic rendering by generating ambient and specular environments based on HDR or cubemap images.
 *
 * * ### Example
 * ```typescript
 * const ibl = new RedGPU.Resource.IBL(redGPUContext, 'path/to/environment.hdr');
 * view.ibl = ibl;
 * ```
 * @category IBL
 */
class IBL {
    #redGPUContext: RedGPUContext
    #sourceCubeTexture: GPUTexture
    #environmentTexture: IBLCubeTexture;
    #irradianceTexture: IBLCubeTexture;
    #iblTexture: IBLCubeTexture
    #uuid = createUUID()
    #format: GPUTextureFormat = 'rgba16float'
    #targetTexture: HDRTexture | CubeTexture
    #envCubeSize: number
    #iblCubeSize: number

    /**
     * [KO] IBL 인스턴스를 생성합니다.
     * [EN] Creates an IBL instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param srcInfo -
     * [KO] 환경맵 소스 정보 (HDR URL 또는 6개 이미지 URL 배열)
     * [EN] Environment map source information (HDR URL or array of 6 image URLs)
     * @param envCubeSize -
     * [KO] 환경맵 큐브 크기 (기본값: 1024)
     * [EN] Environment map cube size (default: 1024)
     * @param iblCubeSize -
     * [KO] IBL 큐브 크기 (기본값: 512)
     * [EN] IBL cube size (default: 512)
     */
    constructor(redGPUContext: RedGPUContext, srcInfo: string | [string, string, string, string, string, string],
                envCubeSize: number = 1024, iblCubeSize: number = 512) {
        const cacheKeyPart = `${srcInfo}?key=${envCubeSize}_${iblCubeSize}`
        this.#iblCubeSize = iblCubeSize
        this.#envCubeSize = envCubeSize
        this.#redGPUContext = redGPUContext
        this.#environmentTexture = new IBLCubeTexture(redGPUContext, `IBL_ENV_${cacheKeyPart}`)
        this.#iblTexture = new IBLCubeTexture(redGPUContext, `IBL_${cacheKeyPart}`)
        this.#irradianceTexture = new IBLCubeTexture(redGPUContext, `IBL_IRRADIANCE_${cacheKeyPart}`)
        if (typeof srcInfo === 'string') {
            this.#targetTexture = new HDRTexture(
                redGPUContext,
                cacheKeyPart,
                (v: HDRTexture) => {
                    this.#sourceCubeTexture = v.gpuTexture
                    this.#init()
                },
                undefined,
                envCubeSize,
                true
            );
        } else {
            this.#targetTexture = new CubeTexture(
                redGPUContext,
                srcInfo,
                true,
                (v: CubeTexture) => {
                    this.#sourceCubeTexture = v.gpuTexture
                    this.#init()
                }
            );
        }
    }

    /** [KO] 환경맵 큐브 크기 [EN] Environment map cube size */
    get envCubeSize(): number {
        return this.#envCubeSize;
    }

    /** [KO] IBL 큐브 크기 [EN] IBL cube size */
    get iblCubeSize(): number {
        return this.#iblCubeSize;
    }

    /** [KO] Irradiance 텍스처를 반환합니다. [EN] Returns the irradiance texture. */
    get irradianceTexture(): IBLCubeTexture {
        return this.#irradianceTexture;
    }

    /** [KO] 환경맵 텍스처를 반환합니다. [EN] Returns the environment texture. */
    get environmentTexture(): IBLCubeTexture {
        return this.#environmentTexture;
    }

    /** [KO] IBL 텍스처를 반환합니다. [EN] Returns the IBL texture. */
    get iblTexture(): IBLCubeTexture {
        return this.#iblTexture;
    }

    /**
     * [KO] IBL 데이터를 초기화하고 맵들을 생성합니다.
     * [EN] Initializes IBL data and generates maps.
     */
    async #init() {
        const {downSampleCubeMapGenerator} = this.#redGPUContext.resourceManager
        if (this.#sourceCubeTexture) {
            if (!this.#iblTexture.gpuTexture) {
                const iblTexture = await downSampleCubeMapGenerator.downsampleCubemap(this.#sourceCubeTexture, this.#iblCubeSize)
                this.#iblTexture.gpuTexture = iblTexture
            }
            if (!this.#environmentTexture.gpuTexture) {
                this.#environmentTexture.gpuTexture = this.#sourceCubeTexture
            }
            if (!this.#irradianceTexture.gpuTexture) {
                const irradianceGPUTexture = await this.#generateIrradianceMap(this.#sourceCubeTexture);
                this.#irradianceTexture.gpuTexture = irradianceGPUTexture
            }
        }
    }

    /**
     * [KO] Irradiance 맵을 생성합니다.
     * [EN] Generates an irradiance map.
     */
    async #generateIrradianceMap(sourceCubeTexture: GPUTexture): Promise<GPUTexture> {
        const {gpuDevice, resourceManager} = this.#redGPUContext;
        const irradianceSize = 32;
        const irradianceMipLevels = 1;
        const irradianceTexture = resourceManager.createManagedTexture({
            size: [irradianceSize, irradianceSize, 6],
            format: this.#format,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
            dimension: '2d',
            mipLevelCount: irradianceMipLevels,
            label: `IBL_${this.#uuid}_irradianceTexture`
        });
        const irradianceShader = gpuDevice.createShaderModule({
            code: irradianceShaderCode
        });
        const irradiancePipeline = gpuDevice.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: irradianceShader,
                entryPoint: 'vs_main'
            },
            fragment: {
                module: irradianceShader,
                entryPoint: 'fs_main',
                targets: [{format: this.#format}]
            },
        });
        const sampler = new Sampler(this.#redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeW: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
        });
        const faceMatrices = this.#getCubeMapFaceMatrices();
        for (let face = 0; face < 6; face++) {
            await this.#renderIrradianceFace(irradiancePipeline, sampler, face, faceMatrices[face], sourceCubeTexture, irradianceTexture);
        }
        return irradianceTexture;
    }

    /**
     * [KO] Irradiance 맵의 특정 면을 렌더링합니다.
     * [EN] Renders a specific face of the irradiance map.
     */
    async #renderIrradianceFace(renderPipeline: GPURenderPipeline, sampler: Sampler, face: number, faceMatrix: Float32Array, sourceCubeTexture: GPUTexture, irradianceTexture: GPUTexture): Promise<void> {
        const {gpuDevice} = this.#redGPUContext;
        const uniformBuffer = gpuDevice.createBuffer({
            size: 64,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            label: `irradiance_face_${face}_uniform`
        });
        gpuDevice.queue.writeBuffer(uniformBuffer, 0, faceMatrix);
        const bindGroup = gpuDevice.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: sourceCubeTexture.createView({dimension: 'cube'})},
                {binding: 1, resource: sampler.gpuSampler},
                {binding: 2, resource: {buffer: uniformBuffer}}
            ]
        });
        const commandEncoder = gpuDevice.createCommandEncoder({
            label: `ibl_irradiance_face_${face}_encoder`
        });
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: irradianceTexture.createView({
                    dimension: '2d',
                    baseMipLevel: 0,
                    mipLevelCount: 1,
                    baseArrayLayer: face,
                    arrayLayerCount: 1
                }),
                clearValue: {r: 0, g: 0, b: 0, a: 1},
                loadOp: 'clear',
                storeOp: 'store'
            }],
            label: `irradiance_face_${face}_renderpass`
        });
        renderPass.setPipeline(renderPipeline);
        renderPass.setBindGroup(0, bindGroup);
        renderPass.draw(6, 1, 0, 0);
        renderPass.end();
        gpuDevice.queue.submit([commandEncoder.finish()])
        uniformBuffer.destroy();
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
}

Object.freeze(IBL)
export default IBL;