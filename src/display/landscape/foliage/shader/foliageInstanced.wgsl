#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowCoord;

struct SubMeshUniforms {
    relativeModelMatrix: mat4x4<f32>,
    relativeNormalMatrix: mat4x4<f32>,
    globalFragmentSlotIndex: u32,
    pad0: u32,
    pad1: u32,
    pad2: u32,
};

@group(1) @binding(0) var<uniform> subMeshUniforms: SubMeshUniforms;

struct VertexInput {
    @location(0) position : vec3<f32>,
    @location(1) normal : vec3<f32>,
    @location(2) uv : vec2<f32>,
    
    // Instanced Attributes
    @location(3) instancePos : vec3<f32>,
    @location(4) instanceRotQuat : vec4<f32>,
    @location(5) instanceScale : vec3<f32>,
    @location(6) instanceExtra : vec2<f32>, // x: FadeFactor (1.0~0.0), y: SubID / LodFade
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
    
    // 1. 하이라키 누적 상대 행렬 변환 (부모 컨테이너 오프셋/회전/스케일 완벽 반영)
    let hierarchyPos = (subMeshUniforms.relativeModelMatrix * vec4<f32>(input.position, 1.0)).xyz;
    let hierarchyNormal = (subMeshUniforms.relativeNormalMatrix * vec4<f32>(input.normal, 0.0)).xyz;
    
    // 2. 인스턴스 스케일 및 쿼터니언 회전 연산
    let scaledPos = hierarchyPos * input.instanceScale;
    let rotatedPos = rotateVectorByQuaternion(scaledPos, input.instanceRotQuat);
    let worldNormal = rotateVectorByQuaternion(hierarchyNormal, input.instanceRotQuat);
    
    // 3. World Position 생성 (지형 표면 Y 위치에 안착)
    let worldPos = rotatedPos + input.instancePos;
    
    // 4. RedGPU 표준 ProjectionViewMatrix 클립 변환
    let clipPos = systemUniforms.projection.projectionViewMatrix * vec4<f32>(worldPos, 1.0);
    
    output.position = clipPos;
    output.vertexPosition = worldPos;
    output.vertexNormal = worldNormal;
    output.uv = input.uv;
    output.uv1 = input.uv;
    output.vertexColor_0 = vec4<f32>(1.0);
    output.vertexTangent = vec4<f32>(1.0, 0.0, 0.0, 1.0);

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
