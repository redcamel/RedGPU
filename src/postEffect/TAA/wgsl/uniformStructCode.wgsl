// ===== Uniforms =====
struct Uniforms {
    jitterStrength: f32,
    frameIndex: f32,
    jitterOffset: vec2<f32>,
    prevJitterOffset: vec2<f32>,  // 추가 필요!
};
// 최적화된 5-tap 캣물-롬 필터링 함수 (16개 샘플을 5번의 텍스처 샘플링으로 계산)
fn sample_texture_catmull_rom(tex: texture_2d<f32>, smp: sampler, uv: vec2<f32>, texSize: vec2<f32>) -> vec4<f32> {
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

    var result = vec4<f32>(0.0);
    result += textureSampleLevel(tex, smp, vec2<f32>(texPos0.x,  texPos12.y), 0.0) * w0.x * w12.y;
    result += textureSampleLevel(tex, smp, vec2<f32>(texPos12.x, texPos0.y),  0.0) * w12.x * w0.y;
    result += textureSampleLevel(tex, smp, vec2<f32>(texPos12.x, texPos12.y), 0.0) * w12.x * w12.y;
    result += textureSampleLevel(tex, smp, vec2<f32>(texPos12.x, texPos3.y),  0.0) * w12.x * w3.y;
    result += textureSampleLevel(tex, smp, vec2<f32>(texPos3.x,  texPos12.y), 0.0) * w3.x * w12.y;

    return max(vec4<f32>(0.0), result / (w12.x * w12.y + w0.x * w12.y + w12.x * w0.y + w12.x * w3.y + w3.x * w12.y));
}