#redgpu_include systemStruct.Camera
#redgpu_include systemStruct.Projection
#redgpu_include systemStruct.Time
#redgpu_include systemStruct.SkyAtmosphere
struct SystemUniform {
    projection: Projection,
    time: Time,
    camera:Camera,
    useSkyAtmosphere: u32,
    skyAtmosphere:SkyAtmosphere,
};

@group(1) @binding(1) var<uniform> systemUniforms: SystemUniform;
