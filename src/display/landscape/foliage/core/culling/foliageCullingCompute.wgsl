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
    maxShadowCascadeIndex: u32,
    invFadeRange: f32,
    lods: array<FoliageLODUniformInfo, 8>,
};

struct CascadeCullingInfo {
    maxDistance: f32,
    hasShadow: u32,
    pad0: u32,
    pad1: u32,
    frustumPlanes: array<vec4<f32>, 6>,
};

struct UnifiedGlobalCullingUniforms {
    cameraPosition: vec3<f32>,
    totalInstanceCount: u32,
    invWorldSizeX: f32,
    heightScale: f32,
    hasVHT: u32,
    fovFactor: f32,
    maxSubMeshes: u32,
    maxTotalInstances8: u32,
    activeCascadeCount: u32,
    padHZB: u32,
    viewportHeight: f32,
    pad2: u32,
    mainFrustumPlanes: array<vec4<f32>, 6>,
    cascades: array<CascadeCullingInfo, 4>,
    mainProjectionViewMatrix: mat4x4<f32>,
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

struct DrawIndexedIndirectArgs {
    indexCount: u32,
    instanceCount: atomic<u32>,
    firstIndex: u32,
    baseVertex: u32,
    firstInstance: u32,
};

@group(0) @binding(0) var<storage, read> rawInstanceBuffer: array<FoliageInstanceData>;
@group(0) @binding(1) var<uniform> globalUniforms: UnifiedGlobalCullingUniforms;
@group(0) @binding(2) var<storage, read> typeParams: array<FoliageTypeParam>;
@group(0) @binding(3) var<storage, read_write> mainCulledInstanceBuffer: array<FoliageInstanceData>;
@group(0) @binding(4) var<storage, read_write> mainIndirectDrawCommands: array<DrawIndexedIndirectArgs>;
@group(0) @binding(5) var<storage, read_write> shadowCulledInstanceBuffer: array<FoliageInstanceData>;
@group(0) @binding(6) var<storage, read_write> shadowIndirectDrawCommands: array<DrawIndexedIndirectArgs>;
@group(0) @binding(7) var vhtTexture: texture_2d<f32>;
@group(0) @binding(8) var vhtSampler: sampler;

@compute @workgroup_size(64)
fn main(
    @builtin(global_invocation_id) global_id: vec3<u32>
) {
    let idx = global_id.x;
    if (idx >= globalUniforms.totalInstanceCount) {
        return;
    }

    var instance = rawInstanceBuffer[idx];
    let typeIdx = u32(instance.fadeOrType);
    if (typeIdx >= 64u) {
        return;
    }

    let typeInfo = typeParams[typeIdx];
    if (typeInfo.activeCount == 0u || idx < typeInfo.rawBaseOffset) {
        return;
    }

    let localSlotIdx = idx - typeInfo.rawBaseOffset;
    if (localSlotIdx >= typeInfo.activeCount) {
        return;
    }

    let camPos = globalUniforms.cameraPosition;
    let dx = instance.posX - camPos.x;
    let dz = instance.posZ - camPos.z;
    let horizontalDistSq = dx * dx + dz * dz;

    let cullingDist = typeInfo.cullingDistance;
    let effectiveCullingDistSq = cullingDist * cullingDist;

    // 수평 거리 1차 조기 탈출
    if (horizontalDistSq >= effectiveCullingDistSq) {
        return;
    }

    let scaleXZ = unpack2x16float(instance.packedScaleXZ);
    let scaleX = scaleXZ.x;
    let scaleZ = scaleXZ.y;
    let scaleY = instance.scaleY;

    var realY = instance.posY - typeInfo.bottomOffset;
    if (globalUniforms.hasVHT != 0u && globalUniforms.invWorldSizeX > 0.0) {
        let u = instance.posX * globalUniforms.invWorldSizeX + 0.5;
        let v = instance.posZ * globalUniforms.invWorldSizeX + 0.5;
        if (u >= 0.0 && u <= 1.0 && v >= 0.0 && v <= 1.0) {
            let sampledHeightNorm = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, v), 0.0).r;
            let terrainHeight = sampledHeightNorm * globalUniforms.heightScale;
            realY = terrainHeight - typeInfo.bottomOffset;
        }
    }

    let dy = realY - camPos.y;
    let distSq = horizontalDistSq + dy * dy;
    if (distSq >= effectiveCullingDistSq) {
        return;
    }

    let dist = sqrt(distSq);
    let effectiveDist = dist * max(globalUniforms.fovFactor, 0.0001);

    let maxScale = max(max(scaleX, scaleY), scaleZ);
    let scaledRadius = typeInfo.boundingRadius * maxScale;
    let spherePos = vec4<f32>(instance.posX, realY, instance.posZ, 1.0);
    let r = -scaledRadius;

    let numLODs = typeInfo.lodCount;
    let hasInfiniteImpostor = (numLODs > 0u && typeInfo.lods[numLODs - 1u].exitEnd >= 100000.0);

    // 1. 메인 패스 절두체 컬링 & LOD 기록
    var inMainFrustum =
        dot(spherePos, globalUniforms.mainFrustumPlanes[0]) >= r &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[1]) >= r &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[2]) >= r &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[3]) >= r &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[4]) >= r &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[5]) >= r;

    if (inMainFrustum) {
        let vpHeight = select(1080.0, globalUniforms.viewportHeight, globalUniforms.viewportHeight > 0.0);
        let screenPixelDiameter = (scaledRadius * vpHeight) / max(effectiveDist, 0.001);
        if (screenPixelDiameter < 2.0) {
            inMainFrustum = false;
        }
    }

    if (inMainFrustum) {
        var globalFade: f32 = 1.0;
        let fadeStartDist = typeInfo.fadeStartDistance;
        if (dist > fadeStartDist) {
            globalFade = clamp(1.0 - (dist - fadeStartDist) * typeInfo.invFadeRange, 0.0, 1.0);
        }

        if (numLODs <= 1u) {
            let finalAlpha = globalFade;
            if (finalAlpha > 0.001) {
                let lodInfo = typeInfo.lods[0];
                let baseCmdIdx = typeInfo.indirectBaseOffset + lodInfo.subMeshOffset;
                let slot = atomicAdd(&mainIndirectDrawCommands[baseCmdIdx].instanceCount, 1u);

                let numSubs = lodInfo.subMeshCount;
                for (var s: u32 = 1u; s < numSubs; s = s + 1u) {
                    atomicAdd(&mainIndirectDrawCommands[baseCmdIdx + s].instanceCount, 1u);
                }

                var culledInst = instance;
                culledInst.posY = realY;
                culledInst.fadeOrType = finalAlpha;

                let outIdx = typeInfo.culledBaseOffset + slot;
                mainCulledInstanceBuffer[outIdx] = culledInst;
            }
        } else {
            for (var l: u32 = 0u; l < numLODs; l = l + 1u) {
                let lodInfo = typeInfo.lods[l];
                let isLastLOD = (l == numLODs - 1u);

                if (effectiveDist >= lodInfo.enterStart && (isLastLOD || effectiveDist <= lodInfo.exitEnd)) {
                    var alpha: f32 = 1.0;
                    if (l > 0u && effectiveDist < lodInfo.enterEnd) {
                        alpha = clamp((effectiveDist - lodInfo.enterStart) * lodInfo.invEnterRange, 0.0, 1.0);
                    } else if (!isLastLOD && effectiveDist > lodInfo.exitStart) {
                        alpha = clamp((lodInfo.exitEnd - effectiveDist) * lodInfo.invExitRange, 0.0, 1.0);
                    }

                    let finalAlpha = alpha * globalFade;
                    if (finalAlpha > 0.001) {
                        let baseCmdIdx = typeInfo.indirectBaseOffset + lodInfo.subMeshOffset;
                        let slot = atomicAdd(&mainIndirectDrawCommands[baseCmdIdx].instanceCount, 1u);

                        let numSubs = lodInfo.subMeshCount;
                        for (var s: u32 = 1u; s < numSubs; s = s + 1u) {
                            atomicAdd(&mainIndirectDrawCommands[baseCmdIdx + s].instanceCount, 1u);
                        }

                        var culledInst = instance;
                        culledInst.posY = realY;
                        culledInst.fadeOrType = finalAlpha;

                        let outIdx = typeInfo.culledBaseOffset + (l * typeInfo.maxInstances) + slot;
                        mainCulledInstanceBuffer[outIdx] = culledInst;
                    }

                    if (alpha >= 0.999 && !isLastLOD && effectiveDist < lodInfo.exitStart) {
                        break;
                    }
                }
            }
        }
    }

    // 2. 섀도우 패스 캐스케이드 컬링 & 렌더링
    let activeCascades = min(globalUniforms.activeCascadeCount, 4u);
    let maxAllowedCascade = select(0u, min(activeCascades, typeInfo.maxShadowCascadeIndex + 1u), typeInfo.maxShadowCascadeIndex <= 3u);

    for (var c: u32 = 0u; c < maxAllowedCascade; c = c + 1u) {
        if (globalUniforms.cascades[c].hasShadow == 0u) {
            continue;
        }

        let cascadeMaxDist = globalUniforms.cascades[c].maxDistance;
        let isOverlapCascade = (c < activeCascades - 1u); 
        let radiusMargin = select(scaledRadius * 2.0, scaledRadius * 4.0, isOverlapCascade);
        let shadowEffectiveDist = cascadeMaxDist + radiusMargin;
        let shadowEffectiveDistSq = shadowEffectiveDist * shadowEffectiveDist;

        if (distSq < shadowEffectiveDistSq) {
            let cascadeInfo = globalUniforms.cascades[c];
            let inShadowFrustum =
                dot(spherePos, cascadeInfo.frustumPlanes[0]) >= r &&
                dot(spherePos, cascadeInfo.frustumPlanes[1]) >= r &&
                dot(spherePos, cascadeInfo.frustumPlanes[2]) >= r &&
                dot(spherePos, cascadeInfo.frustumPlanes[3]) >= r &&
                dot(spherePos, cascadeInfo.frustumPlanes[4]) >= r &&
                dot(spherePos, cascadeInfo.frustumPlanes[5]) >= r;

            if (inShadowFrustum) {
                var targetShadowLOD: u32 = 0u;
                if (numLODs > 1u) {
                    let maxShadowLOD = select(numLODs - 1u, max(numLODs - 2u, 0u), hasInfiniteImpostor);
                    let lod0Dist = (typeInfo.lods[0].exitStart + typeInfo.lods[0].exitEnd) * 0.5;

                    if (c == 0u && effectiveDist <= lod0Dist) {
                        targetShadowLOD = 0u;
                    } else {
                        targetShadowLOD = maxShadowLOD;
                    }
                }

                let lodInfo = typeInfo.lods[targetShadowLOD];
                let cascadeIndirectOffset = c * globalUniforms.maxSubMeshes;
                let baseCmdIdx = cascadeIndirectOffset + typeInfo.indirectBaseOffset + lodInfo.subMeshOffset;
                let slot = atomicAdd(&shadowIndirectDrawCommands[baseCmdIdx].instanceCount, 1u);

                let numSubs = lodInfo.subMeshCount;
                for (var s: u32 = 1u; s < numSubs; s = s + 1u) {
                    atomicAdd(&shadowIndirectDrawCommands[baseCmdIdx + s].instanceCount, 1u);
                }

                var shadowInst = instance;
                shadowInst.posY = realY;
                shadowInst.fadeOrType = 1.0;

                let cascadeCulledOffset = c * globalUniforms.maxTotalInstances8;
                let outIdx = cascadeCulledOffset + typeInfo.culledBaseOffset + (targetShadowLOD * typeInfo.maxInstances) + slot;
                shadowCulledInstanceBuffer[outIdx] = shadowInst;
            }
        }
    }
}
