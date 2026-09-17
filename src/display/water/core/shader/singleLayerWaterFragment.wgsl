#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.tnb.getTBNFromVertexTangent;

#redgpu_include math.PI;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;

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
    causticsPadding: f32,

    enableSSR: u32,
    ssrMaxDistance: f32,
    ssrStepCount: u32,
    ssrThickness: f32,
};

// =============================================================================
// Phase 17: 수면 전용 스크린 공간 반사 (Screen Space Reflection - SSR)
// =============================================================================
fn calculateWaterSSR(
    startWorldPos: vec3<f32>,
    worldNormal: vec3<f32>,
    R: vec3<f32>,
    cameraNear: f32,
    cameraFar: f32
) -> vec4<f32> {
    if (uniforms.enableSSR == 0u || R.y <= 0.001) {
        return vec4<f32>(0.0);
    }

    let maxSteps = uniforms.ssrStepCount;
    if (maxSteps == 0u) {
        return vec4<f32>(0.0);
    }

    let maxDist = max(1.0, uniforms.ssrMaxDistance);
    let stepSize = maxDist / f32(maxSteps);
    let thickness = max(0.05, uniforms.ssrThickness);

    // 수면 자체와의 자가 교차(Self-intersection) 방지를 위해 법선 방향으로 미세 오프셋
    var currentPos = startWorldPos + worldNormal * 0.03;
    var hitUV = vec2<f32>(0.0);
    var hitFound = false;

    for (var i = 0u; i < maxSteps; i = i + 1u) {
        currentPos = currentPos + R * stepSize;

        // 월드 좌표 -> 클립 공간 -> NDC -> 스크린 UV
        let clipPos = systemUniforms.projection.projectionViewMatrix * vec4<f32>(currentPos, 1.0);
        if (clipPos.w <= 0.001) {
            break;
        }
        let ndc = clipPos.xyz / clipPos.w;
        let uv = vec2<f32>(ndc.x * 0.5 + 0.5, -ndc.y * 0.5 + 0.5);

        // 화면 경계 밖 또는 깊이 버퍼 범위 밖이면 추적 중단
        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0 || ndc.z < 0.0 || ndc.z > 1.0) {
            break;
        }

        // 1패스 불투명 오브젝트 Depth 로드
        let coord = vec2<i32>(uv * systemUniforms.resolution);
        let rawSceneDepth = textureLoad(renderPath1DepthTexture, coord, 0);

        // 하늘 영역(깊이 1.0 근처)은 교차 대상이 아니므로 계속 진행
        if (rawSceneDepth >= 0.9999) {
            continue;
        }

        // 수중 바닥 지형 배제: 샘플링된 오브젝트의 월드 Y 고도가 수면보다 아래이면 반사 대상에서 제외
        let ndcX = uv.x * 2.0 - 1.0;
        let ndcY = (1.0 - uv.y) * 2.0 - 1.0;
        let sceneH = systemUniforms.projection.inverseProjectionViewMatrix * vec4<f32>(ndcX, ndcY, rawSceneDepth, 1.0);
        let sceneWorldY = sceneH.y / max(1e-5, sceneH.w);

        if (sceneWorldY < startWorldPos.y + 0.05) {
            continue;
        }

        let linearSceneDepth = getLinearizeDepth(rawSceneDepth, cameraNear, cameraFar);
        let rayViewZ = -(systemUniforms.camera.viewMatrix * vec4<f32>(currentPos, 1.0)).z;
        let depthDiff = rayViewZ - linearSceneDepth;
        let effectiveThickness = max(stepSize * 1.5, thickness);

        // 교차 판정: 광선이 수면 위 오브젝트의 표면 뒤로 들어갔으며, 오브젝트 두께 허용치 이내일 때
        if (depthDiff > 0.0 && depthDiff < effectiveThickness) {
            hitUV = uv;
            hitFound = true;
            break;
        }
    }

    if (!hitFound) {
        return vec4<f32>(0.0);
    }

    // 화면 가장자리 페이드아웃 (화면 밖으로 나갈수록 부드럽게 감쇄)
    let edge = min(hitUV, vec2<f32>(1.0) - hitUV);
    let edgeFade = smoothstep(0.0, 0.05, min(edge.x, edge.y));

    // 광선 진행 거리에 따른 부드러운 거리 감쇄 (Distance Fade)
    let travelDist = length(currentPos - startWorldPos);
    let distFade = 1.0 - smoothstep(maxDist * 0.75, maxDist, travelDist);

    // 수평각 페이드 (완만한 반사각에서도 시원하게 뻗어나가도록 허용)
    let rayFade = clamp(R.y * 10.0, 0.0, 1.0);

    let totalWeight = edgeFade * distFade * rayFade;
    if (totalWeight <= 0.001) {
        return vec4<f32>(0.0);
    }

    // 거칠기(Roughness)에 따른 밉맵 블러 샘플링
    let maxMip = f32(textureNumLevels(renderPath1ResultTexture) - 1);
    let blurMip = clamp(uniforms.roughness * maxMip * 1.5, 0.0, maxMip);
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

    // -------------------------------------------------------------------------
    // [Step 1] 기하 및 선형 깊이 (Geometry & Depths)
    // -------------------------------------------------------------------------
    let screenUV = inputData.position.xy / systemUniforms.resolution;
    let pixelCoord = vec2<i32>(inputData.position.xy);
    let cameraNear = systemUniforms.camera.nearClipping;
    let cameraFar = systemUniforms.camera.farClipping;

    let rawSceneDepth = textureLoad(renderPath1DepthTexture, pixelCoord, 0);
    let linearSceneDepth = getLinearizeDepth(rawSceneDepth, cameraNear, cameraFar);
    let linearWaterDepth = getLinearizeDepth(inputData.position.z, cameraNear, cameraFar);
    let deltaDepth = max(0.0, linearSceneDepth - linearWaterDepth);

    let fadeDist = max(0.001, uniforms.depthFadeDistance);
    let depthFade = clamp(deltaDepth / fadeDist, 0.0, 1.0);

    // -------------------------------------------------------------------------
    // [Step 2] 듀얼 노멀 (RNM + sRGB 역보정 + 원거리 노멀 페이드)
    // -------------------------------------------------------------------------
    let timeSec = systemUniforms.time.time;

    // Layer 1: 주 너울 파도
    let windDirLen1 = length(uniforms.windDirection);
    let baseWindDir1 = select(vec2<f32>(1.0, 0.0), uniforms.windDirection / windDirLen1, windDirLen1 > 0.001);
    let waveUV1 = inputData.uv * uniforms.normalTiling + baseWindDir1 * (timeSec * uniforms.windSpeed);

    let rawSample1 = textureSample(normalTexture, normalTextureSampler, waveUV1).rgb;
    var rawXY1 = rawSample1.xy * 2.0 - 1.0;
    var tangentXY1 = rawXY1 * uniforms.normalScale;
    if (uniforms.invertNormalY1 == 1u) {
        tangentXY1.y = -tangentXY1.y;
    }
    let tangentZ1 = sqrt(max(0.001, 1.0 - dot(tangentXY1, tangentXY1)));
    var combinedTangentNormal = normalize(vec3<f32>(tangentXY1, tangentZ1));

    // Layer 2: 마이크로 잔물결 교차 파도
    if (uniforms.useNormalTexture2 > 0u) {
        let windDirLen2 = length(uniforms.windDirection2);
        let baseWindDir2 = select(vec2<f32>(-0.6, 0.8), uniforms.windDirection2 / windDirLen2, windDirLen2 > 0.001);
        let waveUV2 = inputData.uv * uniforms.normalTiling2 + baseWindDir2 * (timeSec * uniforms.windSpeed2);

        let rawSample2 = textureSample(normalDetailTexture, normalTextureSampler, waveUV2).rgb;
        var rawXY2 = rawSample2.xy * 2.0 - 1.0;
        var tangentXY2 = rawXY2 * uniforms.normalScale2;
        if (uniforms.invertNormalY2 == 1u) {
            tangentXY2.y = -tangentXY2.y;
        }
        let tangentZ2 = sqrt(max(0.001, 1.0 - dot(tangentXY2, tangentXY2)));
        let tangentNormal2 = normalize(vec3<f32>(tangentXY2, tangentZ2));

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

    let worldPos = inputData.vertexPosition;
    let V = normalize(systemUniforms.camera.cameraPosition - worldPos);

    // -------------------------------------------------------------------------
    // [Step 3] 물리 기반 스넬의 굴절 (PBR Snell's Refraction & Broken Straw)
    // -------------------------------------------------------------------------
    // 공기(1.0) -> 물(1.3333) 입사 굴절률 비율 eta = 1.0 / 1.3333 ≈ 0.750
    let etaRatio = 0.750;
    let incidentRay = -normalize(V);
    var refractedRay = refract(incidentRay, worldNormal, etaRatio);
    if (dot(refractedRay, refractedRay) < 0.01) {
        refractedRay = incidentRay;
    }

    // 1) 스넬 법칙에 의한 월드 광로 편향 벡터 (Snell Angular Deflection)
    let aspectRatio = systemUniforms.resolution.x / max(1.0, systemUniforms.resolution.y);
    let snellRayDeflection = refractedRay - incidentRay;
    let viewSnellDeflection = (systemUniforms.camera.viewMatrix * vec4<f32>(snellRayDeflection, 0.0)).xyz;
    // 종횡비(aspectRatio)를 반영하여 가로 방향 찢어짐 왜곡을 원천 방지하고 정방형 왜곡 비율 유지
    let snellScreenDir = vec2<f32>(viewSnellDeflection.x / aspectRatio, -viewSnellDeflection.y);

    // 2) 듀얼 파도 노멀에 의한 수면 표면 잔물결 섭동 (Wave Perturbation)
    let deltaWorldNormal = worldNormal - baseNormal;
    let viewDeltaNormal = (systemUniforms.camera.viewMatrix * vec4<f32>(deltaWorldNormal, 0.0)).xyz;
    let waveScreenDir = vec2<f32>(viewDeltaNormal.x / aspectRatio, -viewDeltaNormal.y);

    // 3) 수심(Delta Depth)에 비례하는 물리적 시차 변위 (Depth-dependent Parallax):
    // 수면 경계(depth=0)에서는 0에서 시작하여 연속성을 보장하고,
    // 수심이 깊어질수록 광선 굴절각에 비례하여 물속 물체(기둥/바닥)가 꺾여 보이는 Broken Straw 현상 구현
    let depthFactor = clamp(deltaDepth * 0.5, 0.0, 2.0);
    // 화면 하단(근경)에서 분모가 작아져 배율이 폭증하지 않도록 안정적인 원근 감쇄 적용
    let perspectiveScale = 1.0 / (1.0 + linearWaterDepth * 0.06);

    let edgeDist = min(screenUV, vec2<f32>(1.0) - screenUV);
    let screenEdgeFade = clamp(min(edgeDist.x, edgeDist.y) / 0.04, 0.0, 1.0);

    // 스넬 기하 꺾임(자연스러운 기둥 꺾임) + 파도 잔물결 굴절의 정밀 밸런싱
    // (일방향 스넬 쏠림으로 인한 화면 하단 늘어짐/스미어링 원천 방지)
    let safeSnell = clamp(snellScreenDir, vec2<f32>(-0.6), vec2<f32>(0.6));
    let combinedRefractScreen = (safeSnell * (depthFactor * 0.10) + waveScreenDir * (depthFactor * 0.35 + 0.65)) * perspectiveScale;

    // 최대 스크린 UV 변위 상한선(0.018)을 적용하여 화면 하단 및 외곽 텍스처 늘어짐 완벽 차단
    let unclampedOffset = combinedRefractScreen * (uniforms.refractionStrength * screenEdgeFade);
    let rawRefractionOffset = clamp(unclampedOffset, vec2<f32>(-0.018), vec2<f32>(0.018));

    // 소프트 블리딩 방지 (물 표면 앞쪽 수면 위 물체 왜곡 감쇄)
    let testUV = clamp(screenUV + rawRefractionOffset, vec2<f32>(0.001), vec2<f32>(0.999));
    let rawDistortedDepth = textureLoad(renderPath1DepthTexture, vec2<i32>(testUV * systemUniforms.resolution), 0);
    let linearDistortedDepth = getLinearizeDepth(rawDistortedDepth, cameraNear, cameraFar);
    let bleedWeight = clamp((linearDistortedDepth - linearWaterDepth) / 0.08, 0.0, 1.0);
    let finalRefractUV = clamp(screenUV + rawRefractionOffset * bleedWeight, vec2<f32>(0.001), vec2<f32>(0.999));

    // 굴절된 실제 바닥 씬 컬러 및 실제 광로 수심
    let sceneColor = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalRefractUV, 0.0).rgb;
    let rawFinalDepth = textureLoad(renderPath1DepthTexture, vec2<i32>(finalRefractUV * systemUniforms.resolution), 0);
    let linearFinalDepth = getLinearizeDepth(rawFinalDepth, cameraNear, cameraFar);
    let effectiveDeltaDepth = max(0.0, linearFinalDepth - linearWaterDepth);

    // -------------------------------------------------------------------------
    // [Step 4] 맑고 투명한 바닥 투과광 (Transmitted Ground with Beer-Lambert & Caustics)
    // -------------------------------------------------------------------------
    // 정통 비어-람베르트 지수 감쇄: 빛이 수심(effectiveDeltaDepth)을 통과하며 파장별로 흡수
    let extinction = exp(-effectiveDeltaDepth * uniforms.extinctionFactor);
    let waterAlbedo = mix(uniforms.baseColor, uniforms.deepColor, 1.0 - extinction);

    // 바닥 씬 투과율: 얕은 물가에서는 100% 원본 투과, 깊어질수록 물 흡수 스펙트럼(waterAlbedo)에 비례하여 자연 감쇄
    let transmittedSceneColorFactor = mix(waterAlbedo, vec3<f32>(1.0), extinction) * extinction;
    var transmittedSceneColor = sceneColor * transmittedSceneColorFactor;

    // [Phase 14] 수중 바닥 햇살 일렁임 카우스틱스 (Underwater Caustics - 카메라 무빙 시 밉맵 블러 방지 & 월드 밀착)
    var causticIntensity = 0.0;
    if (uniforms.causticsStrength > 0.001) {
        // 태양광 입사각과 수심에 따른 안정적인 바닥 월드 위치 계산
        // (카메라 굴절 스크린 UV와 역투영에 의한 카메라 회전 슬라이딩 및 미분 폭발/모션블러 원천 방지)
        let primarySun = systemUniforms.directionalLights[0];
        let sunDir = -normalize(primarySun.direction);
        let lightRayOffset = sunDir.xz * (effectiveDeltaDepth * 0.22);
        let groundSurfacePos = worldPos.xz + lightRayOffset;
        let groundSurfaceUV = groundSurfacePos * (1.0 / 240.0) + vec2<f32>(0.5);

        let windDirLen2 = length(uniforms.windDirection2);
        let baseWindDir2 = select(vec2<f32>(-0.6, 0.8), uniforms.windDirection2 / windDirLen2, windDirLen2 > 0.001);

        let cSpeed = uniforms.causticsSpeed;
        let cScale = uniforms.causticsScale;

        // 수면 파도와 100% 동일한 공간 UV 및 바람 위상 매핑
        let cUV1 = groundSurfaceUV * (uniforms.normalTiling * cScale) + baseWindDir1 * (timeSec * uniforms.windSpeed * cSpeed);
        let cUV2 = groundSurfaceUV * (uniforms.normalTiling2 * cScale) + baseWindDir2 * (timeSec * uniforms.windSpeed2 * cSpeed);

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

        // 파도 노멀 텍스처의 실제 진폭(0.03~0.08)에 맞춘 고대비 파형 추출
        let waveA1 = (s1.x + s1.y) * 9.0;
        let waveA2 = (s2.x - s2.y) * 9.0;
        let waveB1 = (s1.x - s1.y) * 9.0;
        let waveB2 = (s2.x + s2.y) * 9.0;

        // 두 교차 파도의 등고선이 만나는 마루(Crest)에서 날카로운 다이아몬드 햇살 그물망 형성
        let crest1 = pow(max(0.0, 1.0 - abs(waveA1 - waveA2)), 3.5);
        let crest2 = pow(max(0.0, 1.0 - abs(waveB1 - waveB2)), 3.5);
        let causticCrest = max(crest1, crest2) * 2.2;

        // 수심에 따른 자연스러운 물리 감쇄 (물가 경계 클리핑 방지 및 심해 자연 소멸)
        let causticsDepthFade = exp(-effectiveDeltaDepth * 0.35) * smoothstep(0.01, 0.15, effectiveDeltaDepth);
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
    let preExposure = systemUniforms.preExposure;
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
    let ssrResult = calculateWaterSSR(worldPos, worldNormal, R, cameraNear, cameraFar);
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
    let effectiveRoughness = clamp(sqrt(uniforms.roughness * uniforms.roughness + 0.003), 0.03, 1.0);

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

        let depthScatterWeight = pow(1.0 - extinction, 2.0); // 얕은 물가에서 0으로 급격히 수렴
        let volumeInScattering = finalLightColor * (sunTransmittance * cosThetaT * depthScatterWeight * 0.30);

        // [C] 저고도 역광 파도 능선 투과 산란
        let VdotL = dot(V, L);
        let lowSunFactor = clamp(1.0 - max(L.y, 0.0), 0.0, 1.0);
        let forwardScatter = max(0.0, -VdotL);
        let waveTranslucency = pow(forwardScatter, 3.0) * (1.0 - NdotL * 0.5) * depthScatterWeight;
        let subsurfaceScattering = finalLightColor * (waveTranslucency * lowSunFactor * sunTransmittance * 0.25);

        directWaterScattering = directWaterScattering + (volumeInScattering + subsurfaceScattering) * waterAlbedo;
    }

    // -------------------------------------------------------------------------
    // [Step 7] UE5 SingleLayerWater 표준 물리 믹싱 (Clean PBR Blending)
    // -------------------------------------------------------------------------
    // 얕은 물가에서 허연 안개처럼 끼지 않도록 depthScatterWeight(제곱) 적용
    let depthScatterWeight = pow(1.0 - extinction, 2.0);
    let diffuseFresnel = uniforms.fresnelF0 + (1.0 - uniforms.fresnelF0) * 0.06; // 물(IOR 1.333) 반구 적분 평균 반사율
    let skyTransmittance = max(0.0, 1.0 - diffuseFresnel);
    let skyVolumeScatter = skyDiffuseIrradiance * skyTransmittance * waterAlbedo * depthScatterWeight * 0.35;

    let baseAmbient = systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * preExposure;
    let ambientInScattering = baseAmbient * 1.5 * waterAlbedo * depthScatterWeight;
    let waterScattering = directWaterScattering + ambientInScattering + skyVolumeScatter;

    // [UE5 SingleLayerWater 표준 에너지 보존 결합 (PBR Energy Conservation)]:
    // 1) 바닥 투과광은 물에 잠긴 바닥에 직접 맺히므로, 초미세 해안선(수심 4cm 이내)에서 지형 원본과 부드럽게 융합
    let groundDepthFade = smoothstep(0.005, 0.04, deltaDepth);
    let blendedGround = mix(sceneColor, transmittedSceneColor, groundDepthFade);

    // 2) 수면을 뚫고 밖으로 나오는 총 투과광: (바닥 투과광 + 수체 체적 산란광) × (1.0 - fresnel)
    let totalTransmittedLight = (blendedGround + waterScattering) * (1.0 - fresnel);

    // 3) 수면 표면에서 반사되는 총 반사광: (Skybox/SSR 환경 반사광) × fresnel + 직사 스펙큘러 다이아몬드 윤슬
    let totalReflectedLight = skyReflectionColor * fresnel + directSpecularColor;

    // 4) 완전한 PBR 수체 광학 결합 (에너지 보존 합 1.0 보장)
    let fullWaterColor = totalTransmittedLight + totalReflectedLight;

    // 5) 해안선 접합부 소프트 감쇄: 수심이 0(해안선)에 도달할 때 칼단면 없이 원래 씬 지형과 100% 매끄럽게 보간
    let softDepthFade = pow(depthFade, 0.85);
    let finalRgb = mix(sceneColor, fullWaterColor, softDepthFade);

    // -------------------------------------------------------------------------
    // [Step 8] 디버그 모드 0~13 완벽 일대일 매핑
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
            // Step 6.4: 비어-람베르트 광학 흡수 마스크 (0.0: 얕은 물가 투과 -> 1.0: 깊은 물 완전 흡수)
            output.color = vec4<f32>(vec3<f32>(1.0 - extinction), 1.0);
        }
        case 6u: {
            // Step 5.2: Scene Color Passthrough (투명 유리처럼 순수 바닥 씬 컬러 100% 무왜곡 투과)
            output.color = vec4<f32>(sceneColor, 1.0);
        }
        case 5u: {
            // Step 4.2: Depth Fade 가중치 마스크 (0.0 검은색 -> 1.0 흰색)
            output.color = vec4<f32>(vec3<f32>(depthFade), 1.0);
        }
        case 4u: {
            // Step 3.4: Delta Depth 수심 마스크
            let mask = clamp(deltaDepth / maxDepth, 0.0, 1.0);
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
