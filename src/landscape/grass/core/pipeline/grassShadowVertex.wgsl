#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowClipPosition;
#redgpu_include landscape.struct.GrassInstance;
#redgpu_include landscape.struct.GrassParams;
#redgpu_include landscape.math.rotateVectorByQuat;

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
@group(1) @binding(1) var<uniform> grassUniforms: GrassParams;

@vertex
fn main(input: VertexInput) -> ShadowVertexOutput {
    var output: ShadowVertexOutput;

    let instance = culledInstances[input.instanceIndex];
    var scaleXZ = instance.scaleXZ;
    var scaleY = instance.scaleY;

    let camPos = systemUniforms.camera.cameraPosition.xyz;
    let instPos = vec3<f32>(instance.posX, instance.posY, instance.posZ);
    let distToCam = distance(instPos, camPos);

    let shadowCullDist = grassUniforms.shadowCullDistance;
    let shadowFadeStart = min(grassUniforms.shadowFadeStartDistance, shadowCullDist);

    if (distToCam >= shadowCullDist) {
        output.clipPos = vec4<f32>(2.0, 2.0, 2.0, 1.0);
        output.uv = vec2<f32>(0.0, 0.0);
        output.alphaFade = 0.0;
        return output;
    }

    var shrink = 1.0;
    var alphaFade = 1.0;

    if (distToCam > shadowFadeStart) {
        let fadeRatio = clamp((shadowCullDist - distToCam) / max(0.001, shadowCullDist - shadowFadeStart), 0.0, 1.0);
        shrink = fadeRatio;
        scaleXZ = scaleXZ * shrink;
        scaleY = scaleY * shrink;
        alphaFade = smoothstep(0.0, 1.0, fadeRatio);
    }

    let scaledPos = vec3<f32>(
        input.position.x * scaleXZ,
        (input.position.y - grassUniforms.minY) * scaleY,
        input.position.z * scaleXZ
    );

    let q = normalize(unpack4x8snorm(instance.packedQuat));
    var localPos = rotateVectorByQuat(scaledPos, q);

    let baseHeight = max(0.01, grassUniforms.meshHeight);
    let heightRatio = clamp((input.position.y - grassUniforms.minY) / baseHeight, 0.0, 1.0);
    let sinkDepth = max(0.0, -localPos.y);
    localPos.y += sinkDepth * (1.0 - heightRatio * 0.7);

    let worldPos = localPos + instPos;

    output.clipPos = getShadowClipPosition(worldPos, systemUniforms.directionalLightProjectionViewMatrix);
    output.uv = input.uv;
    output.alphaFade = alphaFade;

    return output;
}
