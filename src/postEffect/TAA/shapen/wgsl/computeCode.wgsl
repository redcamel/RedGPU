let index = vec2<u32>(global_id.xy);
let dimensions: vec2<u32> = textureDimensions(sourceTexture);

if (any(index >= dimensions)) {
    return;
}

// 1. RGBA 전체 로드 (알파 포함)
let centerRGBA = textureLoad(sourceTexture, index);
let leftRGBA   = textureLoad(sourceTexture, index - vec2<u32>(select(0u, 1u, index.x > 0u), 0u));
let rightRGBA  = textureLoad(sourceTexture, min(index + vec2<u32>(1u, 0u), dimensions - 1u));
let upRGBA     = textureLoad(sourceTexture, index - vec2<u32>(0u, select(0u, 1u, index.y > 0u)));
let downRGBA   = textureLoad(sourceTexture, min(index + vec2<u32>(0u, 1u), dimensions - 1u));

// 2. 밝기(Luma) 계산 (기존과 동일)
let lumaWeight = vec3<f32>(0.299, 0.587, 0.114);
let lCenter = dot(centerRGBA.rgb, lumaWeight);
let lLeft   = dot(leftRGBA.rgb, lumaWeight);
let lRight  = dot(rightRGBA.rgb, lumaWeight);
let lUp     = dot(upRGBA.rgb, lumaWeight);
let lDown   = dot(downRGBA.rgb, lumaWeight);

// 3. 주변 대비(Contrast) 분석
let minL = min(lCenter, min(min(lLeft, lRight), min(lUp, lDown)));
let maxL = max(lCenter, max(max(lLeft, lRight), max(lUp, lDown)));
let contrast = maxL - minL;

// 4. 적응형 샤프닝 (RGB와 Alpha 모두 적용)
var finalRGBA: vec4<f32>;
let k = uniforms.sharpness * 0.2;

if (contrast > 0.001) {
    // RGB 샤프닝
    let edgeRGB = 4.0 * centerRGBA.rgb - (leftRGBA.rgb + rightRGBA.rgb + upRGBA.rgb + downRGBA.rgb);
    let sharpRGB = centerRGBA.rgb + edgeRGB * k;

    // Alpha 샤프닝 (선택 사항: 투명도 경계도 선명하게 만들고 싶을 때)
    let edgeAlpha = 4.0 * centerRGBA.a - (leftRGBA.a + rightRGBA.a + upRGBA.a + downRGBA.a);
    let sharpAlpha = centerRGBA.a + edgeAlpha * k;

    finalRGBA = vec4<f32>(sharpRGB, sharpAlpha);
} else {
    finalRGBA = centerRGBA;
}

// 5. 결과 저장 (음수 방지 및 알파 범위 제한)
textureStore(outputTexture, index, saturate(finalRGBA));
