@vertex
fn picking(inputData: InputData) -> OutputData {
    var output: OutputData;
    let input_position = inputData.position;
    let u_modelMatrix = vertexUniforms.modelMatrix;
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    var position: vec4<f32> = u_modelMatrix * vec4<f32>(input_position, 1.0);
    output.position = u_projectionMatrix * u_cameraMatrix * position;
    output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);
    return output;
}
