struct Constants {
    width: u32,
    height: u32,
}

@group(0) @binding(0) var<storage, read> inputData: array<f32>;
@group(0) @binding(1) var<storage, read_write> outputData: array<u32>;
@group(0) @binding(2) var<uniform> constants: Constants;

fn floatToHalf(value: f32) -> u32 {
    let bits = bitcast<u32>(value);
    let sign = (bits >> 16u) & 0x8000u;
    var exp = (bits >> 23u) & 0xFFu;
    var mantissa = bits & 0x7FFFFFu;

    if (exp == 0u) {
        return sign;
    }

    if (exp == 255u) {
        return sign | 0x7C00u | select(0u, 1u, mantissa != 0u);
    }

    let newExp = i32(exp) - 127 + 15;
    if (newExp <= 0) {
        return sign;
    }
    if (newExp >= 31) {
        return sign | 0x7C00u;
    }

    return sign | (u32(newExp) << 10u) | (mantissa >> 13u);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let x = global_id.x;
    let y = global_id.y;

    if (x >= constants.width || y >= constants.height) {
        return;
    }

    let pixelIndex = y * constants.width + x;
    let baseIndex = pixelIndex * 4u;

    let r = inputData[baseIndex];
    let g = inputData[baseIndex + 1u];
    let b = inputData[baseIndex + 2u];
    let a = inputData[baseIndex + 3u];

    let r16 = floatToHalf(r);
    let g16 = floatToHalf(g);
    let b16 = floatToHalf(b);
    let a16 = floatToHalf(a);

    let outputIndex = pixelIndex * 2u;
    outputData[outputIndex] = (g16 << 16u) | r16;
    outputData[outputIndex + 1u] = (a16 << 16u) | b16;
}
