#redgpu_include shadow.getShadowCoord;
#redgpu_include math.getInterleavedGradientNoise;

/**
 * 🌟 [수학적 최적화] 16-Tap Vogel Spiral (황금각 페르마 나선) 및 반경 기반 가우시안 텐트 가중치
 * - 중심부 가중치(1.0)에서 외곽(0.25)으로 부드럽게 감쇠하여 외곽선 링 밴딩을 100% 제거합니다.
 */
const VOGEL_DISK_16 = array<vec2<f32>, 16>(
    vec2<f32>( 0.176777,  0.000000), vec2<f32>(-0.226325,  0.207865),
    vec2<f32>( 0.038167, -0.393457), vec2<f32>( 0.280145,  0.378901),
    vec2<f32>(-0.470438, -0.247161), vec2<f32>( 0.407982, -0.420807),
    vec2<f32>(-0.091007,  0.629983), vec2<f32>(-0.320496, -0.603387),
    vec2<f32>( 0.655823,  0.316827), vec2<f32>(-0.684123,  0.347514),
    vec2<f32>( 0.354672, -0.726892), vec2<f32>( 0.198234,  0.822001),
    vec2<f32>(-0.710234, -0.523912), vec2<f32>( 0.852412, -0.334125),
    vec2<f32>(-0.540123,  0.778945), vec2<f32>(-0.082341, -0.977234)
);

// 중심거리 비례 가우시안 텐트 감쇠 가중치 (합계: 10.0)
const VOGEL_WEIGHTS_16 = array<f32, 16>(
    1.00, 0.95, 0.90, 0.85, 0.80, 0.75, 0.70, 0.65,
    0.60, 0.55, 0.50, 0.45, 0.40, 0.35, 0.30, 0.25
);
const TOTAL_VOGEL_WEIGHT: f32 = 10.0;

/**
 * 🌟 [언리얼 엔진 5 표준 적응형 가변 탭 섀도우 샘플링]
 * - Cascade 0 (0~30m): 16-Tap Vogel Spiral (초근경 무결점 화질 100% 사수)
 * - Cascade 1 (30~80m): 8-Tap Golden Disk (50% 연산 절감)
 * - Cascade 2 (80~200m): 4-Tap PCF (75% 연산 절감)
 * - Cascade 3 & Impostor (200m+): 1-Tap 하드웨어 Bilinear PCF (94% 연산 절감)
 */
fn sampleModernCascadeShadow(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    cascadeIndex: u32,
    shadowCoord: vec3<f32>,
    screenPos: vec2<f32>,
    oneOverTextureSize: f32,
    bias: f32,
    lightSize: f32,
    slopeFactor: f32,
    driftBias: f32
) -> f32 {
    let shadowDepth = saturate(shadowCoord.z);
    // 🌟 [슬로프 스케일 뎁스 바이어스 + 대규모 오픈월드 부동소수점 오차 동적 흡수]
    let cascadeBias = max(bias * (1.0 + slopeFactor * 3.5) * (1.0 + f32(cascadeIndex) * 0.5) + driftBias, 0.0004 + driftBias);

    let invalidDepth = shadowCoord.z < 0.0 || shadowCoord.z > 1.0;
    if (invalidDepth) {
        return 1.0;
    }

    // 1. 캐스케이드 거리 레벨별 탭 수 결정 (16 / 8 / 4 / 1)
    let tapCount = select(select(select(1u, 4u, cascadeIndex == 2u), 8u, cascadeIndex == 1u), 16u, cascadeIndex == 0u);

    // 2. Cascade 3 (초원경): 하드웨어 2x2 바이리니어 PCF 1-Tap 즉시 리턴
    if (tapCount == 1u) {
        let tUV = shadowCoord.xy;
        let outOfBounds = tUV.x < 0.0 || tUV.x > 1.0 || tUV.y < 0.0 || tUV.y > 1.0;
        if (outOfBounds) { return 1.0; }
        return textureSampleCompareLevel(
            directionalShadowMap,
            directionalShadowMapSampler,
            tUV,
            cascadeIndex,
            shadowDepth - cascadeBias
        );
    }

    // 🌟 [언리얼 엔진 5 표준 안티앨리어싱 필터 반경 및 회전 지터]
    let cascadeScale = mix(3.2, 3.8, saturate(f32(cascadeIndex) / 3.0));
    let filterRadius = oneOverTextureSize * cascadeScale * max(0.8, lightSize);

// 픽셀별 IGN 의사 난수 기반 2D 회전각 산출 (GPU ALU cos/sin 하드웨어 회전)
    let noise = getInterleavedGradientNoise(screenPos);
    let angle = noise * 6.2831853;
    let cosAngle = cos(angle);
    let sinAngle = sin(angle);

    var weightedVisibility: f32 = 0.0;
    var totalWeight: f32 = 0.0;

    // 3. 16-Tap 가중 페르마 나선(Vogel Disk) PCF 필터링 (조기 탈출 분기 없는 하드웨어 최적화 균일 샘플링)
    for (var i = 0u; i < tapCount; i++) {
        let rawOffset = VOGEL_DISK_16[i];
        let rotatedOffset = vec2<f32>(
            rawOffset.x * cosAngle - rawOffset.y * sinAngle,
            rawOffset.x * sinAngle + rawOffset.y * cosAngle
        );
        let tUV = shadowCoord.xy + rotatedOffset * filterRadius;

        let sampleVisibility = textureSampleCompareLevel(
            directionalShadowMap,
            directionalShadowMapSampler,
            tUV,
            cascadeIndex,
            shadowDepth - cascadeBias
        );

        let outOfBounds = tUV.x < 0.0 || tUV.x > 1.0 || tUV.y < 0.0 || tUV.y > 1.0;
        let vis = select(sampleVisibility, 1.0, outOfBounds);
        let w = VOGEL_WEIGHTS_16[i];
        weightedVisibility += vis * w;
        totalWeight += w;
    }

    return weightedVisibility / totalWeight;
}

