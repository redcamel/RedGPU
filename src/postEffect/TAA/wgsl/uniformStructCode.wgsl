// ===== Uniforms =====
struct Uniforms {
    jitterStrength: f32,
    frameIndex: f32,
    jitterOffset: vec2<f32>,
    prevJitterOffset: vec2<f32>,  // 추가 필요!
};
fn rgb_to_ycocg(rgb: vec3<f32>) -> vec3<f32> {
    let y = dot(rgb, vec3<f32>(0.25, 0.5, 0.25));
    let co = dot(rgb, vec3<f32>(0.5, 0.0, -0.5));
    let cg = dot(rgb, vec3<f32>(-0.25, 0.5, -0.25));
    return vec3<f32>(y, co, cg);
}

fn ycocg_to_rgb(ycocg: vec3<f32>) -> vec3<f32> {
    let y = ycocg.x;
    let co = ycocg.y;
    let cg = ycocg.z;
    let r = y + co - cg;
    let g = y + cg;
    let b = y - co - cg;
    return vec3<f32>(r, g, b);
}

fn sample_texture_catmull_rom_ycocg(tex: texture_2d<f32>, smp: sampler, uv: vec2<f32>, texSize: vec2<f32>) -> vec3<f32> {
    let samplePos = uv * texSize;
    let texPos1 = floor(samplePos - 0.5) + 0.5;
    let f = samplePos - texPos1;

    let w0 = f * (-0.5 + f * (1.0 - 0.5 * f));
    let w1 = 1.0 + f * f * (-2.5 + 1.5 * f);
    let w2 = f * (0.5 + f * (2.0 - 1.5 * f));
    let w3 = f * f * (-0.5 + 0.5 * f);

    let w12 = w1 + w2;
    let offset12 = w2 / w12;

    let texPos0 = (texPos1 - 1.0) / texSize;
    let texPos3 = (texPos1 + 2.0) / texSize;
    let texPos12 = (texPos1 + offset12) / texSize;

    // 5-tap 샘플링 수행
    let s0 = textureSampleLevel(tex, smp, vec2<f32>(texPos0.x,  texPos12.y), 0.0).rgb;
    let s1 = textureSampleLevel(tex, smp, vec2<f32>(texPos12.x, texPos0.y),  0.0).rgb;
    let s2 = textureSampleLevel(tex, smp, vec2<f32>(texPos12.x, texPos12.y), 0.0).rgb;
    let s3 = textureSampleLevel(tex, smp, vec2<f32>(texPos12.x, texPos3.y),  0.0).rgb;
    let s4 = textureSampleLevel(tex, smp, vec2<f32>(texPos3.x,  texPos12.y), 0.0).rgb;

    // 가중치 계산
    var result = s0 * w0.x * w12.y +
                 s1 * w12.x * w0.y +
                 s2 * w12.x * w12.y +
                 s3 * w12.x * w3.y +
                 s4 * w3.x * w12.y;

    // 정규화 가중치 합산
    let weightSum = w12.x * w12.y + w0.x * w12.y + w12.x * w0.y + w12.x * w3.y + w3.x * w12.y;
    result /= weightSum;

    // [중요] 음수 에너지 제거 및 너무 튀는 값 방지
    // YCoCg 변환 전후에 발생할 수 있는 비정상적인 색상을 잡아줍니다.
    return max(vec3<f32>(0.0), result);
}