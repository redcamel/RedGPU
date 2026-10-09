struct CameraFrustumUniforms {

    viewProjectionMatrix: mat4x4<f32>,
    frustumPlanes: array<vec4<f32>, 6>,
    lodDistancesSq: array<vec4<f32>, 2>,

    cameraPosition: vec3<f32>,
    lodMaxLevel: u32,
    tileSizeX: f32,
    tileSizeZ: f32,
    heightScale: f32,
    tileCount: u32,
    tanHalfFOV: f32,
    lodMetric: f32,
    useHZB: u32,

    padEnd: array<f32, 5>,
};

#redgpu_include landscape.struct.LandscapeTile;
#redgpu_include landscape.struct.DrawIndexedIndirectArgs;
#redgpu_include landscape.math.checkAABBInHZB;

@group(0) @binding(0) var<uniform> uniforms: CameraFrustumUniforms;
@group(0) @binding(1) var<storage, read> allTiles: array<LandscapeTile>;
@group(0) @binding(2) var<storage, read_write> visibleTiles: array<LandscapeTile>;
@group(0) @binding(3) var<storage, read_write> indirectCommands: array<DrawIndexedIndirectArgs>;
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
    var currentTile: LandscapeTile;

    if (index < uniforms.tileCount) {
        currentTile = allTiles[index];
        let tile = currentTile;
        let halfTileX = uniforms.tileSizeX * 0.5;
        let halfTileZ = uniforms.tileSizeZ * 0.5;
        let heightScale = uniforms.heightScale;

        let minY = tile.minHeightNorm * heightScale;
        let maxY = tile.maxHeightNorm * heightScale;

        let marginY = max(35.0, heightScale * 0.05);
        let marginXZ = uniforms.tileSizeX * 0.02;
        let minPos = vec3<f32>(tile.centerWorldX - halfTileX - marginXZ, minY - marginY, tile.centerWorldZ - halfTileZ - marginXZ);
        let maxPos = vec3<f32>(tile.centerWorldX + halfTileX + marginXZ, maxY + marginY, tile.centerWorldZ + halfTileZ + marginXZ);

        if (checkAABBInFrustum(minPos, maxPos)) {
            var isOccluded = false;
            if (uniforms.useHZB != 0u) {
                if (!checkAABBInHZB(minPos, maxPos, uniforms.viewProjectionMatrix, hzbTexture, hzbSampler, 0.0)) {
                    isOccluded = true;
                }
            }

            if (!isOccluded) {
                let dx = tile.centerWorldX - uniforms.cameraPosition.x;
                let dz = tile.centerWorldZ - uniforms.cameraPosition.z;
                let tileCenterY = (minY + maxY) * 0.5;
                let dy = tileCenterY - uniforms.cameraPosition.y;
                let distSq = dx * dx + dz * dz + dy * dy;

                let isScreenSizeMetric = uniforms.lodMetric >= 0.5;
                let metricFactor = select(1.0, uniforms.tanHalfFOV, isScreenSizeMetric);
                let effectiveDistSq = distSq * (metricFactor * metricFactor);

                lodLevel = uniforms.lodMaxLevel - 1u;
                for (var lod = 0u; lod < uniforms.lodMaxLevel; lod = lod + 1u) {
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

    if (localIdx < uniforms.lodMaxLevel) {
        let count = atomicLoad(&wgCounts[localIdx]);
        if (count > 0u) {
            wgGlobalOffsets[localIdx] = atomicAdd(&indirectCommands[localIdx].instanceCount, count);
        }
    }

    workgroupBarrier();

    if (isVisible) {
        let localSlot = atomicAdd(&wgLocalSlots[lodLevel], 1u);
        let globalOffset = wgGlobalOffsets[lodLevel];
        let targetIndex = lodLevel * uniforms.tileCount + globalOffset + localSlot;
        visibleTiles[targetIndex] = currentTile;
    }
}
