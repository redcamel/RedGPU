let index = global_id.xy;
let halfDims = vec2<f32>(postEffectOutputDimensions);
let fullDims = vec2<i32>(textureDimensions(sourceTexture));
let maxColorCoord = max(fullDims - vec2<i32>(1), vec2<i32>(0));
let maxDepthCoord = max(vec2<i32>(textureDimensions(depthTexture)) - vec2<i32>(1), vec2<i32>(0));
let baseCoord = vec2<i32>(index) * 2;

let d00Coord = clamp(baseCoord + vec2<i32>(0, 0), vec2<i32>(0), maxDepthCoord);
let d10Coord = clamp(baseCoord + vec2<i32>(1, 0), vec2<i32>(0), maxDepthCoord);
let d01Coord = clamp(baseCoord + vec2<i32>(0, 1), vec2<i32>(0), maxDepthCoord);
let d11Coord = clamp(baseCoord + vec2<i32>(1, 1), vec2<i32>(0), maxDepthCoord);

let invProjZW = extractInvProjZW(systemUniforms.projection.inverseProjectionMatrix);
let minNearDepth = max(systemUniforms.camera.nearClipping, 0.001);
let maxHalfCoC = computeAutoMaxHalfCoC(systemUniforms.devicePixelRatio);

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

let coc00 = samplePhysicalHalfCoCAtDepthCoord(d00Coord, invProjZW, minNearDepth, lensParams, maxHalfCoC);
let coc10 = samplePhysicalHalfCoCAtDepthCoord(d10Coord, invProjZW, minNearDepth, lensParams, maxHalfCoC);
let coc01 = samplePhysicalHalfCoCAtDepthCoord(d01Coord, invProjZW, minNearDepth, lensParams, maxHalfCoC);
let coc11 = samplePhysicalHalfCoCAtDepthCoord(d11Coord, invProjZW, minNearDepth, lensParams, maxHalfCoC);

let minSignedCoC = min(min(coc00, coc10), min(coc01, coc11));
let maxSignedCoC = max(max(coc00, coc10), max(coc01, coc11));

// [KO] 2x2 쿼드 내 카메라 최근접(최소 CoC) 픽셀 좌표를 판별하여 전경 차폐 우선 대표 CoC 및 모션 벡터 샘플링 좌표로 활용
// [EN] Identify the camera-closest (minimum CoC) pixel coordinate within the 2x2 quad for foreground-occluding CoC and motion vector sampling
var closestDepthCoord = d00Coord;
var closestCoC = coc00;
if (coc10 < closestCoC) {
    closestCoC = coc10;
    closestDepthCoord = d10Coord;
}
if (coc01 < closestCoC) {
    closestCoC = coc01;
    closestDepthCoord = d01Coord;
}
if (coc11 < closestCoC) {
    closestCoC = coc11;
    closestDepthCoord = d11Coord;
}

// [KO] 전경(coc < -0.1)과 배경(coc > 0)이 공존하는 깊이 불연속 2x2 쿼드에서 양수 배경 CoC가 음수 전경 CoC를 상쇄하여 가짜 합초(CoC ≈ 0)를 만드는 현상을 원천 차단
// [EN] Prevent positive background CoC from canceling negative foreground CoC into a phantom in-focus (CoC ≈ 0) on 2x2 depth-discontinuity quads
let avgCoC = (coc00 + coc10 + coc01 + coc11) * 0.25;
let fgMask00 = select(0.0, 1.0, coc00 < -0.1);
let fgMask10 = select(0.0, 1.0, coc10 < -0.1);
let fgMask01 = select(0.0, 1.0, coc01 < -0.1);
let fgMask11 = select(0.0, 1.0, coc11 < -0.1);
let fgCount = fgMask00 + fgMask10 + fgMask01 + fgMask11;
let fgAvgCoC = select(minSignedCoC, (coc00 * fgMask00 + coc10 * fgMask10 + coc01 * fgMask01 + coc11 * fgMask11) / max(fgCount, 1.0), fgCount > 0.0);
let fgPreserve = mix(fgAvgCoC, minSignedCoC, saturate(maxSignedCoC - minSignedCoC - 0.5));
let fgDiscontinuity = smoothstep(-0.15, -0.75, minSignedCoC);
var tileCoC = mix(avgCoC, fgPreserve, fgDiscontinuity);

let c00 = clamp(baseCoord + vec2<i32>(0, 0), vec2<i32>(0), maxColorCoord);
let c10 = clamp(baseCoord + vec2<i32>(1, 0), vec2<i32>(0), maxColorCoord);
let c01 = clamp(baseCoord + vec2<i32>(0, 1), vec2<i32>(0), maxColorCoord);
let c11 = clamp(baseCoord + vec2<i32>(1, 1), vec2<i32>(0), maxColorCoord);

