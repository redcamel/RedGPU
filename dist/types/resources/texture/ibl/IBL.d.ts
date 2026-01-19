import RedGPUContext from "../../../context/RedGPUContext";
import IBLCubeTexture from "./IBLCubeTexture";
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
declare class IBL {
    #private;
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
    constructor(redGPUContext: RedGPUContext, srcInfo: string | [string, string, string, string, string, string], envCubeSize?: number, iblCubeSize?: number);
    /** [KO] 환경맵 큐브 크기 [EN] Environment map cube size */
    get envCubeSize(): number;
    /** [KO] IBL 큐브 크기 [EN] IBL cube size */
    get iblCubeSize(): number;
    /** [KO] Irradiance 텍스처를 반환합니다. [EN] Returns the irradiance texture. */
    get irradianceTexture(): IBLCubeTexture;
    /** [KO] 환경맵 텍스처를 반환합니다. [EN] Returns the environment texture. */
    get environmentTexture(): IBLCubeTexture;
    /** [KO] IBL 텍스처를 반환합니다. [EN] Returns the IBL texture. */
    get iblTexture(): IBLCubeTexture;
}
export default IBL;
