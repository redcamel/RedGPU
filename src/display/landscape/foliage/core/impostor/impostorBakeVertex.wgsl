struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) color: vec4<f32>,
    @location(2) worldNormal: vec3<f32>,
    @location(3) @interpolate(flat) useTexture: u32,
};

struct TransformInput {
    @location(4) mvp0: vec4<f32>,
    @location(5) mvp1: vec4<f32>,
    @location(6) mvp2: vec4<f32>,
    @location(7) mvp3: vec4<f32>,
    @location(8) color: vec4<f32>,
    @location(9) extra: vec4<f32>,
    @location(10) nMat0: vec4<f32>,
    @location(11) nMat1: vec4<f32>,
    @location(12) nMat2: vec4<f32>,
};

@vertex
fn main(
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) vertexColor: vec4<f32>,
    trans: TransformInput
) -> VertexOutput {
    var out: VertexOutput;
    let mvp = mat4x4<f32>(trans.mvp0, trans.mvp1, trans.mvp2, trans.mvp3);
    let nMat = mat3x3<f32>(trans.nMat0.xyz, trans.nMat1.xyz, trans.nMat2.xyz);
    out.position = mvp * vec4<f32>(position, 1.0);
    out.uv = uv;
    out.worldNormal = normalize(nMat * normal);

    var finalColor = trans.color;
    out.color = finalColor;
    out.useTexture = u32(trans.extra.x + 0.5);
    return out;
}
