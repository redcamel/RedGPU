#redgpu_include SYSTEM_UNIFORM;
#redgpu_include landscape.rotateVectorByQuat;
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

struct VertexOutput {
    @builtin(position) clipPos: vec4<f32>,
    @location(0) worldPos: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>,
    @location(3) heightRatio: f32,
    @location(4) alphaFade: f32,
    @location(5) currentClipPos: vec4<f32>,
    @location(6) prevClipPos: vec4<f32>,
    @location(7) groundColor: vec4<f32>,
};


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

const SSS_DISTORTION: f32 = 0.35;
const NORM_225: f32 = 0.44444445;

fn filterGrassAlpha(baseTex: vec4<f32>, alphaFade: f32) -> f32 {
    let rgbMax = max(baseTex.r, max(baseTex.g, baseTex.b));
    var sourceAlpha = baseTex.a;
    if (sourceAlpha > 0.85 && rgbMax < 0.15) {
        sourceAlpha = saturate((rgbMax - 0.02) * 10.0);
    }
    return sourceAlpha * alphaFade;
}

fn blendGrassGroundColor(
    baseColor: vec3<f32>,
    exposureBoost: f32,
    hasGroundTexture: u32,
    groundBlendStrength: f32,
    heightRatio: f32,
    groundColor: vec3<f32>
) -> vec3<f32> {
    let boost = max(0.1, exposureBoost);
    var albedo = baseColor * boost;
    if (hasGroundTexture != 0u && groundBlendStrength > 0.01) {
        let blendFactor = saturate((0.40 - heightRatio) * 2.5) * groundBlendStrength;
        albedo = mix(albedo, groundColor, blendFactor);
    }
    return albedo;
}

fn computeGrassUpwardNormal(vertexNormal: vec3<f32>, heightRatio: f32) -> vec3<f32> {
    let upVec = vec3<f32>(0.0, 1.0, 0.0);
    let upwardBlend = mix(0.55, 0.85, heightRatio);
    return normalize(mix(vertexNormal, upVec, upwardBlend));
}

fn computeGrassSkyOcclusion(heightRatio: f32) -> f32 {
    return mix(0.65, 1.0, saturate(heightRatio * 1.43));
}

fn computeGrassContactAO(heightRatio: f32) -> f32 {
    return mix(0.40, 1.0, saturate(heightRatio * 4.0));
}

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @builtin(instance_index) instanceIndex: u32,
};

@group(1) @binding(0) var<storage, read> culledInstances: array<GrassInstance>;
@group(1) @binding(1) var<uniform> grassUniforms: GrassRenderParams;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;

    let instance = culledInstances[input.instanceIndex];
    let instPos = vec3<f32>(instance.posX, instance.posY, instance.posZ);

    let fadeData = unpack4x8unorm(instance.packedBounding);
    let fadeRatio = fadeData.x;
    let alphaFade = fadeData.y;

    let scaleXZ = instance.scaleXZ * fadeRatio;
    let scaleY = instance.scaleY * fadeRatio;

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
    let worldNormal = rotateVectorByQuat(input.normal, q);

    let relPos = xform.worldPos - systemUniforms.camera.cameraPosition;
    let viewPos = (systemUniforms.camera.viewMatrix * vec4<f32>(relPos, 0.0)).xyz;

    output.clipPos = systemUniforms.projection.projectionMatrix * vec4<f32>(viewPos, 1.0);
    output.worldPos = xform.worldPos;
    output.uv = input.uv;
    output.normal = computeGrassUpwardNormal(worldNormal, xform.heightRatio);
    output.heightRatio = xform.heightRatio;
    output.alphaFade = alphaFade;
    output.currentClipPos = systemUniforms.projection.noneJitterProjectionMatrix * vec4<f32>(viewPos, 1.0);
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * vec4<f32>(xform.worldPos, 1.0);

    output.groundColor = unpack4x8unorm(instance.packedGroundColorAndType);

    return output;
}
