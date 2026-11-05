#redgpu_include math.reconstruct.getWorldPositionFromDepth

struct Uniforms {
    fogType: u32,
    density: f32,
    baseHeight: f32,
    falloff: f32,
    nearDistance: f32,
    farDistance: f32,
    maxOpacity: f32,
    pad0: f32,
    fogColor: vec3<f32>,
    pad1: f32,
};
