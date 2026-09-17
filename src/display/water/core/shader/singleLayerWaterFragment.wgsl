#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.tnb.getTBNFromVertexTangent;

#redgpu_include math.PI;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;
#redgpu_include math.getInterleavedGradientNoise;
#redgpu_include math.reconstruct.getWorldPositionFromDepth;

// =============================================================================
// Cook-Torrance GGX 마이크로패싯 함수군 (PBR Specular BRDF)
// =============================================================================
fn getSpecularNDF(NdotH: f32, roughness: f32) -> f32 {
    let alpha = max(0.002, roughness * roughness);
    let alpha2 = alpha * alpha;
    let NdotH2 = NdotH * NdotH;
    let denom = (NdotH2 * (alpha2 - 1.0) + 1.0);
    return (alpha2 * INV_PI) / max(EPSILON, denom * denom);
}

fn getSpecularVisibility(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
    let alpha = max(0.002, roughness * roughness);
    let alpha2 = alpha * alpha;
    let safeNdotV = max(NdotV, 1e-4);
    let safeNdotL = max(NdotL, 1e-4);
    let oneMinusAlpha2 = 1.0 - alpha2;
    let GGXV = safeNdotL * sqrt(safeNdotV * safeNdotV * oneMinusAlpha2 + alpha2);
    let GGXL = safeNdotV * sqrt(safeNdotL * safeNdotL * oneMinusAlpha2 + alpha2);
    return 0.5 / max(GGXV + GGXL, EPSILON);
}

fn getSpecularFresnel(VdotH: f32, F0: f32) -> f32 {
    let f = clamp(1.0 - VdotH, 0.0, 1.0);
    let f2 = f * f;
    return F0 + (1.0 - F0) * (f2 * f2 * f);
}

// Colin Barré-Brisebois & Stephen Hill (2012) Reoriented Normal Mapping
fn blendRNM(n1: vec3<f32>, n2: vec3<f32>) -> vec3<f32> {
    let t = n1 + vec3<f32>(0.0, 0.0, 1.0);
    let u = n2 * vec3<f32>(-1.0, -1.0, 1.0);
    return normalize(t * dot(t, u) - u * t.z);
}

// =============================================================================
// 수체 머티리얼 유니폼 구조체 (바이너리 레이아웃 100% 호환)
// =============================================================================
struct WaterUniforms {
    baseColor: vec3<f32>,
    opacity: f32,

    deepColor: vec3<f32>,
    refractionStrength: f32,

    windDirection: vec2<f32>,
    normalScale: f32,
    normalTiling: f32,

    windSpeed: f32,
    extinctionFactor: f32,
    depthFadeDistance: f32,
    debugMaxDepth: f32,

    debugMode: u32,
    normalScale2: f32,
    normalTiling2: f32,
    windSpeed2: f32,

    windDirection2: vec2<f32>,
    useNormalTexture2: u32,
    roughness: f32,

    specularFactor: f32,
    fresnelF0: f32,
    invertNormalY1: u32,
    invertNormalY2: u32,

    causticsStrength: f32,
    causticsScale: f32,
    causticsSpeed: f32,
    lakeWorldSize: f32,

    enableSSR: u32,
    ssrMaxDistance: f32,
    ssrStepCount: u32,
    ssrThickness: f32,

    turbidity: f32,
    _pad_turbidity1: f32,
    _pad_turbidity2: f32,
    _pad_turbidity3: f32,
};

// =============================================================================
// Phase 17: 수면 전용 스크린 공간 반사 (Screen Space Reflection - SSR) 및 투영 유틸리티
// =============================================================================
fn worldToScreen(worldPos: vec3<f32>) -> vec2<f32> {
    let clipPos = systemUniforms.projection.projectionViewMatrix * vec4<f32>(worldPos, 1.0);
    if (clipPos.w <= 0.001) {
        return vec2<f32>(-1.0);
    }
    let ndc = clipPos.xyz / clipPos.w;
    return vec2<f32>(ndc.x * 0.5 + 0.5, -ndc.y * 0.5 + 0.5);
}

