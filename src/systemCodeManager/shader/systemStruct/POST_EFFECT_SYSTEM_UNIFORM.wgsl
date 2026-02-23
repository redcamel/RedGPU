#redgpu_include systemStruct.Camera
#redgpu_include systemStruct.Projection
struct SystemUniform {
    projection: Projection,
    camera:Camera,
};

@group(1) @binding(1) var<uniform> systemUniforms: SystemUniform;
