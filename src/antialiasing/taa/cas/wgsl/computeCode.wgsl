{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let c_max = vec2<i32>(screenSizeU) - 1;

    // =========================================================================
    // AMD FidelityFX CAS (Contrast Adaptive Sharpening) Modern Official Standard
    // 3x3 9-Tap 페치: 링잉 억제를 위한 9픽셀 분석 및 십자형 에너지 보존 필터링
    //   a b c
    //   d e f
    //   g h i
    // =========================================================================
    let a = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>(-1, -1), vec2<i32>(0), c_max), 0);
    let b = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>( 0, -1), vec2<i32>(0), c_max), 0);
    let c = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>( 1, -1), vec2<i32>(0), c_max), 0);
    let d = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>(-1,  0), vec2<i32>(0), c_max), 0);
    let e = textureLoad(sourceTexture, clamp(pixelCoord, vec2<i32>(0), c_max), 0);
    let f = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>( 1,  0), vec2<i32>(0), c_max), 0);
    let g = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>(-1,  1), vec2<i32>(0), c_max), 0);
    let h = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>( 0,  1), vec2<i32>(0), c_max), 0);
    let i = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>( 1,  1), vec2<i32>(0), c_max), 0);

    let eRGB = e.rgb;

    // =========================================================================
    // AMD FidelityFX CAS 공식 알고리즘 (ffx_cas.h 100% 표준 일치)
    // =========================================================================

    // [KO] 1. 십자 4-Tap(b, d, f, h) 및 중심 픽셀 1차 min/max 산출 [0, 1]
    // [EN] 1. Cross 4-tap and center pixel primary min/max calculation [0, 1]
    let minRGB_cross = min(min(b.rgb, d.rgb), min(f.rgb, h.rgb));
    let maxRGB_cross = max(max(b.rgb, d.rgb), max(f.rgb, h.rgb));

    var minRGB = min(minRGB_cross, eRGB);
    var maxRGB = max(maxRGB_cross, eRGB);

    // [KO] 2. 대각선 4-Tap(a, c, g, i) min/max 산출
    // [EN] 2. Diagonal 4-tap min/max calculation
    let minRGB_diag = min(min(a.rgb, c.rgb), min(g.rgb, i.rgb));
    let maxRGB_diag = max(max(a.rgb, c.rgb), max(g.rgb, i.rgb));

    // [KO] 3. AMD FidelityFX CAS 공식: 대각선 성분 가산으로 범위를 [0, 2]로 확장
    // [EN] 3. AMD FidelityFX CAS official: Add diagonal components to expand range to [0, 2]
    minRGB += min(minRGB, minRGB_diag);
    maxRGB += max(maxRGB, maxRGB_diag);

    // [KO] 4. 신호 한계(0.0 및 2.0)까지의 최소 거리 및 대비 적응 증폭비(ampRGB) 산출
    // [EN] 4. Distance to signal limits (0.0 and 2.0) and contrast-adaptive amplification
    let distanceToLimit = min(minRGB, vec3<f32>(2.0) - maxRGB);
    let ampRGB = saturate(distanceToLimit / max(maxRGB, vec3<f32>(1e-4)));

    // [KO] 5. AMD FidelityFX CasSetup 공식 피크 가중치 산출
    // peak = -1.0 / mix(8.0, 5.0, sharpness) -> sharpness=0일 때 완전 비활성화 연동
    // [EN] 5. AMD FidelityFX CasSetup official peak weight calculation
    let clampedSharpness = saturate(uniforms.sharpness);
    let peak = (-1.0 / mix(8.0, 5.0, clampedSharpness)) * clampedSharpness;
    let wRGB = sqrt(ampRGB) * peak;

    // [KO] 6. 에너지 보존 정규화 필터 적용 (십자 4-Tap 가중 합성)
    // [EN] 6. Energy-preserving normalized filter (Cross 4-tap weighted synthesis)
    let sumCross = b.rgb + d.rgb + f.rgb + h.rgb;
    let denom = vec3<f32>(1.0) + 4.0 * wRGB;
    let sharpRGB = (eRGB + sumCross * wRGB) / denom;

    // [KO] 7. 디스플레이 LDR 출력 범위 보장 [0.0, 1.0]
    // [EN] 7. Guarantee display LDR output range [0.0, 1.0]
    let finalRGB = saturate(sharpRGB);

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, e.a));
}

