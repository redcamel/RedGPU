struct FoliageLODUniformInfo {
    lodDistance: f32,
    fadeRange: f32,
    subMeshOffset: u32,
    subMeshCount: u32,
};

struct CullingUniforms {
    cameraPosition: vec3<f32>,
    cullingDistance: f32,
    fadeStartDistance: f32,
    instanceCount: u32,
    boundingRadius: f32,
    invWorldSizeX: f32,
    heightScale: f32,
    bottomOffset: f32,
    hasVHT: u32,
    lodCount: u32,
    maxInstances: u32,
    fovFactor: f32,
    pad0: u32,
    pad1: u32,
    frustumPlanes: array<vec4<f32>, 6>,
    lods: array<FoliageLODUniformInfo, 8>,
};

struct FoliageInstanceData {
    posX: f32,
    posY: f32,
    posZ: f32,
    rotX: f32,
    rotY: f32,
    rotZ: f32,
    rotW: f32,
    scaleX: f32,
    scaleY: f32,
    scaleZ: f32,
    fade: f32,
    subId: f32,
};

struct DrawIndexedIndirectArgs {
    indexCount: u32,
    instanceCount: atomic<u32>,
    firstIndex: u32,
    baseVertex: u32,
    firstInstance: u32,
};

@group(0) @binding(0) var<storage, read> rawInstanceBuffer: array<FoliageInstanceData>;
@group(0) @binding(1) var<uniform> cullingUniforms: CullingUniforms;
@group(0) @binding(2) var<storage, read_write> culledInstanceBuffer: array<FoliageInstanceData>;
@group(0) @binding(3) var<storage, read_write> indirectDrawCommands: array<DrawIndexedIndirectArgs>;
@group(0) @binding(4) var vhtTexture: texture_2d<f32>;
@group(0) @binding(5) var vhtSampler: sampler;

