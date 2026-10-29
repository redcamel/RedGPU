let index = global_id.xy;
let fullDimsI = vec2<i32>(postEffectOutputDimensions);
let maxFullCoord = max(fullDimsI - vec2<i32>(1), vec2<i32>(0));
let fullDims = vec2<f32>(postEffectOutputDimensions);
let invFullDims = 1.0 / fullDims;
let uv = (vec2<f32>(index) + 0.5) * invFullDims;

let sharpSample = textureLoad(sourceTexture, index, 0);
let sharpColor = sharpSample.rgb;

let halfDims = vec2<f32>(textureDimensions(bgBokehTexture));
let halfTexelSize = 1.0 / halfDims;

// [KO] 1. 풀해상도(1x1) 깊이에서 직접 복원한 정확한 물리 착란원 반경 산출 (2x2 블록 계단 현상 원천 제거)
// [EN] 1. Compute exact physical CoC radius reconstructed directly from full-resolution (1x1) depth (eliminating 2x2 blocky silhouettes)
let dpr = min(systemUniforms.devicePixelRatio, 2.0);
let maxHalfCoC = 0.5 * uniforms.maxCoC * dpr;
let viewDepth = reconstructViewDepth(vec2<i32>(index), invFullDims, systemUniforms.projection.inverseProjectionMatrix);
let exactHalfCoC = calculatePhysicalHalfCoC(viewDepth, halfDims.y, maxHalfCoC);
let exactFullCoC = abs(exactHalfCoC) * 2.0;

// [KO] 2. 언리얼 DOF_Recombine 규격: 미세 비초점 구간(Slight Out-of-Focus: 0.35px ~ 4.5px, 전경 및 배경 양방향)에서 원본 풀해상도 8-Tap 직접 개더링 수행
// [EN] 2. Unreal DOF_Recombine specification: direct full-resolution 8-Tap gathering in the slight out-of-focus transition zone (0.35px ~ 4.5px, both near and far)
var baseFullResColor = sharpColor;
if (exactFullCoC > 0.35 && exactFullCoC < 4.5) {
    let slightRadius = clamp(exactFullCoC, 0.5, 2.5);
    var slightSumColor = sharpColor;
    var slightSumWeight: f32 = 1.0;

    for (var i = 0u; i < 8u; i = i + 1u) {
        let tapOffset = SLIGHT_DOF_OFFSETS[i] * slightRadius;
        let tapCoord = clamp(vec2<i32>(floor(vec2<f32>(index) + 0.5 + tapOffset)), vec2<i32>(0), maxFullCoord);
        let tapDepth = reconstructViewDepth(tapCoord, invFullDims, systemUniforms.projection.inverseProjectionMatrix);
        let tapHalfCoC = calculatePhysicalHalfCoC(tapDepth, halfDims.y, maxHalfCoC);
        let tapFullCoC = abs(tapHalfCoC) * 2.0;
        let sameLayerWeight = select(0.25, 1.0, tapHalfCoC * exactHalfCoC >= 0.0);
        let tapWeight = smoothstep(0.15, 0.85, tapFullCoC) * sameLayerWeight;
        if (tapWeight > 0.0) {
            let tapColor = textureLoad(sourceTexture, tapCoord, 0).rgb;
            slightSumColor += tapColor * tapWeight;
            slightSumWeight += tapWeight;
        }
    }

    let slightGatherColor = slightSumColor / max(slightSumWeight, 1e-4);
    let slightBlend = smoothstep(0.35, 1.5, exactFullCoC);
    baseFullResColor = mix(sharpColor, slightGatherColor, slightBlend);
}

// [KO] 3. 배경(Background) 보케 버퍼 9-Tap CoC-Bilateral Tent 업샘플링 및 블렌딩
// [EN] 3. Background bokeh buffer 9-Tap CoC-Bilateral Tent upsampling and blending
let d = halfTexelSize.xyxy * vec4<f32>(1.0, 1.0, -1.0, 0.0);

let b00 = textureSampleLevel(bgBokehTexture, basicSampler, uv - d.xy, 0.0);
let b10 = textureSampleLevel(bgBokehTexture, basicSampler, uv - d.wy, 0.0);
let b20 = textureSampleLevel(bgBokehTexture, basicSampler, uv - d.zy, 0.0);
let b01 = textureSampleLevel(bgBokehTexture, basicSampler, uv + d.zw, 0.0);
let b11 = textureSampleLevel(bgBokehTexture, basicSampler, uv, 0.0);
let b21 = textureSampleLevel(bgBokehTexture, basicSampler, uv + d.xw, 0.0);
let b02 = textureSampleLevel(bgBokehTexture, basicSampler, uv + d.zy, 0.0);
let b12 = textureSampleLevel(bgBokehTexture, basicSampler, uv + d.wy, 0.0);
let b22 = textureSampleLevel(bgBokehTexture, basicSampler, uv + d.xy, 0.0);

