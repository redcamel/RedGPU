/**
 * [KO] SkyAtmosphere 및 대기 산란 셰이더에서 공용으로 사용하는 WGSL 함수 라이브러리입니다.
 * [EN] Shared WGSL function library used in SkyAtmosphere and atmospheric scattering shaders.
 *
 * @category SkyAtmosphere
 */
declare const SkyAtmosphereShaderLibrary: Readonly<{
    /**
     * [KO] 대기 산란, 투과율(Transmittance) 조회, 구름 노이즈 및 IBL 평가 WGSL 함수 코드입니다.
     * [EN] WGSL function code for atmospheric scattering, transmittance lookup, cloud noise, and IBL evaluation.
     */
    skyAtmosphereFn: string;
}>;
export default SkyAtmosphereShaderLibrary;
