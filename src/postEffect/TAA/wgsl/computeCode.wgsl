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

// 이전 프레임 텍스처 존재 여부 확인
let previousFrameExists = textureDimensions(previousFrame).x > 1u;

if (!previousFrameExists || uniforms.frameIndex < 2.0) {
    // 첫 번째나 두 번째 프레임은 그대로 출력 (안정성)
    textureStore(outputTexture, index, currentColor);
    return;
}

// 이전 프레임 색상 가져오기 (지터 보정 없이)
let previousColor = textureLoad(previousFrame, index);

// 🎯 지터 강도에 따른 TAA 블렌딩
let colorDiff = length(currentColor.rgb - previousColor.rgb);

// 부드러운 모션 감지
let motionFactor = smoothstep(0.0, uniforms.motionThreshold * 2.0, colorDiff);

// 지터 강도에 따른 블렌딩 팩터 조정
let baseBlendFactor = uniforms.temporalBlendFactor;
let jitterAdjustedBlend = baseBlendFactor * (1.0 + uniforms.jitterStrength * 0.5);
let stableBlendFactor = mix(jitterAdjustedBlend, 0.3, motionFactor);

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

// 이전 프레임 클램핑 (고스팅 방지)
let clampedPrevious = clamp(previousColor.rgb, neighborMin, neighborMax);

// 🎯 지터 적용된 TAA 블렌딩
let taaResult = mix(currentColor.rgb, clampedPrevious, stableBlendFactor);

// 디버그용 지터 시각화 (옵션)
// let jitterVisualization = vec3<f32>(abs(jitterOffset.x) * 10.0, abs(jitterOffset.y) * 10.0, 0.0);
// let finalColor = mix(taaResult, jitterVisualization, 0.1);

let finalColor = taaResult;

textureStore(outputTexture, index, vec4<f32>(finalColor, currentColor.a));
