#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowClipPosition;

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
    _unusedCullingDistance: f32,     // [Main pass only]
    _unusedShrinkStartDistance: f32, // [Main pass only]
    meshHeight: f32,
    minY: f32,
    shadowCullDistance: f32,
    shadowShrinkStartDistance: f32,
    _pad0: f32,
    _pad1: f32,
};

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @builtin(instance_index) instanceIndex: u32,
};

struct ShadowVertexOutput {
    @builtin(position) clipPos: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) alphaFade: f32,
};

@group(1) @binding(0) var<storage, read> culledInstances: array<GrassInstance>;
@group(1) @binding(1) var<uniform> grassUniforms: GrassUniforms;

@vertex
fn main(input: VertexInput) -> ShadowVertexOutput {
    var output: ShadowVertexOutput;

    let instance = culledInstances[input.instanceIndex];
    let scales = unpack2x16float(instance.packedScale);
    var scaleXZ = scales.x;
    var scaleY = scales.y;

    let camPos = systemUniforms.camera.cameraPosition.xyz;
    let instPos = vec3<f32>(instance.posX, instance.posY, instance.posZ);
    let distToCam = distance(instPos, camPos);

    let shadowCullDist = grassUniforms.shadowCullDistance;
    let shadowShrinkStart = min(grassUniforms.shadowShrinkStartDistance, shadowCullDist);

    // 🌿 [Unreal Engine Shadow Cull] 잔디 그림자 한계 거리 초과 시 즉시 클립하여 래스터라이징 완전 차단
    if (distToCam >= shadowCullDist) {
        output.clipPos = vec4<f32>(2.0, 2.0, 2.0, 1.0);
        output.uv = vec2<f32>(0.0, 0.0);
        output.alphaFade = 0.0;
        return output;
    }

    var shrink = 1.0;
    var alphaFade = 1.0;

    // 🌿 [Unreal Engine Style] shadowShrinkStart ~ shadowCullDist 감쇄 구간에서 크기 축소와 알파 페이드 통합 연산
    if (distToCam > shadowShrinkStart) {
        let fadeRatio = clamp((shadowCullDist - distToCam) / max(0.001, shadowCullDist - shadowShrinkStart), 0.0, 1.0);
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

    // [KO] 경사면 회전으로 인한 밑동 지면 파묻힘 방지 보정
    // [EN] Compensate base ground penetration caused by slope rotation
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
