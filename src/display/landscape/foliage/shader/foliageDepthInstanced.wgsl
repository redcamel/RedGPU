#redgpu_include SYSTEM_UNIFORM;

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

struct DepthOutputData {
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
    @location(11) combinedOpacity: f32, // 언리얼 스타일 Dither FadeOpacity

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
fn mainInput(input : VertexInput) -> DepthOutputData {
    var output : DepthOutputData;
    
    let fadeFactor = input.instanceExtra.x;
    let lodFadeFactor = input.instanceExtra.y;
    
    // 1. 하이라키 누적 상대 모델 행렬 변환 (위치만 계산, 노멀 행렬 곱셈 100% 생략!)
    let hierarchyPos = (subMeshUniforms.relativeModelMatrix * vec4<f32>(input.position, 1.0)).xyz;
    
    // 2. 인스턴스 스케일 및 쿼터니언 위치 회전 연산 (노멀 쿼터니언 회전 100% 생략!)
    let scaledPos = hierarchyPos * input.instanceScale;
    let rotatedPos = rotateVectorByQuaternion(scaledPos, input.instanceRotQuat);
    
    // 3. World Position 생성
    let worldPos = rotatedPos + input.instancePos;
    
    // 4. RedGPU 표준 ProjectionViewMatrix 클립 변환 (Depth Buffer 기록용)
    output.position = systemUniforms.projection.projectionViewMatrix * vec4<f32>(worldPos, 1.0);
    
    // 5. 나뭇잎 알파 컷오프용 UV 및 슬롯 인덱스, LOD Dither 페이드만 신속 전달!
    // (그림자 연산, TAA 모션 벡터 연산, 노멀/탄젠트 연산 완전 제거로 극대화된 속도 달성)
    output.uv = input.uv;
    output.globalFragmentSlotIndex = subMeshUniforms.globalFragmentSlotIndex;
    output.combinedOpacity = fadeFactor * lodFadeFactor;
    
    return output;
}
