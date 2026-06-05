// [KO] 1. 인덱스 및 기초 데이터 로드
// [EN] 1. Index and basic data loading
let index = global_id.xy;
let dimensions = textureDimensions(sourceTexture);
if (index.x >= dimensions.x || index.y >= dimensions.y) { return; }

// [KO] 현재 픽셀 및 주변 4방향 데이터 로드 (1:1 픽셀 매칭)
// [EN] Load current pixel and Top/Down/Left/Right 4-way data (1:1 pixel matching)
let centerRGBA = textureLoad(sourceTexture, index, 0);
let leftRGBA   = textureLoad(sourceTexture, index - vec2<u32>(select(0u, 1u, index.x > 0u), 0u), 0);
let rightRGBA  = textureLoad(sourceTexture, min(index + vec2<u32>(1u, 0u), dimensions - 1u), 0);
let upRGBA     = textureLoad(sourceTexture, index - vec2<u32>(0u, select(0u, 1u, index.y > 0u)), 0);
let downRGBA   = textureLoad(sourceTexture, min(index + vec2<u32>(0u, 1u), dimensions - 1u), 0);

// [KO] 2. 로컬 대비(Contrast) 분석
// [EN] 2. Local Contrast analysis
let lCenter = getLuminance(centerRGBA.rgb);
let lLeft   = getLuminance(leftRGBA.rgb);
let lRight  = getLuminance(rightRGBA.rgb);
let lUp     = getLuminance(upRGBA.rgb);
let lDown   = getLuminance(downRGBA.rgb);

let minL = min(lCenter, min(min(lLeft, lRight), min(lUp, lDown)));
let maxL = max(lCenter, max(max(lLeft, lRight), max(lUp, lDown)));
let contrast = maxL - minL;

// [KO] 3. 엣지 보존형 샤프닝 적용
// [EN] 3. Apply edge-preserving sharpening
var finalRGBA: vec4<f32>;
let k = uniforms.sharpness * 0.2;

if (contrast > 0.001) {
    // 라플라시안 필터 기반의 엣지 강조 (Edge enhancement based on Laplacian filter)
    let edgeRGB = 4.0 * centerRGBA.rgb - (leftRGBA.rgb + rightRGBA.rgb + upRGBA.rgb + downRGBA.rgb);
    let sharpRGB = centerRGBA.rgb + edgeRGB * k;

    let edgeAlpha = 4.0 * centerRGBA.a - (leftRGBA.a + rightRGBA.a + upRGBA.a + downRGBA.a);
    let sharpAlpha = centerRGBA.a + edgeAlpha * k;

    finalRGBA = vec4<f32>(sharpRGB, sharpAlpha);
} else {
    // 대비가 낮은 평평한 영역은 원본 보존 (Preserve original in low-contrast flat areas)
    finalRGBA = centerRGBA;
}

// [KO] 4. 결과 저장 (안전한 LDR 범위 보장)
// [EN] 4. Store result (Ensure safe LDR range)
textureStore(outputTexture, index, saturate(finalRGBA));
