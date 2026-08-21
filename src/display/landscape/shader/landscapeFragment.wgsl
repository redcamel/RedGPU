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
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,
    @location(6) vertexHeight: f32,
    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(9) instanceColor: vec4<f32>,
    @location(10) @interpolate(flat) lodLevel: f32,
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
    weightMapChannelIndex: f32,
    pad0: f32,
    pad1: f32,
};

struct MaterialUniforms {
    activeLayerCount: u32,
    pad0: u32,
    pad1: u32,
    pad2: u32,
    color: vec4<f32>,
    layers: array<LandscapeLayerParams, 8>,
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
};

@group(1) @binding(3) var vhtHeightAtlasTexture: texture_2d<f32>;
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

fn computeDirectLayersPBR(
    globalUV: vec2<f32>,
    worldTileUV: vec2<f32>,
    ddxGlobalUV: vec2<f32>,
    ddyGlobalUV: vec2<f32>,
    ddxWorldTileUV: vec2<f32>,
    ddyWorldTileUV: vec2<f32>,
    baseN: vec3<f32>,
    vertexHeight: f32,
    slopeAngleDeg: f32
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
    var blendedMetallic = 0.0;
    var blendedAO = 0.0;

    for (var i = 0u; i < activeLayerCount; i = i + 1u) {
        let layerParams = uniforms.layers[i];
        if (layerParams.enabled <= 0.5) { continue; }

        let layerIdx = i32(i);
        var weightMapSample = textureSampleGrad(layerWeightMapArray, baseColorTextureSampler, globalUV, layerIdx, ddxGlobalUV, ddyGlobalUV);
        if (length(weightMapSample) <= 0.0001 && layerIdx > 0) {
            weightMapSample = textureSampleGrad(layerWeightMapArray, baseColorTextureSampler, globalUV, 0, ddxGlobalUV, ddyGlobalUV);
        }
        let chIdx = u32(layerParams.weightMapChannelIndex + 0.5);
        var weightVal = weightMapSample.r;
        if (chIdx == 1u) { weightVal = weightMapSample.g; }
        else if (chIdx == 2u) { weightVal = weightMapSample.b; }
        else if (chIdx == 3u) {
            let isAlphaFull = weightMapSample.a >= 0.99;
            let remainingWeight = clamp(1.0 - (weightMapSample.r + weightMapSample.g + weightMapSample.b), 0.0, 1.0);
            weightVal = select(weightMapSample.a, remainingWeight, isAlphaFull);
        }
        let layerW = clamp(weightVal, 0.0, 1.0);

        if (layerW <= 0.0001) { continue; }

        let layerUV = worldTileUV * layerParams.uvScale + layerParams.uvOffset;
        let ddxLayerUV = ddxWorldTileUV * layerParams.uvScale;
        let ddyLayerUV = ddyWorldTileUV * layerParams.uvScale;

        let layerAlbedoSample = textureSampleGrad(layerBaseColorArray, baseColorTextureSampler, layerUV, layerIdx, ddxLayerUV, ddyLayerUV);
        let layerNormalRaw = textureSampleGrad(layerNormalArray, baseColorTextureSampler, layerUV, layerIdx, ddxLayerUV, ddyLayerUV).rgb * 2.0 - vec3<f32>(1.0);
        let layerNormalSample = vec3<f32>(layerNormalRaw.xy * layerParams.normalIntensity, max(0.01, layerNormalRaw.z));
        let layerORMSample = textureSampleGrad(layerORMArray, baseColorTextureSampler, layerUV, layerIdx, ddxLayerUV, ddyLayerUV);

        let layerAlbedo = layerAlbedoSample.rgb * layerParams.tintColor.rgb;
        let layerRoughness = layerParams.roughness * layerORMSample.g;
        let layerMetallic = layerParams.metallic * layerORMSample.b;
        let rawAO = select(1.0, layerORMSample.r, layerORMSample.r > 0.001);
        let layerAO = clamp(mix(1.0, rawAO, layerParams.aoIntensity), 0.2, 1.0);

        blendedAlbedo += layerAlbedo * layerW;
        blendedNormalTangent += layerNormalSample * layerW;
        blendedRoughness += layerRoughness * layerW;
        blendedMetallic += layerMetallic * layerW;
        blendedAO += layerAO * layerW;

        totalLayerWeight += layerW;
    }

    if (totalLayerWeight > 0.0001) {
        let invW = 1.0 / totalLayerWeight;
        let layerBlendAlbedo = blendedAlbedo * invW;
        let layerBlendNormal = normalize(blendedNormalTangent);
        let layerBlendRoughness = blendedRoughness * invW;
        let layerBlendMetallic = blendedMetallic * invW;
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
        res.metallic = mix(baseMetallic, layerBlendMetallic, alpha);
        res.ao = mix(baseAO, layerBlendAO, alpha);
    } else {
        res.albedo = baseAlbedo;
        res.normal = baseN;
        res.roughness = baseRoughness;
        res.metallic = baseMetallic;
        res.ao = baseAO;
    }

    return res;
}

