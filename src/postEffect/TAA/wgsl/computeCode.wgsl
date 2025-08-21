let index = vec2<u32>(global_id.xy);
let dims = vec2<u32>(textureDimensions(sourceTexture));

// 경계 검사
if (any(index >= dims)) {
    return;
}

// 현재 프레임 색상
let currentColor = textureLoad(sourceTexture, index).rgb;

// 프레임 인덱스와 히스토리 슬라이스 계산
let currentSlice = i32(uniforms.frameIndex) % 8;

var finalColor = currentColor;

// 모션벡터 비활성화 시: 멀티 프레임 블렌딩
if (uniforms.useMotionVectors < 0.5) {
    var accumulatedColor = currentColor;
    var totalWeight = 1.0;

    // 8장의 히스토리를 가중치로 블렌딩
    for (var frameOffset = 1; frameOffset < 8; frameOffset++) {
        let historySlice = (currentSlice - frameOffset + 8) % 8;
        let historyColor = textureLoad(frameBufferArray, vec2<i32>(index), historySlice, 0).rgb;

        // 히스토리 유효성 검사
        if (dot(historyColor, vec3<f32>(1.0)) > 0.001) {
            // 프레임이 오래될수록 가중치 감소 (지수적 감소)
            let frameWeight = pow(uniforms.temporalBlendFactor, f32(frameOffset));

            // 색상 차이에 따른 가중치 조정
            let colorDiff = length(currentColor - historyColor);
            let adaptiveWeight = frameWeight * (1.0 - clamp(colorDiff * 2.0, 0.0, 0.8));

            accumulatedColor += historyColor * adaptiveWeight;
            totalWeight += adaptiveWeight;
        }
    }

    finalColor = accumulatedColor / totalWeight;
    textureStore(outputTexture, index, vec4<f32>(finalColor, 1.0));
    return;
}

// -----------------------------
// 모션벡터 기반 멀티 프레임 TAA
// -----------------------------

// 모션벡터 로드 및 변환
var motionVec = textureLoad(motionVectorTexture, index, 0).xy;
motionVec *= uniforms.motionVectorScale;

let dimsF = vec2<f32>(dims);
let pixelMotion = motionVec * dimsF * 0.5;
let motionMagnitude = length(pixelMotion);

// 멀티 프레임 히스토리 블렌딩
var accumulatedColor = currentColor;
var totalWeight = 1.0;

// 네이버후드 min/max 계산 (variance clipping용)
var minColor = currentColor;
var maxColor = currentColor;

if (uniforms.varianceClipping > 0.5) {
    for (var dy = -1; dy <= 1; dy++) {
        for (var dx = -1; dx <= 1; dx++) {
            let nx = clamp(i32(index.x) + dx, 0, i32(dims.x) - 1);
            let ny = clamp(i32(index.y) + dy, 0, i32(dims.y) - 1);
            let neighbor = textureLoad(sourceTexture, vec2<u32>(vec2<i32>(nx, ny))).rgb;
            minColor = min(minColor, neighbor);
            maxColor = max(maxColor, neighbor);
        }
    }
}

// 모든 히스토리 프레임에 대해 반복
for (var frameOffset = 1; frameOffset < 8; frameOffset++) {
    let historySlice = (currentSlice - frameOffset + 8) % 8;

    // 모션벡터를 고려한 이전 프레임 위치 계산
    let scaledMotion = pixelMotion * f32(frameOffset); // 프레임 수만큼 모션 누적
    let prevPos = vec2<f32>(index) - scaledMotion;
    let prevPosClamped = clamp(prevPos, vec2<f32>(0.0), dimsF - vec2<f32>(1.0));

    // bilinear 샘플링
    let base = vec2<i32>(floor(prevPosClamped));
    let frac = prevPosClamped - vec2<f32>(base);

    // 경계 안전 체크
    let validBase = base.x >= 0 && base.y >= 0 && base.x < i32(dims.x) - 1 && base.y < i32(dims.y) - 1;

    if (validBase) {
        // bilinear 히스토리 샘플링
        let c00 = textureLoad(frameBufferArray, base, historySlice, 0).rgb;
        let c10 = textureLoad(frameBufferArray, base + vec2<i32>(1, 0), historySlice, 0).rgb;
        let c01 = textureLoad(frameBufferArray, base + vec2<i32>(0, 1), historySlice, 0).rgb;
        let c11 = textureLoad(frameBufferArray, base + vec2<i32>(1, 1), historySlice, 0).rgb;

        let hx0 = mix(c00, c10, frac.x);
        let hx1 = mix(c01, c11, frac.x);
        var historyColor = mix(hx0, hx1, frac.y);

        // 히스토리 유효성 검사
        if (dot(historyColor, vec3<f32>(1.0)) > 0.001) {
            // Variance clipping 적용
            if (uniforms.varianceClipping > 0.5) {
                let padding = 0.1;
                let expandedMin = mix(minColor, vec3<f32>(0.0), padding);
                let expandedMax = mix(maxColor, vec3<f32>(1.0), padding);
                historyColor = clamp(historyColor, expandedMin, expandedMax);
            }

            // 프레임별 기본 가중치 (시간에 따른 지수적 감소)
            var frameWeight = pow(uniforms.temporalBlendFactor, f32(frameOffset));

            // 색상 차이에 따른 가중치 조정
            let colorDiff = length(currentColor - historyColor);
            let colorDiffFactor = smoothstep(0.0, uniforms.disocclusionThreshold, colorDiff);
            frameWeight *= (1.0 - colorDiffFactor * 0.7);

            // 모션에 따른 가중치 조정
            let motionScale = uniforms.motionVectorIntensity;
            let frameMotionMagnitude = length(scaledMotion);
            let motionFactor = smoothstep(0.0, 8.0, frameMotionMagnitude * motionScale);
            frameWeight *= (1.0 - motionFactor * 0.6);

            // 모션 블러 감소 적용
            frameWeight = mix(frameWeight, frameWeight * 0.5, uniforms.motionBlurReduction);

            // 최소 가중치 보장
            frameWeight = max(frameWeight, 0.01);

            // 누적
            accumulatedColor += historyColor * frameWeight;
            totalWeight += frameWeight;
        }
    }
}

// 최종 정규화
finalColor = accumulatedColor / totalWeight;

// 결과 저장
textureStore(outputTexture, index, vec4<f32>(finalColor, 1.0));
