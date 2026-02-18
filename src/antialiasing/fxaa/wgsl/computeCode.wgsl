let index = vec2<u32>(global_id.xy);
let dims = textureDimensions(sourceTexture);
let i_index = vec2<i32>(index);

// 1. 현재 픽셀 및 주변 4방향 루마(Luma) 및 알파 샘플링
let colorM4 = textureLoad(sourceTexture, index);
let colorM = colorM4.rgb;
let lumaM = getLuminance(colorM);

let colorN4 = fetchColor4(i_index + vec2<i32>(0, -1), dims);
let colorS4 = fetchColor4(i_index + vec2<i32>(0, 1), dims);
let colorW4 = fetchColor4(i_index + vec2<i32>(-1, 0), dims);
let colorE4 = fetchColor4(i_index + vec2<i32>(1, 0), dims);

let lumaN = getLuminance(colorN4.rgb);
let lumaS = getLuminance(colorS4.rgb);
let lumaW = getLuminance(colorW4.rgb);
let lumaE = getLuminance(colorE4.rgb);

// 2. 로컬 대비(Contrast) 분석을 통한 조기 종료 결정
let lumaMin = min(lumaM, min(min(lumaN, lumaS), min(lumaW, lumaE)));
let lumaMax = max(lumaM, max(max(lumaN, lumaS), max(lumaW, lumaE)));
let range = lumaMax - lumaMin;

if (range < max(uniforms.edgeThresholdMin, lumaMax * uniforms.edgeThreshold)) {
    textureStore(outputTexture, index, colorM4);
    return;
}

// 3. 대각선 루마 샘플링 (3x3 영역 완성)
let lumaNW = getLuminance(fetchColor4(i_index + vec2<i32>(-1, -1), dims).rgb);
let lumaNE = getLuminance(fetchColor4(i_index + vec2<i32>(1, -1), dims).rgb);
let lumaSW = getLuminance(fetchColor4(i_index + vec2<i32>(-1, 1), dims).rgb);
let lumaSE = getLuminance(fetchColor4(i_index + vec2<i32>(1, 1), dims).rgb);

// 4. 엣지 방향 판단 (수직 vs 수평)
let edgeVer = abs(lumaNW + lumaSW - 2.0 * lumaW) + abs(lumaN + lumaS - 2.0 * lumaM) * 2.0 + abs(lumaNE + lumaSE - 2.0 * lumaE);
let edgeHor = abs(lumaNW + lumaNE - 2.0 * lumaN) + abs(lumaW + lumaE - 2.0 * lumaM) * 2.0 + abs(lumaSW + lumaSE - 2.0 * lumaS);
let isHorizontal = edgeHor >= edgeVer;

// 5. 엣지 방향에 따른 기울기 및 오프셋 설정
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

// 6. 언리얼급 품질을 위한 엣지 탐색 루프 (Edge Search Iteration)
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

// 7. 탐색된 끝점까지의 거리를 기반으로 한 엣지 블렌딩 계산
let distP = select(f32(posP.x - i_index.x), f32(posP.y - i_index.y), isHorizontal);
let distN = select(f32(i_index.x - posN.x), f32(i_index.y - posN.y), isHorizontal);
let distMin = min(abs(distP), abs(distN));
let edgeBlend = saturate(0.5 - distMin / (abs(distP) + abs(distN)));

// 8. 서브픽셀 필터링 (고주파 노이즈 제거용)
let lumaL = (lumaN + lumaS + lumaW + lumaE) * 2.0;
let lumaCorners = lumaNW + lumaNE + lumaSW + lumaSE;
let subpixFilter = saturate(abs((lumaL + lumaCorners) / 12.0 - lumaM) / range);
let subpixBlend = smoothstep(0.0, 1.0, subpixFilter) * uniforms.subpix;

// 9. 최종 블렌딩 및 알파 채널 보존 합성
let finalBlend = max(edgeBlend, subpixBlend);
let colorTarget4 = fetchColor4(i_index + edgeStep, dims);

// RGBA 전체를 보간하여 투명도 유지
let finalColor4 = mix(colorM4, colorTarget4, finalBlend);

textureStore(outputTexture, index, finalColor4);
