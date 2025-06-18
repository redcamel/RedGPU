struct OutputShadowData {
    @builtin(position) position : vec4<f32>,
};

@vertex
fn drawDirectionalShadowDepth( inputData:InputData ) -> OutputShadowData {
    var output : OutputShadowData;
    let u_useDisplacementTexture = vertexUniforms.useDisplacementTexture == 1u;
    //
    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;
    //
    let u_modelMatrix = vertexUniforms.modelMatrix;
    let u_displacementScale = vertexUniforms.displacementScale;
    //
    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;
    //
    var position:vec4<f32>;
    position = u_modelMatrix * vec4<f32>(input_position, 1.0);

    if (u_useDisplacementTexture) {
        let distance = distance(position.xyz, u_cameraPosition);
        let mipLevel = (distance / maxDistance) * maxMipLevel;
        let displacementSample = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv, mipLevel).r;
        let scaledDisplacement = (displacementSample - 0.5) * u_displacementScale;
        let displacedPosition = input_position + input_vertexNormal * scaledDisplacement;
        position = u_modelMatrix * vec4<f32>(displacedPosition, 1.0);
    }
    output.position = u_directionalLightProjectionViewMatrix *  position;
    return output;
}
