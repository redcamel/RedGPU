struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) vertexColor_0: vec4<f32>,
    @location(2) worldNormal: vec3<f32>,
    @location(3) worldTangent: vec4<f32>,
    @location(4) worldPos: vec3<f32>,
    @location(5) @interpolate(flat) baseColorFactor: vec4<f32>,
    @location(6) @interpolate(flat) materialParams: vec4<f32>,
    @location(7) @interpolate(flat) textureFlags: vec4<f32>,
    @location(8) @interpolate(flat) sphereCenterRadius: vec4<f32>,
    @location(9) @interpolate(flat) cameraDir: vec4<f32>,
};

struct TransformInput {
    @location(6) mvp0: vec4<f32>,
    @location(7) mvp1: vec4<f32>,
    @location(8) mvp2: vec4<f32>,
    @location(9) mvp3: vec4<f32>,
    @location(10) baseColorFactor: vec4<f32>,
    @location(11) materialParams: vec4<f32>,
    @location(12) textureFlags: vec4<f32>,
    @location(13) nMat0: vec4<f32>,
    @location(14) nMat1: vec4<f32>,
    @location(15) nMat2: vec4<f32>,
    @location(16) sphereCenterRadius: vec4<f32>,
    @location(17) cameraDir: vec4<f32>,
};

@vertex
fn main(
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) tangent: vec4<f32>,
    trans: TransformInput
) -> VertexOutput {
    var out: VertexOutput;
    let mvp = mat4x4<f32>(trans.mvp0, trans.mvp1, trans.mvp2, trans.mvp3);
    let nMat = mat3x3<f32>(trans.nMat0.xyz, trans.nMat1.xyz, trans.nMat2.xyz);
    let translation = vec3<f32>(trans.nMat0.w, trans.nMat1.w, trans.nMat2.w);

    out.position = mvp * vec4<f32>(position, 1.0);
    out.uv = uv;
    out.vertexColor_0 = vertexColor_0;

    var n = normal;
    if (length(n) < 0.001) { n = vec3<f32>(0.0, 1.0, 0.0); }
    out.worldNormal = normalize(nMat * n);

    var t = tangent.xyz;
    if (length(t) < 0.001) {
        t = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(0.0, 1.0, 0.0), abs(n.x) > 0.9);
    }
    let worldT = normalize(nMat * t);
    let tanW = select(1.0, tangent.w, tangent.w != 0.0);
    out.worldTangent = vec4<f32>(worldT, tanW);

    out.worldPos = nMat * position + translation;
    out.baseColorFactor = trans.baseColorFactor;
    out.materialParams = trans.materialParams;
    out.textureFlags = trans.textureFlags;
    out.sphereCenterRadius = trans.sphereCenterRadius;
    out.cameraDir = trans.cameraDir;
    return out;
}

