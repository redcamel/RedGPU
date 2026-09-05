struct CameraFrustumUniforms {
    cameraPosition: vec3<f32>,
    maxLODLevel: u32,
    worldSizeX: f32,
    worldSizeZ: f32,
    tileSizeX: f32,
    tileSizeZ: f32,
    heightScale: f32,
    tileCount: u32,
    tanHalfFOV: f32,
    lodMetric: f32,
    hasHZB: u32,
    pad0: f32,
    pad1: f32,
    pad2: f32,
    viewProjectionMatrix: mat4x4<f32>,
    frustumPlanes: array<vec4<f32>, 6>,
    lodDistancesSq: array<vec4<f32>, 2>,
};

struct InputTileData {
    color: vec4<f32>,
    worldX: f32,
    worldZ: f32,
};

struct IndirectDrawArgs {
    indexCount: u32,
    instanceCount: atomic<u32>,
    firstIndex: u32,
    baseVertex: u32,
    firstInstance: u32,
};

@group(0) @binding(0) var<uniform> uniforms: CameraFrustumUniforms;
@group(0) @binding(1) var<storage, read> allInputTiles: array<InputTileData>;
@group(0) @binding(2) var<storage, read_write> visibleTileIndices: array<u32>;
@group(0) @binding(3) var<storage, read_write> indirectDrawArgs: array<IndirectDrawArgs>;
@group(0) @binding(4) var hzbTexture: texture_2d<f32>;
@group(0) @binding(5) var hzbSampler: sampler;

var<workgroup> wgCounts: array<atomic<u32>, 8>;
var<workgroup> wgLocalSlots: array<atomic<u32>, 8>;
var<workgroup> wgGlobalOffsets: array<u32, 8>;

fn checkAABBInFrustum(minPos: vec3<f32>, maxPos: vec3<f32>) -> bool {
    for (var i = 0; i < 6; i = i + 1) {
        let plane = uniforms.frustumPlanes[i];
        let p = vec3<f32>(
            select(minPos.x, maxPos.x, plane.x >= 0.0),
            select(minPos.y, maxPos.y, plane.y >= 0.0),
            select(minPos.z, maxPos.z, plane.z >= 0.0)
        );
        if (dot(plane.xyz, p) + plane.w < 0.0) {
            return false;
        }
    }
    return true;
}

