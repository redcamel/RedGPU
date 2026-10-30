let usePolygon = uniforms.bladeCount >= 3u;
let sectorCount = min(select(CIRCULAR_SECTOR_COUNT, uniforms.bladeCount, usePolygon), MAX_BLADE_COUNT);
let sectorAngle = TWO_PI / f32(sectorCount);
let totalTapSlots = sectorCount * TAPS_PER_SECTOR;

// [KO] 균일 제어 흐름(Uniform Control Flow) 최상단에서 워크그룹 256 스레드가 협동하여 단위 조리개 커널(edgeDir, polyScale)을 단 1회만 사전 연산 (SFU sin/cos/length 256배 절감)
// [EN] Cooperatively precompute unit aperture kernel taps (edgeDir, polyScale) once per 256-thread workgroup at top-level uniform control flow (256x reduction in SFU sin/cos/length)
if (local_invocation_index < totalTapSlots) {
    let bladeIdx = local_invocation_index / TAPS_PER_SECTOR;
    let localTap = local_invocation_index - bladeIdx * TAPS_PER_SECTOR;

    var ring: u32 = 5u;
    var ringStart: u32 = 10u;
    if (localTap < 1u) {
        ring = 1u;
        ringStart = 0u;
    } else if (localTap < 3u) {
        ring = 2u;
        ringStart = 1u;
    } else if (localTap < 6u) {
        ring = 3u;
        ringStart = 3u;
    } else if (localTap < 10u) {
        ring = 4u;
        ringStart = 6u;
    }

    let step = localTap - ringStart;
    let t = f32(step) / f32(ring);
    let angle0 = f32(bladeIdx) * sectorAngle;
    let angle1 = f32(bladeIdx + 1u) * sectorAngle;

    var preEdgeDir: vec2<f32>;
    var prePolyScale: f32;
    if (usePolygon) {
        let v0 = vec2<f32>(cos(angle0), sin(angle0));
        let v1 = vec2<f32>(cos(angle1), sin(angle1));
        preEdgeDir = mix(v0, v1, t);
        prePolyScale = length(preEdgeDir);
    } else {
        let theta = mix(angle0, angle1, t);
        preEdgeDir = vec2<f32>(cos(theta), sin(theta));
        prePolyScale = 1.0;
    }
    sharedKernel[local_invocation_index] = vec4<f32>(preEdgeDir, prePolyScale, 0.0);
}

workgroupBarrier();

let postEffectOutputDimensions = textureDimensions(outputTexture);
if (global_id.x >= postEffectOutputDimensions.x || global_id.y >= postEffectOutputDimensions.y) {
    return;
}

let index = global_id.xy;
let halfDimsI = vec2<i32>(postEffectOutputDimensions);
let maxHalfCoord = max(halfDimsI - vec2<i32>(1), vec2<i32>(0));
let halfDims = vec2<f32>(postEffectOutputDimensions);
let invHalfDims = 1.0 / halfDims;
let centerUV = (vec2<f32>(index) + 0.5) * invHalfDims;

let centerData = textureLoad(cocMip0Texture, index, 0);
let centerColor = centerData.rgb;
let centerCoC = centerData.a;

let maxHalfRadius = computeAutoMaxHalfCoC(systemUniforms.devicePixelRatio);

// [KO] 5-Tap 십자 타일 확장 조회: 8x8 타일 경계에서의 계단 현상을 제거하기 위해 현재 타일과 상하좌우 인접 타일의 최소 전경 CoC 및 최대 배경 CoC를 결합
// [EN] 5-Tap cross tile dilation lookup: combine min near CoC and max far CoC of current and 4 cardinal neighbor tiles to eliminate 8x8 tile boundary steps
let tileTexelSize = 1.0 / vec2<f32>(textureDimensions(tileMaxTexture));
let tCenter = textureSampleLevel(tileMaxTexture, basicSampler, centerUV, 0.0);
let tLeft = textureSampleLevel(tileMaxTexture, basicSampler, centerUV - vec2<f32>(tileTexelSize.x, 0.0), 0.0);
let tRight = textureSampleLevel(tileMaxTexture, basicSampler, centerUV + vec2<f32>(tileTexelSize.x, 0.0), 0.0);
let tUp = textureSampleLevel(tileMaxTexture, basicSampler, centerUV - vec2<f32>(0.0, tileTexelSize.y), 0.0);
let tDown = textureSampleLevel(tileMaxTexture, basicSampler, centerUV + vec2<f32>(0.0, tileTexelSize.y), 0.0);
let dilatedMinNearCoC = min(tCenter.r, min(min(tLeft.r, tRight.r), min(tUp.r, tDown.r)));
let dilatedMaxFarCoC = max(tCenter.g, max(max(tLeft.g, tRight.g), max(tUp.g, tDown.g)));

