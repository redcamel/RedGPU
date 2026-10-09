#redgpu_include landscape.struct.GrassParams;

struct ShadowVertexOutput {
    @builtin(position) clipPos: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) alphaFade: f32,
};

@group(1) @binding(1) var<uniform> materialUniforms: GrassParams;

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
