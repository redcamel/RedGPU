import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ColorRGB from "../../color/ColorRGB";
import Sampler from "../../resources/sampler/Sampler";
import DirectCubeTexture from "../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../resources/texture/DirectTexture";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import { IPostEffectResult } from "../../postEffect/core/types";
import RedGPUObject from "../../base/RedGPUObject";
/**
 * [KO] 레일리 산란(Rayleigh), 미 산란(Mie), 오존 흡수(Ozone)를 다단계 LUT로 사전 계산하여 실시간 하늘 배경, 대기 원근(Aerial Perspective) 및 간접 조명(IBL)을 생성하는 물리 기반 대기 시뮬레이션 클래스입니다.
 * [EN] Physically based atmospheric simulation class that precomputes Rayleigh scattering, Mie scattering, and Ozone absorption into multi-stage LUTs to generate real-time sky backgrounds, aerial perspective, and indirect lighting (IBL).
 *
 * ### Example
 * ```typescript
 * const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
 * view.skyAtmosphere = skyAtmosphere;
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/skyAtmosphere/skyAtmosphere/" style="width:100%; height:500px;"></iframe>
 *
 * @see [SkyAtmosphere Basic Example](/RedGPU/examples/3d/skyAtmosphere/skyAtmosphere/)
 * @see [SkyAtmosphere Scattering Test](/RedGPU/examples/3d/skyAtmosphere/scatteringTest/)
 * @see [SkyAtmosphere GLTF Example](/RedGPU/examples/3d/skyAtmosphere/gltf/)
 * @see [SkyAtmosphere LUT Generator Test](/RedGPU/examples/3d/skyAtmosphere/generator/)
 *
 * @category SkyAtmosphere
 */