fn calculateWaterSSR(
    startWorldPos: vec3<f32>,
    worldNormal: vec3<f32>,
    R: vec3<f32>,
    pixelCoord: vec2<i32>
) -> vec4<f32> {
    if (uniforms.enableSSR == 0u || R.y <= 0.001) {
        return vec4<f32>(0.0);
    }

    let maxSteps = uniforms.ssrStepCount;
    if (maxSteps == 0u) {
        return vec4<f32>(0.0);
    }

    let maxDist = max(1.0, uniforms.ssrMaxDistance);
    let baseStepSize = maxDist / f32(maxSteps);
    let thickness = max(0.05, uniforms.ssrThickness);
    let cameraWorldPos = systemUniforms.camera.cameraPosition;

    // IGN(Interleaved Gradient Noise)을 활용한 레이 마칭 시작점 지터링 (밴딩 제거 및 접촉면 연결)
    let jitter = getInterleavedGradientNoise(vec2<f32>(pixelCoord));

    // 수면 자체와의 자가 교차 방지를 위한 최소 오프셋 (수면 법선 방향 8mm)
    var currentWorldPos = startWorldPos + worldNormal * 0.008 + R * (baseStepSize * jitter);
    var currentStepSize = baseStepSize;
    var hitUV = vec2<f32>(0.0);
    var hitFound = false;
    var hitStep = 0u;
    var refinementLevel = 0u;
    let maxRefinementLevels = 4u;

    for (var i = 0u; i < maxSteps; i = i + 1u) {
        currentWorldPos = currentWorldPos + R * currentStepSize;

        // 최대 추적 거리 초과 시 종료
        let travelVec = currentWorldPos - startWorldPos;
        let travelDist = length(travelVec);
        if (travelDist > maxDist) {
            break;
        }

        // 월드 좌표 -> 스크린 UV 변환
        let currentScreenUV = worldToScreen(currentWorldPos);
        if (currentScreenUV.x < 0.0 || currentScreenUV.x > 1.0 || currentScreenUV.y < 0.0 || currentScreenUV.y > 1.0) {
            break;
        }

        // 1패스 불투명 오브젝트 Depth 로드
        let coord = vec2<i32>(currentScreenUV * systemUniforms.resolution);
        let rawSceneDepth = textureLoad(renderPath1DepthTexture, coord, 0);

        // 하늘 영역(깊이 0.9999 이상)은 교차 대상이 아니므로 계속 진행
        if (rawSceneDepth >= 0.9999) {
            continue;
        }

        // [정밀 월드 좌표 복원] RedGPU 표준 함수 getWorldPositionFromDepth 사용
        let sampledWorldPos = getWorldPositionFromDepth(currentScreenUV, rawSceneDepth, systemUniforms.projection.inverseProjectionViewMatrix);

        // [핵심 해결 1] 수면(startWorldPos.y) 아래에 있는 모든 해저/호수 바닥 지형 및 수중 물체는 100% 완전 배제!
        if (sampledWorldPos.y <= startWorldPos.y) {
            continue;
        }

        // [핵심 해결 2] 유클리드 3D 거리 비교 (카메라와 광선 위치 거리 - 카메라와 샘플링된 표면 거리)
        let rayDistanceFromCamera = length(currentWorldPos - cameraWorldPos);
        let surfaceDistanceFromCamera = length(sampledWorldPos - cameraWorldPos);
        let distanceDiff = rayDistanceFromCamera - surfaceDistanceFromCamera;

        // 적응형 두께 임계값 (원거리 허공이나 과도하게 두꺼운 배경 둑 관통 방지 및 얇은 기둥 포착)
        let effectiveThickness = max(thickness, currentStepSize * 2.2);

        // 교차 판정: 광선이 수면 위 오브젝트 표면 뒤로 들어갔으며, 허용 두께 이내일 때
        if (distanceDiff > 0.0 && distanceDiff < effectiveThickness) {
            // 이진 탐색 기법(Binary Refinement)으로 물체 접촉선 및 얇은 기둥 밀착 반사 정밀화
            if (refinementLevel < maxRefinementLevels) {
                currentWorldPos = currentWorldPos - R * currentStepSize;
                currentStepSize = currentStepSize * 0.5;
                refinementLevel = refinementLevel + 1u;
                continue;
            }

            hitUV = currentScreenUV;
            hitFound = true;
            hitStep = i;
            break;
        }
    }

    if (!hitFound) {
        return vec4<f32>(0.0);
    }

    // 화면 가장자리 페이드아웃 (화면 가장자리로 갈수록 부드럽게 감쇄)
    let edge = min(hitUV, vec2<f32>(1.0) - hitUV);
    let edgeFade = smoothstep(0.0, 0.08, min(edge.x, edge.y));

    // 광선 진행 거리(travelDist)에 따른 부드러운 거리 감쇄:
    // 수면 접촉부와 근거리 반사는 100% 선명하게 유지하고, 과도한 원거리 배경(둑/절벽)은 자연스럽게 페이드
    let finalTravelDist = length(currentWorldPos - startWorldPos);
    let distFade = 1.0 - smoothstep(maxDist * 0.35, maxDist * 0.90, finalTravelDist);

    // 스텝 수 감쇄: 마지막 10% 한계 구간에서만 부드럽게 페이드아웃 (스텝 수에 따른 계단식 찌꺼기/밝기 널뛰기 방지)
    let stepFade = smoothstep(0.0, 0.12, 1.0 - f32(hitStep) / f32(maxSteps));

    // 수평각 페이드 (완만한 반사각에서도 시원하게 뻗어나가도록 허용)
    let rayFade = clamp(R.y * 12.0, 0.0, 1.0);

    let totalWeight = edgeFade * distFade * stepFade * rayFade;
    if (totalWeight <= 0.001) {
        return vec4<f32>(0.0);
    }

    // 거칠기(Roughness) 및 수면 미세 분산에 따른 적응형 밉맵 블러 샘플링 (1픽셀 노이즈/파편화 방지)
    let maxMip = f32(textureNumLevels(renderPath1ResultTexture) - 1);
    let blurMip = clamp((uniforms.roughness * 1.5 + 0.04) * maxMip, 0.0, maxMip);
    let hitColor = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, hitUV, blurMip).rgb;

    return vec4<f32>(hitColor, totalWeight);
}