let isForegroundPass = uniforms.passMode == 1u;
let isCenterForeground = centerCoC < -0.15;
let centerNearRadius = max(-centerCoC, 0.0);
let centerFarRadius = max(centerCoC, 0.0);

let nearGatherRadius = min(max(-dilatedMinNearCoC, centerNearRadius), maxHalfRadius);
// [KO] 배경 패스(Pass 3A): 전경 픽셀에서는 타일 최대 전경 대비 중심 전경의 지배율(nearDominance)과 중심 전경 반경(centerNearRadius)에 연동된 연속 홀필링 반경을 탐색하고, 비전경 픽셀에서는 합초 개구부 게이트(saturate(centerFarRadius - 0.25))로 합초 피사체 침범만 차단하면서 타일 최대 배경 보케 반경을 온전히 탐색
// [EN] Background pass (Pass 3A): search continuous hole-filling radius driven by centerNearRadius and nearDominance on foreground pixels, and gather full tile max far bokeh radius gated by in-focus aperture (saturate(centerFarRadius - 0.25)) on non-foreground pixels
let bgApertureGate = saturate(centerFarRadius - 0.25);
let nearDominance = saturate(centerNearRadius / max(nearGatherRadius, 0.5));
let occludedMidFgWeight = (1.0 - smoothstep(0.35, 0.75, nearDominance)) * smoothstep(0.15, 0.65, centerNearRadius);
let holeFillGatherRadius = min(max(centerNearRadius * 1.25, dilatedMaxFarCoC * nearDominance), maxHalfRadius);
let farGatherRadius = min(select(max(centerFarRadius, dilatedMaxFarCoC * bgApertureGate), holeFillGatherRadius, isCenterForeground), maxHalfRadius);
let gatherRadius = select(farGatherRadius, nearGatherRadius, isForegroundPass);

if (gatherRadius < 0.25) {
    let outAlpha = select(centerFarRadius, 0.0, isForegroundPass);
    textureStore(outputTexture, index, vec4<f32>(centerColor, outAlpha));
    return;
}

// [KO] 반경 비례 적응형 링 스케일링(2~5 Rings, 18~90 Taps) 및 링 간격(ringSpacing) 기반 나이퀴스트 밉 레벨 산출
// [EN] Radius-proportional adaptive ring scaling (2~5 Rings, 18~90 Taps) and Nyquist mip level computation based on ringSpacing
let activeRingCount = clamp(u32(ceil(gatherRadius * 0.55)) + 1u, 2u, RING_COUNT);
let invActiveRingCount = 1.0 / f32(activeRingCount);

let ringSpacing = gatherRadius * invActiveRingCount;
let mipLevel = clamp(log2(max(ringSpacing, 1.0)), 0.0, 2.0);
let halfBokehBrightness = uniforms.bokehBrightness * 0.5;
let isBgHoleFill = !isForegroundPass && isCenterForeground;

var centerFilteredColor = centerColor;
let centerAllowMip = saturate(abs(centerCoC) - 0.5);
if (!isBgHoleFill && mipLevel > 0.05 && centerAllowMip > 0.0) {
    if (mipLevel < 1.5) {
        let centerMip1 = textureSampleLevel(cocMip1Texture, basicSampler, centerUV, 0.0);
        let centerTolerance = max(min(abs(centerCoC), abs(centerMip1.a)) * 0.35, 0.25);
        let centerMip1Valid = saturate(1.0 - abs(centerMip1.a - centerCoC) / centerTolerance) * select(0.0, 1.0, centerCoC * centerMip1.a > 0.0) * centerAllowMip;
        centerFilteredColor = mix(centerColor, centerMip1.rgb, clamp(mipLevel, 0.25, 1.0) * centerMip1Valid);
    } else {
        let centerMip2 = textureSampleLevel(cocMip2Texture, basicSampler, centerUV, 0.0);
        let centerTolerance = max(min(abs(centerCoC), abs(centerMip2.a)) * 0.35, 0.25);
        let centerMip2Valid = saturate(1.0 - abs(centerMip2.a - centerCoC) / centerTolerance) * select(0.0, 1.0, centerCoC * centerMip2.a > 0.0) * centerAllowMip;
        centerFilteredColor = mix(centerColor, centerMip2.rgb, centerMip2Valid);
    }
}

