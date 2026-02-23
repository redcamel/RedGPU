@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    let input_instanceIdx: u32 = visibilityBuffer[inputData.instanceIdx];


    let u_modelMatrix = instanceUniforms.instanceModelMatrixs[input_instanceIdx];
    let u_normalModelMatrix = instanceUniforms.instanceNormalModelMatrix[input_instanceIdx];
    let u_instanceGroupModelMatrix = instanceUniforms.instanceGroupModelMatrix;
    let u_useDisplacementTexture = instanceUniforms.useDisplacementTexture == 1u;
    let u_displacementScale = instanceUniforms.displacementScale;

    // ?�스???�니??
    let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
    let u_projectionViewMatrix = systemUniforms.projection.projectionViewMatrix;
    let u_camera = systemUniforms.camera;
    let u_viewMatrix = u_camera.viewMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    var position: vec4<f32> = u_modelMatrix * vec4<f32>(input_position, 1.0);

    // ?�드 좌표 변??
    let worldPosition = position.xyz;

    // Displacement 처리
    if (u_useDisplacementTexture) {
        let distance = distance(position.xyz, u_cameraPosition);
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

    // 최종 ?�립 좌표 계산
    output.position = u_projectionViewMatrix * u_instanceGroupModelMatrix * position;
    output.vertexPosition = position.xyz;

    // ?�말 변??
    var normalPosition: vec3<f32> = (u_instanceGroupModelMatrix * u_normalModelMatrix * vec4<f32>(input_vertexNormal, 1.0)).xyz;
    output.vertexNormal = normalPosition;

    output.instanceOpacity = instanceUniforms.instanceOpacity[input_instanceIdx];

    output.uv = inputData.uv;
    output.uv1 = inputData.uv1;
    output.vertexColor_0 = inputData.vertexColor_0;
    output.vertexTangent = u_normalModelMatrix * inputData.vertexTangent;


    return output;
}

