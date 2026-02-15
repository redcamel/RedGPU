#redgpu_include depth.linearizeDepth

struct Uniforms {
    fogType: u32,
    density: f32,
    nearDistance: f32,
    farDistance: f32,
    fogColor: vec3<f32>,
    padding1: f32,
};
