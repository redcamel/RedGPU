fn generateGerstnerWave(
    uv: vec2<f32>,
    time: f32,
    direction: vec2<f32>,
    amplitude: f32,
    wavelength: f32,
    speed: f32,
    steepness: f32
) -> f32 {
    let normalizedDir = normalize(direction);
    let frequency = 2.0 * 3.14159 / wavelength;
    let phase = frequency * dot(normalizedDir, uv) + time * speed;
    let wave = amplitude * sin(phase);

    let gerstnerEffect = steepness * amplitude * cos(phase);

    return wave + gerstnerEffect * 0.5;
}

fn getHeightAtUV(uv: vec2<f32>, time: f32, uniforms: Uniforms) -> f32 {
    let wave1 = generateGerstnerWave(uv, time,
        uniforms.direction1, uniforms.amplitude1, uniforms.wavelength1, uniforms.speed1, uniforms.steepness1);
    let wave2 = generateGerstnerWave(uv, time,
        uniforms.direction2, uniforms.amplitude2, uniforms.wavelength2, uniforms.speed2, uniforms.steepness2);
    let wave3 = generateGerstnerWave(uv, time,
        uniforms.direction3, uniforms.amplitude3, uniforms.wavelength3, uniforms.speed3, uniforms.steepness3);
    let wave4 = generateGerstnerWave(uv, time,
        uniforms.direction4, uniforms.amplitude4, uniforms.wavelength4, uniforms.speed4, uniforms.steepness4);

    let detailNoise1 = getSimplexNoiseByDimension(
        uv * uniforms.detailScale1 + vec2<f32>(time * uniforms.detailSpeed1, 0.0),
        uniforms
    ) * uniforms.detailStrength1;

    let detailNoise2 = getSimplexNoiseByDimension(
        uv * uniforms.detailScale2 + vec2<f32>(0.0, time * uniforms.detailSpeed2),
        uniforms
    ) * uniforms.detailStrength2;

    let combinedWaves = wave1 + wave2 + wave3 + wave4;
    let combinedDetail = detailNoise1 + detailNoise2;
    let foamIntensity = smoothstep(uniforms.foamThreshold - 0.1, uniforms.foamThreshold + 0.1, combinedWaves);

    return combinedWaves + combinedDetail * (1.0 - foamIntensity * 0.5);
}

fn calculateNormalFromHeight(uv: vec2<f32>, centerHeight: f32, time: f32, uniforms: Uniforms) -> vec2<f32> {
    let offset = uniforms.normalOffset;

    let heightRight = getHeightAtUV(uv + vec2<f32>(offset, 0.0), time, uniforms);
    let heightLeft = getHeightAtUV(uv - vec2<f32>(offset, 0.0), time, uniforms);
    let heightUp = getHeightAtUV(uv + vec2<f32>(0.0, offset), time, uniforms);
    let heightDown = getHeightAtUV(uv - vec2<f32>(0.0, offset), time, uniforms);

    let gradientX = (heightRight - heightLeft) / (2.0 * offset);
    let gradientY = (heightUp - heightDown) / (2.0 * offset);

    let normalStrength = uniforms.normalStrength;

    return vec2<f32>(
        -gradientX * normalStrength,
        -gradientY * normalStrength
    );
}

fn smoothBlend(a: f32, b: f32, factor: f32) -> f32 {
    let t = smoothstep(0.0, 1.0, factor);
    return mix(a, b, t);
}
