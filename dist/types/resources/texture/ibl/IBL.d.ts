import RedGPUContext from "../../../context/RedGPUContext";
import { IBLCubeTexture } from "./core";
/**
 * [KO] Image-Based Lighting (IBL)을 관리하는 클래스입니다.
 * [EN] Class that manages Image-Based Lighting (IBL).
 *
 * [KO] HDR 또는 큐브맵 이미지를 기반으로 주변광(Diffuse)과 반사광(Specular) 환경을 생성하여 사실적인 PBR 라이팅을 구현합니다.
 * [EN] Enables realistic PBR lighting by generating diffuse and specular environments based on HDR or cubemap images.
 *
 * ### Example
 * ```typescript
 * const ibl = new RedGPU.Resource.IBL(redGPUContext, 'path/to/environment.hdr');
 * view.ibl = ibl;
 * ```
 * @category IBL
 */
declare class IBL {
    #private;
    /**
     * [KO] IBL 인스턴스를 생성합니다.
     * [EN] Creates an IBL instance.
     *
     * ### Example
     * ```typescript
     * const ibl = new RedGPU.Resource.IBL(redGPUContext, 'path/to/environment.hdr', 1024, 512, 64);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param srcInfo -
     * [KO] 환경맵 소스 정보 (HDR URL 또는 6개 이미지 URL 배열)
     * [EN] Environment map source information (HDR URL or array of 6 image URLs)
     * @param environmentSize -
     * [KO] 환경맵 큐브 크기 (기본값: 1024)
     * [EN] Environment map cube size (default: 1024)
     * @param prefilterSize -
     * [KO] Prefilter 큐브 크기 (기본값: 512)
     * [EN] Prefilter cube size (default: 512)
     * @param irradianceSize -
     * [KO] Irradiance 큐브 크기 (기본값: 64)
     * [EN] Irradiance cube size (default: 64)
     */
    constructor(redGPUContext: RedGPUContext, srcInfo: string | [string, string, string, string, string, string], environmentSize?: number, prefilterSize?: number, irradianceSize?: number);
    /** [KO] 환경맵 큐브 크기 [EN] Environment map cube size */
    get environmentSize(): number;
    /** [KO] Prefilter 큐브 크기 [EN] Prefilter cube size */
    get prefilterSize(): number;
    /** [KO] Irradiance 큐브 크기 [EN] Irradiance cube size */
    get irradianceSize(): number;
    /** [KO] Irradiance 텍스처를 반환합니다. [EN] Returns the irradiance texture. */
    get irradianceTexture(): IBLCubeTexture;
    /** [KO] 환경맵 텍스처를 반환합니다. [EN] Returns the environment texture. */
    get environmentTexture(): IBLCubeTexture;
    /** [KO] IBL (Specular Prefilter) 텍스처를 반환합니다. [EN] Returns the IBL (Specular Prefilter) texture. */
    get prefilterTexture(): IBLCubeTexture;
}
export default IBL;
