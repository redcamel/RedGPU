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
let isCenterForeground = centerCoC < -0.25;
let centerNearRadius = max(-centerCoC, 0.0);
let centerFarRadius = max(centerCoC, 0.0);

let nearGatherRadius = min(max(-dilatedMinNearCoC, centerNearRadius), maxHalfRadius);
// [KO] 배경 패스(Pass 3A): 전경 픽셀에서는 후면 홀필링 반경을 탐색하고, 비전경 픽셀에서는 중심 픽셀의 배경 CoC 반경으로 탐색하여 원경이 근경 배경 위로 역침범하는 현상 차단
// [EN] Background pass (Pass 3A): search hole-filling radius on foreground pixels, and gather within center Far CoC on non-foreground pixels to prevent distant background from bleeding over closer background
let farGatherRadius = min(select(centerFarRadius, max(nearGatherRadius, dilatedMaxFarCoC), isCenterForeground), maxHalfRadius);
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
var fgCoverageSum: f32 = 0.0;
var fgRadiusSum: f32 = 0.0;
var fgRadiusWeightSum: f32 = 0.0;
var totalKernelWeight: f32 = 1.0;

if (!isForegroundPass) {
    // [KO] 배경 패스에서 중심 픽셀이 비전경일 때만 중심 샘플을 누적하고, 전경 픽셀(isCenterForeground)에서는 전경 자체 색상을 완전히 배제하여 배경 버퍼 오염 차단
    // [EN] In the background pass, accumulate center sample only when non-foreground; exclude center foreground color completely on foreground pixels to prevent background buffer contamination
    if (!isCenterForeground) {
        let centerExcessLuma = max(getLuminance(centerFilteredColor) - 0.25, 0.0);
        let centerHighlight = centerExcessLuma / (1.0 + centerExcessLuma * 0.25);
        let centerAreaRatio = gatherRadius / max(centerFarRadius, 1.0);
        let centerAreaWeight = clamp(centerAreaRatio * centerAreaRatio, 0.1, 16.0);
        let centerW = centerAreaWeight * (1.0 + centerHighlight * halfBokehBrightness);
        accumColor += centerFilteredColor * centerW;
        accumWeight += centerW;
        accumFarCoC += centerFarRadius * centerW;
    }
} else if (isCenterForeground) {
    let centerExcessLuma = max(getLuminance(centerFilteredColor) - 0.25, 0.0);
    let centerHighlight = centerExcessLuma / (1.0 + centerExcessLuma * 0.25);
    let centerW = 1.0 + centerHighlight * halfBokehBrightness;
    let selfCoverage = smoothstep(0.25, 0.75, centerNearRadius);
    accumColor += centerFilteredColor * centerW * selfCoverage;
    accumWeight += centerW * selfCoverage;
    fgCoverageSum += selfCoverage;
    fgRadiusSum += centerNearRadius * selfCoverage;
    fgRadiusWeightSum += selfCoverage;
}

let basePixelCenter = vec2<f32>(index) + 0.5;

