let index = global_id.xy;
let halfDims = vec2<f32>(postEffectOutputDimensions);
let fullDims = vec2<i32>(textureDimensions(sourceTexture));
let invFullDims = 1.0 / vec2<f32>(fullDims);
let maxCoord = max(fullDims - vec2<i32>(1), vec2<i32>(0));
let baseCoord = vec2<i32>(index) * 2;

let c00 = clamp(baseCoord + vec2<i32>(0, 0), vec2<i32>(0), maxCoord);
let c10 = clamp(baseCoord + vec2<i32>(1, 0), vec2<i32>(0), maxCoord);
let c01 = clamp(baseCoord + vec2<i32>(0, 1), vec2<i32>(0), maxCoord);
let c11 = clamp(baseCoord + vec2<i32>(1, 1), vec2<i32>(0), maxCoord);

let invProj = systemUniforms.projection.inverseProjectionMatrix;
let dpr = min(systemUniforms.devicePixelRatio, 2.0);
let maxHalfCoC = 0.5 * uniforms.maxCoC * dpr;
let focusState = textureLoad(focusTexture, vec2<i32>(0, 0), 0);
let effectiveFocusDistance = select(uniforms.focusDistance, focusState.r, focusState.g > 0.5);

let d00 = reconstructViewDepth(c00, invFullDims, invProj);
let d10 = reconstructViewDepth(c10, invFullDims, invProj);
let d01 = reconstructViewDepth(c01, invFullDims, invProj);
let d11 = reconstructViewDepth(c11, invFullDims, invProj);

let coc00 = calculatePhysicalHalfCoC(d00, halfDims.y, maxHalfCoC, effectiveFocusDistance);
let coc10 = calculatePhysicalHalfCoC(d10, halfDims.y, maxHalfCoC, effectiveFocusDistance);
let coc01 = calculatePhysicalHalfCoC(d01, halfDims.y, maxHalfCoC, effectiveFocusDistance);
let coc11 = calculatePhysicalHalfCoC(d11, halfDims.y, maxHalfCoC, effectiveFocusDistance);

let minSignedCoC = min(min(coc00, coc10), min(coc01, coc11));
let maxSignedCoC = max(max(coc00, coc10), max(coc01, coc11));
let avgCoC = (coc00 + coc10 + coc01 + coc11) * 0.25;

// [KO] 실질적인 전경 비초점(minSignedCoC < -0.25) 실루엣에서만 최소 전경 CoC를 우선 채택하고, 합초-배경 경계에서는 연속 평균 CoC를 유지하여 TAA 지터 시 타일 점프를 방지
// [EN] Prioritize min foreground CoC only on genuine foreground defocus silhouettes (minSignedCoC < -0.25) while keeping continuous average CoC on in-focus/background edges to prevent tile jumping under TAA jitter
let fgDiscontinuity = clamp(maxSignedCoC - minSignedCoC - 0.5, 0.0, 1.0) * smoothstep(-0.25, -1.25, minSignedCoC);
var tileCoC = mix(avgCoC, minSignedCoC, fgDiscontinuity);

let col00 = textureLoad(sourceTexture, c00, 0).rgb;
let col10 = textureLoad(sourceTexture, c10, 0).rgb;
let col01 = textureLoad(sourceTexture, c01, 0).rgb;
let col11 = textureLoad(sourceTexture, c11, 0).rgb;

var hasValidHistory: bool = false;
var prevSample = vec4<f32>(0.0);
var minOuterCoC = minSignedCoC;
var maxOuterCoC = maxSignedCoC;
var temporalCoCBlend: f32 = 1.0;

if (uniforms.historyValid == 1u) {
    let cL = clamp(baseCoord + vec2<i32>(-1, 0), vec2<i32>(0), maxCoord);
    let cR = clamp(baseCoord + vec2<i32>(2, 0), vec2<i32>(0), maxCoord);
    let cU = clamp(baseCoord + vec2<i32>(0, -1), vec2<i32>(0), maxCoord);
    let cD = clamp(baseCoord + vec2<i32>(0, 2), vec2<i32>(0), maxCoord);

    let cocL = calculatePhysicalHalfCoC(reconstructViewDepth(cL, invFullDims, invProj), halfDims.y, maxHalfCoC, effectiveFocusDistance);
    let cocR = calculatePhysicalHalfCoC(reconstructViewDepth(cR, invFullDims, invProj), halfDims.y, maxHalfCoC, effectiveFocusDistance);
    let cocU = calculatePhysicalHalfCoC(reconstructViewDepth(cU, invFullDims, invProj), halfDims.y, maxHalfCoC, effectiveFocusDistance);
    let cocD = calculatePhysicalHalfCoC(reconstructViewDepth(cD, invFullDims, invProj), halfDims.y, maxHalfCoC, effectiveFocusDistance);

    minOuterCoC = min(minSignedCoC, min(min(cocL, cocR), min(cocU, cocD)));
    maxOuterCoC = max(maxSignedCoC, max(max(cocL, cocR), max(cocU, cocD)));

    let velocity = textureLoad(gBufferMotionVector, c00, 0).xy;
    if (velocity.x <= 10.0) {
        let centerUV = (vec2<f32>(index) + 0.5) / max(halfDims, vec2<f32>(1.0));
        let prevUV = centerUV - velocity;
        if (all(prevUV >= vec2<f32>(0.0)) && all(prevUV <= vec2<f32>(1.0))) {
            prevSample = textureSampleLevel(prevCoCTexture, basicSampler, prevUV, 0.0);
            hasValidHistory = true;

            let clampedPrevCoC = clamp(prevSample.a, minOuterCoC, maxOuterCoC);
            let motionPixels = length(velocity * vec2<f32>(fullDims));
            temporalCoCBlend = clamp(0.10 + motionPixels * 0.15, 0.10, 0.65);
            tileCoC = mix(clampedPrevCoC, tileCoC, temporalCoCBlend);
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
