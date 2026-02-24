#redgpu_include systemStruct.Camera
#redgpu_include systemStruct.Projection
#redgpu_include systemStruct.Time
struct SystemUniform {
    projection: Projection,
    time: Time,
    camera:Camera,
};

@group(1) @binding(1) var<uniform> systemUniforms: SystemUniform;
