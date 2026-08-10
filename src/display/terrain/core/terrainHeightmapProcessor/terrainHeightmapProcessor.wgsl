// terrainHeightmapProcessor.wgsl
// Dedicated WebGPU Compute Shader for Terrain Heightmap Packing, Bilinear Resampling, and Normal map baking

@group(0) @binding(0) var<storage, read> rawDataBuffer: array<u32>;
@group(0) @binding(1) var<storage, read_write> outputBuffer: array<vec2<u32>>; // rgba16float 버퍼 (픽셀당 8바이트, u32 2개)

struct TileUniforms {
    targetTileSize: u32,
    dataWidth: u32,
    dataHeight: u32,
    dataType: u32, // 0 = Uint16, 1 = Float32
};
@group(0) @binding(2) var<uniform> uniforms: TileUniforms;

fn getRawHeight(sampleIndex: u32) -> f32 {
    if (uniforms.dataType == 1u) {
        let valF32 = bitcast<f32>(rawDataBuffer[sampleIndex]);
        return clamp(valF32, 0.0, 1.0) * 65535.0;
    } else {
        let u32Index = sampleIndex / 2u;
        let isOdd = sampleIndex % 2u;
        let packedU32 = rawDataBuffer[u32Index];
        var raw16: u32 = 0u;
        if (isOdd == 0u) {
            raw16 = packedU32 & 0xFFFFu;
        } else {
            raw16 = (packedU32 >> 16u) & 0xFFFFu;
        }
        return f32(raw16);
    }
}

// 특정 (x, z) 픽셀의 보간된 높이값 계산 헬퍼 함수
fn getInterpolatedHeightAt(pixelX: f32, pixelZ: f32, targetSize: f32) -> f32 {
    let dWidth = f32(uniforms.dataWidth);
    let dHeight = f32(uniforms.dataHeight);

    let srcX = (pixelX / (targetSize - 1.0)) * (dWidth - 1.0);
    let srcZ = (pixelZ / (targetSize - 1.0)) * (dHeight - 1.0);

    let clampedX = clamp(srcX, 0.0, dWidth - 1.0);
    let clampedZ = clamp(srcZ, 0.0, dHeight - 1.0);

    let x0 = u32(floor(clampedX));
    let z0 = u32(floor(clampedZ));
    let x1 = min(x0 + 1u, uniforms.dataWidth - 1u);
    let z1 = min(z0 + 1u, uniforms.dataHeight - 1u);

    let fx = clampedX - f32(x0);
    let fz = clampedZ - f32(z0);

    let val00 = getRawHeight(z0 * uniforms.dataWidth + x0);
    let val10 = getRawHeight(z0 * uniforms.dataWidth + x1);
    let val01 = getRawHeight(z1 * uniforms.dataWidth + x0);
    let val11 = getRawHeight(z1 * uniforms.dataWidth + x1);

    let top = mix(val00, val10, fx);
    let bottom = mix(val01, val11, fx);
    return mix(top, bottom, fz) / 65535.0;
}

// 18x18 Workgroup Shared Memory (LDS) 캐시 (16x16 타일 + 외곽 1픽셀 패딩)
var<workgroup> tileHeightCache: array<array<f32, 18>, 18>;

@compute @workgroup_size(16, 16)
fn main(
    @builtin(global_invocation_id) global_id: vec3<u32>,
    @builtin(local_invocation_id) local_id: vec3<u32>,
    @builtin(workgroup_id) workgroup_id: vec3<u32>
) {
    let linearId = local_id.y * 16u + local_id.x;
    let targetSize = uniforms.targetTileSize;
    let targetSizeI32 = i32(targetSize);

    // 1. 256개 스레드가 협력하여 18x18 (총 324개) 캐시 셀을 Shared Memory에 로드 (스레드당 1~2개 로드)
    // 1차 바운드: linearId 0..255 (256개 셀)
    if (linearId < 324u) {
        let cacheZ = linearId / 18u;
        let cacheX = linearId % 18u;

        let targetX = clamp(i32(workgroup_id.x * 16u + cacheX) - 1, 0, targetSizeI32 - 1);
        let targetZ = clamp(i32(workgroup_id.y * 16u + cacheZ) - 1, 0, targetSizeI32 - 1);

        tileHeightCache[cacheZ][cacheX] = getInterpolatedHeightAt(f32(targetX), f32(targetZ), f32(targetSize));
    }

    // 2차 바운드: linearId + 256 (남은 68개 셀: 256..323)
    let secondId = linearId + 256u;
    if (secondId < 324u) {
        let cacheZ = secondId / 18u;
        let cacheX = secondId % 18u;

        let targetX = clamp(i32(workgroup_id.x * 16u + cacheX) - 1, 0, targetSizeI32 - 1);
        let targetZ = clamp(i32(workgroup_id.y * 16u + cacheZ) - 1, 0, targetSizeI32 - 1);

        tileHeightCache[cacheZ][cacheX] = getInterpolatedHeightAt(f32(targetX), f32(targetZ), f32(targetSize));
    }

    // 모든 스레드의 Shared Memory 로드가 완료될 때까지 동기화
    workgroupBarrier();

    // 2. 바운드 타일 범위를 벗어난 스레드는 종료
    let x = global_id.x;
    let z = global_id.y;
    if (x >= targetSize || z >= targetSize) {
        return;
    }

    // 3. Shared Memory(LDS)에서 O(1) 초고속 샘플링 (SSBO 무작위 탐색 20회 -> 0회)
    let cz = local_id.y + 1u;
    let cx = local_id.x + 1u;

    let hCenter = tileHeightCache[cz][cx];
    let hL      = tileHeightCache[cz][cx - 1u];
    let hR      = tileHeightCache[cz][cx + 1u];
    let hD      = tileHeightCache[cz - 1u][cx];
    let hU      = tileHeightCache[cz + 1u][cx];

    // 4. 지형 경사도 계산 및 노멀 벡터 복원 (cross 외적식 간소화)
    let tSize = f32(targetSize);
    let stepX = 2.0 / tSize;
    let stepZ = 2.0 / tSize;
    let heightRange = 0.5;

    let dhx = (hR - hL) * heightRange / stepX;
    let dhz = (hD - hU) * heightRange / stepZ;

    let normal = normalize(vec3<f32>(-dhx, 1.0, -dhz));

    // 5. rgba16float 포맷 팩킹 (4개의 16비트 float 값을 2개의 u32(8Bytes)로 압축하여 출력)
    let packed0 = pack2x16float(vec2<f32>(hCenter, normal.x));
    let packed1 = pack2x16float(vec2<f32>(normal.y, normal.z));

    let targetIndex = z * targetSize + x;
    outputBuffer[targetIndex] = vec2<u32>(packed0, packed1);
}

