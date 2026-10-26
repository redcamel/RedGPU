#redgpu_include landscape.struct.StochasticGridTri;
#redgpu_include landscape.struct.StochasticSampleResult;

fn stochasticHash2D(p: vec2<f32>) -> vec3<f32> {
    var p3 = fract(vec3<f32>(p.xyx) * vec3<f32>(0.1031, 0.1030, 0.0973));
    p3 = p3 + dot(p3, p3.yzx + 33.33);
    return fract((p3.xxy + p3.yzz) * p3.zyx);
}

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

fn perturbNormalOrthonormal(baseN: vec3<f32>, tangentN: vec3<f32>) -> vec3<f32> {
    if (dot(tangentN.xy, tangentN.xy) <= 1e-6) {
        return baseN;
    }
    let upVec = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(0.0, 0.0, 1.0), abs(baseN.y) > 0.999);
    let tangentX = normalize(cross(upVec, baseN));
    let tangentZ = cross(baseN, tangentX);
    return tangentX * tangentN.x + tangentZ * tangentN.y + baseN * tangentN.z;
}