fn getDielectricF0(ior: f32) -> vec3<f32> {
    let f0_factor = (ior - 1.0) / (ior + 1.0);
    return vec3<f32>(f0_factor * f0_factor);
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
    metallicParameter: f32,
    albedo: vec3<f32>,
    F0: vec3<f32>
) -> vec3<f32> {
    let NdotL = max(dot(N, L), 0.0);
    if (NdotL <= 0.0) {
        return vec3<f32>(0.0);
    }
    let H = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let LdotH = max(dot(L, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    let F = getRoughnessFresnel(VdotH, F0, roughnessParameter);
    let SPEC_BRDF = getDirectSpecularBRDF(F, roughnessParameter, NdotH, NdotV, NdotL);
    let diffuse_reflection = getDirectDiffuseBRDF(NdotL, NdotV, LdotH, roughnessParameter, albedo);

    let dielectricPart = (SPEC_BRDF * NdotL) + (vec3<f32>(1.0) - F) * diffuse_reflection;
    let metallicPart = SPEC_BRDF * NdotL;
    let directLight = mix(dielectricPart, metallicPart, metallicParameter);

    return directLight * lightColor;
}

fn getDirectPbrLighting(
    input_vertexPosition: vec3<f32>,
    N: vec3<f32>,
    V: vec3<f32>,
    NdotV: f32,
    roughnessParameter: f32,
    metallicParameter: f32,
    albedo: vec3<f32>,
    F0: vec3<f32>
) -> vec3<f32> {
    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let lightIntensity = u_directionalLights[i].intensity;
        let L = -normalize(u_directionalLights[i].direction);
        var finalLightColor = u_directionalLights[i].color * lightIntensity * systemUniforms.preExposure;

        if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let surfaceHeightKm = max(0.0, input_vertexPosition.y / 1000.0);
            let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, L.y, u_atmo.atmosphereHeight);
            finalLightColor *= atmosphereTransmittance;
        }

        totalDirectLighting += getDirectPbrLight(
            finalLightColor,
            N, V, L, NdotV,
            roughnessParameter, metallicParameter, albedo,
            F0
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
    metallicParameter: f32,
    F0: vec3<f32>,
    occlusionParameter: f32
) -> vec3<f32> {
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;
    let preExposure = systemUniforms.preExposure;

    if (u_usePrefilterTexture || u_useSkyAtmosphere) {
        let R = getReflectionVectorFromViewDirection(V, N);
        let NdotV_IBL = max(abs(dot(N, V)), 0.04);
        var reflectedColor = vec3<f32>(0.0);
        var iblDiffuseColor = vec3<f32>(0.0);

        if (u_usePrefilterTexture) {
            let iblMipmapCount = f32(textureNumLevels(ibl_prefilterTexture) - 1);
            let mipLevel = roughnessParameter * iblMipmapCount;
            reflectedColor = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, R, mipLevel).rgb * preExposure * systemUniforms.iblIntensity;
            iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0).rgb * preExposure * systemUniforms.iblIntensity * INV_PI;
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
        let kD = (vec3<f32>(1.0) - F_IBL) * (1.0 - metallicParameter);

        return ((kD * albedo * iblDiffuseColor) + (reflectedColor * F_IBL)) * occlusionParameter;
    } else {
        let ambientContribution = albedo * systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * preExposure;
        return ambientContribution * occlusionParameter;
    }
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
    var metallicFactor: f32;
    var ambientOcclusion: f32;

    let viewDist = distance(u_cameraPosition, input_vertexPosition);

    if (lod < 1.5) {
        let vntSample = textureSampleLevel(vntNormalTexture, baseColorTextureSampler, globalUV, 0.0).rgb;
        let baseN = normalize(select(vntSample * 2.0 - vec3<f32>(1.0), vec3<f32>(0.0, 1.0, 0.0), length(vntSample) <= 0.001));
        let slopeAngleDeg = acos(clamp(baseN.y, -1.0, 1.0)) * 57.295779513;

        let lod0Dist = max(1.0, sqrt(landscapeInstanceUniforms.lodDistancesSq[0].x));
        let fadeRatio = clamp(select(0.7, landscapeInstanceUniforms.lodFadeStartRatio, landscapeInstanceUniforms.lodFadeStartRatio > 0.0), 0.0, 0.99);
        let fadeStart = lod0Dist * fadeRatio;
        let fadeEnd = lod0Dist;
        let fade = smoothstep(fadeStart, fadeEnd, viewDist);

        if (fade >= 0.999) {
            let vbtAlbedoRaw = textureSampleGrad(vbtBaseColorAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV).rgb;
            let vbtNormalEncoded = textureSampleGrad(vbtNormalAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV).rgb;
            let vbtORM = textureSampleGrad(vbtORMAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV);

            let isBaked = length(vbtAlbedoRaw) > 0.001;
            if (isBaked) {
                albedo = vbtAlbedoRaw;
                N = normalize(select(vbtNormalEncoded * 2.0 - vec3<f32>(1.0), baseN, length(vbtNormalEncoded) <= 0.001));
                roughnessFactor = max(0.04, vbtORM.g);
                metallicFactor = vbtORM.b;
                ambientOcclusion = vbtORM.r;
            } else {
                let direct = computeDirectLayersPBR(globalUV, worldTileUV, ddxGlobalUV, ddyGlobalUV, ddxWorldTileUV, ddyWorldTileUV, baseN, inputData.vertexHeight, slopeAngleDeg);
                albedo = direct.albedo;
                N = direct.normal;
                roughnessFactor = direct.roughness;
                metallicFactor = direct.metallic;
                ambientOcclusion = direct.ao;
            }
        } else {
            let direct = computeDirectLayersPBR(globalUV, worldTileUV, ddxGlobalUV, ddyGlobalUV, ddxWorldTileUV, ddyWorldTileUV, baseN, inputData.vertexHeight, slopeAngleDeg);

            if (fade <= 0.001) {
                albedo = direct.albedo;
                N = direct.normal;
                roughnessFactor = direct.roughness;
                metallicFactor = direct.metallic;
                ambientOcclusion = direct.ao;
            } else {
                let vbtAlbedoRaw = textureSampleGrad(vbtBaseColorAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV).rgb;
                let vbtNormalEncoded = textureSampleGrad(vbtNormalAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV).rgb;
                let vbtORM = textureSampleGrad(vbtORMAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV);

                let isBaked = length(vbtAlbedoRaw) > 0.001;
                let vbtAlbedo = select(direct.albedo, vbtAlbedoRaw, isBaked);
                let vbtN = normalize(select(vbtNormalEncoded * 2.0 - vec3<f32>(1.0), baseN, length(vbtNormalEncoded) <= 0.001));

                albedo = mix(direct.albedo, vbtAlbedo, fade);
                N = normalize(mix(direct.normal, vbtN, fade));
                roughnessFactor = mix(direct.roughness, max(0.04, select(direct.roughness, vbtORM.g, isBaked)), fade);
                metallicFactor = mix(direct.metallic, select(direct.metallic, vbtORM.b, isBaked), fade);
                ambientOcclusion = mix(direct.ao, select(direct.ao, vbtORM.r, isBaked), fade);
            }
        }
    } else {
        let vbtAlbedoRaw = textureSampleGrad(vbtBaseColorAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV).rgb;
        let vbtNormalEncoded = textureSampleGrad(vbtNormalAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV).rgb;
        let vbtORM = textureSampleGrad(vbtORMAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV);

        let isBaked = length(vbtAlbedoRaw) > 0.001;
        if (isBaked) {
            albedo = vbtAlbedoRaw;
            N = normalize(select(vbtNormalEncoded * 2.0 - vec3<f32>(1.0), vec3<f32>(0.0, 1.0, 0.0), length(vbtNormalEncoded) <= 0.001));
            roughnessFactor = max(0.04, vbtORM.g);
            metallicFactor = vbtORM.b;
            ambientOcclusion = vbtORM.r;
        } else {
            let direct = computeDirectLayersPBR(globalUV, worldTileUV, ddxGlobalUV, ddyGlobalUV, ddxWorldTileUV, ddyWorldTileUV, vec3<f32>(0.0, 1.0, 0.0), inputData.vertexHeight, 0.0);
            albedo = direct.albedo;
            N = direct.normal;
            roughnessFactor = direct.roughness;
            metallicFactor = direct.metallic;
            ambientOcclusion = direct.ao;
        }
    }

    if (inputData.instanceColor.a > 0.0) {
        albedo = mix(albedo, inputData.instanceColor.rgb, 0.6);
    }

    let V: vec3<f32> = getViewDirection(input_vertexPosition, u_cameraPosition);
    let NdotV = max(abs(dot(N, V)), 0.04);

    let F0_dielectric = vec3<f32>(0.04);
    let F0_metal = albedo;
    let F0 = mix(F0_dielectric, F0_metal, metallicFactor);
    let roughnessParameter = max(roughnessFactor, 0.04);

    let directLighting = getDirectPbrLighting(
        input_vertexPosition,
        N, V, NdotV,
        roughnessParameter, metallicFactor, albedo,
        F0
    );

    let indirectLighting = getIndirectPbrLighting(
        N, V, NdotV,
        albedo,
        roughnessParameter, metallicFactor,
        F0,
        ambientOcclusion
    );

    let finalColor = vec4<f32>(directLighting + indirectLighting, 1.0);

    output.color = finalColor;
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);
    return output;
}
