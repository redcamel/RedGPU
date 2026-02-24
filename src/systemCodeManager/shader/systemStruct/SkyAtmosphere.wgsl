struct SkyAtmosphere {
    useSkyAtmosphere: u32,
    skyAtmosphereSunIntensity: f32,
    skyAtmosphereExposure: f32,
    padding: f32, // [KO] 16바이트 정렬을 위한 패딩 [EN] Padding for 16-byte alignment
    skyAtmosphereSunDirection: vec3<f32>,
    padding2: f32
};