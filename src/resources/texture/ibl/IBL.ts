import RedGPUContext from "../../../context/RedGPUContext";
import CubeTexture from "../CubeTexture";
import HDRTexture from "../hdr/HDRTexture";
import {IBLCubeTexture} from "./core";

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
        const {resourceManager} = this.#redGPUContext
        const {downSampleCubeMapGenerator, irradianceGenerator} = resourceManager
        if (this.#sourceCubeTexture) {
            if (!this.#iblTexture.gpuTexture) {
                const iblTexture = await downSampleCubeMapGenerator.downsampleCubemap(this.#sourceCubeTexture, this.#iblCubeSize)
                this.#iblTexture.gpuTexture = iblTexture
            }
            if (!this.#environmentTexture.gpuTexture) {
                this.#environmentTexture.gpuTexture = this.#sourceCubeTexture
            }
            if (!this.#irradianceTexture.gpuTexture) {
                const irradianceGPUTexture = await irradianceGenerator.generate(this.#sourceCubeTexture);
                this.#irradianceTexture.gpuTexture = irradianceGPUTexture
            }
        }
    }
}


Object.freeze(IBL)
export default IBL;