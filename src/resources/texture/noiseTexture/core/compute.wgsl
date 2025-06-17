/* Simplex Noise 2D 기본 함수들 */
fn mod289_vec3(x: vec3<f32>) -> vec3<f32> {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn mod289_vec2(x: vec2<f32>) -> vec2<f32> {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn permute(x: vec3<f32>) -> vec3<f32> {
    return mod289_vec3(((x * 34.0) + 1.0) * x);
}

fn simplex2D(v: vec2<f32>) -> f32 {
    let C = vec4<f32>(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    var i = floor(v + dot(v, C.yy));
    let x0 = v - i + dot(i, C.xx);
    let i1 = select(vec2<f32>(0.0, 1.0), vec2<f32>(1.0, 0.0), x0.x > x0.y);
    var x12 = x0.xyxy + C.xxzz;
    x12.x = x12.x - i1.x;
    x12.y = x12.y - i1.y;
    i = mod289_vec2(i);
    let p = permute(permute(i.y + vec3<f32>(0.0, i1.y, 1.0)) + i.x + vec3<f32>(0.0, i1.x, 1.0));
    var m = max(0.5 - vec3<f32>(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), vec3<f32>(0.0));
    m = m * m;
    m = m * m;
    let x = 2.0 * fract(p * C.www) - 1.0;
    let h = abs(x) - 0.5;
    let ox = floor(x + 0.5);
    let a0 = x - ox;
    m = m * (1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h));
    let g = vec3<f32>(a0.x * x0.x + h.x * x0.y, a0.y * x12.x + h.y * x12.y, a0.z * x12.z + h.z * x12.w);
    return 130.0 * dot(m, g);
}

fn fbm(pos: vec2<f32>, octaves: i32) -> f32 {
    var value = 0.0;
    var amplitude = 0.5;
    var frequency = 1.0;
    var max_value = 0.0;

    for (var i = 0; i < octaves; i++) {
        if (i >= octaves) { break; }
        value += simplex2D(pos * frequency) * amplitude;
        max_value += amplitude;
        amplitude *= 0.5;
        frequency *= 2.0;
    }

    return value / max_value;
}

fn getNoise2D( uv:vec2<f32>,uniforms:Uniforms) -> f32{
    var total_amplitude: f32 = 0.0;
    var noise_value: f32 = 0.0;
    var current_amplitude: f32 = 1.0;
    var current_frequency: f32 = uniforms.frequency;

    /* Fractal Brownian Motion (FBM) - 여러 옥타브 합성 */
    for (var i: i32 = 0; i < uniforms.octaves; i++) {
        let noise_pos = (uv + uniforms.seed) * current_frequency;
        let octave_noise = simplex2D(noise_pos);

        noise_value += octave_noise * current_amplitude;
        total_amplitude += current_amplitude;

        current_amplitude *= uniforms.persistence;
        current_frequency *= uniforms.lacunarity;
    }

    /* 정규화 */
    noise_value /= total_amplitude;

    /* amplitude를 최종 결과에 적용 */
    noise_value *= uniforms.amplitude;

    /* -1 ~ 1 범위를 0 ~ 1로 변환 */
    let normalized_noise = (noise_value + 1.0) * 0.5;
    return normalized_noise;
}
