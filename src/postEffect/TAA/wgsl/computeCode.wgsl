let index = vec2<u32>(global_id.xy);
let dimensions: vec2<u32> = textureDimensions(sourceTexture);

if (index.x >= dimensions.x || index.y >= dimensions.y) {
    return;
}

// 🎯 지터 적용된 좌표 계산
let jitterOffset = vec2<f32>(uniforms.currentJitterX, uniforms.currentJitterY);
let jitteredCoord = vec2<f32>(f32(index.x), f32(index.y)) - jitterOffset;

// 경계 확인 후 현재 프레임 색상 가져오기 (지터 적용)
var currentColor: vec4<f32>;
if (jitteredCoord.x >= 0.0 && jitteredCoord.y >= 0.0 &&
    jitteredCoord.x < f32(dimensions.x) && jitteredCoord.y < f32(dimensions.y)) {

    // 바이리니어 보간을 위한 좌표 분리
    let coordFloor = floor(jitteredCoord);
    let coordFract = jitteredCoord - coordFloor;
    let coord00 = vec2<u32>(coordFloor);
    let coord10 = vec2<u32>(coordFloor + vec2<f32>(1.0, 0.0));
    let coord01 = vec2<u32>(coordFloor + vec2<f32>(0.0, 1.0));
    let coord11 = vec2<u32>(coordFloor + vec2<f32>(1.0, 1.0));

    // 경계 확인 후 샘플링
    var sample00 = textureLoad(sourceTexture, coord00);
    var sample10 = sample00;
    var sample01 = sample00;
    var sample11 = sample00;

    if (coord10.x < dimensions.x) { sample10 = textureLoad(sourceTexture, coord10); }
    if (coord01.y < dimensions.y) { sample01 = textureLoad(sourceTexture, coord01); }
    if (coord11.x < dimensions.x && coord11.y < dimensions.y) { sample11 = textureLoad(sourceTexture, coord11); }

    // 바이리니어 보간
    let top = mix(sample00, sample10, coordFract.x);
    let bottom = mix(sample01, sample11, coordFract.x);
    currentColor = mix(top, bottom, coordFract.y);
} else {
    // 경계 밖인 경우 가장 가까운 픽셀 사용
    let clampedCoord = clamp(vec2<u32>(jitteredCoord), vec2<u32>(0u), dimensions - vec2<u32>(1u));
    currentColor = textureLoad(sourceTexture, clampedCoord);
}

// 🎯 텍스처 배열에서 이전 프레임들 샘플링
if (uniforms.frameIndex < 2.0) {
    // 첫 번째나 두 번째 프레임은 그대로 출력
    textureStore(outputTexture, index, currentColor);
    return;
}

// 8개 프레임을 사용한 고급 TAA 처리
let currentFrameSliceIndex = i32(uniforms.currentFrameSliceIndex);

// 🎯 이전 프레임들에서 색상 정보 수집 (textureLoad 사용)
var accumulatedColor = vec3<f32>(0.0);
var totalWeight = 0.0;

// 8개 프레임에 대해 가중 평균 계산
for (var i = 0; i < 8; i++) {
    let frameIndex = (currentFrameSliceIndex - i - 1 + 8) % 8;

    // 🎯 texture_2d_array에서 textureLoad 사용 (level 0 지정)
    let previousColor = textureLoad(frameBufferArray, vec2<i32>(index), frameIndex, 0);

    // 프레임 거리에 따른 가중치 (최근 프레임일수록 높은 가중치)
    let frameDistance = f32(i + 1);
    let weight = exp(-frameDistance * 0.3) * uniforms.temporalBlendFactor;

    // 색상 차이 기반 모션 감지
    let colorDiff = length(currentColor.rgb - previousColor.rgb);
    let motionWeight = smoothstep(0.0, uniforms.motionThreshold, colorDiff);
    let adjustedWeight = weight * (1.0 - motionWeight * 0.7);

    accumulatedColor += previousColor.rgb * adjustedWeight;
    totalWeight += adjustedWeight;
}

// 3x3 neighborhood clamping (고스팅 방지) - 지터된 현재 프레임 기준
var neighborMin = currentColor.rgb;
var neighborMax = currentColor.rgb;

for (var dy = -1; dy <= 1; dy++) {
    for (var dx = -1; dx <= 1; dx++) {
        let sampleCoord = vec2<i32>(i32(index.x) + dx, i32(index.y) + dy);

        if (sampleCoord.x >= 0 && sampleCoord.y >= 0 &&
            sampleCoord.x < i32(dimensions.x) && sampleCoord.y < i32(dimensions.y)) {

            let neighborColor = textureLoad(sourceTexture, vec2<u32>(sampleCoord)).rgb;
            neighborMin = min(neighborMin, neighborColor);
            neighborMax = max(neighborMax, neighborColor);
        }
    }
}

// 최종 TAA 결과 계산
var finalColor: vec3<f32>;
if (totalWeight > 0.0) {
    let temporalResult = accumulatedColor / totalWeight;

    // Variance clipping 적용
    if (uniforms.varianceClipping > 0.5) {
        let clampedTemporal = clamp(temporalResult, neighborMin, neighborMax);
        finalColor = mix(currentColor.rgb, clampedTemporal, uniforms.temporalBlendFactor);
    } else {
        finalColor = mix(currentColor.rgb, temporalResult, uniforms.temporalBlendFactor);
    }
} else {
    finalColor = currentColor.rgb;
}

// 최종 출력
textureStore(outputTexture, index, vec4<f32>(finalColor, currentColor.a));
