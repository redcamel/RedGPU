struct Camera {
    cameraMatrix:mat4x4<f32>,
    inverseCameraMatrix:mat4x4<f32>,
    cameraPosition:vec3<f32>,
    nearClipping:f32,
    farClipping:f32,
    fieldOfView:f32
};
struct SystemUniform {
    projectionMatrix:mat4x4<f32>,
    inverseProjectionMatrix:mat4x4<f32>,
    projectionCameraMatrix:mat4x4<f32>,
    inverseProjectionCameraMatrix:mat4x4<f32>,
    camera:Camera,
};

@group(1) @binding(1) var<uniform> systemUniforms: SystemUniform;
