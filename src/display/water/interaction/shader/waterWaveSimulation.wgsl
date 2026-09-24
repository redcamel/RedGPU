struct SimUniforms {
    waveSpeed: f32,
    damping: f32,
    normalStrength: f32,
    shiftX: f32,
    shiftZ: f32,
    padding01: f32,
    padding02: f32,
    padding03: f32,
};

@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var currWaveTexture: texture_2d<f32>;
@group(0) @binding(2) var captureTexture: texture_2d<f32>;
@group(0) @binding(3) var nextWaveTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(4) var rippleNormalTexture: texture_storage_2d<rgba16float, write>;

fn samplePrevWave(coord: vec2<i32>, dims: vec2<u32>) -> vec4<f32> {
    let shifted = coord + vec2<i32>(i32(uniforms.shiftX), i32(uniforms.shiftZ));
    if (shifted.x < 0 || shifted.x >= i32(dims.x) || shifted.y < 0 || shifted.y >= i32(dims.y)) {
        return vec4<f32>(0.0);
    }
    return textureLoad(currWaveTexture, shifted, 0);
}

@compute @workgroup_size(16, 16)
fn cs_main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let dims = textureDimensions(currWaveTexture);
    let x = i32(global_id.x);
    let y = i32(global_id.y);

    if (x >= i32(dims.x) || y >= i32(dims.y)) {
        return;
    }

    let coord = vec2<i32>(x, y);
    let maxX = i32(dims.x) - 1;
    let maxY = i32(dims.y) - 1;

    let cCoord = coord;
    let lCoord = vec2<i32>(max(0, x - 1), y);
    let rCoord = vec2<i32>(min(maxX, x + 1), y);
    let uCoord = vec2<i32>(x, max(0, y - 1));
    let dCoord = vec2<i32>(x, min(maxY, y + 1));

    let ulCoord = vec2<i32>(max(0, x - 1), max(0, y - 1));
    let urCoord = vec2<i32>(min(maxX, x + 1), max(0, y - 1));
    let dlCoord = vec2<i32>(max(0, x - 1), min(maxY, y + 1));
    let drCoord = vec2<i32>(min(maxX, x + 1), min(maxY, y + 1));

    let cData = samplePrevWave(cCoord, dims);
    let hCenter = cData.r;
    let hPrev = cData.g;

    let hLeft = samplePrevWave(lCoord, dims).r;
    let hRight = samplePrevWave(rCoord, dims).r;
    let hUp = samplePrevWave(uCoord, dims).r;
    let hDown = samplePrevWave(dCoord, dims).r;

    let hUL = samplePrevWave(ulCoord, dims).r;
    let hUR = samplePrevWave(urCoord, dims).r;
    let hDL = samplePrevWave(dlCoord, dims).r;
    let hDR = samplePrevWave(drCoord, dims).r;

    let laplacian = (
        (hLeft + hRight + hUp + hDown) * 0.5 +
        (hUL + hUR + hDL + hDR) * 0.25 -
        3.0 * hCenter
    ) * 0.333333;

    let c = uniforms.waveSpeed;
    let gamma = uniforms.damping;

    var hNext = (2.0 - gamma) * hCenter - (1.0 - gamma) * hPrev + (4.0 * c * c) * laplacian;

    let captureData = textureLoad(captureTexture, cCoord, 0);
    let impulse = captureData.r;

    let safeImpulse = clamp(impulse, 0.0, 4.0);
    hNext = clamp(hNext + safeImpulse * 0.25, -1.0, 1.0);

    let edgeDistX = min(x, maxX - x);
    let edgeDistY = min(y, maxY - y);
    let edgeFactor = smoothstep(0.0, 24.0, f32(min(edgeDistX, edgeDistY)));
    hNext = hNext * edgeFactor;

    let invTwoDx = 16.0;
    let dX = (hRight - hLeft) * invTwoDx * uniforms.normalStrength;
    let dZ = (hDown - hUp) * invTwoDx * uniforms.normalStrength;
    let rippleNormal = normalize(vec3<f32>(-dX, 1.0, -dZ));

    textureStore(nextWaveTexture, coord, vec4<f32>(hNext, hCenter, 0.0, 0.0));
    textureStore(rippleNormalTexture, coord, vec4<f32>(rippleNormal.x, rippleNormal.z, hNext, 0.0));
}
