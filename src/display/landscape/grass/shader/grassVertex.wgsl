#redgpu_include SYSTEM_UNIFORM;

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

struct VertexOutput {
    @builtin(position) clipPos: vec4<f32>,
    @location(0) worldPos: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>,
    @location(3) heightRatio: f32,
    @location(4) alphaFade: f32,
    @location(5) currentClipPos: vec4<f32>,
    @location(6) prevClipPos: vec4<f32>,
    @location(7) groundColor: vec3<f32>,
};

@group(1) @binding(0) var<storage, read> culledInstances: array<GrassInstance>;
@group(1) @binding(1) var<uniform> grassUniforms: GrassUniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;

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

    // 높이 정규화 비율 (0.0: 밑동, 1.0: 풀 끝)
    let baseHeight = max(0.01, grassUniforms.meshHeight);
    let heightRatio = clamp((input.position.y - grassUniforms.minY) / baseHeight, 0.0, 1.0);

    // 인스턴스 Y축 임의 회전
    let cosR = cos(rotationY);
    let sinR = sin(rotationY);
    let localX = input.position.x * cosR - input.position.z * sinR;
    let localZ = input.position.x * sinR + input.position.z * cosR;

    let normRotX = input.normal.x * cosR - input.normal.z * sinR;
    let normRotZ = input.normal.x * sinR + input.normal.z * cosR;

    // 밑동(minY) 기준 0.0 정렬 로컬 위치 (공중부양 방지)
    var localPos = vec3<f32>(
        localX * scaleXZ,
        (input.position.y - grassUniforms.minY) * scaleY,
        localZ * scaleXZ
    );
    var localNorm = vec3<f32>(normRotX, input.normal.y, normRotZ);

    // 언리얼 표준 지형 법선 경사면 정렬 (Rodrigues' Rotation Formula - 순수 ALU)
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
        localNorm = localNorm * cosA + cross(axis, localNorm) * sinA + axis * dot(axis, localNorm) * oneMinusCos;
    }

    let worldPos = localPos + instPos;
    let worldNormal = normalize(localNorm);

    let worldPos4 = vec4<f32>(worldPos, 1.0);
    output.clipPos = systemUniforms.projection.projectionViewMatrix * worldPos4;
    output.worldPos = worldPos;
    output.uv = input.uv;
    output.normal = worldNormal;
    output.heightRatio = heightRatio;
    output.alphaFade = alphaFade;
    output.currentClipPos = systemUniforms.projection.noneJitterProjectionViewMatrix * worldPos4;
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * worldPos4;

    // Zero-VTF: 스폰 시 베이크된 8비트 지면 색상 순수 ALU 언패킹
    output.groundColor = unpack4x8unorm(instance.packedGroundColor).rgb;

    return output;
}