var accumColor = vec3<f32>(0.0);
var accumWeight: f32 = 0.0;
var accumFarCoC: f32 = 0.0;
var fallbackBgColor = centerFilteredColor;
var fallbackBgWeight: f32 = 1.0;
var fgCoverageSum: f32 = 0.0;
var fgRadiusSum: f32 = 0.0;
var fgRadiusWeightSum: f32 = 0.0;
var totalKernelWeight: f32 = 1.0;

if (!isForegroundPass) {
    // [KO] 배경 패스에서 중심 픽셀이 비전경일 때는 중심 샘플을 온전히 누적하고, 더 가까운 전경 보케에 덮인 중경 픽셀(occludedMidFgWeight > 0)에서는 중경 자체 색상을 연속 보존하여 실루엣 경계 단차 차단
    // [EN] In the background pass, accumulate full center sample when non-foreground, and continuously preserve mid-foreground self color when occluded by a closer foreground bokeh (occludedMidFgWeight > 0)
    let bgSelfWeight = select(1.0, occludedMidFgWeight, isCenterForeground);
    if (bgSelfWeight > 0.0) {
        let centerExcessLuma = max(getLuminance(centerFilteredColor) - 0.25, 0.0);
        let centerHighlight = centerExcessLuma / (1.0 + centerExcessLuma * 0.25);
        let centerW = (1.0 + centerHighlight * halfBokehBrightness) * bgSelfWeight;
        accumColor += centerFilteredColor * centerW;
        accumWeight += centerW;
        accumFarCoC += centerFarRadius * centerW;
    }
} else if (isCenterForeground) {
    let centerExcessLuma = max(getLuminance(centerFilteredColor) - 0.25, 0.0);
    let centerHighlight = centerExcessLuma / (1.0 + centerExcessLuma * 0.25);
    let centerW = 1.0 + centerHighlight * halfBokehBrightness;
    let selfCoverage = smoothstep(0.15, 0.65, centerNearRadius);
    accumColor += centerFilteredColor * centerW * selfCoverage;
    accumWeight += centerW * selfCoverage;
    fgCoverageSum += selfCoverage;
    fgRadiusSum += centerNearRadius * selfCoverage;
    fgRadiusWeightSum += selfCoverage;
}

let basePixelCenter = vec2<f32>(index) + 0.5;
let halfRingTransition = max(ringSpacing * 0.5, 0.5);

