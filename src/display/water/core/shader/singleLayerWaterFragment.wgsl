#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.direction.getReflectionVectorFromViewDirection;
#redgpu_include math.tnb.getTBNFromVertexTangent;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;
#redgpu_include skyAtmosphere.skyAtmosphereFn;

struct WaterUniforms {
    baseColor: vec3<f32>,
    opacity: f32,

    deepColor: vec3<f32>,
    refractionStrength: f32,

    windDirection: vec2<f32>,
    normalScale: f32,
    normalTiling: f32,

    windSpeed: f32,
    roughness: f32,
    specularFactor: f32,
    depthFadeDistance: f32,

    extinctionFactor: f32,
    useNormalTexture2: f32,
    normalScale2: f32,
    normalTiling2: f32,
};

@group(2) @binding(0) var<uniform> uniforms: WaterUniforms;
@group(2) @binding(1) var normalTextureSampler: sampler;
@group(2) @binding(2) var normalTexture: texture_2d<f32>;
@group(2) @binding(3) var normalTexture2: texture_2d<f32>;

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

fn unpackTangentNormal(color: vec3<f32>) -> vec3<f32> {
    let xy = color.xy * 2.0 - 1.0;
    let z = sqrt(max(0.001, 1.0 - dot(xy, xy)));
    return vec3<f32>(xy, z);
}

