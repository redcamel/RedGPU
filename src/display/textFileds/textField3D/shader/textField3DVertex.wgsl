#redgpu_include SYSTEM_UNIFORM;
#redgpu_include getBillboardMatrix;
struct MatrixList{
    modelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
}
struct VertexUniforms {
    pickingId: u32,
    matrixList:MatrixList,
    normalModelMatrix: mat4x4<f32>,
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
    @location(11) combinedOpacity: f32,
    //
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
    let u_noneJitterProjectionMatrix = systemUniforms.noneJitterProjectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;

    // Vertex별 Uniform 변수 가져오기
    let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;
    let u_normalModelMatrix = vertexUniforms.matrixList.normalModelMatrix;
    let u_useBillboard = vertexUniforms.useBillboard;
    let u_usePixelSize = vertexUniforms.usePixelSize;
    let u_pixelSize = vertexUniforms.pixelSize;
    let u_renderRatioX = vertexUniforms._renderRatioX;
    let u_renderRatioY = vertexUniforms._renderRatioY;

    // 비율 및 worldSize가 반영된 스케일 매트릭스
    var ratioScaleMatrix: mat4x4<f32> = mat4x4<f32>(
        u_renderRatioX, 0, 0, 0,
        0, u_renderRatioY, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );

    // 입력 데이터
    let input_positionVec4 = vec4<f32>(inputData.position, 1.0);
    let input_vertexNormalVec4 = vec4<f32>(inputData.vertexNormal, 1.0);

    // 처리에 필요한 변수 초기화
    var position: vec4<f32>;
    var normalPosition: vec4<f32>;

    #redgpu_if useBillboard
    {
        let billboardMatrix = getBillboardMatrix(u_cameraMatrix, u_modelMatrix);
        let billboardNormalMatrix = getBillboardMatrix(u_cameraMatrix, u_normalModelMatrix);

        if (u_usePixelSize == 1) {
            // [Pixel Size 모드] - 원근 무시, 고정 크기
            let viewPositionCenter = billboardMatrix * vec4<f32>(0.0, 0.0, 0.0, 1.0);
            let clipCenter = u_noneJitterProjectionMatrix * viewPositionCenter;

            let scaleX = (u_pixelSize / u_resolution.x) * 2.0 * u_renderRatioX;
            let scaleY = (u_pixelSize / u_resolution.y) * 2.0 * u_renderRatioY;

            output.position = vec4<f32>(
                clipCenter.xy + inputData.position.xy * vec2<f32>(scaleX, scaleY) * clipCenter.w,
                clipCenter.zw
            );
            position = viewPositionCenter;
            normalPosition = vec4<f32>(0.0, 0.0, 1.0, 0.0);
        } else {
            // [월드 모드] - 원근 적용
            position = billboardMatrix * ratioScaleMatrix * input_positionVec4;
            normalPosition = billboardNormalMatrix * ratioScaleMatrix * input_vertexNormalVec4;
            output.position = u_noneJitterProjectionMatrix * position;
        }
    }
    #redgpu_else
    {
        position = u_cameraMatrix * u_modelMatrix * ratioScaleMatrix * input_positionVec4;
        normalPosition = u_cameraMatrix * u_normalModelMatrix * ratioScaleMatrix * input_vertexNormalVec4;
        output.position = u_noneJitterProjectionMatrix * position;
    }
    #redgpu_endIf

    // 출력 데이터 설정
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalPosition.xyz;
    output.uv = inputData.uv;
    output.combinedOpacity = vertexUniforms.combinedOpacity;

    return output;
}

fn drawDirectionalShadowDepth(inputData: InputData) -> OutputShadowData {
    var output: OutputShadowData;
    return output;
}

@vertex
fn picking(inputData: InputData) -> OutputData {
    var output: OutputData;
    let u_resolution = systemUniforms.resolution;
    let u_noneJitterProjectionMatrix = systemUniforms.noneJitterProjectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;

    let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;
    let u_normalModelMatrix = vertexUniforms.matrixList.normalModelMatrix;
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
            let clipCenter = u_noneJitterProjectionMatrix * viewPositionCenter;
            let scaleX = (u_pixelSize / u_resolution.x) * 2.0 * u_renderRatioX;
            let scaleY = (u_pixelSize / u_resolution.y) * 2.0 * u_renderRatioY;

            output.position = vec4<f32>(
                clipCenter.xy + inputData.position.xy * vec2<f32>(scaleX, scaleY) * clipCenter.w,
                clipCenter.zw
            );
        } else {
            output.position = u_noneJitterProjectionMatrix * billboardMatrix * ratioScaleMatrix * vec4<f32>(inputData.position, 1.0);
        }
    } else {
        output.position = u_noneJitterProjectionMatrix * u_cameraMatrix * u_modelMatrix * ratioScaleMatrix * vec4<f32>(inputData.position, 1.0);
    }

    output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);
    return output;
}