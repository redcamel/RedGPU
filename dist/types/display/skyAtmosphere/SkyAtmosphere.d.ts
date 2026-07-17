import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import Sampler from "../../resources/sampler/Sampler";
import DirectCubeTexture from "../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../resources/texture/DirectTexture";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import SkyLight from "./core/skyLight/SkyLight";
import SkyAtmospherePostEffect from "./core/skyAtmospherePostEffect/SkyAtmospherePostEffect";
import { IPostEffectResult } from "../../postEffect/core/types";
import RedGPUObject from "../../base/RedGPUObject";
/**
 * [KO] SkyAtmosphere 클래스는 물리 기반 대기 산란(Atmospheric Scattering) 시뮬레이션 시스템입니다.
 * [EN] The SkyAtmosphere class is a physics-based atmospheric scattering simulation system.
 *
 * [KO] 레일리 산란(Rayleigh Scattering), 미 산란(Mie Scattering), 오존 흡수(Ozone Absorption) 등을 시뮬레이션하여 사실적인 하늘과 노을, Aerial Perspective 효과를 생성합니다.
 * [EN] Simulates Rayleigh scattering, Mie scattering, and Ozone absorption to create realistic sky, sunset, and aerial perspective effects.
 *
 * [KO] 이 시스템은 전산량이 많은 물리 연산을 실시간으로 처리하기 위해 여러 단계의 LUT(Look Up Table) 생성 패스를 거칩니다.
 * [EN] This system utilizes multiple LUT (Look Up Table) generation passes to process computationally intensive physical calculations in real-time.
 *
 * @category Display
 */
