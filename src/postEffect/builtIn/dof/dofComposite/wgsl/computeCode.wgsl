let index = global_id.xy;
let fullDims = vec2<f32>(postEffectOutputDimensions);
let invFullDims = 1.0 / fullDims;
let uv = (vec2<f32>(index) + 0.5) * invFullDims;

let sharpSample = textureLoad(sourceTexture, index, 0);
let sharpColor = sharpSample.rgb;

let halfDims = vec2<f32>(textureDimensions(bgBokehTexture));
let halfTexelSize = 1.0 / halfDims;
let halfToFullScale = fullDims.y / max(halfDims.y, 1.0);

// [KO] 1. 풀해상도(1x1) 5-Tap 십자 깊이 범위 및 시간 안정화된 CoC(cocTexture) 결합으로 2x2 블록 계단 현상과 TAA 서브픽셀 경계 떨림을 동시 제거
// [EN] 1. Combine full-resolution (1x1) 5-Tap cross depth bounds with temporally stabilized CoC (cocTexture) to eliminate both 2x2 blocky silhouettes and TAA sub-pixel edge jitter
let maxHalfCoC = computeAutoMaxHalfCoC(systemUniforms.devicePixelRatio);
let minNearDepth = max(systemUniforms.camera.nearClipping, 0.001);
let invProjZW = extractInvProjZW(systemUniforms.projection.inverseProjectionMatrix);

let minFocusDepth = max(systemUniforms.camera.nearClipping, 0.01);
let maxFocusDepth = min(max(systemUniforms.camera.farClipping, minFocusDepth + 1.0), 65000.0);
let manualFocusDistance = clamp(uniforms.focusDistance, minFocusDepth, maxFocusDepth);
var effectiveFocusDistance = manualFocusDistance;
if (uniforms.useAutoFocus == 1u) {
    let focusState = textureLoad(focusTexture, vec2<i32>(0, 0), 0);
    effectiveFocusDistance = select(manualFocusDistance, focusState.r, focusState.g > 0.5);
}

let lensParams = computeDOFCoCLensParams(
    uniforms.aperture,
    uniforms.focalLength,
    effectiveFocusDistance,
    halfDims.y
);

let maxDepthCoord = max(vec2<i32>(textureDimensions(depthTexture)) - vec2<i32>(1), vec2<i32>(0));
let coordC = clamp(vec2<i32>(index), vec2<i32>(0), maxDepthCoord);
let cocC = samplePhysicalHalfCoCAtDepthCoord(coordC, invProjZW, minNearDepth, lensParams, maxHalfCoC);

let ndcJitter = systemUniforms.projection.projectionMatrix[2].xy - systemUniforms.projection.noneJitterProjectionMatrix[2].xy;
let isTAAActive = (abs(ndcJitter.x) + abs(ndcJitter.y)) > 1e-6;

var exactHalfCoC = cocC;
if (isTAAActive) {
    let coordL = clamp(coordC + vec2<i32>(-1, 0), vec2<i32>(0), maxDepthCoord);
    let coordR = clamp(coordC + vec2<i32>(1, 0), vec2<i32>(0), maxDepthCoord);
    let coordU = clamp(coordC + vec2<i32>(0, -1), vec2<i32>(0), maxDepthCoord);
    let coordD = clamp(coordC + vec2<i32>(0, 1), vec2<i32>(0), maxDepthCoord);

    let cocL = samplePhysicalHalfCoCAtDepthCoord(coordL, invProjZW, minNearDepth, lensParams, maxHalfCoC);
    let cocR = samplePhysicalHalfCoCAtDepthCoord(coordR, invProjZW, minNearDepth, lensParams, maxHalfCoC);
    let cocU = samplePhysicalHalfCoCAtDepthCoord(coordU, invProjZW, minNearDepth, lensParams, maxHalfCoC);
    let cocD = samplePhysicalHalfCoCAtDepthCoord(coordD, invProjZW, minNearDepth, lensParams, maxHalfCoC);

    let minCrossCoC = min(cocC, min(min(cocL, cocR), min(cocU, cocD)));
    let maxCrossCoC = max(cocC, max(max(cocL, cocR), max(cocU, cocD)));
    let stabilizedHalfCoC = textureSampleLevel(cocTexture, basicSampler, uv, 0.0).a;
    exactHalfCoC = clamp(stabilizedHalfCoC, minCrossCoC, maxCrossCoC);
}
let exactFullCoC = abs(exactHalfCoC) * halfToFullScale;

