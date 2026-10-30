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

let dpr = clamp(systemUniforms.devicePixelRatio, 1.0, 2.0);
let maxHalfRadius = 0.5 * DOF_MAX_COC_FULL_PX * dpr;

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
// [KO] 배경 패스(Pass 3A): 전경 픽셀(isCenterForeground)에서는 후면 홀필링 반경을 탐색하고, 비전경 픽셀에서는 중심 픽셀의 배경 CoC 반경으로 탐색하여 원경이 근경 배경 위로 역침범하는 현상 차단
// [EN] Background pass (Pass 3A): search hole-filling radius on foreground pixels (isCenterForeground), and gather within center Far CoC on non-foreground pixels to prevent distant background from bleeding over closer background
let farGatherRadius = min(select(max(centerCoC, 0.0), max(nearGatherRadius, dilatedMaxFarCoC), isCenterForeground), maxHalfRadius);
let gatherRadius = select(farGatherRadius, nearGatherRadius, isForegroundPass);

if (gatherRadius < 0.25) {
    let outAlpha = select(max(centerCoC, 0.0), 0.0, isForegroundPass);
    textureStore(outputTexture, index, vec4<f32>(centerColor, outAlpha));
    return;
}

// [KO] 반경 비례 적응형 링 스케일링(2~5 Rings, 18~90 Taps): 전경 후면 홀필링 시에도 전체 반경을 탐색하여 실루엣 내부까지 배경 도달 보장
// [EN] Radius-proportional adaptive ring scaling (2~5 Rings, 18~90 Taps): search full radius during background hole-filling to guarantee background reach inside foreground silhouettes
let activeRingCount = clamp(u32(ceil(gatherRadius * 0.55)) + 1u, 2u, RING_COUNT);
let invActiveRingCount = 1.0 / f32(activeRingCount);

let ringSpacing = gatherRadius * invActiveRingCount;
let mipLevel = clamp(log2(max(ringSpacing, 1.0)), 0.0, 2.0);
let halfBokehBrightness = uniforms.bokehBrightness * 0.5;
let isBgHoleFill = !isForegroundPass && isCenterForeground;

