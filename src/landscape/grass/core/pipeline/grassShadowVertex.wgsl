#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowClipPosition;
struct GrassInstance {
    posX: f32,
    posY: f32,
    posZ: f32,
    scaleY: f32,
    scaleXZ: f32,
    packedBounding: u32,
    packedQuat: u32,
    packedGroundColorAndType: u32,
};

struct GrassRenderParams {
    cullingDistance: f32,
    fadeStartDistance: f32,
    meshHeight: f32,
    minY: f32,

    shadowCullDistance: f32,
    farAlphaCutoff: f32,
    invMeshHeight: f32,
    invFadeRange: f32,

    groundBlendStrength: f32,
    alphaCutoff: f32,
    hasGroundTexture: u32,
    exposureBoost: f32,

    subsurfaceColor: vec3<f32>,
    subsurfaceStrength: f32,

    roughness: f32,
    shadowStrength: f32,
    receiveShadow: u32,
    shadowCullDistanceSq: f32,

    shadowFadeStartSq: f32,
    invShadowFadeRange: f32,
    pad0: u32,
    pad1: u32,
};

fn rotateVectorByQuat(v: vec3<f32>, q: vec4<f32>) -> vec3<f32> {
    let t = 2.0 * cross(q.xyz, v);
    return v + q.w * t + cross(q.xyz, t);
}

struct GrassPositionResult {
    worldPos: vec3<f32>,
    heightRatio: f32,
};

fn transformGrassPosition(
    position: vec3<f32>,
    instPos: vec3<f32>,
    scaleXZ: f32,
    scaleY: f32,
    q: vec4<f32>,
    minY: f32,
    invMeshHeight: f32
) -> GrassPositionResult {
    let heightRatio = saturate((position.y - minY) * invMeshHeight);

    let scaledPos = vec3<f32>(
        position.x * scaleXZ,
        (position.y - minY) * scaleY,
        position.z * scaleXZ
    );

    var localPos = rotateVectorByQuat(scaledPos, q);

    let sinkDepth = max(0.0, -localPos.y);
    localPos.y += sinkDepth * (1.0 - heightRatio * 0.7);

    var res: GrassPositionResult;
    res.worldPos = localPos + instPos;
    res.heightRatio = heightRatio;
    return res;
}

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @builtin(instance_index) instanceIndex: u32,
};

struct ShadowVertexOutput {
    @builtin(position) clipPos: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) alphaFade: f32,
};

@group(1) @binding(0) var<storage, read> culledInstances: array<GrassInstance>;
@group(1) @binding(1) var<uniform> grassUniforms: GrassRenderParams;

@vertex
fn main(input: VertexInput) -> ShadowVertexOutput {
    var output: ShadowVertexOutput;

    let instance = culledInstances[input.instanceIndex];

    let fadeData = unpack4x8unorm(instance.packedBounding);
    let shadowFadeRatio = fadeData.z;

    if (shadowFadeRatio <= 0.0) {
        output.clipPos = vec4<f32>(2.0, 2.0, 2.0, 1.0);
        output.uv = vec2<f32>(0.0, 0.0);
        output.alphaFade = 0.0;
        return output;
    }

    let instPos = vec3<f32>(instance.posX, instance.posY, instance.posZ);
    let scaleXZ = instance.scaleXZ * shadowFadeRatio;
    let scaleY = instance.scaleY * shadowFadeRatio;
    let alphaFade = fadeData.w;

    let q = normalize(unpack4x8snorm(instance.packedQuat));

    let xform = transformGrassPosition(
        input.position,
        instPos,
        scaleXZ,
        scaleY,
        q,
        grassUniforms.minY,
        grassUniforms.invMeshHeight
    );

    output.clipPos = getShadowClipPosition(xform.worldPos, systemUniforms.directionalLightProjectionViewMatrix);
    output.uv = input.uv;
    output.alphaFade = alphaFade;

    return output;
}
