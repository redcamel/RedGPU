#redgpu_include landscape.testSphereInFrustum;
#redgpu_include landscape.checkAABBInHZB;

struct FoliageLODUniformInfo {
    enterStart: f32,
    enterEnd: f32,
    exitStart: f32,
    exitEnd: f32,
    invEnterRange: f32,
    invExitRange: f32,
    renderUnitOffset: u32,
    renderUnitCount: u32,
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
    instanceCount: u32,
    shadowCullDistance: f32,
    invFadeRange: f32,
    boundingHeight: f32,
    pad0: f32,
    pad1: f32,
    pad2: f32,
    lods: array<FoliageLODUniformInfo, 8>,
};


struct CascadeCullingInfo {
    maxDistance: f32,
    hasShadow: u32,
    pad0: u32,
    pad1: u32,
    frustumPlanes: array<vec4<f32>, 6>,
};

struct FoliageCullingUniforms {
    cameraPosition: vec3<f32>,
    totalInstanceCount: u32,

    fovFactor: f32,
    maxRenderUnits: u32,
    maxTotalInstances8: u32,
    activeCascadeCount: u32,

    useHZB: u32,
    viewportHeight: f32,
    depthBias: f32,
    pad0: f32, // hzbWidth

    pad1: f32, // hzbHeight
    pad2: f32,
    pad3: f32,
    pad4: f32,

    viewProjectionMatrix: mat4x4<f32>,
    mainFrustumPlanes: array<vec4<f32>, 6>,
    cascades: array<CascadeCullingInfo, 4>,
};

struct FoliageInstance {
    posX: f32,
    posY: f32,
    posZ: f32,
    scaleY: f32,
    packedRotXY: u32,
    packedRotZW: u32,
    packedScaleXZ: u32,
    packedGroundColorAndType: u32,
};

struct DrawIndexedIndirectArgs {
    indexCount: u32,
    instanceCount: atomic<u32>,
    firstIndex: u32,
    baseVertex: u32,
    firstInstance: u32,
};

fn unpackTypeId(packedGroundColorAndType: u32) -> u32 {
    return extractBits(packedGroundColorAndType, 24u, 8u);
}

fn replacePackedAlpha(packedGroundColorAndType: u32, alphaByte: u32) -> u32 {
    return insertBits(packedGroundColorAndType, alphaByte, 24u, 8u);
}



@group(0) @binding(0) var<storage, read> rawInstances: array<FoliageInstance>;
@group(0) @binding(1) var<uniform> globalUniforms: FoliageCullingUniforms;
@group(0) @binding(2) var<storage, read> typeParams: array<FoliageTypeParam>;
@group(0) @binding(3) var<storage, read_write> mainCulledInstances: array<FoliageInstance>;
@group(0) @binding(4) var<storage, read_write> mainIndirectCommands: array<DrawIndexedIndirectArgs>;
@group(0) @binding(5) var<storage, read_write> shadowCulledInstances: array<FoliageInstance>;
@group(0) @binding(6) var<storage, read_write> shadowIndirectCommands: array<DrawIndexedIndirectArgs>;
@group(0) @binding(7) var hzbTexture: texture_2d<f32>;
@group(0) @binding(8) var hzbSampler: sampler;

