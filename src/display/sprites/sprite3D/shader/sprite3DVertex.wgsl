#redgpu_include SYSTEM_UNIFORM;
#redgpu_include getBillboardMatrix;
struct MatrixList{
    modelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
}
struct VertexUniforms {
    matrixList:MatrixList,
    pickingId: u32,
    useSizeAttenuation: u32,
    useBillboard: u32,
    usePixelSize: u32,
    pixelSize: f32,
    _renderRatioX: f32,
    _renderRatioY: f32,
    combinedOpacity: f32,
};

@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;

struct InputData {
    @location(0) position: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
};

struct OutputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(11) combinedOpacity: f32,
    //
    @location(12) motionVector: vec3<f32>,
    @location(13) shadowPos: vec3<f32>,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

struct OutputShadowData {
    @builtin(position) position: vec4<f32>,
};

@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    // 시스템 Uniform 변수 가져오기
    let u_resolution = systemUniforms.resolution;
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_projectionCameraMatrix = systemUniforms.projectionCameraMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // Vertex별 Uniform 변수 가져오기
    let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;
    let u_normalModelMatrix = vertexUniforms.matrixList.normalModelMatrix;
    let u_useSizeAttenuation = vertexUniforms.useSizeAttenuation;
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

    // 입력 데이터
    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_positionVec4 = vec4<f32>(input_position, 1.0);
    let input_vertexNormalVec4 = vec4<f32>(input_vertexNormal, 1.0);
    let input_uv = inputData.uv;

    // 처리에 필요한 변수 초기화
    var position: vec4<f32>;
    var normalPosition: vec4<f32>;

    #redgpu_if useBillboard
    {    // 기본 position과 normalPosition 계산
        let projectionModelMatrix = u_projectionMatrix * u_modelMatrix;
        let billboardMatrix = getBillboardMatrix(u_cameraMatrix, u_modelMatrix);
        let billboardNormalMatrix = getBillboardMatrix(u_cameraMatrix, u_normalModelMatrix);

        if (u_useSizeAttenuation == 1) {
            position = billboardMatrix * ratioScaleMatrix * input_positionVec4;
            normalPosition = billboardNormalMatrix * ratioScaleMatrix * input_vertexNormalVec4;
        } else {
            position = billboardMatrix * ratioScaleMatrix * input_positionVec4;
            normalPosition = billboardNormalMatrix * ratioScaleMatrix * input_vertexNormalVec4;
        }

        output.position = u_projectionMatrix * position;

        if (u_usePixelSize == 1 || u_useSizeAttenuation != 1) {
            // NDC 좌표로 변환
            var temp = output.position / output.position.w;

            // 화면 비율 및 스케일 보정
            let aspectRatio = u_resolution.x / u_resolution.y;
            var scaleX = clamp((projectionModelMatrix)[1][1], -1.0, 1.0) / aspectRatio * u_renderRatioX;
            var scaleY = clamp((projectionModelMatrix)[1][1], -1.0, 1.0) * u_renderRatioY;
            if(u_usePixelSize == 1) {
               scaleX = u_pixelSize / u_resolution.x * 2.0 * u_renderRatioX;
               scaleY = u_pixelSize / u_resolution.y * 2.0 * u_renderRatioY;
            }

            // 위치 조정
            output.position = vec4<f32>(
                temp.xy + input_position.xy * vec2<f32>(scaleX, scaleY),
                temp.zw
            );
        }
    }
    #redgpu_else
    {
        position = u_cameraMatrix * u_modelMatrix * ratioScaleMatrix * input_positionVec4;
        normalPosition = u_cameraMatrix * u_normalModelMatrix * ratioScaleMatrix * input_vertexNormalVec4;
        output.position = u_projectionMatrix * position;
    }
    #redgpu_endIf

    // 출력 데이터 설정
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalPosition.xyz;
    output.uv = input_uv;
    output.combinedOpacity = vertexUniforms.combinedOpacity;

    return output;
}

@vertex
fn drawDirectionalShadowDepth(inputData: InputData) -> OutputShadowData {
    var output: OutputShadowData;

    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
    let u_directionalLightProjectionMatrix = systemUniforms.directionalLightProjectionMatrix;
    let u_directionalLightViewMatrix = systemUniforms.directionalLightViewMatrix;

    let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;
    let u_useSizeAttenuation = vertexUniforms.useSizeAttenuation;
    let u_useBillboard = vertexUniforms.useBillboard;
    let u_usePixelSize = vertexUniforms.usePixelSize;
    let input_position = inputData.position;
    let input_positionVec4 = vec4<f32>(input_position, 1.0);
    var position: vec4<f32>;

    // TODO Sprite drawDirectionalShadowDepth
    output.position = u_directionalLightProjectionViewMatrix * u_modelMatrix * input_positionVec4;

    return output;
}

@vertex
fn picking(inputData: InputData) -> OutputData {
    var output: OutputData;

    // 시스템 및 버텍스 유니폼 매트릭스
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_cameraMatrix = systemUniforms.camera.cameraMatrix;
    let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;

    // 빌보드와 기타 처리 플래그
    let u_useSizeAttenuation = vertexUniforms.useSizeAttenuation;
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

    // 입력 데이터
    let input_position = inputData.position;
    let input_positionVec4 = vec4<f32>(input_position, 1.0);
    let u_resolution = systemUniforms.resolution;

    // 변환된 위치
    var position: vec4<f32>;

    if (u_useBillboard == 1) {
        // 기본 position과 normalPosition 계산
        let projectionModelMatrix = u_projectionMatrix * u_modelMatrix;
        let billboardMatrix = getBillboardMatrix(u_cameraMatrix, u_modelMatrix);

        if (u_useSizeAttenuation == 1) {
            position = billboardMatrix * ratioScaleMatrix * input_positionVec4;
        } else {
            position = billboardMatrix * ratioScaleMatrix * input_positionVec4;
        }

        // View3D-Projection Matrix 곱
        output.position = u_projectionMatrix * position;

        if (u_usePixelSize == 1 || u_useSizeAttenuation != 1) {
            // NDC 좌표로 변환
            var temp = output.position / output.position.w;

            // 화면 비율 및 스케일 보정
            let aspectRatio = u_resolution.x / u_resolution.y;
            var scaleX = clamp((projectionModelMatrix)[1][1], -1.0, 1.0) / aspectRatio * u_renderRatioX;
            var scaleY = clamp((projectionModelMatrix)[1][1], -1.0, 1.0) * u_renderRatioY;
            if(u_usePixelSize == 1) {
               scaleX = u_pixelSize / u_resolution.x * 2.0 * u_renderRatioX;
               scaleY = u_pixelSize / u_resolution.y * 2.0 * u_renderRatioY;
            }

            // 위치 조정
            output.position = vec4<f32>(
                temp.xy + input_position.xy * vec2<f32>(scaleX, scaleY),
                temp.zw
            );
        }
    } else {
        // 일반적인 변환 계산
        position = u_cameraMatrix * u_modelMatrix * ratioScaleMatrix * input_positionVec4;
        output.position = u_projectionMatrix * position;
    }

    // 추가 출력 데이터 설정
    output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);

    return output;
}
