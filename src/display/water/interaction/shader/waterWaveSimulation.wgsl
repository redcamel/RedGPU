struct SimUniforms {
    waveSpeed: f32,       // 파동 전파 속도 c (0.1 ~ 0.45)
    damping: f32,         // 감쇄율 gamma (0.02 ~ 0.08)
    _pad_sim0: f32,
    normalStrength: f32,  // 파문 노멀 강도 (0.5 ~ 2.0)
    shiftX: f32,          // 도메인 X 이동에 따른 텍셀 오프셋 (정수형 텍셀 시프트)
    shiftZ: f32,          // 도메인 Z 이동에 따른 텍셀 오프셋 (정수형 텍셀 시프트)
    pad1: f32,
    pad2: f32,
};

@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var currWaveTexture: texture_2d<f32>;       // R: h_curr, G: h_prev
@group(0) @binding(2) var captureTexture: texture_2d<f32>;        // R: impulse
@group(0) @binding(3) var nextWaveTexture: texture_storage_2d<rgba16float, write>; // R: h_next, G: h_curr
@group(0) @binding(4) var rippleNormalTexture: texture_storage_2d<rgba16float, write>; // RG: N.xz, B: h_next

// 월드 공간 고정을 위한 텍셀 스크롤 보정 샘플링 함수
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

    // 8방향 이웃 좌표 계산
    let cCoord = coord;
    let lCoord = vec2<i32>(max(0, x - 1), y);
    let rCoord = vec2<i32>(min(maxX, x + 1), y);
    let uCoord = vec2<i32>(x, max(0, y - 1));
    let dCoord = vec2<i32>(x, min(maxY, y + 1));

    let ulCoord = vec2<i32>(max(0, x - 1), max(0, y - 1));
    let urCoord = vec2<i32>(min(maxX, x + 1), max(0, y - 1));
    let dlCoord = vec2<i32>(max(0, x - 1), min(maxY, y + 1));
    let drCoord = vec2<i32>(min(maxX, x + 1), min(maxY, y + 1));

    // 이전 프레임 데이터 (월드 공간 고정 텍셀 시프트 적용)
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

    // 9-Point 등방성 2D 라플라시안 (사각 왜곡 없는 완전한 동심원 형성)
    let laplacian = (
        (hLeft + hRight + hUp + hDown) * 0.5 +
        (hUL + hUR + hDL + hDR) * 0.25 -
        3.0 * hCenter
    ) * 0.333333;

    let c = uniforms.waveSpeed;
    let gamma = uniforms.damping;

    var hNext = (2.0 - gamma) * hCenter - (1.0 - gamma) * hPrev + (4.0 * c * c) * laplacian;

    // 현재 프레임 캡처 충격량 (현재 프레임 도메인 윈도우 기준)
    let captureData = textureLoad(captureTexture, cCoord, 0);
    let impulse = captureData.r;

    // 충격량 주입 (과도한 충격량 및 파고 클램핑으로 보강 간섭 폭발 방지)
    let safeImpulse = clamp(impulse, 0.0, 3.0);
    hNext = clamp(hNext + safeImpulse * 0.18, -1.0, 1.0);

    // 도메인 외곽 스무스 페이드아웃 (가장자리 경계선 반사 및 아티팩트 방지)
    let edgeDistX = min(x, maxX - x);
    let edgeDistY = min(y, maxY - y);
    let edgeFactor = smoothstep(0.0, 24.0, f32(min(edgeDistX, edgeDistY)));
    hNext = hNext * edgeFactor;

    // 중앙 차분 파문 노멀 계산
    let dX = (hRight - hLeft) * uniforms.normalStrength;
    let dZ = (hDown - hUp) * uniforms.normalStrength;
    let rippleNormal = normalize(vec3<f32>(-dX, 1.0, -dZ));

    // 1) 핑퐁용 시뮬레이션 상태 기록 (R: h_next, G: h_curr)
    textureStore(nextWaveTexture, coord, vec4<f32>(hNext, hCenter, 0.0, 0.0));

    // 2) 수면 셰이더 샘플링용 최종 텍스처 기록 (RG: N.xz, B: h_next)
    textureStore(rippleNormalTexture, coord, vec4<f32>(rippleNormal.x, rippleNormal.z, hNext, 0.0));
}
