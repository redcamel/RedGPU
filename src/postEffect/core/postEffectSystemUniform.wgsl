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

fn linearDepth(depthSample : f32) -> f32 {
    let n = systemUniforms.camera.nearClipping;
    let f = systemUniforms.camera.farClipping;
    let d = clamp(depthSample, 0.0, 1.0);
    return (n * f) / max(1e-6, f - d * (f - n));
}