@group(2) @binding(0) var<uniform> uniforms: WaterUniforms;
@group(2) @binding(1) var normalTextureSampler: sampler;
@group(2) @binding(2) var normalTexture: texture_2d<f32>;
@group(2) @binding(3) var normalDetailTexture: texture_2d<f32>;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) vertexTangent: vec4<f32>,
    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(11) combinedOpacity: f32,
    @location(14) @interpolate(flat) receiveShadow: f32,
};

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    let preExposure = systemUniforms.preExposure;

    // -------------------------------------------------------------------------
    // [Step 1] 기하 및 기준 3D 월드 깊이 복원 (Geometry & World Depths)
    // -------------------------------------------------------------------------
    let screenUV = inputData.position.xy / systemUniforms.resolution;
    let pixelCoord = vec2<i32>(inputData.position.xy);
    let cameraNear = systemUniforms.camera.nearClipping;
    let cameraFar = systemUniforms.camera.farClipping;
    let worldPos = inputData.vertexPosition;

    let rawSceneDepth = textureLoad(renderPath1DepthTexture, pixelCoord, 0);
    let linearSceneDepth = getLinearizeDepth(rawSceneDepth, cameraNear, cameraFar);
    let linearWaterDepth = getLinearizeDepth(inputData.position.z, cameraNear, cameraFar);

    // [SSR 파이프라인 100% 일치] RedGPU 표준 함수로 1패스 Depth로부터 원래 바닥의 실제 3D 월드 좌표 복원
    let initialGroundWorldPos = getWorldPositionFromDepth(screenUV, rawSceneDepth, systemUniforms.projection.inverseProjectionViewMatrix);
    // 순수 물리 수직 수심 (카메라 각도/FOV와 무관한 실제 지형 높이차)
    let initialVerticalDepth = max(0.0, worldPos.y - initialGroundWorldPos.y);
    // 실제 3D 유클리드 광로 거리 (빛이 수면에서 바닥까지 통과한 실제 유클리드 거리)
    let initialOpticalDistance = length(initialGroundWorldPos - worldPos);
    // 굴절 없는 원본 바닥 씬 컬러 (해안선 소프트 페이드 및 마른 지형 100% 무왜곡 접합용)
    let originalSceneColor = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, screenUV, 0.0).rgb;

    // 해안선 소프트 페이드: 카메라 시선 각도 왜곡 없이 실제 3D 광로 거리를 기준으로 균일하게 페이드
    let fadeDist = max(0.001, uniforms.depthFadeDistance);
    let depthFade = clamp(initialOpticalDistance / fadeDist, 0.0, 1.0);

    // -------------------------------------------------------------------------
    // [Step 2] 듀얼 노멀 (RNM + sRGB 역보정 + 원거리 노멀 페이드)
    // -------------------------------------------------------------------------
    let timeSec = systemUniforms.time.time;
    let V = normalize(systemUniforms.camera.cameraPosition - worldPos);

    // Layer 1: 주 너울 파도
    let windDirLen1 = length(uniforms.windDirection);
    let baseWindDir1 = select(vec2<f32>(1.0, 0.0), uniforms.windDirection / windDirLen1, windDirLen1 > 0.001);
    let waveUV1 = inputData.uv * uniforms.normalTiling + baseWindDir1 * (timeSec * uniforms.windSpeed);

    let rawSample1 = textureSample(normalTexture, normalTextureSampler, waveUV1).rgb;
    var rawXY1 = rawSample1.xy * 2.0 - 1.0;
    if (uniforms.invertNormalY1 == 1u) {
        rawXY1.y = -rawXY1.y;
    }
    let rawZ1 = max(0.01, rawSample1.z * 2.0 - 1.0);
    var combinedTangentNormal = normalize(vec3<f32>(rawXY1 * uniforms.normalScale, rawZ1));

    // Layer 2: 마이크로 잔물결 교차 파도
    if (uniforms.useNormalTexture2 > 0u) {
        let windDirLen2 = length(uniforms.windDirection2);
        let baseWindDir2 = select(vec2<f32>(-0.6, 0.8), uniforms.windDirection2 / windDirLen2, windDirLen2 > 0.001);
        let waveUV2 = inputData.uv * uniforms.normalTiling2 + baseWindDir2 * (timeSec * uniforms.windSpeed2);

        let rawSample2 = textureSample(normalDetailTexture, normalTextureSampler, waveUV2).rgb;
        var rawXY2 = rawSample2.xy * 2.0 - 1.0;
        if (uniforms.invertNormalY2 == 1u) {
            rawXY2.y = -rawXY2.y;
        }
        let rawZ2 = max(0.01, rawSample2.z * 2.0 - 1.0);
        let tangentNormal2 = normalize(vec3<f32>(rawXY2 * uniforms.normalScale2, rawZ2));

        combinedTangentNormal = blendRNM(combinedTangentNormal, tangentNormal2);
    }

    // [원거리 노멀 페이드 (Distance Normal Fade)]:
    // 근/중거리(35m 이내)에서는 생생한 파도 디테일을 유지하고, 원경(60m 이상)에서 매끄럽게 페이드하여 지글거림 방지
    let camDist = length(systemUniforms.camera.cameraPosition - inputData.vertexPosition);
    let distNormalFade = clamp((camDist - 35.0) / 45.0, 0.0, 0.85);
    combinedTangentNormal = normalize(mix(combinedTangentNormal, vec3<f32>(0.0, 0.0, 1.0), distNormalFade));

    let baseNormal = normalize(inputData.vertexNormal);
    let tbn = getTBNFromVertexTangent(baseNormal, inputData.vertexTangent);
    let worldNormal = normalize(tbn * combinedTangentNormal);

    // -------------------------------------------------------------------------
    // [Step 3] UE5 표준 뷰 공간 물리 스넬 굴절 (View-Space Physical Snell Refraction)
    // -------------------------------------------------------------------------
    // 1) 물리 상수: 공기(1.0) -> 물(1.33333) 입사 굴절률 비율
    let etaRatio = 1.0 / 1.33333; // ≈ 0.75006
    let incidentDir = -normalize(V);

    // 2) 평평한 기준 수면에서의 정적 스넬 굴절 각도 편향 (Broken Straw 기저 꺾임)
    var flatRefracted = refract(incidentDir, baseNormal, etaRatio);
    if (dot(flatRefracted, flatRefracted) < 0.01) {
        flatRefracted = incidentDir;
    }
    let flatDelta = flatRefracted - incidentDir;
    let viewSpaceFlatDelta = (systemUniforms.camera.viewMatrix * vec4<f32>(flatDelta, 0.0)).xy;

    // 3) 파도 곡률에 의한 동적 스넬 굴절 편향 (물결 일렁임)
    let deltaN = worldNormal - baseNormal;
    let viewSpaceDeltaN = (systemUniforms.camera.viewMatrix * vec4<f32>(deltaN, 0.0)).xy;

    // 4) 물리 스넬 광학 결합:
    //  - 기저 꺾임(Broken Straw): 평면 굴절 편향의 25% (화면 경계 이탈 없는 정밀 단축)
    //  - 파도 일렁임: 파도 법선 편향의 75%
    let combinedViewDelta = viewSpaceFlatDelta * 0.25 + viewSpaceDeltaN * 0.75;

    // 5) 수심(Depth) 및 카메라 거리(Distance) 기반 무차원 스크린 UV 오프셋 환산:
    //  - 수심 d를 통과할 때의 물리적 횡변위: Δx = d * (1.0 - 1.0/1.333) = d * 0.25
    //  - 화면 투영 각도: ΔUV = Δx / camDist
    let opticalDepth = clamp(initialOpticalDistance, 0.0, 3.5);
    let depthFactor = opticalDepth / max(1.0, camDist);
    let snellScale = 0.25 * uniforms.refractionStrength;

    // 화면 가장자리 안전 페이드 (화면 외곽 샘플링 아티팩트 방지)
    let edgeDist = min(screenUV, vec2<f32>(1.0) - screenUV);
    let screenEdgeFade = clamp(min(edgeDist.x, edgeDist.y) / 0.04, 0.0, 1.0);

    let rawRefractionOffset = vec2<f32>(combinedViewDelta.x, -combinedViewDelta.y) * (depthFactor * snellScale * screenEdgeFade);

    // 소프트 블리딩 방지 (물 표면 앞쪽 수면 위 물체 왜곡 감쇄)
    let testUV = clamp(screenUV + rawRefractionOffset, vec2<f32>(0.001), vec2<f32>(0.999));
    let rawDistortedDepth = textureLoad(renderPath1DepthTexture, vec2<i32>(testUV * systemUniforms.resolution), 0);
    let linearDistortedDepth = getLinearizeDepth(rawDistortedDepth, cameraNear, cameraFar);
    let bleedWeight = clamp((linearDistortedDepth - linearWaterDepth) / 0.08, 0.0, 1.0);
    let finalRefractUV = clamp(screenUV + rawRefractionOffset * bleedWeight, vec2<f32>(0.001), vec2<f32>(0.999));

    // 굴절된 바닥의 실제 3D 월드 좌표 복원 (RedGPU 표준 함수 getWorldPositionFromDepth 사용)
    let rawFinalDepth = textureLoad(renderPath1DepthTexture, vec2<i32>(finalRefractUV * systemUniforms.resolution), 0);
    let refractedGroundWorldPos = getWorldPositionFromDepth(finalRefractUV, rawFinalDepth, systemUniforms.projection.inverseProjectionViewMatrix);
    let effectiveVerticalDepth = max(0.0, worldPos.y - refractedGroundWorldPos.y); // 순수 수직 수심 (m)
    let effectiveOpticalDistance = length(refractedGroundWorldPos - worldPos); // 실제 3D 유클리드 광로 거리 (m)

    // [수심 및 탁도 기반 수중 산란 밉맵 블러 (Forward Multi-Scatter Blur)]
    // 얕은 물가는 0.0 밉으로 선명하게 투과되고, 깊은 수심 및 탁도가 높을수록 윤곽이 부드럽게 감싸임
    // 대형 지형에서 픽셀 계단화 방지를 위해 최대 안전 밉 레벨(3.0) 제한 적용
    let maxSceneMip = f32(textureNumLevels(renderPath1ResultTexture) - 1);
    let maxSafeBlurMip = min(3.0, maxSceneMip);
    let scatterBlur = clamp(effectiveOpticalDistance * 0.02 + uniforms.turbidity * 1.5, 0.0, maxSafeBlurMip);
    let sceneColor = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalRefractUV, scatterBlur).rgb;

    // -------------------------------------------------------------------------
    // [Step 4] 맑고 투명한 바닥 투과광 (Transmitted Ground with Wavelength Beer-Lambert & Water Fog)
    // -------------------------------------------------------------------------
    // [과제 3: 담수 유기물 탁도 및 다중 파장 비어-람베르트 광학 (Jerlov II/III 담수 모델)]
    // 1) 파장별 차등 흡수 계수:
    //  - Red(650nm): 물 분자의 진동 흡수로 가장 빠르게 소멸 (기본 배수 2.4)
    //  - Green(530nm): 담수 미세 조류/식물성 플랑크톤으로 인해 가장 멀리 도달 (기본 배수 0.7)
    //  - Blue(460nm): 부유 유기물(Gelbstoff/휴믹산) 탁도에 비례하여 흡수율 증가 (기본 배수 1.1 + turbidity * 0.9)
    let baseExt = max(0.001, uniforms.extinctionFactor);
    let turbidityCoeff = clamp(uniforms.turbidity, 0.0, 1.0);
    let wavelengthExt = vec3<f32>(
        baseExt * 2.4,
        baseExt * 0.7,
        baseExt * (1.1 + turbidityCoeff * 0.9)
    );
    // [물리 법칙 100% 일치] 빛이 수체를 실제로 통과한 3D 유클리드 광로 거리(effectiveOpticalDistance)를 기준으로 지수 흡수
    let extinctionRGB = exp(-effectiveOpticalDistance * wavelengthExt);
    let meanExtinction = dot(extinctionRGB, vec3<f32>(0.299, 0.587, 0.114)); // 인지 휘도 기반 평균 투과율

    // 수심에 따른 물의 물리 알베도 전이 (얕은 곳 baseColor -> 심연 deepColor)
    let depthProgress = clamp(1.0 - meanExtinction, 0.0, 1.0);
    let waterAlbedo = mix(uniforms.baseColor, uniforms.deepColor, depthProgress);

    // [수중 체적 안개 (Underwater Volume Fog)]:
    // 청정수(turbidity -> 0)일 때는 맑고 투명하게 바닥이 비치며, 탁도가 존재할 때만 부드럽게 체적 산란 안개 형성
    let fogDensity = turbidityCoeff * 0.85;
    let waterFogFactor = (vec3<f32>(1.0) - extinctionRGB) * fogDensity;
    let waterFogColor = mix(uniforms.baseColor * 0.6, uniforms.deepColor, depthProgress);

    // 바닥 투과광: 파장별 비어-람베르트 투과 + 수중 체적 포그 융합
    let directGroundTransmittance = extinctionRGB;
    var transmittedSceneColor = sceneColor * directGroundTransmittance + waterFogColor * (waterFogFactor * 0.15);

    // [Phase 14] 수중 바닥 햇살 일렁임 카우스틱스 (Underwater Caustics - 카메라 무빙 시 밉맵 블러 방지 & 월드 밀착)
    var causticIntensity = 0.0;
    if (uniforms.causticsStrength > 0.001) {
        // 태양광은 수직으로 바닥에 도달하므로 순수 수직 수심(effectiveVerticalDepth)을 사용하여 정확한 지형 밀착 계산
        let primarySun = systemUniforms.directionalLights[0];
        let sunDir = -normalize(primarySun.direction);
        let lightRayOffset = sunDir.xz * (effectiveVerticalDepth * 0.22);
        let groundSurfacePos = worldPos.xz + lightRayOffset;
        let lakeSize = max(1.0, uniforms.lakeWorldSize);
        let groundSurfaceUV = groundSurfacePos * (1.0 / lakeSize) + vec2<f32>(0.5);

        let windDirLen2 = length(uniforms.windDirection2);
        let baseWindDir2 = select(vec2<f32>(-0.6, 0.8), uniforms.windDirection2 / windDirLen2, windDirLen2 > 0.001);

        // [월드 미터 독립적 카우스틱스 매핑]:
        // lakeWorldSize와 무관하게 실제 월드 미터(1.5~2.5m) 주기로 촘촘한 다이아몬드 햇살망 형성 (거대 얼룩 찌꺼기 방지)
        let invCScale = 1.0 / max(0.01, uniforms.causticsScale);
        let cWorldScale = 0.35 * invCScale;
        let cSpeed = uniforms.causticsSpeed;
        let cUV1 = groundSurfacePos * cWorldScale + baseWindDir1 * (timeSec * uniforms.windSpeed * cSpeed);
        let cUV2 = groundSurfacePos * (cWorldScale * 1.8) + baseWindDir2 * (timeSec * uniforms.windSpeed2 * cSpeed);

        // [핵심 해결] textureSampleLevel을 사용하여 카메라 회전 시 화면 미분(ddx/ddy) 폭발로 인한 밉맵 강제 블러(모션블러 현상) 원천 차단
        let causticMip = clamp((camDist - 30.0) / 40.0, 0.0, 1.2);
        let rawN1 = (textureSampleLevel(normalTexture, normalTextureSampler, cUV1, causticMip).rgb * 2.0 - 1.0).xy;
        let rawN2 = (textureSampleLevel(normalDetailTexture, normalTextureSampler, cUV2, causticMip).rgb * 2.0 - 1.0).xy;

        // 상호 섭동 왜곡: 제2 노멀로 제1 노멀 UV를 굴절시키고, 제1 노멀로 제2 노멀 UV를 굴절
        let distortUV1 = cUV1 + rawN2 * 0.18;
        let distortUV2 = cUV2 + rawN1 * 0.18;

        // 2차 왜곡 샘플링 (일정하고 날카로운 선명도 보장)
        let s1 = (textureSampleLevel(normalTexture, normalTextureSampler, distortUV1, causticMip).rgb * 2.0 - 1.0).xy;
        let s2 = (textureSampleLevel(normalDetailTexture, normalTextureSampler, distortUV2, causticMip).rgb * 2.0 - 1.0).xy;

        // 파도 노멀 텍스처에서 부드러운 다이아몬드 물결 격자 파형 추출 (지렁이/찌꺼기 선 방지)
        let waveA1 = (s1.x + s1.y) * 5.0;
        let waveA2 = (s2.x - s2.y) * 5.0;
        let waveB1 = (s1.x - s1.y) * 5.0;
        let waveB2 = (s2.x + s2.y) * 5.0;

        // 두 교차 파도의 등고선이 만나는 마루(Crest)를 부드러운 smoothstep 곡선으로 생성
        let dWave1 = clamp(abs(waveA1 - waveA2), 0.0, 1.0);
        let dWave2 = clamp(abs(waveB1 - waveB2), 0.0, 1.0);
        let crest1 = smoothstep(0.85, 0.0, dWave1);
        let crest2 = smoothstep(0.85, 0.0, dWave2);
        let causticCrest = (crest1 * crest1 + crest2 * crest2) * 0.9;

        // 수심에 따른 자연스러운 물리 감쇄 (수심 3m 이상에서는 깨끗하게 소멸하여 심해 얼룩 방지)
        let causticsDepthFade = exp(-effectiveVerticalDepth * 0.85) * smoothstep(0.02, 0.25, effectiveVerticalDepth);
        causticIntensity = causticCrest * uniforms.causticsStrength * causticsDepthFade;

        let sunFactor = clamp(sunDir.y * 1.5, 0.35, 1.0);
        let causticsColor = primarySun.color * (causticIntensity * sunFactor);

        // 바닥 씬 컬러에 곱해져 자연스럽게 바닥 텍스처를 밝혀주는 물리적 가산 합성
        transmittedSceneColor = transmittedSceneColor + sceneColor * causticsColor;
    }

    // -------------------------------------------------------------------------
    // [Step 5] 프레넬 및 간접 환경 반사 (Pure PBR Fresnel & Sky Reflection)
    // -------------------------------------------------------------------------
    // [정밀 물리 PBR 프레넬 (Lagarde 2014 / UE5 SingleLayerWater)]:
    // 수직각 F0(0.02) 엄격 보장 -> 바닥 98% 무왜곡 투과!
    let NdotV_pure = clamp(dot(baseNormal, V), 0.001, 1.0);
    let NdotV_wave = clamp(dot(worldNormal, V), 0.001, 1.0);
    let NdotV_effective = clamp(mix(NdotV_pure, NdotV_wave, 0.35), 0.001, 1.0);
    let oneMinusNdotV = 1.0 - NdotV_effective;
    let f90 = max(1.0 - uniforms.roughness, uniforms.fresnelF0);
    let fresnel = uniforms.fresnelF0 + (f90 - uniforms.fresnelF0) * (oneMinusNdotV * oneMinusNdotV * oneMinusNdotV * oneMinusNdotV * oneMinusNdotV);

    // 반사 벡터 R
    var R = reflect(-V, worldNormal);
    R.y = max(R.y, 0.005);
    R = normalize(R);

    // Skybox / IBL 큐브맵 반사광 및 확산 조도광
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;
    var rawSkyReflection = vec3<f32>(0.0);
    var skyDiffuseIrradiance = vec3<f32>(0.0);

    if (u_usePrefilterTexture) {
        let iblMipmapCount = f32(textureNumLevels(ibl_prefilterTexture) - 1);
        let effectiveRoughnessIBL = clamp(uniforms.roughness, 0.0, 1.0);
        let mipLevel = clamp(effectiveRoughnessIBL * iblMipmapCount, 0.0, iblMipmapCount);
        rawSkyReflection = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, R, mipLevel).rgb * preExposure * systemUniforms.iblIntensity;

        skyDiffuseIrradiance = textureSample(ibl_irradianceTexture, prefilterTextureSampler, worldNormal).rgb * preExposure * systemUniforms.iblIntensity;
    }
    if (u_useSkyAtmosphere) {
        let u_atmo = systemUniforms.skyAtmosphere;
        let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
        let atmoMipLevel = clamp(uniforms.roughness * atmoMipCount, 0.0, atmoMipCount);
        let atmoColor = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, R, atmoMipLevel).rgb * u_atmo.sunIntensity * preExposure;
        rawSkyReflection = rawSkyReflection + atmoColor;

        let atmoIrradiance = textureSample(atmosphereIrradianceLUT, atmosphereSampler, worldNormal).rgb * u_atmo.sunIntensity * preExposure;
        skyDiffuseIrradiance = skyDiffuseIrradiance + atmoIrradiance;
    }

    // [Phase 17] 스크린 공간 오브젝트 반사 (SSR) 연산 및 Skybox IBL 하이브리드 폴백 결합
    // SSR 전용 반사 벡터: 마이크로 노이즈로 인한 1픽셀 광선 발산(Ray Divergence & Speckle Hole)을 방지하고
    // 우아하고 연속적인 물결 데칼코마니 반사 기둥을 형성하도록 파도 노멀을 적응형 안정화
    let ssrWaveNormal = normalize(mix(baseNormal, worldNormal, 0.60));
    var ssrR = reflect(-V, ssrWaveNormal);
    ssrR.y = max(ssrR.y, 0.005);
    ssrR = normalize(ssrR);

    let ssrResult = calculateWaterSSR(worldPos, ssrWaveNormal, ssrR, pixelCoord);
    let blendedSkyReflection = mix(rawSkyReflection, ssrResult.rgb, ssrResult.a);
    let skyReflectionColor = blendedSkyReflection * uniforms.specularFactor;

    // -------------------------------------------------------------------------
    // [Step 6] 태양광 직사 조명 (Direct Specular & Volume In-Scattering)
    // -------------------------------------------------------------------------
    var directSpecularColor = vec3<f32>(0.0);
    var directWaterScattering = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    let N = worldNormal;
    let NdotL_base = clamp(dot(baseNormal, -normalize(u_directionalLights[0].direction)), 0.0, 1.0);
    let effectiveRoughness = clamp(sqrt(uniforms.roughness * uniforms.roughness + 0.003), 0.06, 1.0);

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let light = u_directionalLights[i];
        let L = -normalize(light.direction);
        let NdotL = max(dot(N, L), 0.0);
        let finalLightColor = light.color * light.intensity * preExposure;

        // [A] 직사 스펙큘러 다이아몬드 윤슬 기둥 (Sun Glitter Column)
        if (NdotL > 0.0) {
            let H = normalize(L + V);
            let NdotH = max(dot(N, H), 0.0);
            let VdotH = max(dot(V, H), 0.0);
            let F = getSpecularFresnel(VdotH, uniforms.fresnelF0);

            // 1) 샤프 다이아몬드 코어 윤슬 (Primary Sharp Glitter)
            let glitterSpecular = getSpecularNDF(NdotH, effectiveRoughness) * getSpecularVisibility(NdotV_effective, NdotL, effectiveRoughness);

            // 2) 일반 물리 PBR 스펙큘러 (Natural Wave Highlight)
            let pbrRoughness = clamp(uniforms.roughness + 0.08, 0.05, 0.60);
            let pbrSpecular = getSpecularNDF(NdotH, pbrRoughness) * getSpecularVisibility(NdotV_effective, NdotL, pbrRoughness);

            // 3) 파도 산란 스펙큘러 (과도한 백색 안개 유막을 유발하지 않도록 거칠기 및 가중치 정밀 제어)
            let waveRoughness = clamp(uniforms.roughness + 0.18, 0.12, 0.40);
            let waveSpecular = getSpecularNDF(NdotH, waveRoughness) * getSpecularVisibility(NdotV_effective, NdotL, waveRoughness);

            // 3개 로브(코어 윤슬 58% + 몸체 하이라이트 34% + 잔물결 산란 8% = 정규화 100%)
            let combinedSpec = (glitterSpecular * 0.58 + pbrSpecular * 0.34 + waveSpecular * 0.08) * F * uniforms.specularFactor;
            directSpecularColor = directSpecularColor + finalLightColor * (combinedSpec * NdotL);
        }

        // [B] 수중 복사 단일 산란 (얕은 물가에서는 0으로 완벽 감쇄하여 우윳빛 안개 방지)
        let cosThetaI = max(L.y, 0.0);
        let sin2ThetaT = (1.0 - cosThetaI * cosThetaI) * (1.0 / (1.333 * 1.333));
        let cosThetaT = sqrt(max(0.001, 1.0 - sin2ThetaT));
        let sunTransmittance = max(0.0, 1.0 - getSpecularFresnel(NdotL, uniforms.fresnelF0));

        let depthScatterWeight = pow(1.0 - meanExtinction, 2.0); // 얕은 물가에서 0으로 급격히 수렴
        let scatteringAlbedo = 0.26 + turbidityCoeff * 0.20; // 담수 유기물 탁도에 따른 체적 산란 증대
        let volumeInScattering = finalLightColor * (sunTransmittance * cosThetaT * depthScatterWeight * scatteringAlbedo);

        // [C] 저고도 역광 파도 능선 투과 산란 (전방 위상 전파)
        let VdotL = dot(V, L);
        let lowSunFactor = clamp(1.0 - max(L.y, 0.0), 0.0, 1.0);
        let forwardScatter = max(0.0, -VdotL);
        let waveTranslucency = pow(forwardScatter, 3.0) * (1.0 - NdotL * 0.5) * depthScatterWeight;
        let subsurfaceScattering = finalLightColor * (waveTranslucency * lowSunFactor * sunTransmittance * (scatteringAlbedo * 0.8));

        directWaterScattering = directWaterScattering + (volumeInScattering + subsurfaceScattering) * waterAlbedo;
    }

    // -------------------------------------------------------------------------
    // [Step 7] UE5 SingleLayerWater 표준 물리 믹싱 (Clean PBR Blending)
    // -------------------------------------------------------------------------
    let depthScatterWeight = pow(1.0 - meanExtinction, 2.0);
    let diffuseFresnel = uniforms.fresnelF0 + (1.0 - uniforms.fresnelF0) * 0.06; // 물(IOR 1.333) 반구 적분 평균 반사율
    let skyTransmittance = max(0.0, 1.0 - diffuseFresnel);
    let scatteringAlbedo = 0.26 + turbidityCoeff * 0.20;
    let skyVolumeScatter = skyDiffuseIrradiance * skyTransmittance * waterAlbedo * (depthScatterWeight * scatteringAlbedo * 0.15);

    let safeAmbientIntensity = min(100.0, systemUniforms.ambientLight.intensity);
    let baseAmbient = systemUniforms.ambientLight.color * (safeAmbientIntensity * preExposure);
    let ambientInScattering = baseAmbient * waterAlbedo * (depthScatterWeight * scatteringAlbedo * 0.03);
    let waterScattering = directWaterScattering * 0.5 + ambientInScattering + skyVolumeScatter;

    // [UE5 SingleLayerWater 표준 에너지 보존 결합 (PBR Energy Conservation)]:
    // 1) 수면을 뚫고 밖으로 나오는 총 투과광: (바닥 투과광 + 수체 체적 산란광) × (1.0 - fresnel)
    let totalTransmittedLight = (transmittedSceneColor + waterScattering) * (1.0 - fresnel);

    // 2) 수면 표면에서 반사되는 총 반사광: (Skybox/SSR 환경 반사광) × fresnel + 직사 스펙큘러 다이아몬드 윤슬
    let totalReflectedLight = skyReflectionColor * fresnel + directSpecularColor;

    // 3) 완전한 PBR 수체 광학 결합 (에너지 보존 합 1.0 보장)
    let fullWaterColor = totalTransmittedLight + totalReflectedLight;

    // 4) 해안선 접합부 소프트 감쇄: 원본 무왜곡 씬 컬러(originalSceneColor)와 100% 칼단면/지터 없이 부드럽게 융합
    let softDepthFade = pow(depthFade, 0.85);
    let finalRgb = mix(originalSceneColor, fullWaterColor, softDepthFade);

    // -------------------------------------------------------------------------
    // [Step 8] 디버그 모드 0~15 완벽 일대일 매핑
    // -------------------------------------------------------------------------
    let maxDepth = max(0.001, uniforms.debugMaxDepth);

    switch (uniforms.debugMode) {
        case 15u: {
            // Step 17.5: 스크린 공간 반사(SSR) 단독 뷰
            output.color = vec4<f32>(ssrResult.rgb * ssrResult.a, 1.0);
        }
        case 14u: {
            // Step 14.3: 수중 바닥 햇살 일렁임 카우스틱스(Caustics) 단독 뷰
            output.color = vec4<f32>(vec3<f32>(causticIntensity), 1.0);
        }
        case 13u: {
            // Step 11.4: 태양광 직사 스펙큘러 윤슬(Sun Glitter) 단독 뷰
            output.color = vec4<f32>(directSpecularColor, 1.0);
        }
        case 12u: {
            // Step 10.3: Skybox/IBL 환경 반사광 단독 뷰
            output.color = vec4<f32>(skyReflectionColor, 1.0);
        }
        case 11u: {
            // Step 10.2: Schlick Fresnel 반사율 마스크 (0.02 검정 -> 1.0 흰색)
            output.color = vec4<f32>(vec3<f32>(fresnel), 1.0);
        }
        case 10u: {
            // Step 7.5: 굴절 왜곡 오프셋 벡터 시각화 (중앙값 0.5 회색 기준)
            let actualOffset = finalRefractUV - screenUV;
            output.color = vec4<f32>(actualOffset * 50.0 + 0.5, 0.0, 1.0);
        }
        case 9u: {
            // Step 7.4: 월드 파도 법선 벡터 시각화
            output.color = vec4<f32>(worldNormal * 0.5 + 0.5, 1.0);
        }
        case 8u: {
            // Step 6.6: 수심별 물 고유 알베도 (Water Optical Albedo 단독 뷰)
            output.color = vec4<f32>(waterAlbedo, 1.0);
        }
        case 7u: {
            // Step 6.4: 비어-람베르트 파장별 광학 흡수 마스크 (RGB 파장별 흡수 시각화)
            output.color = vec4<f32>(vec3<f32>(1.0) - extinctionRGB, 1.0);
        }
        case 6u: {
            // Step 5.2: Scene Color Passthrough (투명 유리처럼 순수 바닥 씬 컬러 100% 무왜곡 투과)
            output.color = vec4<f32>(originalSceneColor, 1.0);
        }
        case 5u: {
            // Step 4.2: Depth Fade 가중치 마스크 (0.0 검은색 -> 1.0 흰색)
            output.color = vec4<f32>(vec3<f32>(depthFade), 1.0);
        }
        case 4u: {
            // Step 3.4: Vertical World Depth 실제 수직 수심 마스크
            let mask = clamp(effectiveVerticalDepth / maxDepth, 0.0, 1.0);
            output.color = vec4<f32>(vec3<f32>(mask), 1.0);
        }
        case 3u: {
            // Step 3.2: 물 표면 선형 거리
            let waterZ = clamp(linearWaterDepth / maxDepth, 0.0, 1.0);
            output.color = vec4<f32>(vec3<f32>(waterZ), 1.0);
        }
        case 2u: {
            // Step 3.3: 바닥 지형 선형 거리
            let sceneZ = clamp(linearSceneDepth / maxDepth, 0.0, 1.0);
            output.color = vec4<f32>(vec3<f32>(sceneZ), 1.0);
        }
        case 1u: {
            // Step 2: 비선형 원시 깊이 (Raw Depth)
            output.color = vec4<f32>(vec3<f32>(rawSceneDepth), 1.0);
        }
        default: {
            // Step 7.5: UE5 SingleLayerWater 물리 렌더링
            output.color = vec4<f32>(finalRgb, 1.0);
        }
    }

    return output;
}
