#redgpu_include landscape.struct.FoliageInstance;
#redgpu_include landscape.math.scatterColorPack;

struct BakeUniforms {
    invWorldSizeX: f32,
    invWorldSizeZ: f32,
    totalTasks: u32,
    hasVBT: u32,
};

struct BakeTask {
    instanceIndex: u32,
    typeId: u32,
};

@group(0) @binding(0) var<storage, read_write> rawInstances: array<FoliageInstance>;
@group(0) @binding(1) var<uniform> bakeUniforms: BakeUniforms;
@group(0) @binding(2) var<storage, read> bakeTasks: array<BakeTask>;
@group(0) @binding(3) var vbtTexture: texture_2d<f32>;
@group(0) @binding(4) var basicSampler: sampler;

@compute @workgroup_size(64, 1, 1)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let taskIdx = globalId.x;
    if (taskIdx >= bakeUniforms.totalTasks) {
        return;
    }

    let task = bakeTasks[taskIdx];
    let instIdx = task.instanceIndex;
    let inst = rawInstances[instIdx];

    if (bakeUniforms.invWorldSizeX <= 0.0) {
        return;
    }

    let u = inst.posX * bakeUniforms.invWorldSizeX + 0.5;
    let v = inst.posZ * bakeUniforms.invWorldSizeZ + 0.5;
    if (u < 0.0 || u > 1.0 || v < 0.0 || v > 1.0) {
        return;
    }

    var groundColor = vec3<f32>(0.2, 0.2, 0.2);
    if (bakeUniforms.hasVBT != 0u) {
        let groundTex = textureSampleLevel(vbtTexture, basicSampler, vec2<f32>(u, v), 0.0);
        if (groundTex.a > 0.05) {
            groundColor = groundTex.rgb;
        }
    }

    rawInstances[instIdx].packedGroundColorAndType = packGroundColorAndType(groundColor, task.typeId);
}
