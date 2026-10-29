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

let dpr = min(systemUniforms.devicePixelRatio, 2.0);
let maxHalfRadius = 0.5 * uniforms.maxCoC * dpr;

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

let nearGatherRadius = min(max(-dilatedMinNearCoC, centerNearRadius), maxHalfRadius);
// [KO] 현재 픽셀이 전경(centerCoC < -0.25)일 때 배경 패스(Pass 3A)는 전경 외곽선 뒤편의 배경을 복원(Disocclusion Hole-Filling)하기 위해 확장된 전경/배경 반경을 탐색
// [EN] When the current pixel is foreground (centerCoC < -0.25), the background pass (Pass 3A) gathers within the dilated foreground/background radius to reconstruct the background behind the foreground edge (Disocclusion Hole-Filling)
let farGatherRadius = min(select(max(centerCoC, 0.0), max(nearGatherRadius, dilatedMaxFarCoC), isCenterForeground), maxHalfRadius);
let gatherRadius = select(farGatherRadius, nearGatherRadius, isForegroundPass);

if (gatherRadius < 0.25) {
    let outAlpha = select(max(centerCoC, 0.0), 0.0, isForegroundPass);
    textureStore(outputTexture, index, vec4<f32>(centerColor, outAlpha));
    return;
}

// [KO] 반경 비례 적응형 링 스케일링(2~5 Rings, 18~90 Taps) 및 전경 후면 홀필링 3-Ring 캡 적용
// [EN] Radius-proportional adaptive ring scaling (2~5 Rings, 18~90 Taps) and 3-Ring cap for background hole-filling behind foreground
let rawRingCount = clamp(u32(ceil(gatherRadius * 0.55)) + 1u, 2u, RING_COUNT);
let activeRingCount = select(rawRingCount, min(rawRingCount, 3u), !isForegroundPass && isCenterForeground);
let invActiveRingCount = 1.0 / f32(activeRingCount);

let ringSpacing = gatherRadius * invActiveRingCount;
let mipLevel = clamp(log2(max(ringSpacing, 1.0)), 0.0, 2.0);
let halfBokehBrightness = uniforms.bokehBrightness * 0.5;

var centerFilteredColor = centerColor;
let centerAllowMip = saturate(abs(centerCoC) - 0.5);
if (mipLevel > 0.05 && centerAllowMip > 0.0) {
    let centerTolerance = max(0.5, abs(centerCoC) * 0.25);
    if (mipLevel < 1.5) {
        let centerMip1 = textureSampleLevel(cocMip1Texture, basicSampler, centerUV, 0.0);
        let centerMip1Valid = saturate(1.0 - abs(centerMip1.a - centerCoC) / centerTolerance) * select(0.0, 1.0, centerCoC * centerMip1.a > 0.0) * centerAllowMip;
        centerFilteredColor = mix(centerColor, centerMip1.rgb, clamp(mipLevel, 0.25, 1.0) * centerMip1Valid);
    } else {
        let centerMip2 = textureSampleLevel(cocMip2Texture, basicSampler, centerUV, 0.0);
        let centerMip2Valid = saturate(1.0 - abs(centerMip2.a - centerCoC) / centerTolerance) * select(0.0, 1.0, centerCoC * centerMip2.a > 0.0) * centerAllowMip;
        centerFilteredColor = mix(centerColor, centerMip2.rgb, centerMip2Valid);
    }
}

var accumColor = vec3<f32>(0.0);
var accumWeight: f32 = 0.0;
var fgCoverageSum: f32 = 0.0;
var fgRadiusSum: f32 = 0.0;
var fgRadiusWeightSum: f32 = 0.0;
var totalKernelWeight: f32 = 1.0;

if (!isForegroundPass) {
    // [KO] 배경 패스에서 중심 픽셀이 전경(isCenterForeground)인 경우 중심 전경 색상을 배제하여 순수 후면 배경만 홀 필링
    // [EN] In the background pass, exclude the center foreground color when the center pixel is foreground (isCenterForeground) so only pure background behind it is hole-filled
    if (!isCenterForeground) {
        let centerLuma = max(getLuminance(centerFilteredColor), 0.0);
        let centerW = 1.0 + smoothstep(0.25, 3.0, centerLuma) * halfBokehBrightness;
        accumColor += centerFilteredColor * centerW;
        accumWeight += centerW;
    }
} else if (isCenterForeground) {
    let centerLuma = max(getLuminance(centerFilteredColor), 0.0);
    let centerW = 1.0 + smoothstep(0.25, 3.0, centerLuma) * halfBokehBrightness;
    let selfCoverage = smoothstep(0.25, 0.75, -centerCoC);
    accumColor += centerFilteredColor * centerW * selfCoverage;
    accumWeight += centerW * selfCoverage;
    fgCoverageSum += selfCoverage;
    fgRadiusSum += (-centerCoC) * selfCoverage;
    fgRadiusWeightSum += selfCoverage;
}