// [KO] 워크그룹 공유 메모리(sharedKernel)에 캐싱된 정다각형/원형 탭 벡터를 참조하여 초월함수 호출 없이 5-Ring 동심 링 개더링 수행 (링 간격 기반 연속 전이 폭 정규화)
// [EN] Perform 5-Ring polygonal/circular concentric ring gathering from workgroup shared memory (sharedKernel) without per-pixel SFU calls (ringSpacing-driven continuous transition width normalization)
for (var b = 0u; b < sectorCount; b = b + 1u) {
    var tapSlot = b * TAPS_PER_SECTOR;

    for (var ring = 1u; ring <= activeRingCount; ring = ring + 1u) {
        let normRadius = (f32(ring) - 0.25) * invActiveRingCount;
        let normGatherRadius = normRadius * gatherRadius;

        for (var step = 0u; step < ring; step = step + 1u) {
            let kernelTap = sharedKernel[tapSlot];
            tapSlot = tapSlot + 1u;

            let offsetTexels = kernelTap.xy * normGatherRadius;
            let polyScale = kernelTap.z;
            let distTexels = polyScale * normGatherRadius;
            let kernelTapWeight = smoothstep(-halfRingTransition, halfRingTransition, gatherRadius * polyScale - distTexels);
            totalKernelWeight += kernelTapWeight;

            let sampleCoord0 = clamp(vec2<i32>(floor(basePixelCenter + offsetTexels)), vec2<i32>(0), maxHalfCoord);
            let discreteMip0 = textureLoad(cocMip0Texture, sampleCoord0, 0);

            var sampleColor = discreteMip0.rgb;
            var sampleCoC = discreteMip0.a;

            if (mipLevel > 0.1) {
                let sampleUV = centerUV + offsetTexels * invHalfDims;
                var activeMipSample: vec4<f32>;
                var mipBlendWeight: f32;
                let sampleAllowMip = select(smoothstep(0.25, 0.85, abs(discreteMip0.a)), smoothstep(ringSpacing * 0.5, ringSpacing * 1.5, distTexels), isBgHoleFill);
                if (mipLevel < 0.5) {
                    activeMipSample = textureSampleLevel(cocMip0Texture, basicSampler, sampleUV, 0.0);
                    mipBlendWeight = smoothstep(0.1, 0.5, mipLevel);
                } else if (mipLevel < 1.5) {
                    activeMipSample = textureSampleLevel(cocMip1Texture, basicSampler, sampleUV, 0.0);
                    mipBlendWeight = smoothstep(0.5, 1.25, mipLevel) * sampleAllowMip;
                } else {
                    activeMipSample = textureSampleLevel(cocMip2Texture, basicSampler, sampleUV, 0.0);
                    mipBlendWeight = sampleAllowMip;
                }

                let cocTolerance = max(min(abs(discreteMip0.a), abs(activeMipSample.a)) * 0.35, 0.25);
                let isSameDomain = (discreteMip0.a * activeMipSample.a > 0.0) || (abs(discreteMip0.a) < 0.35 && abs(activeMipSample.a) < 0.35);
                let mipValid = mipBlendWeight * saturate(1.0 - abs(activeMipSample.a - discreteMip0.a) / cocTolerance) * select(0.0, 1.0, isSameDomain);
                sampleColor = mix(discreteMip0.rgb, activeMipSample.rgb, mipValid);
                sampleCoC = mix(discreteMip0.a, activeMipSample.a, mipValid);
            }

            if (!isForegroundPass) {
                if (isCenterForeground) {
                    // [KO] 전경 픽셀 뒤편의 비차폐 배경 복원(Disocclusion Hole-Filling): 상대 CoC 깊이 차이(cocDepthDelta)와 링 간격(ringSpacing) 기반의 연속 거리 감쇠 가중치로 다중 전경 칼자국 및 원본 이중 상 원천 차단
                    // [EN] Background reconstruction behind foreground pixels (Disocclusion Hole-Filling): continuous distance-decay weighting driven by relative CoC depth delta (cocDepthDelta) and ringSpacing
                    let minTapCoC = min(discreteMip0.a, sampleCoC);
                    let cocDepthDelta = minTapCoC - centerCoC;
                    let fallbackValid = smoothstep(-ringSpacing, 0.0, cocDepthDelta) * kernelTapWeight;
                    fallbackBgColor += sampleColor * fallbackValid;
                    fallbackBgWeight += fallbackValid;

                    let isNonFgSample = smoothstep(-0.25, 0.0, minTapCoC);
                    let isBehindFgSample = smoothstep(ringSpacing * 0.25, ringSpacing * 1.25, cocDepthDelta);
                    let isSameMidFgSample = occludedMidFgWeight * (1.0 - smoothstep(ringSpacing * 0.25, ringSpacing * 1.25, abs(cocDepthDelta))) * smoothstep(-halfRingTransition, halfRingTransition, centerNearRadius * polyScale - distTexels);
                    let depthBehindWeight = max(max(isNonFgSample, isBehindFgSample), isSameMidFgSample);
                    if (depthBehindWeight > 0.0) {
                        let sampleFarCoC = max(sampleCoC, 0.0);
                        let normHoleDist = distTexels / max(ringSpacing, 0.5);
                        let bgHoleWeight = depthBehindWeight / (0.1 + normHoleDist * normHoleDist * distTexels);
                        accumColor += sampleColor * bgHoleWeight;
                        accumWeight += bgHoleWeight;
                        accumFarCoC += sampleFarCoC * bgHoleWeight;
                    }
                } else if (discreteMip0.a > 0.25 && sampleCoC > 0.25) {
                    // [KO] 물리 기반 배경 보케 개더링:
                    //      1) 일반 배경 표면(diffuseWeight)은 양측 최소 반경(min(centerFarRadius, sampleCoC))과 링 간격 전이 폭(halfRingTransition)으로 결합하여 계단 현상과 원경 후광 누수를 동시 차단
                    //      2) 하이라이트 보케 원판(highlightWeight)은 샘플 자체의 물리적 보케 반경(sampleCoC) 전체로 확산하되, 중심 픽셀이 샘플보다 카메라에 더 가까우면 차폐(depthOcclusion)
                    // [EN] Physically-based background bokeh gathering:
                    //      1) Diffuse surface blur uses min(centerFarRadius, sampleCoC) and halfRingTransition to eliminate both stair-stepping and background halo leakage
                    //      2) Highlight bokeh discs spread across their full sampleCoC radius, occluded when center pixel is closer than sample (depthOcclusion)
                    let sampleFarRadius = sampleCoC * polyScale;
                    let bokehDiscCoverage = saturate(sampleFarRadius - distTexels + 0.5);
                    let pairFarRadius = min(centerFarRadius, sampleCoC) * polyScale;
                    let diffuseCoverage = smoothstep(-halfRingTransition, halfRingTransition, pairFarRadius - distTexels);
                    if (bokehDiscCoverage > 0.0 || diffuseCoverage > 0.0) {
                        let diffuseWeight = diffuseCoverage * smoothstep(0.25, 1.0, sampleCoC);

                        let sampleExcessLuma = max(getLuminance(sampleColor) - 0.25, 0.0);
                        let highlightBoost = (sampleExcessLuma / (1.0 + sampleExcessLuma * 0.25)) * halfBokehBrightness;
                        let depthOcclusion = smoothstep(centerFarRadius + max(sampleCoC * 0.5, 1.0), centerFarRadius - 0.5, sampleCoC);
                        let areaRatio = max(centerFarRadius, ringSpacing) / max(sampleCoC, ringSpacing);
                        let areaWeight = clamp(areaRatio * areaRatio, 0.2, 1.0);
                        let highlightWeight = bokehDiscCoverage * depthOcclusion * highlightBoost * areaWeight;

                        let w = diffuseWeight + highlightWeight;
                        if (w > 0.0) {
                            accumColor += sampleColor * w;
                            accumWeight += w;
                            accumFarCoC += sampleCoC * w;
                        }
                    }
                }
            } else {
                // [KO] Pass 3B: 전경(Near < 0) 전용 레이어 개더링 - 링 간격 전이 폭(halfRingTransition)과 커널 탭 가중치(kernelTapWeight)의 1:1 동형 정규화로 내부 불투명도 100% 도달과 무계단 외곽 감쇠를 동시 보장
                // [EN] Pass 3B: Foreground (Near < 0) dedicated layer gathering - 1:1 isomorphic normalization between halfRingTransition coverage and kernelTapWeight to guarantee both 100% interior opacity and step-free outer falloff
                if (discreteMip0.a < -0.15 && sampleCoC < -0.15) {
                    let sampleNearRadius = -sampleCoC;
                    let radiusDiff = max(centerNearRadius - sampleNearRadius, 0.0);
                    let surfaceContinuity = 1.0 - smoothstep(ringSpacing * 0.5, ringSpacing * 1.5, radiusDiff);
                    let effectiveNearRadius = mix(sampleNearRadius, max(centerNearRadius, sampleNearRadius), surfaceContinuity);
                    let coverage = smoothstep(-halfRingTransition, halfRingTransition, effectiveNearRadius * polyScale - distTexels);
                    if (coverage > 0.0) {
                        let sampleExcessLuma = max(getLuminance(sampleColor) - 0.25, 0.0);
                        let opticalW = 1.0 + (sampleExcessLuma / (1.0 + sampleExcessLuma * 0.25)) * halfBokehBrightness;
                        let tapDensityWeight = clamp(gatherRadius / max(effectiveNearRadius, ringSpacing), 1.0, 4.0);
                        let w = coverage * opticalW * tapDensityWeight;
                        accumColor += sampleColor * w;
                        accumWeight += w;
                        fgCoverageSum += coverage;
                        fgRadiusSum += effectiveNearRadius * coverage;
                        fgRadiusWeightSum += coverage;
                    }
                }
            }
        }
    }
}