declare class SkyAtmosphere extends RedGPUObject {
    #private;
    /**
     * [KO] SkyAtmosphere 인스턴스를 생성합니다.
     * [EN] Creates a SkyAtmosphere instance.
     *
     * ### Example
     * ```typescript
     * const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 대기 물리 시뮬레이션 파라미터 객체를 반환합니다.
     * [EN] Returns the atmospheric physical simulation parameters object.
     *
     * ::: warning
     * [KO] 이 속성은 시스템 유니폼 업데이트를 위한 내부 전용입니다.<br/>반환된 객체의 내부 속성을 직접 수정하지 마십시오.
     * [EN] This property is for internal system uniform updates only.<br/>Do not directly modify properties of the returned object.
     * :::
     *
     * @returns
     * [KO] 시뮬레이션 파라미터 객체
     * [EN] Simulation parameters object
     */
    get params(): {
        rayleighScattering: number[];
        rayleighExponentialDistribution: number;
        mieScattering: number[];
        mieAnisotropy: number;
        mieAbsorption: number[];
        mieExponentialDistribution: number;
        absorptionCoefficient: number[];
        absorptionTipAltitude: number;
        groundAlbedo: number[];
        absorptionTentWidth: number;
        skyLuminanceFactor: number[];
        multiScatteringFactor: number;
        sunDirection: Float32Array<ArrayBuffer>;
        groundRadius: number;
        atmosphereHeight: number;
        aerialPerspectiveDistanceScale: number;
        aerialPerspectiveStartDepth: number;
        sunIntensity: number;
        sunSize: number;
        sunLimbDarkening: number;
        cameraHeight: number;
        cloudTime: number;
        cloudTimeMultiplier: number;
        cloudCoverage: number;
        cloudDensity: number;
        cloudHeight: number;
    };
    /**
     * [KO] 구름 애니메이션 시간 진행 배수를 가져오거나 설정합니다. (기본값: 0.0)
     * [EN] Gets or sets the cloud animation time multiplier. (Default: 0.0)
     *
     * @returns
     * [KO] 구름 시간 배수
     * [EN] Cloud time multiplier
     */
    get cloudTimeMultiplier(): number;
    set cloudTimeMultiplier(value: number);
    /**
     * [KO] 하늘을 덮는 구름의 범위(0.0 ~ 1.0)를 가져오거나 설정합니다. (기본값: 0.4)
     * [EN] Gets or sets the cloud coverage across the sky (0.0 to 1.0). (Default: 0.4)
     *
     * @returns
     * [KO] 구름 커버리지 (0.0 ~ 1.0)
     * [EN] Cloud coverage (0.0 to 1.0)
     */
    get cloudCoverage(): number;
    set cloudCoverage(value: number);
    /**
     * [KO] 구름의 밀도(0.0 ~ 1.0)를 가져오거나 설정합니다. (기본값: 0.7)
     * [EN] Gets or sets the cloud density (0.0 to 1.0). (Default: 0.7)
     *
     * @returns
     * [KO] 구름 밀도 (0.0 ~ 1.0)
     * [EN] Cloud density (0.0 to 1.0)
     */
    get cloudDensity(): number;
    set cloudDensity(value: number);
    /**
     * [KO] 구름이 형성되는 고도(단위: km, 범위: 0.1 ~ 20.0)를 가져오거나 설정합니다. (기본값: 5.0)
     * [EN] Gets or sets the altitude at which clouds form (unit: km, range: 0.1 to 20.0). (Default: 5.0)
     *
     * @returns
     * [KO] 구름 고도 (km)
     * [EN] Cloud altitude (km)
     */
    get cloudHeight(): number;
    set cloudHeight(value: number);
    /**
     * [KO] 대기 원근(Aerial Perspective) 효과의 거리 스케일(범위: 1 ~ 1000)을 가져오거나 설정합니다. (기본값: 100.0)
     * [EN] Gets or sets the distance scale for the aerial perspective effect (range: 1 to 1000). (Default: 100.0)
     *
     * @returns
     * [KO] 거리 스케일
     * [EN] Distance scale
     */
    get aerialPerspectiveDistanceScale(): number;
    set aerialPerspectiveDistanceScale(value: number);
    /**
     * [KO] 대기 원근(Aerial Perspective) 효과가 시작되는 깊이(범위: 0 ~ 100)를 가져오거나 설정합니다. (기본값: 0.0)
     * [EN] Gets or sets the starting depth for the aerial perspective effect (range: 0 to 100). (Default: 0.0)
     *
     * @returns
     * [KO] 시작 깊이
     * [EN] Start depth
     */
    get aerialPerspectiveStartDepth(): number;
    set aerialPerspectiveStartDepth(value: number);
    /**
     * [KO] 행성의 반경(단위: km)을 가져오거나 설정합니다. (기본값: 6360.0)
     * [EN] Gets or sets the planet radius (unit: km). (Default: 6360.0)
     *
     * @returns
     * [KO] 행성 반경 (km)
     * [EN] Planet radius (km)
     */
    get groundRadius(): number;
    set groundRadius(value: number);
    /**
     * [KO] 대기권의 두께(단위: km)를 가져오거나 설정합니다. (기본값: 60.0)
     * [EN] Gets or sets the atmosphere thickness (unit: km). (Default: 60.0)
     *
     * @returns
     * [KO] 대기권 높이 (km)
     * [EN] Atmosphere height (km)
     */
    get atmosphereHeight(): number;
    set atmosphereHeight(value: number);
    /**
     * [KO] 미 산란(Mie Scattering)의 RGB 색상(`ColorRGB`) 객체를 반환합니다. (기본값: `ColorRGB(255, 255, 255)`)
     * [EN] Returns the Mie scattering RGB color (`ColorRGB`) object. (Default: `ColorRGB(255, 255, 255)`)
     *
     * @returns
     * [KO] 미 산란 `ColorRGB` 인스턴스
     * [EN] Mie scattering `ColorRGB` instance
     */
    get mieScattering(): ColorRGB;
    /**
     * [KO] 미 산란(Mie Scattering) 계수 배율(단위: km⁻¹, 0 이상)을 가져오거나 설정합니다. (기본값: 0.003996)
     * [EN] Gets or sets the Mie scattering coefficient scale (unit: km⁻¹, 0 or greater). (Default: 0.003996)
     *
     * @returns
     * [KO] 미 산란 계수 배율 (km⁻¹)
     * [EN] Mie scattering coefficient scale (km⁻¹)
     */
    get mieScatteringScale(): number;
    set mieScatteringScale(value: number);
    /**
     * [KO] 미 흡수(Mie Absorption)의 RGB 색상(`ColorRGB`) 객체를 반환합니다. (기본값: `ColorRGB(255, 255, 255)`)
     * [EN] Returns the Mie absorption RGB color (`ColorRGB`) object. (Default: `ColorRGB(255, 255, 255)`)
     *
     * @returns
     * [KO] 미 흡수 `ColorRGB` 인스턴스
     * [EN] Mie absorption `ColorRGB` instance
     */
    get mieAbsorption(): ColorRGB;
    /**
     * [KO] 미 흡수(Mie Absorption) 계수 배율(단위: km⁻¹, 0 이상)을 가져오거나 설정합니다. (기본값: 0.000444)
     * [EN] Gets or sets the Mie absorption coefficient scale (unit: km⁻¹, 0 or greater). (Default: 0.000444)
     *
     * @returns
     * [KO] 미 흡수 계수 배율 (km⁻¹)
     * [EN] Mie absorption coefficient scale (km⁻¹)
     */
    get mieAbsorptionScale(): number;
    set mieAbsorptionScale(value: number);
    /**
     * [KO] 레일리 산란(Rayleigh Scattering)의 RGB 색상(`ColorRGB`) 객체를 반환합니다. (기본값: `ColorRGB(45, 104, 255)`)
     * [EN] Returns the Rayleigh scattering RGB color (`ColorRGB`) object. (Default: `ColorRGB(45, 104, 255)`)
     *
     * @returns
     * [KO] 레일리 산란 `ColorRGB` 인스턴스
     * [EN] Rayleigh scattering `ColorRGB` instance
     */
    get rayleighScattering(): ColorRGB;
    /**
     * [KO] 레일리 산란(Rayleigh Scattering) 계수 배율(단위: km⁻¹, 0 이상)을 가져오거나 설정합니다. (기본값: 0.0331)
     * [EN] Gets or sets the Rayleigh scattering coefficient scale (unit: km⁻¹, 0 or greater). (Default: 0.0331)
     *
     * @returns
     * [KO] 레일리 산란 계수 배율 (km⁻¹)
     * [EN] Rayleigh scattering coefficient scale (km⁻¹)
     */
    get rayleighScatteringScale(): number;
    set rayleighScatteringScale(value: number);
    /**
     * [KO] 레일리 산란 입자의 지수 분포 고도(단위: km, 범위: 0.1 ~ 100)를 가져오거나 설정합니다. (기본값: 8.0)
     * [EN] Gets or sets the exponential distribution altitude for Rayleigh scattering particles (unit: km, range: 0.1 to 100). (Default: 8.0)
     *
     * @returns
     * [KO] 레일리 분포 고도 (km)
     * [EN] Rayleigh distribution altitude (km)
     */
    get rayleighExponentialDistribution(): number;
    set rayleighExponentialDistribution(value: number);
    /**
     * [KO] 미 산란 입자의 지수 분포 고도(단위: km, 범위: 0.1 ~ 100)를 가져오거나 설정합니다. (기본값: 1.2)
     * [EN] Gets or sets the exponential distribution altitude for Mie scattering particles (unit: km, range: 0.1 to 100). (Default: 1.2)
     *
     * @returns
     * [KO] 미 분포 고도 (km)
     * [EN] Mie distribution altitude (km)
     */
    get mieExponentialDistribution(): number;
    set mieExponentialDistribution(value: number);
    /**
     * [KO] 미 산란의 비등방성 계수(범위: 0 ~ 0.999)를 가져오거나 설정합니다. (기본값: 0.8)
     * [EN] Gets or sets the Mie scattering anisotropy factor (range: 0 to 0.999). (Default: 0.8)
     *
     * @returns
     * [KO] 미 비등방성 계수
     * [EN] Mie anisotropy factor
     */
    get mieAnisotropy(): number;
    set mieAnisotropy(value: number);
    /**
     * [KO] 지표면의 반사율(Albedo) RGB 색상(`ColorRGB`) 객체를 반환합니다. (기본값: `ColorRGB(102, 102, 102)`)
     * [EN] Returns the ground albedo RGB color (`ColorRGB`) object. (Default: `ColorRGB(102, 102, 102)`)
     *
     * @returns
     * [KO] 지표면 반사율 `ColorRGB` 인스턴스
     * [EN] Ground albedo `ColorRGB` instance
     */
    get groundAlbedo(): ColorRGB;
    /**
     * [KO] 오존층의 빛 흡수 RGB 색상(`ColorRGB`) 객체를 반환합니다. (기본값: `ColorRGB(88, 255, 12)`)
     * [EN] Returns the Ozone layer light absorption RGB color (`ColorRGB`) object. (Default: `ColorRGB(88, 255, 12)`)
     *
     * @returns
     * [KO] 오존 흡수 `ColorRGB` 인스턴스
     * [EN] Ozone absorption `ColorRGB` instance
     */
    get absorption(): ColorRGB;
    /**
     * [KO] 오존층의 빛 흡수 계수 배율(단위: km⁻¹, 0 이상)을 가져오거나 설정합니다. (기본값: 0.001881)
     * [EN] Gets or sets the Ozone layer absorption coefficient scale (unit: km⁻¹, 0 or greater). (Default: 0.001881)
     *
     * @returns
     * [KO] 오존 흡수 계수 배율 (km⁻¹)
     * [EN] Ozone absorption coefficient scale (km⁻¹)
     */
    get absorptionScale(): number;
    set absorptionScale(value: number);
    /**
     * [KO] 오존 밀도가 최대가 되는 고도(단위: km, 범위: 0 ~ 100)를 가져오거나 설정합니다. (기본값: 25.0)
     * [EN] Gets or sets the altitude where Ozone density peaks (unit: km, range: 0 to 100). (Default: 25.0)
     *
     * @returns
     * [KO] 오존 최대 밀도 고도 (km)
     * [EN] Ozone peak density altitude (km)
     */
    get absorptionTipAltitude(): number;
    set absorptionTipAltitude(value: number);
    /**
     * [KO] 오존층 분포의 두께(단위: km, 범위: 1 ~ 50)를 가져오거나 설정합니다. (기본값: 15.0)
     * [EN] Gets or sets the distribution width of the Ozone layer (unit: km, range: 1 to 50). (Default: 15.0)
     *
     * @returns
     * [KO] 오존 분포 두께 (km)
     * [EN] Ozone distribution width (km)
     */
    get absorptionTentWidth(): number;
    set absorptionTentWidth(value: number);
    /**
     * [KO] 다중 산란(Multi-Scattering) 기여도 배율(범위: 0 ~ 10)을 가져오거나 설정합니다. (기본값: 1.0)
     * [EN] Gets or sets the multi-scattering contribution factor (range: 0 to 10). (Default: 1.0)
     *
     * @returns
     * [KO] 다중 산란 배율
     * [EN] Multi-scattering factor
     */
    get multiScatteringFactor(): number;
    set multiScatteringFactor(value: number);
    /**
     * [KO] 태양 디스크의 시각적 각크기(범위: 0.01 ~ 10.0)를 가져오거나 설정합니다. (기본값: 0.533)
     * [EN] Gets or sets the visual angular size of the sun disk (range: 0.01 to 10.0). (Default: 0.533)
     *
     * @returns
     * [KO] 태양 시각적 크기
     * [EN] Visual sun size
     */
    get sunSize(): number;
    set sunSize(value: number);
    /**
     * [KO] 태양 가장자리 어두워짐(Limb Darkening) 강도(범위: 0 ~ 10.0)를 가져오거나 설정합니다. (기본값: 0.5)
     * [EN] Gets or sets the sun limb darkening intensity (range: 0 to 10.0). (Default: 0.5)
     *
     * @returns
     * [KO] 태양 주변 감쇠 강도
     * [EN] Sun limb darkening intensity
     */
    get sunLimbDarkening(): number;
    set sunLimbDarkening(value: number);
    /**
     * [KO] 하늘 전체의 RGB 휘도 배율 색상(`ColorRGB`) 객체를 반환합니다. (기본값: `ColorRGB(255, 255, 255)`)
     * [EN] Returns the overall sky RGB luminance factor color (`ColorRGB`) object. (Default: `ColorRGB(255, 255, 255)`)
     *
     * @returns
     * [KO] 하늘 휘도 배율 `ColorRGB` 인스턴스
     * [EN] Sky luminance factor `ColorRGB` instance
     */
    get skyLuminanceFactor(): ColorRGB;
    /**
     * [KO] 대기 투과율(Transmittance) 2D LUT 텍스처를 반환합니다.
     * [EN] Returns the Transmittance 2D LUT texture.
     *
     * @returns
     * [KO] Transmittance LUT 텍스처
     * [EN] Transmittance LUT texture
     */
    get transmittanceLUT(): DirectTexture;
    /**
     * [KO] 다중 산란(Multi-Scattering) 2D LUT 텍스처를 반환합니다.
     * [EN] Returns the Multi-Scattering 2D LUT texture.
     *
     * @returns
     * [KO] Multi-Scattering LUT 텍스처
     * [EN] Multi-Scattering LUT texture
     */
    get multiScatteringLUT(): DirectTexture;
    /**
     * [KO] 스카이 뷰(Sky View) 2D LUT 텍스처를 반환합니다.
     * [EN] Returns the Sky View 2D LUT texture.
     *
     * @returns
     * [KO] Sky View LUT 텍스처
     * [EN] Sky View LUT texture
     */
    get skyViewLUT(): DirectTexture;
    /**
     * [KO] 거리별 대기 산란을 저장한 대기 원근(Aerial Perspective) 볼륨 LUT 텍스처를 반환합니다.
     * [EN] Returns the Aerial Perspective volume LUT texture storing distance-based atmospheric scattering.
     *
     * @returns
     * [KO] Aerial Perspective LUT 텍스처
     * [EN] Aerial Perspective LUT texture
     */
    get aerialPerspectiveLUT(): DirectCubeTexture;
    /**
     * [KO] 대기 산란 기반 간접 난반사(Irradiance) 큐브 텍스처를 반환합니다.
     * [EN] Returns the atmospheric scattering-based indirect diffuse (Irradiance) cube texture.
     *
     * @returns
     * [KO] Irradiance 큐브 텍스처
     * [EN] Irradiance cube texture
     */
    get irradianceLUT(): DirectCubeTexture;
    /**
     * [KO] 대기 산란 기반 간접 정반사(Reflection) 큐브 텍스처를 반환합니다.
     * [EN] Returns the atmospheric scattering-based indirect specular (Reflection) cube texture.
     *
     * @returns
     * [KO] Reflection 큐브 텍스처
     * [EN] Reflection cube texture
     */
    get reflectionLUT(): DirectCubeTexture;
    /**
     * [KO] 대기 LUT 샘플링에 사용되는 선형 샘플러를 반환합니다.
     * [EN] Returns the linear sampler used for atmospheric LUT sampling.
     *
     * @returns
     * [KO] Sampler 인스턴스
     * [EN] Sampler instance
     */
    get atmosphereSampler(): Sampler;
    /**
     * [KO] 무한 거리의 하늘 배경을 렌더링합니다.
     * [EN] Renders the sky background at infinite distance.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
     */
    renderBackground(renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] 대기 상태 및 LUT를 갱신하고 씬 오브젝트 영역에 대기 원근(Aerial Perspective) 포스트 이펙트를 적용합니다.
     * [EN] Updates the atmospheric state and LUTs, and applies the aerial perspective post-effect to scene object regions.
     *
     * @param view -
     * [KO] 렌더링 대상 View3D 인스턴스
     * [EN] Target View3D instance for rendering
     * @param width -
     * [KO] 렌더 타겟 너비
     * [EN] Render target width
     * @param height -
     * [KO] 렌더 타겟 높이
     * [EN] Render target height
     * @param sourceTextureInfo -
     * [KO] 입력 소스 텍스처 정보
     * [EN] Input source texture information
     * @returns
     * [KO] 대기 효과가 적용된 포스트 이펙트 결과
     * [EN] Post-effect result with atmospheric effects applied
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
    /**
     * [KO] 태양 광원 방향, 카메라 고도 및 뷰 행렬 변화를 감지하여 대기 유니폼 버퍼와 LUT들을 갱신합니다.
     * [EN] Detects changes in sun light direction, camera altitude, and view matrix to update the atmospheric uniform buffer and LUTs.
     *
     * @param view -
     * [KO] 기준 View3D 인스턴스
     * [EN] Reference View3D instance
     */
    update(view: View3D): void;
    /**
     * [KO] SkyAtmosphere 인스턴스와 내부 생성기, 버퍼 및 리소스를 모두 해제합니다.
     * [EN] Releases the SkyAtmosphere instance along with all internal generators, buffers, and resources.
     */
    destroy(): void;
}
export default SkyAtmosphere;
