#redgpu_include SYSTEM_UNIFORM;
#redgpu_include color.getTintBlendMode;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.direction.getReflectionVectorFromViewDirection;
#redgpu_include math.tnb.getTBNFromVertexTangent;
#redgpu_include math.tnb.getNormalFromNormalMap;
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
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(11) combinedOpacity: f32,

    @location(12) motionVector: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

/**
 * [KO] 2D 벡터를 주어진 라디안 각도로 회전합니다.
 * [EN] Rotates a 2D vector by a given radian angle.
 */
fn rotateVec2(v: vec2<f32>, angleRad: f32) -> vec2<f32> {
    let s = sin(angleRad);
    let c = cos(angleRad);
    return vec2<f32>(v.x * c - v.y * s, v.x * s + v.y * c);
}

/**
 * [KO] 노멀 텍스처에서 샘플링된 색상을 탄젠트 공간 법선 벡터로 언패킹합니다. (G채널 반전 적용)
 * [EN] Unpacks sampled normal texture color into tangent space normal vector (with inverted G-channel).
 */
fn unpackTangentNormal(color: vec3<f32>) -> vec3<f32> {
    var xy = color.xy * 2.0 - 1.0;
    xy.y = -xy.y;
    let z = sqrt(max(0.0, 1.0 - dot(xy, xy)));
    return vec3<f32>(xy, z);
}

/**
 * [KO] 언리얼 엔진 5 및 AAA 표준 RNM(Reoriented Normal Mapping) 블렌딩 함수입니다.
 * [EN] Unreal Engine 5 & AAA standard Reoriented Normal Mapping (RNM) blending function.
 * 두 탄젠트 공간 법선의 디테일을 기저 회전 변환으로 손실 없이 합성합니다.
 */
