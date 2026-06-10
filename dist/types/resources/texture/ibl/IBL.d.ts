import RedGPUContext from "../../../context/RedGPUContext";
import DirectCubeTexture from "../DirectCubeTexture";
import RedGPUObject from "../../../base/RedGPUObject";
/**
 * [KO] Image-Based Lighting (IBL)을 관리하는 클래스입니다.
 * [EN] Class that manages Image-Based Lighting (IBL).
 *
 * @category IBL
 */
declare class IBL extends RedGPUObject {
    #private;
    /**
     * [KO] IBL 인스턴스를 생성합니다.
     * [EN] Creates an IBL instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
     * @param srcInfo - [KO] 환경맵 소스 (HDR URL 또는 6개 이미지 URL 배열) [EN] Environment map source
     * @param luminance - [KO] 물리적 휘도 (Nit, 기본값: 20000) [EN] Physical luminance (Nit, default: 20000)
     * @param environmentSize - [KO] 환경맵 크기 [EN] Environment map size
     * @param prefilterSize - [KO] Prefilter 크기 [EN] Prefilter size
     * @param irradianceSize - [KO] Irradiance 크기 [EN] Irradiance size
     */
    constructor(redGPUContext: RedGPUContext, srcInfo: string | [string, string, string, string, string, string], luminance?: number, environmentSize?: number, prefilterSize?: number, irradianceSize?: number);
    get environmentSize(): number;
    get prefilterSize(): number;
    get irradianceSize(): number;
    get irradianceTexture(): DirectCubeTexture;
    get environmentTexture(): DirectCubeTexture;
    get prefilterTexture(): DirectCubeTexture;
    /** [KO] 아티스트 제어를 위한 강도 배율 [EN] Intensity multiplier for artist control */
    get intensityMultiplier(): number;
    set intensityMultiplier(value: number);
    /** [KO] 물리적 휘도 (단위: cd/m²) [EN] Physical luminance (Unit: cd/m²) */
    get luminance(): number;
    set luminance(value: number);
}
export default IBL;
