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

    // 🌿 제곱거리 조기 탈락 (사전 계산된 shadowCullDistanceSq로 1클록 기각)
    if (distSq >= grassUniforms.shadowCullDistanceSq) {
        output.clipPos = vec4<f32>(2.0, 2.0, 2.0, 1.0);
        output.uv = vec2<f32>(0.0, 0.0);
        output.alphaFade = 0.0;
        return output;
    }

    var scaleXZ = instance.scaleXZ;
    var scaleY = instance.scaleY;
    var alphaFade: f32 = 1.0;

    // 🌿 사전 계산된 shadowFadeStartSq 및 invShadowFadeRange로 나눗셈 완전 소거 및 고속 곱셈 치환
    if (distSq > grassUniforms.shadowFadeStartSq) {
        let distToCam = sqrt(distSq);
        let fadeRatio = clamp((grassUniforms.shadowCullDistance - distToCam) * grassUniforms.invShadowFadeRange, 0.0, 1.0);
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
