import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import TransmittanceGenerator from "./core/generator/transmittance/TransmittanceGenerator";
import MultiScatteringGenerator from "./core/generator/multiScattering/MultiScatteringGenerator";
import SkyViewGenerator from "./core/generator/skyView/SkyViewGenerator";
import AerialPerspectiveGenerator from "./core/generator/aerialPerspective/AerialPerspectiveGenerator";
import transmittanceShaderCode_wgsl from "./core/generator/transmittance/transmittanceShaderCode.wgsl";
import Sampler from "../../resources/sampler/Sampler";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";

import DirectCubeTexture from "../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../resources/texture/DirectTexture";

import {mat4} from "gl-matrix";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import DirectionalLight from "../../light/lights/DirectionalLight";
import SkyLight from "./core/skyLight/SkyLight";
import SkyAtmosphereBackground from "./core/skyAtmosphereBackground/SkyAtmosphereBackground";
import SkyAtmospherePostEffect from "./core/skyAtmospherePostEffect/SkyAtmospherePostEffect";
import {IPostEffectResult} from "../../postEffect/core/types";
import RedGPUObject from "../../base/RedGPUObject";


interface CachedUniformMember {
    key: string;
    offset: number;
    isFloat: boolean;
    isArray: boolean;
}

/**
 * [KO] 물리 기반 대기 산란(Atmospheric Scattering) 시뮬레이션 클래스입니다.
 * [EN] Physically based atmospheric scattering simulation class.
 *
 * [KO] 레일리 산란(Rayleigh Scattering), 미 산란(Mie Scattering), 오존 흡수(Ozone Absorption)를 다단계 LUT로 사전 계산하여 실시간 하늘 배경, 노을, Aerial Perspective 및 대기 기반 간접 조명(IBL)을 생성합니다.
 * [EN] Precomputes Rayleigh scattering, Mie scattering, and Ozone absorption into multi-stage LUTs to generate real-time sky backgrounds, sunsets, aerial perspective, and atmosphere-based indirect lighting (IBL).
 *
 * ### Example
 * ```typescript
 * const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
 * view.skyAtmosphere = skyAtmosphere;
 * ```
 *
 * @see [SkyAtmosphere Basic Example](/RedGPU/examples/3d/skyAtmosphere/skyAtmosphere/)
 * @see [SkyAtmosphere Scattering Test](/RedGPU/examples/3d/skyAtmosphere/scatteringTest/)
 * @see [SkyAtmosphere GLTF Example](/RedGPU/examples/3d/skyAtmosphere/gltf/)
 * @see [SkyAtmosphere LUT Generator Test](/RedGPU/examples/3d/skyAtmosphere/generator/)
 *
 * @category SkyAtmosphere
 */
class SkyAtmosphere extends RedGPUObject {

    #transmittanceGenerator: TransmittanceGenerator;
    #multiScatteringGenerator: MultiScatteringGenerator;
    #skyViewGenerator: SkyViewGenerator;
    #aerialPerspectiveGenerator: AerialPerspectiveGenerator;
    #sampler: Sampler;
    #sharedUniformBuffer: UniformBuffer;
    #skyLight: SkyLight;

    #backgroundRenderer: SkyAtmosphereBackground;
    #postEffect: SkyAtmospherePostEffect;

    #cachedUniformMembers: CachedUniformMember[] = [];

