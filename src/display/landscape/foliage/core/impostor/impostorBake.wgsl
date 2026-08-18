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

    let N = normalize(input.normal);
    let L = normalize(-uniforms.lightDirection);

    // 🌟 UE5 Subsurface Two-Sided 반투명 투과 라이팅
    let ndotl = max(dot(N, L), 0.0);
    let backLight = max(dot(-N, L), 0.0) * 0.35; // 잎사귀 역광 투과
    let ambient = 0.45;
    let lighting = clamp(ndotl + backLight + ambient, 0.0, 1.0);

    return vec4<f32>(diffuseColor.rgb * lighting, diffuseColor.a);
}
