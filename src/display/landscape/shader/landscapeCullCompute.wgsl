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
    frustumPlanes: array<vec4<f32>, 6>,
    lodDistancesSq: array<vec4<f32>, 2>,
};

struct InputTileData {
    worldX: f32,
    worldZ: f32,
    prevWorldX: f32,
    prevWorldZ: f32,
    color: vec4<f32>,
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
