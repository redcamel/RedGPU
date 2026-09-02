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
    pad0: u32,
    pad1: u32,
    mainFrustumPlanes: array<vec4<f32>, 6>,
    cascades: array<CascadeCullingInfo, 4>,
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
@group(0) @binding(1) var<uniform> globalUniforms: UnifiedGlobalCullingUniforms;
@group(0) @binding(2) var<storage, read> typeParams: array<FoliageTypeParam>;
@group(0) @binding(3) var<storage, read_write> mainCulledInstanceBuffer: array<FoliageInstanceData>;
@group(0) @binding(4) var<storage, read_write> mainIndirectDrawCommands: array<DrawIndexedIndirectArgs>;
@group(0) @binding(5) var<storage, read_write> shadowCulledInstanceBuffer: array<FoliageInstanceData>;
@group(0) @binding(6) var<storage, read_write> shadowIndirectDrawCommands: array<DrawIndexedIndirectArgs>;
@group(0) @binding(7) var vhtTexture: texture_2d<f32>;
@group(0) @binding(8) var vhtSampler: sampler;

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

    // 🌿 1. 지형 높이 VHT 텍스처 바이리니어 샘플링 (전체 뷰 통틀어 단 1회 고속 실행)
    var realY = instance.posY;
    if (globalUniforms.hasVHT != 0u && globalUniforms.invWorldSizeX > 0.0) {
        let u = instance.posX * globalUniforms.invWorldSizeX + 0.5;
        let v = instance.posZ * globalUniforms.invWorldSizeX + 0.5;
        if (u >= 0.0 && u <= 1.0 && v >= 0.0 && v <= 1.0) {
            let sampledHeightNorm = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, v), 0.0).r;
            let terrainHeight = sampledHeightNorm * globalUniforms.heightScale;

            // 🌿 경사도 기반 자동 안착 깊이 보정 (Slope-Adaptive Ground Sink)
            let maxXZScale = max(instance.scaleX, instance.scaleZ);
            let trunkRadius = max(typeInfo.boundingRadius * 0.18 * maxXZScale, 0.25);
            let deltaUV = trunkRadius * globalUniforms.invWorldSizeX;

            let uL = max(u - deltaUV, 0.0);
            let uR = min(u + deltaUV, 1.0);
            let vD = max(v - deltaUV, 0.0);
            let vU = min(v + deltaUV, 1.0);

            let hL = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(uL, v), 0.0).r * globalUniforms.heightScale;
            let hR = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(uR, v), 0.0).r * globalUniforms.heightScale;
            let hD = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, vD), 0.0).r * globalUniforms.heightScale;
            let hU = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, vU), 0.0).r * globalUniforms.heightScale;

            let slopeX = abs(hR - hL);
            let slopeZ = abs(hU - hD);
            let slopeSink = max(slopeX, slopeZ) * 0.5;

            realY = terrainHeight - (typeInfo.bottomOffset + slopeSink);
        }
    }

    let dy = realY - camPos.y;
    let distSq = horizontalDistSq + dy * dy;
    let dist = sqrt(distSq);
    let effectiveDist = dist * max(globalUniforms.fovFactor, 0.0001);

    let maxScale = max(max(instance.scaleX, instance.scaleY), instance.scaleZ);
    let scaledRadius = typeInfo.boundingRadius * maxScale;
    let spherePos = vec4<f32>(instance.posX, realY, instance.posZ, 1.0);
    let r = -scaledRadius;

    // =========================================================================
    // 🌟 2. 메인 카메라 뷰 (Main View) Culling 및 버퍼 기록
    // =========================================================================
    let inMainFrustum =
        (distSq < effectiveCullingDistSq) &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[0]) >= r &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[1]) >= r &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[2]) >= r &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[3]) >= r &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[4]) >= r &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[5]) >= r;

    if (inMainFrustum) {
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
            let slot = atomicAdd(&mainIndirectDrawCommands[baseCmdIdx].instanceCount, 1u);
            let numSubs = typeInfo.lods[0].subMeshCount;
            for (var s: u32 = 1u; s < numSubs; s = s + 1u) {
                atomicAdd(&mainIndirectDrawCommands[baseCmdIdx + s].instanceCount, 1u);
            }

            let outIdx = typeInfo.culledBaseOffset + slot;
            culledInst.typeIdOrSubId = 1.0;
            mainCulledInstanceBuffer[outIdx] = culledInst;
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
                    let slot = atomicAdd(&mainIndirectDrawCommands[baseCmdIdx].instanceCount, 1u);
                    let numSubs = lodInfo.subMeshCount;
                    for (var s: u32 = 1u; s < numSubs; s = s + 1u) {
                        atomicAdd(&mainIndirectDrawCommands[baseCmdIdx + s].instanceCount, 1u);
                    }

                    let outIdx = typeInfo.culledBaseOffset + (l * typeInfo.maxInstances) + slot;
                    var finalEmitInst = culledInst;
                    finalEmitInst.typeIdOrSubId = alpha;
                    mainCulledInstanceBuffer[outIdx] = finalEmitInst;

                    emitCount = emitCount + 1u;
                    if (emitCount >= 2u) {
                        break;
                    }
                }
            }
        }
    }

    // =========================================================================
    // 🌲 3. 섀도우 4개 캐스케이드 (Cascade 0, 1, 2, 3) 일괄 Culling 및 버퍼 기록
    // =========================================================================
    for (var c: u32 = 0u; c < 4u; c = c + 1u) {
        let cascadeInfo = globalUniforms.cascades[c];
        if (cascadeInfo.hasShadow == 0u) {
            continue;
        }

        let cascadeMaxDist = cascadeInfo.maxDistance;
        let isOverlapCascade = (c < 3u); // Cascade 0, 1, 2는 전환 오버랩 적용, Cascade 3은 최종 하드 컷오프
        let radiusMargin = select(0.0, scaledRadius, isOverlapCascade);
        let shadowEffectiveDist = cascadeMaxDist + radiusMargin;
        let shadowEffectiveDistSq = shadowEffectiveDist * shadowEffectiveDist;

        if (horizontalDistSq >= shadowEffectiveDistSq || distSq >= shadowEffectiveDistSq) {
            continue;
        }

        let inShadowFrustum =
            dot(spherePos, cascadeInfo.frustumPlanes[0]) >= r &&
            dot(spherePos, cascadeInfo.frustumPlanes[1]) >= r &&
            dot(spherePos, cascadeInfo.frustumPlanes[2]) >= r &&
            dot(spherePos, cascadeInfo.frustumPlanes[3]) >= r &&
            dot(spherePos, cascadeInfo.frustumPlanes[4]) >= r &&
            dot(spherePos, cascadeInfo.frustumPlanes[5]) >= r;

        if (!inShadowFrustum) {
            continue;
        }

        // 섀도우 패스: 단일 최적 LOD 선택
        // 🌲 Cascade 2, 3(원거리)은 고폴리곤 메쉬 대신 최종 LOD(2-트라이앵글 옥타헤드럴 임포스터)를 강제 선택!
        var selectedLOD: u32 = 0u;
        if (numLODs > 1u) {
            if (c >= 2u) {
                selectedLOD = numLODs - 1u; // 🚀 최종 옥타헤드럴 임포스터 쿼드 선택!
            } else {
                for (var l: u32 = 0u; l < numLODs; l = l + 1u) {
                    if (effectiveDist <= typeInfo.lods[l].lodDistance || l == numLODs - 1u) {
                        selectedLOD = l;
                        break;
                    }
                }
            }
        }

        let lodInfo = typeInfo.lods[selectedLOD];
        let cascadeIndirectOffset = c * globalUniforms.maxSubMeshes;
        let baseCmdIdx = cascadeIndirectOffset + typeInfo.indirectBaseOffset + lodInfo.subMeshOffset;
        let slot = atomicAdd(&shadowIndirectDrawCommands[baseCmdIdx].instanceCount, 1u);
        let numSubs = lodInfo.subMeshCount;
        for (var s: u32 = 1u; s < numSubs; s = s + 1u) {
            atomicAdd(&shadowIndirectDrawCommands[baseCmdIdx + s].instanceCount, 1u);
        }

        let cascadeCulledOffset = c * globalUniforms.maxTotalInstances8;
        let outIdx = cascadeCulledOffset + typeInfo.culledBaseOffset + (selectedLOD * typeInfo.maxInstances) + slot;
        var shadowInst = instance;
        shadowInst.posY = realY;
        shadowInst.fade = 1.0;
        shadowInst.typeIdOrSubId = 1.0;
        shadowCulledInstanceBuffer[outIdx] = shadowInst;
    }
}
