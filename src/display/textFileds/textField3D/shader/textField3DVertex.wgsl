#redgpu_include SYSTEM_UNIFORM;
#redgpu_include getBillboardMatrix;
#redgpu_include getBillboardResult;
#redgpu_include entryPoint.billboard.entryPointPickingVertex;
#redgpu_include entryPoint.empty.entryPointShadowVertex;

/**
 * [KO] 행렬 목록 구조체 정의입니다.
 * [EN] Matrix list structure definition.
 */
struct MatrixList{
    modelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
}

/**
 * [KO] TextField3D를 위한 버텍스 유니폼 구조체입니다.
 * [EN] Vertex uniform structure for TextField3D.
 */
struct VertexUniforms {
    pickingId: u32,
    matrixList: MatrixList,
    normalModelMatrix: mat4x4<f32>,
    useSizeAttenuation: u32,
    useBillboard: u32,
    usePixelSize: u32,
    pixelSize: f32,
    _renderRatioX: f32,
    _renderRatioY: f32,
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

/**
 * [KO] TextField3D 메인 버텍스 셰이더 엔트리 포인트입니다.
 * [EN] Main vertex shader entry point for TextField3D.
 */
@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    // [KO] TextField3D의 선명도를 위해 지터링이 제거된 투영 행렬(noneJitterProjectionMatrix)을 사용합니다.
    // [EN] Uses a jitter-free projection matrix (noneJitterProjectionMatrix) for the clarity of TextField3D.
    let billboardResult = getBillboardResult(
        inputData.position,
        inputData.vertexNormal,
        vertexUniforms.matrixList.modelMatrix,
        systemUniforms.camera.viewMatrix,
        systemUniforms.projection.noneJitterProjectionMatrix,
        systemUniforms.resolution,
        vertexUniforms.useBillboard,
        vertexUniforms.usePixelSize,
        vertexUniforms.pixelSize,
        vertexUniforms._renderRatioX,
        vertexUniforms._renderRatioY
    );

    output.position = billboardResult.position;
    output.vertexPosition = billboardResult.vertexPosition;
    output.vertexNormal = billboardResult.vertexNormal;
    output.uv = inputData.uv;
    output.combinedOpacity = vertexUniforms.combinedOpacity;

    return output;
}
