fn stochasticHash2D(p: vec2<f32>) -> vec3<f32> {
    var p3 = fract(vec3<f32>(p.xyx) * vec3<f32>(0.1031, 0.1030, 0.0973));
    p3 = p3 + dot(p3, p3.yzx + 33.33);
    return fract((p3.xxy + p3.yzz) * p3.zyx);
}

fn rotate2D(v: vec2<f32>, angle: f32) -> vec2<f32> {
    let c = cos(angle);
    let s = sin(angle);
    return vec2<f32>(v.x * c - v.y * s, v.x * s + v.y * c);
}

// 🚀 [SFU 최적화]: 동일 각도에 대해 사전 계산된 cos, sin을 재사용하여 중복 삼각함수 호출 제거
fn rotate2DPrecalc(v: vec2<f32>, c: f32, s: f32) -> vec2<f32> {
    return vec2<f32>(v.x * c - v.y * s, v.x * s + v.y * c);
}

struct StochasticGridTri {
    v0: vec2<f32>,
    v1: vec2<f32>,
    v2: vec2<f32>,
    w0: f32,
    w1: f32,
    w2: f32,
};

fn getStochasticGridTri(uv: vec2<f32>) -> StochasticGridTri {
    var res: StochasticGridTri;
    let skew = vec2<f32>(
        uv.x - uv.y * 0.57735026919,
        uv.y * 1.15470053838
    );
    let cell = floor(skew);
    let f = skew - cell;

    var v0 = cell;
    var v1 = cell + vec2<f32>(1.0, 0.0);
    var v2 = cell + vec2<f32>(0.0, 1.0);
    var w0 = 1.0 - f.x - f.y;
    var w1 = f.x;
    var w2 = f.y;

    if (w0 < 0.0) {
        v0 = cell + vec2<f32>(1.0, 1.0);
        v1 = cell + vec2<f32>(1.0, 0.0);
        v2 = cell + vec2<f32>(0.0, 1.0);
        w0 = -w0;
        w1 = 1.0 - f.y;
        w2 = 1.0 - f.x;
    }

    // 🚀 [SFU 최적화]: 정수 3승을 pow() 대신 순수 ALU 곱셈으로 전개 (SFU pow 3회 완전 제거)
    let sw0 = w0 * w0 * w0;
    let sw1 = w1 * w1 * w1;
    let sw2 = w2 * w2 * w2;
    let sumW = sw0 + sw1 + sw2;

    let invSumW = 1.0 / sumW;
    res.v0 = v0;
    res.v1 = v1;
    res.v2 = v2;
    res.w0 = sw0 * invSumW;
    res.w1 = sw1 * invSumW;
    res.w2 = sw2 * invSumW;
    return res;
}

struct StochasticSampleResult {
    albedo: vec3<f32>,
    normal: vec3<f32>,
    orm: vec4<f32>,
};
