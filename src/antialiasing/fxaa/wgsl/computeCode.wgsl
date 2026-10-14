// [KO] 1. 인덱스 및 기초 데이터 로드
// [EN] 1. Index and basic data loading
let index = global_id.xy;
let dims = postEffectOutputDimensions;
let invDims = 1.0 / vec2<f32>(dims);
let uvM = (vec2<f32>(index) + 0.5) * invDims;
let i_index = vec2<i32>(index);

// [KO] 현재 픽셀 및 상/하/좌/우 4방향 루마(Luma) 데이터 샘플링
// [EN] Sample current pixel and Top/Down/Left/Right 4-way luminance (Luma) data
let colorM4 = textureLoad(sourceTexture, index, 0);
let lumaM = getLuminance(colorM4.rgb);

let lumaN = getLuminance(fetchColor4(i_index + vec2<i32>(0, -1), dims).rgb);
let lumaS = getLuminance(fetchColor4(i_index + vec2<i32>(0, 1), dims).rgb);
let lumaW = getLuminance(fetchColor4(i_index + vec2<i32>(-1, 0), dims).rgb);
let lumaE = getLuminance(fetchColor4(i_index + vec2<i32>(1, 0), dims).rgb);

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
let lumaNS = lumaN + lumaS;
let lumaWE = lumaW + lumaE;
let lumaNWSW = lumaNW + lumaSW;
let lumaNESE = lumaNE + lumaSE;
let lumaNWNE = lumaNW + lumaNE;
let lumaSWSE = lumaSW + lumaSE;

let edgeHor = abs(lumaNWSW - 2.0 * lumaW) + abs(lumaNS - 2.0 * lumaM) * 2.0 + abs(lumaNESE - 2.0 * lumaE);
let edgeVer = abs(lumaNWNE - 2.0 * lumaN) + abs(lumaWE - 2.0 * lumaM) * 2.0 + abs(lumaSWSE - 2.0 * lumaS);
let isHorizontal = edgeHor >= edgeVer;

// [KO] 5. 엣지 법선 방향 기울기 및 +0.5 텍셀 경계 중점(Midpoint) 설정
// [EN] 5. Set edge normal gradient and +0.5 texel boundary midpoint
let luma1 = select(lumaW, lumaN, isHorizontal);
let luma2 = select(lumaE, lumaS, isHorizontal);
let gradient1 = luma1 - lumaM;
let gradient2 = luma2 - lumaM;
let absGrad1 = abs(gradient1);
let absGrad2 = abs(gradient2);
let is1Steeper = absGrad1 >= absGrad2;
let gradientScaled = 0.25 * max(absGrad1, absGrad2);

let stepLength = select(invDims.x, invDims.y, isHorizontal) * select(1.0, -1.0, is1Steeper);
let lumaLocalAverage = 0.5 * (select(luma2, luma1, is1Steeper) + lumaM);
let currentUv = uvM + select(vec2<f32>(stepLength * 0.5, 0.0), vec2<f32>(0.0, stepLength * 0.5), isHorizontal);

// [KO] 6. 엣지 진행 방향 양끝점 가속 탐색 루프 (FXAA 3.11 Quality)
// [EN] 6. Accelerated edge endpoint search iteration along the edge (FXAA 3.11 Quality)
let uvOffset = select(vec2<f32>(0.0, invDims.y), vec2<f32>(invDims.x, 0.0), isHorizontal);
var uvP = currentUv + uvOffset;
var uvN = currentUv - uvOffset;
var lumaEndP = 0.0;
var lumaEndN = 0.0;
var doneP = false;
var doneN = false;

for (var i = 0; i < 10; i++) {
    if (!doneP) {
        lumaEndP = getLuminance(textureSampleLevel(sourceTexture, basicSampler, uvP, 0.0).rgb) - lumaLocalAverage;
    }
    if (!doneN) {
        lumaEndN = getLuminance(textureSampleLevel(sourceTexture, basicSampler, uvN, 0.0).rgb) - lumaLocalAverage;
    }
    doneP = doneP || (abs(lumaEndP) >= gradientScaled);
    doneN = doneN || (abs(lumaEndN) >= gradientScaled);
    if (doneP && doneN) {
        break;
    }
    let stepSize = FXAA_QUALITY_STEPS[i];
    if (!doneP) {
        uvP += uvOffset * stepSize;
    }
    if (!doneN) {
        uvN -= uvOffset * stepSize;
    }
}

// [KO] 7. 끝점 거리 및 루마 부호 방향 검증(correctVariation)을 통한 엣지 블렌딩 계수 산출
// [EN] 7. Calculate edge blending factor with endpoint distance and luma variation sign check
let distP = select(uvP.y - uvM.y, uvP.x - uvM.x, isHorizontal);
let distN = select(uvM.y - uvN.y, uvM.x - uvN.x, isHorizontal);
let isDirectionN = distN < distP;
let distMin = min(distP, distN);
let lumaEnd = select(lumaEndP, lumaEndN, isDirectionN);
let isLumaCenterSmaller = lumaM < lumaLocalAverage;
let correctVariation = (lumaEnd < 0.0) != isLumaCenterSmaller;
let edgeBlend = select(0.0, 0.5 - distMin / (distP + distN), correctVariation);

// [KO] 8. 서브픽셀 필터링 (3x3 텐트 필터 및 2차 제곱 감쇠)
// [EN] 8. Subpixel filtering (3x3 tent filter and squared smoothstep falloff)
let lumaL = (lumaNS + lumaWE) * 2.0 + lumaNWSW + lumaNESE;
let subpixFilter = saturate(abs(lumaL * (1.0 / 12.0) - lumaM) / range);
let subpixF = smoothstep(0.0, 1.0, subpixFilter);
let subpixBlend = subpixF * subpixF * uniforms.subpix;

// [KO] 9. 최종 오프셋 산출 및 하드웨어 바이리니어 보간 샘플링
// [EN] 9. Final offset calculation and hardware bilinear interpolated sampling
let finalBlend = max(edgeBlend, subpixBlend);
let finalUv = uvM + select(vec2<f32>(stepLength * finalBlend, 0.0), vec2<f32>(0.0, stepLength * finalBlend), isHorizontal);
let finalColor4 = textureSampleLevel(sourceTexture, basicSampler, finalUv, 0.0);

textureStore(outputTexture, index, finalColor4);

