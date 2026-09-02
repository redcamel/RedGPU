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
    activeCascadeCount: u32,
    pad1: u32,
    mainFrustumPlanes: array<vec4<f32>, 6>,
    cascades: array<CascadeCullingInfo, 4>,
};

struct FoliageInstanceData {
    posX: f32,
    posY: f32,
    posZ: f32,
    scaleY: f32,
    packedRotXY: u32,
    packedRotZW: u32,
    packedScaleXZ: u32,
    fadeOrType: f32, // Raw: typeId, Culled: cross-fade alpha
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

var<workgroup> wgLocalMainSlots: array<atomic<u32>, 8>;
var<workgroup> wgGlobalMainBases: array<u32, 8>;

@compute @workgroup_size(64)
fn main(
    @builtin(global_invocation_id) global_id: vec3<u32>,
    @builtin(local_invocation_index) local_idx: u32
) {
    // 🌿 워크그룹 L1 공유 카운터 0 초기화 (0~7번 스레드가 8개 LOD 슬롯 초기화)
    if (local_idx < 8u) {
        atomicStore(&wgLocalMainSlots[local_idx], 0u);
        wgGlobalMainBases[local_idx] = 0u;
    }
    workgroupBarrier(); // ✅ Uniform Control Flow (64개 스레드 동시 동기화)

    let idx = global_id.x;
    var isValid = (idx < globalUniforms.totalInstanceCount);

    var instance = rawInstanceBuffer[min(idx, globalUniforms.totalInstanceCount - 1u)];
    let typeIdx = u32(instance.fadeOrType);
    if (typeIdx >= 64u) {
        isValid = false;
    }

    var typeInfo = typeParams[min(typeIdx, 63u)];
    if (typeInfo.activeCount == 0u || idx < typeInfo.rawBaseOffset) {
        isValid = false;
    }

    let localSlot = idx - typeInfo.rawBaseOffset;
    if (localSlot >= typeInfo.activeCount) {
        isValid = false;
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

    let scaleXZ = unpack2x16float(instance.packedScaleXZ);
    let scaleX = scaleXZ.x;
    let scaleZ = scaleXZ.y;
    let scaleY = instance.scaleY;

    // 🌿 1. 지형 높이 VHT 텍스처 바이리니어 샘플링
    var realY = instance.posY;
    if (isValid && globalUniforms.hasVHT != 0u && globalUniforms.invWorldSizeX > 0.0) {
        let u = instance.posX * globalUniforms.invWorldSizeX + 0.5;
        let v = instance.posZ * globalUniforms.invWorldSizeX + 0.5;
        if (u >= 0.0 && u <= 1.0 && v >= 0.0 && v <= 1.0) {
            let sampledHeightNorm = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, v), 0.0).r;
            let terrainHeight = sampledHeightNorm * globalUniforms.heightScale;

            let maxXZScale = max(scaleX, scaleZ);
            let trunkRadius = max(typeInfo.boundingRadius * 0.18 * maxXZScale, 0.25);
            let deltaUV = trunkRadius * globalUniforms.invWorldSizeX;

            let uL = max(u - deltaUV, 0.0);
            let uR = min(u + deltaUV, 1.0);
            let vD = max(v - deltaUV, 0.0);
            let vU = min(v + deltaUV, 1.0);

            let rawL = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(uL, v), 0.0).r;
            let rawR = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(uR, v), 0.0).r;
            let rawD = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, vD), 0.0).r;
            let rawU = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, vU), 0.0).r;

            let slopeX = abs(rawR - rawL);
            let slopeZ = abs(rawU - rawD);
            let slopeSink = max(slopeX, slopeZ) * 0.5 * globalUniforms.heightScale;

            realY = terrainHeight - (typeInfo.bottomOffset + slopeSink);
        }
    }

    let dy = realY - camPos.y;
    let distSq = horizontalDistSq + dy * dy;
    let dist = sqrt(distSq);
    let effectiveDist = dist * max(globalUniforms.fovFactor, 0.0001);

    let maxScale = max(max(scaleX, scaleY), scaleZ);
    let scaledRadius = typeInfo.boundingRadius * maxScale;
    let spherePos = vec4<f32>(instance.posX, realY, instance.posZ, 1.0);
    let r = -scaledRadius;

    // =========================================================================
    // 🌟 2. 메인 카메라 뷰 (Main View) Culling
    // =========================================================================
    let inMainFrustum = isValid &&
        (distSq < effectiveCullingDistSq) &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[0]) >= r &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[1]) >= r &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[2]) >= r &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[3]) >= r &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[4]) >= r &&
        dot(spherePos, globalUniforms.mainFrustumPlanes[5]) >= r;

    var targetLOD: u32 = 99u;
    var targetAlpha: f32 = 1.0;

    if (inMainFrustum) {
        var globalFade: f32 = 1.0;
        if (!hasInfiniteImpostor) {
            let fadeStartDist = typeInfo.fadeStartDistance;
            if (dist > fadeStartDist) {
                let fadeRange = max(cullingDist - fadeStartDist, 1.0);
                globalFade = clamp(1.0 - (dist - fadeStartDist) / fadeRange, 0.0, 1.0);
            }
        }

        if (numLODs <= 1u) {
            targetLOD = 0u;
            targetAlpha = globalFade;
        } else {
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

                    targetLOD = l;
                    targetAlpha = alpha * globalFade;
                    break;
                }
            }
        }
    }

    // 🌿 L1 워크그룹 로컬 슬롯 원자적 할당 (초고속 L1 공유 메모리, 0-지연시간)
    var localAssignedSlot: u32 = 0u;
    if (targetLOD < 8u) {
        localAssignedSlot = atomicAdd(&wgLocalMainSlots[targetLOD], 1u);
    }
    workgroupBarrier(); // ✅ 워크그룹 내 모든 스레드의 L1 카운트 누적 완료 대기

    // 🚀 워크그룹 대표 스레드들(0~7번)이 글로벌 VRAM에 단 1회씩 일괄 원자적 할당!
    if (local_idx < 8u && numLODs > local_idx) {
        let lodIdx = local_idx;
        let wgTotal = atomicLoad(&wgLocalMainSlots[lodIdx]);
        if (wgTotal > 0u) {
            let lodInfo = typeInfo.lods[lodIdx];
            let baseCmdIdx = typeInfo.indirectBaseOffset + lodInfo.subMeshOffset;
            let gBase = atomicAdd(&mainIndirectDrawCommands[baseCmdIdx].instanceCount, wgTotal);
            wgGlobalMainBases[lodIdx] = gBase;

            // 서브메시 1..N에 워크그룹 합산치 일괄 반영
            let numSubs = lodInfo.subMeshCount;
            for (var s: u32 = 1u; s < numSubs; s = s + 1u) {
                atomicAdd(&mainIndirectDrawCommands[baseCmdIdx + s].instanceCount, wgTotal);
            }
        }
    }
    workgroupBarrier(); // ✅ 글로벌 베이스 슬롯 공유 완료

    // 🌿 인스턴스 버퍼에 일괄 기록
    if (targetLOD < 8u) {
        var culledInst = instance;
        culledInst.posY = realY;
        culledInst.fadeOrType = targetAlpha;

        let gBase = wgGlobalMainBases[targetLOD];
        let finalSlot = gBase + localAssignedSlot;
        let outIdx = typeInfo.culledBaseOffset + (targetLOD * typeInfo.maxInstances) + finalSlot;
        mainCulledInstanceBuffer[outIdx] = culledInst;
    }

    // =========================================================================
    // 🌲 3. 섀도우 활성 캐스케이드 동적 Culling (단일 최적 캐스케이드 타겟팅 & 조기 탈출)
    // =========================================================================
    let activeCascades = min(globalUniforms.activeCascadeCount, 4u);
    if (activeCascades > 0u) {
        let lastCascadeIdx = activeCascades - 1u;
        let globalShadowMaxDist = globalUniforms.cascades[lastCascadeIdx].maxDistance + scaledRadius;
        let globalShadowMaxDistSq = globalShadowMaxDist * globalShadowMaxDist;

        if (distSq < globalShadowMaxDistSq) {
            var shadowInst = instance;
            shadowInst.posY = realY;
            shadowInst.fadeOrType = 1.0;

            for (var c: u32 = 0u; c < activeCascades; c = c + 1u) {
                let cascadeInfo = globalUniforms.cascades[c];
                if (cascadeInfo.hasShadow == 0u) {
                    continue;
                }

                let cascadeMaxDist = cascadeInfo.maxDistance;
                let isOverlapCascade = (c < activeCascades - 1u); // 마지막 활성 캐스케이드는 하드 컷오프, 전 단계는 오버랩
                let radiusMargin = select(0.0, scaledRadius, isOverlapCascade);
                let shadowEffectiveDist = cascadeMaxDist + radiusMargin;
                let shadowEffectiveDistSq = shadowEffectiveDist * shadowEffectiveDist;

                // distSq는 항상 horizontalDistSq 이상이므로 단일 조건으로 정밀 검사
                if (distSq >= shadowEffectiveDistSq) {
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
                // 🌲 원거리(Cascade 2 이상 또는 2단계 모드의 마지막 캐스케이드)는 옥타헤드럴 임포스터 강제 선택!
                var selectedLOD: u32 = 0u;
                if (numLODs > 1u) {
                    let isFarCascade = (c >= 2u || (activeCascades <= 2u && c == activeCascades - 1u));
                    if (isFarCascade) {
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
                shadowCulledInstanceBuffer[outIdx] = shadowInst;

                // 🌿 최적 캐스케이드 조기 탈출 (Early Out):
                // 현재 캐스케이드의 완전 내부(오버랩 마진 안쪽)에 안착한 인스턴스는
                // 더 먼 캐스케이드에서 중복 평가 및 원자적 락을 유발하지 않도록 루프를 즉시 종료합니다!
                let pureCascadeMaxDist = max(cascadeMaxDist - scaledRadius, 0.0);
                if (distSq < pureCascadeMaxDist * pureCascadeMaxDist) {
                    break;
                }
            }
        }
    }
}
