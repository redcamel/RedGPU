#redgpu_include systemStruct.Camera
struct SystemUniform {
    projectionMatrix:mat4x4<f32>,
    inverseProjectionMatrix:mat4x4<f32>,
    projectionViewMatrix:mat4x4<f32>,
    inverseProjectionViewMatrix:mat4x4<f32>,
    camera:Camera,
};

@group(1) @binding(1) var<uniform> systemUniforms: SystemUniform;
