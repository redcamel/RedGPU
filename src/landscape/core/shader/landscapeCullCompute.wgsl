struct CameraFrustumUniforms {
    // 1. 16-byte aligned large members (total 192 bytes = 48 floats)
    viewProjectionMatrix: mat4x4<f32>,   // offset 0..63 (16 floats)
    frustumPlanes: array<vec4<f32>, 6>,  // offset 64..159 (24 floats)
    lodDistancesSq: array<vec4<f32>, 2>, // offset 160..191 (8 floats)

    // 2. Active scalar & vector members (total 44 bytes = 11 floats)
    cameraPosition: vec3<f32>,           // offset 192..203 (3 floats)
    lodMaxLevel: u32,                    // offset 204..207 (1 uint)
    tileSizeX: f32,                      // offset 208..211 (1 float)
    tileSizeZ: f32,                      // offset 212..215 (1 float)
    heightScale: f32,                    // offset 216..219 (1 float)
    tileCount: u32,                      // offset 220..223 (1 uint)
    tanHalfFOV: f32,                     // offset 224..227 (1 float)
    lodMetric: f32,                      // offset 228..231 (1 float)
    useHZB: u32,                         // offset 232..235 (1 uint)

    // 3. Consolidated end padding for 256-byte alignment (20 bytes = 5 floats)
    padEnd: array<f32, 5>,               // offset 236..255 (5 floats)
};

#redgpu_include landscape.struct.LandscapeTile;
#redgpu_include landscape.struct.DrawIndexedIndirectArgs;


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

    // [KO] 화면상 4픽셀 미만인 극원거리 타일은 HZB 다운샘플링 오차에 의한 깜빡임을 방지하기 위해 가시화 보장
    // [EN] Bypass HZB occlusion for distant tiles smaller than 4 pixels to prevent sub-texel flickering
    if (maxDim < 4.0) {
        return true;
    }

    // [KO] 4-tap 샘플링에 적합한 보수적 밉 레벨 선택 (AABB 크기 초과 방지)
    // [EN] Conservative mip level for 4-tap footprint avoiding over-culling from adjacent foreground occluders
    let mipLevel = clamp(floor(log2(maxDim)), 0.0, 7.0);

    let hzb00 = textureSampleLevel(hzbTexture, hzbSampler, minUV, mipLevel).r;
    let hzb10 = textureSampleLevel(hzbTexture, hzbSampler, vec2<f32>(maxUV.x, minUV.y), mipLevel).r;
    let hzb01 = textureSampleLevel(hzbTexture, hzbSampler, vec2<f32>(minUV.x, maxUV.y), mipLevel).r;
    let hzb11 = textureSampleLevel(hzbTexture, hzbSampler, maxUV, mipLevel).r;
    let maxHZBDepth = max(max(hzb00, hzb10), max(hzb01, hzb11));

    // [KO] 원거리 NDC 깊이 압축을 고려한 거리 적응형 안전 바이어스 (원거리 낮은 언덕 깜빡임 제거)
    // [EN] Distance-adaptive safety depth bias accounting for non-linear NDC depth precision at distance
    let adaptiveBias = 0.003 + minDepth * 0.004;
    if (minDepth > maxHZBDepth + adaptiveBias) {
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
    var currentTile: LandscapeTile;

    if (index < uniforms.tileCount) {
        currentTile = allTiles[index];
        let tile = currentTile;
        let halfTileX = uniforms.tileSizeX * 0.5;
        let halfTileZ = uniforms.tileSizeZ * 0.5;
        let heightScale = uniforms.heightScale;

        // 정규화 높이 비율(0.0~1.0)에 현재 heightScale을 곱하여 실시간 타이트 AABB 계산 (음수 스케일 미허용)
        let minY = tile.minHeightNorm * heightScale;
        let maxY = tile.maxHeightNorm * heightScale;

        // [KO] 버텍스 모핑, 스커트 기하(최대 50m) 및 완만한 저고도 언덕을 위한 충분한 수직/수평 안전 마진 확보
        // [EN] Ample vertical and horizontal safety margins for vertex geomorphing, skirts, and low-elevation hills
        let marginY = max(35.0, heightScale * 0.05);
        let marginXZ = uniforms.tileSizeX * 0.02;
        let minPos = vec3<f32>(tile.centerWorldX - halfTileX - marginXZ, minY - marginY, tile.centerWorldZ - halfTileZ - marginXZ);
        let maxPos = vec3<f32>(tile.centerWorldX + halfTileX + marginXZ, maxY + marginY, tile.centerWorldZ + halfTileZ + marginXZ);

        if (checkAABBInFrustum(minPos, maxPos)) {
            var isOccluded = false;
            if (uniforms.useHZB != 0u) {
                if (!checkAABBInHZB(minPos, maxPos)) {
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
