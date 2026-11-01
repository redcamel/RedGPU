// [KO] 1. 기초 데이터 로드 및 조기 종료 조건 확인
// [EN] 1. Load basic data and check early exit conditions
let index = vec2<i32>(global_id.xy);
let originalColor = textureLoad(sourceTexture, index, 0);

let filmGrainIntensity_value = uniforms.filmGrainIntensity;
if (filmGrainIntensity_value <= 0.0 || originalColor.a == 0.0) {
    textureStore(outputTexture, index, originalColor);
    return;
}

// [KO] 2. 분산 보존 에르미트 보간 및 삼각 분포 기반 시네마틱 입자 생성 (물리 텍셀 그리드 기준)
// [EN] 2. Cinematic particle generation based on variance-preserving Hermite interpolation and triangular distribution
let baseScale = max(uniforms.filmGrainScale, 0.1);
var grain = getFilmicGrain(
    vec2<f32>(global_id.xy),
    baseScale,
    systemUniforms.time.frameIndex,
    uniforms.coloredGrain
);

// [KO] 3. 입자 채도 및 컬러 제어
// [EN] 3. Particle saturation and color control
let grainLum = getLuminance(grain);
grain = mix(vec3<f32>(grainLum), grain, uniforms.grainSaturation);

// [KO] 4. 시네마틱 휘도 마스킹 (암부 토 보호 및 중간톤 유지, 하이라이트 롤오프 감쇠)
// [EN] 4. Cinematic luminance masking (Shadow toe protection, mid-tone preservation, and highlight roll-off attenuation)
let sceneLuminance = saturate(getLuminance(originalColor.rgb));
let highlightRollOff = pow(max(1.0 - sceneLuminance * 0.85, 1e-4), uniforms.filmGrainResponse);
let shadowToe = smoothstep(0.0, 0.04, sceneLuminance);
let finalMask = mix(0.25, 1.0, shadowToe) * highlightRollOff;

// [KO] 5. 입자 강도 적용 및 최종 합성
// [EN] 5. Apply grain intensity and final composition
let intensity = filmGrainIntensity_value * finalMask;
let finalColor = fma(grain, vec3<f32>(intensity), originalColor.rgb);

// [KO] 6. 결과 출력 (Saturate를 통한 안전한 색상 범위 보장)
// [EN] 6. Result output (Ensuring safe color range via saturate)
let outputColor = vec4<f32>(saturate(finalColor), originalColor.a);
textureStore(outputTexture, index, outputColor);
