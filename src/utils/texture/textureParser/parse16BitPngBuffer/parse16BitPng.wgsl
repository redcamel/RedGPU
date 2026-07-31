// parse16BitPng.wgsl
// Pure WebGPU Compute Shader for 16-bit PNG Unfiltering & Direct Texture Write

struct PngMetadata {
    width: u32,
    height: u32,
    bytesPerPixel: u32,
    stride: u32,
};

@group(0) @binding(0) var<uniform> meta: PngMetadata;
@group(0) @binding(1) var<storage, read> rawData: array<u32>;
@group(0) @binding(2) var dstTexture: texture_storage_2d<r16float, write>;

fn getByte(byteIndex: u32) -> u32 {
    let wordIdx = byteIndex / 4u;
    let byteInWord = byteIndex % 4u;
    return (rawData[wordIdx] >> (byteInWord * 8u)) & 0xFFu;
}

fn paethPredictor(a: i32, b: i32, c: i32) -> i32 {
    let p = a + b - c;
    let pa = abs(p - a);
    let pb = abs(p - b);
    let pc = abs(p - c);
    if (pa <= pb && pa <= pc) {
        return a;
    } else if (pb <= pc) {
        return b;
    }
    return c;
}

@compute @workgroup_size(1, 1, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let y = global_id.y;
    if (y >= meta.height) {
        return;
    }

    let width = meta.width;
    let bpp = meta.bytesPerPixel;
    let stride = meta.stride;
    let rowStart = y * stride;

    let filterType = getByte(rowStart);

    for (var x: u32 = 0u; x < width; x = x + 1u) {
        let sampleIdx = rowStart + 1u + x * bpp;

        var highByte: u32 = getByte(sampleIdx);
        var lowByte: u32 = getByte(sampleIdx + 1u);

        if (filterType == 1u) {
            if (x > 0u) {
                let prevIdx = rowStart + 1u + (x - 1u) * bpp;
                let prevHigh = getByte(prevIdx);
                let prevLow = getByte(prevIdx + 1u);
                highByte = (highByte + prevHigh) & 0xFFu;
                lowByte = (lowByte + prevLow) & 0xFFu;
            }
        } else if (filterType == 2u) {
            if (y > 0u) {
                let upIdx = (y - 1u) * stride + 1u + x * bpp;
                let upHigh = getByte(upIdx);
                let upLow = getByte(upIdx + 1u);
                highByte = (highByte + upHigh) & 0xFFu;
                lowByte = (lowByte + upLow) & 0xFFu;
            }
        } else if (filterType == 3u) {
            var aHigh: u32 = 0u; var aLow: u32 = 0u;
            var bHigh: u32 = 0u; var bLow: u32 = 0u;
            if (x > 0u) {
                let prevIdx = rowStart + 1u + (x - 1u) * bpp;
                aHigh = getByte(prevIdx); aLow = getByte(prevIdx + 1u);
            }
            if (y > 0u) {
                let upIdx = (y - 1u) * stride + 1u + x * bpp;
                bHigh = getByte(upIdx); bLow = getByte(upIdx + 1u);
            }
            highByte = (highByte + ((aHigh + bHigh) / 2u)) & 0xFFu;
            lowByte = (lowByte + ((aLow + bLow) / 2u)) & 0xFFu;
        } else if (filterType == 4u) {
            var aHigh: u32 = 0u; var aLow: u32 = 0u;
            var bHigh: u32 = 0u; var bLow: u32 = 0u;
            var cHigh: u32 = 0u; var cLow: u32 = 0u;
            if (x > 0u) {
                let prevIdx = rowStart + 1u + (x - 1u) * bpp;
                aHigh = getByte(prevIdx); aLow = getByte(prevIdx + 1u);
            }
            if (y > 0u) {
                let upIdx = (y - 1u) * stride + 1u + x * bpp;
                bHigh = getByte(upIdx); bLow = getByte(upIdx + 1u);
            }
            if (x > 0u && y > 0u) {
                let cornerIdx = (y - 1u) * stride + 1u + (x - 1u) * bpp;
                cHigh = getByte(cornerIdx); cLow = getByte(cornerIdx + 1u);
            }
            highByte = u32(i32(highByte) + paethPredictor(i32(aHigh), i32(bHigh), i32(cHigh))) & 0xFFu;
            lowByte = u32(i32(lowByte) + paethPredictor(i32(aLow), i32(bLow), i32(cLow))) & 0xFFu;
        }

        let rawVal = (highByte << 8u) | lowByte;
        let normalized = f32(rawVal) / 65535.0;

        textureStore(dstTexture, vec2<i32>(i32(x), i32(y)), vec4<f32>(normalized, 0.0, 0.0, 1.0));
    }
}
