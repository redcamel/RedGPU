#redgpu_include SYSTEM_UNIFORM;
#redgpu_include getBillboardMatrix;
struct MatrixList{
    modelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
}
struct VertexUniforms {
    pickingId: u32,
    matrixList:MatrixList,
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
    @location(13) shadowCoord: vec3<f32>,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

#redgpu_include systemStruct.OutputShadowData;

@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    // 시스템 Uniform 변수 가져오기
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // Vertex별 Uniform 변수 가져오기
    let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;
    let u_normalModelMatrix = vertexUniforms.matrixList.normalModelMatrix;

    // 입력 데이터
    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    // 처리에 필요한 변수 초기화
    var position: vec4<f32>;
    var normalPosition: vec4<f32>;

    // 일반적인 변환 계산
    position = u_cameraMatrix * u_modelMatrix * vec4<f32>(input_position, 1.0);
    normalPosition = u_cameraMatrix * u_normalModelMatrix * vec4<f32>(input_vertexNormal, 1.0);

    // 투영 변환 적용
    output.position = u_projectionMatrix * position;

    // 출력 데이터 설정
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalPosition.xyz;
    output.uv = input_uv;
    output.combinedOpacity = vertexUniforms.combinedOpacity;

    return output;
}

@vertex
fn entryPointPickingVertex(inputData: InputData) -> OutputData {
    var output: OutputData;

    // 시스템 Uniform 변수 가져오기
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // Vertex별 Uniform 변수 가져오기
    let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;
    let u_normalModelMatrix = vertexUniforms.matrixList.normalModelMatrix;

    // 입력 데이터
    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    // 처리에 필요한 변수 초기화
    var position: vec4<f32>;
    var normalPosition: vec4<f32>;

    // 일반적인 변환 계산
    position = u_cameraMatrix * u_modelMatrix * vec4<f32>(input_position, 1.0);
    normalPosition = u_cameraMatrix * u_normalModelMatrix * vec4<f32>(input_vertexNormal, 1.0);

    // 투영 변환 적용
    output.position = u_projectionMatrix * position;

    // 피킹 ID 설정
    output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);

    return output;
}
