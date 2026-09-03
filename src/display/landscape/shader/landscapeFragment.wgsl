#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.PI;
#redgpu_include math.PI2;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;
#redgpu_include math.direction.getViewDirection;
#redgpu_include math.direction.getReflectionVectorFromViewDirection;
#redgpu_include skyAtmosphere.skyAtmosphereFn;
#redgpu_include shadow.getDirectionalShadowVisibility;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) uv1: vec2<f32>,
    @location(3) currentClipPos: vec4<f32>,
    @location(4) prevClipPos: vec4<f32>,
    @location(5) instanceColor: vec4<f32>,
    @location(6) @interpolate(flat) lodLevel: f32,
    @location(7) @interpolate(flat) receiveShadow: f32,
};

struct LandscapeLayerParams {
    uvOffset: vec2<f32>,
    uvScale: vec2<f32>,
    tintColor: vec4<f32>,
    roughness: f32,
    metallic: f32,
    normalIntensity: f32,
    enabled: f32,
    aoIntensity: f32,
    weightChannelIndex: f32,
    pad0: f32,
    pad1: f32,
};

struct MaterialUniforms {
    activeLayerCount: u32,
    pad0: u32,
    pad1: u32,
    pad2: u32,
    color: vec4<f32>,
    layerParams: array<LandscapeLayerParams, 8>,
};

struct LandscapeUniforms {
    heightScale: f32,
    worldSizeX: f32,
    worldSizeZ: f32,
    lodColoration: f32,
    maxComponentCount: u32,
    tileSizeX: f32,
    tileSizeZ: f32,
    baseQuads: f32,
    vhtTextureSize: vec2<f32>,
    lodFadeStartRatio: f32,
    lodGeomorphStartRatio: f32,
    lodColors: array<vec4<f32>, 8>,
    lodDistancesSq: array<vec4<f32>, 2>,
    tanHalfFOV: f32,
    lodMetric: f32,
    lod0Quads: f32,
    receiveShadow: f32,
    heightmapShadow: f32,
    heightmapShadowSteps: f32,
    heightmapShadowDistance: f32,
    heightmapShadowSoftness: f32,
};

@group(1) @binding(3) var heightMapTexture: texture_2d<f32>;
@group(1) @binding(4) var vntNormalTexture: texture_2d<f32>;
@group(1) @binding(5) var<uniform> landscapeInstanceUniforms: LandscapeUniforms;
@group(1) @binding(6) var vbtBaseColorAtlasTexture: texture_2d<f32>;
@group(1) @binding(7) var vbtNormalAtlasTexture: texture_2d<f32>;
@group(1) @binding(8) var vbtORMAtlasTexture: texture_2d<f32>;

@group(2) @binding(0) var<uniform> uniforms: MaterialUniforms;
@group(2) @binding(1) var baseColorTextureSampler: sampler;
@group(2) @binding(2) var layerBaseColorArray: texture_2d_array<f32>;
@group(2) @binding(3) var layerNormalArray: texture_2d_array<f32>;
@group(2) @binding(4) var layerORMArray: texture_2d_array<f32>;
@group(2) @binding(5) var layerWeightMapArray: texture_2d_array<f32>;

struct DirectLayerResult {
    albedo: vec3<f32>,
    normal: vec3<f32>,
    roughness: f32,
    metallic: f32,
    ao: f32,
};

fn getBaseNormal(globalUV: vec2<f32>) -> vec3<f32> {
    let vntSample = textureSampleLevel(vntNormalTexture, baseColorTextureSampler, globalUV, 0.0).rgb;
    return normalize(select(vntSample * 2.0 - vec3<f32>(1.0), vec3<f32>(0.0, 1.0, 0.0), length(vntSample) <= 0.001));
}

