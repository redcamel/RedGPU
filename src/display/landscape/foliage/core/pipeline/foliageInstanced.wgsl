#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowCoord;

struct SubMeshUniforms {
    relativeModelMatrix: mat4x4<f32>,
    relativeNormalMatrix: mat4x4<f32>,
    globalFragmentSlotIndex: u32,
    hasHierarchyTransform: u32, // ★ 0: 항등 행렬(스킵!), 1: 계층 행렬 연산 실행
    pad1: u32,
    pad2: u32,
};

@group(1) @binding(0) var<uniform> subMeshUniforms: SubMeshUniforms;

struct VertexInput {
    @location(0) position : vec3<f32>,
    @location(1) vertexNormal : vec3<f32>,
    @location(2) uv : vec2<f32>,
    @location(3) uv1 : vec2<f32>,
    @location(4) vertexColor_0 : vec4<f32>,
    @location(5) vertexTangent : vec4<f32>,
    
    // Instanced Attributes
    @location(6) instancePos : vec3<f32>,
    @location(7) instanceRotQuat : vec4<f32>,
    @location(8) instanceScale : vec3<f32>,
    @location(9) instanceExtra : vec2<f32>, // x: FadeFactor (1.0~0.0), y: SubID / LodFade
};

struct OutputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(10) localNodeScale_volumeScale: vec2<f32>,
    @location(11) combinedOpacity: f32, // 언리얼 스타일 Dither FadeOpacity 전달

    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

// 쿼터니언 회전 연산 함수 (Vector3 * Quaternion)
fn rotateVectorByQuaternion(v: vec3<f32>, q: vec4<f32>) -> vec3<f32> {
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

@vertex
fn mainInput(input : VertexInput) -> OutputData {
    var output : OutputData;
    
    let fadeFactor = input.instanceExtra.x;
    let lodFadeFactor = input.instanceExtra.y;
    
    // 1. 하이라키 누적 상대 행렬 변환 (병합 메시 및 빌보드는 4x4 행렬 곱셈 2회 100% 스킵!)
    var hierarchyPos = input.position;
    var hierarchyNormal = input.vertexNormal;
    var hierarchyTangent = input.vertexTangent.xyz;
    if (subMeshUniforms.hasHierarchyTransform != 0u) {
        hierarchyPos = (subMeshUniforms.relativeModelMatrix * vec4<f32>(input.position, 1.0)).xyz;
        hierarchyNormal = (subMeshUniforms.relativeNormalMatrix * vec4<f32>(input.vertexNormal, 0.0)).xyz;
        hierarchyTangent = (subMeshUniforms.relativeNormalMatrix * vec4<f32>(input.vertexTangent.xyz, 0.0)).xyz;
    }
    
    // 2. 인스턴스 스케일 및 쿼터니언 회전 연산
    let safeScale = max(input.instanceScale, vec3<f32>(0.0001));
    let scaledPos = hierarchyPos * safeScale;
    let rotatedPos = rotateVectorByQuaternion(scaledPos, input.instanceRotQuat);
    
    // 🌟 비등방 스케일 역전치(Inverse Transpose) 노멀 보정 및 쿼터니언 회전 정규화
    let scaledNormal = hierarchyNormal / safeScale;
    let worldNormal = normalize(rotateVectorByQuaternion(scaledNormal, input.instanceRotQuat));
    
    // 🌟 원본 버텍스 탄젠트 쿼터니언 회전 및 정규화 (PBR TBN 프레임 100% 일치)
    var inTan = hierarchyTangent;
    if (length(inTan) < 0.001) {
        var rawT = vec3<f32>(1.0, 0.0, 0.0);
        if (abs(hierarchyNormal.x) > 0.9) { rawT = vec3<f32>(0.0, 1.0, 0.0); }
        inTan = normalize(cross(hierarchyNormal, rawT));
    }
    let worldTangent = normalize(rotateVectorByQuaternion(inTan, input.instanceRotQuat));
    let tanW = select(1.0, input.vertexTangent.w, input.vertexTangent.w != 0.0);
    output.vertexTangent = vec4<f32>(worldTangent, tanW);
    
    // 3. World Position 생성 (지형 표면 Y 위치에 안착)
    let worldPos = rotatedPos + input.instancePos;
    
    // 4. RedGPU 표준 ProjectionViewMatrix 클립 변환
    let clipPos = systemUniforms.projection.projectionViewMatrix * vec4<f32>(worldPos, 1.0);
    
    output.position = clipPos;
    output.vertexPosition = worldPos;
    output.vertexNormal = worldNormal;
    output.uv = input.uv;
    output.uv1 = input.uv1;
    output.vertexColor_0 = input.vertexColor_0;


    // 5. RedGPU TAA Motion Vector 보간 좌표
    output.currentClipPos = systemUniforms.projection.noneJitterProjectionViewMatrix * vec4<f32>(worldPos, 1.0);
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * vec4<f32>(worldPos, 1.0);

    // ★ 각 서브메시의 PBRMaterial 글로벌 유니폼 슬롯 인덱스 연결 (cutOff, opacity, baseColorFactor, roughness 등 완벽 복원)
    output.globalFragmentSlotIndex = subMeshUniforms.globalFragmentSlotIndex;
    output.localNodeScale_volumeScale = vec2<f32>(1.0, 1.0);
    
    // ★ 언리얼 스타일 Dithered Opacity Fade: 원거리 페이드(fadeFactor) x LOD 크로스페이드(lodFadeFactor)
    output.combinedOpacity = fadeFactor * lodFadeFactor;

    // 6. RedGPU Directional Shadow 연산
    output.shadowCoord = getShadowCoord(worldPos, systemUniforms.directionalLightProjectionViewMatrix);
    output.receiveShadow = 1.0;

    output.motionVector = vec3<f32>(0.0);
    output.pickingId = vec4<f32>(0.0);
    
    return output;
}