if (!isForegroundPass) {
    let hasBg = accumWeight > 1e-5;
    let invAccumWeight = 1.0 / max(accumWeight, 1e-5);
    let defaultBgColor = fallbackBgColor / max(fallbackBgWeight, 1.0);
    let bgColor = select(defaultBgColor, accumColor * invAccumWeight, hasBg);
    let avgFarCoC = accumFarCoC * invAccumWeight;
    let holeFilledFarCoC = select(avgFarCoC, max(avgFarCoC, 0.3), isCenterForeground);
    let outFarCoC = select(centerFarRadius, holeFilledFarCoC, hasBg);
    textureStore(outputTexture, index, vec4<f32>(bgColor, outFarCoC));
} else {
    let hasFg = accumWeight > 1e-5;
    let fgColor = select(centerFilteredColor, accumColor / max(accumWeight, 1e-5), hasFg);
    let activeFgRadius = select(gatherRadius, clamp(fgRadiusSum / max(fgRadiusWeightSum, 1e-5), 0.5, gatherRadius), fgRadiusWeightSum > 1e-5);
    let radiusRatio = activeFgRadius / max(gatherRadius, 0.5);
    let activeKernelWeight = max(totalKernelWeight * clamp(radiusRatio * radiusRatio, 0.05, 1.0), 1.0);
    let fgOpacity = select(0.0, saturate(fgCoverageSum / activeKernelWeight), hasFg);
    textureStore(outputTexture, index, vec4<f32>(fgColor, fgOpacity));
}
