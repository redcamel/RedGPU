struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

@group(0) @binding(0) var diffuseTexture: texture_2d<f32>;
@group(0) @binding(1) var diffuseSampler: sampler;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let diffuseColor = textureSample(diffuseTexture, diffuseSampler, input.uv);

    if (diffuseColor.a < 0.01) {
        discard;
    }

    return diffuseColor;
}
