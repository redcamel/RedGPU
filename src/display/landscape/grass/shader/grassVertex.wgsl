#redgpu_include SYSTEM_UNIFORM;

struct GrassInstance {
    posX: f32,
    posY: f32,
    posZ: f32,
    rotationY: f32,
    packedScale: u32,
    packedBounding: u32,
    packedQuat: u32,
    packedGroundColor: u32,
};

fn rotateVectorByQuat(v: vec3<f32>, q: vec4<f32>) -> vec3<f32> {
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

struct GrassUniforms {
    cullingDistance: f32,
    shrinkStartDistance: f32,
    meshHeight: f32,
    minY: f32,
    _unusedShadowCullDistance: f32,
    _unusedShadowShrinkStartDistance: f32,
    _pad0: f32,
    _pad1: f32,
};

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @builtin(instance_index) instanceIndex: u32,
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

@group(1) @binding(0) var<storage, read> culledInstances: array<GrassInstance>;
@group(1) @binding(1) var<uniform> grassUniforms: GrassUniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;

    let instance = culledInstances[input.instanceIndex];
    let scales = unpack2x16float(instance.packedScale);
    var scaleXZ = scales.x;
    var scaleY = scales.y;

    let camPos = systemUniforms.camera.cameraPosition.xyz;
    let instPos = vec3<f32>(instance.posX, instance.posY, instance.posZ);
    let distToCam = distance(instPos, camPos);

    let cullDist = grassUniforms.cullingDistance;
    let shrinkStart = min(grassUniforms.shrinkStartDistance, cullDist);
    var shrink = 1.0;
    var alphaFade = 1.0;

    if (distToCam > shrinkStart) {
        let fadeRatio = clamp((cullDist - distToCam) / max(0.001, cullDist - shrinkStart), 0.0, 1.0);
        shrink = fadeRatio;
        scaleXZ = scaleXZ * shrink;
        scaleY = scaleY * shrink;
        alphaFade = smoothstep(0.0, 1.0, fadeRatio);
    }

    let baseHeight = max(0.01, grassUniforms.meshHeight);
    let heightRatio = clamp((input.position.y - grassUniforms.minY) / baseHeight, 0.0, 1.0);

    let scaledPos = vec3<f32>(
        input.position.x * scaleXZ,
        (input.position.y - grassUniforms.minY) * scaleY,
        input.position.z * scaleXZ
    );

    let q = normalize(unpack4x8snorm(instance.packedQuat));
    var localPos = rotateVectorByQuat(scaledPos, q);
    var localNorm = rotateVectorByQuat(input.normal, q);

    let sinkDepth = max(0.0, -localPos.y);
    localPos.y += sinkDepth * (1.0 - heightRatio * 0.7);

    let worldPos = localPos + instPos;
    let worldNormal = normalize(localNorm);

    let relPos = worldPos - systemUniforms.camera.cameraPosition;
    let viewPos = (systemUniforms.camera.viewMatrix * vec4<f32>(relPos, 0.0)).xyz;

    output.clipPos = systemUniforms.projection.projectionMatrix * vec4<f32>(viewPos, 1.0);
    output.worldPos = worldPos;
    output.uv = input.uv;
    output.normal = worldNormal;
    output.heightRatio = heightRatio;
    output.alphaFade = alphaFade;
    output.currentClipPos = systemUniforms.projection.noneJitterProjectionMatrix * vec4<f32>(viewPos, 1.0);
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * vec4<f32>(worldPos, 1.0);

    output.groundColor = unpack4x8unorm(instance.packedGroundColor);

    return output;
}
