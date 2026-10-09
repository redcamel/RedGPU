#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowClipPosition;
#redgpu_include landscape.struct.GrassInstance;
#redgpu_include landscape.struct.GrassParams;
#redgpu_include landscape.math.transformGrassPosition;

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
    let camPos = systemUniforms.camera.cameraPosition.xyz;
    let instPos = vec3<f32>(instance.posX, instance.posY, instance.posZ);
    let delta = instPos - camPos;
    let distSq = dot(delta, delta);

    let shadowCullDist = grassUniforms.shadowCullDistance;
    let shadowCullDistSq = shadowCullDist * shadowCullDist;

    // 🌿 제곱거리 조기 탈락 (sqrt 0클록 기각)
    if (distSq >= shadowCullDistSq) {
        output.clipPos = vec4<f32>(2.0, 2.0, 2.0, 1.0);
        output.uv = vec2<f32>(0.0, 0.0);
        output.alphaFade = 0.0;
        return output;
    }

    var scaleXZ = instance.scaleXZ;
    var scaleY = instance.scaleY;
    var alphaFade: f32 = 1.0;

    let shadowFadeStart = min(grassUniforms.shadowFadeStartDistance, shadowCullDist);
    let shadowFadeStartSq = shadowFadeStart * shadowFadeStart;
    if (distSq > shadowFadeStartSq) {
        let distToCam = sqrt(distSq);
        let shadowFadeRange = max(0.001, shadowCullDist - shadowFadeStart);
        let fadeRatio = clamp((shadowCullDist - distToCam) / shadowFadeRange, 0.0, 1.0);
        scaleXZ *= fadeRatio;
        scaleY *= fadeRatio;
        alphaFade = smoothstep(0.0, 1.0, fadeRatio);
    }

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