fn computeDirectLayersPBR(
    globalUV: vec2<f32>,
    worldTileUV: vec2<f32>,
    ddxGlobalUV: vec2<f32>,
    ddyGlobalUV: vec2<f32>,
    ddxWorldTileUV: vec2<f32>,
    ddyWorldTileUV: vec2<f32>,
    baseN: vec3<f32>
) -> DirectLayerResult {
    var res: DirectLayerResult;
    var baseAlbedo = uniforms.color.rgb;
    var baseRoughness = 0.9;
    var baseMetallic = 0.0;
    var baseAO = 1.0;

    let activeLayerCount = uniforms.activeLayerCount;
    var totalLayerWeight = 0.0;
    var blendedAlbedo = vec3<f32>(0.0);
    var blendedNormalTangent = vec3<f32>(0.0, 0.0, 0.0);
    var blendedRoughness = 0.0;
    var blendedAO = 0.0;

    // 🌟 [근거리 최적화 8.7] 스플랫맵(레이어 0)을 루프 밖에서 단 1회만 일괄 샘플링! (기존 최대 8회 ➔ 1회로 급감)
    let splatMapSample = textureSampleGrad(layerWeightMapArray, baseColorTextureSampler, globalUV, 0, ddxGlobalUV, ddyGlobalUV);

    for (var i = 0u; i < activeLayerCount; i = i + 1u) {
        let layerParams = uniforms.layerParams[i];
        if (layerParams.enabled <= 0.5) { continue; }

        let chIdx = u32(layerParams.weightChannelIndex + 0.5);
        var weightVal = splatMapSample.r;
        if (chIdx == 1u) { weightVal = splatMapSample.g; }
        else if (chIdx == 2u) { weightVal = splatMapSample.b; }
        else if (chIdx == 3u) {
            let isAlphaFull = splatMapSample.a >= 0.99;
            let remainingWeight = clamp(1.0 - (splatMapSample.r + splatMapSample.g + splatMapSample.b), 0.0, 1.0);
            weightVal = select(splatMapSample.a, remainingWeight, isAlphaFull);
        }
        let layerW = clamp(weightVal, 0.0, 1.0);

        if (layerW <= 0.0001) { continue; }

        let layerIdx = i32(i);
        let layerUV = worldTileUV * layerParams.uvScale + layerParams.uvOffset;
        let ddxLayerUV = ddxWorldTileUV * layerParams.uvScale;
        let ddyLayerUV = ddyWorldTileUV * layerParams.uvScale;

        let layerAlbedoSample = textureSampleGrad(layerBaseColorArray, baseColorTextureSampler, layerUV, layerIdx, ddxLayerUV, ddyLayerUV);
        let layerNormalRaw = textureSampleGrad(layerNormalArray, baseColorTextureSampler, layerUV, layerIdx, ddxLayerUV, ddyLayerUV).rgb * 2.0 - vec3<f32>(1.0);
        let layerNormalSample = vec3<f32>(layerNormalRaw.xy * layerParams.normalIntensity, max(0.01, layerNormalRaw.z));
        let layerORMSample = textureSampleGrad(layerORMArray, baseColorTextureSampler, layerUV, layerIdx, ddxLayerUV, ddyLayerUV);

        let layerAlbedo = layerAlbedoSample.rgb * layerParams.tintColor.rgb;
        let layerRoughness = layerParams.roughness * layerORMSample.g;
        let rawAO = select(1.0, layerORMSample.r, layerORMSample.r > 0.001);
        let layerAO = clamp(mix(1.0, rawAO, layerParams.aoIntensity), 0.2, 1.0);

        blendedAlbedo += layerAlbedo * layerW;
        blendedNormalTangent += layerNormalSample * layerW;
        blendedRoughness += layerRoughness * layerW;
        blendedAO += layerAO * layerW;

        totalLayerWeight += layerW;
    }

    if (totalLayerWeight > 0.0001) {
        let invW = 1.0 / totalLayerWeight;
        let layerBlendAlbedo = blendedAlbedo * invW;
        let layerBlendNormal = normalize(blendedNormalTangent);
        let layerBlendRoughness = blendedRoughness * invW;
        let layerBlendAO = blendedAO * invW;

        let alpha = clamp(totalLayerWeight, 0.0, 1.0);

        res.albedo = mix(baseAlbedo, layerBlendAlbedo, alpha);

        if (length(layerBlendNormal.xy) > 0.001) {
            let tangentX = normalize(vec3<f32>(1.0, 0.0, 0.0) - baseN * baseN.x);
            let tangentZ = cross(baseN, tangentX);
            let perturbedWorldN = tangentX * layerBlendNormal.x + tangentZ * layerBlendNormal.y + baseN * layerBlendNormal.z;
            res.normal = normalize(mix(baseN, perturbedWorldN, alpha));
        } else {
            res.normal = baseN;
        }
        res.roughness = mix(baseRoughness, layerBlendRoughness, alpha);
        res.metallic = 0.0;
        res.ao = mix(baseAO, layerBlendAO, alpha);
    } else {
        res.albedo = baseAlbedo;
        res.normal = baseN;
        res.roughness = baseRoughness;
        res.metallic = 0.0;
        res.ao = baseAO;
    }

    return res;
}

