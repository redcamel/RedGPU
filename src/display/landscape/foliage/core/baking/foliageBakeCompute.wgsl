struct FoliageLODUniformInfo {
    enterStart: f32,
    enterEnd: f32,
    exitStart: f32,
    exitEnd: f32,
    invEnterRange: f32,
    invExitRange: f32,
    subMeshOffset: u32,
    subMeshCount: u32,
};

struct FoliageTypeParam {
    cullingDistance: f32,
    fadeStartDistance: f32,
    boundingRadius: f32,
    bottomOffset: f32,
    lodCount: u32,
    maxInstances: u32,
    culledBaseOffset: u32,
    indirectBaseOffset: u32,
    rawBaseOffset: u32,
    activeCount: u32,
    maxShadowDistance: f32,
    invFadeRange: f32,
    lods: array<FoliageLODUniformInfo, 8>,
};

struct FoliageInstanceData {
    posX: f32,
    posY: f32,
    posZ: f32,
    scaleY: f32,
    packedRotXY: u32,
    packedRotZW: u32,
    packedScaleXZ: u32,
    fadeOrType: f32,
};

struct BakeUniforms {
    invWorldSizeX: f32,
    invWorldSizeZ: f32,
    heightScale: f32,
    totalTasks: u32,
};

struct BakeTask {
    instanceIndex: u32,
    typeId: u32,
};

@group(0) @binding(0) var<storage, read_write> rawInstances: array<FoliageInstanceData>;
@group(0) @binding(1) var<uniform> bakeUniforms: BakeUniforms;
@group(0) @binding(2) var<storage, read> typeParams: array<FoliageTypeParam>;
@group(0) @binding(3) var<storage, read> bakeTasks: array<BakeTask>;
@group(0) @binding(4) var vhtTexture: texture_2d<f32>;
@group(0) @binding(5) var vhtSampler: sampler;

@compute @workgroup_size(64, 1, 1)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let taskIdx = globalId.x;
    if (taskIdx >= bakeUniforms.totalTasks) {
        return;
    }

    let task = bakeTasks[taskIdx];
    let instIdx = task.instanceIndex;
    let typeInfo = typeParams[task.typeId];
    let inst = rawInstances[instIdx];

    if (bakeUniforms.invWorldSizeX <= 0.0) {
        return;
    }

    let u = inst.posX * bakeUniforms.invWorldSizeX + 0.5;
    let v = inst.posZ * bakeUniforms.invWorldSizeZ + 0.5;
    if (u < 0.0 || u > 1.0 || v < 0.0 || v > 1.0) {
        return;
    }

    let sampledHeightNorm = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, v), 0.0).r;
    let terrainHeight = sampledHeightNorm * bakeUniforms.heightScale;
    let effectiveBottomOffset = typeInfo.bottomOffset * inst.scaleY;

    rawInstances[instIdx].posY = terrainHeight + effectiveBottomOffset;
}
