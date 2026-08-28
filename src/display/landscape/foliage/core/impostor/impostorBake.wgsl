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

struct BakeFragmentOutput {
    @location(0) baseColor: vec4<f32>,
    @location(1) normalDepth: vec4<f32>,
    @location(2) ormSubsurface: vec4<f32>,
};

@group(0) @binding(0) var diffuseTexture: texture_2d<f32>;
@group(0) @binding(1) var diffuseSampler: sampler;
@group(0) @binding(2) var normalTexture: texture_2d<f32>;
@group(0) @binding(3) var normalSampler: sampler;
@group(0) @binding(4) var ormTexture: texture_2d<f32>;
@group(0) @binding(5) var ormSampler: sampler;

@fragment
fn main(
    input: VertexOutput,
    @builtin(front_facing) isFrontFacing: bool
) -> BakeFragmentOutput {
    var out: BakeFragmentOutput;

    // 1. BaseColor & Opacity calculation (Exact pbrMaterial reference)
    let u_useVertexColor = (input.textureFlags.w > 0.5);
    var baseColor = input.baseColorFactor;
    baseColor *= select(vec4<f32>(1.0), input.vertexColor_0, u_useVertexColor);

    var finalColor = baseColor;
    if (input.textureFlags.x > 0.5) {
        let diffuseSampleColor = textureSampleLevel(diffuseTexture, diffuseSampler, input.uv, 0.0);
        finalColor *= diffuseSampleColor;
    }

    // 🌿 베이크 단계에서 glTF/UE5 표준 컷오프로 텍스처 배경(흰색/검은색) 오염을 100% 원천 차단
    let bakeCutOff = select(0.3333, input.materialParams.w, input.materialParams.w > 0.0);
    if (finalColor.a < bakeCutOff) {
        discard;
    }



    // 2. 3D World Normal (with Normal map support & double-sided preservation)
    let isFoliage = (input.cameraDir.w > 0.5);
    var N = normalize(input.worldNormal);
    if (input.textureFlags.y > 0.5) {
        let T = normalize(input.worldTangent.xyz);
        let B = normalize(cross(N, T) * input.worldTangent.w);
        let tbn = mat3x3<f32>(T, B, N);
        let normalMapSample = textureSampleLevel(normalTexture, normalSampler, input.uv, 0.0).rgb;
        let rawN = vec3<f32>(normalMapSample.r * 2.0 - 1.0, (1.0 - normalMapSample.g) * 2.0 - 1.0, normalMapSample.b * 2.0 - 1.0);
        N = normalize(tbn * rawN);
    }
    if (!isFrontFacing && !isFoliage) {
        N = -N;
    }
    let encodedNormal = N * 0.5 + 0.5;

    // 3. Radial Depth Offset (Normalized 0..1 along camera view ray from sphere center)
    let center = input.sphereCenterRadius.xyz;
    let radius = max(input.sphereCenterRadius.w, 0.1);
    let camDir = normalize(input.cameraDir.xyz);
    let relPos = input.worldPos - center;
    let distAlongRay = dot(relPos, camDir);
    let normDepth = clamp(distAlongRay / (radius * 1.05) * 0.5 + 0.5, 0.0, 1.0);


    // 4. Physical Material Properties (ORM + Subsurface Translucency)
    var ao = input.materialParams.z;
    var roughness = input.materialParams.x;
    var metallic = input.materialParams.y;
    var subsurface = select(0.2, 1.0, isFoliage);

    if (input.textureFlags.z > 0.5) {
        let ormSample = textureSampleLevel(ormTexture, ormSampler, input.uv, 0.0);
        ao = ao * ormSample.r;
        roughness = roughness * ormSample.g;
        metallic = metallic * ormSample.b;
    }
    roughness = clamp(roughness, 0.04, 1.0);

    out.baseColor = vec4<f32>(finalColor.rgb, finalColor.a);
    out.normalDepth = vec4<f32>(encodedNormal, normDepth);
    out.ormSubsurface = vec4<f32>(ao, roughness, metallic, subsurface);
    return out;
}


