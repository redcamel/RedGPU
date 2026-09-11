/**
 * 🌿 RedGPU Landscape Grass Shadow Map Depth-Only Fragment Shader
 * - 잎사귀 실루엣을 위한 초경량 알파 컷아웃 전용 (Color Output 0, Pure Depth Write)
 */

struct GrassMaterialUniforms {
    groundBlendStrength: f32,
    alphaCutoff: f32,
    hasGroundTexture: u32,
    exposureBoost: f32,
    subsurfaceColor: vec3<f32>,
    subsurfaceDistortion: f32,
    subsurfaceStrength: f32,
    roughness: f32,
    shadowStrength: f32,
    receiveShadow: u32,
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
