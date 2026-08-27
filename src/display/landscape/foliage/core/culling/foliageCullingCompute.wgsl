struct FoliageLODUniformInfo {
    lodDistance: f32,
    fadeRange: f32,
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
    pad0: u32,
    pad1: u32,
    lods: array<FoliageLODUniformInfo, 8>,
};

struct GlobalCullingUniforms {
    cameraPosition: vec3<f32>,
    totalInstanceCount: u32,
    invWorldSizeX: f32,
    heightScale: f32,
    hasVHT: u32,
    fovFactor: f32,
    pad0: u32,
    pad1: u32,
    frustumPlanes: array<vec4<f32>, 6>,
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
    typeIdOrSubId: f32, // Lower 16-bit: typeId, Upper/Frac: cross-fade alpha
};

struct DrawIndexedIndirectArgs {
    indexCount: u32,
    instanceCount: atomic<u32>,
    firstIndex: u32,
    baseVertex: u32,
    firstInstance: u32,
};

@group(0) @binding(0) var<storage, read> rawInstanceBuffer: array<FoliageInstanceData>;
@group(0) @binding(1) var<uniform> globalUniforms: GlobalCullingUniforms;
@group(0) @binding(2) var<storage, read> typeParams: array<FoliageTypeParam>;
@group(0) @binding(3) var<storage, read_write> culledInstanceBuffer: array<FoliageInstanceData>;
@group(0) @binding(4) var<storage, read_write> indirectDrawCommands: array<DrawIndexedIndirectArgs>;
@group(0) @binding(5) var vhtTexture: texture_2d<f32>;
@group(0) @binding(6) var vhtSampler: sampler;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let idx = global_id.x;
    if (idx >= globalUniforms.totalInstanceCount) {
        return;
    }

    let instance = rawInstanceBuffer[idx];
    let typeIdx = u32(instance.typeIdOrSubId);
    if (typeIdx >= 64u) {
        return;
    }

    let typeInfo = typeParams[typeIdx];
    if (typeInfo.activeCount == 0u || idx < typeInfo.rawBaseOffset) {
        return;
    }

    let localSlot = idx - typeInfo.rawBaseOffset;
    if (localSlot >= typeInfo.activeCount) {
        return;
    }

    let camPos = globalUniforms.cameraPosition;
    let dx = instance.posX - camPos.x;
    let dz = instance.posZ - camPos.z;
    let horizontalDistSq = dx * dx + dz * dz;
    let cullingDist = typeInfo.cullingDistance;
    let cullingDistSq = cullingDist * cullingDist;

    let numLODs = typeInfo.lodCount;
    let hasInfiniteImpostor = (numLODs > 0u && typeInfo.lods[numLODs - 1u].lodDistance >= 100000.0);
    let effectiveCullingDistSq = select(cullingDistSq, 1000000000000.0, hasInfiniteImpostor);

    if (horizontalDistSq >= effectiveCullingDistSq) {
        return;
    }

    var realY = instance.posY;
    if (globalUniforms.hasVHT != 0u && globalUniforms.invWorldSizeX > 0.0) {
        let u = instance.posX * globalUniforms.invWorldSizeX + 0.5;
        let v = instance.posZ * globalUniforms.invWorldSizeX + 0.5;
        if (u >= 0.0 && u <= 1.0 && v >= 0.0 && v <= 1.0) {
            let sampledHeightNorm = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, v), 0.0).r;
            realY = (sampledHeightNorm * globalUniforms.heightScale) - typeInfo.bottomOffset;
        }
    }

    let dy = realY - camPos.y;
    let distSq = horizontalDistSq + dy * dy;

    if (distSq >= effectiveCullingDistSq) {
        return;
    }

    let maxScale = max(max(instance.scaleX, instance.scaleY), instance.scaleZ);
    let scaledRadius = typeInfo.boundingRadius * maxScale;
    let spherePos = vec4<f32>(instance.posX, realY, instance.posZ, 1.0);
    let r = -scaledRadius;

    let inFrustum =
        dot(spherePos, globalUniforms.frustumPlanes[0]) >= r &&
        dot(spherePos, globalUniforms.frustumPlanes[1]) >= r &&
        dot(spherePos, globalUniforms.frustumPlanes[2]) >= r &&
        dot(spherePos, globalUniforms.frustumPlanes[3]) >= r &&
        dot(spherePos, globalUniforms.frustumPlanes[4]) >= r &&
        dot(spherePos, globalUniforms.frustumPlanes[5]) >= r;

    if (!inFrustum) {
        return;
    }

    let dist = sqrt(distSq);
    let effectiveDist = dist * max(globalUniforms.fovFactor, 0.0001);

    var globalFade: f32 = 1.0;
    if (!hasInfiniteImpostor) {
        let fadeStartDist = typeInfo.fadeStartDistance;
        if (dist > fadeStartDist) {
            let fadeRange = max(cullingDist - fadeStartDist, 1.0);
            globalFade = clamp(1.0 - (dist - fadeStartDist) / fadeRange, 0.0, 1.0);
        }
    }

    var culledInst = instance;
    culledInst.posY = realY;
    culledInst.fade = globalFade;

    if (numLODs <= 1u) {
        let baseCmdIdx = typeInfo.indirectBaseOffset + typeInfo.lods[0].subMeshOffset;
        let slot = atomicAdd(&indirectDrawCommands[baseCmdIdx].instanceCount, 1u);
        let numSubs = typeInfo.lods[0].subMeshCount;
        for (var s: u32 = 1u; s < numSubs; s = s + 1u) {
            atomicAdd(&indirectDrawCommands[baseCmdIdx + s].instanceCount, 1u);
        }

        let outIdx = typeInfo.culledBaseOffset + slot;
        culledInst.typeIdOrSubId = 1.0;
        culledInstanceBuffer[outIdx] = culledInst;
    } else {
        var emitCount: u32 = 0u;
        for (var l: u32 = 0u; l < numLODs; l = l + 1u) {
            let lodInfo = typeInfo.lods[l];
            var prevDist: f32 = 0.0;
            if (l > 0u) {
                prevDist = typeInfo.lods[l - 1u].lodDistance;
            }
            let nextDist = lodInfo.lodDistance;
            let span = max(nextDist - prevDist, 5.0);
            let fadeRange = clamp(span * 0.10, 5.0, 15.0);
            let halfRange = fadeRange * 0.5;

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

                let baseCmdIdx = typeInfo.indirectBaseOffset + lodInfo.subMeshOffset;
                let slot = atomicAdd(&indirectDrawCommands[baseCmdIdx].instanceCount, 1u);
                let numSubs = lodInfo.subMeshCount;
                for (var s: u32 = 1u; s < numSubs; s = s + 1u) {
                    atomicAdd(&indirectDrawCommands[baseCmdIdx + s].instanceCount, 1u);
                }

                let outIdx = typeInfo.culledBaseOffset + (l * typeInfo.maxInstances) + slot;
                var finalEmitInst = culledInst;
                finalEmitInst.typeIdOrSubId = alpha;
                culledInstanceBuffer[outIdx] = finalEmitInst;

                emitCount = emitCount + 1u;
                if (emitCount >= 2u) {
                    break;
                }
            }
        }
    }
}
