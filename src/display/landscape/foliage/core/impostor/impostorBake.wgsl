struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) color: vec4<f32>,
    @location(2) worldNormal: vec3<f32>,
    @location(3) @interpolate(flat) useTexture: u32,
};

struct BakeFragmentOutput {
    @location(0) color: vec4<f32>,
    @location(1) normalProp: vec4<f32>,
};

@group(0) @binding(0) var diffuseTexture: texture_2d<f32>;
@group(0) @binding(1) var diffuseSampler: sampler;

@fragment
fn main(input: VertexOutput) -> BakeFragmentOutput {
    var out: BakeFragmentOutput;
    var finalColor = input.color;

    if (input.useTexture != 0u) {
        let texColor = textureSampleLevel(diffuseTexture, diffuseSampler, input.uv, 0.0);
        if (texColor.a < 0.33) {
            discard;
        }
        finalColor = texColor * input.color;
    } else {
        if (finalColor.a < 0.33) {
            discard;
        }
    }

    out.color = finalColor;
    let norm = normalize(input.worldNormal);
    out.normalProp = vec4<f32>(norm * 0.5 + 0.5, finalColor.a);
    return out;
}
