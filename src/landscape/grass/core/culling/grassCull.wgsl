// ============================================================================
// RedGPU Landscape Grass Ultra-Fast GPU Culling Compute Shader
// - Single-pass unified dispatch across all registered grass types
// - Zero texture sampling, Zero procedural calculations
// - Distance + Frustum 6-plane culling only
// - Updates culledInstances buffer and indirect draw indexed commands atomically
// ============================================================================

#redgpu_include landscape.struct.GrassInstance;
#redgpu_include landscape.struct.GrassTypeParam;

struct DrawIndexedIndirectCommand {
    indexCount: u32,
    instanceCount: atomic<u32>,
    firstIndex: u32,
    baseVertex: i32,
    firstInstance: u32,
};

struct GlobalCullUniforms {
    cameraPos: vec3<f32>,
    totalInstanceCount: u32,
    frustumPlanes: array<vec4<f32>, 6>,
};

@group(0) @binding(0) var<uniform> uniforms: GlobalCullUniforms;
@group(0) @binding(1) var<storage, read> rawInstances: array<GrassInstance>;
@group(0) @binding(2) var<storage, read_write> culledInstances: array<GrassInstance>;
@group(0) @binding(3) var<storage, read_write> indirectCommands: array<DrawIndexedIndirectCommand>;

struct GrassTypeParamsBlock {
    types: array<GrassTypeParam, 64>,
};
@group(0) @binding(4) var<uniform> typeParamsBlock: GrassTypeParamsBlock;

@compute @workgroup_size(64, 1, 1)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let index = globalId.x;
    if (index >= uniforms.totalInstanceCount) {
        return;
    }

    let inst = rawInstances[index];

    // Filter out invalid/masked instances
    if (inst.posY < -900000.0) {
        return;
    }

    // Extract typeId from upper 8 bits of packedGroundColor
    let typeIdx = (inst.packedGroundColor >> 24u) & 0xFFu;
    if (typeIdx >= 64u) {
        return;
    }

    let typeInfo = typeParamsBlock.types[typeIdx];
    if (typeInfo.instanceCount == 0u || index < typeInfo.rawBaseOffset) {
        return;
    }

    let localSlotIdx = index - typeInfo.rawBaseOffset;
    if (localSlotIdx >= typeInfo.instanceCount) {
        return;
    }

    let pos = vec3<f32>(inst.posX, inst.posY, inst.posZ);
    let delta = pos - uniforms.cameraPos;
    let distSq = dot(delta, delta);

    // Distance Cull
    if (distSq > typeInfo.cullingDistanceSq) {
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
    let isFar = typeInfo.hasFarStage != 0u && distSq > typeInfo.farDistanceSq;
    let targetStageSlot = select(typeInfo.nearIndirectSlot, typeInfo.farIndirectSlot, isFar);
    let culledBase = select(typeInfo.culledNearBaseOffset, typeInfo.culledFarBaseOffset, isFar);

    let writeSlot = atomicAdd(&indirectCommands[targetStageSlot].instanceCount, 1u);
    if (writeSlot >= typeInfo.maxInstances) {
        atomicSub(&indirectCommands[targetStageSlot].instanceCount, 1u);
        return;
    }

    // Sync all sub-mesh draw calls for this stage
    let numSubs = max(typeInfo.subMeshCount, 1u);
    for (var s = 1u; s < numSubs; s = s + 1u) {
        atomicAdd(&indirectCommands[targetStageSlot + s].instanceCount, 1u);
    }

    let culledTargetIdx = culledBase + writeSlot;
    culledInstances[culledTargetIdx] = inst;
}
