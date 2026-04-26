import skyAtmosphereFn_wgsl from "./skyAtmosphereFn.wgsl";

const AtmosphereShaderLibrary: Record<string, string> = {
    'skyAtmosphere.skyAtmosphereFn': skyAtmosphereFn_wgsl
};

export default AtmosphereShaderLibrary;