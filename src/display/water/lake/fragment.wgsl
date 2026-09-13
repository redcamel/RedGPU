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
    padding1: f32,
    padding2: f32,
    padding3: f32,
};

@group(2) @binding(0) var<uniform> uniforms: WaterUniforms;
@group(2) @binding(1) var normalTextureSampler: sampler;
@group(2) @binding(2) var normalTexture: texture_2d<f32>;

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

    // 2. Step 2: 3중 노멀 스크롤 UV 구축 (서로 다른 스케일, 속도, 교차 각도)
    // - Layer 1 (대형 너울): 기본 타일링 0.45x, 속도 0.6x, 주 풍향
    let uv1 = inputData.uv * (uniforms.normalTiling * 0.45) + baseWindDir * (timeSec * uniforms.windSpeed * 0.6);
    // - Layer 2 (중형 잔물결): 기본 타일링 1.0x, 속도 1.15x, +37도 교차 풍향
    let dir2 = rotateVec2(baseWindDir, 0.645);
    let uv2 = inputData.uv * uniforms.normalTiling + dir2 * (timeSec * uniforms.windSpeed * 1.15);
    // - Layer 3 (마이크로 바람결): 기본 타일링 2.25x, 속도 1.75x, -49도 역측풍향
    let dir3 = rotateVec2(baseWindDir, -0.855);
    let uv3 = inputData.uv * (uniforms.normalTiling * 2.25) + dir3 * (timeSec * uniforms.windSpeed * 1.75);

    // 3. 3중 노멀맵 샘플링 및 언패킹
    let rawN1 = textureSample(normalTexture, normalTextureSampler, uv1).rgb;
    let rawN2 = textureSample(normalTexture, normalTextureSampler, uv2).rgb;
    let rawN3 = textureSample(normalTexture, normalTextureSampler, uv3).rgb;

    let n1 = unpackTangentNormal(rawN1);
    let n2 = unpackTangentNormal(rawN2);
    let n3 = unpackTangentNormal(rawN3);

    // 4. Step 2: RNM(Reoriented Normal Mapping) 무손실 2단계 계층 블렌딩
    let n12 = blendRNM(n1, n2);
    let blendedTangent = blendRNM(n12, n3);

    // 5. RedGPU 표준 TBN 행렬 구축 및 최종 월드 노멀 산출 (normalScale 적용)
    let baseNormal = normalize(inputData.vertexNormal);
    let tbn = getTBNFromVertexTangent(baseNormal, inputData.vertexTangent);

    // 4. 카메라 시선 벡터 (View Direction) 및 Step 8: 수중 잠수 판별 (월드 Y 수위 기준)
    let viewDir = normalize(systemUniforms.camera.cameraPosition - inputData.vertexPosition);
    let isUnderwater = systemUniforms.camera.cameraPosition.y < inputData.vertexPosition.y;

    var finalXY = blendedTangent.xy * uniforms.normalScale;
    let finalZ = sqrt(max(0.0, 1.0 - dot(finalXY, finalXY)));
    var worldNormal = normalize(tbn * vec3<f32>(finalXY, finalZ));
    // 수중에서 올려다볼 때 법선 벡터를 시선 방향을 마주하도록 반전
    worldNormal = select(worldNormal, -worldNormal, isUnderwater);
    let NdotV = max(dot(worldNormal, viewDir), 0.0001);

    // 5. 물의 물리 반사율 (물의 F0 = ((1.333 - 1) / (1.333 + 1))^2 ≈ 0.02037)
    let F0 = vec3<f32>(0.02037);

    // 6. 태양 직사광 Cook-Torrance GGX 스펙큘러 하이라이트 (Sun Glitter)
    var specularLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    let sunRoughness = clamp(max(uniforms.roughness, 0.12), 0.05, 1.0);
    let alpha = sunRoughness * sunRoughness;
    let alpha2 = alpha * alpha;
    let oneMinusAlpha2 = 1.0 - alpha2;

    for (var i = 0u; i < u_directionalLightCount; i++) {
        let dirLight = u_directionalLights[i];
        let lightDir = -normalize(dirLight.direction);
        // 수중에서는 위에서 내리쬐는 빛이 수면을 뚫고 들어오므로 양방향 투과 조명 고려
        let NdotL = max(abs(dot(worldNormal, lightDir)), 0.0);

        if (NdotL > 0.0) {
            var lightRadiance = dirLight.color.rgb * (dirLight.intensity * systemUniforms.preExposure);

            if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
                let u_atmo = systemUniforms.skyAtmosphere;
                let surfaceHeightKm = max(0.0, inputData.vertexPosition.y / 1000.0);
                let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, lightDir.y, u_atmo.atmosphereHeight);
                lightRadiance *= atmosphereTransmittance;
            }

            let halfDir = normalize(lightDir + viewDir);
            let NdotH = max(dot(worldNormal, halfDir), 0.0);
            let VdotH = max(dot(viewDir, halfDir), 0.0);

            let F = F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);

            let NdotH2 = NdotH * NdotH;
            let denom = NdotH2 * (alpha2 - 1.0) + 1.0;
            let D = (alpha2 * INV_PI) / max(EPSILON, denom * denom);

            let safeNdotL = max(NdotL, 0.0001);
            let GGXV = safeNdotL * sqrt(NdotV * NdotV * oneMinusAlpha2 + alpha2);
            let GGXL = NdotV * sqrt(safeNdotL * safeNdotL * oneMinusAlpha2 + alpha2);
            let V = 0.5 / max(GGXV + GGXL, EPSILON);

            let specBRDF = D * V * F;
            specularLighting += lightRadiance * specBRDF * uniforms.specularFactor * NdotL;
        }
    }

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
        let skyGradient = mix(vec3<f32>(0.35, 0.55, 0.75), vec3<f32>(0.65, 0.8, 0.95), clamp(R.y * 0.5 + 0.5, 0.0, 1.0));
        reflectedSky = skyGradient * preExposure * 1.2;
    }

    let envBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, clamp(vec2<f32>(NdotV_IBL, iblRoughness), vec2<f32>(0.005), vec2<f32>(0.995)), 0.0).rg;
    let energyCompensation = 1.0 + F0 * (1.0 / max(envBRDF.x + envBRDF.y, 1e-4) - 1.0);
    reflectedSky *= energyCompensation;

    // 수평선 아래 폐색 (Horizon Occlusion) - ★수면 위에서만 적용하여 수중 먹물 흑화 결함 차단★
    if (!isUnderwater) {
        let horizonOcclusion = clamp(1.0 + 1.1 * dot(R, worldNormal), 0.0, 1.0);
        reflectedSky *= horizonOcclusion * horizonOcclusion;
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
    let depthGradient = smoothstep(0.0, 3.5, effectiveWaterDepthDelta);
    let waterTargetColor = mix(uniforms.baseColor, uniforms.deepColor, depthGradient);

    let effectiveOpacity = uniforms.opacity * inputData.combinedOpacity;
    let extinction = exp(-effectiveWaterDepthDelta * uniforms.extinctionFactor);
    // 수중에서는 물 밖 풍경이 어둡게 가려지지 않도록 최대 흡수율을 0.45로 제한하여 맑고 청량한 시야 확보
    let maxAbsorption = select(1.0, 0.45, isUnderwater);
    let absorptionStrength = clamp((1.0 - extinction) * effectiveOpacity, 0.0, maxAbsorption);
    let waterBodyScattering = mix(backgroundRefractedColor, waterTargetColor, absorptionStrength);

    // 11. 물리적 에너지 보존 및 최종 수면 합성
    // 수중에서는 물 밖 풍경이 시원하게 들여다보이도록 투과율 가중치 확보
    let transmissionWeight = select(max(vec3<f32>(1.0) - F_IBL, vec3<f32>(0.0)), vec3<f32>(0.85), isUnderwater);
    let transmittedUnderwater = waterBodyScattering * transmissionWeight;
    let totalSpecular = (specularLighting + iblSpecular) * depthFade;

    let surfaceColor = transmittedUnderwater + totalSpecular;
    let finalRgb = mix(backgroundRefractedColor, surfaceColor, depthFade);

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
