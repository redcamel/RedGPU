// 최대 모션 오프셋 (픽셀 단위)
const MAX_MOTION_OFFSET: f32 = 1.0;
{
    let index = vec2<u32>(global_id.xy);
    let dims  = vec2<u32>(textureDimensions(sourceTexture));
    if (any(index >= dims)) {
        return;
    }

    // 현재 컬러와 모션 벡터 읽기
    let currentTexel = textureLoad(sourceTexture, index);
    let motionVec    = textureLoad(motionVectorTexture, index, 0).xy;
    let rawMotion    = motionVec * uniforms.motionVectorScale;

    // 모션 벡터 클램핑
    let usedMotion = clamp(
        rawMotion,
        vec2<f32>(-MAX_MOTION_OFFSET),
        vec2<f32>( MAX_MOTION_OFFSET)
    );

    // 속도 기반 적응형 블렌드 계수 계산
    let motionLen  = length(rawMotion);
    let invRatio   = clamp((MAX_MOTION_OFFSET - motionLen) / MAX_MOTION_OFFSET, 0.0, 1.0);
    let blendFactor = uniforms.temporalBlendFactor * invRatio;

{
// 디버깅
//let amplifiedMotion = motionVec * 50.0;  // 50배 증폭
//let clampedMotion = vec2<f32>(
//   clamp(amplifiedMotion.x * 0.5 + 0.5, 0.0, 1.0),
//   clamp(amplifiedMotion.y * 0.5 + 0.5, 0.0, 1.0)
//);
//
//textureStore(outputTexture, index, vec4<f32>(clampedMotion ,0.5,1));
}
    // 과거 8프레임 샘플링
    let currSlice   = i32(uniforms.frameIndex) % 8;
    var accumColor  = vec3<f32>(0.0);
    var validCount  = 0.0;
    for (var i = 0; i < 8; i = i + 1) {
        let slice     = (currSlice - i - 1 + 8) % 8;
        let prevX     = f32(index.x) - usedMotion.x;
        let prevY     = f32(index.y) - usedMotion.y;
        let prevCoord = vec2<i32>(i32(prevX), i32(prevY));

        if (all(prevCoord >= vec2<i32>(0)) &&
            prevCoord.x < i32(dims.x) && prevCoord.y < i32(dims.y)) {
            let prevColor = textureLoad(frameBufferArray, prevCoord, slice, 0).rgb;
            if (dot(prevColor, vec3<f32>(1.0)) > 0.001) {
                accumColor  += prevColor;
                validCount  += 1.0;
            }
        }
    }

    // 최종 컬러 결정
    var finalColor = currentTexel.rgb;
    if (validCount >= 2.0 && blendFactor > 0.0) {
        let historyColor = accumColor / validCount;

        // 3×3 이웃 픽셀 클램프
        var minC = currentTexel.rgb;
        var maxC = currentTexel.rgb;
        for (var dy = -1; dy <= 1; dy = dy + 1) {
            for (var dx = -1; dx <= 1; dx = dx + 1) {
                let s = vec2<u32>(index.x + u32(dx), index.y + u32(dy));
                if (all(vec2<u32>(0) <= s) && all(s < dims)) {
                    let ncol = textureLoad(sourceTexture, s).rgb;
                    minC = min(minC, ncol);
                    maxC = max(maxC, ncol);
                }
            }
        }

        let clampedHistory = clamp(historyColor, minC, maxC);
        finalColor = mix(currentTexel.rgb, clampedHistory, blendFactor);
    }

    textureStore(outputTexture, index, vec4<f32>(finalColor, currentTexel.a));
}
