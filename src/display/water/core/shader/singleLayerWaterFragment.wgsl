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

            let halfDir = normalize(lightDir + viewDir);
            let NdotH = max(dot(worldNormal, halfDir), 0.0);
            let VdotH = max(dot(viewDir, halfDir), 0.0);
            let NdotH2 = NdotH * NdotH;
            let safeNdotL = max(NdotL, 0.0001);

            let specF1 = clamp(1.0 - VdotH, 0.0, 1.0);
            let specF2 = specF1 * specF1;
            let specF5 = specF2 * specF2 * specF1;
            let F = F0 + (vec3<f32>(1.0) - F0) * specF5;

            let denom = NdotH2 * (alpha2 - 1.0) + 1.0;
            let D = alpha2 * INV_PI / max(EPSILON, denom * denom);
            let GGXV = safeNdotL * sqrt(NdotV * NdotV * oneMinusAlpha2 + alpha2);
            let GGXL = NdotV * sqrt(safeNdotL * safeNdotL * oneMinusAlpha2 + alpha2);
            let V = 0.5 / max(GGXV + GGXL, EPSILON);
            let specClean = D * V;

            let sunBaseReflect = reflect(-lightDir, baseNormal);
            let sunPathAlignment = clamp(dot(viewDir, sunBaseReflect), 0.0, 1.0);
            let sunColumnWeight = sunPathAlignment * sunPathAlignment;

            let nh2 = NdotH * NdotH;
            let nh4 = nh2 * nh2;
            let nh8 = nh4 * nh4;
            let nh16 = nh8 * nh8;
            let nh32 = nh16 * nh16;
            let nh64 = nh32 * nh32;
            let nh128 = nh64 * nh64;
            let nh256 = nh128 * nh128;

            let glintHigh = nh256 * 120.0;
            let glintMid = nh64 * 30.0;
            let glintColumn = nh16 * 8.0 * sunColumnWeight;

            let waveSlopeFactor = 0.5 + 0.8 * clamp(length(finalXY) * 3.0, 0.0, 1.0);
            let glitterFade = 1.0 - smoothstep(80.0, 600.0, camDistance);
            let diamondGlitter = ((glintHigh + glintMid) * waveSlopeFactor * glitterFade) + glintColumn;

            // [에너지 보존 정규화]: 윤슬의 반짝임 피크를 유지하되 무한대 발산(Blowout)을 방지하는 에너지 보존 모델
            let rawSpecBRDF = (specClean + diamondGlitter) * F;
            let totalSpecBRDF = rawSpecBRDF / (vec3<f32>(1.0) + rawSpecBRDF * 0.01);

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

    let R_raw = getReflectionVectorFromViewDirection(viewDir, worldNormal);
    let R_geo = reflect(-viewDir, baseNormal);

    // [기하학적 수평선 리프팅 (Horizon Reflection Lift)]:
    // 파도 노멀 섭동으로 인해 반사 벡터가 수면 아래(R.y < 0)나 지평선 암부로 떨어지는 결함을 원천 차단.
    // 기하학적 하늘 반사 벡터(R_geo)를 기준으로 파도 섭동을 인가하고,
    // 아래쪽을 향하는 성분을 하늘 상공(+Y)으로 부드럽게 꺾어 올려 항상 맑은 하늘 텍셀을 샘플링하도록 보장.
    let waveOffset = R_raw - R_geo;
    // [시야각 연동 노멀 섭동 댐핑]: 탑뷰(수직 시야)에서 지평선 노을이 물 표면에 점박이로 맺히는 결함 방지
    let viewSteepness = clamp(dot(baseNormal, viewDir), 0.0, 1.0);
    let waveDamping = mix(0.35, 0.12, viewSteepness);
    var R_safe = normalize(R_geo + waveOffset * waveDamping);
    R_safe.y = max(abs(R_safe.y), 0.08);
    let R = normalize(R_safe);

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

    if (!isUnderwater) {
        let horizonDot = max(dot(R, baseNormal), 0.0);
        let horizonOcclusion = clamp(horizonDot * 1.5 + 0.7, 0.65, 1.0);
        reflectedSky *= horizonOcclusion;
    }

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
    let viewNormal = (systemUniforms.camera.viewMatrix * vec4<f32>(worldNormal, 0.0)).xyz;

    // [해안선 굴절 지터링 방지 (Soft Shoreline Refraction)]:
    // 수심이 극히 얕은 해안선 경계면에서 굴절 오프셋 강도를 부드럽게 0으로 감쇄시켜
    // 물과 지형이 만나는 경계선에서 픽셀이 튀고 찢어지는 뎁스파이팅/지터링 노이즈 원천 차단
    let shorelineFade = smoothstep(0.0, max(uniforms.depthFadeDistance * 0.35, 1.5), effectiveWaterDepthDelta);
    let effectiveRefractionStrength = uniforms.refractionStrength * shorelineFade * select(min(effectiveWaterDepthDelta * 2.0, 1.0), 0.7, isUnderwater);
    let refractionOffset = viewNormal.xy * effectiveRefractionStrength;

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

    let depthScale = max(uniforms.depthFadeDistance * 2.5, 6.0);
    let depthGradient = smoothstep(0.0, depthScale, effectiveWaterDepthDelta);
    let waterTargetColor = mix(uniforms.baseColor, uniforms.deepColor, depthGradient);

    let effectiveOpacity = uniforms.opacity * inputData.combinedOpacity;
    let extinction = exp(-effectiveWaterDepthDelta * uniforms.extinctionFactor);
    let maxAbsorption = select(1.0, 0.45, isUnderwater);
    let absorptionStrength = clamp((1.0 - extinction) * effectiveOpacity, 0.0, maxAbsorption);

    // [체적 산란광 에너지 보존]: 흡수된 에너지 비율 안에서 산란광이 합성되도록 정규화
    let waterScatterTint = mix(waterTargetColor, vec3<f32>(0.08, 0.55, 0.65), 0.45);
    let scatterDepthMask = smoothstep(0.0, max(uniforms.depthFadeDistance * 0.5, 1.0), effectiveWaterDepthDelta);
    let maskedScatterLighting = waterDiffuseLighting * waterScatterTint * scatterDepthMask;
    let waterScatteredTarget = waterTargetColor + maskedScatterLighting * 0.8;
    let waterBodyScattering = mix(backgroundRefractedColor, waterScatteredTarget, absorptionStrength);

    // [물리적 에너지 보존 법칙 (R + T <= 1.0)]:
    // 표면 총 반사율(직사광 + 간접광 IBL)을 계산하고, 투과율은 정확히 (1.0 - R)로 보장하여
    // 어떠한 경우에도 에너지가 증폭되거나 생성되지 않도록 엄밀히 분할.
    let totalSurfaceReflectance = clamp(totalDirectReflectance + F_IBL * uniforms.specularFactor * sunOcclusion, vec3<f32>(0.0), vec3<f32>(1.0));
    let baseTransmission = clamp(vec3<f32>(1.0) - totalSurfaceReflectance, vec3<f32>(0.0), vec3<f32>(1.0));
    // [스침각 수체 발색 보존 (Grazing Angle Color Retention)]:
    // 파도의 3D 입체 굴곡과 체적 산란광 방출로 인해 수평 시선(N·V -> 0)에서도 에메랄드빛이 완전히 차단되지 않도록 최소 18% 투과 마진 보장
    let grazingRetention = 0.18 * (1.0 - safeRoughnessParam * 0.4);
    let effectiveTransmission = max(baseTransmission, vec3<f32>(grazingRetention));
    let transmissionWeight = select(effectiveTransmission, vec3<f32>(0.85), isUnderwater);

    // [해안선 및 물밑 투과광의 완전한 에너지 보존]:
    // 해안선(depthFade)과 물밑 체적 산란광 모두에 transmissionWeight를 일관되게 적용하여
    // 해안가 경계면에서도 표면 반사율과 투과율의 합이 1.0을 초과하지 않도록 보장
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
