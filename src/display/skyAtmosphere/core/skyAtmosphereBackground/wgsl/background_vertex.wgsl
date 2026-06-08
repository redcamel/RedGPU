#redgpu_include SYSTEM_UNIFORM;

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec4<f32>,
};

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output : VertexOutput;
    
    // Full-screen triangle 생성
    // 0: (-1, -1), 1: (3, -1), 2: (-1, 3)
    let x = f32((i32(vertexIndex) << 1u) & 2i) * 2.0 - 1.0;
    let y = f32(i32(vertexIndex) & 2i) * 2.0 - 1.0;
    
    // NDC 좌표 (x, y, 1.0, 1.0) -> z=1.0으로 설정하여 원거리 평면에 위치시킴
    let ndcPos = vec4<f32>(x, y, 1.0, 1.0);
    output.position = ndcPos.xyww; // xyww 트릭으로 항상 원거리 평면에 배치

    let u_camera = systemUniforms.camera;
    let invProj = systemUniforms.projection.inverseProjectionMatrix;
    
    // View 회전 행렬 (이동 제외)
    var viewRotation = u_camera.viewMatrix;
    viewRotation[3] = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    
    // 회전 행렬의 역행렬은 전치 행렬과 같음
    let invViewRotation = transpose(viewRotation);

    // NDC -> View Space -> World Space 방향 복원
    var viewDir = invProj * ndcPos;
    viewDir = vec4<f32>(viewDir.xyz / viewDir.w, 0.0);
    let worldDir = invViewRotation * viewDir;

    output.vertexPosition = vec4<f32>(worldDir.xyz, 1.0);
    return output;
}