let col00 = textureLoad(sourceTexture, c00, 0).rgb;
let col10 = textureLoad(sourceTexture, c10, 0).rgb;
let col01 = textureLoad(sourceTexture, c01, 0).rgb;
let col11 = textureLoad(sourceTexture, c11, 0).rgb;

var hasValidHistory: bool = false;
var prevSample = vec4<f32>(0.0);
var temporalCoCBlend: f32 = 1.0;

if (uniforms.historyValid == 1u) {
    let dLCoord = clamp(baseCoord + vec2<i32>(-1, 0), vec2<i32>(0), maxDepthCoord);
    let dRCoord = clamp(baseCoord + vec2<i32>(2, 0), vec2<i32>(0), maxDepthCoord);
    let dUCoord = clamp(baseCoord + vec2<i32>(0, -1), vec2<i32>(0), maxDepthCoord);
    let dDCoord = clamp(baseCoord + vec2<i32>(0, 2), vec2<i32>(0), maxDepthCoord);

    let cocL = samplePhysicalHalfCoCAtDepthCoord(dLCoord, invProjZW, minNearDepth, lensParams, maxHalfCoC);
    let cocR = samplePhysicalHalfCoCAtDepthCoord(dRCoord, invProjZW, minNearDepth, lensParams, maxHalfCoC);
    let cocU = samplePhysicalHalfCoCAtDepthCoord(dUCoord, invProjZW, minNearDepth, lensParams, maxHalfCoC);
    let cocD = samplePhysicalHalfCoCAtDepthCoord(dDCoord, invProjZW, minNearDepth, lensParams, maxHalfCoC);

    let minOuterCoC = min(minSignedCoC, min(min(cocL, cocR), min(cocU, cocD)));
    let maxOuterCoC = max(maxSignedCoC, max(max(cocL, cocR), max(cocU, cocD)));
    let hasSignDiscontinuity = (minOuterCoC < -0.25) && (maxOuterCoC > 0.25);
    let safeMinOuterCoC = select(minOuterCoC, max(minOuterCoC, 0.0), hasSignDiscontinuity && (tileCoC >= 0.0));
    let safeMaxOuterCoC = select(maxOuterCoC, min(maxOuterCoC, 0.0), hasSignDiscontinuity && (tileCoC < 0.0));

    let velocity = textureLoad(gBufferMotionVector, closestDepthCoord, 0).xy;
    if (all(abs(velocity) <= vec2<f32>(DOF_MAX_VALID_MOTION_UV))) {
        let centerUV = (vec2<f32>(index) + 0.5) / max(halfDims, vec2<f32>(1.0));
        let prevUV = centerUV - velocity;
        if (all(prevUV >= vec2<f32>(0.0)) && all(prevUV <= vec2<f32>(1.0))) {
            prevSample = textureSampleLevel(prevCoCTexture, basicSampler, prevUV, 0.0);
            let isSameLayerHistory = !hasSignDiscontinuity || (prevSample.a * tileCoC > 0.0 && abs(prevSample.a - tileCoC) <= max(abs(tileCoC) * 0.5, 1.0));
            if (isSameLayerHistory) {
                hasValidHistory = true;
                let clampedPrevCoC = clamp(prevSample.a, safeMinOuterCoC, safeMaxOuterCoC);
                let motionPixels = length(velocity * vec2<f32>(fullDims));
                temporalCoCBlend = clamp(0.10 + motionPixels * 0.15, 0.10, 0.65);
                tileCoC = mix(clampedPrevCoC, tileCoC, temporalCoCBlend);
            }
        }
    }
}

// [KO] 시간 안정화된 tileCoC 기준 양방향(Bilateral) 가중 평균 및 이웃 컬러 AABB 클램핑 누적
// [EN] Bilateral weighted average based on temporally stabilized tileCoC and neighborhood color AABB clamped accumulation
let w00 = 1.0 / (0.25 + abs(coc00 - tileCoC) * 4.0);
let w10 = 1.0 / (0.25 + abs(coc10 - tileCoC) * 4.0);
let w01 = 1.0 / (0.25 + abs(coc01 - tileCoC) * 4.0);
let w11 = 1.0 / (0.25 + abs(coc11 - tileCoC) * 4.0);
let wSum = w00 + w10 + w01 + w11;

var downsampledColor = (col00 * w00 + col10 * w10 + col01 * w01 + col11 * w11) / wSum;

if (hasValidHistory) {
    let minCol = min(min(col00, col10), min(col01, col11));
    let maxCol = max(max(col00, col10), max(col01, col11));
    let colMargin = (maxCol - minCol) * 0.15;
    let clampedPrevColor = clamp(prevSample.rgb, max(vec3<f32>(0.0), minCol - colMargin), maxCol + colMargin);
    downsampledColor = mix(clampedPrevColor, downsampledColor, temporalCoCBlend);
}

textureStore(outputTexture, index, vec4<f32>(downsampledColor, tileCoC));
