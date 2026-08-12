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
    pad0: f32,
    pad1: vec2<f32>,
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
    
    let range = vertexUniforms.lodRanges[i32(clamp(lod, 0.0, 7.0))];
    let morphStartSq = range.x;
    let morphEndSq = range.y;
    
    if (morphEndSq <= morphStartSq) {
        return 0.0;
    }
    
    let k = clamp((distSq - morphStartSq) / (morphEndSq - morphStartSq), 0.0, 1.0);
    return k * k * (3.0 - 2.0 * k);
}

fn decodeOctahedronNormal(oct: vec2<f32>) -> vec3<f32> {
    let isZero = (oct.x == 0.0 && oct.y == 0.0);
    let f = oct * 2.0 - 1.0;
    var n = vec3<f32>(f.x, 1.0 - abs(f.x) - abs(f.y), f.y);
    let t = clamp(-n.y, 0.0, 1.0);
    n.x += select(t, -t, n.x >= 0.0);
    n.z += select(t, -t, n.z >= 0.0);
    let norm = normalize(n);
    let validNorm = select(norm, vec3<f32>(0.0, 1.0, 0.0), norm.y < 0.0);
    return select(validNorm, vec3<f32>(0.0, 1.0, 0.0), isZero);
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


    let localInstanceIndex = inputData.globalVertexSlotIndex - baseSlotIndex;
    let instanceData = instanceBuffer[localInstanceIndex];

    let localXZ = vec2<f32>(inputData.position.x, inputData.position.z);
    
    let worldXZ = instanceData.offset + localXZ * instanceData.scale;

    let isSynthesizedTile = (instanceData.lod >= 0.0);
    let actualLOD = select(-instanceData.lod - 1.0, instanceData.lod, isSynthesizedTile);

    var morphFactor = 0.0;
    let tempWorldPos = vec3<f32>(worldXZ.x, 0.0, worldXZ.y);
    morphFactor = calculateMorphFactor(tempWorldPos, actualLOD);

    let gridDim = vertexUniforms.verticesPerSide - 1.0;
    let gridPos = inputData.uv * gridDim;
    let gridIdx = floor(gridPos + 0.5);

    let clampGridIdx = min(floor(gridIdx * 0.5) * 2.0, vec2<f32>(gridDim));
    let parentGridIdx = vec2<f32>(
        select(clampGridIdx.x, gridDim, gridIdx.x >= gridDim - 0.1),
        select(clampGridIdx.y, gridDim, gridIdx.y >= gridDim - 0.1)
    );

    let parentUV = parentGridIdx / gridDim;
    let parentLocalXZ = parentUV - vec2<f32>(0.5);
    let parentWorldXZ = instanceData.offset + parentLocalXZ * instanceData.scale;

    // Branchless interpolation based on morphFactor
    let finalWorldXZ = mix(worldXZ, parentWorldXZ, morphFactor);

    let rawWorldUV = (finalWorldXZ - vertexUniforms.worldOffset) / vertexUniforms.worldSize;
    let worldUV = vec2<f32>(rawWorldUV.x, 1.0 - rawWorldUV.y);

    var computedNormal = vec3<f32>(0.0, 1.0, 0.0);
    var worldTangentX  = vec3<f32>(1.0, 0.0, 0.0);
    var sampledHeight  = 0.0;

    #redgpu_if heightmapAtlasTexture
        if (isSynthesizedTile) {
            let texSize   = vec2<f32>(textureDimensions(heightmapAtlasTexture, 0));
            let texelSize = 1.0 / texSize;
            let halfTexel = 0.5 * texelSize;

            let clampedWorldUV = clamp(worldUV, halfTexel, vec2<f32>(1.0) - halfTexel);

            let sampledData0 = textureSampleLevel(heightmapAtlasTexture, heightmapSampler, clampedWorldUV, 0.0);

            sampledHeight   = sampledData0.r;
            var localNormal = decodeOctahedronNormal(sampledData0.gb);

            if (dot(localNormal, localNormal) < 0.0001) {
                localNormal = vec3<f32>(0.0, 1.0, 0.0);
            }

            let worldNormal = normalize((gu_normalModelMatrix * vec4<f32>(localNormal, 0.0)).xyz);
            
            let worldTangent = normalize(gu_modelMatrix[0].xyz);
            let orthogonalTangent = normalize(worldTangent - dot(worldTangent, worldNormal) * worldNormal);

            computedNormal = worldNormal;
            worldTangentX  = orthogonalTangent;
        } else {
            sampledHeight = 0.0;
            computedNormal = normalize((gu_normalModelMatrix * vec4<f32>(vec3<f32>(0.0, 1.0, 0.0), 0.0)).xyz);
            worldTangentX  = normalize((gu_modelMatrix * vec4<f32>(vec3<f32>(1.0, 0.0, 0.0), 0.0)).xyz);
        }
    #redgpu_else
        computedNormal = normalize((gu_normalModelMatrix * vec4<f32>(inputData.vertexNormal, 0.0)).xyz);
        worldTangentX  = normalize((gu_modelMatrix * vec4<f32>(inputData.vertexTangent.xyz, 0.0)).xyz);
    #redgpu_endIf

    let heightRange = vertexUniforms.maxHeight - vertexUniforms.minHeight;
    let skirtOffset = inputData.position.y * heightRange;
    let worldY = sampledHeight * heightRange + vertexUniforms.minHeight + skirtOffset;

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
        output.shadowCoord = getShadowCoord(worldPos.xyz, systemUniforms.directionalLightProjectionViewMatrix);
        output.receiveShadow = globalVertexData.receiveShadow;
    }
    #redgpu_endIf

    {
        output.currentClipPos = su_projection.noneJitterProjectionViewMatrix * position;
        output.prevClipPos = su_projection.prevNoneJitterProjectionViewMatrix * gu_prevModelMatrix * worldPos;
    }

    // Volume scale calculation optimization (removing 6x vector length & 2x pow 1/3 per vertex)
    let nodeVolumeScale  = length(gu_localMatrix[0].xyz);
    let modelVolumeScale = length(gu_modelMatrix[0].xyz);

    output.localNodeScale_volumeScale = vec2<f32>(nodeVolumeScale, modelVolumeScale);

    return output;
}