/**
 * FoliageInstancedShader
 * WGSL Instanced Shader for Foliage rendering with Quaternion Rotation & Distance Fade
 */
export const FOLIAGE_INSTANCED_WGSL = /* wgsl */ `
struct CameraUniform {
    viewProjectionMatrix : mat4x4<f32>,
    cameraPosition : vec3<f32>,
};

@group(0) @binding(0) var<uniform> camera : CameraUniform;

struct VertexInput {
    @location(0) position : vec3<f32>,
    @location(1) normal : vec3<f32>,
    @location(2) uv : vec2<f32>,
    
    // Instanced Attributes
    @location(3) instancePos : vec3<f32>,
    @location(4) instanceRotQuat : vec4<f32>,
    @location(5) instanceScale : vec3<f32>,
    @location(6) instanceExtra : vec2<f32>, // x: FadeFactor, y: SubID
};

struct VertexOutput {
    @builtin(position) clipPosition : vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) worldNormal : vec3<f32>,
    @location(2) fadeFactor : f32,
};

// 쿼터니언 회전 연산 함수 (Vector3 * Quaternion)
fn rotateVectorByQuaternion(v: vec3<f32>, q: vec4<f32>) -> vec3<f32> {
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

@vertex
fn mainInput(input : VertexInput) -> VertexOutput {
    var output : VertexOutput;
    
    // 1. FadeFactor에 의한 Y Scale 축소 (소멸 시 부드럽게 축소)
    let fade = input.instanceExtra.x;
    let scaledLocalPos = input.position * input.instanceScale * vec3<f32>(1.0, fade, 1.0);
    
    // 2. Quaternion 회전 연산
    let rotatedPos = rotateVectorByQuaternion(scaledLocalPos, input.instanceRotQuat);
    
    // 3. World Position 생성
    let worldPos = rotatedPos + input.instancePos;
    
    // 4. Clip Space 변환
    output.clipPosition = camera.viewProjectionMatrix * vec4<f32>(worldPos, 1.0);
    output.uv = input.uv;
    output.worldNormal = rotateVectorByQuaternion(input.normal, input.instanceRotQuat);
    output.fadeFactor = fade;
    
    return output;
}

@fragment
fn mainFragment(input : VertexOutput) -> @location(0) vec4<f32> {
    // 알파 컷오프 또는 기본 단순 색상 (임시 알파 테스트)
    if (input.fadeFactor <= 0.001) {
        discard;
    }
    
    let N = normalize(input.worldNormal);
    let L = normalize(vec3<f32>(0.5, 1.0, 0.3));
    let diffuse = max(dot(N, L), 0.3);
    
    // 기본 디버그 렌더링 색상 (식생 녹색 톤)
    let baseColor = vec3<f32>(0.22, 0.58, 0.25) * diffuse;
    
    return vec4<f32>(baseColor, 1.0);
}
`;
