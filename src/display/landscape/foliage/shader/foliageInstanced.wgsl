#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowCoord;

struct VertexInput {
    @location(0) position : vec3<f32>,
    @location(1) normal : vec3<f32>,
    @location(2) uv : vec2<f32>,
    
    // Instanced Attributes
    @location(3) instancePos : vec3<f32>,
    @location(4) instanceRotQuat : vec4<f32>,
    @location(5) instanceScale : vec3<f32>,
    @location(6) instanceExtra : vec2<f32>, // x: FadeFactor (1.0~0.0), y: SubID
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
    
    // 1. 메시 3D 크기는 100% 온전히 유지 (언리얼 스타일 Dither Fade 적용으로 쪼그라듦 제거)
    let localPos = input.position;
    let scaledLocalPos = localPos * input.instanceScale;
    
    // 2. Quaternion 회전 연산
    let rotatedPos = rotateVectorByQuaternion(scaledLocalPos, input.instanceRotQuat);
    
    // 3. World Position 생성 (지형 표면 Y 위치에 안착)
    let worldPos = rotatedPos + input.instancePos;
    let worldNormal = rotateVectorByQuaternion(input.normal, input.instanceRotQuat);
    
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

    output.globalFragmentSlotIndex = 0u;
    output.localNodeScale_volumeScale = vec2<f32>(1.0, 1.0);
    
    // ★ 언리얼 스타일 Dithered Opacity Fade: 거리에 따른 투명도 페이드 인자(1.0~0.0) 전달
    output.combinedOpacity = fadeFactor;

    // 6. RedGPU Directional Shadow 연산
    output.shadowCoord = getShadowCoord(worldPos, systemUniforms.directionalLightProjectionViewMatrix);
    output.receiveShadow = 1.0;

    output.motionVector = vec3<f32>(0.0);
    output.pickingId = vec4<f32>(0.0);
    
    return output;
}
