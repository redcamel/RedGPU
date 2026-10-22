#redgpu_include landscape.struct.ImpostorBakeVertexOutput;

struct TransformInput {
    @location(6) mvp0: vec4<f32>,
    @location(7) mvp1: vec4<f32>,
    @location(8) mvp2: vec4<f32>,
    @location(9) mvp3: vec4<f32>,
    @location(10) baseColorFactor: vec4<f32>,
    @location(11) materialParams: vec4<f32>,
    @location(12) textureFlags: vec4<f32>,
    @location(13) sphereCenterRadius: vec4<f32>,
    @location(14) cameraDir: vec4<f32>,
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

    out.position = mvp * vec4<f32>(position, 1.0);
    out.uv = uv;
    out.vertexColor_0 = vertexColor_0;

    var n = normal;
    if (dot(n, n) < 1e-6) { n = vec3<f32>(0.0, 1.0, 0.0); }
    out.worldNormal = normalize(n);

    var t = tangent.xyz;
    if (dot(t, t) < 1e-6) {
        t = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(0.0, 1.0, 0.0), abs(n.x) > 0.9);
    }
    let worldT = normalize(t);
    let tanW = select(1.0, tangent.w, tangent.w != 0.0);
    out.worldTangent = vec4<f32>(worldT, tanW);

    out.worldPos = position;
    out.baseColorFactor = trans.baseColorFactor;
    out.materialParams = trans.materialParams;
    out.textureFlags = trans.textureFlags;
    out.sphereCenterRadius = trans.sphereCenterRadius;
    out.cameraDir = trans.cameraDir;
    return out;
}
