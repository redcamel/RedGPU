@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;

    let input_instanceIdx: u32 = visibilityBuffer[inputData.instanceIdx];

    let u_modelMatrix = instanceUniforms.instanceModelMatrixs[input_instanceIdx];
    let u_normalModelMatrix = instanceUniforms.instanceNormalModelMatrix[input_instanceIdx];
    let u_instanceGroupModelMatrix = instanceUniforms.instanceGroupModelMatrix;
    let u_useDisplacementTexture = instanceUniforms.useDisplacementTexture == 1u;
    let u_displacementScale = instanceUniforms.displacementScale;

    // [KO] 시스템 유니폼 접근
    // [EN] Access system uniforms
    let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
    let u_projectionViewMatrix = systemUniforms.projection.projectionViewMatrix;
    let u_camera = systemUniforms.camera;
    let u_viewMatrix = u_camera.viewMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    var position: vec4<f32> = u_modelMatrix * vec4<f32>(input_position, 1.0);

    // [KO] 월드 좌표 변환
    // [EN] World coordinate transformation
    let worldPosition = position.xyz;

    // Displacement 처리
    if (u_useDisplacementTexture) {
        let worldPosForDisplacement = (u_instanceGroupModelMatrix * position).xyz;
        let distance = distance(worldPosForDisplacement, u_cameraPosition);
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

    // [KO] 최종 클립 좌표 계산
    // [EN] Calculate final clip coordinates
    let worldPositionVec4 = u_instanceGroupModelMatrix * position;
    output.position = u_projectionViewMatrix * worldPositionVec4;
    output.vertexPosition = worldPositionVec4.xyz;

    // [KO] 노말 변환
    // [EN] Normal transformation
    let u_instanceGroupNormalModelMatrix = instanceUniforms.instanceGroupNormalModelMatrix;
    var normalPosition: vec3<f32> = (u_instanceGroupNormalModelMatrix * u_normalModelMatrix * vec4<f32>(input_vertexNormal, 0.0)).xyz;
    output.vertexNormal = normalize(normalPosition);

    output.instanceOpacity = instanceUniforms.instanceOpacity[input_instanceIdx];

    output.uv = inputData.uv;
    output.uv1 = inputData.uv1;
    output.vertexColor_0 = inputData.vertexColor_0;
    output.vertexTangent = vec4<f32>((u_instanceGroupNormalModelMatrix * u_normalModelMatrix * vec4<f32>(inputData.vertexTangent.xyz, 0.0)).xyz, inputData.vertexTangent.w);

    return output;
}
