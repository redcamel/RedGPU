#redgpu_include SYSTEM_UNIFORM;
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

    // ?úÏä§??Uniform Î≥Ä??Í∞Ä?∏Ïò§Í∏?
    let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_viewMatrix = u_camera.viewMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // VertexÎ≥?Uniform Î≥Ä??Í∞Ä?∏Ïò§Í∏?
    let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;
    let u_normalModelMatrix = vertexUniforms.matrixList.normalModelMatrix;

    // ?ÖÎ†• ?∞Ïù¥??
    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    // Ï≤òÎ¶¨???ÑÏöî??Î≥Ä??Ï¥àÍ∏∞??
    var position: vec4<f32>;
    var normalPosition: vec4<f32>;

    // ?ºÎ∞ò?ÅÏù∏ Î≥Ä??Í≥ÑÏÇ∞
    position = u_viewMatrix * u_modelMatrix * vec4<f32>(input_position, 1.0);
    normalPosition = u_viewMatrix * u_normalModelMatrix * vec4<f32>(input_vertexNormal, 1.0);

    // ?¨ÏòÅ Î≥Ä???ÅÏö©
    output.position = u_projectionMatrix * position;

    // Ï∂úÎ†• ?∞Ïù¥???§Ï†ï
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalPosition.xyz;
    output.uv = input_uv;
    output.combinedOpacity = vertexUniforms.combinedOpacity;

    return output;
}

@vertex
fn entryPointPickingVertex(inputData: InputData) -> OutputData {
    var output: OutputData;

    // ?úÏä§??Uniform Î≥Ä??Í∞Ä?∏Ïò§Í∏?
    let u_projectionMatrix = systemUniforms.projection.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_viewMatrix = u_camera.viewMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // VertexÎ≥?Uniform Î≥Ä??Í∞Ä?∏Ïò§Í∏?
    let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;
    let u_normalModelMatrix = vertexUniforms.matrixList.normalModelMatrix;

    // ?ÖÎ†• ?∞Ïù¥??
    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    // Ï≤òÎ¶¨???ÑÏöî??Î≥Ä??Ï¥àÍ∏∞??
    var position: vec4<f32>;
    var normalPosition: vec4<f32>;

    // ?ºÎ∞ò?ÅÏù∏ Î≥Ä??Í≥ÑÏÇ∞
    position = u_viewMatrix * u_modelMatrix * vec4<f32>(input_position, 1.0);
    normalPosition = u_viewMatrix * u_normalModelMatrix * vec4<f32>(input_vertexNormal, 1.0);

    // ?¨ÏòÅ Î≥Ä???ÅÏö©
    output.position = u_projectionMatrix * position;

    // ?ºÌÇπ ID ?§Ï†ï
    output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);

    return output;
}