// [KO] 2. 언리얼 DOF_Recombine 규격: 미세 비초점 구간(Slight Out-of-Focus: 0.75px ~ 4.5px, 전경 및 배경 양방향)에서 양선형 보간 기반 8-Tap 직접 개더링 수행
// [EN] 2. Unreal DOF_Recombine specification: bilinear-interpolated 8-Tap direct gathering in the slight out-of-focus transition zone (0.75px ~ 4.5px, near and far)
var baseFullResColor = sharpColor;
if (exactFullCoC > 0.75 && exactFullCoC < 4.5) {
    let slightRadius = clamp(exactFullCoC, 0.75, 3.5);
    var slightSumColor = sharpColor;
    var slightSumWeight: f32 = 1.0;

    for (var i = 0u; i < 8u; i = i + 1u) {
        let tapOffset = SLIGHT_DOF_OFFSETS[i] * slightRadius;
        let tapUV = saturate(uv + tapOffset * invFullDims);
        let tapHalfCoC = textureSampleLevel(cocTexture, basicSampler, tapUV, 0.0).a;
        let tapFullCoC = abs(tapHalfCoC) * halfToFullScale;
        let sameLayerWeight = select(0.25, 1.0, tapHalfCoC * exactHalfCoC >= 0.0);
        let tapWeight = smoothstep(0.35, 1.15, tapFullCoC) * sameLayerWeight;
        if (tapWeight > 0.0) {
            let tapColor = textureSampleLevel(sourceTexture, basicSampler, tapUV, 0.0).rgb;
            slightSumColor += tapColor * tapWeight;
            slightSumWeight += tapWeight;
        }
    }

    let slightGatherColor = slightSumColor / max(slightSumWeight, 1e-4);
    let slightBlend = smoothstep(0.75, 2.0, exactFullCoC);
    baseFullResColor = mix(sharpColor, slightGatherColor, slightBlend);
}

// [KO] 3. 배경(Background) 보케 버퍼 조건부 9-Tap CoC-Bilateral Tent 업샘플링 및 블렌딩 (초점 영역 0-Tap 조기 스킵)
// [EN] 3. Conditional Background bokeh buffer 9-Tap CoC-Bilateral Tent upsampling and blending (0-Tap early skip in in-focus regions)
let d = halfTexelSize.xyxy * vec4<f32>(1.0, 1.0, -1.0, 0.0);
let isForegroundPixel = exactHalfCoC < -0.25;
let farBokehBlend = select(smoothstep(0.5, 1.75, exactHalfCoC), smoothstep(0.25, 1.5, -exactHalfCoC), isForegroundPixel);