fn checkAABBInHZB(minPos: vec3<f32>, maxPos: vec3<f32>) -> bool {
    var minNDC = vec2<f32>(1.0, 1.0);
    var maxNDC = vec2<f32>(-1.0, -1.0);
    var minDepth = 1.0;
    var allBehindNearPlane = true;

    let corners = array<vec3<f32>, 8>(
        vec3<f32>(minPos.x, minPos.y, minPos.z),
        vec3<f32>(maxPos.x, minPos.y, minPos.z),
        vec3<f32>(minPos.x, maxPos.y, minPos.z),
        vec3<f32>(maxPos.x, maxPos.y, minPos.z),
        vec3<f32>(minPos.x, minPos.y, maxPos.z),
        vec3<f32>(maxPos.x, minPos.y, maxPos.z),
        vec3<f32>(minPos.x, maxPos.y, maxPos.z),
        vec3<f32>(maxPos.x, maxPos.y, maxPos.z),
    );

    for (var i = 0; i < 8; i = i + 1) {
        let clip = uniforms.viewProjectionMatrix * vec4<f32>(corners[i], 1.0);
        if (clip.w > 0.01) {
            allBehindNearPlane = false;
            let invW = 1.0 / clip.w;
            let ndc = clip.xy * invW;
            let d = clip.z * invW;
            minNDC = min(minNDC, ndc);
            maxNDC = max(maxNDC, ndc);
            minDepth = min(minDepth, d);
        } else {
            
            return true;
        }
    }

    if (allBehindNearPlane) {
        return false;
    }

    let minUV = clamp(vec2<f32>(minNDC.x * 0.5 + 0.5, 1.0 - (maxNDC.y * 0.5 + 0.5)), vec2<f32>(0.0), vec2<f32>(1.0));
    let maxUV = clamp(vec2<f32>(maxNDC.x * 0.5 + 0.5, 1.0 - (minNDC.y * 0.5 + 0.5)), vec2<f32>(0.0), vec2<f32>(1.0));

    
    let aabbPixelSize = max((maxUV - minUV) * vec2<f32>(512.0, 256.0), vec2<f32>(1.0));
    let maxDim = max(aabbPixelSize.x, aabbPixelSize.y);
    let mipLevel = clamp(ceil(log2(maxDim)), 0.0, 7.0);

    let hzb00 = textureSampleLevel(hzbTexture, hzbSampler, minUV, mipLevel).r;
    let hzb10 = textureSampleLevel(hzbTexture, hzbSampler, vec2<f32>(maxUV.x, minUV.y), mipLevel).r;
    let hzb01 = textureSampleLevel(hzbTexture, hzbSampler, vec2<f32>(minUV.x, maxUV.y), mipLevel).r;
    let hzb11 = textureSampleLevel(hzbTexture, hzbSampler, maxUV, mipLevel).r;
    let maxHZBDepth = max(max(hzb00, hzb10), max(hzb01, hzb11));

    
    if (minDepth > maxHZBDepth + 0.002) {
        return false;
    }

    return true;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>, @builtin(local_invocation_id) local_id: vec3<u32>) {
    let localIdx = local_id.x;

    if (localIdx < 8u) {
        atomicStore(&wgCounts[localIdx], 0u);
        atomicStore(&wgLocalSlots[localIdx], 0u);
    }
    workgroupBarrier();

    let index = global_id.x;
    var isVisible = false;
    var lodLevel = 0u;

    if (index < uniforms.tileCount) {
        let tile = allInputTiles[index];
        let halfTileX = uniforms.tileSizeX * 0.5;
        let halfTileZ = uniforms.tileSizeZ * 0.5;
        let heightScale = uniforms.heightScale;

        let minPos = vec3<f32>(tile.worldX - halfTileX, -max(50.0, heightScale * 0.1), tile.worldZ - halfTileZ);
        let maxPos = vec3<f32>(tile.worldX + halfTileX, heightScale + max(50.0, heightScale * 0.1), tile.worldZ + halfTileZ);

        if (checkAABBInFrustum(minPos, maxPos)) {
            var isOccluded = false;
            if (uniforms.hasHZB != 0u) {
                if (!checkAABBInHZB(minPos, maxPos)) {
                    isOccluded = true;
                }
            }

            if (!isOccluded) {
                let dx = tile.worldX - uniforms.cameraPosition.x;
                let dz = tile.worldZ - uniforms.cameraPosition.z;
                let dy = uniforms.cameraPosition.y;
                let distSq = dx * dx + dz * dz + dy * dy;

                let isScreenSizeMetric = uniforms.lodMetric >= 0.5;
                let metricFactor = select(1.0, uniforms.tanHalfFOV, isScreenSizeMetric);
                let effectiveDistSq = distSq * (metricFactor * metricFactor);

                lodLevel = uniforms.maxLODLevel - 1u;
                for (var lod = 0u; lod < uniforms.maxLODLevel; lod = lod + 1u) {
                    let packedVec = uniforms.lodDistancesSq[lod / 4u];
                    let thresholdSq = packedVec[lod % 4u];
                    if (effectiveDistSq < thresholdSq) {
                        lodLevel = lod;
                        break;
                    }
                }

                isVisible = true;
                atomicAdd(&wgCounts[lodLevel], 1u);
            }
        }
    }

    workgroupBarrier();

    if (localIdx < uniforms.maxLODLevel) {
        let count = atomicLoad(&wgCounts[localIdx]);
        if (count > 0u) {
            wgGlobalOffsets[localIdx] = atomicAdd(&indirectDrawArgs[localIdx].instanceCount, count);
        }
    }

    workgroupBarrier();

    if (isVisible) {
        let localSlot = atomicAdd(&wgLocalSlots[lodLevel], 1u);
        let globalOffset = wgGlobalOffsets[lodLevel];
        let targetIndex = lodLevel * uniforms.tileCount + globalOffset + localSlot;
        visibleTileIndices[targetIndex] = index;
    }
}
