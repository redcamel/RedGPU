// [KO] 1. 기초 데이터 로드 및 조기 종료 조건 확인
// [EN] 1. Load basic data and check early exit conditions
let index = vec2<i32>(global_id.xy);
let dimensions: vec2<u32> = textureDimensions(sourceTexture);
let originalColor = textureLoad(sourceTexture, index, 0);

let filmGrainIntensity_value: f32 = uniforms.filmGrainIntensity;
let filmGrainResponse_value: f32 = uniforms.filmGrainResponse;
let filmGrainScale_value: f32 = uniforms.filmGrainScale;
let coloredGrain_value: f32 = uniforms.coloredGrain;
let grainSaturation_value: f32 = uniforms.grainSaturation;
let frameIndex_value: u32 = systemUniforms.time.frameIndex;

if (filmGrainIntensity_value <= 0.0) {
    textureStore(outputTexture, index, originalColor);
    return;
}

// [KO] 2. 입자 좌표계 계산 (픽셀 단위 정밀 보정 및 스케일링)
// [EN] 2. Particle coordinate calculation (Pixel-level precision correction and scaling)
let baseScale = max(filmGrainScale_value, 0.1);
let grainCoord = floor(vec2<f32>(global_id.xy) / baseScale);

// [KO] 3. 시네마틱 입자 생성 ( -1.0 ~ 1.0 범위의 동적 노이즈)
// [EN] 3. Cinematic particle generation (Dynamic noise in range -1.0 ~ 1.0)
var grain = getFilmicGrain(grainCoord, frameIndex_value, coloredGrain_value);

// [KO] 4. 입자 채도 및 컬러 제어
// [EN] 4. Particle saturation and color control
let grainLum = getLuminance(grain);
grain = mix(vec3<f32>(grainLum), grain, grainSaturation_value);

// [KO] 5. 휘도 마스킹 (어두운 영역에서 입자가 더 잘 보이도록 물리적 반응 시뮬레이션)
// [EN] 5. Luminance Masking (Simulating physical response where grain is more visible in dark areas)
let sceneLuminance = getLuminance(originalColor.rgb);
let responseMask = pow(1.0 - sceneLuminance, filmGrainResponse_value);
let finalMask = responseMask * smoothstep(0.0, 0.1, sceneLuminance);

// [KO] 6. 입자 강도 적용 및 최종 합성
// [EN] 6. Apply grain intensity and final composition
let intensity = filmGrainIntensity_value * max(0.05, finalMask);
let finalColor = originalColor.rgb + grain * intensity;

// [KO] 7. 결과 출력 (Saturate를 통한 안전한 색상 범위 보장)
// [EN] 7. Result output (Ensuring safe color range via saturate)
let outputColor = vec4<f32>(saturate(finalColor), originalColor.a);
textureStore(outputTexture, index, outputColor);
