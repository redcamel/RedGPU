// terrainHeightmapProcessor.wgsl
// Dedicated WebGPU Compute Shader for Terrain Heightmap Packing and Bilinear Resampling

@group(0) @binding(0) var<storage, read> rawDataBuffer: array<u32>;
@group(0) @binding(1) var<storage, read_write> outputBuffer: array<u32>;

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

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let x = global_id.x;
    let z = global_id.y;

    let targetSize = uniforms.targetTileSize;
    if (x >= targetSize || z >= targetSize) {
        return;
    }

    let dWidth = f32(uniforms.dataWidth);
    let dHeight = f32(uniforms.dataHeight);
    let tSize = f32(targetSize);

    let srcX = (f32(x) / (tSize - 1.0)) * (dWidth - 1.0);
    let srcZ = (f32(z) / (tSize - 1.0)) * (dHeight - 1.0);

    let x0 = u32(floor(srcX));
    let z0 = u32(floor(srcZ));
    let x1 = min(x0 + 1u, uniforms.dataWidth - 1u);
    let z1 = min(z0 + 1u, uniforms.dataHeight - 1u);

    let fx = srcX - f32(x0);
    let fz = srcZ - f32(z0);

    let val00 = getRawHeight(z0 * uniforms.dataWidth + x0);
    let val10 = getRawHeight(z0 * uniforms.dataWidth + x1);
    let val01 = getRawHeight(z1 * uniforms.dataWidth + x0);
    let val11 = getRawHeight(z1 * uniforms.dataWidth + x1);

    let top = mix(val00, val10, fx);
    let bottom = mix(val01, val11, fx);
    let interpolatedRaw = mix(top, bottom, fz);

    let normalizedHeight = interpolatedRaw / 65535.0;
    let packedF16Pair = pack2x16float(vec2<f32>(normalizedHeight, 0.0));

    let targetIndex = z * targetSize + x;
    let outU32Index = targetIndex / 2u;
    let isOdd = targetIndex % 2u;

    let f16Bits = packedF16Pair & 0xFFFFu;

    if (isOdd == 0u) {
        outputBuffer[outU32Index] = (outputBuffer[outU32Index] & 0xFFFF0000u) | f16Bits;
    } else {
        outputBuffer[outU32Index] = (outputBuffer[outU32Index] & 0x0000FFFFu) | (f16Bits << 16u);
    }
}