fn blendRNM(n1: vec3<f32>, n2: vec3<f32>) -> vec3<f32> {
    let t = n1 + vec3<f32>(0.0, 0.0, 1.0);
    let u = vec3<f32>(-n2.x, -n2.y, n2.z);
    return normalize(t * dot(t, u) - u * t.z);
}

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;

    let timeSec = systemUniforms.time.time;
    let windDirLen = length(uniforms.windDirection);
    let baseWindDir = select(vec2<f32>(1.0, 0.0), uniforms.windDirection / windDirLen, windDirLen > 0.001);

    let uv1 = inputData.uv * (uniforms.normalTiling * 0.45) + baseWindDir * (timeSec * uniforms.windSpeed * 0.6);
    let rawN1 = textureSample(normalTexture, normalTextureSampler, uv1).rgb;
    let n1 = unpackTangentNormal(rawN1);

    let warpOffset = n1.xy * 0.035;

    let dir2 = vec2<f32>(baseWindDir.x * 0.7990425 - baseWindDir.y * 0.6012759, baseWindDir.x * 0.6012759 + baseWindDir.y * 0.7990425);
    let dir3 = vec2<f32>(baseWindDir.x * 0.6562413 + baseWindDir.y * 0.7545517, -baseWindDir.x * 0.7545517 + baseWindDir.y * 0.6562413);

    var blendedTangent: vec3<f32>;

    if (uniforms.useNormalTexture2 > 0.5) {
        let baseTiling2 = uniforms.normalTiling * uniforms.normalTiling2;
        let uv2 = inputData.uv * baseTiling2 + warpOffset * 0.35 + dir2 * (timeSec * uniforms.windSpeed * 1.35);
        let uv3 = inputData.uv * (baseTiling2 * 1.75) - warpOffset * 0.25 + dir3 * (timeSec * uniforms.windSpeed * 1.85);

        let rawN2 = textureSample(normalTexture2, normalTextureSampler, uv2).rgb;
        let rawN3 = textureSample(normalTexture2, normalTextureSampler, uv3).rgb;

        let n2 = unpackTangentNormal(rawN2);
        let n3 = unpackTangentNormal(rawN3);

        let microBlended = blendRNM(n2, n3 * vec3<f32>(0.65, 0.65, 1.0));

        let scaledN1 = vec3<f32>(n1.xy * uniforms.normalScale, n1.z);
        let scaledMicro = vec3<f32>(microBlended.xy * uniforms.normalScale2, microBlended.z);
        blendedTangent = blendRNM(scaledN1, scaledMicro);
    } else {
        let uv2 = inputData.uv * uniforms.normalTiling + warpOffset * 0.35 + dir2 * (timeSec * uniforms.windSpeed * 1.15);
        let uv3 = inputData.uv * (uniforms.normalTiling * 2.25) - warpOffset * 0.25 + dir3 * (timeSec * uniforms.windSpeed * 1.75);

        let rawN2 = textureSample(normalTexture, normalTextureSampler, uv2).rgb;
        let rawN3 = textureSample(normalTexture, normalTextureSampler, uv3).rgb;

        let n2 = unpackTangentNormal(rawN2);
        let n3 = unpackTangentNormal(rawN3);

        let n12 = blendRNM(n1, n2);
        let combined = blendRNM(n12, n3);
        blendedTangent = vec3<f32>(combined.xy * uniforms.normalScale, combined.z);
    }

    let camDistance = distance(systemUniforms.camera.cameraPosition, inputData.vertexPosition);
    let distanceFade = clamp(1.0 - smoothstep(300.0, 5000.0, camDistance), 0.0, 1.0);

    let baseNormal = normalize(inputData.vertexNormal);
    let tbn = getTBNFromVertexTangent(baseNormal, inputData.vertexTangent);

    let viewDir = normalize(systemUniforms.camera.cameraPosition - inputData.vertexPosition);
    let isUnderwater = systemUniforms.camera.cameraPosition.y < inputData.vertexPosition.y;

    var finalXY = blendedTangent.xy * distanceFade;
    let finalZ = sqrt(max(0.001, 1.0 - dot(finalXY, finalXY)));
    var worldNormal = normalize(tbn * vec3<f32>(finalXY, finalZ));
    worldNormal = select(worldNormal, -worldNormal, isUnderwater);

    let NdotV = max(dot(worldNormal, viewDir), 0.001);

    let F0 = vec3<f32>(0.02037);

    var specularLighting = vec3<f32>(0.0);
    var waterDiffuseLighting = vec3<f32>(0.0);
    var totalDirectReflectance = vec3<f32>(0.0);
    var maxSunRadiance = 0.0;
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    let baseRoughness = clamp(uniforms.roughness, 0.015, 1.0);
    let alpha = baseRoughness * baseRoughness;
    let alpha2 = max(0.0001, alpha * alpha);
    let oneMinusAlpha2 = 1.0 - alpha2;

    for (var i = 0u; i < u_directionalLightCount; i++) {
        let dirLight = u_directionalLights[i];
        let lightDir = -normalize(dirLight.direction);
        let NdotL = max(abs(dot(worldNormal, lightDir)), 0.0);

        if (NdotL > 0.0) {
            var lightRadiance = dirLight.color.rgb * (dirLight.intensity * systemUniforms.preExposure);
            maxSunRadiance = max(maxSunRadiance, max(lightRadiance.r, max(lightRadiance.g, lightRadiance.b)));

            if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
                let u_atmo = systemUniforms.skyAtmosphere;
                let surfaceHeightKm = max(0.0, inputData.vertexPosition.y / 1000.0);
                let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, lightDir.y, u_atmo.atmosphereHeight);
                lightRadiance *= atmosphereTransmittance;
            }

            let sunF1 = clamp(1.0 - max(dot(worldNormal, lightDir), 0.0), 0.0, 1.0);
            let sunF2 = sunF1 * sunF1;
            let sunF5 = sunF2 * sunF2 * sunF1;
            let sunFresnel = F0 + (vec3<f32>(1.0) - F0) * sunF5;
            let sunTransmittance = vec3<f32>(1.0) - sunFresnel;
            let sunGeoNdotL = clamp(dot(baseNormal, lightDir) * 0.7 + 0.3, 0.0, 1.0);
            let viewSunDot = dot(viewDir, -lightDir);
            let viewSunFactor = clamp(viewSunDot * 0.5 + 0.5, 0.0, 1.0);
            let forwardScatter = (viewSunFactor * viewSunFactor) * 0.5 + 0.5;
            let waterScatterContribution = lightRadiance * sunTransmittance * sunGeoNdotL * forwardScatter * 0.35;
            waterDiffuseLighting += waterScatterContribution;

            // 1. Brian Karis 태양 디스크 대표점 (각반경 약 0.53도 = 0.0092 라디안)
            let sunAngularRadius = 0.0092;
            let R_view = reflect(-viewDir, worldNormal);
            let RdotL = dot(R_view, lightDir);
            let safeRdotL = max(0.0, RdotL);
            let l_proj = lightDir * safeRdotL;
            let l_diff = R_view - l_proj;
            let l_diff_len = length(l_diff);
            let L_rep = select(lightDir, normalize(l_proj + l_diff * min(1.0, sunAngularRadius / max(0.0001, l_diff_len))), l_diff_len > 0.0001 && RdotL > 0.0);

            let halfDir = normalize(L_rep + viewDir);
            let NdotH = clamp(dot(worldNormal, halfDir), 0.0, 0.9999);
            let VdotH = clamp(dot(viewDir, halfDir), 0.0, 1.0);
            let NdotH2 = NdotH * NdotH;
            let safeNdotL = max(NdotL, 0.0001);
            let safeNdotV = max(NdotV, 0.0001);

            // 2. Schlick Fresnel (물 기본 반사율 F0 = 0.02037, 스침각 1.0)
            let F = F0 + (vec3<f32>(1.0) - F0) * pow(1.0 - VdotH, 5.0);

            // 3. 언리얼 엔진(UE5) 스타일 듀얼 로브 GGX (Dual-Lobe Cook-Torrance)
            // Lobe 1: 베이스 스펙큘러 로브 (부드러운 햇살 길목, r ~ 0.16)
            let rBase = clamp(uniforms.roughness * 1.5 + 0.12, 0.08, 0.45);
            let aBase = rBase * rBase;
            let aBase2 = aBase * aBase;
            let denomBase = NdotH2 * (aBase2 - 1.0) + 1.0;
            let dBase = aBase2 * INV_PI / max(0.0001, denomBase * denomBase);
            let vBase = 0.5 / max(0.0001, safeNdotL * sqrt(safeNdotV * safeNdotV * (1.0 - aBase2) + aBase2) + safeNdotV * sqrt(safeNdotL * safeNdotL * (1.0 - aBase2) + aBase2));
            let specBase = dBase * vBase;

            // Lobe 2: 샤프 글린트 로브 (파도 능선 초고해상도 다이아몬드 반짝임, r ~ 0.038)
            let rGlint = 0.038 + (1.0 - clamp(length(finalXY) * 2.5, 0.0, 1.0)) * 0.025;
            let aGlint = rGlint * rGlint;
            let aGlint2 = aGlint * aGlint;
            let denomGlint = NdotH2 * (aGlint2 - 1.0) + 1.0;
            let dGlint = aGlint2 * INV_PI / max(0.0001, denomGlint * denomGlint);
            let vGlint = 0.5 / max(0.0001, safeNdotL * sqrt(safeNdotV * safeNdotV * (1.0 - aGlint2) + aGlint2) + safeNdotV * sqrt(safeNdotL * safeNdotL * (1.0 - aGlint2) + aGlint2));
            let specGlint = dGlint * vGlint;

            // 4. 물리적 듀얼 로브 결합 및 태양 고휘도 게인 (물 반사율 2% 감쇄 극복)
            let dualLobe = specBase * 0.45 + specGlint * 0.55;
            var rawSpecBRDF = dualLobe * F * 18.0;

            // [안전 가드] 부동소수점 오버플로 및 정오 특이점(Infinity/NaN) 원천 차단
            rawSpecBRDF = min(rawSpecBRDF, vec3<f32>(300.0));

            // 언리얼 스타일 필름 소프트 롤오프 (모니터 화이트아웃 100% 방지)
            let totalSpecBRDF = rawSpecBRDF / (vec3<f32>(1.0) + rawSpecBRDF * 0.15);

            let directLightSpec = lightRadiance * totalSpecBRDF * uniforms.specularFactor * NdotL;
            specularLighting += directLightSpec;

            let directReflectance = clamp(totalSpecBRDF * uniforms.specularFactor * NdotL, vec3<f32>(0.0), vec3<f32>(1.0));
            totalDirectReflectance += directReflectance;
        }
    }

    let ambientRadiance = systemUniforms.ambientLight.color.rgb * (systemUniforms.ambientLight.intensity * systemUniforms.preExposure);
    waterDiffuseLighting += ambientRadiance * 0.1;

    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;
    let preExposure = systemUniforms.preExposure;

    // [정통 PBR 수면 반사 벡터]:
    // 인위적인 waveDamping(35%~12% 억압)과 abs()/0.08 고도각 왜곡을 완전히 걷어내고,
    // 파도 노멀에 의한 순수 반사 벡터를 계산합니다.
    // 파도 경사로 인해 수평면 아래(R.y < 0)로 파고드는 경우에만 최소한의 가드(R.y = 0.001)로
    // 큐브맵 하단 암부 샘플링을 방지하여 지평선과 완벽하게 이어지도록(Seamless) 처리합니다.
    var R = reflect(-viewDir, worldNormal);
    R.y = max(R.y, 0.001);
    R = normalize(R);

    let NdotV_IBL = max(dot(worldNormal, viewDir), 0.04);
    let iblRoughness = clamp(uniforms.roughness, 0.02, 1.0);

    var reflectedSky = vec3<f32>(0.0);
    var hasReflection = false;

    if (u_usePrefilterTexture) {
        let iblMipmapCount = f32(textureNumLevels(ibl_prefilterTexture) - 1);
        let mipLevel = iblRoughness * iblMipmapCount;
        let rawSkySample = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, R, mipLevel).rgb * preExposure * systemUniforms.iblIntensity;
        // [HDR 스펙큘러 소프트 세이프티]: HDR 피크의 영롱함은 보존하되 수면 전체가 하얗고 핑크빛으로 타버리는 과노출 방지
        let softSkySample = rawSkySample / (vec3<f32>(1.0) + rawSkySample * 0.08);
        let ambientSkyFloor = systemUniforms.ambientLight.color.rgb * (systemUniforms.ambientLight.intensity * systemUniforms.preExposure * 0.12);
        reflectedSky = max(softSkySample, ambientSkyFloor);
        hasReflection = true;
    }

    if (u_useSkyAtmosphere) {
        let u_atmo = systemUniforms.skyAtmosphere;
        let camH = u_atmo.cameraHeight;
        let atmH = u_atmo.atmosphereHeight;
        let skyIntensity = u_atmo.sunIntensity;

        let specTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, R.y, atmH);
        let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
        let atmoMipLevel = iblRoughness * atmoMipCount;
        let specSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, R, atmoMipLevel).rgb * skyIntensity * preExposure;
        reflectedSky = (reflectedSky * specTrans) + specSkyScat;
        hasReflection = true;
    }

    if (!hasReflection) {
        let ambRadiance = systemUniforms.ambientLight.color.rgb * (systemUniforms.ambientLight.intensity * systemUniforms.preExposure);
        let ambLen = length(ambRadiance);

        if (ambLen > 0.001) {
            let primarySunColor = select(vec3<f32>(1.0), u_directionalLights[0].color.rgb, u_directionalLightCount > 0u);
            let skyBase = systemUniforms.ambientLight.color.rgb;
            let skyZenith = skyBase * 1.1;
            let skyHorizon = mix(skyBase * 0.85, primarySunColor, 0.2);
            let skyGrad = mix(skyHorizon, skyZenith, clamp(R.y * 0.6 + 0.4, 0.0, 1.0));

            let safeSkyLum = clamp(ambLen * 0.45, 0.0, 1.5);
            reflectedSky = skyGrad * safeSkyLum;
        } else {
            // 앰비언트 라이트가 없으면 가상의 하늘빛을 임의로 생성하지 않고 순수 0으로 유지 (PBR 원칙 준수)
            reflectedSky = vec3<f32>(0.0);
        }
    }

    let envBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, clamp(vec2<f32>(NdotV_IBL, iblRoughness), vec2<f32>(0.005), vec2<f32>(0.995)), 0.0).rg;
    let energyCompensation = 1.0 + F0 * (1.0 / max(envBRDF.x + envBRDF.y, 1e-4) - 1.0);
    reflectedSky *= energyCompensation;


    // 🚀 [PBR 규격 F90 Schlick 프레넬]: 거칠기에 따른 grazing angle 반사율 감쇄 (에너지 보존)
    let safeRoughnessParam = clamp(uniforms.roughness, 0.0, 1.0);
    let F90 = max(vec3<f32>(1.0 - safeRoughnessParam * 0.8), F0);
    let iblF = clamp(1.0 - NdotV_IBL, 0.0, 1.0);
    let fresnelFactor = iblF * iblF * iblF * iblF * iblF;
    let F_dielectric = F0 + (F90 - F0) * fresnelFactor;
    let F_IBL = F_dielectric * envBRDF.x + envBRDF.y;

    // [에너지 분할 차폐]: 직사광 스펙큘러가 강한 영역에서 하늘 IBL 반사광의 중복 가산 방지
    let sunOcclusion = clamp(vec3<f32>(1.0) - totalDirectReflectance, vec3<f32>(0.0), vec3<f32>(1.0));
    let rawIblSpecular = reflectedSky * F_IBL * uniforms.specularFactor * sunOcclusion;
    // 수중에서 올려다볼 때는 공기 중 하늘 IBL 스펙큘러 차단
    let iblSpecular = select(rawIblSpecular, vec3<f32>(0.0), isUnderwater);

    // [하늘 IBL 확산 조도(Sky Irradiance)의 물속 투과 및 체적 산란광 융합]:
    // 직사광(태양)과 마찬가지로, 하늘 전체에서 쏟아지는 확산광 중
    // 수면에서 반사되지 않고 물속으로 굴절 진입한 에너지(1.0 - F_IBL)를 추출하여
    // 물의 고유 색상과 융합되는 수체 확산 산란광(waterDiffuseLighting)에 합산합니다.
    var iblIrradiance = vec3<f32>(0.0);
    if (u_usePrefilterTexture) {
        iblIrradiance = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, baseNormal, 0).rgb * preExposure * systemUniforms.iblIntensity;
    }
    if (u_useSkyAtmosphere) {
        let u_atmo = systemUniforms.skyAtmosphere;
        let skyIntensity = u_atmo.sunIntensity;
        let diffTrans = getTransmittance(transmittanceTexture, atmosphereSampler, u_atmo.cameraHeight, baseNormal.y, u_atmo.atmosphereHeight);
        let skyDiff = textureSampleLevel(atmosphereIrradianceLUT, atmosphereSampler, baseNormal, 0.0).rgb * skyIntensity * preExposure;
        iblIrradiance = (iblIrradiance * diffTrans) + skyDiff;
    }
    if (!u_usePrefilterTexture && !u_useSkyAtmosphere) {
        iblIrradiance = ambientRadiance * 0.5;
    }

    let iblTransmittance = clamp(vec3<f32>(1.0) - F_IBL, vec3<f32>(0.0), vec3<f32>(1.0));
    let iblWaterScatterContribution = iblIrradiance * iblTransmittance * 0.15;
    waterDiffuseLighting += iblWaterScatterContribution;

    let screenCoord = vec2<i32>(inputData.position.xy);
    let rawSceneDepth = textureLoad(renderPath1DepthTexture, screenCoord, 0);
    let cameraNear = systemUniforms.camera.nearClipping;
    let cameraFar = systemUniforms.camera.farClipping;
    let linearSceneDepth = getLinearizeDepth(rawSceneDepth, cameraNear, cameraFar);
    let linearWaterDepth = getLinearizeDepth(inputData.position.z, cameraNear, cameraFar);

    var effectiveWaterDepthDelta = max(linearSceneDepth - linearWaterDepth, 0.0);
    var depthFade = 1.0;
    if (isUnderwater) {
        effectiveWaterDepthDelta = distance(systemUniforms.camera.cameraPosition, inputData.vertexPosition);
        depthFade = 1.0;
    } else {
        if (uniforms.depthFadeDistance > 0.0) {
            depthFade = smoothstep(0.0, uniforms.depthFadeDistance, effectiveWaterDepthDelta);
        }
    }
    let screenUV = inputData.position.xy / systemUniforms.resolution;

    // ④ [순수 파도 섭동에 의한 굴절 왜곡 (Pure Perturbation Refraction)]:
    // 기하 기본 법선(baseNormal)을 제외한 순수 파도 요철 섭동(deltaNormal)만 뷰 공간으로 변환합니다.
    // 이를 통해 파도가 없는 평평한 수면에서는 왜곡이 정확히 0이 되어 물밑 지형이 한쪽으로 밀리지 않으며,
    // 파도가 칠 때만 파도의 능선과 골에 의해 자연스러운 일렁임이 발생합니다.
    let deltaWorldNormal = worldNormal - baseNormal;
    let viewDeltaNormal = (systemUniforms.camera.viewMatrix * vec4<f32>(deltaWorldNormal, 0.0)).xyz;

    // ⑥ [해안선 감쇄 단일화]: 중복된 shorelineFade를 제거하고 depthFade 하나로 통합 제어
    let effectiveRefractionStrength = uniforms.refractionStrength * depthFade;
    let refractionOffset = viewDeltaNormal.xy * effectiveRefractionStrength;

    var finalRefractUV = clamp(screenUV + refractionOffset, vec2<f32>(0.001), vec2<f32>(0.999));

    if (!isUnderwater) {
        let distortedScreenCoord = vec2<i32>(finalRefractUV * systemUniforms.resolution);
        let rawDistortedDepth = textureLoad(renderPath1DepthTexture, distortedScreenCoord, 0);
        let linearDistortedSceneDepth = getLinearizeDepth(rawDistortedDepth, cameraNear, cameraFar);

        // 하드 컷 대신 약간의 안전 여유 마진(Safety Depth Bias)을 두어 경계면 번쩍임 방지
        let depthSafetyThreshold = linearWaterDepth - 0.05;
        if (linearDistortedSceneDepth < depthSafetyThreshold) {
            finalRefractUV = screenUV;
        }
    }

    let backgroundRefractedColor = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalRefractUV, 0.0).rgb;

    // ② [정통 PBR 비어-람베르트(Beer-Lambert) 수중 흡수 및 산란 광학]:
    // 임의의 청록색 매직넘버 및 5중 믹스를 완전히 제거하고,
    // 빛이 물을 통과하며 거리에 따라 지수적으로 감쇄하는 비어-람베르트 법칙(exp(-d * sigma))을 적용합니다.
    let extinction = exp(-effectiveWaterDepthDelta * uniforms.extinctionFactor);
    let effectiveOpacity = uniforms.opacity * inputData.combinedOpacity;
    let maxAbsorption = select(1.0, 0.45, isUnderwater);
    let absorptionStrength = clamp((1.0 - extinction) * effectiveOpacity, 0.0, maxAbsorption);

    // 수심에 따라 얕은 물(baseColor)에서 깊은 물(deepColor)로 자연스럽게 전이
    let waterTargetColor = mix(uniforms.baseColor, uniforms.deepColor, 1.0 - extinction);
    // 물속 체적 산란광(waterDiffuseLighting)을 물 고유의 색상과 결합
    let waterScatteredTarget = waterTargetColor + waterDiffuseLighting * waterTargetColor;
    let waterBodyScattering = mix(backgroundRefractedColor, waterScatteredTarget, absorptionStrength);

    // ⑤ [엄격한 물리적 에너지 보존 (R + T <= 1.0)]:
    // 비물리적인 18% 강제 투과 주입을 제거하고,
    // 표면에서 반사되지 않은 에너지(1.0 - R)만이 수면 아래로 투과되도록 분할합니다.
    let totalSurfaceReflectance = clamp(totalDirectReflectance + F_IBL * uniforms.specularFactor * sunOcclusion, vec3<f32>(0.0), vec3<f32>(1.0));
    let baseTransmission = clamp(vec3<f32>(1.0) - totalSurfaceReflectance, vec3<f32>(0.0), vec3<f32>(1.0));
    let transmissionWeight = select(baseTransmission, vec3<f32>(0.85), isUnderwater);

    // 해안선(depthFade)과 물밑 체적 산란광 모두에 transmissionWeight를 일관되게 적용
    let effectiveUnderwaterColor = mix(backgroundRefractedColor, waterBodyScattering, depthFade);
    let transmittedUnderwater = effectiveUnderwaterColor * transmissionWeight;

    let totalSpecular = specularLighting + iblSpecular;
    let finalRgb = transmittedUnderwater + totalSpecular;

    output.color = vec4<f32>(finalRgb, 1.0);

    let safeRoughness = clamp(uniforms.roughness, 0.0, 1.0);
    let smoothness = 1.0 - safeRoughness;
    let smoothnessCurved = smoothness * smoothness * (3.0 - 2.0 * smoothness);
    let baseReflectionStrength = smoothnessCurved * 0.02037 * uniforms.specularFactor;
    output.gBufferNormal = vec4<f32>(worldNormal * 0.5 + 0.5, baseReflectionStrength);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);

    return output;
}