let shouldSampleActiveMip = mipLevel > 0.1;
let mip0BlendFactor = smoothstep(0.1, 0.5, mipLevel);
let mip1BlendFactor = smoothstep(0.5, 1.25, mipLevel);
let basePixelCenter = vec2<f32>(index) + 0.5;

// [KO] 워크그룹 공유 메모리(sharedKernel)에 캐싱된 정다각형/원형 탭 벡터를 참조하여 초월함수 호출 없이 5-Ring 동심 링 개더링 수행
// [EN] Perform 5-Ring polygonal/circular concentric ring gathering directly from workgroup shared memory (sharedKernel) without per-pixel transcendental SFU calls
for (var b = 0u; b < sectorCount; b = b + 1u) {
    var tapSlot = b * TAPS_PER_SECTOR;

    for (var ring = 1u; ring <= activeRingCount; ring = ring + 1u) {
        let normRadius = (f32(ring) - 0.35) * invActiveRingCount;
        let radialWindow = 1.0 - 0.2 * normRadius;
        let normGatherRadius = normRadius * gatherRadius;

        for (var step = 0u; step < ring; step = step + 1u) {
            totalKernelWeight += radialWindow;

            let kernelTap = sharedKernel[tapSlot];
            tapSlot = tapSlot + 1u;

            let offsetTexels = kernelTap.xy * normGatherRadius;
            let polyScale = kernelTap.z;
            let distTexels = polyScale * normGatherRadius;

            let sampleCoord0 = clamp(vec2<i32>(floor(basePixelCenter + offsetTexels)), vec2<i32>(0), maxHalfCoord);
            let discreteMip0 = textureLoad(cocMip0Texture, sampleCoord0, 0);

            var sampleColor = discreteMip0.rgb;
            var sampleCoC = discreteMip0.a;

            // [KO] mipLevel <= 0.1 구간은 smoothstep(0.1, 0.5, mipLevel) === 0.0 항등이므로 가중치 0인 양선형 페치를 생략 (탭당 2회 -> 1회 페치)
            // [EN] Skip zero-weight bilinear fetch when mipLevel <= 0.1 since smoothstep(0.1, 0.5, mipLevel) === 0.0 identically (2 -> 1 fetch/tap)
            if (shouldSampleActiveMip) {
                let sampleUV = centerUV + offsetTexels * invHalfDims;
                var activeMipSample: vec4<f32>;
                var mipBlendWeight: f32;
                if (mipLevel < 0.5) {
                    activeMipSample = textureSampleLevel(cocMip0Texture, basicSampler, sampleUV, 0.0);
                    mipBlendWeight = mip0BlendFactor;
                } else if (mipLevel < 1.5) {
                    activeMipSample = textureSampleLevel(cocMip1Texture, basicSampler, sampleUV, 0.0);
                    mipBlendWeight = mip1BlendFactor * smoothstep(0.25, 0.85, abs(discreteMip0.a));
                } else {
                    activeMipSample = textureSampleLevel(cocMip2Texture, basicSampler, sampleUV, 0.0);
                    mipBlendWeight = smoothstep(0.25, 0.85, abs(discreteMip0.a));
                }

                let cocTolerance = max(0.85, abs(discreteMip0.a) * 0.35);
                let mipValid = mipBlendWeight * saturate(1.0 - abs(activeMipSample.a - discreteMip0.a) / cocTolerance) * select(0.0, 1.0, discreteMip0.a * activeMipSample.a >= 0.0);
                sampleColor = mix(discreteMip0.rgb, activeMipSample.rgb, mipValid);
                sampleCoC = mix(discreteMip0.a, activeMipSample.a, mipValid);
            }

            if (!isForegroundPass) {
                if (isCenterForeground) {
                    // [KO] 전경 픽셀 뒤편의 배경 복원(Disocclusion Hole-Filling): 전경이 아닌 샘플(discreteMip0.a > -0.25)만 수집하여 전경 반투명 외곽선 뒤의 배경을 채움
                    // [EN] Background reconstruction behind foreground pixels (Disocclusion Hole-Filling): gather only non-foreground samples (discreteMip0.a > -0.25) to fill the background behind semi-transparent foreground edges
                    if (discreteMip0.a > -0.25 && sampleCoC > -0.25) {
                        let bgHoleWeight = smoothstep(-0.25, 0.5, sampleCoC) * radialWindow;
                        accumColor += sampleColor * bgHoleWeight;
                        accumWeight += bgHoleWeight;
                    }
                } else if (discreteMip0.a > 0.25 && sampleCoC > 0.25) {
                    let diffuseWeight = smoothstep(0.25, 1.25, sampleCoC) * (1.0 - 0.35 * normRadius);
                    let pairFarRadius = min(centerCoC, sampleCoC) * polyScale;
                    let bokehDiscCoverage = saturate(pairFarRadius - distTexels + 0.5);
                    let sampleLuma = max(getLuminance(sampleColor), 0.0);
                    let highlightBoost = smoothstep(0.25, 3.0, sampleLuma) * halfBokehBrightness;
                    let w = diffuseWeight + bokehDiscCoverage * highlightBoost;
                    if (w > 0.0) {
                        accumColor += sampleColor * w;
                        accumWeight += w;
                    }
                }
            } else {
                // [KO] Pass 3B: 전경(Near < 0) 전용 레이어 개더링 및 유효 전경 반경(activeFgRadius) 면적 대비 연속 기하학적 불투명도(fgOpacity) 산출
                // [EN] Pass 3B: Foreground (Near < 0) dedicated layer gathering and continuous geometric opacity (fgOpacity) relative to active foreground radius (activeFgRadius) area
                if (discreteMip0.a < -0.25 && sampleCoC < -0.25) {
                    let rawPairNearRadius = max(centerNearRadius, -sampleCoC);
                    let pairNearRadius = rawPairNearRadius * polyScale;
                    let coverage = saturate(pairNearRadius - distTexels + 0.5);
                    if (coverage > 0.0) {
                        let sampleLuma = max(getLuminance(sampleColor), 0.0);
                        let opticalW = 1.0 + smoothstep(0.25, 3.0, sampleLuma) * halfBokehBrightness;
                        let depthPriority = 1.0 + clamp((-sampleCoC - centerNearRadius) * 0.15, 0.0, 2.0);
                        let covW = coverage * radialWindow;
                        let w = covW * opticalW * depthPriority;
                        accumColor += sampleColor * w;
                        accumWeight += w;
                        fgCoverageSum += covW;
                        fgRadiusSum += rawPairNearRadius * covW;
                        fgRadiusWeightSum += covW;
                    }
                }
            }
        }
    }
}