// [KO] 워크그룹 공유 메모리(sharedKernel)에 캐싱된 정다각형/원형 탭 벡터를 참조하여 초월함수 호출 없이 5-Ring 동심 링 개더링 수행 (최외곽 링 normRadius = 1.0 완전 도달)
// [EN] Perform 5-Ring polygonal/circular concentric ring gathering from workgroup shared memory (sharedKernel) without per-pixel SFU calls (outermost ring reaches exact normRadius = 1.0)
for (var b = 0u; b < sectorCount; b = b + 1u) {
    var tapSlot = b * TAPS_PER_SECTOR;

    for (var ring = 1u; ring <= activeRingCount; ring = ring + 1u) {
        let normRadius = (f32(ring) - 0.35) * invActiveRingCount;
        let normGatherRadius = normRadius * gatherRadius;

        for (var step = 0u; step < ring; step = step + 1u) {
            totalKernelWeight += 1.0;

            let kernelTap = sharedKernel[tapSlot];
            tapSlot = tapSlot + 1u;

            let offsetTexels = kernelTap.xy * normGatherRadius;
            let polyScale = kernelTap.z;
            let distTexels = polyScale * normGatherRadius;

            let sampleCoord0 = clamp(vec2<i32>(floor(basePixelCenter + offsetTexels)), vec2<i32>(0), maxHalfCoord);
            let discreteMip0 = textureLoad(cocMip0Texture, sampleCoord0, 0);

            var sampleColor = discreteMip0.rgb;
            var sampleCoC = discreteMip0.a;

            if (mipLevel > 0.1) {
                let sampleUV = centerUV + offsetTexels * invHalfDims;
                var activeMipSample: vec4<f32>;
                var mipBlendWeight: f32;
                if (mipLevel < 0.5) {
                    activeMipSample = textureSampleLevel(cocMip0Texture, basicSampler, sampleUV, 0.0);
                    mipBlendWeight = smoothstep(0.1, 0.5, mipLevel);
                } else if (mipLevel < 1.5) {
                    activeMipSample = textureSampleLevel(cocMip1Texture, basicSampler, sampleUV, 0.0);
                    mipBlendWeight = smoothstep(0.5, 1.25, mipLevel) * smoothstep(0.25, 0.85, abs(discreteMip0.a));
                } else {
                    activeMipSample = textureSampleLevel(cocMip2Texture, basicSampler, sampleUV, 0.0);
                    mipBlendWeight = smoothstep(0.25, 0.85, abs(discreteMip0.a));
                }

                let cocTolerance = max(min(abs(discreteMip0.a), abs(activeMipSample.a)) * 0.35, 0.25);
                let mipValid = mipBlendWeight * saturate(1.0 - abs(activeMipSample.a - discreteMip0.a) / cocTolerance) * select(0.0, 1.0, discreteMip0.a * activeMipSample.a > 0.0);
                sampleColor = mix(discreteMip0.rgb, activeMipSample.rgb, mipValid);
                sampleCoC = mix(discreteMip0.a, activeMipSample.a, mipValid);
            }

            if (!isForegroundPass) {
                if (isCenterForeground) {
                    // [KO] 전경 픽셀 뒤편의 비차폐 배경 복원(Disocclusion Hole-Filling): 비전경 샘플(sampleCoC > -0.25)에 대해 순수 거리 감쇠 가중치로 후면 배경을 100% 복원하여 전경 실루엣 테두리 잔상 원천 차단
                    // [EN] Background reconstruction behind foreground pixels (Disocclusion Hole-Filling): reconstruct background from non-foreground samples (sampleCoC > -0.25) with distance decay to eliminate foreground silhouette edge ghosts
                    if (discreteMip0.a > -0.25 && sampleCoC > -0.25) {
                        let sampleFarCoC = max(sampleCoC, 0.0);
                        let bgHoleWeight = 1.0 / (1.0 + distTexels * 0.5);
                        accumColor += sampleColor * bgHoleWeight;
                        accumWeight += bgHoleWeight;
                        accumFarCoC += sampleFarCoC * bgHoleWeight;
                    }
                } else if (discreteMip0.a > 0.25 && sampleCoC > 0.25) {
                    // [KO] 물리 기반 다층 배경 보케 개더링 (Layered Background Scatter-as-Gather):
                    //      1) 전방 배경 샘플(sampleCoC <= centerFarRadius)은 자신의 물리적 반경(sampleCoC)만큼 후방 배경(centerFarRadius) 위로 번지며,
                    //         넓은 탐색 반경(gatherRadius)에서의 탭 밀도 희석을 보상하기 위해 원판 면적 역제곱 가중치((gatherRadius / sampleCoC)^2)를 곱함
                    //      2) 후방 배경 샘플(sampleCoC > centerFarRadius)은 전방 불투명 표면에 의해 차폐(frontOcclusion)되어 역침범을 차단함
                    // [EN] Physically-based layered background bokeh gathering:
                    //      1) Closer background samples (sampleCoC <= centerFarRadius) spread over farther background within their own radius (sampleCoC),
                    //         weighted by inverse-square disc area ((gatherRadius / sampleCoC)^2) to compensate for tap density dilution
                    //      2) Farther background samples (sampleCoC > centerFarRadius) are occluded by closer opaque surfaces (frontOcclusion)
                    let effectiveSampleFarCoC = max(sampleCoC, min(centerFarRadius, ringSpacing));
                    let sampleFarRadius = effectiveSampleFarCoC * polyScale;
                    let bokehDiscCoverage = saturate(sampleFarRadius - distTexels + 0.5);
                    if (bokehDiscCoverage > 0.0) {
                        let occlusionTolerance = max(centerFarRadius * 0.35, 0.75);
                        let frontOcclusion = smoothstep(centerFarRadius + occlusionTolerance, centerFarRadius - 0.25, sampleCoC);
                        let areaRatio = gatherRadius / max(effectiveSampleFarCoC, 1.0);
                        let areaWeight = clamp(areaRatio * areaRatio, 0.1, 16.0);
                        let diffuseWeight = bokehDiscCoverage * frontOcclusion * areaWeight * smoothstep(0.25, 1.0, sampleCoC);
                        let sampleExcessLuma = max(getLuminance(sampleColor) - 0.25, 0.0);
                        let highlightBoost = (sampleExcessLuma / (1.0 + sampleExcessLuma * 0.25)) * halfBokehBrightness;
                        let w = diffuseWeight + bokehDiscCoverage * frontOcclusion * areaWeight * highlightBoost;
                        if (w > 0.0) {
                            accumColor += sampleColor * w;
                            accumWeight += w;
                            accumFarCoC += sampleCoC * w;
                        }
                    }
                }
            } else {
                // [KO] Pass 3B: 전경(Near < 0) 전용 레이어 개더링 - 샘플 자신의 물리적 전경 반경(-sampleCoC)과 연속 표면 연장 반경에 기반한 면적 정규화 및 기하 불투명도 적분
                // [EN] Pass 3B: Foreground (Near < 0) dedicated layer gathering - area normalization and geometric opacity integration based on sample's physical near radius (-sampleCoC) and continuous surface extension
                if (discreteMip0.a < -0.25 && sampleCoC < -0.25) {
                    let sampleNearRadius = -sampleCoC;
                    let surfaceContinuity = smoothstep(centerNearRadius * 0.25, centerNearRadius * 0.75, sampleNearRadius);
                    let effectiveNearRadius = max(mix(sampleNearRadius, max(centerNearRadius, sampleNearRadius), surfaceContinuity), min(gatherRadius, ringSpacing));
                    let coverage = saturate((effectiveNearRadius - normGatherRadius) * polyScale + 0.5);
                    if (coverage > 0.0) {
                        let sampleExcessLuma = max(getLuminance(sampleColor) - 0.25, 0.0);
                        let opticalW = 1.0 + (sampleExcessLuma / (1.0 + sampleExcessLuma * 0.25)) * halfBokehBrightness;
                        let areaRatio = max(centerNearRadius, 1.5) / max(sampleNearRadius, 1.5);
                        let areaWeight = clamp(areaRatio * areaRatio, 0.25, 1.0);
                        let w = coverage * opticalW * areaWeight;
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
    let bgColor = select(centerFilteredColor, accumColor * invAccumWeight, hasBg);
    let outFarCoC = select(centerFarRadius, accumFarCoC * invAccumWeight, hasBg);
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
