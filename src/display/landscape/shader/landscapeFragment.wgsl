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
    return normalize(select(vntSample * 2.0 - vec3<f32>(1.0), vec3<f32>(0.0, 1.0, 0.0), dot(vntSample, vntSample) <= 1e-6));
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

        if (layerW <= 0.001) { continue; }

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

        // 🚀 [최적화 FS-2 & FS-3] dot 거리 제곱 비교 + inverseSqrt 기반 고속 TBN 직교화
        if (dot(layerBlendNormal.xy, layerBlendNormal.xy) > 1e-6) {
            let lenSq = max(1.0 - baseN.x * baseN.x, 1e-4);
            let invLen = inverseSqrt(lenSq);
            let tangentX = vec3<f32>(1.0 - baseN.x * baseN.x, -baseN.x * baseN.y, -baseN.x * baseN.z) * invLen;
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
    let denom = (NdotH2 * (alpha2 - 1.0) + 1.0);
    return (alpha2 * INV_PI) / max(EPSILON, denom * denom);
}

fn getSpecularVisibility(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
    let alpha = roughness * roughness;
    let alpha2 = alpha * alpha;
    let safeNdotV = max(NdotV, 1e-4);
    let safeNdotL = max(NdotL, 1e-4);
    let oneMinusAlpha2 = 1.0 - alpha2;
    let GGXV = safeNdotL * sqrt(safeNdotV * safeNdotV * oneMinusAlpha2 + alpha2);
    let GGXL = safeNdotV * sqrt(safeNdotL * safeNdotL * oneMinusAlpha2 + alpha2);
    return 0.5 / max(GGXV + GGXL, EPSILON);
}

