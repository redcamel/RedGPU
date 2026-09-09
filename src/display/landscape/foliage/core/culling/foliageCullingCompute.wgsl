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

    // 1단계: 수평 거리 1차 조기 탈출
    if (horizontalDistSq >= effectiveCullingDistSq) {
        return;
    }

    let scaleXZ = unpack2x16float(instance.packedScaleXZ);
    let scaleX = scaleXZ.x;
    let scaleZ = scaleXZ.y;
    let scaleY = instance.scaleY;

    let maxScale = max(max(scaleX, scaleY), scaleZ);
    let scaledRadius = typeInfo.boundingRadius * maxScale;
    let r = -scaledRadius;

    // 2단계: 대략적 3D 거리 및 서브픽셀(2px 미만) 조기 판정 (VHT 샘플링 및 절두체 내적 전진 배치)
    let effectiveBottomOffset = typeInfo.bottomOffset * scaleY;
    let approxRealY = instance.posY + effectiveBottomOffset;
    let approxDy = approxRealY - camPos.y;
    let approxDistSq = horizontalDistSq + approxDy * approxDy;
    if (approxDistSq >= effectiveCullingDistSq) {
        return;
    }

    let approxDist = sqrt(approxDistSq);
    let approxEffectiveDist = approxDist * max(globalUniforms.fovFactor, 0.0001);

    let vpHeight = select(1080.0, globalUniforms.viewportHeight, globalUniforms.viewportHeight > 0.0);
    let isSubpixel = (approxEffectiveDist * 2.0 > scaledRadius * vpHeight);

    // 3단계: 섀도우 최대 유효 거리 사전 계산 (인스턴스 물리적 거리 기반)
    let activeCascades = min(globalUniforms.activeCascadeCount, 4u);
    let userShadowDist = typeInfo.maxShadowDistance;
    let shadowMargin = scaledRadius * 4.0;
    let effectiveUserDist = userShadowDist + shadowMargin;
    let userShadowDistSq = effectiveUserDist * effectiveUserDist;

    var cascadeGlobalMaxDist: f32 = 0.0;
    if (activeCascades > 0u) {
        let lastCascadeMax = globalUniforms.cascades[activeCascades - 1u].maxDistance;
        cascadeGlobalMaxDist = lastCascadeMax + shadowMargin;
    }
    let cascadeGlobalMaxDistSq = cascadeGlobalMaxDist * cascadeGlobalMaxDist;
    let maxShadowDistSq = min(userShadowDistSq, cascadeGlobalMaxDistSq);
    let canHaveShadow = (userShadowDist > 0.0 && activeCascades > 0u && approxDistSq < maxShadowDistSq);

    // 4단계: 동시 조기 탈출 (메인 서브픽셀 기각 + 섀도우 범위 초과)
    if (isSubpixel && !canHaveShadow) {
        return;
    }

    // 5단계: 메인 절두체 검사 (서브픽셀이 아닐 때만 6개 평면 검사)
    var inMainFrustum = false;
    var spherePos = vec4<f32>(instance.posX, approxRealY, instance.posZ, 1.0);

    if (!isSubpixel) {
        inMainFrustum =
            dot(spherePos, globalUniforms.mainFrustumPlanes[0]) >= r &&
            dot(spherePos, globalUniforms.mainFrustumPlanes[1]) >= r &&
            dot(spherePos, globalUniforms.mainFrustumPlanes[2]) >= r &&
            dot(spherePos, globalUniforms.mainFrustumPlanes[3]) >= r &&
            dot(spherePos, globalUniforms.mainFrustumPlanes[4]) >= r &&
            dot(spherePos, globalUniforms.mainFrustumPlanes[5]) >= r;
    }

    // 메인 절두체 밖이고 섀도우도 없으면 즉시 종료
    if (!inMainFrustum && !canHaveShadow) {
        return;
    }

    // 6단계: 지연 VHT 지형 높이 텍스처 샘플링 (실제 렌더링 후보군만 1회 정밀 페치)
    // GPU 지형 렌더링 메시와 100% 동일한 VHT 하이트맵을 샘플링하여 지표면에 완전 밀착
    var realY = approxRealY;
    if (globalUniforms.hasVHT != 0u && globalUniforms.invWorldSizeX > 0.0) {
        let u = instance.posX * globalUniforms.invWorldSizeX + 0.5;
        let v = instance.posZ * globalUniforms.invWorldSizeX + 0.5;
        if (u >= 0.0 && u <= 1.0 && v >= 0.0 && v <= 1.0) {
            let sampledHeightNorm = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, v), 0.0).r;
            let terrainHeight = sampledHeightNorm * globalUniforms.heightScale;
            realY = terrainHeight + effectiveBottomOffset;
        }
    }

    let dy = realY - camPos.y;
    let distSq = horizontalDistSq + dy * dy;
    if (distSq >= effectiveCullingDistSq) {
        return;
    }

    let dist = sqrt(distSq);
    let effectiveDist = dist * max(globalUniforms.fovFactor, 0.0001);
    spherePos.y = realY;

    let numLODs = typeInfo.lodCount;
    let hasInfiniteImpostor = (numLODs > 0u && typeInfo.lods[numLODs - 1u].exitEnd >= 100000.0);

    // 7단계: 메인 패스 LOD 판정 및 1-Pass Direct Culling 슬롯 할당
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

    // 8단계: 섀도우 패스 캐스케이드 컬링 & 1-Pass Direct Culling 슬롯 할당
    if (canHaveShadow && distSq < maxShadowDistSq) {
        let shadowFadeRange = clamp(userShadowDist * 0.20, 10.0, 60.0);
        let shadowFadeStart = max(0.0, userShadowDist - shadowFadeRange);
        var shadowFade: f32 = 1.0;
        if (dist > shadowFadeStart) {
            shadowFade = clamp((userShadowDist - dist) / shadowFadeRange, 0.0, 1.0);
        }

        if (shadowFade > 0.001) {
            for (var c: u32 = 0u; c < activeCascades; c = c + 1u) {
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
                        shadowInst.fadeOrType = shadowFade;

                        let cascadeCulledOffset = c * globalUniforms.maxTotalInstances8;
                        let outIdx = cascadeCulledOffset + typeInfo.culledBaseOffset + (targetShadowLOD * typeInfo.maxInstances) + slot;
                        shadowCulledInstanceBuffer[outIdx] = shadowInst;
                    }
                }
            }
        }
    }
}
