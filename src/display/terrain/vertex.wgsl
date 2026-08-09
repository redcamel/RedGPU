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
    verticesPerSide: f32,
    pad0: vec3<f32>,
    lodRanges: array<vec4<f32>, 8>,
}
@group(1) @binding(0) var<uniform> vertexUniforms: TerrainUniforms;

@group(1) @binding(1) var heightmapSampler: sampler;
@group(1) @binding(2) var heightmapAtlasTexture: texture_2d<f32>;

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

fn calculateMorphFactor(worldPos: vec3<f32>, lod: f32) -> f32 {
    let diff = systemUniforms.camera.cameraPosition.xz - worldPos.xz;
    let distSq = dot(diff, diff);
    
    let range = vertexUniforms.lodRanges[i32(lod)];
    let morphStartSq = range.x;
    let morphEndSq = range.y;
    
    let k = (distSq - morphStartSq) / (morphEndSq - morphStartSq);
    return clamp(k, 0.0, 1.0);
}

@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;

    let baseSlotIndex = u32(vertexUniforms.baseSlotIndex);
    let globalVertexData = globalVertexSSBO[baseSlotIndex];
    let su_projection = systemUniforms.projection;

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

    let localXZ = vec2<f32>(inputData.position.x, inputData.position.z);
    
    let worldXZ = instanceData.offset + localXZ * instanceData.scale;

    var morphFactor = 0.0;
    let tempWorldPos = vec3<f32>(worldXZ.x, 0.0, worldXZ.y);
    morphFactor = calculateMorphFactor(tempWorldPos, instanceData.lod);

    let gridDim = vertexUniforms.verticesPerSide - 1.0;
    let gridPos = inputData.uv * gridDim;
    let gridIdx = floor(gridPos + 0.5);

    var parentGridIdx = floor(gridIdx * 0.5) * 2.0;
    if (gridIdx.x >= gridDim - 0.1) {
        parentGridIdx.x = gridDim;
    }
    if (gridIdx.y >= gridDim - 0.1) {
        parentGridIdx.y = gridDim;
    }

    let parentUV = parentGridIdx / gridDim;
    let parentLocalXZ = parentUV - vec2<f32>(0.5);
    let parentWorldXZ = instanceData.offset + parentLocalXZ * instanceData.scale;

    let finalWorldXZ = mix(worldXZ, parentWorldXZ, morphFactor);
    let finalUV = mix(inputData.uv, parentUV, morphFactor);
    let rawWorldUV = (finalWorldXZ - vertexUniforms.worldOffset) / vertexUniforms.worldSize;
    let worldUV = vec2<f32>(rawWorldUV.x, 1.0 - rawWorldUV.y);

    var computedNormal = vec3<f32>(0.0, 1.0, 0.0);
    var worldTangentX = vec3<f32>(1.0, 0.0, 0.0);
    var sampledHeight = 0.0;

    #redgpu_if heightmapAtlasTexture
        let texSize  = vec2<f32>(textureDimensions(heightmapAtlasTexture, 0));
        let texelSize = 1.0 / texSize;
        let halfTexel = 0.5 * texelSize;

        let rawParentWorldUV = (parentWorldXZ - vertexUniforms.worldOffset) / vertexUniforms.worldSize;
        let parentWorldUV = vec2<f32>(rawParentWorldUV.x, 1.0 - rawParentWorldUV.y);

        let clampedWorldUV = clamp(worldUV, halfTexel, vec2<f32>(1.0) - halfTexel);
        let clampedParentUV = clamp(parentWorldUV, halfTexel, vec2<f32>(1.0) - halfTexel);

        // 높이와 미리 구워진 노멀 벡터를 한 번에 획득 (RGBA 채널)
        let sampledData0 = textureSampleLevel(heightmapAtlasTexture, heightmapSampler, clampedWorldUV, 0.0);
        let sampledData1 = textureSampleLevel(heightmapAtlasTexture, heightmapSampler, clampedParentUV, 0.0);

        let h0 = sampledData0.r;
        var normal0 = sampledData0.gba;

        let h1 = sampledData1.r;
        var normal1 = sampledData1.gba;

        // 노멀 값이 아직 업데이트되지 않은 경우(길이가 0) 하늘 방향인 vec3(0, 1, 0)으로 폴백
        if (length(normal0) < 0.01) {
            normal0 = vec3<f32>(0.0, 1.0, 0.0);
        }
        if (length(normal1) < 0.01) {
            normal1 = vec3<f32>(0.0, 1.0, 0.0);
        }

        sampledHeight = mix(h0, h1, morphFactor);
        let localNormal = mix(normal0, normal1, morphFactor);

        let worldNormal = normalize((gu_normalModelMatrix * vec4<f32>(localNormal, 0.0)).xyz);
        
        // 가상 경사면의 기본 탄젠트 방향
        let localTangentX = vec3<f32>(1.0, 0.0, 0.0);
        let worldTangent = normalize((gu_modelMatrix * vec4<f32>(localTangentX, 0.0)).xyz);
        let orthogonalTangent = normalize(worldTangent - dot(worldTangent, worldNormal) * worldNormal);

        computedNormal = worldNormal;
        worldTangentX = orthogonalTangent;
    #redgpu_else
        computedNormal = normalize((gu_normalModelMatrix * vec4<f32>(inputData.vertexNormal, 0.0)).xyz);
        worldTangentX = normalize((gu_modelMatrix * vec4<f32>(inputData.vertexTangent.xyz, 0.0)).xyz);
    #redgpu_endIf

    let worldY = sampledHeight * (vertexUniforms.maxHeight - vertexUniforms.minHeight) + vertexUniforms.minHeight;

    let worldPos = vec4<f32>(finalWorldXZ.x, worldY, finalWorldXZ.y, 1.0);
    let position = gu_modelMatrix * worldPos;

    output.position = su_projectionViewMatrix * position;
    output.vertexPosition = position.xyz;

    output.vertexNormal = computedNormal;
    output.vertexTangent = vec4<f32>(worldTangentX, inputData.vertexTangent.w);

    output.uv = worldUV;
    output.uv1 = worldUV;
    output.vertexColor_0 = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    output.globalFragmentSlotIndex = globalVertexData.globalFragmentSlotIndex;

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