/* Simplex Noise 1D, 2D, 3D 기본 함수들 */
fn mod289_vec3(x: vec3<f32>) -> vec3<f32> {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn mod289_vec2(x: vec2<f32>) -> vec2<f32> {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn mod289_vec4(x: vec4<f32>) -> vec4<f32> {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn mod289_f32(x: f32) -> f32 {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn permute(x: vec3<f32>) -> vec3<f32> {
    return mod289_vec3(((x * 34.0) + 1.0) * x);
}

fn permute4(x: vec4<f32>) -> vec4<f32> {
    return mod289_vec4(((x * 34.0) + 1.0) * x);
}

fn permute_f32(x: f32) -> f32 {
    return mod289_f32(((x * 34.0) + 1.0) * x);
}

fn taylorInvSqrt4(r: vec4<f32>) -> vec4<f32> {
    return 1.79284291400159 - 0.85373472095314 * r;
}

fn simplex1D(x: f32) -> f32 {
    var i = floor(x);
    let f = fract(x);

    /* 1D에서는 그래디언트가 단순히 +1 또는 -1 */
    let g0 = select(-1.0, 1.0, (permute_f32(i) * 0.024390243902439) >= 0.5);
    let g1 = select(-1.0, 1.0, (permute_f32(i + 1.0) * 0.024390243902439) >= 0.5);

    /* 거리 계산 */
    let d0 = f;
    let d1 = f - 1.0;

    /* 가중치 계산 (6t^5 - 15t^4 + 10t^3 smoothstep curve) */
    let t = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

    /* 인터폴레이션 */
    let n0 = g0 * d0;
    let n1 = g1 * d1;

    return mix(n0, n1, t) * 0.395; /* 정규화 상수 */
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

fn simplex3D(v: vec3<f32>) -> f32 {
    let C = vec2<f32>(1.0/6.0, 1.0/3.0);
    let D = vec4<f32>(0.0, 0.5, 1.0, 2.0);

    /* First corner */
    var i = floor(v + dot(v, C.yyy));
    let x0 = v - i + dot(i, C.xxx);

    /* Other corners */
    let g = step(x0.yzx, x0.xyz);
    let l = 1.0 - g;
    let i1 = min(g.xyz, l.zxy);
    let i2 = max(g.xyz, l.zxy);

    let x1 = x0 - i1 + C.xxx;
    let x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    let x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    /* Permutations */
    i = mod289_vec3(i);
    let p = permute4(permute4(permute4(
                i.z + vec4<f32>(0.0, i1.z, i2.z, 1.0 )) +
                i.y + vec4<f32>(0.0, i1.y, i2.y, 1.0 )) +
                i.x + vec4<f32>(0.0, i1.x, i2.x, 1.0 ));

    /* Gradients: 7x7 points over a square, mapped onto an octahedron. */
    /* The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294) */
    let n_ = 0.142857142857; // 1.0/7.0
    let ns = n_ * D.wyz - D.xzx;

    let j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    let x_ = floor(j * ns.z);
    let y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    let x = x_ *ns.x + ns.yyyy;
    let y = y_ *ns.x + ns.yyyy;
    let h = 1.0 - abs(x) - abs(y);

    let b0 = vec4<f32>( x.xy, y.xy );
    let b1 = vec4<f32>( x.zw, y.zw );

    let s0 = floor(b0)*2.0 + 1.0;
    let s1 = floor(b1)*2.0 + 1.0;
    let sh = -step(h, vec4<f32>(0.0));

    let a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    let a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    var p0 = vec3<f32>(a0.xy,h.x);
    var p1 = vec3<f32>(a0.zw,h.y);
    var p2 = vec3<f32>(a1.xy,h.z);
    var p3 = vec3<f32>(a1.zw,h.w);

    /* Normalise gradients */
    let norm = taylorInvSqrt4(vec4<f32>(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    /* Mix final noise value */
    var m = max(0.6 - vec4<f32>(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), vec4<f32>(0.0));
    m = m * m;
    return 42.0 * dot( m*m, vec4<f32>( dot(p0,x0), dot(p1,x1),
                                      dot(p2,x2), dot(p3,x3) ) );
}

fn fbm1D(pos: f32, octaves: i32) -> f32 {
    var value = 0.0;
    var amplitude = 0.5;
    var frequency = 1.0;
    var max_value = 0.0;

    for (var i = 0; i < octaves; i++) {
        if (i >= octaves) { break; }
        value += simplex1D(pos * frequency) * amplitude;
        max_value += amplitude;
        amplitude *= 0.5;
        frequency *= 2.0;
    }

    return value / max_value;
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

fn fbm3D(pos: vec3<f32>, octaves: i32) -> f32 {
    var value = 0.0;
    var amplitude = 0.5;
    var frequency = 1.0;
    var max_value = 0.0;

    for (var i = 0; i < octaves; i++) {
        if (i >= octaves) { break; }
        value += simplex3D(pos * frequency) * amplitude;
        max_value += amplitude;
        amplitude *= 0.5;
        frequency *= 2.0;
    }

    return value / max_value;
}

fn getNoise1D(pos: f32, uniforms: Uniforms) -> f32 {
    var total_amplitude: f32 = 0.0;
    var noise_value: f32 = 0.0;
    var current_amplitude: f32 = 1.0;
    var current_frequency: f32 = uniforms.frequency;

    /* Fractal Brownian Motion (FBM) - 여러 옥타브 합성 */
    for (var i: i32 = 0; i < uniforms.octaves; i++) {
        let noise_pos = (pos + uniforms.seed) * current_frequency;
        let octave_noise = simplex1D(noise_pos);

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

fn getNoise2D(uv: vec2<f32>, uniforms: Uniforms) -> f32 {
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

fn getNoise3D(pos: vec3<f32>, uniforms: Uniforms) -> f32 {
    var total_amplitude: f32 = 0.0;
    var noise_value: f32 = 0.0;
    var current_amplitude: f32 = 1.0;
    var current_frequency: f32 = uniforms.frequency;

    /* Fractal Brownian Motion (FBM) - 여러 옥타브 합성 */
    for (var i: i32 = 0; i < uniforms.octaves; i++) {
        let noise_pos = (pos + vec3<f32>(uniforms.seed)) * current_frequency;
        let octave_noise = simplex3D(noise_pos);

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
fn getNoiseByDimension(uv: vec2<f32>, uniforms: Uniforms) -> f32 {
    if (uniforms.noiseDimension < 1.1) {
        return getNoise1D(uv.x, uniforms);
    } else if (uniforms.noiseDimension < 2.1) {
        return getNoise2D(uv, uniforms);
    } else if (uniforms.noiseDimension < 3.1) {
        return getNoise3D(vec3<f32>(uv.x, uv.y, uniforms.seed * 0.1), uniforms);
    } else {
        return getNoise2D(uv, uniforms); // 기본값
    }
}