let bw00 = computeBgUpsampleBilateralWeight(b00.a, exactHalfCoC, 1.0);
let bw10 = computeBgUpsampleBilateralWeight(b10.a, exactHalfCoC, 2.0);
let bw20 = computeBgUpsampleBilateralWeight(b20.a, exactHalfCoC, 1.0);
let bw01 = computeBgUpsampleBilateralWeight(b01.a, exactHalfCoC, 2.0);
let bw11 = computeBgUpsampleBilateralWeight(b11.a, exactHalfCoC, 4.0);
let bw21 = computeBgUpsampleBilateralWeight(b21.a, exactHalfCoC, 2.0);
let bw02 = computeBgUpsampleBilateralWeight(b02.a, exactHalfCoC, 1.0);
let bw12 = computeBgUpsampleBilateralWeight(b12.a, exactHalfCoC, 2.0);
let bw22 = computeBgUpsampleBilateralWeight(b22.a, exactHalfCoC, 1.0);

let bgWeightSum = max(bw00 + bw10 + bw20 + bw01 + bw11 + bw21 + bw02 + bw12 + bw22, 1e-4);
let upsampledBgColor = (
    b00.rgb * bw00 + b10.rgb * bw10 + b20.rgb * bw20 +
    b01.rgb * bw01 + b11.rgb * bw11 + b21.rgb * bw21 +
    b02.rgb * bw02 + b12.rgb * bw12 + b22.rgb * bw22
) / bgWeightSum;

let farBokehBlend = select(smoothstep(0.5, 1.75, exactHalfCoC), smoothstep(1.25, 2.5, -exactHalfCoC), exactHalfCoC < 0.0);
let compositedBgColor = mix(baseFullResColor, upsampledBgColor, farBokehBlend);

// [KO] 4. 전경(Foreground) 보케 및 불투명도(α_fg) 프리멀티플라이드 9-Tap Tent 업샘플링 및 연속 Porter-Duff Over 합성
// [EN] 4. Foreground bokeh and opacity (α_fg) premultiplied 9-Tap Tent upsampling and continuous Porter-Duff Over composition
let f00 = textureSampleLevel(fgBokehTexture, basicSampler, uv - d.xy, 0.0);
let f10 = textureSampleLevel(fgBokehTexture, basicSampler, uv - d.wy, 0.0);
let f20 = textureSampleLevel(fgBokehTexture, basicSampler, uv - d.zy, 0.0);
let f01 = textureSampleLevel(fgBokehTexture, basicSampler, uv + d.zw, 0.0);
let f11 = textureSampleLevel(fgBokehTexture, basicSampler, uv, 0.0);
let f21 = textureSampleLevel(fgBokehTexture, basicSampler, uv + d.xw, 0.0);
let f02 = textureSampleLevel(fgBokehTexture, basicSampler, uv + d.zy, 0.0);
let f12 = textureSampleLevel(fgBokehTexture, basicSampler, uv + d.wy, 0.0);
let f22 = textureSampleLevel(fgBokehTexture, basicSampler, uv + d.xy, 0.0);

let upsampledFgOpacity = (
    f00.a * 1.0 + f10.a * 2.0 + f20.a * 1.0 +
    f01.a * 2.0 + f11.a * 4.0 + f21.a * 2.0 +
    f02.a * 1.0 + f12.a * 2.0 + f22.a * 1.0
) * (1.0 / 16.0);

var finalColor = compositedBgColor;
if (upsampledFgOpacity > 1e-3) {
    let fcw00 = 1.0 * max(f00.a, 1e-4);
    let fcw10 = 2.0 * max(f10.a, 1e-4);
    let fcw20 = 1.0 * max(f20.a, 1e-4);
    let fcw01 = 2.0 * max(f01.a, 1e-4);
    let fcw11 = 4.0 * max(f11.a, 1e-4);
    let fcw21 = 2.0 * max(f21.a, 1e-4);
    let fcw02 = 1.0 * max(f02.a, 1e-4);
    let fcw12 = 2.0 * max(f12.a, 1e-4);
    let fcw22 = 1.0 * max(f22.a, 1e-4);

    let fgColorWeightSum = max(fcw00 + fcw10 + fcw20 + fcw01 + fcw11 + fcw21 + fcw02 + fcw12 + fcw22, 1e-4);
    let upsampledFgColor = (
        f00.rgb * fcw00 + f10.rgb * fcw10 + f20.rgb * fcw20 +
        f01.rgb * fcw01 + f11.rgb * fcw11 + f21.rgb * fcw21 +
        f02.rgb * fcw02 + f12.rgb * fcw12 + f22.rgb * fcw22
    ) / fgColorWeightSum;

    let finalFgOpacity = clamp(upsampledFgOpacity, 0.0, 1.0);
    finalColor = mix(compositedBgColor, upsampledFgColor, finalFgOpacity);
}

textureStore(outputTexture, index, vec4<f32>(finalColor, sharpSample.a));
