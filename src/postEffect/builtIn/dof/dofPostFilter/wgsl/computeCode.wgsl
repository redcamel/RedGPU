let index = global_id.xy;
let halfDims = vec2<f32>(postEffectOutputDimensions);
let texelSize = 1.0 / halfDims;
let uv = (vec2<f32>(index) + 0.5) * texelSize;

let centerBokeh = textureLoad(bokehTexture, index, 0);
let isForegroundPass = uniforms.passMode == 1u;

if (!isForegroundPass) {
    // [KO] Pass 4A: 배경(Background) 보케 버퍼 전용 9-Tap CoC-Bilateral Tent 스무딩
    // [EN] Pass 4A: Dedicated 9-Tap CoC-Bilateral Tent smoothing for the Background bokeh buffer
    let centerFarCoC = centerBokeh.a;
    if (centerFarCoC < 0.25) {
        textureStore(outputTexture, index, centerBokeh);
        return;
    }

    let tentOffset = clamp(centerFarCoC * 0.25, 0.5, 2.25);
    let d = texelSize.xyxy * vec4<f32>(1.0, 1.0, -1.0, 0.0) * tentOffset;

    let s00 = textureSampleLevel(bokehTexture, basicSampler, uv - d.xy, 0.0);
    let s10 = textureSampleLevel(bokehTexture, basicSampler, uv - d.wy, 0.0);
    let s20 = textureSampleLevel(bokehTexture, basicSampler, uv - d.zy, 0.0);
    let s01 = textureSampleLevel(bokehTexture, basicSampler, uv + d.zw, 0.0);
    let s21 = textureSampleLevel(bokehTexture, basicSampler, uv + d.xw, 0.0);
    let s02 = textureSampleLevel(bokehTexture, basicSampler, uv + d.zy, 0.0);
    let s12 = textureSampleLevel(bokehTexture, basicSampler, uv + d.wy, 0.0);
    let s22 = textureSampleLevel(bokehTexture, basicSampler, uv + d.xy, 0.0);

    let cSharp = saturate(centerFarCoC);
    let w00 = 1.0 / (0.1 + abs(saturate(s00.a) - cSharp) * 8.0);
    let w10 = 2.0 / (0.1 + abs(saturate(s10.a) - cSharp) * 8.0);
    let w20 = 1.0 / (0.1 + abs(saturate(s20.a) - cSharp) * 8.0);
    let w01 = 2.0 / (0.1 + abs(saturate(s01.a) - cSharp) * 8.0);
    let w11 = 4.0 / 0.1;
    let w21 = 2.0 / (0.1 + abs(saturate(s21.a) - cSharp) * 8.0);
    let w02 = 1.0 / (0.1 + abs(saturate(s02.a) - cSharp) * 8.0);
    let w12 = 2.0 / (0.1 + abs(saturate(s12.a) - cSharp) * 8.0);
    let w22 = 1.0 / (0.1 + abs(saturate(s22.a) - cSharp) * 8.0);

    let weightSum = w00 + w10 + w20 + w01 + w11 + w21 + w02 + w12 + w22;
    let filteredColor = (
        s00.rgb * w00 + s10.rgb * w10 + s20.rgb * w20 +
        s01.rgb * w01 + centerBokeh.rgb * w11 + s21.rgb * w21 +
        s02.rgb * w02 + s12.rgb * w12 + s22.rgb * w22
    ) / max(weightSum, 1e-4);

    textureStore(outputTexture, index, vec4<f32>(filteredColor, centerFarCoC));
} else {
    // [KO] Pass 4B: 전경(Foreground) 보케 및 불투명도(α_fg) 전용 프리멀티플라이드(Premultiplied) 9-Tap Tent 스무딩
    // [EN] Pass 4B: Dedicated premultiplied 9-Tap Tent smoothing for Foreground bokeh and opacity (α_fg)
    let fgTentOffset = mix(1.0, 1.5, centerBokeh.a);
    let d = texelSize.xyxy * vec4<f32>(1.0, 1.0, -1.0, 0.0) * fgTentOffset;

    let s00 = textureSampleLevel(bokehTexture, basicSampler, uv - d.xy, 0.0);
    let s20 = textureSampleLevel(bokehTexture, basicSampler, uv - d.zy, 0.0);
    let s02 = textureSampleLevel(bokehTexture, basicSampler, uv + d.zy, 0.0);
    let s22 = textureSampleLevel(bokehTexture, basicSampler, uv + d.xy, 0.0);

    // [KO] 대각 4-코너 양선형 샘플은 3x3 인접 9개 텍셀 전체를 포괄하므로, 합이 0이면 십자 4-Tap 페치 없이 즉시 조기 종료
    // [EN] Diagonal 4-corner bilinear samples cover all 9 texels of the 3x3 neighborhood; early-out immediately without the 4 cardinal fetches if their sum is 0
    if (centerBokeh.a + s00.a + s20.a + s02.a + s22.a < 1e-4) {
        textureStore(outputTexture, index, vec4<f32>(centerBokeh.rgb, 0.0));
        return;
    }

    let s10 = textureSampleLevel(bokehTexture, basicSampler, uv - d.wy, 0.0);
    let s01 = textureSampleLevel(bokehTexture, basicSampler, uv + d.zw, 0.0);
    let s21 = textureSampleLevel(bokehTexture, basicSampler, uv + d.xw, 0.0);
    let s12 = textureSampleLevel(bokehTexture, basicSampler, uv + d.wy, 0.0);

    let outAlpha = (
        s00.a * 1.0 + s10.a * 2.0 + s20.a * 1.0 +
        s01.a * 2.0 + centerBokeh.a * 4.0 + s21.a * 2.0 +
        s02.a * 1.0 + s12.a * 2.0 + s22.a * 1.0
    ) * (1.0 / 16.0);

    if (outAlpha < 1e-3) {
        textureStore(outputTexture, index, vec4<f32>(centerBokeh.rgb, 0.0));
        return;
    }

    let cw00 = 1.0 * max(s00.a, 1e-4);
    let cw10 = 2.0 * max(s10.a, 1e-4);
    let cw20 = 1.0 * max(s20.a, 1e-4);
    let cw01 = 2.0 * max(s01.a, 1e-4);
    let cw11 = 4.0 * max(centerBokeh.a, 1e-4);
    let cw21 = 2.0 * max(s21.a, 1e-4);
    let cw02 = 1.0 * max(s02.a, 1e-4);
    let cw12 = 2.0 * max(s12.a, 1e-4);
    let cw22 = 1.0 * max(s22.a, 1e-4);

    let colorWeightSum = cw00 + cw10 + cw20 + cw01 + cw11 + cw21 + cw02 + cw12 + cw22;
    let outFgColor = (
        s00.rgb * cw00 + s10.rgb * cw10 + s20.rgb * cw20 +
        s01.rgb * cw01 + centerBokeh.rgb * cw11 + s21.rgb * cw21 +
        s02.rgb * cw02 + s12.rgb * cw12 + s22.rgb * cw22
    ) / max(colorWeightSum, 1e-4);

    textureStore(outputTexture, index, vec4<f32>(outFgColor, outAlpha));
}
