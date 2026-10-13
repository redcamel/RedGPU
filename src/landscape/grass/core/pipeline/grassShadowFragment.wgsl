struct GrassRenderParams {
    cullingDistance: f32,
    fadeStartDistance: f32,
    meshHeight: f32,
    minY: f32,

    shadowCullDistance: f32,
    farAlphaCutoff: f32,
    invMeshHeight: f32,
    invFadeRange: f32,

    groundBlendStrength: f32,
    alphaCutoff: f32,
    hasGroundTexture: u32,
    exposureBoost: f32,

    subsurfaceColor: vec3<f32>,
    subsurfaceStrength: f32,

    roughness: f32,
    shadowStrength: f32,
    receiveShadow: u32,
    shadowCullDistanceSq: f32,

    shadowFadeStartSq: f32,
    invShadowFadeRange: f32,
    pad0: u32,
    pad1: u32,
};

struct ShadowVertexOutput {
    @builtin(position) clipPos: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) alphaFade: f32,
};

@group(1) @binding(1) var<uniform> materialUniforms: GrassRenderParams;

@group(2) @binding(0) var baseColorTexture: texture_2d<f32>;
@group(2) @binding(1) var baseColorSampler: sampler;

@fragment
fn main(input: ShadowVertexOutput) {
    let baseTex = textureSample(baseColorTexture, baseColorSampler, input.uv);

    let sourceAlpha = baseTex.a * input.alphaFade;

    if (sourceAlpha < materialUniforms.alphaCutoff) {
        discard;
    }
}

