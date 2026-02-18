
#redgpu_include shadow.getShadowClipPosition

struct OutputShadowData {
    @builtin(position) position: vec4<f32>,
};
@vertex
fn drawDirectionalShadowDepth(inputData: InputData) -> OutputShadowData {
    var output: OutputShadowData;

    let input_instanceIdx: u32 = visibilityBuffer[inputData.instanceIdx];

    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
    let u_modelMatrix = instanceUniforms.instanceModelMatrixs[input_instanceIdx];
    let u_useDisplacementTexture = instanceUniforms.useDisplacementTexture == 1u;
    let u_displacementScale = instanceUniforms.displacementScale;

    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    var position: vec4<f32> = u_modelMatrix * vec4<f32>(input_position, 1.0);

    // Displacement 처리
    if (u_useDisplacementTexture) {
        let distance = distance(position.xyz, u_directionalLightProjectionViewMatrix[3].xyz);
        let mipLevel = (distance / maxDistance) * maxMipLevel;
        let displacedPosition = calcDisplacementPosition(
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

    output.position = getShadowClipPosition(position.xyz, u_directionalLightProjectionViewMatrix);
    return output;
}
