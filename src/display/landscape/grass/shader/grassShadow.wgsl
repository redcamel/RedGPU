struct GrassMaterialUniforms {
    _unusedGroundBlendStrength: f32, // [Main pass only]
    alphaCutoff: f32,                // [Shadow active: Alpha testing cutoff]
    _unusedHasGroundTexture: u32,    // [Main pass only]
    _unusedExposureBoost: f32,       // [Main pass only]
    _unusedSubsurfaceColor: vec3<f32>,// [Main pass only]
    _unusedSubsurfaceStrength: f32,  // [Main pass only]
    _unusedRoughness: f32,           // [Main pass only]
    _unusedShadowStrength: f32,      // [Main pass only]
    _unusedReceiveShadow: u32,       // [Main pass only]
};

struct ShadowVertexOutput {
    @builtin(position) clipPos: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) alphaFade: f32,
};

@group(2) @binding(0) var baseColorTexture: texture_2d<f32>;
@group(2) @binding(1) var baseColorSampler: sampler;
@group(2) @binding(2) var<uniform> materialUniforms: GrassMaterialUniforms;

@fragment
fn main(input: ShadowVertexOutput) {
    let baseTex = textureSample(baseColorTexture, baseColorSampler, input.uv);

    let rgbMax = max(baseTex.r, max(baseTex.g, baseTex.b));
    var sourceAlpha = baseTex.a;
    if (sourceAlpha > 0.85 && rgbMax < 0.15) {
        sourceAlpha = clamp((rgbMax - 0.02) / 0.10, 0.0, 1.0);
    }
    sourceAlpha *= input.alphaFade;

    if (sourceAlpha < materialUniforms.alphaCutoff) {
        discard;
    }
}
