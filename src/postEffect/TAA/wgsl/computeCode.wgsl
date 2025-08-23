let index = vec2<u32>(global_id.xy);
let dims = vec2<u32>(textureDimensions(sourceTexture));

// 경계 검사
if (any(index >= dims)) {
    return;
}

// 현재 프레임 색상
let currentColor = textureLoad(sourceTexture, index).rgb;

var finalColor = currentColor;

// 첫 몇 프레임은 히스토리 없이 현재 프레임만 출력 (더 안전하게)
if (uniforms.frameIndex < 3) {
    finalColor = currentColor;
} else {
    // 이전 프레임에서 같은 위치의 색상 가져오기
    let motionVector = textureLoad(motionVectorTexture, index, 0).xy;
    let prevScreenPos = vec2<f32>(index) - motionVector * vec2<f32>(dims);
    let prevIndex = vec2<i32>(prevScreenPos + 0.5);

    var historyColor = textureLoad(previousFrameTexture, vec2<i32>(index)).rgb;

    // 히스토리 유효성 검사 강화
    let historySum = dot(historyColor, vec3<f32>(1.0));
    if (historySum > 0.001 && historySum < 50.0) {  // 더 엄격한 범위
        // 네이버후드 클램핑을 위한 min/max 계산
        var minColor = currentColor;
        var maxColor = currentColor;

        let neighbors = array<vec2<i32>, 5>(
            vec2<i32>(0, 0),   // 중심
            vec2<i32>(-1, 0),  // 왼쪽
            vec2<i32>(1, 0),   // 오른쪽
            vec2<i32>(0, -1),  // 위
            vec2<i32>(0, 1)    // 아래
        );

        for (var i = 0; i < 5; i++) {
            let offset = neighbors[i];
            let nx = clamp(i32(index.x) + offset.x, 0, i32(dims.x) - 1);
            let ny = clamp(i32(index.y) + offset.y, 0, i32(dims.y) - 1);
            let neighbor = textureLoad(sourceTexture, vec2<u32>(vec2<i32>(nx, ny))).rgb;
            minColor = min(minColor, neighbor);
            maxColor = max(maxColor, neighbor);
        }


        // 히스토리 색상을 네이버후드 범위로 클램핑 (고스팅 방지)
        historyColor = clamp(historyColor, minColor, maxColor);

        // 단순한 템포럴 블렌딩
        finalColor = mix(historyColor, currentColor, uniforms.temporalBlendFactor);
    } else {
        // 히스토리가 유효하지 않으면 현재 색상만 사용
        finalColor = currentColor;
    }
}

// 결과 저장
textureStore(outputTexture, index, vec4<f32>(finalColor, 1.0));
