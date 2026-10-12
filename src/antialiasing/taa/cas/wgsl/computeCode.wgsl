{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let c_max = vec2<i32>(screenSizeU) - 1;

    // =========================================================================
    // AMD FidelityFX CAS (Contrast Adaptive Sharpening) for LDR Post-Tonemapping
    // 십자형 5-Tap 페치: a(상), b(좌), c(우), d(하), e(중심)
    // =========================================================================
    let a = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>( 0, -1), vec2<i32>(0), c_max), 0);
    let b = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>(-1,  0), vec2<i32>(0), c_max), 0);
    let c = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>( 1,  0), vec2<i32>(0), c_max), 0);
    let d = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>( 0,  1), vec2<i32>(0), c_max), 0);
    let e = textureLoad(sourceTexture, clamp(pixelCoord, vec2<i32>(0), c_max), 0);

    let eRGB = e.rgb;

    // [KO] RGB 채널별 국소 3x3 십자 영역 최소/최대값 분석 (AMD CAS 원본 사양)
    // [EN] Local 3x3 cross neighborhood min/max analysis per RGB channel (AMD CAS specification)
    let minRGB = min(min(min(a.rgb, b.rgb), min(c.rgb, d.rgb)), eRGB);
    let maxRGB = max(max(max(a.rgb, b.rgb), max(c.rgb, d.rgb)), eRGB);

    // [KO] AMD FidelityFX 공식 콘트라스트 적응형 증폭 계수(amp) 산출
    // [EN] AMD FidelityFX official contrast-adaptive amplification factor (amp) calculation
    let ampRGB = sqrt(saturate(min(minRGB, 2.0 - maxRGB) / max(maxRGB, vec3<f32>(1e-4))));

    // [KO] 샤프닝 피크 강도 산출 (AMD 공식 범위: 0.0 ~ -0.20)
    // [EN] Peak sharpening weight calculation (AMD official range: 0.0 ~ -0.20)
    let peak = -0.20 * uniforms.sharpness;
    let wRGB = ampRGB * peak;

    // [KO] 에너지 보존 정규화 필터 적용 (채널별 정규화)
    // [EN] Apply energy-preserving normalized filter (per-channel normalization)
    let sumSurround = a.rgb + b.rgb + c.rgb + d.rgb;
    let sharpRGB = (eRGB + sumSurround * wRGB) / (vec3<f32>(1.0) + 4.0 * wRGB);

    // [KO] 디스플레이 LDR 출력 범위 보장 [0.0, 1.0]
    // [EN] Guarantee display LDR output range [0.0, 1.0]
    let finalRGB = saturate(sharpRGB);

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, e.a));
}
