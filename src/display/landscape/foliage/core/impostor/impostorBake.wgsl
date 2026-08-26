struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) color: vec4<f32>,
    @location(2) @interpolate(flat) useTexture: u32,
};

@group(0) @binding(0) var diffuseTexture: texture_2d<f32>;
@group(0) @binding(1) var diffuseSampler: sampler;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var finalColor = input.color;

    if (input.useTexture != 0u) {
        let texColor = textureSampleLevel(diffuseTexture, diffuseSampler, input.uv, 0.0);
        if (texColor.a < 0.3) {
            discard;
        }
        finalColor = texColor * input.color;
    } else {
        if (finalColor.a < 0.1) {
            discard;
        }
    }

    return finalColor;
}
