struct Uniforms {
    radius: f32,
    pad0: f32,
    pad1: f32,
    pad2: f32,
};

fn sampleTent9Tap(tex: texture_2d<f32>, uv: vec2<f32>, texelSize: vec2<f32>) -> vec3<f32> {
    let d = texelSize.xyxy * vec4<f32>(1.0, 1.0, -1.0, 0.0);
    let c0 = textureSampleLevel(tex, basicSampler, uv - d.xy, 0.0).rgb;
    let c1 = textureSampleLevel(tex, basicSampler, uv - d.wy, 0.0).rgb;
    let c2 = textureSampleLevel(tex, basicSampler, uv - d.zy, 0.0).rgb;
    let c3 = textureSampleLevel(tex, basicSampler, uv + d.zw, 0.0).rgb;
    let c4 = textureSampleLevel(tex, basicSampler, uv,        0.0).rgb;
    let c5 = textureSampleLevel(tex, basicSampler, uv + d.xw, 0.0).rgb;
    let c6 = textureSampleLevel(tex, basicSampler, uv + d.zy, 0.0).rgb;
    let c7 = textureSampleLevel(tex, basicSampler, uv + d.wy, 0.0).rgb;
    let c8 = textureSampleLevel(tex, basicSampler, uv + d.xy, 0.0).rgb;

    return (c0 + c2 + c6 + c8 + (c1 + c3 + c5 + c7) * 2.0 + c4 * 4.0) * 0.0625;
}
