#redgpu_include SYSTEM_UNIFORM;

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
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

    let invProj = systemUniforms.projection.inverseProjectionMatrix;
    let invView = systemUniforms.camera.inverseViewMatrix;

    // NDC -> View Space -> World Space 방향 복원 (w=0.0으로 이동 성분 자동 소거)
    let viewDir = invProj * ndcPos;
    let worldDir = invView * vec4<f32>(viewDir.xyz / viewDir.w, 0.0);

    output.vertexPosition = worldDir.xyz;
    return output;
}
