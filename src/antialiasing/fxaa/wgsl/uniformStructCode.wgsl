// FXAA uniform buffer layout (16-byte aligned)
struct Uniforms {
    subpix: f32,
    edgeThreshold: f32,
    edgeThresholdMin: f32,
    pad0: f32 // 16-byte tail alignment
};

#redgpu_include color.getLuminance

// Step distances (in texels) for 10-iteration edge endpoint search (FXAA Quality Preset 29)
const FXAA_QUALITY_STEPS = array<f32, 10>(1.0, 1.5, 2.0, 2.0, 2.0, 2.0, 2.0, 4.0, 8.0, 8.0);

// Clamped integer texel fetch for 3x3 neighborhood luminance evaluation
fn fetchColor4(pos: vec2<i32>, dims: vec2<u32>) -> vec4<f32> {
    let p = clamp(pos, vec2<i32>(0), vec2<i32>(dims) - vec2<i32>(1));
    return textureLoad(sourceTexture, p, 0);
}
