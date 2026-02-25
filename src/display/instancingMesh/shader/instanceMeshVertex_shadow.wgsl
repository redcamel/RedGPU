
#redgpu_include shadow.getShadowClipPosition
#redgpu_include systemStruct.OutputShadowData;

@vertex
fn entryPointShadowVertex(inputData: InputData) -> OutputShadowData {
    var output: OutputShadowData;


    let input_instanceIdx: u32 = visibilityBuffer[inputData.instanceIdx];

    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
    let u_modelMatrix = instanceUniforms.instanceModelMatrixs[input_instanceIdx];
    let u_instanceGroupModelMatrix = instanceUniforms.instanceGroupModelMatrix;
    let u_useDisplacementTexture = instanceUniforms.useDisplacementTexture == 1u;
    let u_displacementScale = instanceUniforms.displacementScale;

    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    var position: vec4<f32> = u_modelMatrix * vec4<f32>(input_position, 1.0);

    // Displacement 처리
    if (u_useDisplacementTexture) {
        let worldPos = (u_instanceGroupModelMatrix * position).xyz;
        let distance = distance(worldPos, u_directionalLightProjectionViewMatrix[3].xyz);
        let mipLevel = (distance / maxDistance) * maxMipLevel;
        let displacedPosition = getDisplacementPosition(
            input_position,
            input_vertexNormal,
            displacementTexture,
            displacementTextureSampler,
            u_displacementScale,
            input_uv,
            mipLevel
        );
        position = u_modelMatrix * vec4<f32>(displacedPosition, 1.0);
    }

    output.position = getShadowClipPosition((u_instanceGroupModelMatrix * position).xyz, u_directionalLightProjectionViewMatrix);
    return output;
}