@compute @workgroup_size(64)
fn main(
    @builtin(global_invocation_id) global_id: vec3<u32>
) {
    let idx = global_id.x;
    if (idx >= globalUniforms.totalInstanceCount) {
        return;
    }

    var instance = rawInstances[idx];
    let typeIdx = unpackTypeId(instance.packedGroundColorAndType);
    if (typeIdx >= 64u) {
        return;
    }

    let typeInfo = &typeParams[typeIdx];
    if (typeInfo.instanceCount == 0u || idx < typeInfo.rawBaseOffset) {
        return;
    }

    let localSlotIdx = idx - typeInfo.rawBaseOffset;
    if (localSlotIdx >= typeInfo.instanceCount) {
        return;
    }

    let camPos = globalUniforms.cameraPosition;
    let dx = instance.posX - camPos.x;
    let dz = instance.posZ - camPos.z;
    let horizontalDistSq = dx * dx + dz * dz;

    let cullingDist = typeInfo.cullingDistance;
    let effectiveCullingDistSq = cullingDist * cullingDist;

    if (horizontalDistSq >= effectiveCullingDistSq) {
        return;
    }

    let scaleY = instance.scaleY;
    let realY = instance.posY + typeInfo.bottomOffset * scaleY;
    let dy = realY - camPos.y;
    let distSq = horizontalDistSq + dy * dy;
    if (distSq >= effectiveCullingDistSq) {
        return;
    }
    let scaleXZ = unpack2x16float(instance.packedScaleXZ);
    let maxScale = max(max(scaleXZ.x, scaleY), scaleXZ.y);
    let scaledRadius = typeInfo.boundingRadius * maxScale;

    let effFov = max(globalUniforms.fovFactor, 0.0001);
    let vpHeight = select(1080.0, globalUniforms.viewportHeight, globalUniforms.viewportHeight > 0.0);
    let subpixelLimit = scaledRadius * vpHeight;
    let isSubpixel = (distSq * (4.0 * effFov * effFov) > subpixelLimit * subpixelLimit);

    let activeCascades = min(globalUniforms.activeCascadeCount, 4u);
    let userShadowDist = typeInfo.shadowCullDistance;
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
    let canHaveShadow = (userShadowDist > 0.0 && activeCascades > 0u && distSq < maxShadowDistSq);

    if (isSubpixel && !canHaveShadow) {
        return;
    }

    let dist = sqrt(distSq);
    let effectiveDist = dist * effFov;

    var inMainFrustum = false;
    let sphereCenter = vec3<f32>(instance.posX, realY, instance.posZ);

    if (!isSubpixel) {
        inMainFrustum = testSphereInFrustum(sphereCenter, scaledRadius, globalUniforms.mainFrustumPlanes);

        if (inMainFrustum && globalUniforms.useHZB != 0u) {

            if (dist - scaledRadius > 10.0) {
                let halfW = scaledRadius;
                let baseY = realY;
                let effHeight = max(typeInfo.boundingHeight, typeInfo.boundingRadius * 1.5) * scaleY;
                let topY = baseY + effHeight;
                let aabbMin = vec3<f32>(instance.posX - halfW, baseY, instance.posZ - halfW);
                let aabbMax = vec3<f32>(instance.posX + halfW, topY, instance.posZ + halfW);

                if (!checkAABBInHZB(aabbMin, aabbMax, globalUniforms.viewProjectionMatrix, hzbTexture, hzbSampler, globalUniforms.depthBias)) {
                    inMainFrustum = false;
                }
            }
        }
    }

    if (!inMainFrustum && !canHaveShadow) {
        return;
    }

    let numLODs = typeInfo.lodCount;

    if (inMainFrustum) {
        var globalFade: f32 = 1.0;
        let fadeStartDist = typeInfo.fadeStartDistance;
        if (dist > fadeStartDist) {
            globalFade = saturate(1.0 - (dist - fadeStartDist) * typeInfo.invFadeRange);
        }

        if (numLODs <= 1u) {
            let finalAlpha = globalFade;
            if (finalAlpha > 0.001) {
                let lodInfo = typeInfo.lods[0];
                let baseCmdIdx = typeInfo.indirectBaseOffset + lodInfo.renderUnitOffset;
                let slot = atomicAdd(&mainIndirectCommands[baseCmdIdx].instanceCount, 1u);

                let numUnits = lodInfo.renderUnitCount;
                for (var s: u32 = 1u; s < numUnits; s = s + 1u) {
                    atomicAdd(&mainIndirectCommands[baseCmdIdx + s].instanceCount, 1u);
                }

                let alphaByte = u32(saturate(finalAlpha) * 255.0);
                var culledInst = instance;
                culledInst.posY = realY;
                culledInst.packedGroundColorAndType = replacePackedAlpha(instance.packedGroundColorAndType, alphaByte);

                let outIdx = typeInfo.culledBaseOffset + slot;
                mainCulledInstances[outIdx] = culledInst;
            }
        } else {
            for (var l: u32 = 0u; l < numLODs; l = l + 1u) {
                let lodInfo = typeInfo.lods[l];
                let isLastLOD = (l == numLODs - 1u);

                if (effectiveDist >= lodInfo.enterStart && (isLastLOD || effectiveDist <= lodInfo.exitEnd)) {
                    var alpha: f32 = 1.0;
                    if (l > 0u && effectiveDist < lodInfo.enterEnd) {
                        alpha = saturate((effectiveDist - lodInfo.enterStart) * lodInfo.invEnterRange);
                    } else if (!isLastLOD && effectiveDist > lodInfo.exitStart) {
                        alpha = saturate((lodInfo.exitEnd - effectiveDist) * lodInfo.invExitRange);
                    }

                    let finalAlpha = alpha * globalFade;
                    if (finalAlpha > 0.001) {
                        let baseCmdIdx = typeInfo.indirectBaseOffset + lodInfo.renderUnitOffset;
                        let slot = atomicAdd(&mainIndirectCommands[baseCmdIdx].instanceCount, 1u);

                        let numUnits = lodInfo.renderUnitCount;
                        for (var s: u32 = 1u; s < numUnits; s = s + 1u) {
                            atomicAdd(&mainIndirectCommands[baseCmdIdx + s].instanceCount, 1u);
                        }

                        let alphaByte = u32(saturate(finalAlpha) * 255.0);
                        var culledInst = instance;
                        culledInst.posY = realY;
                        culledInst.packedGroundColorAndType = replacePackedAlpha(instance.packedGroundColorAndType, alphaByte);

                        let outIdx = typeInfo.culledBaseOffset + (l * typeInfo.maxInstances) + slot;
                        mainCulledInstances[outIdx] = culledInst;
                    }

                    if (alpha >= 0.999 && !isLastLOD && effectiveDist < lodInfo.exitStart) {
                        break;
                    }
                }
            }
        }
    }

    if (canHaveShadow) {
        let shadowFadeRange = clamp(userShadowDist * 0.20, 10.0, 60.0);
        let invShadowFadeRange = 1.0 / shadowFadeRange;
        let shadowFadeStart = max(0.0, userShadowDist - shadowFadeRange);
        var shadowFade: f32 = 1.0;
        if (dist > shadowFadeStart) {
            shadowFade = saturate((userShadowDist - dist) * invShadowFadeRange);
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
                    let inShadowFrustum = testSphereInFrustum(sphereCenter, scaledRadius, cascadeInfo.frustumPlanes);

                    if (inShadowFrustum) {
                        var targetShadowLOD: u32 = 0u;
                        if (numLODs > 1u) {
                            let lastLOD = numLODs - 1u;
                            let hasInfiniteImpostor = (typeInfo.lods[lastLOD].exitEnd >= 100000.0);
                            let lod0Dist = (typeInfo.lods[0].exitStart + typeInfo.lods[0].exitEnd) * 0.5;

                            if (hasInfiniteImpostor) {
                                let impostorEnterStart = typeInfo.lods[lastLOD].enterStart;
                                if (effectiveDist >= impostorEnterStart) {
                                    targetShadowLOD = lastLOD;
                                } else {
                                    let max3DLOD = max(lastLOD - 1u, 0u);
                                    targetShadowLOD = select(max3DLOD, 0u, c <= 1u && effectiveDist <= lod0Dist);
                                }
                            } else {
                                targetShadowLOD = select(lastLOD, 0u, c <= 1u && effectiveDist <= lod0Dist);
                            }
                        }

                        let lodInfo = typeInfo.lods[targetShadowLOD];
                        let cascadeIndirectOffset = c * globalUniforms.maxRenderUnits;
                        let baseCmdIdx = cascadeIndirectOffset + typeInfo.indirectBaseOffset + lodInfo.renderUnitOffset;
                        let slot = atomicAdd(&shadowIndirectCommands[baseCmdIdx].instanceCount, 1u);

                        let numUnits = lodInfo.renderUnitCount;
                        for (var s: u32 = 1u; s < numUnits; s = s + 1u) {
                            atomicAdd(&shadowIndirectCommands[baseCmdIdx + s].instanceCount, 1u);
                        }

                        let shadowFadeByte = u32(saturate(shadowFade) * 255.0);
                        var shadowInst = instance;
                        shadowInst.posY = realY;
                        shadowInst.packedGroundColorAndType = replacePackedAlpha(instance.packedGroundColorAndType, shadowFadeByte);

                        let cascadeCulledOffset = c * globalUniforms.maxTotalInstances8;
                        let outIdx = cascadeCulledOffset + typeInfo.culledBaseOffset + (targetShadowLOD * typeInfo.maxInstances) + slot;
                        shadowCulledInstances[outIdx] = shadowInst;
                    }
                }
            }
        }
    }
}
