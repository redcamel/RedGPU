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

    pad0: f32, // 256-byte alignment tail padding
    pad1: f32,
    pad2: f32,
    pad3: f32,
    pad4: f32,
};

struct LandscapeTile {
    centerWorldX: f32,
    centerWorldZ: f32,
    minHeightNorm: f32,
    maxHeightNorm: f32,
};

struct DrawIndexedIndirectArgs {
    indexCount: u32,
    instanceCount: atomic<u32>,
    firstIndex: u32,
    baseVertex: u32,
    firstInstance: u32,
};

fn checkAABBInHZB(
    minPos: vec3<f32>,
    maxPos: vec3<f32>,
    viewProjectionMatrix: mat4x4<f32>,
    hzbTexture: texture_2d<f32>,
    hzbSampler: sampler,
    depthBias: f32
) -> bool {
    let col0 = viewProjectionMatrix[0];
    let col1 = viewProjectionMatrix[1];
    let col2 = viewProjectionMatrix[2];
    let col3 = viewProjectionMatrix[3];

    let xMin0 = minPos.x * col0;
    let xMax0 = maxPos.x * col0;
    let yMin1 = minPos.y * col1;
    let yMax1 = maxPos.y * col1;
    let zMin2 = minPos.z * col2;
    let zMax2 = maxPos.z * col2;

    let baseZ0 = zMin2 + col3;
    let baseZ1 = zMax2 + col3;

    let xy00 = xMin0 + yMin1;
    let xy10 = xMax0 + yMin1;
    let xy01 = xMin0 + yMax1;
    let xy11 = xMax0 + yMax1;

    let c0 = xy00 + baseZ0;
    let c1 = xy10 + baseZ0;
    let c2 = xy01 + baseZ0;
    let c3 = xy11 + baseZ0;
    let c4 = xy00 + baseZ1;
    let c5 = xy10 + baseZ1;
    let c6 = xy01 + baseZ1;
    let c7 = xy11 + baseZ1;

    if (c0.w <= 0.01 || c1.w <= 0.01 || c2.w <= 0.01 || c3.w <= 0.01 ||
        c4.w <= 0.01 || c5.w <= 0.01 || c6.w <= 0.01 || c7.w <= 0.01) {
        return true;
    }

    let invW0 = 1.0 / c0.w;
    var minNDC = c0.xy * invW0;
    var maxNDC = minNDC;
    var minDepth = c0.z * invW0;

    let invW1 = 1.0 / c1.w;
    let ndc1 = c1.xy * invW1;
    minNDC = min(minNDC, ndc1);
    maxNDC = max(maxNDC, ndc1);
    minDepth = min(minDepth, c1.z * invW1);

    let invW2 = 1.0 / c2.w;
    let ndc2 = c2.xy * invW2;
    minNDC = min(minNDC, ndc2);
    maxNDC = max(maxNDC, ndc2);
    minDepth = min(minDepth, c2.z * invW2);

    let invW3 = 1.0 / c3.w;
    let ndc3 = c3.xy * invW3;
    minNDC = min(minNDC, ndc3);
    maxNDC = max(maxNDC, ndc3);
    minDepth = min(minDepth, c3.z * invW3);

    let invW4 = 1.0 / c4.w;
    let ndc4 = c4.xy * invW4;
    minNDC = min(minNDC, ndc4);
    maxNDC = max(maxNDC, ndc4);
    minDepth = min(minDepth, c4.z * invW4);

    let invW5 = 1.0 / c5.w;
    let ndc5 = c5.xy * invW5;
    minNDC = min(minNDC, ndc5);
    maxNDC = max(maxNDC, ndc5);
    minDepth = min(minDepth, c5.z * invW5);

    let invW6 = 1.0 / c6.w;
    let ndc6 = c6.xy * invW6;
    minNDC = min(minNDC, ndc6);
    maxNDC = max(maxNDC, ndc6);
    minDepth = min(minDepth, c6.z * invW6);

    let invW7 = 1.0 / c7.w;
    let ndc7 = c7.xy * invW7;
    minNDC = min(minNDC, ndc7);
    maxNDC = max(maxNDC, ndc7);
    minDepth = min(minDepth, c7.z * invW7);

    if (minDepth <= 0.001) {
        return true;
    }

    let minUV = saturate(vec2<f32>(minNDC.x * 0.5 + 0.5, 0.5 - maxNDC.y * 0.5));
    let maxUV = saturate(vec2<f32>(maxNDC.x * 0.5 + 0.5, 0.5 - minNDC.y * 0.5));

    let hzbDims = vec2<f32>(textureDimensions(hzbTexture, 0));
    let aabbPixelSize = max((maxUV - minUV) * hzbDims, vec2<f32>(1.0));
    let maxDim = max(aabbPixelSize.x, aabbPixelSize.y);

    if (maxDim < 4.0 || maxDim > hzbDims.x * 0.4) {
        return true;
    }

    let mipLevel = f32(clamp(firstLeadingBit(u32(maxDim)), 0u, 7u));

    let adaptiveBias = max(depthBias, 0.003 + minDepth * 0.004);
    let threshold = minDepth - adaptiveBias;

    let hzb00 = textureSampleLevel(hzbTexture, hzbSampler, minUV, mipLevel).r;
    if (hzb00 >= threshold) {
        return true;
    }

    let hzb10 = textureSampleLevel(hzbTexture, hzbSampler, vec2<f32>(maxUV.x, minUV.y), mipLevel).r;
    if (hzb10 >= threshold) {
        return true;
    }

    let hzb01 = textureSampleLevel(hzbTexture, hzbSampler, vec2<f32>(minUV.x, maxUV.y), mipLevel).r;
    if (hzb01 >= threshold) {
        return true;
    }

    let hzb11 = textureSampleLevel(hzbTexture, hzbSampler, maxUV, mipLevel).r;
    if (hzb11 >= threshold) {
        return true;
    }

    return false;
}

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
        let tileExtentX = uniforms.tileSizeX * 0.52;
        let tileExtentZ = uniforms.tileSizeZ * 0.52;
        let heightScale = uniforms.heightScale;

        let minY = tile.minHeightNorm * heightScale;
        let maxY = tile.maxHeightNorm * heightScale;

        let marginY = max(35.0, heightScale * 0.05);
        let minPos = vec3<f32>(tile.centerWorldX - tileExtentX, minY - marginY, tile.centerWorldZ - tileExtentZ);
        let maxPos = vec3<f32>(tile.centerWorldX + tileExtentX, maxY + marginY, tile.centerWorldZ + tileExtentZ);

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