var compositedBgColor = baseFullResColor;
if (farBokehBlend > 1e-3) {
    let b00 = textureSampleLevel(bgBokehTexture, basicSampler, uv - d.xy, 0.0);
    let b10 = textureSampleLevel(bgBokehTexture, basicSampler, uv - d.wy, 0.0);
    let b20 = textureSampleLevel(bgBokehTexture, basicSampler, uv - d.zy, 0.0);
    let b01 = textureSampleLevel(bgBokehTexture, basicSampler, uv + d.zw, 0.0);
    let b11 = textureSampleLevel(bgBokehTexture, basicSampler, uv, 0.0);
    let b21 = textureSampleLevel(bgBokehTexture, basicSampler, uv + d.xw, 0.0);
    let b02 = textureSampleLevel(bgBokehTexture, basicSampler, uv + d.zy, 0.0);
    let b12 = textureSampleLevel(bgBokehTexture, basicSampler, uv + d.wy, 0.0);
    let b22 = textureSampleLevel(bgBokehTexture, basicSampler, uv + d.xy, 0.0);

    // [KO] 전경 픽셀(isForegroundPixel)에서는 전경 자신의 음수 CoC 절대값이 아닌, 홀필링으로 복원된 실제 후면 배경 CoC(b11.a)를 양방향 가중치 기준으로 사용
    // [EN] On foreground pixels (isForegroundPixel), use the reconstructed background CoC (b11.a) rather than abs(exactHalfCoC) as the bilateral reference
    let effectiveBgHalfCoC = select(max(exactHalfCoC, 0.0), b11.a, isForegroundPixel);
    let centerSharpClamp = clamp(effectiveBgHalfCoC, 0.0, 1.5);
    let bw00 = computeBgUpsampleBilateralWeight(b00.a, centerSharpClamp, 1.0);
    let bw10 = computeBgUpsampleBilateralWeight(b10.a, centerSharpClamp, 2.0);
    let bw20 = computeBgUpsampleBilateralWeight(b20.a, centerSharpClamp, 1.0);
    let bw01 = computeBgUpsampleBilateralWeight(b01.a, centerSharpClamp, 2.0);
    let bw11 = computeBgUpsampleBilateralWeight(b11.a, centerSharpClamp, 4.0);
    let bw21 = computeBgUpsampleBilateralWeight(b21.a, centerSharpClamp, 2.0);
    let bw02 = computeBgUpsampleBilateralWeight(b02.a, centerSharpClamp, 1.0);
    let bw12 = computeBgUpsampleBilateralWeight(b12.a, centerSharpClamp, 2.0);
    let bw22 = computeBgUpsampleBilateralWeight(b22.a, centerSharpClamp, 1.0);

    let bgWeightSum = max(bw00 + bw10 + bw20 + bw01 + bw11 + bw21 + bw02 + bw12 + bw22, 1e-4);
    var upsampledBgColor = (
        b00.rgb * bw00 + b10.rgb * bw10 + b20.rgb * bw20 +
        b01.rgb * bw01 + b11.rgb * bw11 + b21.rgb * bw21 +
        b02.rgb * bw02 + b12.rgb * bw12 + b22.rgb * bw22
    ) / bgWeightSum;

    // [KO] 전경 실루엣 경계 내부(1~3px)에서 후면 배경이 초점/미세 비초점 구간(effectiveBgHalfCoC < 1.5)일 때, 인접 비차폐 풀해상도 원본 탭을 결합하여 1/2 해상도 경계 단차 제거
    // [EN] Inside the foreground silhouette boundary (1~3px) when the background is in-focus/slight-DoF (effectiveBgHalfCoC < 1.5), blend adjacent unoccluded full-res source taps to eliminate the 1/2-res boundary step
    if (isForegroundPixel && effectiveBgHalfCoC < 1.5) {
        var fullResBgSum = vec3<f32>(0.0);
        var fullResBgWeight: f32 = 0.0;
        for (var i = 0u; i < 8u; i = i + 1u) {
            let tapUV = saturate(uv + SLIGHT_DOF_OFFSETS[i] * 2.5 * invFullDims);
            let tapHalfCoC = textureSampleLevel(cocTexture, basicSampler, tapUV, 0.0).a;
            if (tapHalfCoC > -0.15 && tapHalfCoC < 1.5) {
                let w = smoothstep(-0.15, 0.1, tapHalfCoC) * (1.0 - smoothstep(0.5, 1.5, tapHalfCoC));
                fullResBgSum += textureSampleLevel(sourceTexture, basicSampler, tapUV, 0.0).rgb * w;
                fullResBgWeight += w;
            }
        }
        if (fullResBgWeight > 1e-4) {
            let fullResBgSharpness = 1.0 - smoothstep(0.35, 1.35, effectiveBgHalfCoC);
            let edgeReach = saturate(fullResBgWeight * 0.5) * fullResBgSharpness;
            upsampledBgColor = mix(upsampledBgColor, fullResBgSum / fullResBgWeight, edgeReach);
        }
    }

    compositedBgColor = mix(baseFullResColor, upsampledBgColor, farBokehBlend);
}

// [KO] 4. 전경(Foreground) 보케 및 불투명도(α_fg) 4-코너 양선형 볼록 상한 부등식(α_tent <= 3.0625 * sum_corners) 기반 2단계 게이팅 9-Tap Tent 업샘플링
// [EN] 4. Foreground bokeh and opacity (α_fg) 9-Tap Tent upsampling with 2-stage gating via exact 4-corner bilinear convex upper bound (α_tent <= 3.0625 * sum_corners)
let f00 = textureSampleLevel(fgBokehTexture, basicSampler, uv - d.xy, 0.0);
let f20 = textureSampleLevel(fgBokehTexture, basicSampler, uv - d.zy, 0.0);
let f02 = textureSampleLevel(fgBokehTexture, basicSampler, uv + d.zy, 0.0);
let f22 = textureSampleLevel(fgBokehTexture, basicSampler, uv + d.xy, 0.0);

var finalColor = compositedBgColor;
if (f00.a + f20.a + f02.a + f22.a > 3e-4) {
    let f11 = textureSampleLevel(fgBokehTexture, basicSampler, uv, 0.0);
    let f10 = textureSampleLevel(fgBokehTexture, basicSampler, uv - d.wy, 0.0);
    let f01 = textureSampleLevel(fgBokehTexture, basicSampler, uv + d.zw, 0.0);
    let f21 = textureSampleLevel(fgBokehTexture, basicSampler, uv + d.xw, 0.0);
    let f12 = textureSampleLevel(fgBokehTexture, basicSampler, uv + d.wy, 0.0);

    let upsampledFgOpacity = (
        f00.a * 1.0 + f10.a * 2.0 + f20.a * 1.0 +
        f01.a * 2.0 + f11.a * 4.0 + f21.a * 2.0 +
        f02.a * 1.0 + f12.a * 2.0 + f22.a * 1.0
    ) * (1.0 / 16.0);

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

        let finalFgOpacity = saturate(upsampledFgOpacity);
        finalColor = mix(compositedBgColor, upsampledFgColor, finalFgOpacity);
    }
}

textureStore(outputTexture, index, vec4<f32>(finalColor, sharpSample.a));