if (!isForegroundPass) {
    let hasBg = accumWeight > 1e-4;
    let gatheredBg = accumColor / max(accumWeight, 1e-4);
    let bgHoleConfidence = select(1.0, saturate(accumWeight / (totalKernelWeight * 0.15)), isCenterForeground);
    let bgColor = select(centerFilteredColor, mix(centerFilteredColor, gatheredBg, bgHoleConfidence), hasBg);
    let outFarCoC = select(farGatherRadius, max(dilatedMaxFarCoC, 0.0), isCenterForeground);
    textureStore(outputTexture, index, vec4<f32>(bgColor, outFarCoC));
} else {
    let hasFg = accumWeight > 1e-4;
    let fgColor = select(centerFilteredColor, accumColor / max(accumWeight, 1e-4), hasFg);
    let activeFgRadius = select(gatherRadius, clamp(fgRadiusSum / max(fgRadiusWeightSum, 1e-4), 0.5, gatherRadius), fgRadiusWeightSum > 1e-4);
    let radiusRatio = activeFgRadius / max(gatherRadius, 0.5);
    let activeKernelWeight = max(totalKernelWeight * clamp(radiusRatio * radiusRatio, 0.05, 1.0), 1.0);
    let fgOpacity = select(0.0, saturate(fgCoverageSum / activeKernelWeight), hasFg);
    textureStore(outputTexture, index, vec4<f32>(fgColor, fgOpacity));
}
