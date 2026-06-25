#redgpu_include SYSTEM_UNIFORM;
#redgpu_include math.billboard.getBillboardMatrix;
#redgpu_include math.billboard.getBillboardResult;
#redgpu_include entryPoint.billboard.entryPointPickingVertex;
#redgpu_include entryPoint.empty.entryPointShadowVertex;



/**
 * [KO] TextField3D를 위한 버텍스 유니폼 구조체입니다.
 * [EN] Vertex uniform structure for TextField3D.
 */
struct TextFieldVertexUniforms {
    useSizeAttenuation: u32,
    useBillboard: u32,
    usePixelSize: u32,
    pixelSize: f32,
    _renderRatioX: f32,
    _renderRatioY: f32,
};

@group(1) @binding(0) var<uniform> vertexUniforms: TextFieldVertexUniforms;

/**
 * [KO] 버텍스 입력 데이터 구조체입니다.
 * [EN] Vertex input data structure.
 */
struct InputData {
    @builtin(instance_index) globalVertexBufferSlotIndex: u32,
    @location(0) position: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
};

/**
 * [KO] 버텍스 출력 데이터 구조체입니다.
 * [EN] Vertex output data structure.
 */
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(10) @interpolate(flat) globalFragmentBufferSlotIndex: u32,
    @location(11) combinedOpacity: f32,
    @location(13) shadowCoord: vec3<f32>,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

/**
 * [KO] TextField3D 메인 버텍스 셰이더 엔트리 포인트입니다.
 * [EN] Main vertex shader entry point for TextField3D.
 */
@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;

    let globalVertexUniforms = globalVertexUniformBuffer[inputData.globalVertexBufferSlotIndex];
    // [KO] TextField3D의 선명도를 위해 지터링이 제거된 투영 행렬(noneJitterProjectionMatrix)을 사용합니다.
    // [EN] Uses a jitter-free projection matrix (noneJitterProjectionMatrix) for the clarity of TextField3D.
    let billboardResult = getBillboardResult(
        inputData.position,
        inputData.vertexNormal,
        globalVertexUniforms.matrixList.modelMatrix,
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
    output.combinedOpacity = globalVertexUniforms.combinedOpacity;
    output.globalFragmentBufferSlotIndex = globalVertexUniforms.globalFragmentBufferSlotIndex;

    return output;
}
