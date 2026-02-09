@vertex
fn picking(inputData: InputData) -> OutputData {
    var output: OutputData;
    let u_resolution = systemUniforms.resolution;
    
    #redgpu_if disableJitter
        let u_projectionMatrix = systemUniforms.noneJitterProjectionMatrix;
    #redgpu_else
        let u_projectionMatrix = systemUniforms.projectionMatrix;
    #redgpu_endIf
    
    let u_cameraMatrix = systemUniforms.camera.cameraMatrix;
    let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;
    let u_useBillboard = vertexUniforms.useBillboard;
    let u_usePixelSize = vertexUniforms.usePixelSize;
    let u_pixelSize = vertexUniforms.pixelSize;
    let u_renderRatioX = vertexUniforms._renderRatioX;
    let u_renderRatioY = vertexUniforms._renderRatioY;

    var ratioScaleMatrix: mat4x4<f32> = mat4x4<f32>(
        u_renderRatioX, 0, 0, 0,
        0, u_renderRatioY, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );

    if (u_useBillboard == 1) {
        let billboardMatrix = getBillboardMatrix(u_cameraMatrix, u_modelMatrix);
        
        if (u_usePixelSize == 1) {
            let viewPositionCenter = billboardMatrix * vec4<f32>(0.0, 0.0, 0.0, 1.0);
            let clipCenter = u_projectionMatrix * viewPositionCenter;
            let scaleX = (u_pixelSize / u_resolution.x) * 2.0 * u_renderRatioX;
            let scaleY = (u_pixelSize / u_resolution.y) * 2.0 * u_renderRatioY;

            output.position = vec4<f32>(
                clipCenter.xy + inputData.position.xy * vec2<f32>(scaleX, scaleY) * clipCenter.w,
                clipCenter.zw
            );
        } else {
            output.position = u_projectionMatrix * billboardMatrix * ratioScaleMatrix * vec4<f32>(inputData.position, 1.0);
        }
    } else {
        output.position = u_projectionMatrix * u_cameraMatrix * u_modelMatrix * ratioScaleMatrix * vec4<f32>(inputData.position, 1.0);
    }

    output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);
    return output;
}