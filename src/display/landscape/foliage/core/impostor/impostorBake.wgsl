struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) worldPosition: vec3<f32>,
};

struct Uniforms {
    lightDirection: vec3<f32>,
    pad0: f32,
    resolution: vec2<f32>,
    pad1: vec2<f32>,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(1) @binding(0) var diffuseTexture: texture_2d<f32>;
@group(1) @binding(1) var diffuseSampler: sampler;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let diffuseColor = textureSample(diffuseTexture, diffuseSampler, input.uv);

    if (diffuseColor.a < 0.33) {
        discard;
    }

    return diffuseColor;
}