    #params = {
        rayleighScattering: [0.005802, 0.013558, 0.033100],
        rayleighExponentialDistribution: 8.0,
        mieScattering: [0.003996, 0.003996, 0.003996],
        mieAnisotropy: 0.8,
        mieAbsorption: [0.000444, 0.000444, 0.000444],
        mieExponentialDistribution: 1.2,
        absorptionCoefficient: [0.000650, 0.001881, 0.000085],
        absorptionTipAltitude: 25.0,
        groundAlbedo: [0.4, 0.4, 0.4],
        absorptionTentWidth: 15.0,
        skyLuminanceFactor: [1.0, 1.0, 1.0],
        multiScatteringFactor: 1.0,
        sunDirection: new Float32Array([0, 1, 0]),
        transmittanceMinLightElevationAngle: -90.0,
        groundRadius: 6360.0,
        atmosphereHeight: 60.0,
        aerialPerspectiveDistanceScale: 100.0,
        aerialPerspectiveStartDepth: 0.0,
        sunIntensity: 100000.0,
        sunSize: 0.533,
        sunLimbDarkening: 0.5,
        cameraHeight: 0.001,
        cloudTime: 0.0,
        cloudTimeMultiplier: 0.0,
        cloudCoverage: 0.4,
        cloudDensity: 0.7,
        cloudHeight: 5.0
    };

    #activeSunSource: DirectionalLight = null;
    #prevSunSource: DirectionalLight = null;
    #dirtyLUT: boolean = true;
    #dirtySkyView: boolean = true;
    #dirtyAerialPerspective: boolean = true;
    #dirtyUniformBuffer: boolean = true;

    #lastUpdateFrame: number = -1;
    #prevCameraMatrix: mat4 = mat4.create();
    #UNIFORM_STRUCT: any

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
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        const SHADER_INFO = redGPUContext.resourceManager.wgslParser.parse('SkyAtmosphere_Core', transmittanceShaderCode_wgsl);
        this.#UNIFORM_STRUCT = SHADER_INFO.uniforms.params;
        this.#sharedUniformBuffer = new UniformBuffer(this.redGPUContext, new ArrayBuffer(this.#UNIFORM_STRUCT.arrayBufferByteLength), 'SkyAtmosphere_Shared_UniformBuffer');

        this.#sampler = new Sampler(redGPUContext, {
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: 'linear',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge'
        });

        this.#transmittanceGenerator = new TransmittanceGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);
        this.#multiScatteringGenerator = new MultiScatteringGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);
        this.#skyViewGenerator = new SkyViewGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);
        this.#aerialPerspectiveGenerator = new AerialPerspectiveGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);

        this.#skyLight = new SkyLight(redGPUContext, this.#sharedUniformBuffer, this.#sampler);
        this.#backgroundRenderer = new SkyAtmosphereBackground(redGPUContext);
        this.#postEffect = new SkyAtmospherePostEffect(redGPUContext, this);

        this.#initCachedUniformMembers();
    }


    /**
     * [KO] 대기 투과 포스트 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the atmospheric transmittance post-effect instance.
     *
     * @returns
     * [KO] SkyAtmospherePostEffect 인스턴스
     * [EN] SkyAtmospherePostEffect instance
     */
    get postEffect(): SkyAtmospherePostEffect {
        return this.#postEffect;
    }

    /**
     * [KO] 대기 물리 시뮬레이션 파라미터 객체를 반환합니다.
     * [EN] Returns the atmospheric physical simulation parameters object.
     *
     * @returns
     * [KO] 시뮬레이션 파라미터 객체
     * [EN] Simulation parameters object
     */
    get params() {
        return this.#params;
    }

    /**
     * [KO] 구름 애니메이션 시간 진행 배수를 가져오거나 설정합니다. (기본값: 0.0)
     * [EN] Gets or sets the cloud animation time multiplier. (Default: 0.0)
     *
     * @returns
     * [KO] 구름 시간 배수
     * [EN] Cloud time multiplier
     */
    get cloudTimeMultiplier(): number {
        return this.#params.cloudTimeMultiplier;
    }

    set cloudTimeMultiplier(v: number) {
        this.#setParam('cloudTimeMultiplier', v, false, false, false, (v) => validateNumberRange(v,));
    }

    /**
     * [KO] 하늘을 덮는 구름의 범위(0.0 ~ 1.0)를 가져오거나 설정합니다. (기본값: 0.4)
     * [EN] Gets or sets the cloud coverage across the sky (0.0 to 1.0). (Default: 0.4)
     *
     * @returns
     * [KO] 구름 커버리지 (0.0 ~ 1.0)
     * [EN] Cloud coverage (0.0 to 1.0)
     */
    get cloudCoverage(): number {
        return this.#params.cloudCoverage;
    }

    set cloudCoverage(v: number) {
        this.#setParam('cloudCoverage', v, false, false, false, (v) => validateNumberRange(v, 0, 1.0));
    }

    /**
     * [KO] 구름의 밀도(0.0 ~ 1.0)를 가져오거나 설정합니다. (기본값: 0.7)
     * [EN] Gets or sets the cloud density (0.0 to 1.0). (Default: 0.7)
     *
     * @returns
     * [KO] 구름 밀도 (0.0 ~ 1.0)
     * [EN] Cloud density (0.0 to 1.0)
     */
    get cloudDensity(): number {
        return this.#params.cloudDensity;
    }

    set cloudDensity(v: number) {
        this.#setParam('cloudDensity', v, false, false, false, (v) => validateNumberRange(v, 0, 1.0));
    }

    /**
     * [KO] 구름이 형성되는 고도(단위: km, 범위: 0.1 ~ 20.0)를 가져오거나 설정합니다. (기본값: 5.0)
     * [EN] Gets or sets the altitude at which clouds form (unit: km, range: 0.1 to 20.0). (Default: 5.0)
     *
     * @returns
     * [KO] 구름 고도 (km)
     * [EN] Cloud altitude (km)
     */
    get cloudHeight(): number {
        return this.#params.cloudHeight;
    }

    set cloudHeight(v: number) {
        this.#setParam('cloudHeight', v, false, false, false, (v) => validatePositiveNumberRange(v, 0.1, 20.0));
    }

    /**
     * [KO] Aerial Perspective 효과의 거리 스케일(범위: 1 ~ 1000)을 가져오거나 설정합니다. (기본값: 100.0)
     * [EN] Gets or sets the distance scale for the Aerial Perspective effect (range: 1 to 1000). (Default: 100.0)
     *
     * @returns
     * [KO] 거리 스케일
     * [EN] Distance scale
     */
    get aerialPerspectiveDistanceScale(): number {
        return this.#params.aerialPerspectiveDistanceScale;
    }

    set aerialPerspectiveDistanceScale(v: number) {
        this.#setParam('aerialPerspectiveDistanceScale', v, false, true, true, (v) => validatePositiveNumberRange(v, 1, 1000));
    }

    /**
     * [KO] Aerial Perspective 효과가 시작되는 깊이(범위: 0 ~ 100)를 가져오거나 설정합니다. (기본값: 0.0)
     * [EN] Gets or sets the starting depth for the Aerial Perspective effect (range: 0 to 100). (Default: 0.0)
     *
     * @returns
     * [KO] 시작 깊이
     * [EN] Start depth
     */
    get aerialPerspectiveStartDepth(): number {
        return this.#params.aerialPerspectiveStartDepth;
    }

    set aerialPerspectiveStartDepth(v: number) {
        this.#setParam('aerialPerspectiveStartDepth', v, false, true, true, (v) => validatePositiveNumberRange(v, 0, 100));
    }

    /**
     * [KO] 투과율 계산에 사용되는 최소 태양 고도각(단위: 도, 범위: -90 ~ 90)을 가져오거나 설정합니다. (기본값: -90.0)
     * [EN] Gets or sets the minimum light elevation angle used for transmittance calculation (unit: degrees, range: -90 to 90). (Default: -90.0)
     *
     * @returns
     * [KO] 최소 고도각 (도)
     * [EN] Minimum elevation angle (degrees)
     */
    get transmittanceMinLightElevationAngle(): number {
        return this.#params.transmittanceMinLightElevationAngle;
    }

    set transmittanceMinLightElevationAngle(v: number) {
        this.#setParam('transmittanceMinLightElevationAngle', v, true, true, true, (v) => validateNumberRange(v, -90, 90));
    }

    /**
     * [KO] 행성의 반경(단위: km)을 가져오거나 설정합니다. (기본값: 6360.0)
     * [EN] Gets or sets the planet radius (unit: km). (Default: 6360.0)
     *
     * @returns
     * [KO] 행성 반경 (km)
     * [EN] Planet radius (km)
     */
    get groundRadius(): number {
        return this.#params.groundRadius;
    }

    set groundRadius(v: number) {
        this.#setParam('groundRadius', v, true, false, true, (v) => validatePositiveNumberRange(v, 1));
    }

    /**
     * [KO] 대기권의 두께(단위: km)를 가져오거나 설정합니다. (기본값: 60.0)
     * [EN] Gets or sets the atmosphere thickness (unit: km). (Default: 60.0)
     *
     * @returns
     * [KO] 대기권 높이 (km)
     * [EN] Atmosphere height (km)
     */
    get atmosphereHeight(): number {
        return this.#params.atmosphereHeight;
    }

    set atmosphereHeight(v: number) {
        this.#setParam('atmosphereHeight', v, true, false, true, (v) => validatePositiveNumberRange(v, 1));
    }

    /**
     * [KO] 미 산란(Mie Scattering) RGB 계수를 가져오거나 설정합니다.
     * [EN] Gets or sets the Mie scattering RGB coefficients.
     *
     * @returns
     * [KO] RGB 미 산란 계수 배열 (`[number, number, number]`)
     * [EN] RGB Mie scattering coefficient tuple (`[number, number, number]`)
     */
    get mieScattering(): [number, number, number] {
        return [this.#params.mieScattering[0], this.#params.mieScattering[1], this.#params.mieScattering[2]];
    }

    set mieScattering(v: [number, number, number]) {
        this.#setParam('mieScattering', [...v], true, false, true);
    }

    /**
     * [KO] 미 흡수(Mie Absorption) RGB 계수를 가져오거나 설정합니다.
     * [EN] Gets or sets the Mie absorption RGB coefficients.
     *
     * @returns
     * [KO] RGB 미 흡수 계수 배열 (`[number, number, number]`)
     * [EN] RGB Mie absorption coefficient tuple (`[number, number, number]`)
     */
    get mieAbsorption(): [number, number, number] {
        return [this.#params.mieAbsorption[0], this.#params.mieAbsorption[1], this.#params.mieAbsorption[2]];
    }

    set mieAbsorption(v: [number, number, number]) {
        this.#setParam('mieAbsorption', [...v], true, false, true);
    }

    /**
     * [KO] 레일리 산란(Rayleigh Scattering) RGB 계수를 가져오거나 설정합니다.
     * [EN] Gets or sets the Rayleigh scattering RGB coefficients.
     *
     * @returns
     * [KO] RGB 레일리 산란 계수 배열 (`[number, number, number]`)
     * [EN] RGB Rayleigh scattering coefficient tuple (`[number, number, number]`)
     */
    get rayleighScattering(): [number, number, number] {
        return [this.#params.rayleighScattering[0], this.#params.rayleighScattering[1], this.#params.rayleighScattering[2]];
    }

    set rayleighScattering(v: [number, number, number]) {
        this.#setParam('rayleighScattering', [...v], true, false, true);
    }

    /**
     * [KO] 레일리 산란 입자의 지수 분포 고도(단위: km, 범위: 0.1 ~ 100)를 가져오거나 설정합니다. (기본값: 8.0)
     * [EN] Gets or sets the exponential distribution altitude for Rayleigh scattering particles (unit: km, range: 0.1 to 100). (Default: 8.0)
     *
     * @returns
     * [KO] 레일리 분포 고도 (km)
     * [EN] Rayleigh distribution altitude (km)
     */
    get rayleighExponentialDistribution(): number {
        return this.#params.rayleighExponentialDistribution;
    }

    set rayleighExponentialDistribution(v: number) {
        this.#setParam('rayleighExponentialDistribution', v, true, false, true, (v) => validatePositiveNumberRange(v, 0.1, 100));
    }

    /**
     * [KO] 미 산란 입자의 지수 분포 고도(단위: km, 범위: 0.1 ~ 100)를 가져오거나 설정합니다. (기본값: 1.2)
     * [EN] Gets or sets the exponential distribution altitude for Mie scattering particles (unit: km, range: 0.1 to 100). (Default: 1.2)
     *
     * @returns
     * [KO] 미 분포 고도 (km)
     * [EN] Mie distribution altitude (km)
     */
    get mieExponentialDistribution(): number {
        return this.#params.mieExponentialDistribution;
    }

    set mieExponentialDistribution(v: number) {
        this.#setParam('mieExponentialDistribution', v, true, false, true, (v) => validatePositiveNumberRange(v, 0.1, 100));
    }

    /**
     * [KO] 미 산란의 비등방성 계수(범위: 0 ~ 0.999)를 가져오거나 설정합니다. (기본값: 0.8)
     * [EN] Gets or sets the Mie scattering anisotropy factor (range: 0 to 0.999). (Default: 0.8)
     *
     * @returns
     * [KO] 미 비등방성 계수
     * [EN] Mie anisotropy factor
     */
    get mieAnisotropy(): number {
        return this.#params.mieAnisotropy;
    }

    set mieAnisotropy(v: number) {
        this.#setParam('mieAnisotropy', v, true, false, true, (v) => validateNumberRange(v, 0, 0.999));
    }

    /**
     * [KO] 지표면의 RGB 반사율(Albedo)을 가져오거나 설정합니다.
     * [EN] Gets or sets the ground RGB albedo.
     *
     * @returns
     * [KO] 지표면 RGB 반사율 배열 (`[number, number, number]`)
     * [EN] Ground RGB albedo tuple (`[number, number, number]`)
     */
    get groundAlbedo(): [number, number, number] {
        return [this.#params.groundAlbedo[0], this.#params.groundAlbedo[1], this.#params.groundAlbedo[2]];
    }

    set groundAlbedo(v: [number, number, number]) {
        this.#setParam('groundAlbedo', [...v], true, false, true);
    }

    /**
     * [KO] 오존층의 빛 흡수 RGB 계수를 가져오거나 설정합니다.
     * [EN] Gets or sets the Ozone layer RGB absorption coefficients.
     *
     * @returns
     * [KO] 오존 흡수 RGB 계수 배열 (`[number, number, number]`)
     * [EN] Ozone RGB absorption coefficient tuple (`[number, number, number]`)
     */
    get absorptionCoefficient(): [number, number, number] {
        return [this.#params.absorptionCoefficient[0], this.#params.absorptionCoefficient[1], this.#params.absorptionCoefficient[2]];
    }

    set absorptionCoefficient(v: [number, number, number]) {
        this.#setParam('absorptionCoefficient', [...v], true, false, true);
    }

    /**
     * [KO] 오존 밀도가 최대가 되는 고도(단위: km)를 가져오거나 설정합니다. (기본값: 25.0)
     * [EN] Gets or sets the altitude where Ozone density peaks (unit: km). (Default: 25.0)
     *
     * @returns
     * [KO] 오존 최대 밀도 고도 (km)
     * [EN] Ozone peak density altitude (km)
     */
    get absorptionTipAltitude(): number {
        return this.#params.absorptionTipAltitude;
    }

    set absorptionTipAltitude(v: number) {
        this.#setParam('absorptionTipAltitude', v, true, false, true, (v) => validatePositiveNumberRange(0, 100));
    }

    /**
     * [KO] 오존층 분포의 두께(단위: km, 범위: 1 ~ 50)를 가져오거나 설정합니다. (기본값: 15.0)
     * [EN] Gets or sets the distribution width of the Ozone layer (unit: km, range: 1 to 50). (Default: 15.0)
     *
     * @returns
     * [KO] 오존 분포 두께 (km)
     * [EN] Ozone distribution width (km)
     */
    get absorptionTentWidth(): number {
        return this.#params.absorptionTentWidth;
    }

    set absorptionTentWidth(v: number) {
        this.#setParam('absorptionTentWidth', v, true, false, true, (v) => validatePositiveNumberRange(v, 1, 50));
    }

    /**
     * [KO] 다중 산란(Multi-Scattering) 기여도 배율(범위: 0 ~ 10)을 가져오거나 설정합니다. (기본값: 1.0)
     * [EN] Gets or sets the multi-scattering contribution factor (range: 0 to 10). (Default: 1.0)
     *
     * @returns
     * [KO] 다중 산란 배율
     * [EN] Multi-scattering factor
     */
    get multiScatteringFactor(): number {
        return this.#params.multiScatteringFactor;
    }

    set multiScatteringFactor(v: number) {
        this.#setParam('multiScatteringFactor', v, true, false, true, (v) => validatePositiveNumberRange(v, 0, 10));
    }

    /**
     * [KO] 태양 디스크의 시각적 각크기(범위: 0.01 ~ 10.0)를 가져오거나 설정합니다. (기본값: 0.533)
     * [EN] Gets or sets the visual angular size of the sun disk (range: 0.01 to 10.0). (Default: 0.533)
     *
     * @returns
     * [KO] 태양 시각적 크기
     * [EN] Visual sun size
     */
    get sunSize(): number {
        return this.#params.sunSize;
    }

    set sunSize(v: number) {
        this.#setParam('sunSize', v, false, true, true, (v) => validatePositiveNumberRange(v, 0.01, 10.0));
    }

    /**
     * [KO] 태양 가장자리 어두워짐(Limb Darkening) 강도(범위: 0 ~ 10.0)를 가져오거나 설정합니다. (기본값: 0.5)
     * [EN] Gets or sets the sun limb darkening intensity (range: 0 to 10.0). (Default: 0.5)
     *
     * @returns
     * [KO] 태양 주변 감쇠 강도
     * [EN] Sun limb darkening intensity
     */
    get sunLimbDarkening(): number {
        return this.#params.sunLimbDarkening;
    }

    set sunLimbDarkening(v: number) {
        this.#setParam('sunLimbDarkening', v, false, false, true, (v) => validateNumberRange(v, 0, 10.0));
    }

    /**
     * [KO] 하늘 전체의 RGB 휘도 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the overall sky RGB luminance factor.
     *
     * @returns
     * [KO] 하늘 RGB 휘도 배율 배열 (`[number, number, number]`)
     * [EN] Sky RGB luminance factor tuple (`[number, number, number]`)
     */
    get skyLuminanceFactor(): [number, number, number] {
        return [this.#params.skyLuminanceFactor[0], this.#params.skyLuminanceFactor[1], this.#params.skyLuminanceFactor[2]];
    }

    set skyLuminanceFactor(v: [number, number, number]) {
        this.#setParam('skyLuminanceFactor', [...v], true, false, true);
    }

    /**
     * [KO] 대기 투과율(Transmittance) 2D LUT 텍스처를 반환합니다.
     * [EN] Returns the Transmittance 2D LUT texture.
     *
     * @returns
     * [KO] Transmittance LUT 텍스처
     * [EN] Transmittance LUT texture
     */
    get transmittanceLUT(): DirectTexture {
        return this.#transmittanceGenerator.lutTexture;
    }

    /**
     * [KO] 다중 산란(Multi-Scattering) 2D LUT 텍스처를 반환합니다.
     * [EN] Returns the Multi-Scattering 2D LUT texture.
     *
     * @returns
     * [KO] Multi-Scattering LUT 텍스처
     * [EN] Multi-Scattering LUT texture
     */
    get multiScatLUT(): DirectTexture {
        return this.#multiScatteringGenerator.lutTexture;
    }

    /**
     * [KO] 스카이 뷰(Sky View) 2D LUT 텍스처를 반환합니다.
     * [EN] Returns the Sky View 2D LUT texture.
     *
     * @returns
     * [KO] Sky View LUT 텍스처
     * [EN] Sky View LUT texture
     */
    get skyViewLUT(): DirectTexture {
        return this.#skyViewGenerator.lutTexture;
    }

    /**
     * [KO] 거리별 대기 산란을 저장한 Aerial Perspective 3D LUT 텍스처를 반환합니다.
     * [EN] Returns the Aerial Perspective 3D LUT texture storing distance-based atmospheric scattering.
     *
     * @returns
     * [KO] Aerial Perspective LUT 텍스처
     * [EN] Aerial Perspective LUT texture
     */
    get aerialPerspectiveLUT(): DirectCubeTexture {
        return this.#aerialPerspectiveGenerator.lutTexture;
    }

    /**
     * [KO] 대기 산란 기반 간접 디퓨즈(Irradiance) 큐브 텍스처를 반환합니다.
     * [EN] Returns the atmospheric scattering-based indirect diffuse (Irradiance) cube texture.
     *
     * @returns
     * [KO] Irradiance 큐브 텍스처
     * [EN] Irradiance cube texture
     */
    get skyAtmosphereIrradianceLUT(): DirectCubeTexture {
        return this.#skyLight.irradianceLUT;
    }

    /**
     * [KO] 대기 산란 기반 간접 스펙큘러(Reflection) 큐브 텍스처를 반환합니다.
     * [EN] Returns the atmospheric scattering-based indirect specular (Reflection) cube texture.
     *
     * @returns
     * [KO] Reflection 큐브 텍스처
     * [EN] Reflection cube texture
     */
    get skyAtmosphereReflectionLUT(): DirectCubeTexture {
        return this.#skyLight.reflectionLUT;
    }

    /**
     * [KO] 대기 데이터를 기반으로 간접 조명(IBL)을 생성하는 SkyLight 인스턴스를 반환합니다.
     * [EN] Returns the SkyLight instance that generates indirect lighting (IBL) based on atmospheric data.
     *
     * @returns
     * [KO] SkyLight 인스턴스
     * [EN] SkyLight instance
     */
    get skyLight(): SkyLight {
        return this.#skyLight;
    }

    /**
     * [KO] 대기 LUT 샘플링에 사용되는 선형 샘플러를 반환합니다.
     * [EN] Returns the linear sampler used for atmospheric LUT sampling.
     *
     * @returns
     * [KO] Sampler 인스턴스
     * [EN] Sampler instance
     */
    get atmosphereSampler() {
        return this.#sampler;
    }

    /**
     * [KO] 무한 거리의 하늘 배경을 렌더링합니다.
     * [EN] Renders the sky background at infinite distance.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
     */
    renderBackground(renderViewStateData: RenderViewStateData) {
        this.#backgroundRenderer.render(
            renderViewStateData,
            this.#transmittanceGenerator.lutTexture,
            this.#multiScatteringGenerator.lutTexture,
            this.skyViewLUT,
            this.#sampler
        );
    }

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
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        this.update(view);
        return this.#postEffect.render(view, width, height, sourceTextureInfo);
    }

    /**
     * [KO] 태양 광원 방향, 카메라 고도 및 뷰 행렬 변화를 감지하여 대기 유니폼 버퍼와 LUT들을 갱신합니다.
     * [EN] Detects changes in sun light direction, camera altitude, and view matrix to update the atmospheric uniform buffer and LUTs.
     *
     * @param view -
     * [KO] 기준 View3D 인스턴스
     * [EN] Reference View3D instance
     */
    update(view: View3D) {
        const currentFrame = view.renderViewStateData.frameIndex;
        if (this.#lastUpdateFrame === currentFrame) return;
        this.#lastUpdateFrame = currentFrame;

        if (this.#params.cloudTimeMultiplier !== 0) {
            const newCloudTime = view.renderViewStateData.time * 0.001 * this.#params.cloudTimeMultiplier;
            if (Math.abs(this.#params.cloudTime - newCloudTime) > 0.0001) {
                this.#params.cloudTime = newCloudTime;
                this.#dirtyUniformBuffer = true;
            }
        }

        this.#updateSunInfo(view);
        this.#updateLUTs(view);
    }

    /**
     * [KO] SkyAtmosphere 인스턴스와 내부 생성기, 버퍼 및 리소스를 모두 해제합니다.
     * [EN] Releases the SkyAtmosphere instance along with all internal generators, buffers, and resources.
     */
    destroy() {
        if (this.#sharedUniformBuffer) {
            this.#sharedUniformBuffer.destroy();
        }
        if (this.#transmittanceGenerator) {
            this.#transmittanceGenerator.destroy();
        }
        if (this.#multiScatteringGenerator) {
            this.#multiScatteringGenerator.destroy();
        }
        if (this.#skyViewGenerator) {
            this.#skyViewGenerator.destroy();
        }
        if (this.#aerialPerspectiveGenerator) {
            this.#aerialPerspectiveGenerator.destroy();
        }
        if (this.#skyLight) {
            this.#skyLight.destroy();
        }
        if (this.#backgroundRenderer) {
            this.#backgroundRenderer.destroy();
        }
        if (this.#postEffect) {
            this.#postEffect.destroy();
        }

        this.#sharedUniformBuffer = null;
        this.#sampler = null;
        this.#transmittanceGenerator = null;
        this.#multiScatteringGenerator = null;
        this.#skyViewGenerator = null;
        this.#aerialPerspectiveGenerator = null;
        this.#skyLight = null;
        this.#backgroundRenderer = null;
        this.#postEffect = null;
        this.#activeSunSource = null;
        this.#prevSunSource = null;
    }

    #markDirty(lut: boolean, skyView: boolean, ibl: boolean): void {
        this.#dirtyUniformBuffer = true;
        if (lut) this.#dirtyLUT = true;
        if (skyView) {
            this.#dirtySkyView = true;
            this.#dirtyAerialPerspective = true;
        }
        if (ibl) this.#skyLight.dirty = true;
    }

    #updateSunInfo(view: View3D): void {
        const lights = view.scene.lightManager.directionalLights;
        const source = lights[0] || null;
        const sourceChanged = this.#prevSunSource !== source;
        if (sourceChanged) {
            this.#prevSunSource = source;
            this.#activeSunSource = source;
        }

        if (source) {
            const dir = source.direction;
            const currentDir = this.#params.sunDirection;
            const EPSILON = 0.0001;
            const dirLen = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1] + dir[2] * dir[2]);
            const normalizedDirX = dirLen > EPSILON ? dir[0] / dirLen : dir[0];
            const normalizedDirY = dirLen > EPSILON ? dir[1] / dirLen : dir[1];
            const normalizedDirZ = dirLen > EPSILON ? dir[2] / dirLen : dir[2];

            const targetDirX = -normalizedDirX;
            const targetDirY = -normalizedDirY;
            const targetDirZ = -normalizedDirZ;

            const directionChanged =
                Math.abs(targetDirX - currentDir[0]) > EPSILON ||
                Math.abs(targetDirY - currentDir[1]) > EPSILON ||
                Math.abs(targetDirZ - currentDir[2]) > EPSILON;

            if (sourceChanged || directionChanged) {
                currentDir[0] = targetDirX;
                currentDir[1] = targetDirY;
                currentDir[2] = targetDirZ;
                this.#markDirty(false, true, true);
            }

            const currentSunIntensity = source.lux * source.intensityMultiplier;
            if (Math.abs(this.#params.sunIntensity - currentSunIntensity) > EPSILON) {
                this.#params.sunIntensity = currentSunIntensity;
                this.#markDirty(false, false, true);
            }
        }
    }

    #updateLUTs(view: View3D) {
        const {rawCamera} = view;
        const cameraPos = [rawCamera.x, rawCamera.y, rawCamera.z];
        const currentHeightKm = Math.max(0.001, (cameraPos[1] / 1000.0));

        if (Math.abs(this.#params.cameraHeight - currentHeightKm) > 0.0001) {
            this.#params.cameraHeight = currentHeightKm;
            this.#dirtyUniformBuffer = true;
            this.#dirtySkyView = true;
            this.#dirtyAerialPerspective = true;
        }

        const camMatrix = rawCamera.viewMatrix;
        let camMoved = false;
        for (let i = 0; i < 16; i++) {
            if (Math.abs(camMatrix[i] - this.#prevCameraMatrix[i]) > 0.0001) {
                camMoved = true;
                break;
            }
        }

        if (camMoved) {
            mat4.copy(this.#prevCameraMatrix, camMatrix);
            this.#dirtyAerialPerspective = true;
        }

        if (this.#dirtyUniformBuffer) {
            this.#updateSharedUniformBuffer();
            this.#dirtyUniformBuffer = false;
        }

        if (this.#dirtyLUT) {
            this.#transmittanceGenerator.render();
            this.#multiScatteringGenerator.render(this.#transmittanceGenerator.lutTexture);
            this.#dirtyLUT = false;
            this.#dirtySkyView = true;
            this.#dirtyAerialPerspective = true;
            this.#skyLight.dirty = true;
        }

        if (this.#dirtySkyView) {
            this.#skyViewGenerator.render(this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture);
            this.#dirtySkyView = false;
        }

        if (this.#dirtyAerialPerspective) {
            this.#aerialPerspectiveGenerator.render(view, this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture);
            this.#dirtyAerialPerspective = false;
        }

        this.#skyLight.update(this);
    }

    #setParam(key: string, value: any, lut: boolean, skyView: boolean, ibl: boolean, validator?: (v: any) => void): void {
        if (validator) validator(value);
        (this.#params as any)[key] = value;
        this.#markDirty(lut, skyView, ibl);
    }

    #initCachedUniformMembers(): void {
        const {members} = this.#UNIFORM_STRUCT;
        this.#cachedUniformMembers = [];
        for (const [key, member] of Object.entries(members)) {
            const targetMember = member as any;
            const isArray = targetMember.arrayLength !== undefined || targetMember.isVector;
            this.#cachedUniformMembers.push({
                key,
                offset: targetMember.uniformOffset / 4,
                isFloat: targetMember.View === Float32Array,
                isArray
            });
        }
    }

    #updateSharedUniformBuffer(): void {
        const dataViewF32 = this.#sharedUniformBuffer.dataViewF32;
        const dataViewU32 = this.#sharedUniformBuffer.dataViewU32;
        const members = this.#cachedUniformMembers;
        const params = this.#params as any;
        const len = members.length;

        for (let i = 0; i < len; i++) {
            const item = members[i];
            const value = params[item.key];
            if (value !== undefined) {
                const offset = item.offset;
                if (typeof value === 'number') {
                    if (item.isFloat) dataViewF32[offset] = value;
                    else dataViewU32[offset] = value;
                } else if (value instanceof Float32Array || Array.isArray(value)) {
                    const vLen = value.length;
                    for (let j = 0; j < vLen; j++) dataViewF32[offset + j] = value[j];
                }
            }
        }
        this.redGPUContext.gpuDevice.queue.writeBuffer(this.#sharedUniformBuffer.gpuBuffer, 0, this.#sharedUniformBuffer.data);
    }
}

Object.freeze(SkyAtmosphere);
export default SkyAtmosphere;