var centerFilteredColor = centerColor;
let centerAllowMip = saturate(abs(centerCoC) - 0.5);
if (!isBgHoleFill && mipLevel > 0.05 && centerAllowMip > 0.0) {
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
var accumFarCoC: f32 = 0.0;
var fgCoverageSum: f32 = 0.0;
var fgRadiusSum: f32 = 0.0;
var fgRadiusWeightSum: f32 = 0.0;
var totalKernelWeight: f32 = 1.0;

if (!isForegroundPass) {
    // [KO] 배경 패스에서 중심 픽셀이 전경(isCenterForeground)인 경우 중심 전경 색상을 배제하여 순수 후면 배경만 홀 필링
    // [EN] In the background pass, exclude the center foreground color when the center pixel is foreground (isCenterForeground) so only pure background behind it is hole-filled
    if (!isCenterForeground) {
        let centerExcessLuma = max(getLuminance(centerFilteredColor) - 0.25, 0.0);
        let centerHighlight = centerExcessLuma / (1.0 + centerExcessLuma * 0.25);
        let centerW = 1.0 + centerHighlight * halfBokehBrightness;
        accumColor += centerFilteredColor * centerW;
        accumWeight += centerW;
        accumFarCoC += max(centerCoC, 0.0) * centerW;
    }
} else if (isCenterForeground) {
    let centerExcessLuma = max(getLuminance(centerFilteredColor) - 0.25, 0.0);
    let centerHighlight = centerExcessLuma / (1.0 + centerExcessLuma * 0.25);
    let centerW = 1.0 + centerHighlight * halfBokehBrightness;
    let selfCoverage = smoothstep(0.25, 0.75, -centerCoC);
    accumColor += centerFilteredColor * centerW * selfCoverage;
    accumWeight += centerW * selfCoverage;
    fgCoverageSum += selfCoverage;
    fgRadiusSum += (-centerCoC) * selfCoverage;
    fgRadiusWeightSum += selfCoverage;
}

let basePixelCenter = vec2<f32>(index) + 0.5;

// [KO] 워크그룹 공유 메모리(sharedKernel)에 캐싱된 정다각형/원형 탭 벡터를 참조하여 초월함수 호출 없이 5-Ring 동심 링 개더링 수행 (균일 Pillbox 개구부 투과율)
// [EN] Perform 5-Ring polygonal/circular concentric ring gathering from workgroup shared memory (sharedKernel) without per-pixel SFU calls (uniform Pillbox aperture transmittance)
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

            // [KO] 전경 후면 홀필링(isBgHoleFill) 시에는 밉 레벨 상한을 1.0(1/4 해상도)으로 제한하여 링 간격의 점박이 노이즈와 1/8 저해상도 뭉개짐을 동시에 방지
            // [EN] During background hole-filling (isBgHoleFill), cap mip level at 1.0 (1/4-res) to prevent both discrete ring-tap dots and 1/8-res blurring
            let tapMipLevel = select(mipLevel, min(mipLevel, 1.0), isBgHoleFill);
            if (tapMipLevel > 0.1) {
                let sampleUV = centerUV + offsetTexels * invHalfDims;
                var activeMipSample: vec4<f32>;
                var mipBlendWeight: f32;
                if (tapMipLevel < 0.5) {
                    activeMipSample = textureSampleLevel(cocMip0Texture, basicSampler, sampleUV, 0.0);
                    mipBlendWeight = smoothstep(0.1, 0.5, tapMipLevel);
                } else if (tapMipLevel < 1.5) {
                    activeMipSample = textureSampleLevel(cocMip1Texture, basicSampler, sampleUV, 0.0);
                    mipBlendWeight = smoothstep(0.5, 1.25, tapMipLevel) * smoothstep(0.25, 0.85, abs(discreteMip0.a));
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
                    // [KO] 전경 픽셀 뒤편의 배경 복원(Disocclusion Hole-Filling): 비전경 샘플(discreteMip0.a > -0.25)에 대해 원경 CoC 편향 없는 순수 거리 감쇠 가중치를 적용하여 근경 배경(CesiumMan) 위 원경 하늘 역침범 점박이 차단
                    // [EN] Background reconstruction behind foreground pixels (Disocclusion Hole-Filling): apply Far-CoC-unbiased distance decay to non-foreground samples (discreteMip0.a > -0.25) to prevent distant sky splotches over closer background objects
                    if (discreteMip0.a > -0.25 && sampleCoC > -0.25) {
                        let sampleFarCoC = max(sampleCoC, 0.0);
                        let bgHoleWeight = 1.0 / (1.0 + distTexels * 0.5);
                        accumColor += sampleColor * bgHoleWeight;
                        accumWeight += bgHoleWeight;
                        accumFarCoC += sampleFarCoC * bgHoleWeight;
                    }
                } else if (discreteMip0.a > 0.25 && sampleCoC > 0.25) {
                    // [KO] 배경 상호 보케 개더링: min(centerCoC, sampleCoC) 기반 대칭 반경 판정으로 전경/근경 배경 경계의 누수 차단 및 부드러운 보케 블러 형성
                    // [EN] Mutual background bokeh gathering: use min(centerCoC, sampleCoC) symmetric radius to prevent bleeding across foreground/near-background boundaries while forming smooth bokeh blur
                    let pairFarRadius = min(centerCoC, sampleCoC) * polyScale;
                    let bokehDiscCoverage = saturate(pairFarRadius - distTexels + 0.5);
                    let diffuseWeight = bokehDiscCoverage * smoothstep(0.25, 1.25, sampleCoC);
                    let sampleExcessLuma = max(getLuminance(sampleColor) - 0.25, 0.0);
                    let highlightBoost = (sampleExcessLuma / (1.0 + sampleExcessLuma * 0.25)) * halfBokehBrightness;
                    let w = diffuseWeight + bokehDiscCoverage * highlightBoost;
                    if (w > 0.0) {
                        accumColor += sampleColor * w;
                        accumWeight += w;
                        accumFarCoC += sampleCoC * w;
                    }
                }
            } else {
                // [KO] Pass 3B: 전경(Near < 0) 전용 레이어 개더링 - 샘플 자신의 물리적 전경 반경(-sampleCoC) 도달 판정 및 유효 전경 반경 면적 대비 불투명도(fgOpacity) 산출
                // [EN] Pass 3B: Foreground (Near < 0) dedicated layer gathering - evaluate reach from sample's own physical near radius (-sampleCoC) and compute geometric opacity (fgOpacity)
                if (discreteMip0.a < -0.25 && sampleCoC < -0.25) {
                    let sampleNearRadius = -sampleCoC;
                    let rawPairNearRadius = select(sampleNearRadius, max(centerNearRadius, sampleNearRadius), sampleNearRadius > centerNearRadius * 0.5);
                    let coverage = saturate((rawPairNearRadius - normGatherRadius) * polyScale + 0.5);
                    if (coverage > 0.0) {
                        let sampleExcessLuma = max(getLuminance(sampleColor) - 0.25, 0.0);
                        let opticalW = 1.0 + (sampleExcessLuma / (1.0 + sampleExcessLuma * 0.25)) * halfBokehBrightness;
                        let areaRatio = max(centerNearRadius, 1.5) / max(sampleNearRadius, 1.5);
                        let areaWeight = clamp(areaRatio * areaRatio, 0.25, 1.0);
                        let depthPriority = 1.0 + clamp((sampleNearRadius - centerNearRadius) * 0.15, 0.0, 2.0);
                        let w = coverage * opticalW * areaWeight * depthPriority;
                        accumColor += sampleColor * w;
                        accumWeight += w;
                        fgCoverageSum += coverage;
                        fgRadiusSum += rawPairNearRadius * coverage;
                        fgRadiusWeightSum += coverage;
                    }
                }
            }
        }
    }
}

if (!isForegroundPass) {
    let hasBg = accumWeight > 1e-4;
    let invAccumWeight = 1.0 / max(accumWeight, 1e-4);
    let gatheredBg = accumColor * invAccumWeight;
    let bgHoleConfidence = select(1.0, saturate(accumWeight / (totalKernelWeight * 0.08)), isCenterForeground);
    let bgColor = select(centerFilteredColor, mix(centerFilteredColor, gatheredBg, bgHoleConfidence), hasBg);
    let outFarCoC = select(max(centerCoC, 0.0), accumFarCoC * invAccumWeight * bgHoleConfidence, hasBg);
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
