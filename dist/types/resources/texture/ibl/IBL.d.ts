import RedGPUContext from "../../../context/RedGPUContext";
import DirectCubeTexture from "../DirectCubeTexture";
import RedGPUObject from "../../../base/RedGPUObject";
/**
 * [KO] 환경맵 소스로부터 Environment, Irradiance, Prefilter 큐브맵을 생성하여 IBL(Image-Based Lighting)을 제공하는 클래스입니다.
 * [EN] Class that provides IBL (Image-Based Lighting) by generating environment, irradiance, and prefilter cube maps from an environment map source.
 *
 * [KO] HDR 소스는 내부에서 큐브맵으로 변환되며, 소스가 변경되면 모든 맵이 비동기로 재생성됩니다.
 * [EN] HDR sources are converted to a cube map internally, and all maps are regenerated asynchronously when the source changes.
 *
 * ### Example
 * ```typescript
 * const ibl = new RedGPU.Resource.IBL(redGPUContext, '/assets/hdr/environment.hdr');
 * view.ibl = ibl;
 * ```
 *
 * @see [SkyBox IBL example](/RedGPU/examples/3d/skybox/ibl/skyboxWithIbl/)
 * @see [IBL test example](/RedGPU/examples/3d/skybox/ibl/iblTest/)
 * @see [IBL texture size example](/RedGPU/examples/3d/skybox/ibl/iblTextureSize/)
 * @category IBL
 */
declare class IBL extends RedGPUObject {
    #private;
    /**
     * [KO] IBL 인스턴스를 생성하고 환경맵 소스 로딩을 시작합니다.
     * [EN] Creates an IBL instance and starts loading the environment map source.
     *
     * ### Example
     * ```typescript
     * // [KO] HDR 파일 사용
     * // [EN] Using an HDR file
     * const ibl = new RedGPU.Resource.IBL(redGPUContext, '/assets/hdr/environment.hdr');
     *
     * // [KO] 6면 이미지 사용 (px, nx, py, ny, pz, nz)
     * // [EN] Using 6 face images (px, nx, py, ny, pz, nz)
     * const iblCube = new RedGPU.Resource.IBL(redGPUContext, [
     *     'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'
     * ]);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param srcInfo -
     * [KO] 환경맵 소스 (HDR URL 문자열 또는 6개 이미지 URL 배열)
     * [EN] Environment map source (HDR URL string or array of 6 image URLs)
     * @param luminance -
     * [KO] 물리적 휘도 (단위: cd/m², 기본값: 25000)
     * [EN] Physical luminance (unit: cd/m², default: 25000)
     * @param environmentSize -
     * [KO] Environment 큐브맵 한 면의 크기 (픽셀, 기본값: 1024)
     * [EN] Face size of the environment cube map (pixels, default: 1024)
     * @param prefilterSize -
     * [KO] Prefilter 큐브맵 한 면의 크기 (픽셀, 기본값: 512)
     * [EN] Face size of the prefilter cube map (pixels, default: 512)
     * @param irradianceSize -
     * [KO] Irradiance 큐브맵 한 면의 크기 (픽셀, 기본값: 64)
     * [EN] Face size of the irradiance cube map (pixels, default: 64)
     */
    constructor(redGPUContext: RedGPUContext, srcInfo: string | [string, string, string, string, string, string], luminance?: number, environmentSize?: number, prefilterSize?: number, irradianceSize?: number);
    /**
     * [KO] Environment 큐브맵 한 면의 크기(픽셀)를 반환합니다.
     * [EN] Returns the face size of the environment cube map in pixels.
     *
     * @returns
     * [KO] Environment 맵 크기
     * [EN] Environment map size
     */
    get environmentSize(): number;
    /**
     * [KO] Prefilter 큐브맵 한 면의 크기(픽셀)를 반환합니다.
     * [EN] Returns the face size of the prefilter cube map in pixels.
     *
     * @returns
     * [KO] Prefilter 맵 크기
     * [EN] Prefilter map size
     */
    get prefilterSize(): number;
    /**
     * [KO] Irradiance 큐브맵 한 면의 크기(픽셀)를 반환합니다.
     * [EN] Returns the face size of the irradiance cube map in pixels.
     *
     * @returns
     * [KO] Irradiance 맵 크기
     * [EN] Irradiance map size
     */
    get irradianceSize(): number;
    /**
     * [KO] 확산광(Diffuse) 조명에 사용되는 Irradiance 큐브 텍스처를 반환합니다.
     * [EN] Returns the irradiance cube texture used for diffuse lighting.
     *
     * @returns
     * [KO] Irradiance 큐브 텍스처
     * [EN] Irradiance cube texture
     */
    get irradianceTexture(): DirectCubeTexture;
    /**
     * [KO] 원본 환경맵에서 변환된 Environment 큐브 텍스처를 반환합니다.
     * [EN] Returns the environment cube texture converted from the source environment map.
     *
     * @returns
     * [KO] Environment 큐브 텍스처
     * [EN] Environment cube texture
     */
    get environmentTexture(): DirectCubeTexture;
    /**
     * [KO] 반사광(Specular) 조명에 사용되는 거칠기별 Prefilter 큐브 텍스처를 반환합니다.
     * [EN] Returns the roughness-based prefilter cube texture used for specular lighting.
     *
     * @returns
     * [KO] Prefilter 큐브 텍스처
     * [EN] Prefilter cube texture
     */
    get prefilterTexture(): DirectCubeTexture;
    /**
     * [KO] 아티스트 제어용 IBL 강도 배율을 반환하거나 설정합니다. (기본값: 1.0)
     * [EN] Gets or sets the IBL intensity multiplier for artist control. (default: 1.0)
     *
     * @returns
     * [KO] 강도 배율
     * [EN] Intensity multiplier
     */
    get intensityMultiplier(): number;
    set intensityMultiplier(value: number);
    /**
     * [KO] 환경광의 물리적 휘도를 반환하거나 설정합니다. (단위: cd/m²)
     * [EN] Gets or sets the physical luminance of the environment light. (unit: cd/m²)
     *
     * @returns
     * [KO] 물리적 휘도
     * [EN] Physical luminance
     */
    get luminance(): number;
    set luminance(value: number);
}
export default IBL;
