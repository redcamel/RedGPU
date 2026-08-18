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

    // 🌿 언리얼 엔진 5 MASK 모드 알파 컷오프
    if (diffuseColor.a < 0.33) {
        discard;
    }

    // 🌟 순수 알베도(Base Color) 베이킹: 런타임에서 실시간 씬 라이팅(PBR)과 100% 동일한 광도로 셰이딩
    return diffuseColor;
}
