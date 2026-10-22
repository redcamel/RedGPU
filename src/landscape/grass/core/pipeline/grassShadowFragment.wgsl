#redgpu_include landscape.struct.GrassRenderParams;
#redgpu_include landscape.struct.GrassShadowVertexOutput;

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
