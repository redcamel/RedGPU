#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowCoord;
#redgpu_include entryPoint.mesh.entryPointShadowVertex;
#redgpu_include entryPoint.mesh.entryPointPickingVertex;
#redgpu_include systemStruct.globalVertexStruct;

// 지형(Terrain) 전용 버텍스 유니폼 (group 1, binding 0)
struct TerrainUniforms {
    minHeight: f32,
    maxHeight: f32,
    worldOffset: vec2<f32>,
    worldSize: vec2<f32>,
}
@group(1) @binding(0) var<uniform> vertexUniforms: TerrainUniforms;

// heightTexture 샘플러 및 텍스처 (group 1, binding 1, 2)
@group(1) @binding(1) var heightTextureSampler: sampler;
@group(1) @binding(2) var heightTexture: texture_2d<f32>;

// TerrainGeometry 버텍스 레이아웃에 맞는 InputData
// slot: 0=position, 1=normal, 2=uv, 3=tangent
struct InputData {
    @builtin(instance_index) globalVertexSlotIndex: u32,
    @location(0) position: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) vertexTangent: vec4<f32>,
};

// PBR fragment shader 와 호환되는 VertexOutput
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(10) localNodeScale_volumeScale: vec2<f32>,
    @location(11) combinedOpacity: f32,

    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;

    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];
    let su_projection = systemUniforms.projection;

    let input_vertexNormal = inputData.vertexNormal;

    let su_projectionViewMatrix = su_projection.projectionViewMatrix;

    let gu_matrixList = globalVertexData.matrixList;
    let gu_localMatrix = gu_matrixList.localMatrix;
    let gu_modelMatrix = gu_matrixList.modelMatrix;
    let gu_prevModelMatrix = gu_matrixList.prevModelMatrix;
    let gu_normalModelMatrix = gu_matrixList.normalModelMatrix;

    // 1. XZ 좌표를 worldOffset + worldSize 로 월드 공간 맵핑
    let localXZ = vec2<f32>(inputData.position.x, inputData.position.z);
    let worldXZ = vertexUniforms.worldOffset + localXZ * vertexUniforms.worldSize;

    // 2. heightTexture 샘플링으로 Y축 높이 결정 + 노말 계산 (Finite Difference)
    #redgpu_if heightTexture
    let sampledHeight = textureSampleLevel(heightTexture, heightTextureSampler, inputData.uv, 0.0).r;

    // 주변 4방향 픽셀 높이 샘플링
    let texSize  = vec2<f32>(textureDimensions(heightTexture, 0));
    let texelSize = 1.0 / texSize;
    let heightRange = vertexUniforms.maxHeight - vertexUniforms.minHeight;

    let hL = textureSampleLevel(heightTexture, heightTextureSampler, inputData.uv + vec2<f32>(-texelSize.x, 0.0), 0.0).r;
    let hR = textureSampleLevel(heightTexture, heightTextureSampler, inputData.uv + vec2<f32>( texelSize.x, 0.0), 0.0).r;
    let hD = textureSampleLevel(heightTexture, heightTextureSampler, inputData.uv + vec2<f32>(0.0, -texelSize.y), 0.0).r;
    let hU = textureSampleLevel(heightTexture, heightTextureSampler, inputData.uv + vec2<f32>(0.0,  texelSize.y), 0.0).r;

    // Finite Difference: X/Z 방향 접선 벡터 → 크로스 프로덕트로 노말 도출
    let stepX = vertexUniforms.worldSize.x * texelSize.x * 2.0;
    let stepZ = vertexUniforms.worldSize.y * texelSize.y * 2.0;
    let tangentX = vec3<f32>(stepX, (hR - hL) * heightRange, 0.0);
    let tangentZ = vec3<f32>(0.0,   (hU - hD) * heightRange, stepZ);
    let computedNormal = normalize(cross(tangentX, tangentZ));
    let worldTangentX = normalize((gu_normalModelMatrix * vec4<f32>(normalize(tangentX), 0.0)).xyz);
    #redgpu_else
    let sampledHeight = 0.0;
    let computedNormal = vec3<f32>(0.0, 1.0, 0.0);
    let worldTangentX = normalize((gu_normalModelMatrix * vec4<f32>(inputData.vertexTangent.xyz, 0.0)).xyz);
    #redgpu_endIf

    let worldY = sampledHeight * (vertexUniforms.maxHeight - vertexUniforms.minHeight) + vertexUniforms.minHeight;

    // 3. 최종 월드 포지션 구성
    let worldPos = vec4<f32>(worldXZ.x, worldY, worldXZ.y, 1.0);
    let position = gu_modelMatrix * worldPos;

    // 높이맵으로 계산한 노말을 모델 행렬로 변환
    let normalPosition = gu_normalModelMatrix * vec4<f32>(computedNormal, 0.0);

    // 4. Output 할당
    output.position = su_projectionViewMatrix * position;
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalize(normalPosition.xyz);
    output.uv = inputData.uv;
    output.uv1 = inputData.uv;
    output.vertexColor_0 = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    output.globalFragmentSlotIndex = globalVertexData.globalFragmentSlotIndex;

    output.vertexTangent = vec4<f32>(worldTangentX, inputData.vertexTangent.w);

    // Shadow
    #redgpu_if receiveShadow
    {
        output.shadowCoord = getShadowCoord(position.xyz, systemUniforms.directionalLightProjectionViewMatrix);
        output.receiveShadow = globalVertexData.receiveShadow;
    }
    #redgpu_endIf

    // Motion vector
    {
        output.currentClipPos = su_projection.noneJitterProjectionViewMatrix * position;
        output.prevClipPos = su_projection.prevNoneJitterProjectionViewMatrix * gu_prevModelMatrix * worldPos;
    }

    // Scale
    let nodeScaleX = length(gu_localMatrix[0].xyz);
    let nodeScaleY = length(gu_localMatrix[1].xyz);
    let nodeScaleZ = length(gu_localMatrix[2].xyz);
    let volumeScaleX = length(gu_modelMatrix[0].xyz);
    let volumeScaleY = length(gu_modelMatrix[1].xyz);
    let volumeScaleZ = length(gu_modelMatrix[2].xyz);
    output.localNodeScale_volumeScale = vec2<f32>(
        pow(nodeScaleX * nodeScaleY * nodeScaleZ, 1.0 / 3.0),
        pow(volumeScaleX * volumeScaleY * volumeScaleZ, 1.0 / 3.0)
    );

    return output;
}
