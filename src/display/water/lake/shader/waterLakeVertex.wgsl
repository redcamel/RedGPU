#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.globalVertexStruct;

struct InputData {
    @builtin(instance_index) globalVertexSlotIndex: u32,
    @location(0) position: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) vertexTangent: vec4<f32>,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) vertexTangent: vec4<f32>,
    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(11) combinedOpacity: f32,
    @location(14) @interpolate(flat) receiveShadow: f32,
};

@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;
    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];

    let su_projection = systemUniforms.projection;
    let su_projectionViewMatrix = su_projection.projectionViewMatrix;

    let gu_matrixList = globalVertexData.matrixList;
    let gu_modelMatrix = gu_matrixList.modelMatrix;
    let gu_prevModelMatrix = gu_matrixList.prevModelMatrix;
    let gu_normalModelMatrix = gu_matrixList.normalModelMatrix;

    let input_position_vec4 = vec4<f32>(inputData.position, 1.0);
    let worldPos = gu_modelMatrix * input_position_vec4;
    let worldNormal = normalize((gu_normalModelMatrix * vec4<f32>(inputData.vertexNormal, 0.0)).xyz);
    let worldTangent = normalize((gu_normalModelMatrix * vec4<f32>(inputData.vertexTangent.xyz, 0.0)).xyz);

    // Step 1.2: 기본 MVP 정점 변환 수행
    output.position = su_projectionViewMatrix * worldPos;
    output.vertexPosition = worldPos.xyz;
    output.vertexNormal = worldNormal;
    output.uv = inputData.uv * globalVertexData.uvTransform.zw + globalVertexData.uvTransform.xy;
    output.vertexTangent = vec4<f32>(worldTangent, inputData.vertexTangent.w);

    output.combinedOpacity = globalVertexData.combinedOpacity;
    output.receiveShadow = globalVertexData.receiveShadow;
    output.currentClipPos = su_projection.noneJitterProjectionViewMatrix * worldPos;
    output.prevClipPos = su_projection.prevNoneJitterProjectionViewMatrix * gu_prevModelMatrix * input_position_vec4;

    return output;
}
