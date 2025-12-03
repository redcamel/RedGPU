@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    let input_instanceIdx: u32 = visibilityBuffer[inputData.instanceIdx];


    let u_modelMatrix = instanceUniforms.instanceModelMatrixs[input_instanceIdx];
    let u_normalModelMatrix = instanceUniforms.instanceNormalModelMatrix[input_instanceIdx];
    let u_instanceGroupModelMatrix = instanceUniforms.instanceGroupModelMatrix;
    let u_useDisplacementTexture = instanceUniforms.useDisplacementTexture == 1u;
    let u_displacementScale = instanceUniforms.displacementScale;

    // 시스템 유니폼
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_projectionCameraMatrix = systemUniforms.projectionCameraMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    var position: vec4<f32> = u_modelMatrix * vec4<f32>(input_position, 1.0);

    // 월드 좌표 변환
    let worldPosition = position.xyz;

    // Displacement 처리
    if (u_useDisplacementTexture) {
        let distance = distance(position.xyz, u_cameraPosition);
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

    // 최종 클립 좌표 계산
    output.position = u_projectionCameraMatrix * u_instanceGroupModelMatrix * position;
    output.vertexPosition = position.xyz;

    // 노말 변환
    var normalPosition: vec3<f32> = (u_instanceGroupModelMatrix * u_normalModelMatrix * vec4<f32>(input_vertexNormal, 1.0)).xyz;
    output.vertexNormal = normalPosition;

    output.uv = input_uv;
    output.instanceOpacity = instanceUniforms.instanceOpacity[input_instanceIdx];

    return output;
}
