struct OutputShadowData {
    @builtin(position) position: vec4<f32>,
};

@vertex
fn drawDirectionalShadowDepth(inputData: InputData) -> OutputShadowData {
    var output: OutputShadowData;

    // 시스템 Uniform 변수 가져오기
    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // Vertex별 Uniform 변수 가져오기
    let u_modelMatrix = vertexUniforms.modelMatrix;

    // 입력 데이터
    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    // 위치 변환 처리
    var position: vec4<f32>;
    position = u_modelMatrix * vec4<f32>(input_position, 1.0);

    // 디스플레이스먼트 텍스처 적용
    #redgpu_if useDisplacementTexture
    {
        let distance = distance(position.xyz, u_cameraPosition);
        let mipLevel = (distance / maxDistance) * maxMipLevel;
        let displacedPosition = calcDisplacementPosition(
            input_position,
            input_vertexNormal,
            displacementTexture,
            displacementTextureSampler,
            vertexUniforms.displacementScale,
            input_uv,
            mipLevel
        );
        position = u_modelMatrix * vec4<f32>(displacedPosition, 1.0);
    }
    #redgpu_endIf

    // 최종 위치 계산 (그림자 맵 좌표계로 변환)
    output.position = u_directionalLightProjectionViewMatrix * position;

    return output;
}
