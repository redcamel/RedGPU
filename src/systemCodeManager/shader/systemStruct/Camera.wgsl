struct Camera {
    viewMatrix: mat4x4<f32>,
    inverseViewMatrix: mat4x4<f32>,
    cameraPosition: vec3<f32>,
    nearClipping: f32,
    farClipping: f32,
    fieldOfView: f32,
    ev100: f32,
    exposure: f32,
    aperture: f32,
    shutterSpeed: f32,
    iso: f32,
    _pad: f32
};