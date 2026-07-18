#redgpu_include SYSTEM_UNIFORM;


// 지형 변위를 조절할 버텍스 레벨 유니폼 구조체
struct TerrainUniforms {
    minHeight: f32,
    maxHeight: f32,
    worldOffset: vec2<f32>,
    worldSize: vec2<f32>,
}
@group(1) @binding(0) var<uniform> vertexUniforms: TerrainUniforms;
@group(1) @binding(1) var heightTextureSampler: sampler;
@group(1) @binding(2) var heightTexture: texture_2d<f32>;
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

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,

    @location(11) combinedOpacity: f32,
    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;
    let u_projectionViewMatrix = systemUniforms.projection.projectionViewMatrix;
    let u_noneJitterProjectionViewMatrix = systemUniforms.projection.noneJitterProjectionViewMatrix;
    let u_prevNoneJitterProjectionViewMatrix = systemUniforms.projection.prevNoneJitterProjectionViewMatrix;

    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];
    let u_matrixList = globalVertexData.matrixList;
    let u_modelMatrix = u_matrixList.modelMatrix;
    let u_prevModelMatrix = u_matrixList.prevModelMatrix;

    // 1. 2D 평면 오프셋 계산 (정밀 XZ 맵핑)
    // 0.0 ~ 1.0의 로컬 XZ 좌표를 worldOffset과 worldSize에 따라 맵핑
    let localXZ = vec2<f32>(inputData.position.x, inputData.position.z);
    let worldXZ = vertexUniforms.worldOffset + localXZ * vertexUniforms.worldSize;

    // 2. 높이맵 픽셀 샘플링 (Mipmap 0레벨 강제)
    var sampledHeight = 0.0;
    #redgpu_if heightTexture
    sampledHeight = textureSampleLevel(heightTexture, heightTextureSampler, inputData.uv, 0.0).r;
    #redgpu_endIf

    // 3. Y축 입체 고도 복원
    let worldY = sampledHeight * (vertexUniforms.maxHeight - vertexUniforms.minHeight) + vertexUniforms.minHeight;
    let worldPosVec4 = vec4<f32>(worldXZ.x, worldY, worldXZ.y, 1.0);

    // 4. 월드 및 MVP 행렬 연산
    let position = u_modelMatrix * worldPosVec4;
    output.position = u_projectionViewMatrix * position;
    output.vertexPosition = position.xyz;
    output.uv = inputData.uv;
    output.vertexNormal = inputData.vertexNormal;

    // Motion vector calculation
    {
      output.currentClipPos = u_noneJitterProjectionViewMatrix * position;
      output.prevClipPos = u_prevNoneJitterProjectionViewMatrix * u_prevModelMatrix * worldPosVec4;
    }

    output.globalFragmentSlotIndex = globalVertexData.globalFragmentSlotIndex;
    output.combinedOpacity = globalVertexData.combinedOpacity;

    return output;
}
