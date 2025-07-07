struct Camera {
    cameraMatrix:mat4x4<f32>,
    cameraPosition:vec3<f32>,
    nearClipping:f32,
    farClipping:f32
};
struct SystemUniform {
    camera:Camera,
};

@group(1) @binding(1) var<uniform> systemUniforms: SystemUniform;
