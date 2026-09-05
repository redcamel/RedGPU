@group(2) @binding(1) var baseColorTextureSampler: sampler;
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(2) uv: vec2<f32>,
};


@fragment
fn shadowMain(inputData: InputData) {
    let texColor = textureSampleLevel(baseColorTexture, baseColorTextureSampler, inputData.uv, 0.0);

    if (texColor.a <= 0.25) {
        discard;
    }
}
