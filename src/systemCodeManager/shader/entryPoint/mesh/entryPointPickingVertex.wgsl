/**
 * [KO] 메쉬 피킹 버텍스 셰이더 엔트리 포인트입니다.
 * [EN] Vertex shader entry point for mesh picking.
 *
 * @param inputData [KO] 버텍스 입력 데이터 [EN] Vertex input data
 * @returns [KO] 버텍스 출력 데이터 [EN] Vertex output data
 */
@vertex
fn entryPointPickingVertex(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;
    let input_position = inputData.position;
    let globalVertexUniforms = globalVertexUniformBuffer[inputData.globalVertexBufferSlotIndex];
    let u_modelMatrix = globalVertexUniforms.matrixList.modelMatrix;
    let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
    let u_projectionViewMatrix = systemUniforms.projection.projectionViewMatrix;
    let u_camera = systemUniforms.camera;
    let u_viewMatrix = u_camera.viewMatrix;
    var position: vec4<f32> = u_modelMatrix * vec4<f32>(input_position, 1.0);
    output.position = u_projectionViewMatrix * position;
    output.pickingId = unpack4x8unorm(globalVertexUniforms.pickingId);
    return output;
}
