#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.tnb.getTBNFromVertexTangent;

#redgpu_include math.PI;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;
#redgpu_include color.linearToSrgbVec3;

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
};

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
    let rawNormal1 = linearToSrgbVec3(rawSample1); // WebGPU sRGB 하드웨어 디코딩 완벽 상쇄
    var rawXY1 = rawNormal1.xy * 2.0 - 1.0;
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
        let rawNormal2 = linearToSrgbVec3(rawSample2);
        var rawXY2 = rawNormal2.xy * 2.0 - 1.0;
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

    // -------------------------------------------------------------------------
    // [Step 3] 스넬의 굴절 및 수심 블리딩 방지 (Refraction & Depth Bleed Guard)
    // -------------------------------------------------------------------------
    let deltaWorldNormal = worldNormal - baseNormal;
    let viewDeltaNormal = (systemUniforms.camera.viewMatrix * vec4<f32>(deltaWorldNormal, 0.0)).xyz;
    let viewScreenPerturb = vec2<f32>(viewDeltaNormal.x, -viewDeltaNormal.y);

    let edgeDist = min(screenUV, vec2<f32>(1.0) - screenUV);
    let screenEdgeFade = clamp(min(edgeDist.x, edgeDist.y) / 0.04, 0.0, 1.0);
    let rawRefractionOffset = viewScreenPerturb * (uniforms.refractionStrength * screenEdgeFade);

    // 소프트 블리딩 방지 (물 표면 앞쪽 물체 왜곡 감쇄)
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
    // [Step 4] 맑고 투명한 바닥 투과광 (Transmitted Ground with Beer-Lambert)
    // -------------------------------------------------------------------------
    let extinction = exp(-effectiveDeltaDepth * uniforms.extinctionFactor);
    let waterAlbedo = mix(uniforms.baseColor, uniforms.deepColor, 1.0 - extinction);

    // 바닥 지형이 수심에 따라 맑은 에메랄드 -> 깊은 남색으로 자연스럽게 착색
    let depthProgress = clamp(effectiveDeltaDepth * 0.30, 0.0, 1.0);
    let waterTint = mix(vec3<f32>(1.0), waterAlbedo * 1.25, depthProgress);
    let transmittedSceneColor = sceneColor * waterTint;

    // -------------------------------------------------------------------------
    // [Step 5] 프레넬 및 간접 환경 반사 (Pure PBR Fresnel & Sky Reflection)
    // -------------------------------------------------------------------------
    let worldPos = inputData.vertexPosition;
    let V = normalize(systemUniforms.camera.cameraPosition - worldPos);

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

    // [순수 물리 PBR 환경 반사광 (과노출 원천 방지)]:
    // 인위적인 글린트/방향성 뻥튀기 배율을 전면 제거하여, 어떤 HDR 노을/도시 큐브맵에서도 하얗게 타지 않음!
    let skyReflectionColor = rawSkyReflection * uniforms.specularFactor;

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

            let deltaN = N - baseNormal;
            let facetMultiplier = 1.0 + clamp(dot(deltaN, H) * 1.5, -0.15, 0.35);

            let combinedSpec = (glitterSpecular * 0.58 + pbrSpecular * 0.34 + waveSpecular * 0.08) * F * uniforms.specularFactor * facetMultiplier;
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

    // [UE5 표준 결합]:
    // 바닥 투과광과 수체 산란광을 하나의 수체(WaterBody)로 묶은 뒤,
    // 능선 글린트가 살아있는 하늘 반사광과 물리 프레넬로 정규화 mix() 교차 블렌딩!
    let waterBody = transmittedSceneColor + waterScattering;
    let reflectedWater = mix(waterBody, skyReflectionColor, fresnel);
    let shadedWater = reflectedWater + directSpecularColor;

    // [해안선 소프트 융합 (Depth Fade)]:
    let softDepthFade = pow(depthFade, 0.85);
    let finalRgb = mix(sceneColor, shadedWater, softDepthFade);

    // -------------------------------------------------------------------------
    // [Step 8] 디버그 모드 0~13 완벽 일대일 매핑
    // -------------------------------------------------------------------------
    let maxDepth = max(0.001, uniforms.debugMaxDepth);

    switch (uniforms.debugMode) {
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
