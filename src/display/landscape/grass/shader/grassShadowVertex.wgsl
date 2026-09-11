#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowClipPosition;

struct GrassInstance {
    posX: f32,
    posY: f32,
    posZ: f32,
    rotationY: f32,
    scaleXZ: f32,
    scaleY: f32,
    packedNormal: u32,
    packedGroundColor: u32,
};

struct GrassUniforms {
    cullingDistance: f32,
    shrinkStartDistance: f32,
    meshHeight: f32,
    minY: f32,
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
    let rotationY = instance.rotationY;
    var scaleXZ = instance.scaleXZ;
    var scaleY = instance.scaleY;

    let camPos = systemUniforms.camera.cameraPosition.xyz;
    let instPos = vec3<f32>(instance.posX, instance.posY, instance.posZ);
    let distToCam = distance(instPos, camPos);

    // 거리 기반 스케일 축소(Shrink-to-Zero) 및 알파 페이드아웃
    let shrinkStart = grassUniforms.shrinkStartDistance;
    let cullDist = grassUniforms.cullingDistance;
    var shrink = 1.0;
    var alphaFade = 1.0;

    if (distToCam > shrinkStart) {
        shrink = clamp((cullDist - distToCam) / max(1.0, cullDist - shrinkStart), 0.0, 1.0);
        scaleXZ = scaleXZ * shrink;
        scaleY = scaleY * shrink;
        alphaFade = smoothstep(0.0, 1.0, shrink);
    }

    // 인스턴스 Y축 임의 회전
    let cosR = cos(rotationY);
    let sinR = sin(rotationY);
    let localX = input.position.x * cosR - input.position.z * sinR;
    let localZ = input.position.x * sinR + input.position.z * cosR;

    // 밑동(minY) 기준 0.0 정렬 로컬 위치
    var localPos = vec3<f32>(
        localX * scaleXZ,
        (input.position.y - grassUniforms.minY) * scaleY,
        localZ * scaleXZ
    );

    // 지형 법선 경사면 정렬 (Rodrigues' Rotation Formula)
    let unpackedNorm = unpack2x16snorm(instance.packedNormal);
    let normX = unpackedNorm.x;
    let normZ = unpackedNorm.y;
    let normY = sqrt(max(0.0, 1.0 - normX * normX - normZ * normZ));
    let terrainN = vec3<f32>(normX, normY, normZ);

    let rotAxis = cross(vec3<f32>(0.0, 1.0, 0.0), terrainN);
    let axisLen = length(rotAxis);
    if (axisLen > 0.0001) {
        let axis = rotAxis / axisLen;
        let cosA = normY;
        let sinA = axisLen;
        let oneMinusCos = 1.0 - cosA;
        localPos = localPos * cosA + cross(axis, localPos) * sinA + axis * dot(axis, localPos) * oneMinusCos;
    }

    let worldPos = localPos + instPos;

    // 🌟 핵심: 라이트 시점의 클립 공간 좌표로 변환!
    output.clipPos = getShadowClipPosition(worldPos, systemUniforms.directionalLightProjectionViewMatrix);
    output.uv = input.uv;
    output.alphaFade = alphaFade;

    return output;
}