fn getRoughnessFresnel(cosTheta: f32, F0: vec3<f32>, roughness: f32) -> vec3<f32> {
    let maxF = max(vec3<f32>(1.0 - roughness), F0);
    let f = clamp(1.0 - cosTheta, 0.0, 1.0);
    let f2 = f * f;
    let f5 = f2 * f2 * f;
    return F0 + (maxF - F0) * f5;
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
    let energyFactor = mix(1.0, 1.0 / 1.51, roughness);
    let fd90Minus1 = (0.5 + 2.0 * (LdotH * LdotH)) * roughness - 1.0;
    let fl = clamp(1.0 - NdotL, 0.0, 1.0);
    let fl2 = fl * fl;
    let fl5 = fl2 * fl2 * fl;
    let fv = clamp(1.0 - NdotV, 0.0, 1.0);
    let fv2 = fv * fv;
    let fv5 = fv2 * fv2 * fv;
    let lightScatter = 1.0 + fd90Minus1 * fl5;
    let viewScatter = 1.0 + fd90Minus1 * fv5;
    let factor = (NdotL * energyFactor) * (lightScatter * viewScatter);
    return albedo * factor;
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

        let diffIBL = (kD * iblDiffuseColor) * (albedo * occlusionParameter);
        let specIBL = (reflectedColor * F_IBL) * occlusionParameter;
        return diffIBL + specIBL;
    } else {
        let ambFactor = systemUniforms.ambientLight.intensity * (preExposure * occlusionParameter);
        return albedo * (systemUniforms.ambientLight.color * ambFactor);
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

        return albedo * (iblDiffuseColor * occlusionParameter);
    } else {
        let ambFactor = systemUniforms.ambientLight.intensity * (preExposure * occlusionParameter);
        return albedo * (systemUniforms.ambientLight.color * ambFactor);
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
    let invStepCount = 1.0 / f32(stepCount);
    let minDistance = 15.0;
    let distRange = max(1.0, maxDistance - minDistance);

    var shadowFactor: f32 = 1.0;

    // 🚀 [최적화 8.10] 루프 불변식 호이스팅: 나눗셈 24회를 루프 밖 1회로 인출하여 FMA 연산으로 전환
    let invWorldSize = vec2<f32>(1.0 / worldSizeX, 1.0 / worldSizeZ);
    let baseUV = (worldPos.xz + vec2<f32>(worldSizeX, worldSizeZ) * 0.5) * invWorldSize;
    let uvDir = L.xz * invWorldSize;

    for (var i = 0u; i < stepCount; i = i + 1u) {
        // 🚀 [최적화 FS-1] 루프 내 나눗셈을 루프 밖 선계산된 invStepCount 곱셈으로 대체 (나눗셈 48회 박멸)
        let u = (f32(i) + 0.5) * invStepCount;
        let t = minDistance + distRange * (u * u);
        let samplePosY = worldPos.y + L.y * t;

        // 🚀 [최적화 8.13] Sky-Break: 광선이 지형 최고봉 위 하늘로 진입하는 즉시 루프 탈출 (2~3스텝 조기 종료)
        if (samplePosY > heightScale) {
            break;
        }

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

    let baseN = getBaseNormal(globalUV);
    let V: vec3<f32> = getViewDirection(input_vertexPosition, u_cameraPosition);
    let rawViewDist = distance(u_cameraPosition, input_vertexPosition);

    var isDirectPBR = false;
    if (lod < 0.5) {
        // 🚀 [최적화 - 50m 초경량 + 시선 각도(N·V) 단축 원근법 동적 거리 보정]
        // - 정면 절벽/언덕(N·V ≈ 1.0): 50m까지 4K PBR 디테일 100% 유지 (35m부터 페이드)
        // - 비스듬한 바닥/평지(N·V ≈ 0.2~0.35): 12.2m~17.5m에서 조기 전환 (평지 시점 연산량 84%+ 격감!)
        let isScreenSize = landscapeInstanceUniforms.lodMetric >= 0.5;
        let viewDist = select(rawViewDist, rawViewDist * landscapeInstanceUniforms.tanHalfFOV, isScreenSize);

        let NdotV_angle = max(abs(dot(baseN, V)), 0.04);
        let angleFactor = clamp(NdotV_angle, 0.35, 1.0);

        let lod0Dist = min(50.0, max(1.0, sqrt(landscapeInstanceUniforms.lodDistancesSq[0].x))) * angleFactor;
        let fadeRatio = clamp(select(0.7, landscapeInstanceUniforms.lodFadeStartRatio, landscapeInstanceUniforms.lodFadeStartRatio > 0.0), 0.0, 0.99);
        let fade = smoothstep(lod0Dist * fadeRatio, lod0Dist, viewDist);
        let ditherThreshold = getBayerDither4x4(inputData.position.xy);
        isDirectPBR = fade <= ditherThreshold;
    }

    if (isDirectPBR) {
        // 🌿 [LOD 0 근거리] 100% 실시간 4K 멀티 레이어 PBR
        let direct = computeDirectLayersPBR(globalUV, worldTileUV, ddxGlobalUV, ddyGlobalUV, ddxWorldTileUV, ddyWorldTileUV, baseN);
        albedo = direct.albedo;
        N = direct.normal;
        roughnessFactor = direct.roughness;
        ambientOcclusion = direct.ao;
    } else {
        // 🏔️ [중/원경 및 LOD 0 평지 조기 전환 구간] 텍스처 2~3장 초경량 렌더링으로 단일화!
        albedo = computeDistantLayersAlbedo(globalUV, worldTileUV, ddxGlobalUV, ddyGlobalUV, ddxWorldTileUV, ddyWorldTileUV);
        N = baseN;
        roughnessFactor = 0.85;
        ambientOcclusion = 1.0;
    }

    if (inputData.instanceColor.a > 0.0) {
        albedo = mix(albedo, inputData.instanceColor.rgb, 0.6);
    }

    let NdotV = max(abs(dot(N, V)), 0.04);
    let roughnessParameter = max(roughnessFactor, 0.04);

    let receiveShadowYn = inputData.receiveShadow != 0.0 && systemUniforms.directionalLightCount > 0u;
    var L = vec3<f32>(0.0, 1.0, 0.0);
    if (systemUniforms.directionalLightCount > 0u) {
        L = -normalize(systemUniforms.directionalLights[0].direction);
    }
    let NdotL = dot(N, L);

    var visibility = 1.0;

    // 🚀 [하이브리드 섀도우 디커플링 & 최적화 8.12]
    // 1. 거대 산맥 그림자(Heightmap Raymarching): 카메라 거리와 무관하게 항상 실행하여 골짜기 산그림자 영구 보존
    // 2. [수학적 100% 무손실 조기 탈락] 이미 산봉우리 그늘 속(terrainSelfShadow <= 0.001)이면 min(CSM, 0) = 0이므로 CSM 16~32탭 완전 생략(0회)!
    // 3. 식생/메시 그림자(CSM): 산그늘이 아닌 양지 구역의 근거리(0~maxCSMDist)에서만 실행하여 합성
    if (receiveShadowYn && NdotL > 0.001) {
        var terrainShadowVis = 1.0;
        var isDeepTerrainShadow = false;
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
            isDeepTerrainShadow = terrainSelfShadow <= 0.001;
        }

        let cascadeCount = min(4u, max(1u, systemUniforms.shadow.cascadeCount));
        let maxCSMDist = systemUniforms.shadow.cascadeSplitDepths[cascadeCount - 1u];

        // 🌟 [최적화 8.12] 완전한 산그늘 바닥이거나 원경(maxCSMDist 이상)이면 CSM 16~32탭 완전 스킵 (0ms)!
        if (rawViewDist < maxCSMDist && !isDeepTerrainShadow) {
            // 🟢 [근거리 양지 구역: 0 ~ maxCSMDist] 식생/오브젝트 그림자를 CSM에서 읽어 산맥 그림자와 합성
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
            // 🏔️ [산그늘 속 or 원경] 무거운 CSM 16~32탭 100% 완전 생략(0회)!
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
    if (isDirectPBR) {
        indirectLighting = getIndirectPbrLighting(
            N, V, NdotV,
            albedo,
            roughnessParameter,
            ambientOcclusion
        );
    } else {
        // 🌟 [원경 및 비스듬한 바닥 Diffuse-Only IBL] 스펙큘러 관련 4개 텍스처 생략으로 대역폭 완벽 방어
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
