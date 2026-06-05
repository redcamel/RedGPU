// [KO] 1. 인덱스 및 기초 데이터 로드
// [EN] 1. Index and basic data loading
let index = global_id.xy;
let dims = textureDimensions(sourceTexture);
let i_index = vec2<i32>(index);

// [KO] 현재 픽셀 및 상/하/좌/우 4방향 루마(Luma) 데이터 샘플링
// [EN] Sample current pixel and Top/Down/Left/Right 4-way luminance (Luma) data
let colorM4 = textureLoad(sourceTexture, index, 0);
let lumaM = getLuminance(colorM4.rgb);

let colorN4 = fetchColor4(i_index + vec2<i32>(0, -1), dims);
let colorS4 = fetchColor4(i_index + vec2<i32>(0, 1), dims);
let colorW4 = fetchColor4(i_index + vec2<i32>(-1, 0), dims);
let colorE4 = fetchColor4(i_index + vec2<i32>(1, 0), dims);

let lumaN = getLuminance(colorN4.rgb);
let lumaS = getLuminance(colorS4.rgb);
let lumaW = getLuminance(colorW4.rgb);
let lumaE = getLuminance(colorE4.rgb);

// [KO] 2. 로컬 대비(Contrast) 분석 및 조기 종료 판단
// [EN] 2. Local Contrast analysis and early exit decision
let lumaMin = min(lumaM, min(min(lumaN, lumaS), min(lumaW, lumaE)));
let lumaMax = max(lumaM, max(max(lumaN, lumaS), max(lumaW, lumaE)));
let range = lumaMax - lumaMin;

// [KO] 대비가 임계값보다 낮으면(평평한 영역) 처리 없이 원본 보존
// [EN] Exit if contrast is below threshold (flat area)
if (range < max(uniforms.edgeThresholdMin, lumaMax * uniforms.edgeThreshold)) {
    textureStore(outputTexture, index, colorM4);
    return;
}

// [KO] 3. 대각선 루마 샘플링 (3x3 필터 영역 완성)
// [EN] 3. Diagonal luma sampling (Complete 3x3 filter region)
let lumaNW = getLuminance(fetchColor4(i_index + vec2<i32>(-1, -1), dims).rgb);
let lumaNE = getLuminance(fetchColor4(i_index + vec2<i32>(1, -1), dims).rgb);
let lumaSW = getLuminance(fetchColor4(i_index + vec2<i32>(-1, 1), dims).rgb);
let lumaSE = getLuminance(fetchColor4(i_index + vec2<i32>(1, 1), dims).rgb);

// [KO] 4. 엣지 방향 판단 (수직 vs 수평)
// [EN] 4. Edge direction detection (Vertical vs Horizontal)
let edgeVer = abs(lumaNW + lumaSW - 2.0 * lumaW) + abs(lumaN + lumaS - 2.0 * lumaM) * 2.0 + abs(lumaNE + lumaSE - 2.0 * lumaE);
let edgeHor = abs(lumaNW + lumaNE - 2.0 * lumaN) + abs(lumaW + lumaE - 2.0 * lumaM) * 2.0 + abs(lumaSW + lumaSE - 2.0 * lumaS);
let isHorizontal = edgeHor >= edgeVer;

// [KO] 5. 엣지 방향에 따른 기울기 및 오프셋 단계 설정
// [EN] 5. Set gradient and offset step based on edge direction
let luma1 = select(lumaW, lumaN, isHorizontal);
let luma2 = select(lumaE, lumaS, isHorizontal);
let gradient1 = luma1 - lumaM;
let gradient2 = luma2 - lumaM;
let is1Steeper = abs(gradient1) >= abs(gradient2);
let gradientScaled = 0.25 * max(abs(gradient1), abs(gradient2));

var lumaLocalAverage = 0.0;
var edgeStep = vec2<i32>(0, 0);
if (is1Steeper) {
    edgeStep = select(vec2<i32>(-1, 0), vec2<i32>(0, -1), isHorizontal);
    lumaLocalAverage = 0.5 * (luma1 + lumaM);
} else {
    edgeStep = select(vec2<i32>(1, 0), vec2<i32>(0, 1), isHorizontal);
    lumaLocalAverage = 0.5 * (luma2 + lumaM);
}

// [KO] 6. 엣지 탐색 루프 (Edge Search Iteration)
// [EN] 6. Edge Search Iteration
// [KO] 실제 엣지의 끝점을 추적하여 블렌딩 반경을 결정합니다.
// [EN] Tracks the actual edge endpoints to determine the blending radius.
var posP = i_index + edgeStep;
var posN = i_index + edgeStep;
let searchStep = select(vec2<i32>(1, 0), vec2<i32>(0, 1), isHorizontal);

var doneP = false;
var doneN = false;
for (var i = 0; i < 10; i++) {
    if (!doneP) {
        if (abs(getLuminance(fetchColor4(posP, dims).rgb) - lumaLocalAverage) >= gradientScaled) { doneP = true; }
        else { posP += searchStep; }
    }
    if (!doneN) {
        if (abs(getLuminance(fetchColor4(posN, dims).rgb) - lumaLocalAverage) >= gradientScaled) { doneN = true; }
        else { posN -= searchStep; }
    }
    if (doneP && doneN) { break; }
}

// [KO] 7. 탐색된 끝점까지의 거리를 기반으로 한 엣지 블렌딩 계수 산출
// [EN] 7. Calculate edge blending factor based on distance to searched endpoints
let distP = select(f32(posP.x - i_index.x), f32(posP.y - i_index.y), isHorizontal);
let distN = select(f32(i_index.x - posN.x), f32(i_index.y - posN.y), isHorizontal);
let distMin = min(abs(distP), abs(distN));
let edgeBlend = saturate(0.5 - distMin / (abs(distP) + abs(distN)));

// [KO] 8. 서브픽셀 필터링 (미세한 고주파 노이즈 보정)
// [EN] 8. Subpixel filtering (Fine high-frequency noise correction)
let lumaL = (lumaN + lumaS + lumaW + lumaE) * 2.0;
let lumaCorners = lumaNW + lumaNE + lumaSW + lumaSE;
let subpixFilter = saturate(abs((lumaL + lumaCorners) / 12.0 - lumaM) / range);
let subpixBlend = smoothstep(0.0, 1.0, subpixFilter) * uniforms.subpix;

// [KO] 9. 최종 블렌딩 및 결과 저장
// [EN] 9. Final blending and result storage
let finalBlend = max(edgeBlend, subpixBlend);
let colorTarget4 = fetchColor4(i_index + edgeStep, dims);

// [KO] RGBA 전체를 보간하여 투명도 및 컬러 연속성 유지
// [EN] Interpolate full RGBA to maintain transparency and color continuity
let finalColor4 = mix(colorM4, colorTarget4, finalBlend);

textureStore(outputTexture, index, finalColor4);
