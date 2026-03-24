#redgpu_include systemStruct.Camera
#redgpu_include systemStruct.Projection
#redgpu_include systemStruct.Time
#redgpu_include systemStruct.SkyAtmosphere
// [KO] 포스트 이펙트 시스템 유니폼 [EN] Post effect system uniform
struct SystemUniform {
    projection: Projection,
    time: Time,
    camera:Camera,
    useSkyAtmosphere: u32,
    preExposure: f32,
    skyAtmosphere:SkyAtmosphere,
};

@group(1) @binding(1) var<uniform> systemUniforms: SystemUniform;
