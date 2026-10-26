#redgpu_include SYSTEM_UNIFORM;

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
};

/**
 * [KO] 정점 인덱스만으로 원거리 평면(`z = w`)에 전체 화면 삼각형을 배치하고 월드 공간 시선 방향을 계산하는 정점 셰이더입니다.
 * [EN] Vertex shader that places a full-screen triangle on the far plane (`z = w`) using only the vertex index and computes the world-space view direction.
 */
@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output : VertexOutput;
    
    // [KO] 정점 인덱스(0, 1, 2)로부터 전체 화면 삼각형의 NDC 좌표를 산출합니다.
    // [EN] Derive NDC coordinates of the full-screen triangle from vertex indices (0, 1, 2).
    let x = f32((i32(vertexIndex) << 1u) & 2i) * 2.0 - 1.0;
    let y = f32(i32(vertexIndex) & 2i) * 2.0 - 1.0;
    
    let ndcPos = vec4<f32>(x, y, 1.0, 1.0);
    output.position = ndcPos.xyww;

    let invProj = systemUniforms.projection.inverseProjectionMatrix;
    let invView = systemUniforms.camera.inverseViewMatrix;

    // [KO] NDC 좌표를 역투영·역뷰 행렬로 변환하여 월드 공간 광선 방향을 복원합니다.
    // [EN] Transform NDC coordinates by inverse projection and view matrices to reconstruct the world-space ray direction.
    let viewDir = invProj * ndcPos;
    let worldDir = invView * vec4<f32>(viewDir.xyz / viewDir.w, 0.0);

    output.vertexPosition = worldDir.xyz;
    return output;
}
