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
    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];
    let u_modelMatrix = globalVertexData.matrixList.modelMatrix;
    let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
    let u_projectionViewMatrix = systemUniforms.projection.projectionViewMatrix;
    let u_camera = systemUniforms.camera;
    let u_viewMatrix = u_camera.viewMatrix;
    let position = u_modelMatrix * vec4<f32>(input_position, 1.0);
    let relPos = position.xyz - u_camera.cameraPosition;
    let viewPos = (u_viewMatrix * vec4<f32>(relPos, 0.0)).xyz;
    output.position = u_projectionMatrix * vec4<f32>(viewPos, 1.0);
    output.pickingId = unpack4x8unorm(globalVertexData.pickingId);
    return output;
}
