#redgpu_include SYSTEM_UNIFORM;
struct InputData {
    @builtin(instance_index) globalVertexBufferSlotIndex: u32,
    @location(0) position : vec3<f32>,
    @location(1) vertexNormal : vec3<f32>,
    @location(2) uv : vec2<f32>,
};
struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) vertexPosition: vec4<f32>,
  @location(10) @interpolate(flat) globalFragmentBufferSlotIndex: u32,
};
@vertex
fn main(inputData:InputData) -> VertexOutput {
    var output : VertexOutput;
    let globalVertexUniforms = globalVertexUniformBuffer[inputData.globalVertexBufferSlotIndex];
    let u_camera = systemUniforms.camera;
    let u_viewMatrix = u_camera.viewMatrix;
    let u_projectionMatrix = systemUniforms.projection.projectionMatrix;

    // Translation을 제거한 View Matrix (Remove translation from View Matrix)
    var viewRotation = u_viewMatrix;
    viewRotation[3] = vec4<f32>(0.0, 0.0, 0.0, 1.0);

    // NDC Z를 1.0 직전으로 고정하여 Far Clipping 방지 (Fix NDC Z slightly below 1.0 to avoid Far Clipping)
    let clipPos = u_projectionMatrix * viewRotation * globalVertexUniforms.matrixList.modelMatrix * vec4<f32>(inputData.position, 1.0);
    output.position = vec4<f32>(clipPos.xy, clipPos.w * 0.99999, clipPos.w);
    output.vertexPosition = vec4<f32>(inputData.position, 1.0);
    output.globalFragmentBufferSlotIndex = globalVertexUniforms.globalFragmentBufferSlotIndex;
    return output;
}

