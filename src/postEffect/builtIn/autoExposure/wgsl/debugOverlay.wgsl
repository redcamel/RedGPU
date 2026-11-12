struct EyeAdaptationState {
    adaptedEV100: f32,
    effectiveEV100: f32,
    preExposure: f32,
    preExposureRatio: f32,
    sceneAvgEV100: f32,
    targetEV100: f32,
    initialized: u32,
    maxBinCount: u32,
};

struct AutoExposureUniforms {
    deltaTime: f32,
    calibrationOffset: f32,
    exposureCompensation: f32,
    minPossibleEV100: f32,
    minEV100: f32,
    maxEV100: f32,
    ev100Range: f32,
    invEv100Range: f32,
    lowPercentile: f32,
    highPercentile: f32,
    adjustmentSpeedUp: f32,
    adjustmentSpeedDown: f32,
    width: f32,
    height: f32,
    invWidth: f32,
    invHeight: f32,
    spotRadiusSqInv: f32,
    skyMeteringWeight: f32,
    maxHistogramLuminance: f32,
    lowKeyBias: f32,
    lowKeyEV100: f32,
    highKeyBias: f32,
    highKeyEV100: f32,
    highlightProtection: f32,
    meteringMode: u32,
    forceReset: u32,
    isLockedRange: u32,
    pad0: u32,
};

@group(0) @binding(0) var<storage, read> debugHistogram : array<u32, 256>;
@group(0) @binding(1) var<storage, read> state : EyeAdaptationState;
@group(0) @binding(2) var<uniform> uniforms : AutoExposureUniforms;

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) cardSize : vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
    var quadUV = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(1.0, 1.0)
    );

    let localUV = quadUV[vertexIndex];
    let vpSize = max(vec2<f32>(uniforms.width, uniforms.height), vec2<f32>(1.0, 1.0));
    let scale = clamp(vpSize.y / 900.0, 0.75, 1.5);
    let margin = vec2<f32>(16.0, 16.0) * scale;
    let maxCard = max(vpSize - margin * 2.0, vec2<f32>(64.0, 32.0));
    let cardSize = clamp(vec2<f32>(312.0, 118.0) * scale, vec2<f32>(64.0, 32.0), maxCard);

    let pxPos = margin + localUV * cardSize;
    let ndc = (pxPos / vpSize) * 2.0 - vec2<f32>(1.0, 1.0);

    var output : VertexOutput;
    output.position = vec4<f32>(ndc.x, ndc.y, 0.0, 1.0);
    output.uv = localUV;
    output.cardSize = cardSize;
    return output;
}