fn computeDistantLayersAlbedo(
    globalUV: vec2<f32>,
    worldTileUV: vec2<f32>,
    ddxGlobalUV: vec2<f32>,
    ddyGlobalUV: vec2<f32>,
    ddxWorldTileUV: vec2<f32>,
    ddyWorldTileUV: vec2<f32>
) -> vec3<f32> {
    let activeLayerCount = uniforms.activeLayerCount;
    if (activeLayerCount == 0u) {
        return uniforms.color.rgb;
    }

    // 🌟 원경 최적화: 스플랫맵 1회 샘플링으로 모든 레이어 가중치 일괄 판별
    let weightMapSample = textureSampleGrad(layerWeightMapArray, baseColorTextureSampler, globalUV, 0, ddxGlobalUV, ddyGlobalUV);

    var totalLayerWeight = 0.0;
    var blendedAlbedo = vec3<f32>(0.0);

    for (var i = 0u; i < activeLayerCount; i = i + 1u) {
        let layerParams = uniforms.layerParams[i];
        if (layerParams.enabled <= 0.5) { continue; }

        let chIdx = u32(layerParams.weightChannelIndex + 0.5);
        var weightVal = weightMapSample.r;
        if (chIdx == 1u) { weightVal = weightMapSample.g; }
        else if (chIdx == 2u) { weightVal = weightMapSample.b; }
        else if (chIdx == 3u) {
            let isAlphaFull = weightMapSample.a >= 0.99;
            let remainingWeight = clamp(1.0 - (weightMapSample.r + weightMapSample.g + weightMapSample.b), 0.0, 1.0);
            weightVal = select(weightMapSample.a, remainingWeight, isAlphaFull);
        }
        let layerW = clamp(weightVal, 0.0, 1.0);

        if (layerW <= 0.01) { continue; }

        let layerIdx = i32(i);
        let layerUV = worldTileUV * layerParams.uvScale + layerParams.uvOffset;
        let ddxLayerUV = ddxWorldTileUV * layerParams.uvScale;
        let ddyLayerUV = ddyWorldTileUV * layerParams.uvScale;

        let layerAlbedoSample = textureSampleGrad(layerBaseColorArray, baseColorTextureSampler, layerUV, layerIdx, ddxLayerUV, ddyLayerUV);
        let layerAlbedo = layerAlbedoSample.rgb * layerParams.tintColor.rgb;

        blendedAlbedo += layerAlbedo * layerW;
        totalLayerWeight += layerW;
    }

    if (totalLayerWeight > 0.001) {
        let invW = 1.0 / totalLayerWeight;
        let layerBlendAlbedo = blendedAlbedo * invW;
        let alpha = clamp(totalLayerWeight, 0.0, 1.0);
        return mix(uniforms.color.rgb, layerBlendAlbedo, alpha);
    }

    return uniforms.color.rgb;
}

