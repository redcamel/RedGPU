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

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let x = global_id.x;
    let z = global_id.y;

    let targetSize = uniforms.targetTileSize;
    if (x >= targetSize || z >= targetSize) {
        return;
    }

    let tSize = f32(targetSize);
    
    // 1. 현재 중심 높이값
    let hCenter = getInterpolatedHeightAt(f32(x), f32(z), tSize);

    // 2. 주변 4방향 높이값 계산 (경사도 연산용)
    let hL = getInterpolatedHeightAt(max(f32(x) - 1.0, 0.0), f32(z), tSize);
    let hR = getInterpolatedHeightAt(min(f32(x) + 1.0, tSize - 1.0), f32(z), tSize);
    let hD = getInterpolatedHeightAt(f32(x), max(f32(z) - 1.0, 0.0), tSize);
    let hU = getInterpolatedHeightAt(f32(x), min(f32(z) + 1.0, tSize - 1.0), tSize);

    // 지형의 경사 스케일 인자 (가상 크기)
    let stepX = 2.0 / tSize;
    let stepZ = 2.0 / tSize;
    
    // 높이의 정규 경사 범위를 0~1에서 적절한 스케일로 적용
    let heightRange = 0.5; 

    let tangentX = vec3<f32>(stepX, (hR - hL) * heightRange, 0.0);
    let tangentZ = vec3<f32>(0.0, (hD - hU) * heightRange, stepZ);

    // 외적을 통해 법선(Normal) 벡터 추출
    let normal = normalize(cross(tangentZ, tangentX));

    // 3. rgba16float 포맷 팩킹 (4개의 16비트 float 값을 2개의 u32(8Bytes)로 압축)
    let packed0 = pack2x16float(vec2<f32>(hCenter, normal.x));
    let packed1 = pack2x16float(vec2<f32>(normal.y, normal.z));

    let targetIndex = z * targetSize + x;
    outputBuffer[targetIndex] = vec2<u32>(packed0, packed1);
}
