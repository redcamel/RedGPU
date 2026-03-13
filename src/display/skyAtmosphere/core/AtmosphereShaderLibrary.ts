import skyAtmosphereFn_wgsl from "./skyAtmosphereFn.wgsl";

/**
 * [KO] SkyAtmosphere 모듈 내부에서 공유되는 셰이더 코드 라이브러리입니다.
 * [EN] Shader code library shared within the SkyAtmosphere module.
 */
const AtmosphereShaderLibrary: Record<string, string> = {
    'skyAtmosphere.skyAtmosphereFn': skyAtmosphereFn_wgsl
};

export default AtmosphereShaderLibrary;