fn getSpecularNDF(NdotH: f32, roughness: f32) -> f32 {
    let alpha = roughness * roughness;
    let alpha2 = alpha * alpha;
    let NdotH2 = NdotH * NdotH;
    let nom = alpha2;
    let denom = (NdotH2 * (alpha2 - 1.0) + 1.0);
    let denomSquared = denom * denom;
    return nom / max(EPSILON, denomSquared * PI);
}

fn getSpecularVisibility(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
    let alpha = roughness * roughness;
    let alpha2 = alpha * alpha;
    let safeNdotV = max(NdotV, 1e-4);
    let safeNdotL = max(NdotL, 1e-4);
    let GGXV = safeNdotL * sqrt(safeNdotV * safeNdotV * (1.0 - alpha2) + alpha2);
    let GGXL = safeNdotV * sqrt(safeNdotL * safeNdotL * (1.0 - alpha2) + alpha2);
    return 0.5 / max(GGXV + GGXL, EPSILON);
}

fn getRoughnessFresnel(cosTheta: f32, F0: vec3<f32>, roughness: f32) -> vec3<f32> {
    let maxF = max(vec3<f32>(1.0 - roughness), F0);
    return F0 + (maxF - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

fn getDirectSpecularBRDF(
    F: vec3<f32>,
    roughness: f32,
    NdotH: f32,
    NdotV: f32,
    NdotL: f32
) -> vec3<f32> {
    let D = getSpecularNDF(NdotH, roughness);
    let V = getSpecularVisibility(NdotV, NdotL, roughness);
    return D * V * F;
}

fn getDirectDiffuseBRDF(
    NdotL: f32,
    NdotV: f32,
    LdotH: f32,
    roughness: f32,
    albedo: vec3<f32>
) -> vec3<f32> {
    if (NdotL <= 0.0) { return vec3<f32>(0.0); }
    let energyBias = mix(0.0, 0.5, roughness);
    let energyFactor = mix(1.0, 1.0 / 1.51, roughness);
    let fd90 = energyBias + 2.0 * LdotH * LdotH * roughness;
    let f0 = 1.0;
    let lightScatter = f0 + (fd90 - f0) * pow(1.0 - NdotL, 5.0);
    let viewScatter = f0 + (fd90 - f0) * pow(1.0 - NdotV, 5.0);
    return albedo * NdotL * lightScatter * viewScatter * energyFactor;
}

fn getDirectPbrLight(
    lightColor: vec3<f32>,
    N: vec3<f32>,
    V: vec3<f32>,
    L: vec3<f32>,
    NdotV: f32,
    roughnessParameter: f32,
    albedo: vec3<f32>
) -> vec3<f32> {
    let NdotL = max(dot(N, L), 0.0);
    if (NdotL <= 0.0) {
        return vec3<f32>(0.0);
    }
    let H = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let LdotH = max(dot(L, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    let F0 = vec3<f32>(0.04);
    let F = getRoughnessFresnel(VdotH, F0, roughnessParameter);
    let SPEC_BRDF = getDirectSpecularBRDF(F, roughnessParameter, NdotH, NdotV, NdotL);
    let diffuse_reflection = getDirectDiffuseBRDF(NdotL, NdotV, LdotH, roughnessParameter, albedo);

    let directLight = (SPEC_BRDF * NdotL) + (vec3<f32>(1.0) - F) * diffuse_reflection;
    return directLight * lightColor;
}

fn getDirectPbrLighting(
    input_vertexPosition: vec3<f32>,
    N: vec3<f32>,
    V: vec3<f32>,
    NdotV: f32,
    roughnessParameter: f32,
    albedo: vec3<f32>,
    visibility: f32
) -> vec3<f32> {
    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let lightIntensity = u_directionalLights[i].intensity;
        let L = -normalize(u_directionalLights[i].direction);
        let shadowFactor = select(1.0, visibility, i == 0u);
        var finalLightColor = u_directionalLights[i].color * lightIntensity * systemUniforms.preExposure * shadowFactor;

        if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let surfaceHeightKm = max(0.0, input_vertexPosition.y / 1000.0);
            let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, L.y, u_atmo.atmosphereHeight);
            finalLightColor *= atmosphereTransmittance;
        }

        totalDirectLighting += getDirectPbrLight(
            finalLightColor,
            N, V, L, NdotV,
            roughnessParameter, albedo
        );
    }

    return totalDirectLighting;
}

fn getIndirectPbrLighting(
    N: vec3<f32>,
    V: vec3<f32>,
    NdotV: f32,
    albedo: vec3<f32>,
    roughnessParameter: f32,
    occlusionParameter: f32
) -> vec3<f32> {
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;
    let preExposure = systemUniforms.preExposure;
    let F0 = vec3<f32>(0.04);

    if (u_usePrefilterTexture || u_useSkyAtmosphere) {
        let R = getReflectionVectorFromViewDirection(V, N);
        let NdotV_IBL = max(abs(dot(N, V)), 0.04);
        var reflectedColor = vec3<f32>(0.0);
        var iblDiffuseColor = vec3<f32>(0.0);

        if (u_usePrefilterTexture) {
            let iblMipmapCount = f32(textureNumLevels(ibl_prefilterTexture) - 1);
            let mipLevel = roughnessParameter * iblMipmapCount;
            reflectedColor = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, R, mipLevel).rgb * preExposure * systemUniforms.iblIntensity;
            iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0).rgb * preExposure * systemUniforms.iblIntensity;
        }

        if (u_useSkyAtmosphere) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let camH = u_atmo.cameraHeight;
            let atmH = u_atmo.atmosphereHeight;
            let skyIntensity = u_atmo.sunIntensity;
            let specTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, R.y, atmH);
            let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
            let atmoMipLevel = roughnessParameter * atmoMipCount;
            let specSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, R, atmoMipLevel).rgb * skyIntensity * preExposure;
            reflectedColor = (reflectedColor * specTrans) + specSkyScat;

            let diffTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, N.y, atmH);
            let skyIrradiance = textureSampleLevel(atmosphereIrradianceLUT, atmosphereSampler, N, 0.0).rgb * skyIntensity * preExposure;
            iblDiffuseColor = (iblDiffuseColor * diffTrans) + skyIrradiance;
        }

        let envBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, clamp(vec2<f32>(NdotV_IBL, roughnessParameter), vec2<f32>(0.005), vec2<f32>(0.995)), 0.0).rg;
        let energyCompensation = 1.0 + F0 * (1.0 / max(envBRDF.x + envBRDF.y, 1e-4) - 1.0);
        reflectedColor *= energyCompensation;

        let horizonOcclusion = saturate(1.0 + 1.1 * dot(R, N));
        reflectedColor *= horizonOcclusion * horizonOcclusion;

        let F_IBL = F0 * envBRDF.x + vec3<f32>(envBRDF.y);
        let kD = vec3<f32>(1.0) - F_IBL;

        return ((kD * albedo * iblDiffuseColor) + (reflectedColor * F_IBL)) * occlusionParameter;
    } else {
        let ambientContribution = albedo * systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * preExposure;
        return ambientContribution * occlusionParameter;
    }
}

