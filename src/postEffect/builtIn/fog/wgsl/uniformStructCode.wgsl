#redgpu_include math.reconstruct.getWorldPositionFromDepth

struct Uniforms {
    fogType: u32,
    density: f32,
    nearDistance: f32,
    farDistance: f32,
    fogColor: vec3<f32>,
    maxOpacity: f32,
};
