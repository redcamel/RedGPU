struct Uniforms {
    filmGrainIntensity: f32,
    filmGrainResponse: f32,
    filmGrainScale: f32,
    coloredGrain: f32,
    grainSaturation: f32,
    time: f32,
    devicePixelRatio: f32
};

fn filmGrainNoise(coord: vec2<f32>) -> f32 {
    let p = floor(coord);
    let f = fract(coord);

    let u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

    let a = hash(p);
    let b = hash(p + vec2<f32>(1.0, 0.0));
    let c = hash(p + vec2<f32>(0.0, 1.0));
    let d = hash(p + vec2<f32>(1.0, 1.0));

    let noise = mix(mix(a, b, u.x), mix(c, d, u.x), u.y);

    return (noise - 0.5) * 2.0;
}

fn hash(p: vec2<f32>) -> f32 {
    var p3 = fract(vec3<f32>(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}