fn blendRNM(n1: vec3<f32>, n2: vec3<f32>) -> vec3<f32> {
    let t = n1 + vec3<f32>(0.0, 0.0, 1.0);
    let u = vec3<f32>(-n2.x, -n2.y, n2.z);
    return normalize(t * dot(t, u) - u * t.z);
}

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;

    // 1. 바람 방향 정규화 및 시간 계산 (시간 t 기반 애니메이션, 초 단위)
    let timeSec = systemUniforms.time.time;
    let windDirLen = length(uniforms.windDirection);
    let baseWindDir = select(vec2<f32>(1.0, 0.0), uniforms.windDirection / windDirLen, windDirLen > 0.001);

    // 2. Texture 1 (저주파 메인 너울): 주 풍향, 느린 속도
    let uv1 = inputData.uv * (uniforms.normalTiling * 0.45) + baseWindDir * (timeSec * uniforms.windSpeed * 0.6);
    let rawN1 = textureSample(normalTexture, normalTextureSampler, uv1).rgb;
    let n1 = unpackTangentNormal(rawN1);

    // 3. 도메인 워핑 (Domain Warping): 메인 너울의 법선 기울기로 고주파 UV를 비틀어 타일링 격자 패턴을 유기적으로 분쇄
    let warpOffset = n1.xy * 0.035;

    let dir2 = rotateVec2(baseWindDir, 0.645); // +37도 교차 풍향
    let dir3 = rotateVec2(baseWindDir, -0.855); // -49도 역측 풍향

    var blendedTangent: vec3<f32>;

    // 4. [AAA 듀얼 노멀 시스템]: Texture 2(고주파 마이크로 물결) 바인딩 시 합성
    if (uniforms.useNormalTexture2 > 0.5) {
        let uv2 = (inputData.uv + warpOffset) * (uniforms.normalTiling * uniforms.normalTiling2) + dir2 * (timeSec * uniforms.windSpeed * 1.35);
        let uv3 = (inputData.uv - warpOffset * 0.65) * (uniforms.normalTiling * uniforms.normalTiling2 * 1.75) + dir3 * (timeSec * uniforms.windSpeed * 1.85);

        let rawN2 = textureSample(normalTexture2, normalTextureSampler, uv2).rgb;
        let rawN3 = textureSample(normalTexture2, normalTextureSampler, uv3).rgb;

        let n2 = unpackTangentNormal(rawN2);
        let n3 = unpackTangentNormal(rawN3);

        // 고주파 마이크로 텍스처 자체 2중 RNM 합성
        let microBlended = blendRNM(n2, n3 * vec3<f32>(0.65, 0.65, 1.0));

        // 저주파 대형 너울(n1)과 고주파 마이크로 물결(microBlended)의 최종 무손실 RNM 계층 결합
        let scaledN1 = vec3<f32>(n1.xy * uniforms.normalScale, n1.z);
        let scaledMicro = vec3<f32>(microBlended.xy * uniforms.normalScale2, microBlended.z);
        blendedTangent = blendRNM(scaledN1, scaledMicro);
    } else {
        // [단일 텍스처 폴백 + 도메인 워핑]: 1장의 텍스처라도 워핑 왜곡으로 타일링 격자 제거
        let uv2 = (inputData.uv + warpOffset) * uniforms.normalTiling + dir2 * (timeSec * uniforms.windSpeed * 1.15);
        let uv3 = (inputData.uv - warpOffset * 0.5) * (uniforms.normalTiling * 2.25) + dir3 * (timeSec * uniforms.windSpeed * 1.75);

        let rawN2 = textureSample(normalTexture, normalTextureSampler, uv2).rgb;
        let rawN3 = textureSample(normalTexture, normalTextureSampler, uv3).rgb;

        let n2 = unpackTangentNormal(rawN2);
        let n3 = unpackTangentNormal(rawN3);

        let n12 = blendRNM(n1, n2);
        let combined = blendRNM(n12, n3);
        blendedTangent = vec3<f32>(combined.xy * uniforms.normalScale, combined.z);
    }

    // 5. 원거리 노멀 완화 (Distance Normal Fade / Anti-Aliasing): 수평선 부근의 스펙큘러 노이즈 제거 및 거울 반사 극대화
    let camDistance = distance(systemUniforms.camera.cameraPosition, inputData.vertexPosition);
    let distanceFade = clamp(1.0 - smoothstep(600.0, 6000.0, camDistance) * 0.75, 0.25, 1.0);

    // 6. RedGPU 표준 TBN 행렬 구축 및 최종 월드 노멀 산출
    let baseNormal = normalize(inputData.vertexNormal);
    let tbn = getTBNFromVertexTangent(baseNormal, inputData.vertexTangent);

    // 7. 카메라 시선 벡터 (View Direction) 및 Step 8: 수중 잠수 판별 (월드 Y 수위 기준)
    let viewDir = normalize(systemUniforms.camera.cameraPosition - inputData.vertexPosition);
    let isUnderwater = systemUniforms.camera.cameraPosition.y < inputData.vertexPosition.y;

    // 탄젠트 공간 xy에 거리 감쇄만 적용 (normalScale 중복 적용 차단)
    var finalXY = blendedTangent.xy * distanceFade;
    let finalZ = sqrt(max(0.001, 1.0 - dot(finalXY, finalXY)));
    var worldNormal = normalize(tbn * vec3<f32>(finalXY, finalZ));
    // 수중에서 올려다볼 때 법선 벡터를 시선 방향을 마주하도록 반전
    worldNormal = select(worldNormal, -worldNormal, isUnderwater);

    // ★카메라 시선 방향 등짐(Back-facing Shading Normal) 보정★
    // 수면의 요철로 인해 법선이 시선 반대쪽을 향해 꺾이지 않도록 최소 시선 방향 성분(0.05) 보장
    let NdotV_raw = dot(worldNormal, viewDir);
    if (NdotV_raw < 0.05) {
        worldNormal = normalize(worldNormal + (0.05 - NdotV_raw) * viewDir);
    }
    let NdotV = max(dot(worldNormal, viewDir), 0.001);

    // 5. 물의 물리 반사율 (물의 F0 = ((1.333 - 1) / (1.333 + 1))^2 ≈ 0.02037)
    let F0 = vec3<f32>(0.02037);

    // 6. 태양 직사광 Cook-Torrance GGX 스펙큘러 및 수체 산란 (Sun Glitter & Water Body Scatter)
    var specularLighting = vec3<f32>(0.0);
    var waterDiffuseLighting = vec3<f32>(0.0);
    var maxSunRadiance = 0.0;
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    // 물 본연의 초고평탄도 거울 러프니스 (Crystal Clear Water Surface)
    let baseRoughness = clamp(uniforms.roughness, 0.015, 1.0);
    let alpha = baseRoughness * baseRoughness;
    let alpha2 = max(0.0001, alpha * alpha);
    let oneMinusAlpha2 = 1.0 - alpha2;

    for (var i = 0u; i < u_directionalLightCount; i++) {
        let dirLight = u_directionalLights[i];
        let lightDir = -normalize(dirLight.direction);
        // 수중에서는 위에서 내리쬐는 빛이 수면을 뚫고 들어오므로 양방향 투과 조명 고려
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

            // 2.2 [물리 기반 수체 체적 산란]: 물속으로 침투한 (1 - F) 태양광의 다중 체적 산란 (Upwelling Radiance)
            let sunFresnel = F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - max(dot(worldNormal, lightDir), 0.0), 0.0, 1.0), 5.0);
            let sunTransmittance = vec3<f32>(1.0) - sunFresnel;
            let sunGeoNdotL = clamp(dot(baseNormal, lightDir) * 0.7 + 0.3, 0.0, 1.0);
            // 역광 시점에서 물결을 뚫고 나오는 전방 산란(Forward Subsurface Scattering) 강조
            let viewSunDot = dot(viewDir, -lightDir);
            let forwardScatter = pow(clamp(viewSunDot * 0.5 + 0.5, 0.0, 1.0), 2.0) * 0.5 + 0.5;
            let waterScatterContribution = lightRadiance * sunTransmittance * sunGeoNdotL * forwardScatter * 0.35;
            waterDiffuseLighting += waterScatterContribution;

            let halfDir = normalize(lightDir + viewDir);
            let NdotH = max(dot(worldNormal, halfDir), 0.0);
            let VdotH = max(dot(viewDir, halfDir), 0.0);
            let NdotH2 = NdotH * NdotH;
            let safeNdotL = max(NdotL, 0.0001);

            let F = F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);

            // 1. 크리스털 베이스 GGX 스펙큘러 (Core Clean Specular)
            let denom = NdotH2 * (alpha2 - 1.0) + 1.0;
            let D = alpha2 * INV_PI / max(EPSILON, denom * denom);
            let GGXV = safeNdotL * sqrt(NdotV * NdotV * oneMinusAlpha2 + alpha2);
            let GGXL = NdotV * sqrt(safeNdotL * safeNdotL * oneMinusAlpha2 + alpha2);
            let V = 0.5 / max(GGXV + GGXL, EPSILON);
            let specClean = D * V;

            // 2. 태양 반사축(Solar Reflection Axis) 및 Cox-Munk 해양 윤슬 기둥 (Sun Glitter Column)
            // 수평면 기준 태양 반사 방향과 시선 벡터의 정렬도 (태양을 마주보는 역광/사광 경로 판별)
            let sunBaseReflect = reflect(-lightDir, baseNormal);
            let sunPathAlignment = clamp(dot(viewDir, sunBaseReflect), 0.0, 1.0);
            let sunColumnWeight = pow(sunPathAlignment, 2.0); // 태양을 향해 길게 늘어지는 부채꼴 빔

            // 파도 능선 다이아몬드 핀포인트 스파클 (Pinpoint Diamond Sparkle)
            // 물의 낮은 프레넬 반사율(F ≈ 0.02)을 뚫고 눈부시게 빛나도록 물리적 HDR 에너지 스케일 적용
            let glintHigh = pow(NdotH, 256.0) * 120.0;
            let glintMid = pow(NdotH, 64.0) * 30.0;
            let glintColumn = pow(NdotH, 16.0) * 8.0 * sunColumnWeight;

            // 파도 요철의 경사면(Wave Slope) 가중치 (잔잔한 바닥보다 찰랑이는 물결 능선에서 극적으로 작열)
            let waveSlopeFactor = 0.5 + 0.8 * clamp(length(finalXY) * 3.0, 0.0, 1.0);
            let diamondGlitter = (glintHigh + glintMid) * waveSlopeFactor + glintColumn;

            // 크리스털 거울 베이스 + 찬란한 다이아몬드 윤슬 합성
            let totalSpecBRDF = (specClean + diamondGlitter) * F;
            specularLighting += lightRadiance * totalSpecBRDF * uniforms.specularFactor * NdotL;
        }
    }

    // 씬 앰비언트 라이트(Ambient Light) 수체 산란 기여
    let ambientRadiance = systemUniforms.ambientLight.color.rgb * (systemUniforms.ambientLight.intensity * systemUniforms.preExposure);
    waterDiffuseLighting += ambientRadiance * 0.2;

    // 7. 간접광 환경 반사 (IBL Specular & Sky Atmosphere)
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;
    let preExposure = systemUniforms.preExposure;

    let R = getReflectionVectorFromViewDirection(viewDir, worldNormal);
    let NdotV_IBL = max(dot(worldNormal, viewDir), 0.04);
    let iblRoughness = clamp(uniforms.roughness, 0.02, 1.0);

    var reflectedSky = vec3<f32>(0.0);
    var hasReflection = false;

    if (u_usePrefilterTexture) {
        let iblMipmapCount = f32(textureNumLevels(ibl_prefilterTexture) - 1);
        let mipLevel = iblRoughness * iblMipmapCount;
        reflectedSky = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, R, mipLevel).rgb * preExposure * systemUniforms.iblIntensity;
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
        // IBL 및 SkyAtmosphere가 없을 때: 태양 직사광 스케일에 맞춘 대기 산란 하늘 돔(Sky Dome) 반사
        // 맑은 날 하늘 돔의 전체 조도는 태양 직사광의 약 25%~35%를 차지하여 호수를 눈부시게 푸른 거울로 반사
        let skyGradient = mix(vec3<f32>(0.35, 0.55, 0.8), vec3<f32>(0.6, 0.8, 1.0), clamp(R.y * 0.5 + 0.5, 0.0, 1.0));
        let sunSkyLuminance = maxSunRadiance * 0.35;
        let ambientSkyLuminance = max(ambientRadiance.r, max(ambientRadiance.g, ambientRadiance.b));
        let skyIntensity = max(max(sunSkyLuminance, ambientSkyLuminance), 1.0);
        reflectedSky = skyGradient * skyIntensity;
    }

    let envBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, clamp(vec2<f32>(NdotV_IBL, iblRoughness), vec2<f32>(0.005), vec2<f32>(0.995)), 0.0).rg;
    let energyCompensation = 1.0 + F0 * (1.0 / max(envBRDF.x + envBRDF.y, 1e-4) - 1.0);
    reflectedSky *= energyCompensation;

    // 수평선 아래 폐색 (Horizon Occlusion) - ★수면 전용 부드러운 감쇄 및 하한선(Floor) 보장★
    if (!isUnderwater) {
        let horizonDot = dot(R, baseNormal);
        // 반사 벡터가 지평선 아래로 기울어져도 주변 수면/대기광이 반사되므로 최소 0.40 보장 (흑화 원천 차단)
        let horizonOcclusion = clamp(horizonDot * 1.5 + 0.7, 0.4, 1.0);
        reflectedSky *= horizonOcclusion;
    }

    // 시선 각도에 따른 Schlick-Fresnel 반사율
    let fresnelFactor = pow(clamp(1.0 - NdotV_IBL, 0.0, 1.0), 5.0);
    let F_dielectric = F0 + (vec3<f32>(1.0) - F0) * fresnelFactor;
    let F_IBL = F_dielectric * envBRDF.x + envBRDF.y;

    let iblSpecular = reflectedSky * F_IBL * uniforms.specularFactor;

    // 8. 씬 깊이(Depth) 기반 부드러운 해안선 감쇄 및 수중 거리
    let screenCoord = vec2<i32>(inputData.position.xy);
    let rawSceneDepth = textureLoad(renderPath1DepthTexture, screenCoord, 0);
    let cameraNear = systemUniforms.camera.nearClipping;
    let cameraFar = systemUniforms.camera.farClipping;
    let linearSceneDepth = getLinearizeDepth(rawSceneDepth, cameraNear, cameraFar);
    let linearWaterDepth = getLinearizeDepth(inputData.position.z, cameraNear, cameraFar);

    var effectiveWaterDepthDelta = max(linearSceneDepth - linearWaterDepth, 0.0);
    var depthFade = 1.0;
    if (isUnderwater) {
        // 수중에서는 카메라에서 수면까지의 거리가 수중 시선 흡수 거리 (수면 소실 방지를 위해 depthFade 1.0 유지)
        effectiveWaterDepthDelta = distance(systemUniforms.camera.cameraPosition, inputData.vertexPosition);
        depthFade = 1.0;
    } else {
        if (uniforms.depthFadeDistance > 0.0) {
            depthFade = smoothstep(0.0, uniforms.depthFadeDistance, effectiveWaterDepthDelta);
        }
    }

    // 9. Step 4: 수중 굴절 왜곡 (Screen-space Refraction & Under-water Distortion)
    let screenUV = inputData.position.xy / systemUniforms.resolution;
    let viewNormal = (systemUniforms.camera.viewMatrix * vec4<f32>(worldNormal, 0.0)).xyz;
    let effectiveRefractionStrength = uniforms.refractionStrength * select(min(effectiveWaterDepthDelta * 2.0, 1.0), 0.7, isUnderwater);
    let refractionOffset = viewNormal.xy * effectiveRefractionStrength;

    var finalRefractUV = clamp(screenUV + refractionOffset, vec2<f32>(0.001), vec2<f32>(0.999));

    if (!isUnderwater) {
        // 수면 위에서 볼 때: 물 밖 돌출 오브젝트 침범 방지
        let distortedScreenCoord = vec2<i32>(finalRefractUV * systemUniforms.resolution);
        let rawDistortedDepth = textureLoad(renderPath1DepthTexture, distortedScreenCoord, 0);
        let linearDistortedSceneDepth = getLinearizeDepth(rawDistortedDepth, cameraNear, cameraFar);

        if (linearDistortedSceneDepth < linearWaterDepth) {
            finalRefractUV = screenUV;
        }
    }

    // 1차 렌더 패스 불투명 씬 컬러 샘플링 (수중에서는 물 밖의 하늘과 오브젝트가 투명하게 보임)
    let backgroundRefractedColor = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalRefractUV, 0.0).rgb;

    // 10. 수체 흡수 및 산란 (Beer-Lambert Absorption & Dual-tone Depth Scattering)
    let depthScale = max(uniforms.depthFadeDistance * 2.5, 6.0);
    let depthGradient = smoothstep(0.0, depthScale, effectiveWaterDepthDelta);
    let waterTargetColor = mix(uniforms.baseColor, uniforms.deepColor, depthGradient);

    let effectiveOpacity = uniforms.opacity * inputData.combinedOpacity;
    let extinction = exp(-effectiveWaterDepthDelta * uniforms.extinctionFactor);
    // 수중에서는 물 밖 풍경이 어둡게 가려지지 않도록 최대 흡수율을 0.45로 제한하여 맑고 청량한 시야 확보
    let maxAbsorption = select(1.0, 0.45, isUnderwater);
    let absorptionStrength = clamp((1.0 - extinction) * effectiveOpacity, 0.0, maxAbsorption);
    let waterScatterTint = mix(waterTargetColor, vec3<f32>(0.08, 0.55, 0.65), 0.45);
    // 수심 마스킹: 얕은 물가나 맑은 투명 구역에서는 체적 산란광이 수면을 뿌옇게 가리지 않고 크리스털처럼 맑게 보존
    let scatterDepthMask = smoothstep(0.0, max(uniforms.depthFadeDistance * 0.5, 1.0), effectiveWaterDepthDelta);
    let maskedScatterLighting = waterDiffuseLighting * waterScatterTint * scatterDepthMask;
    let waterBodyScattering = mix(backgroundRefractedColor, waterTargetColor, absorptionStrength) + maskedScatterLighting;

    // 11. 물리적 에너지 보존 및 최종 수면 합성
    // 비스듬한 시선에서도 물속 투과광이 완전히 0이 되지 않도록 최소 투과 가중치(0.2) 보장
    let transmissionWeight = select(clamp(vec3<f32>(1.0) - F_IBL, vec3<f32>(0.2), vec3<f32>(1.0)), vec3<f32>(0.85), isUnderwater);
    let transmittedUnderwater = waterBodyScattering * transmissionWeight;

    // ★2.1 스펙큘러 하이라이트 depthFade 이중 곱셈 제거 및 물리적 분리 합성★
    // 태양 스펙큘러 및 환경 반사광은 수면 최외각에서 100% 온전하게 반사되도록 depthFade 밖으로 분리
    let totalSpecular = specularLighting + iblSpecular;
    let blendedWater = mix(backgroundRefractedColor, transmittedUnderwater, depthFade);
    let finalRgb = blendedWater + totalSpecular;

    output.color = vec4<f32>(finalRgb, 1.0);

    // 9. RedGPU PBR 표준 G-Buffer Normal & MotionVector 출력
    let safeRoughness = clamp(uniforms.roughness, 0.0, 1.0);
    let smoothness = 1.0 - safeRoughness;
    let smoothnessCurved = smoothness * smoothness * (3.0 - 2.0 * smoothness);
    let baseReflectionStrength = smoothnessCurved * 0.02037 * uniforms.specularFactor;
    output.gBufferNormal = vec4<f32>(worldNormal * 0.5 + 0.5, baseReflectionStrength);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);

    return output;
}
