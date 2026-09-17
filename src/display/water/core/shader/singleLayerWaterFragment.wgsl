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
    // [트로코이드 호수 파도 곡률 변환 (Trochoidal Crest Sharpening)]:
    // 둥글둥글한 젤리 노이즈를 파도 골짜기(Trough)는 넓고 평평하게, 능선(Crest)은 얇고 샤프하게 모아줌
    let len1 = length(rawXY1);
    let trochoidXY1 = select(rawXY1, (rawXY1 / max(len1, 0.001)) * pow(len1, 1.35), len1 > 0.001);
    var tangentXY1 = trochoidXY1 * uniforms.normalScale;
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
        let len2 = length(rawXY2);
        let trochoidXY2 = select(rawXY2, (rawXY2 / max(len2, 0.001)) * pow(len2, 1.35), len2 > 0.001);
        var tangentXY2 = trochoidXY2 * uniforms.normalScale2;
        if (uniforms.invertNormalY2 == 1u) {
            tangentXY2.y = -tangentXY2.y;
        }
        let tangentZ2 = sqrt(max(0.001, 1.0 - dot(tangentXY2, tangentXY2)));
        let tangentNormal2 = normalize(vec3<f32>(tangentXY2, tangentZ2));

        combinedTangentNormal = blendRNM(combinedTangentNormal, tangentNormal2);
    }

    // [원거리 노멀 페이드 (Distance Normal Fade)]:
    // 근/중거리(45m 이내)에서는 생생한 파도 디테일을 100% 유지하고, 초원경(70m 이상)에서만 완만히 감쇄
    let camDist = length(systemUniforms.camera.cameraPosition - inputData.vertexPosition);
    let distNormalFade = clamp((camDist - 45.0) / 60.0, 0.0, 0.75);
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
    let bleedWeight = clamp((linearDistortedDepth - linearWaterDepth) / 0.05, 0.0, 1.0);
    let finalRefractUV = clamp(screenUV + rawRefractionOffset * bleedWeight, vec2<f32>(0.001), vec2<f32>(0.999));

    // 굴절된 실제 바닥 씬 컬러 및 실제 광로 수심
    let sceneColor = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalRefractUV, 0.0).rgb;
    let rawFinalDepth = textureLoad(renderPath1DepthTexture, vec2<i32>(finalRefractUV * systemUniforms.resolution), 0);
    let linearFinalDepth = getLinearizeDepth(rawFinalDepth, cameraNear, cameraFar);
    let effectiveDeltaDepth = max(0.0, linearFinalDepth - linearWaterDepth);

    // -------------------------------------------------------------------------
    // [Step 4] 맑고 투명한 바닥 투과광 및 수심별 자연스러운 착색 (Transmitted Ground)
    // -------------------------------------------------------------------------
    let extinction = exp(-effectiveDeltaDepth * uniforms.extinctionFactor);
    let waterAlbedo = mix(uniforms.baseColor, uniforms.deepColor, 1.0 - extinction);

    // [바닥 지형 밝기 온전 보존 및 수심별 광학 착색]:
    // 바닥 지형이 시커멓게 짓눌리지 않고 본래 밝기와 디테일 그대로 맑게 투과되며,
    // 수심에 따라 청명한 에메랄드 -> 깊은 라군 사파이어 톤으로 은은하고 화사하게 물듦
    let depthProgress = clamp(effectiveDeltaDepth * 0.25, 0.0, 1.0);
    let waterTint = mix(vec3<f32>(1.0), waterAlbedo * 1.35, depthProgress);
    let transmittedSceneColor = sceneColor * waterTint;

    // -------------------------------------------------------------------------
    // [Step 5] 프레넬 및 간접 환경 반사 (Fresnel & Sky Reflection)
    // -------------------------------------------------------------------------
    let worldPos = inputData.vertexPosition;
    let V = normalize(systemUniforms.camera.cameraPosition - worldPos);

    // [정밀 물리 PBR 프레넬 (Lagarde 2014 / UE5 SingleLayerWater)]:
    // 1. 수직으로 내려다볼 때(NdotV -> 1.0)는 물의 물리 상수 F0(0.02, 2%)로 수렴하여
    //    바닥 투과광(98%)이 온전히 보이고 표면 유막 반사를 완벽 차단.
    // 2. 파도 노멀의 입체 굴곡을 50% 적극 반영하여 파도 능선과 골짜기 사이에 선명한 반사 찰랑임 형성.
    // 3. 스침각(NdotV -> 0.0)에서는 거칠기에 따른 감쇄율 f90으로 자연스럽게 전이.
    let NdotV_pure = clamp(dot(baseNormal, V), 0.001, 1.0);
    let NdotV_wave = clamp(dot(worldNormal, V), 0.001, 1.0);
    let NdotV_effective = clamp(mix(NdotV_pure, NdotV_wave, 0.50), 0.001, 1.0);
    let oneMinusNdotV = 1.0 - NdotV_effective;
    let f90 = max(1.0 - uniforms.roughness, uniforms.fresnelF0);
    let fresnel = uniforms.fresnelF0 + (f90 - uniforms.fresnelF0) * (oneMinusNdotV * oneMinusNdotV * oneMinusNdotV * oneMinusNdotV * oneMinusNdotV);

    // [파도 능선 마이크로 글린트 및 입체 명암 (Wave Crest Glint & Dynamic Contrast)]:
    // 파도가 출렁이며 일렁이는 능선(Ridge/Crest)에서 하늘 반사광이 맑고 눈부시게 반짝이도록(Glint)
    // 파도 미세 요철의 경사도(Slope)와 시선 대향각을 결합하여 환하고 또렷한 수면 일렁임 형성!
    let wavePerturb = length(worldNormal.xz);
    let crestGlint = 1.0 + clamp(wavePerturb * 2.8, 0.0, 2.0); // 파도 능선 하이라이트 강화
    let waveFacing = clamp(dot(worldNormal, V) / max(NdotV_pure, 0.001), 0.85, 1.35);
    let waveDynamicHighlight = waveFacing * crestGlint;

    // 반사 벡터 R: 지평선 아래로 꺾인 광선만 수평선 높이로 부드럽게 보정
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
        // [하얀 기름막 방지]: 불필요한 인위적 밉맵 블러를 제거하여
        // 구름이 허연 페인트처럼 뭉개지는 유막 현상을 없애고 맑은 하늘 윤곽이 청명하게 비치도록 정규화
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

    // [IBL 역광/순광 방향성 조화 (Directional IBL Forward Glint & View Light Balance)]:
    // 1. 역광 반사(R이 태양/밝은 하늘을 향할 때: R dot L > 0):
    //    웹 큐브맵의 압축된 다이내믹 레인지를 보정하여, 파도 능선에 맺히는 하늘 반사를 눈부시게 쨍하게 부스팅.
    // 2. 순광 반사(태양을 등질 때: V dot L < 0):
    //    표면 반사를 차분하게 정돈하여 맑고 투명한 바닥 지형(자갈/모래)이 우선 투과되도록 조화.
    var iblDirectionalModifier = 1.0;
    if (systemUniforms.directionalLightCount > 0u) {
        let mainSunDir = -normalize(systemUniforms.directionalLights[0].direction);
        let RdotL = max(0.0, dot(R, mainSunDir));
        let VdotL = dot(V, mainSunDir);

        // 태양 및 밝은 하늘 반구 쪽을 향하는 반사광의 화사한 전방 글린트 부스팅
        let forwardReflectionBoost = 1.0 + pow(RdotL, 3.5) * 1.35;
        // 시점 역광(반사 강조) vs 순광(바닥 투과 강조) 밸런스
        let viewBalance = mix(0.88, 1.15, clamp(VdotL * 0.5 + 0.5, 0.0, 1.0));
        iblDirectionalModifier = forwardReflectionBoost * viewBalance;
    }

    // 환경 반사광에 파도 능선 글린트(Crest Glint) 및 IBL 역광/순광 방향성 밸런스 적용
    let skyReflectionColor = rawSkyReflection * (uniforms.specularFactor * waveDynamicHighlight * iblDirectionalModifier);

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