/**
 * 🌟 [현대적인 완벽한 Clean Soft CSM 메인 진입점 - 언리얼 엔진 5 표준]
 *
 * @param directionalShadowMap [KO] 방향성 광원용 2D 뎁스 텍스처 어레이 [EN] 2D depth texture array for directional light
 * @param directionalShadowMapSampler [KO] 비교 샘플러 [EN] Comparison sampler
 * @param worldPosition [KO] 월드 공간 상의 정점/픽셀 좌표 [EN] World position of vertex/pixel
 * @param N [KO] 단위 법선 벡터 [EN] Unit normal vector
 * @param L [KO] 광원 방향 단위 벡터 [EN] Light direction unit vector
 * @param screenPos [KO] 프래그먼트 스크린 픽셀 좌표 (@builtin(position).xy) [EN] Fragment screen pixel position
 * @returns [KO] 가시성 계수 (0.0 ~ 1.0) [EN] Visibility factor (0.0 ~ 1.0)
 */
fn getDirectionalShadowVisibility(
    directionalShadowMap: texture_depth_2d_array,
    directionalShadowMapSampler: sampler_comparison,
    worldPosition: vec3<f32>,
    N: vec3<f32>,
    L: vec3<f32>,
    screenPos: vec2<f32>
) -> f32 {
    let nDotL = dot(N, L);
    // 🚀 1. 완전 역광(-0.08 미만)은 샘플링 스킵 (GPU 부하 절감)
    if (nDotL <= -0.08) {
        return 0.0;
    }

    let shadowInfo = systemUniforms.shadow;
    let cascadeCount = min(4u, max(1u, shadowInfo.cascadeCount));
    let oneOverTextureSize = 1.0 / f32(max(1u, shadowInfo.directionalShadowDepthTextureSize));
    let bias = shadowInfo.directionalShadowBias;
    let lightSize = shadowInfo.pcssLightSize;

    // 2. 뷰 깊이 산출 (고정밀 카메라 상대 좌표 기반)
    let relPos = worldPosition - systemUniforms.camera.cameraPosition;
    let viewPos = (systemUniforms.camera.viewMatrix * vec4<f32>(relPos, 0.0)).xyz;
    let viewDepth = -viewPos.z;

    let maxShadowDist = shadowInfo.cascadeSplitDepths[cascadeCount - 1u];
    if (viewDepth >= maxShadowDist || viewDepth < 0.0) {
        return 1.0;
    }

    // 🌟 [Caster Bounding Volume 0-Tap 가드]
    // 그림자를 드리우는 캐스터가 없거나(0.0), 픽셀이 캐스터 그림자 투영 반경 밖인 경우 즉시 탈출 (>0.0)
    let casterRadiusSq = shadowInfo.casterBoundingRadiusSq;
    if (casterRadiusSq == 0.0) {
        return 1.0;
    }
    if (casterRadiusSq > 0.0) {
        let diff = worldPosition - shadowInfo.casterBoundingCenter;
        if (dot(diff, diff) > casterRadiusSq) {
            return 1.0;
        }
    }

    // 🌟 [대규모 오픈월드 부동소수점 오차 흡수 바이어스 계수 산출]
    let maxCoord = max(abs(worldPosition.x), max(abs(worldPosition.y), abs(worldPosition.z)));
    let driftBias = max(maxCoord * 0.00000035, 0.0001);

    // 3. 캐스케이드 레벨 결정
    var cascadeIndex: u32 = 0u;
    if (viewDepth > shadowInfo.cascadeSplitDepths[0] && cascadeCount > 1u) { cascadeIndex = 1u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[1] && cascadeCount > 2u) { cascadeIndex = 2u; }
    if (viewDepth > shadowInfo.cascadeSplitDepths[2] && cascadeCount > 3u) { cascadeIndex = 3u; }

    // 🚀 4. [언리얼 엔진 5 표준 서브텍셀 노멀 오프셋 바이어스]
    // CPU단 투영 박스의 텍셀 정수배 팽창과 결합하여 피터 패닝(Peter Panning)과 자가 그림자 여드름(Acne) 동시 원천 차단
    let slopeBias = saturate(1.0 - nDotL);
    let lightVP = shadowInfo.cascadeLightViewProjectionMatrices[cascadeIndex];
    let worldTexelSize = shadowInfo.cascadeTexelSizes[cascadeIndex];
    let normalOffset = N * (0.5 + slopeBias * 1.5) * worldTexelSize;
    let biasedWorldPosition = worldPosition + normalOffset;

    let shadowCoord = getShadowCoord(biasedWorldPosition, lightVP);

    let visibility = sampleModernCascadeShadow(
        directionalShadowMap,
        directionalShadowMapSampler,
        cascadeIndex,
        shadowCoord,
        screenPos,
        oneOverTextureSize,
        bias,
        lightSize,
        slopeBias,
        driftBias
    );

    var finalVisibility = visibility;

    // 🌟 5. [언리얼 엔진 5 표준 캐스케이드 전환 블렌딩 (Cascade Transition Fraction = 0.20)]
    // 🚀 [32-Tap 폭풍 차단]: 현재 캐스케이드가 완전 햇빛(1.0)이면 다음 캐스케이드 샘플링 완전 스킵!
    if (cascadeIndex < cascadeCount - 1u) {
        let splitFar = shadowInfo.cascadeSplitDepths[cascadeIndex];
        let splitNear = select(systemUniforms.camera.nearClipping, shadowInfo.cascadeSplitDepths[cascadeIndex - 1u], cascadeIndex > 0u);
        let cascadeRange = splitFar - splitNear;
        let blendMargin = cascadeRange * 0.20;
        let blendStart = splitFar - blendMargin;

        if (viewDepth > blendStart && visibility < 0.9999) {
            let nextIndex = cascadeIndex + 1u;
            let nextLightVP = shadowInfo.cascadeLightViewProjectionMatrices[nextIndex];
            let nextWorldTexelSize = shadowInfo.cascadeTexelSizes[nextIndex];
            let nextBiasedPos = worldPosition + N * (0.5 + slopeBias * 1.5) * nextWorldTexelSize;

            let nextShadowCoord = getShadowCoord(nextBiasedPos, nextLightVP);
            let nextVis = sampleModernCascadeShadow(
                directionalShadowMap,
                directionalShadowMapSampler,
                nextIndex,
                nextShadowCoord,
                screenPos,
                oneOverTextureSize,
                bias,
                lightSize,
                slopeBias,
                driftBias
            );

            let blendFactor = smoothstep(0.0, 1.0, saturate((viewDepth - blendStart) / blendMargin));
            finalVisibility = mix(visibility, nextVis, blendFactor);
        }
    } else {
        // 6. 최외곽 15% 부드러운 페이드아웃 (하드 컷오프 방지)
        let fadeStart = maxShadowDist * 0.85;
        if (viewDepth > fadeStart) {
            let fadeFactor = smoothstep(0.0, 1.0, saturate((viewDepth - fadeStart) / (maxShadowDist - fadeStart)));
            finalVisibility = mix(finalVisibility, 1.0, fadeFactor);
        }
    }

    // 🌟 [언리얼 엔진 표준 Soft Horizon Terminator Fade]
    let horizonFade = smoothstep(-0.08, 0.08, nDotL);
    return finalVisibility * horizonFade;
}

