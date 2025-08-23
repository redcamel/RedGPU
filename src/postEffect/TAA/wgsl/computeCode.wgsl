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
let prevSlice = (currentSlice - 1 + 8) % 8;

// 이전 누적된 히스토리 색상 로드
var historyColor = textureLoad(frameBufferArray, vec2<i32>(index), prevSlice, 0).rgb;

var finalColor = currentColor;

// 디버깅: 첫 몇 프레임은 히스토리 없이 현재 프레임만 출력
if (uniforms.frameIndex < 2) {
    finalColor = currentColor;
} else {
    // 히스토리가 유효한지 더 관대하게 검사
    if (dot(historyColor, vec3<f32>(1.0)) > 0.0001) {
        // 네이버후드 클램핑을 위한 min/max 계산
        var minColor = currentColor;
        var maxColor = currentColor;

        // 3x3 네이버후드 탐색
        for (var dy = -1; dy <= 1; dy++) {
            for (var dx = -1; dx <= 1; dx++) {
                let nx = clamp(i32(index.x) + dx, 0, i32(dims.x) - 1);
                let ny = clamp(i32(index.y) + dy, 0, i32(dims.y) - 1);
                let neighbor = textureLoad(sourceTexture, vec2<u32>(vec2<i32>(nx, ny))).rgb;
                minColor = min(minColor, neighbor);
                maxColor = max(maxColor, neighbor);
            }
        }

        // 히스토리 색상을 네이버후드 범위로 클램핑
        historyColor = clamp(historyColor, minColor, maxColor);

        // TAA 블렌딩 (더 강한 히스토리 가중치)
        finalColor = mix(historyColor, currentColor, uniforms.temporalBlendFactor);

        // 디버깅: 히스토리가 적용되면 약간 틴트 추가
        if (uniforms.frameIndex < 100) {
            finalColor = mix(finalColor, vec3<f32>(finalColor.r, finalColor.g * 1.1, finalColor.b), 0.1);
        }
    }
}

// 결과 저장
textureStore(outputTexture, index, vec4<f32>(finalColor, 1.0));