// 🌟 [원경 고속 Diffuse-Only IBL] 스펙큘러 텍스처 4개(프리필터, BRDF LUT 등) 생략으로 텍스처 대역폭 급감!
fn getDistantIndirectPbrLighting(
    N: vec3<f32>,
    albedo: vec3<f32>,
    occlusionParameter: f32
) -> vec3<f32> {
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;
    let preExposure = systemUniforms.preExposure;

    if (u_usePrefilterTexture || u_useSkyAtmosphere) {
        var iblDiffuseColor = vec3<f32>(0.0);

        if (u_usePrefilterTexture) {
            iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0).rgb * preExposure * systemUniforms.iblIntensity;
        }

        if (u_useSkyAtmosphere) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let camH = u_atmo.cameraHeight;
            let atmH = u_atmo.atmosphereHeight;
            let skyIntensity = u_atmo.sunIntensity;
            let diffTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, N.y, atmH);
            let skyIrradiance = textureSampleLevel(atmosphereIrradianceLUT, atmosphereSampler, N, 0.0).rgb * skyIntensity * preExposure;
            iblDiffuseColor = (iblDiffuseColor * diffTrans) + skyIrradiance;
        }

        return albedo * iblDiffuseColor * occlusionParameter;
    } else {
        let ambientContribution = albedo * systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * preExposure;
        return ambientContribution * occlusionParameter;
    }
}

