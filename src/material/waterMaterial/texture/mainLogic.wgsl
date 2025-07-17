let time = uniforms.time;

let wave1 = generateGerstnerWave(base_uv, time,
    uniforms.direction1, uniforms.amplitude1, uniforms.wavelength1, uniforms.speed1, uniforms.steepness1);
let wave2 = generateGerstnerWave(base_uv, time,
    uniforms.direction2, uniforms.amplitude2, uniforms.wavelength2, uniforms.speed2, uniforms.steepness2);
let wave3 = generateGerstnerWave(base_uv, time,
    uniforms.direction3, uniforms.amplitude3, uniforms.wavelength3, uniforms.speed3, uniforms.steepness3);
let wave4 = generateGerstnerWave(base_uv, time,
    uniforms.direction4, uniforms.amplitude4, uniforms.wavelength4, uniforms.speed4, uniforms.steepness4);

let detailNoise1 = getSimplexNoiseByDimension(
    base_uv * uniforms.detailScale1 + vec2<f32>(time * uniforms.detailSpeed1, 0.0),
    uniforms
) * uniforms.detailStrength1;

let detailNoise2 = getSimplexNoiseByDimension(
    base_uv * uniforms.detailScale2 + vec2<f32>(0.0, time * uniforms.detailSpeed2),
    uniforms
) * uniforms.detailStrength2;

let combinedWaves = wave1 + wave2 + wave3 + wave4;
let combinedDetail = detailNoise1 + detailNoise2;

let foamThreshold = uniforms.foamThreshold;
let foamIntensity = smoothstep(foamThreshold - 0.1, foamThreshold + 0.1, combinedWaves);

let finalHeight = combinedWaves + combinedDetail * (1.0 - foamIntensity * 0.5);

let normalData = calculateNormalFromHeight(base_uv, finalHeight, time, uniforms);

let normalizedHeight = smoothstep(-uniforms.waveRange, uniforms.waveRange, finalHeight);

var finalColor = vec4<f32>(
    normalizedHeight,
    foamIntensity,
    normalData.x * 0.5 + 0.5,
    normalData.y * 0.5 + 0.5
);
