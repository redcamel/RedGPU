#redgpu_include SYSTEM_UNIFORM;
#redgpu_include landscape.struct.GrassInstance;
#redgpu_include landscape.struct.GrassParams;
#redgpu_include landscape.math.rotateVectorByQuat;

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
@group(1) @binding(1) var<uniform> grassUniforms: GrassParams;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;

    let instance = culledInstances[input.instanceIndex];
    var scaleXZ = instance.scaleXZ;
    var scaleY = instance.scaleY;

    let camPos = systemUniforms.camera.cameraPosition.xyz;
    let instPos = vec3<f32>(instance.posX, instance.posY, instance.posZ);
    let distToCam = distance(instPos, camPos);

    let cullDist = grassUniforms.cullingDistance;
    let fadeStart = min(grassUniforms.fadeStartDistance, cullDist);
    var shrink = 1.0;
    var alphaFade = 1.0;

    if (distToCam > fadeStart) {
        let fadeRatio = clamp((cullDist - distToCam) / max(0.001, cullDist - fadeStart), 0.0, 1.0);
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

    output.groundColor = unpack4x8unorm(instance.packedGroundColorAndType);

    return output;
}