const bayerMatrix4x4 = array<f32, 16>(
     0.0 / 16.0,  8.0 / 16.0,  2.0 / 16.0, 10.0 / 16.0,
    12.0 / 16.0,  4.0 / 16.0, 14.0 / 16.0,  6.0 / 16.0,
     3.0 / 16.0, 11.0 / 16.0,  1.0 / 16.0,  9.0 / 16.0,
    15.0 / 16.0,  7.0 / 16.0, 13.0 / 16.0,  5.0 / 16.0
);

fn getBayerDither4x4(pixelCoord: vec2<f32>) -> f32 {
    let x = u32(pixelCoord.x) % 4u;
    let y = u32(pixelCoord.y) % 4u;
    return bayerMatrix4x4[y * 4u + x];
}

fn computeLandscapeHeightmapShadow(
    worldPos: vec3<f32>,
    L: vec3<f32>,
    worldSizeX: f32,
    worldSizeZ: f32,
    vhtTexSize: vec2<f32>,
    heightScale: f32,
    maxDistance: f32,
    stepsF: f32,
    softness: f32
) -> f32 {
    let stepCount = u32(clamp(stepsF, 4.0, 48.0));
    let fStepCount = f32(stepCount);
    let minDistance = 15.0;
    let distRange = max(1.0, maxDistance - minDistance);

    var shadowFactor: f32 = 1.0;

    // 🚀 [최적화 8.10] 루프 불변식 호이스팅: 나눗셈 24회를 루프 밖 1회로 인출하여 FMA 연산으로 전환
    let invWorldSize = vec2<f32>(1.0 / worldSizeX, 1.0 / worldSizeZ);
    let baseUV = (worldPos.xz + vec2<f32>(worldSizeX, worldSizeZ) * 0.5) * invWorldSize;
    let uvDir = L.xz * invWorldSize;

    for (var i = 0u; i < stepCount; i = i + 1u) {
        let u = (f32(i) + 0.5) / fStepCount;
        let t = minDistance + distRange * (u * u);
        let samplePosY = worldPos.y + L.y * t;

        // FMA 1회로 UV 계산 (스텝당 나눗셈 2회 완전 제거)
        let uv = baseUV + uvDir * t;

        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
            break;
        }

        let texCoord = vec2<i32>(clamp(uv * vhtTexSize, vec2<f32>(0.0), vhtTexSize - vec2<f32>(1.0)));
        let terrainHeight = textureLoad(heightMapTexture, texCoord, 0).r * heightScale;
        let diff = samplePosY - terrainHeight;

        if (diff < 0.0) {
            return 0.0;
        }

        let penumbra = clamp(diff * softness / t, 0.0, 1.0);
        shadowFactor = min(shadowFactor, penumbra);

        if (shadowFactor <= 0.001) {
            return 0.0;
        }
    }

    return shadowFactor;
}

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;

    let input_vertexPosition = inputData.vertexPosition;
    let u_cameraPosition = systemUniforms.camera.cameraPosition;
    let globalUV = inputData.uv1;
    let lod = inputData.lodLevel;
    let worldTileUV = inputData.uv;

    let ddxGlobalUV = dpdx(globalUV);
    let ddyGlobalUV = dpdy(globalUV);
    let ddxWorldTileUV = dpdx(worldTileUV);
    let ddyWorldTileUV = dpdy(worldTileUV);

    var albedo: vec3<f32>;
    var N: vec3<f32>;
    var roughnessFactor: f32;
    var ambientOcclusion: f32;

    let rawViewDist = distance(u_cameraPosition, input_vertexPosition);
    let isScreenSize = landscapeInstanceUniforms.lodMetric >= 0.5;
    let viewDist = select(rawViewDist, rawViewDist * landscapeInstanceUniforms.tanHalfFOV, isScreenSize);

    if (lod < 1.5) {
        let lod0Dist = max(1.0, sqrt(landscapeInstanceUniforms.lodDistancesSq[0].x));
        let fadeRatio = clamp(select(0.7, landscapeInstanceUniforms.lodFadeStartRatio, landscapeInstanceUniforms.lodFadeStartRatio > 0.0), 0.0, 0.99);
        let fadeStart = lod0Dist * fadeRatio;
        let fadeEnd = lod0Dist;
        let fade = smoothstep(fadeStart, fadeEnd, viewDist);
        let ditherThreshold = getBayerDither4x4(inputData.position.xy);
        let useVBT = fade > ditherThreshold;

        if (useVBT) {
            let vbtAlbedoRaw = textureSampleGrad(vbtBaseColorAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV).rgb;
            let isBaked = length(vbtAlbedoRaw) > 0.001;

            if (isBaked) {
                // 🌟 [최적화 8.8] 베이킹 완료 타일은 전역 VNT 노멀맵을 100% 생략하고 VBT 노멀 직접 사용
                let vbtNormalEncoded = textureSampleGrad(vbtNormalAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV).rgb;
                let vbtORM = textureSampleGrad(vbtORMAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV);
                albedo = vbtAlbedoRaw;
                N = normalize(vbtNormalEncoded * 2.0 - vec3<f32>(1.0));
                roughnessFactor = max(0.04, vbtORM.g);
                ambientOcclusion = vbtORM.r;
            } else {
                let baseN = getBaseNormal(globalUV);
                let direct = computeDirectLayersPBR(globalUV, worldTileUV, ddxGlobalUV, ddyGlobalUV, ddxWorldTileUV, ddyWorldTileUV, baseN);
                albedo = direct.albedo;
                N = direct.normal;
                roughnessFactor = direct.roughness;
                ambientOcclusion = direct.ao;
            }
        } else {
            let baseN = getBaseNormal(globalUV);
            let direct = computeDirectLayersPBR(globalUV, worldTileUV, ddxGlobalUV, ddyGlobalUV, ddxWorldTileUV, ddyWorldTileUV, baseN);
            albedo = direct.albedo;
            N = direct.normal;
            roughnessFactor = direct.roughness;
            ambientOcclusion = direct.ao;
        }
    } else {
        let vbtAlbedoRaw = textureSampleGrad(vbtBaseColorAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV).rgb;
        let isBaked = length(vbtAlbedoRaw) > 0.001;

        if (isBaked) {
            // 🌟 [최적화 8.8] 베이킹 완료 원경 타일도 전역 VNT 노멀맵 생략
            let vbtNormalEncoded = textureSampleGrad(vbtNormalAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV).rgb;
            let vbtORM = textureSampleGrad(vbtORMAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV);
            albedo = vbtAlbedoRaw;
            N = normalize(vbtNormalEncoded * 2.0 - vec3<f32>(1.0));
            roughnessFactor = max(0.04, vbtORM.g);
            ambientOcclusion = vbtORM.r;
        } else {
            // 🌟 [원경 스마트 레이어 블렌딩] 미베이킹 상태에서도 스플랫맵 기반 레이어 색상(잔디, 바위, 자갈 등)을 100% 온전히 표현!
            // 동시에 원경에서 식별 불가능한 노멀/ORM 텍스처 8~12개 샘플링을 생략하여 60FPS 완벽 방어
            albedo = computeDistantLayersAlbedo(globalUV, worldTileUV, ddxGlobalUV, ddyGlobalUV, ddxWorldTileUV, ddyWorldTileUV);
            N = getBaseNormal(globalUV);
            roughnessFactor = 0.85;
            ambientOcclusion = 1.0;
        }
    }

    if (inputData.instanceColor.a > 0.0) {
        albedo = mix(albedo, inputData.instanceColor.rgb, 0.6);
    }

    let V: vec3<f32> = getViewDirection(input_vertexPosition, u_cameraPosition);
    let NdotV = max(abs(dot(N, V)), 0.04);
    let roughnessParameter = max(roughnessFactor, 0.04);

    let receiveShadowYn = inputData.receiveShadow != 0.0 && systemUniforms.directionalLightCount > 0u;
    var L = vec3<f32>(0.0, 1.0, 0.0);
    if (systemUniforms.directionalLightCount > 0u) {
        L = -normalize(systemUniforms.directionalLights[0].direction);
    }
    let NdotL = dot(N, L);

    var visibility = 1.0;

    // 🚀 [하이브리드 섀도우 디커플링]
    // 1. 거대 산맥 그림자(Heightmap Raymarching): 카메라 거리와 무관하게 항상 실행하여 골짜기 산그림자 영구 보존
    // 2. 식생/메시 그림자(CSM): 근거리(0~maxCSMDist)에서만 실행하여 산맥 그림자와 합성, 원경(maxCSMDist~)은 CSM 16~32탭 완전 생략(0ms)
    if (receiveShadowYn && NdotL > 0.001) {
        var terrainShadowVis = 1.0;
        if (landscapeInstanceUniforms.heightmapShadow > 0.5 && L.y > 0.01) {
            let terrainSelfShadow = computeLandscapeHeightmapShadow(
                input_vertexPosition,
                L,
                landscapeInstanceUniforms.worldSizeX,
                landscapeInstanceUniforms.worldSizeZ,
                landscapeInstanceUniforms.vhtTextureSize,
                landscapeInstanceUniforms.heightScale,
                landscapeInstanceUniforms.heightmapShadowDistance,
                landscapeInstanceUniforms.heightmapShadowSteps,
                landscapeInstanceUniforms.heightmapShadowSoftness
            );
            terrainShadowVis = mix(1.0 - systemUniforms.shadow.directionalShadowStrength, 1.0, terrainSelfShadow);
        }

        let cascadeCount = min(4u, max(1u, systemUniforms.shadow.cascadeCount));
        let maxCSMDist = systemUniforms.shadow.cascadeSplitDepths[cascadeCount - 1u];

        if (rawViewDist < maxCSMDist) {
            // 🟢 [근거리: 0 ~ maxCSMDist] 식생/오브젝트 그림자를 CSM에서 읽어 산맥 그림자와 합성
            let rawVisibility: f32 = getDirectionalShadowVisibility(
                directionalShadowMap,
                directionalShadowMapSampler,
                input_vertexPosition,
                N,
                L
            );
            let csmVisibility = mix(1.0 - systemUniforms.shadow.directionalShadowStrength, 1.0, rawVisibility);
            visibility = min(csmVisibility, terrainShadowVis);
        } else {
            // 🏔️ [원경: maxCSMDist 이상] 무거운 CSM 16~32탭 완전 생략(0회)! 오직 산맥 Raymarching만 적용!
            visibility = terrainShadowVis;
        }
    }

    let directLighting = getDirectPbrLighting(
        input_vertexPosition,
        N, V, NdotV,
        roughnessParameter, albedo,
        visibility
    );

    var indirectLighting = vec3<f32>(0.0);
    if (lod < 1.5) {
        indirectLighting = getIndirectPbrLighting(
            N, V, NdotV,
            albedo,
            roughnessParameter,
            ambientOcclusion
        );
    } else {
        // 🌟 [원경 지형 Diffuse-Only IBL] 스펙큘러 관련 4개 텍스처 생략으로 60FPS 완벽 방어
        indirectLighting = getDistantIndirectPbrLighting(
            N,
            albedo,
            ambientOcclusion
        );
    }

    let finalColor = vec4<f32>(directLighting + indirectLighting, 1.0);

    output.color = finalColor;
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);
    return output;
}
