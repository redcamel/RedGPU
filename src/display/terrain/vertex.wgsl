#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowCoord;
#redgpu_include entryPoint.mesh.entryPointShadowVertex;
#redgpu_include entryPoint.mesh.entryPointPickingVertex;
#redgpu_include systemStruct.globalVertexStruct;

struct TerrainUniforms {
    minHeight: f32,
    maxHeight: f32,
    worldOffset: vec2<f32>,
    worldSize: vec2<f32>,
    baseSlotIndex: f32,
    maxLOD: f32,
}
@group(1) @binding(0) var<uniform> vertexUniforms: TerrainUniforms;

@group(1) @binding(1) var heightTextureSampler: sampler;
@group(1) @binding(2) var heightTexture: texture_2d<f32>;

struct TerrainInstance {
    offset: vec2<f32>,
    scale: f32,
    lod: f32,
}
@group(1) @binding(3) var<storage, read> instanceBuffer: array<TerrainInstance>;

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

    let baseSlotIndex = u32(vertexUniforms.baseSlotIndex);
    let globalVertexData = globalVertexSSBO[baseSlotIndex];
    let su_projection = systemUniforms.projection;

    let input_vertexNormal = inputData.vertexNormal;
    let su_projectionViewMatrix = su_projection.projectionViewMatrix;

    let gu_matrixList = globalVertexData.matrixList;
    let gu_localMatrix = gu_matrixList.localMatrix;
    let gu_modelMatrix = gu_matrixList.modelMatrix;
    let gu_prevModelMatrix = gu_matrixList.prevModelMatrix;
    let gu_normalModelMatrix = gu_matrixList.normalModelMatrix;

    let modelScaleX = length(gu_modelMatrix[0].xyz);
    let modelScaleY = length(gu_modelMatrix[1].xyz);
    let modelScaleZ = length(gu_modelMatrix[2].xyz);

    let localInstanceIndex = inputData.globalVertexSlotIndex - baseSlotIndex;
    let instanceData = instanceBuffer[localInstanceIndex];

    // 💡 Geometry가 -0.5 ~ 0.5 범위를 가지며, offset은 이제 청크의 '중심(Center)'입니다.
    // 즉, localXZ * scale은 중앙에서 양방향으로 뻗어나가는 역할을 완벽히 수행합니다.
    let localXZ = vec2<f32>(inputData.position.x, inputData.position.z);
    let worldXZ = instanceData.offset + localXZ * instanceData.scale;

    let worldUV = (worldXZ - vertexUniforms.worldOffset) / vertexUniforms.worldSize;

    var computedNormal = vec3<f32>(0.0, 1.0, 0.0);
    var worldTangentX = vec3<f32>(1.0, 0.0, 0.0);
    var sampledHeight = 0.0;

    #redgpu_if heightTexture
        sampledHeight = textureSampleLevel(heightTexture, heightTextureSampler, worldUV, 0.0).r;

        let texSize  = vec2<f32>(textureDimensions(heightTexture, 0));
        let texelSize = 1.0 / texSize;
        let heightRange = vertexUniforms.maxHeight - vertexUniforms.minHeight;

        let hL = textureSampleLevel(heightTexture, heightTextureSampler, worldUV + vec2<f32>(-texelSize.x, 0.0), 0.0).r;
        let hR = textureSampleLevel(heightTexture, heightTextureSampler, worldUV + vec2<f32>( texelSize.x, 0.0), 0.0).r;
        let hD = textureSampleLevel(heightTexture, heightTextureSampler, worldUV + vec2<f32>(0.0, -texelSize.y), 0.0).r;
        let hU = textureSampleLevel(heightTexture, heightTextureSampler, worldUV + vec2<f32>(0.0,  texelSize.y), 0.0).r;

        let stepX = vertexUniforms.worldSize.x * texelSize.x * 2.0;
        let stepZ = vertexUniforms.worldSize.y * texelSize.y * 2.0;

        let tangentX = vec3<f32>(stepX, (hR - hL) * heightRange, 0.0);
        let tangentZ = vec3<f32>(0.0,   (hU - hD) * heightRange, stepZ);

        let rawNormal = normalize(cross(tangentZ, tangentX));

        computedNormal = normalize(vec3<f32>(
            rawNormal.x / max(modelScaleX, 1e-5),
            rawNormal.y / max(modelScaleY, 1e-5),
            rawNormal.z / max(modelScaleZ, 1e-5)
        ));

        worldTangentX = normalize((gu_normalModelMatrix * vec4<f32>(normalize(tangentX), 0.0)).xyz);
    #redgpu_else
        worldTangentX = normalize((gu_normalModelMatrix * vec4<f32>(inputData.vertexTangent.xyz, 0.0)).xyz);
    #redgpu_endIf

    let worldY = sampledHeight * (vertexUniforms.maxHeight - vertexUniforms.minHeight) + vertexUniforms.minHeight;

    let worldPos = vec4<f32>(worldXZ.x, worldY, worldXZ.y, 1.0);
    let position = gu_modelMatrix * worldPos;

    let normalPosition = gu_normalModelMatrix * vec4<f32>(computedNormal, 0.0);

    output.position = su_projectionViewMatrix * position;
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalize(normalPosition.xyz);
    output.uv = worldUV;
    output.uv1 = worldUV;
    output.vertexColor_0 = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    output.globalFragmentSlotIndex = globalVertexData.globalFragmentSlotIndex;

    output.vertexTangent = vec4<f32>(worldTangentX, inputData.vertexTangent.w);

    #redgpu_if receiveShadow
    {
        output.shadowCoord = getShadowCoord(position.xyz, systemUniforms.directionalLightProjectionViewMatrix);
        output.receiveShadow = globalVertexData.receiveShadow;
    }
    #redgpu_endIf

    {
        output.currentClipPos = su_projection.noneJitterProjectionViewMatrix * position;
        output.prevClipPos = su_projection.prevNoneJitterProjectionViewMatrix * gu_prevModelMatrix * worldPos;
    }

    let nodeScaleX = length(gu_localMatrix[0].xyz);
    let nodeScaleY = length(gu_localMatrix[1].xyz);
    let nodeScaleZ = length(gu_localMatrix[2].xyz);

    output.localNodeScale_volumeScale = vec2<f32>(
        pow(nodeScaleX * nodeScaleY * nodeScaleZ, 1.0 / 3.0),
        pow(modelScaleX * modelScaleY * modelScaleZ, 1.0 / 3.0)
    );

    return output;
}