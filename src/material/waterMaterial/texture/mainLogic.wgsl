let time = uniforms.time;

// 🌊 높이만 필요하므로 generateGerstnerWaveHeight 함수 사용
let wave1 = generateGerstnerWaveHeight(base_uv, time,
    uniforms.direction1, uniforms.amplitude1, uniforms.wavelength1, uniforms.speed1, uniforms.steepness1);
let wave2 = generateGerstnerWaveHeight(base_uv, time,
    uniforms.direction2, uniforms.amplitude2, uniforms.wavelength2, uniforms.speed2, uniforms.steepness2);
let wave3 = generateGerstnerWaveHeight(base_uv, time,
    uniforms.direction3, uniforms.amplitude3, uniforms.wavelength3, uniforms.speed3, uniforms.steepness3);
let wave4 = generateGerstnerWaveHeight(base_uv, time,
    uniforms.direction4, uniforms.amplitude4, uniforms.wavelength4, uniforms.speed4, uniforms.steepness4);

// 🆕 디테일 노이즈에 방향 적용
let detailNoise1 = getSimplexNoiseByDimension(
    base_uv * uniforms.detailScale1 + uniforms.detailDirection1 * time * uniforms.detailSpeed1,
    uniforms
) * uniforms.detailStrength1;

let detailNoise2 = getSimplexNoiseByDimension(
    base_uv * uniforms.detailScale2 + uniforms.detailDirection2 * time * uniforms.detailSpeed2,
    uniforms
) * uniforms.detailStrength2;

let combinedWaves = wave1 + wave2 + wave3 + wave4;
let combinedDetail = detailNoise1 + detailNoise2;

let foamThreshold = uniforms.foamThreshold;
let foamIntensity = smoothstep(foamThreshold - 0.1, foamThreshold + 0.1, combinedWaves);

let finalHeight = combinedWaves + combinedDetail * (1.0 - foamIntensity * 0.5);

let normalData = calculateNormalFromHeight(base_uv, finalHeight, time, uniforms);

// 실제 파도 범위 계산 (모든 amplitude 합계 기반)
let maxPossibleWave = uniforms.amplitude1 + uniforms.amplitude2 + uniforms.amplitude3 + uniforms.amplitude4;
let maxPossibleDetail = uniforms.detailStrength1 + uniforms.detailStrength2;
let theoreticalMaxHeight = maxPossibleWave + maxPossibleDetail;

let adaptiveWaveRange = max(uniforms.waveRange, theoreticalMaxHeight * 0.8);
let positiveRange = adaptiveWaveRange;

// 🔧 음수 변수 문제 해결
let negativeRange = 0.0 - adaptiveWaveRange;
var normalizedHeight = smoothstep(negativeRange, positiveRange, finalHeight);

// 🔧 더 안정적인 정규화를 위한 clamp 추가
normalizedHeight = clamp(normalizedHeight, 0.0, 1.0);

var finalColor = vec4<f32>(
    normalizedHeight,
    foamIntensity,
    normalData.x * 0.5 + 0.5,
    normalData.y * 0.5 + 0.5
);
