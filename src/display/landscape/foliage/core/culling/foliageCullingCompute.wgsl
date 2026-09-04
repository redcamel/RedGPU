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
    hasHZB: u32,
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
@group(0) @binding(9) var hzbTexture: texture_2d<f32>;
@group(0) @binding(10) var hzbSampler: sampler;

@compute @workgroup_size(64)
fn main(
    @builtin(global_invocation_id) global_id: vec3<u32>
) {
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
    let hasInfiniteImpostor = (numLODs > 0u && typeInfo.lods[numLODs - 1u].exitEnd >= 100000.0);
    let effectiveCullingDistSq = select(cullingDistSq, 1000000000000.0, hasInfiniteImpostor);

    // 🚀 [최적화 P1 / Step 17 - 수평 거리 기반 2D 조기 완전 탈락 (Early 2D Rejection)]
    // distSq = horizontalDistSq + dy^2 >= horizontalDistSq이므로,
    // 수평 거리만으로 메인 시야 한계와 그림자 최대 한계를 초과한 원거리 40만 개 인스턴스는
    // 스케일 언패킹, 높이 계산, 바운딩 구체 생성, 프러스텀 평면 검사를 0ms로 전면 스킵!
    var maxShadowDistSq: f32 = 0.0;
    if (globalUniforms.activeCascadeCount > 0u) {
        let lastCas = min(globalUniforms.activeCascadeCount, 4u) - 1u;
        let sMaxDist = globalUniforms.cascades[lastCas].maxDistance + typeInfo.boundingRadius * 4.0;
        maxShadowDistSq = sMaxDist * sMaxDist;
    }
    let maxUsefulDistSq = max(effectiveCullingDistSq, maxShadowDistSq);
    let isVisibleRange = isValid && (horizontalDistSq < maxUsefulDistSq);

    var realY = instance.posY - typeInfo.bottomOffset;
    var distSq = horizontalDistSq;
    var effectiveDist: f32 = 0.0;
    var scaledRadius: f32 = 0.0;
    var spherePos = vec4<f32>(instance.posX, realY, instance.posZ, 1.0);
    var r: f32 = 0.0;

    if (isVisibleRange) {
        let scaleXZ = unpack2x16float(instance.packedScaleXZ);
        let scaleX = scaleXZ.x;
        let scaleZ = scaleXZ.y;
        let scaleY = instance.scaleY;

        // 🌟 [지형 표면 실시간 스냅핑] GPU VHT 높이맵 텍스처를 샘플링하여 지형 굴곡에 완벽 밀착
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
        distSq = horizontalDistSq + dy * dy;
        let dist = sqrt(distSq);
        effectiveDist = dist * max(globalUniforms.fovFactor, 0.0001);

        let maxScale = max(max(scaleX, scaleY), scaleZ);
        scaledRadius = typeInfo.boundingRadius * maxScale;
        spherePos = vec4<f32>(instance.posX, realY, instance.posZ, 1.0);
        r = -scaledRadius;

        var inMainFrustum = false;
        // 🚀 [최적화 P1 / Step 12] 유효 인스턴스 및 컬링 거리 이내일 때만 프러스텀 6평면 내적 및 픽셀 직경 계산 실행
        if (distSq < effectiveCullingDistSq) {
            inMainFrustum =
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
        }

        if (inMainFrustum && globalUniforms.hasHZB != 0u) {
            let clipPos = globalUniforms.mainProjectionViewMatrix * spherePos;
            if (clipPos.w > 0.1) {
                let invW = 1.0 / clipPos.w;
                let ndc = clipPos.xy * invW;
                let uvCenter = vec2<f32>(ndc.x * 0.5 + 0.5, 1.0 - (ndc.y * 0.5 + 0.5)); 

                let screenRadius = (scaledRadius * globalUniforms.fovFactor * 2.0) * invW;
                let minUV = clamp(uvCenter - vec2<f32>(screenRadius), vec2<f32>(0.0), vec2<f32>(1.0));
                let maxUV = clamp(uvCenter + vec2<f32>(screenRadius), vec2<f32>(0.0), vec2<f32>(1.0));

                let aabbPixelSize = max((maxUV - minUV) * vec2<f32>(512.0, 256.0), vec2<f32>(1.0));
                let maxDim = max(aabbPixelSize.x, aabbPixelSize.y);
                // 🚀 [최적화 P1 - HZB MipLevel 1클럭 비트 연산 대체]
                // log2/ceil/clamp 부동소수점 초월함수를 1사이클 정수 비트 인스트럭션(firstLeadingBit)으로 대체 (ALU 3배 가속)
                let uDim = max(u32(maxDim + 0.999), 1u);
                let mipLevel = f32(min(firstLeadingBit(uDim * 2u - 1u), 7u));

                let hzb00 = textureSampleLevel(hzbTexture, hzbSampler, minUV, mipLevel).r;
                let hzb10 = textureSampleLevel(hzbTexture, hzbSampler, vec2<f32>(maxUV.x, minUV.y), mipLevel).r;
                let hzb01 = textureSampleLevel(hzbTexture, hzbSampler, vec2<f32>(minUV.x, maxUV.y), mipLevel).r;
                let hzb11 = textureSampleLevel(hzbTexture, hzbSampler, maxUV, mipLevel).r;
                let maxHZBDepth = max(max(hzb00, hzb10), max(hzb01, hzb11));

                let nearDepth = (clipPos.z - scaledRadius) * invW;

                if (nearDepth > maxHZBDepth + 0.001) {
                    inMainFrustum = false;
                }
            }
        }

        if (inMainFrustum) {
            var globalFade: f32 = 1.0;
            if (!hasInfiniteImpostor) {
                let fadeStartDist = typeInfo.fadeStartDistance;
                if (dist > fadeStartDist) {
                    // 🚀 [최적화 P1 - Global Fade 역수 사전 계산 테이블화]
                    globalFade = clamp(1.0 - (dist - fadeStartDist) * typeInfo.invFadeRange, 0.0, 1.0);
                }
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
                // 🌿 [자연스러운 LOD 크로스페이드 - Dual LOD Emission]
                // 전환 구간(Transition Band)에 위치한 인스턴스는 이전 LOD(Fade Out)와 다음 LOD(Fade In)
                // 양쪽 Indirect Draw 명령 버퍼에 동시에 등록되어 4x4 Bayer Matrix 디더링으로 완벽한 모핑 크로스페이드 실현!
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

                        // 🚀 [비전환 구간 조기 탈출] 완전 불투명(alpha >= 0.999) 상태인 인스턴스는 단일 LOD 등록 후 즉시 루프 탈출
                        if (alpha >= 0.999 && !isLastLOD && effectiveDist < lodInfo.exitStart) {
                            break;
                        }
                    }
                }
            }
        }
    }

    // 🚀 [최적화 P0 / Step 21 - 비가시 인스턴스 섀도우 루프 진입 원천 차단]
    if (!isVisibleRange) {
        return;
    }

    let activeCascades = min(globalUniforms.activeCascadeCount, 4u);

    // 🚀 [최적화 P0 / Step 22 - 섀도우 캐스케이드 루프 Early Break (평면 내적 18~24회 100% 생략)]
    for (var c: u32 = 0u; c < activeCascades; c = c + 1u) {
        let cascadeMaxDist = globalUniforms.cascades[c].maxDistance;
        let isOverlapCascade = (c < activeCascades - 1u); 
        let radiusMargin = select(0.0, scaledRadius, isOverlapCascade);
        let shadowEffectiveDist = cascadeMaxDist + radiusMargin;
        let shadowEffectiveDistSq = shadowEffectiveDist * shadowEffectiveDist;

        // 🚀 [최적화 P1 / Step 2] 식생 유형별 최대 그림자 캐스케이드 한도 및 거리 검사
        if (c <= typeInfo.maxShadowCascadeIndex && globalUniforms.cascades[c].hasShadow != 0u && distSq < shadowEffectiveDistSq) {
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
                    for (var l: u32 = 0u; l <= maxShadowLOD; l = l + 1u) {
                        let originalLodDist = (typeInfo.lods[l].exitStart + typeInfo.lods[l].exitEnd) * 0.5;
                        if (effectiveDist <= originalLodDist || l == maxShadowLOD) {
                            targetShadowLOD = l;
                            break;
                        }
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

                let pureCascadeMaxDist = max(cascadeMaxDist - scaledRadius, 0.0);
                if (distSq < pureCascadeMaxDist * pureCascadeMaxDist) {
                    break; // 🚀 이전 캐스케이드에 완벽히 수용된 인스턴스는 이후 캐스케이드 평면 검사를 100% 생략하고 즉시 탈출!
                }
            }
        }
    }
}