@fragment
fn fs_main(input : VertexOutput) -> @location(0) vec4<f32> {
    let px = input.uv * input.cardSize;
    let borderDist = min(min(px.x, input.cardSize.x - px.x), min(px.y, input.cardSize.y - px.y));

    var color = vec3<f32>(0.055, 0.068, 0.095);
    var alpha = 0.86;

    if (borderDist < 1.5) {
        return vec4<f32>(0.26, 0.33, 0.44, 0.95);
    }

    let padX = 10.0;
    let padBottom = 14.0;
    let padTop = 14.0;
    let plotMin = vec2<f32>(padX, padBottom);
    let plotMax = max(input.cardSize - vec2<f32>(padX, padTop), plotMin + vec2<f32>(1.0, 1.0));
    let plotSize = plotMax - plotMin;

    let safeRange = max(uniforms.ev100Range, 0.001);
    let invRange = 1.0 / safeRange;
    let sceneNorm = saturate((state.sceneAvgEV100 - uniforms.minEV100) * invRange);
    let targetNorm = saturate((state.targetEV100 - uniforms.minEV100) * invRange);
    let adaptedNorm = saturate((state.adaptedEV100 - uniforms.minEV100) * invRange);

    // 상단 상태 인디케이터 바 (SceneAvg: White, Target: Amber, Adapted: Emerald + 측광 모드 핍)
    if (px.y > plotMax.y + 2.0) {
        let headerY = px.y - (plotMax.y + 2.0);
        if (headerY >= 3.0 && headerY <= 8.0) {
            if (px.x >= padX && px.x <= padX + 14.0) {
                color = vec3<f32>(0.92, 0.95, 1.0);
            } else if (px.x >= padX + 20.0 && px.x <= padX + 34.0) {
                color = vec3<f32>(1.0, 0.72, 0.18);
            } else if (px.x >= padX + 40.0 && px.x <= padX + 54.0) {
                color = vec3<f32>(0.18, 0.96, 0.52);
            }
            for (var m = 0u; m < 4u; m = m + 1u) {
                let pipX = plotMax.x - f32(4u - m) * 9.0 + 2.0;
                if (px.x >= pipX && px.x <= pipX + 5.0) {
                    color = select(vec3<f32>(0.18, 0.22, 0.29), vec3<f32>(0.38, 0.78, 1.0), uniforms.meteringMode == m);
                }
            }
        }
        return vec4<f32>(color, alpha);
    }

    // 하단 노출 스케일 램프 및 적응된 EV100 삼각 마커
    if (px.y < plotMin.y - 2.0) {
        if (px.x >= plotMin.x && px.x <= plotMax.x && px.y >= 4.0 && px.y <= 9.0) {
            let t = (px.x - plotMin.x) / plotSize.x;
            color = vec3<f32>(t * 0.85);
            let adaptedPx = plotMin.x + adaptedNorm * plotSize.x;
            if (abs(px.x - adaptedPx) <= 2.0) {
                color = vec3<f32>(0.18, 0.96, 0.52);
            }
        }
        return vec4<f32>(color, alpha);
    }

    // 메인 256-Bin 로그 휘도 히스토그램 플롯 영역
    if (px.x >= plotMin.x && px.x <= plotMax.x && px.y >= plotMin.y && px.y <= plotMax.y) {
        let plotUV = (px - plotMin) / plotSize;
        color = vec3<f32>(0.035, 0.045, 0.065);

        // 보조선 (25%, 50%, 75% 수직선 및 중앙 수평선, EV 0 기준선)
        let gridX = abs(fract(plotUV.x * 4.0 + 0.5) - 0.5) * (plotSize.x * 0.25);
        let gridY = abs(plotUV.y - 0.5) * plotSize.y;
        if (gridX < 0.5 || gridY < 0.5) {
            color = vec3<f32>(0.09, 0.11, 0.15);
        }

        if (uniforms.minEV100 < 0.0 && uniforms.maxEV100 > 0.0) {
            let zeroNorm = (0.0 - uniforms.minEV100) * invRange;
            if (abs(plotUV.x - zeroNorm) * plotSize.x < 0.75) {
                color = vec3<f32>(0.18, 0.22, 0.30);
            }
        }

        // 히스토그램 빈 막대 (sqrt 스케일로 암부·명부 꼬리 분포 가시성 확보)
        let binIndex = min(255u, u32(plotUV.x * 256.0));
        let normCount = sqrt(f32(debugHistogram[binIndex]) / f32(max(state.maxBinCount, 1u)));
        if (plotUV.y <= normCount) {
            let barTint = mix(vec3<f32>(0.18, 0.48, 0.88), vec3<f32>(0.36, 0.86, 0.98), plotUV.x);
            let peakBoost = mix(0.75, 1.0, plotUV.y / max(normCount, 0.001));
            color = barTint * peakBoost;
        }

        // Dynamic EV100 Bias Curve 시각화 (±4 EV 스케일)
        if (abs(uniforms.lowKeyBias) > 0.001 || abs(uniforms.highKeyBias) > 0.001) {
            let evAtX = uniforms.minEV100 + plotUV.x * safeRange;
            let midEV = 0.5 * (uniforms.lowKeyEV100 + uniforms.highKeyEV100);
            let lowEdge1 = max(min(uniforms.lowKeyEV100 + 3.0, midEV), uniforms.lowKeyEV100 + 0.01);
            let highEdge0 = min(max(uniforms.highKeyEV100 - 3.0, midEV), uniforms.highKeyEV100 - 0.01);
            let lowW = 1.0 - smoothstep(uniforms.lowKeyEV100, lowEdge1, evAtX);
            let highW = smoothstep(highEdge0, uniforms.highKeyEV100, evAtX);
            let curveBias = uniforms.lowKeyBias * lowW + uniforms.highKeyBias * highW;
            let curveY = clamp(0.5 + curveBias * 0.125, 0.02, 0.98);
            if (abs(plotUV.y - curveY) * plotSize.y < 1.1) {
                color = mix(color, vec3<f32>(0.92, 0.42, 0.96), 0.9);
            }
        }

        // 수직 마커: SceneAvg(White) -> Target(Amber) -> Adapted(Emerald)
        let sceneDistPx = abs(plotUV.x - sceneNorm) * plotSize.x;
        if (sceneDistPx < 1.0) {
            color = mix(color, vec3<f32>(0.92, 0.95, 1.0), 0.85);
        }

        let targetDistPx = abs(plotUV.x - targetNorm) * plotSize.x;
        if (targetDistPx < 1.1) {
            color = mix(color, vec3<f32>(1.0, 0.72, 0.18), 0.92);
        }

        let adaptedDistPx = abs(plotUV.x - adaptedNorm) * plotSize.x;
        if (adaptedDistPx < 1.35) {
            color = vec3<f32>(0.18, 0.96, 0.52);
        }
    }

    return vec4<f32>(color, alpha);
}