declare class SkyAtmosphere extends RedGPUObject {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /** [KO] Post Effect 인스턴스 반환 [EN] Returns Post Effect instance */
    get postEffect(): SkyAtmospherePostEffect;
    get params(): {
        /** [KO] 레일리 산란 계수 [EN] Rayleigh scattering coefficient */
        rayleighScattering: number[];
        /** [KO] 레일리 분포 고도 (km) [EN] Rayleigh exponential distribution altitude (km) */
        rayleighExponentialDistribution: number;
        /** [KO] 미 산란 계수 [EN] Mie scattering coefficient */
        mieScattering: number[];
        /** [KO] 미 비등방성 계수 [EN] Mie anisotropy coefficient (G-factor) */
        mieAnisotropy: number;
        /** [KO] 미 흡수 계수 [EN] Mie absorption coefficient */
        mieAbsorption: number[];
        /** [KO] 미 분포 고도 (km) [EN] Mie exponential distribution altitude (km) */
        mieExponentialDistribution: number;
        /** [KO] 오존 흡수 계수 [EN] Ozone absorption coefficient */
        absorptionCoefficient: number[];
        /** [KO] 오존 최대 밀도 고도 (km) [EN] Ozone peak density altitude (km) */
        absorptionTipAltitude: number;
        /** [KO] 지표면 반사율 [EN] Ground albedo */
        groundAlbedo: number[];
        /** [KO] 오존 분포 두께 [EN] Ozone distribution width */
        absorptionTentWidth: number;
        /** [KO] 하늘 전체 휘도 배수 [EN] Overall sky luminance factor */
        skyLuminanceFactor: number[];
        /** [KO] 다중 산란 보정 계수 [EN] Multi-scattering correction factor */
        multiScatteringFactor: number;
        /** [KO] 태양 방향 벡터 [EN] Sun direction vector */
        sunDirection: Float32Array<ArrayBuffer>;
        /** [KO] 투과율 계산 최소 고도각 [EN] Minimum light elevation angle for transmittance */
        transmittanceMinLightElevationAngle: number;
        /** [KO] 행성 반경 (km) [EN] Planet ground radius (km) */
        groundRadius: number;
        /** [KO] 대기권 높이 (km) [EN] Atmosphere height (km) */
        atmosphereHeight: number;
        /** [KO] Aerial Perspective 거리 스케일 [EN] Aerial Perspective distance scale */
        aerialPerspectiveDistanceScale: number;
        /** [KO] Aerial Perspective 시작 깊이 [EN] Aerial Perspective start depth */
        aerialPerspectiveStartDepth: number;
        /** [KO] 태양 광도 [EN] Sun intensity (lux) */
        sunIntensity: number;
        /** [KO] 태양 시각적 크기 [EN] Visual size of the sun */
        sunSize: number;
        /** [KO] 태양 주변 감쇠 강도 [EN] Sun limb darkening intensity */
        sunLimbDarkening: number;
        /** [KO] 카메라 현재 고도 (km) [EN] Current camera height (km) */
        cameraHeight: number;
        /** [KO] 구름 시간 축 정보 [EN] Cloud animation time */
        cloudTime: number;
        /** [KO] 구름 속도 배수 [EN] Cloud time multiplier */
        cloudTimeMultiplier: number;
        /** [KO] 구름 커버리지 (0 ~ 1) [EN] Cloud coverage (0 to 1) */
        cloudCoverage: number;
        /** [KO] 구름 밀도 (0 ~ 1) [EN] Cloud density (0 to 1) */
        cloudDensity: number;
        /** [KO] 구름 고도 (km) [EN] Cloud height (km) */
        cloudHeight: number;
    };
    get cloudTimeMultiplier(): number;
    set cloudTimeMultiplier(v: number);
    get cloudCoverage(): number;
    set cloudCoverage(v: number);
    get cloudDensity(): number;
    set cloudDensity(v: number);
    get cloudHeight(): number;
    set cloudHeight(v: number);
    get aerialPerspectiveDistanceScale(): number;
    set aerialPerspectiveDistanceScale(v: number);
    get aerialPerspectiveStartDepth(): number;
    set aerialPerspectiveStartDepth(v: number);
    get transmittanceMinLightElevationAngle(): number;
    set transmittanceMinLightElevationAngle(v: number);
    get groundRadius(): number;
    set groundRadius(v: number);
    get atmosphereHeight(): number;
    set atmosphereHeight(v: number);
    get mieScattering(): [number, number, number];
    set mieScattering(v: [number, number, number]);
    get mieAbsorption(): [number, number, number];
    set mieAbsorption(v: [number, number, number]);
    get rayleighScattering(): [number, number, number];
    set rayleighScattering(v: [number, number, number]);
    get rayleighExponentialDistribution(): number;
    set rayleighExponentialDistribution(v: number);
    get mieExponentialDistribution(): number;
    set mieExponentialDistribution(v: number);
    get mieAnisotropy(): number;
    set mieAnisotropy(v: number);
    get groundAlbedo(): [number, number, number];
    set groundAlbedo(v: [number, number, number]);
    get absorptionCoefficient(): [number, number, number];
    set absorptionCoefficient(v: [number, number, number]);
    get absorptionTipAltitude(): number;
    set absorptionTipAltitude(v: number);
    get absorptionTentWidth(): number;
    set absorptionTentWidth(v: number);
    get multiScatteringFactor(): number;
    set multiScatteringFactor(v: number);
    get sunSize(): number;
    set sunSize(v: number);
    get sunLimbDarkening(): number;
    set sunLimbDarkening(v: number);
    get skyLuminanceFactor(): [number, number, number];
    set skyLuminanceFactor(v: [number, number, number]);
    get transmittanceLUT(): DirectTexture;
    get multiScatLUT(): DirectTexture;
    get skyViewLUT(): DirectTexture;
    get aerialPerspectiveLUT(): DirectCubeTexture;
    get skyAtmosphereIrradianceLUT(): DirectCubeTexture;
    get skyAtmosphereReflectionLUT(): DirectCubeTexture;
    get skyLight(): SkyLight;
    get atmosphereSampler(): Sampler;
    /**
     * [KO] 배경 렌더링을 수행합니다. (무한 거리 배경 처리 전용)
     * [EN] Performs background rendering. (Dedicated to infinite distance background processing)
     */
    renderBackground(renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] 포스트 이펙트 렌더링을 수행합니다. (오브젝트 영역 대기 투과 처리 전용)
     * [EN] Performs post-effect rendering. (Dedicated to atmospheric transmittance on object regions)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
    update(view: View3D): void;
    destroy(): void;
}
export default SkyAtmosphere;
