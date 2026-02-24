#redgpu_include SYSTEM_UNIFORM;

/**
 * [KO] 행렬 목록 구조체 정의입니다.
 * [EN] Matrix list structure definition.
 */
struct MatrixList{
    modelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
}

/**
 * [KO] TextField2D를 위한 버텍스 유니폼 구조체입니다.
 * [EN] Vertex uniform structure for TextField2D.
 */
struct VertexUniforms {
    pickingId: u32,
    matrixList: MatrixList,
    combinedOpacity: f32,
};

@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;

/**
 * [KO] 버텍스 입력 데이터 구조체입니다.
 * [EN] Vertex input data structure.
 */
struct InputData {
    @location(0) position: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
};

/**
 * [KO] 버텍스 출력 데이터 구조체입니다.
 * [EN] Vertex output data structure.
 */
struct OutputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(11) combinedOpacity: f32,
    @location(13) shadowCoord: vec3<f32>,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

#redgpu_include systemStruct.OutputShadowData;

/**
 * [KO] TextField2D 메인 버텍스 셰이더 엔트리 포인트입니다.
 * [EN] Main vertex shader entry point for TextField2D.
 */
@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    // [KO] 시스템 유니폼 변수 가져오기
    // [EN] Get system uniform variables
    let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
    let u_viewMatrix = systemUniforms.camera.viewMatrix;

    // [KO] 버텍스 유니폼 변수 가져오기
    // [EN] Get vertex uniform variables
    let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;
    let u_normalModelMatrix = vertexUniforms.matrixList.normalModelMatrix;

    // [KO] 입력 데이터 처리
    // [EN] Process input data
    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    // [KO] 위치 및 노말 변환
    // [EN] Position and normal transformation
    let viewPos = u_viewMatrix * u_modelMatrix * vec4<f32>(input_position, 1.0);
    let viewNormal = u_viewMatrix * u_normalModelMatrix * vec4<f32>(input_vertexNormal, 0.0);

    // [KO] 투영 변환 적용
    // [EN] Apply projection transformation
    output.position = u_projectionMatrix * viewPos;

    // [KO] 출력 데이터 설정
    // [EN] Set output data
    output.vertexPosition = viewPos.xyz;
    output.vertexNormal = viewNormal.xyz;
    output.uv = input_uv;
    output.combinedOpacity = vertexUniforms.combinedOpacity;

    return output;
}

/**
 * [KO] TextField2D 피킹 처리를 위한 버텍스 셰이더입니다.
 * [EN] Vertex shader for TextField2D picking.
 */
@vertex
fn entryPointPickingVertex(inputData: InputData) -> OutputData {
    var output: OutputData;

    let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
    let u_viewMatrix = systemUniforms.camera.viewMatrix;
    let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;

    let viewPos = u_viewMatrix * u_modelMatrix * vec4<f32>(inputData.position, 1.0);
    output.position = u_projectionMatrix * viewPos;

    // [KO] 피킹 ID 설정
    // [EN] Set picking ID
    output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);

    return output;
}