var<workgroup> wgLODCounts: array<atomic<u32>, 8>;
var<workgroup> wgGlobalOffsets: array<u32, 8>;
var<workgroup> wgLocalSlots: array<atomic<u32>, 8>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>, @builtin(local_invocation_id) local_id: vec3<u32>) {
    let localIdx = local_id.x;
    if (localIdx < 8u) {
        atomicStore(&wgLODCounts[localIdx], 0u);
        atomicStore(&wgLocalSlots[localIdx], 0u);
    }

    workgroupBarrier();

    let idx = global_id.x;
    var activeEmitCount: u32 = 0u;
    var emitLODIndices: array<u32, 2>;
    var emitLODAlphas: array<f32, 2>;
    var culledInstance: FoliageInstanceData;

    if (idx < cullingUniforms.instanceCount) {
        let instance = rawInstanceBuffer[idx];
        let camPos = cullingUniforms.cameraPosition;

        let dx = instance.posX - camPos.x;
        let dz = instance.posZ - camPos.z;
        let horizontalDistSq = dx * dx + dz * dz;
        let cullingDist = cullingUniforms.cullingDistance;
        let cullingDistSq = cullingDist * cullingDist;

        let numLODs = cullingUniforms.lodCount;
        let hasInfiniteBillboard = (numLODs > 0u && cullingUniforms.lods[numLODs - 1u].lodDistance >= 100000.0);
        let effectiveCullingDistSq = select(cullingDistSq, 1000000000000.0, hasInfiniteBillboard);

        if (horizontalDistSq < effectiveCullingDistSq) {
            var realY = instance.posY;
            if (cullingUniforms.hasVHT != 0u && cullingUniforms.invWorldSizeX > 0.0) {
                let u = instance.posX * cullingUniforms.invWorldSizeX + 0.5;
                let v = instance.posZ * cullingUniforms.invWorldSizeX + 0.5;
                if (u >= 0.0 && u <= 1.0 && v >= 0.0 && v <= 1.0) {
                    let sampledHeightNorm = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, v), 0.0).r;
                    realY = (sampledHeightNorm * cullingUniforms.heightScale) - cullingUniforms.bottomOffset;
                }
            }

            let dy = realY - camPos.y;
            let distSq = horizontalDistSq + dy * dy;

            if (distSq < effectiveCullingDistSq) {
                let maxScale = max(max(instance.scaleX, instance.scaleY), instance.scaleZ);
                let scaledRadius = cullingUniforms.boundingRadius * maxScale;
                let spherePos = vec4<f32>(instance.posX, realY, instance.posZ, 1.0);
                let r = -scaledRadius;

                let inFrustum =
                    dot(spherePos, cullingUniforms.frustumPlanes[0]) >= r &&
                    dot(spherePos, cullingUniforms.frustumPlanes[1]) >= r &&
                    dot(spherePos, cullingUniforms.frustumPlanes[2]) >= r &&
                    dot(spherePos, cullingUniforms.frustumPlanes[3]) >= r &&
                    dot(spherePos, cullingUniforms.frustumPlanes[4]) >= r &&
                    dot(spherePos, cullingUniforms.frustumPlanes[5]) >= r;

                if (inFrustum) {
                    let dist = sqrt(distSq);
                    let effectiveDist = dist * max(cullingUniforms.fovFactor, 0.0001);

                    var globalFade: f32 = 1.0;
                    if (!hasInfiniteBillboard) {
                        let fadeStartDist = cullingUniforms.fadeStartDistance;
                        if (dist > fadeStartDist) {
                            let fadeRange = max(cullingDist - fadeStartDist, 1.0);
                            globalFade = clamp(1.0 - (dist - fadeStartDist) / fadeRange, 0.0, 1.0);
                        }
                    }

                    culledInstance = instance;
                    culledInstance.posY = realY;
                    culledInstance.fade = globalFade;

                    if (numLODs <= 1u) {
                        emitLODIndices[0] = 0u;
                        emitLODAlphas[0] = 1.0;
                        activeEmitCount = 1u;
                        atomicAdd(&wgLODCounts[0], 1u);
                    } else {
                        for (var l: u32 = 0u; l < numLODs; l = l + 1u) {
                            let lodInfo = cullingUniforms.lods[l];
                            var prevDist: f32 = 0.0;
                            if (l > 0u) {
                                prevDist = cullingUniforms.lods[l - 1u].lodDistance;
                            }
                            let nextDist = lodInfo.lodDistance;
                            let halfRange = lodInfo.fadeRange * 0.5;

                            let enterStart = max(prevDist - halfRange, 0.0);
                            let enterEnd = prevDist + halfRange;
                            let exitStart = nextDist - halfRange;
                            let exitEnd = nextDist + halfRange;

                            let isLastLOD = (l == numLODs - 1u);
                            if (effectiveDist >= enterStart && (isLastLOD || effectiveDist <= exitEnd)) {
                                var alpha: f32 = 1.0;
                                if (l > 0u && effectiveDist < enterEnd) {
                                    alpha = clamp((effectiveDist - enterStart) / max(enterEnd - enterStart, 0.001), 0.0, 1.0);
                                } else if (!isLastLOD && effectiveDist > exitStart) {
                                    alpha = clamp((exitEnd - effectiveDist) / max(exitEnd - exitStart, 0.001), 0.0, 1.0);
                                }

                                emitLODIndices[activeEmitCount] = l;
                                emitLODAlphas[activeEmitCount] = alpha;
                                activeEmitCount = activeEmitCount + 1u;
                                atomicAdd(&wgLODCounts[l], 1u);

                                if (activeEmitCount >= 2u) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    workgroupBarrier();

    if (localIdx < 8u) {
        let count = atomicLoad(&wgLODCounts[localIdx]);
        if (count > 0u && localIdx < cullingUniforms.lodCount) {
            let lodInfo = cullingUniforms.lods[localIdx];
            let baseCmdIdx = lodInfo.subMeshOffset;
            let offset = atomicAdd(&indirectDrawCommands[baseCmdIdx].instanceCount, count);
            wgGlobalOffsets[localIdx] = offset;

            let numSubs = lodInfo.subMeshCount;
            for (var s: u32 = 1u; s < numSubs; s = s + 1u) {
                atomicAdd(&indirectDrawCommands[baseCmdIdx + s].instanceCount, count);
            }
        }
    }

    workgroupBarrier();

    for (var e: u32 = 0u; e < activeEmitCount; e = e + 1u) {
        let lodIdx = emitLODIndices[e];
        let lodAlpha = emitLODAlphas[e];
        let slot = atomicAdd(&wgLocalSlots[lodIdx], 1u);
        let globalSlot = wgGlobalOffsets[lodIdx] + slot;

        let maxInsts = cullingUniforms.maxInstances;
        let outIdx = lodIdx * maxInsts + globalSlot;

        var finalInst = culledInstance;
        finalInst.subId = lodAlpha; // Store LOD alpha for Dithered Cross-Fade in subId
        culledInstanceBuffer[outIdx] = finalInst;
    }
}
