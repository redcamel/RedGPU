// ============================================================================
// RedGPU Landscape Grass Ultra-Fast GPU Culling Compute Shader
// - Zero texture sampling, Zero procedural calculations
// - Distance + Frustum 6-plane culling only
// - Updates culledInstances buffer and indirect draw indexed commands atomically
// ============================================================================

struct GrassInstance {
    posX: f32,
    posY: f32,
    posZ: f32,
    rotationY: f32,
    packedScale: u32,
    packedBounding: u32,
    packedQuat: u32,
    packedGroundColor: u32,
};


struct DrawIndexedIndirectCommand {
    indexCount: u32,
    instanceCount: atomic<u32>,
    firstIndex: u32,
    baseVertex: i32,
    firstInstance: u32,
};

struct CullUniforms {
    cameraPos: vec3<f32>,
    cullingDistanceSq: f32,
    farDistanceSq: f32,
    totalInstances: u32,
    rawBaseOffset: u32,
    culledNearBaseOffset: u32,
    culledFarBaseOffset: u32,
    nearIndirectSlot: u32,
    farIndirectSlot: u32,
    subMeshCount: u32,
    hasFarStage: u32,
    pad0: u32,
    pad1: u32,
    pad2: u32,
    frustumPlanes: array<vec4<f32>, 6>,
};

@group(0) @binding(0) var<uniform> uniforms: CullUniforms;
@group(0) @binding(1) var<storage, read> rawInstances: array<GrassInstance>;
@group(0) @binding(2) var<storage, read_write> culledInstances: array<GrassInstance>;
@group(0) @binding(3) var<storage, read_write> indirectCommands: array<DrawIndexedIndirectCommand>;

@compute @workgroup_size(64, 1, 1)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let index = globalId.x;
    if (index >= uniforms.totalInstances) {
        return;
    }

    let rawIdx = uniforms.rawBaseOffset + index;
    let inst = rawInstances[rawIdx];

    // Filter out invalid/masked instances
    if (inst.posY < -900000.0) {
        return;
    }

    let pos = vec3<f32>(inst.posX, inst.posY, inst.posZ);
    let delta = pos - uniforms.cameraPos;
    let distSq = dot(delta, delta);

    // Distance Cull
    if (distSq > uniforms.cullingDistanceSq) {
        return;
    }

    // Unpack bounding sphere (centerOffsetY, boundRadius)
    let boundData = unpack2x16float(inst.packedBounding);
    let centerOffsetY = boundData.x;
    let boundRadius = boundData.y;
    let sphereCenter = pos + vec3<f32>(0.0, centerOffsetY, 0.0);

    // Frustum 6-plane Cull
    for (var i = 0u; i < 6u; i = i + 1u) {
        let plane = uniforms.frustumPlanes[i];
        if (dot(plane.xyz, sphereCenter) + plane.w < -boundRadius) {
            return;
        }
    }

    // Stage allocation (Near vs Far)
    let isFar = uniforms.hasFarStage != 0u && distSq > uniforms.farDistanceSq;
    let targetStageSlot = select(uniforms.nearIndirectSlot, uniforms.farIndirectSlot, isFar);
    let culledBase = select(uniforms.culledNearBaseOffset, uniforms.culledFarBaseOffset, isFar);

    let writeSlot = atomicAdd(&indirectCommands[targetStageSlot].instanceCount, 1u);

    // Sync all sub-mesh draw calls for this stage
    let numSubs = max(uniforms.subMeshCount, 1u);
    for (var s = 1u; s < numSubs; s = s + 1u) {
        atomicAdd(&indirectCommands[targetStageSlot + s].instanceCount, 1u);
    }

    let culledTargetIdx = culledBase + writeSlot;
    culledInstances[culledTargetIdx] = inst;
}
