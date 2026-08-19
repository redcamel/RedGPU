struct CullingUniforms {
    cameraPosition: vec3<f32>,
    cullingDistance: f32,
    fadeStartDistance: f32,
    instanceCount: u32,
    boundingRadius: f32,
    worldSizeX: f32,
    heightScale: f32,
    bottomOffset: f32,
    hasVHT: u32,
    subMeshCount: u32,
    lodDistance: f32,
    lod0SubMeshCount: u32,
    hasBillboard: u32,
    maxInstances: u32,
    lodFadeRange: f32,
    invWorldSizeX: f32,
    pad2: f32,
    pad3: f32,
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

var<workgroup> wgCountLOD0: atomic<u32>;
var<workgroup> wgCountLOD1: atomic<u32>;
var<workgroup> wgLocalSlotLOD0: atomic<u32>;
var<workgroup> wgLocalSlotLOD1: atomic<u32>;
var<workgroup> wgGlobalOffsetLOD0: u32;
var<workgroup> wgGlobalOffsetLOD1: u32;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>, @builtin(local_invocation_id) local_id: vec3<u32>) {
    let localIdx = local_id.x;
    if (localIdx == 0u) {
        atomicStore(&wgCountLOD0, 0u);
        atomicStore(&wgCountLOD1, 0u);
        atomicStore(&wgLocalSlotLOD0, 0u);
        atomicStore(&wgLocalSlotLOD1, 0u);
    }

    workgroupBarrier();

    let idx = global_id.x;
    var isLOD0 = false;
    var isLOD1 = false;
    var culledInstance0: FoliageInstanceData;
    var culledInstance1: FoliageInstanceData;

    if (idx < cullingUniforms.instanceCount) {
        let instance = rawInstanceBuffer[idx];
        let camPos = cullingUniforms.cameraPosition;

        let dx = instance.posX - camPos.x;
        let dz = instance.posZ - camPos.z;
        let horizontalDistSq = dx * dx + dz * dz;

        let cullingDist = cullingUniforms.cullingDistance;
        let cullingDistSq = cullingDist * cullingDist;

        if (horizontalDistSq < cullingDistSq) {

            var realY = instance.posY;
            if (cullingUniforms.hasVHT != 0u && cullingUniforms.invWorldSizeX > 0.0) {

                let u = instance.posX * cullingUniforms.invWorldSizeX + 0.5;
                let v = instance.posZ * cullingUniforms.invWorldSizeX + 0.5;
                if (u >= 0.0 && u <= 1.0 && v >= 0.0 && v <= 1.0) {
                    let sampledHeightNorm = textureSampleLevel(vhtTexture, vhtSampler, vec2<f32>(u, v), 0.0).r;
                    realY = (sampledHeightNorm * cullingUniforms.heightScale) - cullingUniforms.bottomOffset;
                }
            }

            let worldPos = vec3<f32>(instance.posX, realY, instance.posZ);
            let dy = realY - camPos.y;
            let distSq = horizontalDistSq + dy * dy;

            if (distSq < cullingDistSq) {
                let maxScale = max(max(instance.scaleX, instance.scaleY), instance.scaleZ);
                let scaledRadius = cullingUniforms.boundingRadius * maxScale;
                let spherePos = vec4<f32>(worldPos, 1.0);
                let r = -scaledRadius;

                let inFrustum =
                    dot(spherePos, cullingUniforms.frustumPlanes[0]) >= r &&
                    dot(spherePos, cullingUniforms.frustumPlanes[1]) >= r &&
                    dot(spherePos, cullingUniforms.frustumPlanes[2]) >= r &&
                    dot(spherePos, cullingUniforms.frustumPlanes[3]) >= r &&
                    dot(spherePos, cullingUniforms.frustumPlanes[4]) >= r &&
                    dot(spherePos, cullingUniforms.frustumPlanes[5]) >= r;

            if (inFrustum) {
                let fadeStartDist = cullingUniforms.fadeStartDistance;
                let fadeStartDistSq = fadeStartDist * fadeStartDist;
                let lodDist = cullingUniforms.lodDistance;
                let halfFadeRange = max(cullingUniforms.lodFadeRange * 0.5, 1.0);
                let crossFadeStart = max(lodDist - halfFadeRange, 0.0);
                let crossFadeEnd = lodDist + halfFadeRange;
                let crossFadeStartSq = crossFadeStart * crossFadeStart;
                let crossFadeEndSq = crossFadeEnd * crossFadeEnd;

                var dist: f32 = -1.0;
                var fade: f32 = 1.0;

                if (distSq > fadeStartDistSq) {
                    dist = sqrt(distSq);
                    let fadeRange = max(cullingDist - fadeStartDist, 1.0);
                    fade = clamp(1.0 - (dist - fadeStartDist) / fadeRange, 0.0, 1.0);
                }

                if (cullingUniforms.hasBillboard == 0u) {

                    isLOD0 = true;
                    culledInstance0 = instance;
                    culledInstance0.posY = realY;
                    culledInstance0.fade = fade;
                    culledInstance0.subId = 1.0;
                    atomicAdd(&wgCountLOD0, 1u);
                } else {

                    if (distSq < crossFadeEndSq) {

                        isLOD0 = true;
                        var lodFade0: f32 = 1.0;
                        if (distSq >= crossFadeStartSq) {
                            if (dist < 0.0) { dist = sqrt(distSq); }
                            lodFade0 = clamp((crossFadeEnd - dist) / (crossFadeEnd - crossFadeStart), 0.0, 1.0);
                        }
                        culledInstance0 = instance;
                        culledInstance0.posY = realY;
                        culledInstance0.fade = fade;
                        culledInstance0.subId = lodFade0;
                        atomicAdd(&wgCountLOD0, 1u);
                    }

                    if (distSq >= crossFadeStartSq) {

                        isLOD1 = true;
                        var lodFade1: f32 = 1.0;
                        if (distSq < crossFadeEndSq) {
                            if (dist < 0.0) { dist = sqrt(distSq); }
                            lodFade1 = clamp((dist - crossFadeStart) / (crossFadeEnd - crossFadeStart), 0.0, 1.0);
                        }
                        culledInstance1 = instance;
                        culledInstance1.posY = realY;
                        culledInstance1.fade = fade;
                        culledInstance1.subId = lodFade1;
                        atomicAdd(&wgCountLOD1, 1u);
                    }
                }
            }
        }
    }
    }

    workgroupBarrier();

    if (localIdx == 0u) {
        let countLOD0 = atomicLoad(&wgCountLOD0);
        if (countLOD0 > 0u) {
            wgGlobalOffsetLOD0 = atomicAdd(&indirectDrawCommands[0].instanceCount, countLOD0);
            let numLOD0 = cullingUniforms.lod0SubMeshCount;
            for (var s: u32 = 1u; s < numLOD0; s = s + 1u) {
                atomicAdd(&indirectDrawCommands[s].instanceCount, countLOD0);
            }
        }

        let countLOD1 = atomicLoad(&wgCountLOD1);
        if (countLOD1 > 0u && cullingUniforms.hasBillboard != 0u) {
            let billboardSlot = cullingUniforms.lod0SubMeshCount;
            wgGlobalOffsetLOD1 = atomicAdd(&indirectDrawCommands[billboardSlot].instanceCount, countLOD1);
        }
    }

    workgroupBarrier();

    if (isLOD0) {
        let slot0 = atomicAdd(&wgLocalSlotLOD0, 1u);
        let outIdx0 = wgGlobalOffsetLOD0 + slot0;
        culledInstanceBuffer[outIdx0] = culledInstance0;
    }
    if (isLOD1) {
        let slot1 = atomicAdd(&wgLocalSlotLOD1, 1u);
        let maxInstances = cullingUniforms.maxInstances;
        let outIdx1 = maxInstances + wgGlobalOffsetLOD1 + slot1;
        culledInstanceBuffer[outIdx1] = culledInstance1;
    }
}
