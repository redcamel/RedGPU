#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.PI;
#redgpu_include math.PI2;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;
#redgpu_include math.direction.getViewDirection;
#redgpu_include skyAtmosphere.skyAtmosphereFn;
#redgpu_include shadow.getDirectionalShadowVisibility;
#redgpu_include math.getInterleavedGradientNoise;
#redgpu_include landscape.struct.LandscapeLayerParams;
#redgpu_include landscape.struct.LandscapeUniforms;
#redgpu_include landscape.tiling.stochasticTiling;

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

struct MaterialUniforms {
    activeLayerCount: u32,
    nearDetailDistance: f32,
    nearDetailFade: f32,
    pad2: u32,
    color: vec4<f32>,
    layerParams: array<LandscapeLayerParams, 8>,
};

struct NearDetailLayerResult {
    albedo: vec3<f32>,
    normal: vec3<f32>,
    roughness: f32,
    metallic: f32,
    ao: f32,
    isValid: bool,
};

@group(1) @binding(2) var heightMapTexture: texture_2d<f32>;
@group(1) @binding(3) var vntNormalTexture: texture_2d<f32>;
@group(1) @binding(4) var<uniform> landscapeInstanceUniforms: LandscapeUniforms;
@group(1) @binding(5) var vbtBaseColorAtlasTexture: texture_2d<f32>;
@group(1) @binding(6) var vbtNormalAtlasTexture: texture_2d<f32>;
@group(1) @binding(7) var vbtORMAtlasTexture: texture_2d<f32>;

@group(2) @binding(0) var<uniform> uniforms: MaterialUniforms;
@group(2) @binding(1) var baseColorTextureSampler: sampler;
@group(2) @binding(2) var layerBaseColorArray: texture_2d_array<f32>;
@group(2) @binding(3) var layerNormalArray: texture_2d_array<f32>;
@group(2) @binding(4) var layerORMArray: texture_2d_array<f32>;
@group(2) @binding(5) var layerWeightMapArray: texture_2d_array<f32>;

fn getBaseNormal(globalUV: vec2<f32>) -> vec3<f32> {
    let vntSample = textureSampleLevel(vntNormalTexture, baseColorTextureSampler, globalUV, 0.0).rgb;
    return normalize(select(vntSample * 2.0 - vec3<f32>(1.0), vec3<f32>(0.0, 1.0, 0.0), dot(vntSample, vntSample) <= 1e-6));
}

fn perturbNormalOrthonormal(baseN: vec3<f32>, tangentN: vec3<f32>) -> vec3<f32> {
    if (length(tangentN.xy) <= 0.001) {
        return baseN;
    }
    let upVec = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(0.0, 0.0, 1.0), abs(baseN.y) > 0.999);
    let tangentX = normalize(cross(upVec, baseN));
    let tangentZ = cross(baseN, tangentX);
    return normalize(tangentX * tangentN.x + tangentZ * tangentN.y + baseN * tangentN.z);
}

fn sampleLayerStochasticGrad(
    baseUV: vec2<f32>,
    ddxUV: vec2<f32>,
    ddyUV: vec2<f32>,
    layerIdx: i32,
    scaleMult: f32,
    normalIntensity: f32
) -> StochasticSampleResult {
    let gridTri = getStochasticGridTri(baseUV * scaleMult);

    let r0 = stochasticHash2D(gridTri.v0);
    let r1 = stochasticHash2D(gridTri.v1);
    let r2 = stochasticHash2D(gridTri.v2);

    let ang0 = r0.z * PI2;
    let ang1 = r1.z * PI2;
    let ang2 = r2.z * PI2;

    let uv0 = rotate2D(baseUV, ang0) + r0.xy;
    let uv1 = rotate2D(baseUV, ang1) + r1.xy;
    let uv2 = rotate2D(baseUV, ang2) + r2.xy;

    let ddx0 = rotate2D(ddxUV, ang0);
    let ddy0 = rotate2D(ddyUV, ang0);
    let ddx1 = rotate2D(ddxUV, ang1);
    let ddy1 = rotate2D(ddyUV, ang1);
    let ddx2 = rotate2D(ddxUV, ang2);
    let ddy2 = rotate2D(ddyUV, ang2);

    let alb0 = textureSampleGrad(layerBaseColorArray, baseColorTextureSampler, uv0, layerIdx, ddx0, ddy0).rgb;
    let alb1 = textureSampleGrad(layerBaseColorArray, baseColorTextureSampler, uv1, layerIdx, ddx1, ddy1).rgb;
    let alb2 = textureSampleGrad(layerBaseColorArray, baseColorTextureSampler, uv2, layerIdx, ddx2, ddy2).rgb;

    let rawNorm = textureSampleGrad(layerNormalArray, baseColorTextureSampler, baseUV, layerIdx, ddxUV, ddyUV).rgb * 2.0 - vec3<f32>(1.0);
    let norm = vec3<f32>(rawNorm.xy * normalIntensity, max(0.01, rawNorm.z));
    let orm = textureSampleGrad(layerORMArray, baseColorTextureSampler, baseUV, layerIdx, ddxUV, ddyUV);

    var res: StochasticSampleResult;
    res.albedo = alb0 * gridTri.w0 + alb1 * gridTri.w1 + alb2 * gridTri.w2;
    res.normal = norm;
    res.orm = orm;
    return res;
}

fn computeNearFieldLandscapeLayers(
    globalUV: vec2<f32>,
    worldTileUV: vec2<f32>,
    ddxGlobalUV: vec2<f32>,
    ddyGlobalUV: vec2<f32>,
    ddxWorldTileUV: vec2<f32>,
    ddyWorldTileUV: vec2<f32>,
    baseNormal: vec3<f32>
) -> NearDetailLayerResult {
    var result: NearDetailLayerResult;
    result.albedo = vec3<f32>(0.0);
    result.normal = baseNormal;
    result.roughness = 0.85;
    result.metallic = 0.0;
    result.ao = 1.0;
    result.isValid = false;

    let activeLayerCount = uniforms.activeLayerCount;
    if (activeLayerCount == 0u) {
        return result;
    }

    let weightMapSample = textureSampleGrad(layerWeightMapArray, baseColorTextureSampler, globalUV, 0, ddxGlobalUV, ddyGlobalUV);

    var layerAlbedoCache: array<vec3<f32>, 8>;
    var layerNormalCache: array<vec3<f32>, 8>;
    var layerORMACache: array<vec4<f32>, 8>;
    var layerScoreCache: array<f32, 8>;
    var validLayerCount: u32 = 0u;
    var maxScore: f32 = 0.0;

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

        if (layerW <= 0.0001) { continue; }

        let layerIdx = i32(i);
        let nearMultiplier = select(1.0, layerParams.nearUVScaleMultiplier, layerParams.nearUVScaleMultiplier > 0.0);
        let nearScale = layerParams.uvScale * nearMultiplier;
        let layerUV = worldTileUV * nearScale + layerParams.uvOffset;
        let ddxLayerUV = ddxWorldTileUV * nearScale;
        let ddyLayerUV = ddyWorldTileUV * nearScale;

        var layerAlbedoSample: vec3<f32>;
        var layerNormalSample: vec3<f32>;
        var layerORMSample: vec4<f32>;

        if (layerParams.stochasticTiling > 0.5) {
            let stScale = select(1.0, layerParams.stochasticScale, layerParams.stochasticScale > 0.0);
            let stResult = sampleLayerStochasticGrad(layerUV, ddxLayerUV, ddyLayerUV, layerIdx, stScale, layerParams.normalIntensity);
            layerAlbedoSample = stResult.albedo;
            layerNormalSample = stResult.normal;
            layerORMSample = stResult.orm;
        } else {
            layerAlbedoSample = textureSampleGrad(layerBaseColorArray, baseColorTextureSampler, layerUV, layerIdx, ddxLayerUV, ddyLayerUV).rgb;
            let layerNormalRaw = textureSampleGrad(layerNormalArray, baseColorTextureSampler, layerUV, layerIdx, ddxLayerUV, ddyLayerUV).rgb * 2.0 - vec3<f32>(1.0);
            layerNormalSample = vec3<f32>(layerNormalRaw.xy * layerParams.normalIntensity, max(0.01, layerNormalRaw.z));
            layerORMSample = textureSampleGrad(layerORMArray, baseColorTextureSampler, layerUV, layerIdx, ddxLayerUV, ddyLayerUV);
        }

        var heightVal = layerORMSample.a;
        if (heightVal >= 0.999 || heightVal <= 0.001) {
            heightVal = dot(layerAlbedoSample.rgb, vec3<f32>(0.299, 0.587, 0.114));
        }

        let blendFactor = select(1.0, layerParams.heightBlendFactor, layerParams.heightBlendFactor > 0.0);
        let score = (layerW + heightVal * blendFactor) * saturate(layerW * 8.0);
        maxScore = max(maxScore, score);

        layerAlbedoCache[validLayerCount] = layerAlbedoSample.rgb;
        layerNormalCache[validLayerCount] = layerNormalSample;
        let r = layerParams.roughness * layerORMSample.g;
        let m = layerParams.metallic * layerORMSample.b;
        let rawAO = select(1.0, layerORMSample.r, layerORMSample.r > 0.001);
        let ao = clamp(mix(1.0, rawAO, layerParams.aoIntensity), 0.2, 1.0);
        layerORMACache[validLayerCount] = vec4<f32>(r, m, ao, layerW);
        layerScoreCache[validLayerCount] = score;

        validLayerCount = validLayerCount + 1u;
    }

    var totalLayerWeight = 0.0;
    var blendedAlbedo = vec3<f32>(0.0);
    var blendedNormalTangent = vec3<f32>(0.0);
    var blendedRoughness = 0.0;
    var blendedMetallic = 0.0;
    var blendedAO = 0.0;

    let contrast = 0.25;
    for (var k = 0u; k < validLayerCount; k = k + 1u) {
        let score = layerScoreCache[k];
        let rawW = layerORMACache[k].w;
        let heightWeighted = max(0.0, score - maxScore + contrast) * rawW;

        blendedAlbedo += layerAlbedoCache[k] * heightWeighted;
        blendedNormalTangent += layerNormalCache[k] * heightWeighted;
        blendedRoughness += layerORMACache[k].x * heightWeighted;
        blendedMetallic += layerORMACache[k].y * heightWeighted;
        blendedAO += layerORMACache[k].z * heightWeighted;

        totalLayerWeight += heightWeighted;
    }

    if (totalLayerWeight > 0.0001) {
        let invW = 1.0 / totalLayerWeight;
        result.albedo = blendedAlbedo * invW;
        result.roughness = blendedRoughness * invW;
        result.metallic = blendedMetallic * invW;
        result.ao = blendedAO * invW;

        let layerBlendNormal = normalize(blendedNormalTangent * invW);
        result.normal = perturbNormalOrthonormal(baseNormal, layerBlendNormal);
        result.isValid = true;
    } else {
        let layer0Params = uniforms.layerParams[0];
        let layer0UV = worldTileUV * layer0Params.uvScale + layer0Params.uvOffset;
        let ddx0UV = ddxWorldTileUV * layer0Params.uvScale;
        let ddy0UV = ddyWorldTileUV * layer0Params.uvScale;
        var layer0Albedo: vec3<f32>;
        var layer0ORM: vec4<f32>;
        var layer0Normal: vec3<f32>;

        if (layer0Params.stochasticTiling > 0.5) {
            let stScale = select(1.0, layer0Params.stochasticScale, layer0Params.stochasticScale > 0.0);
            let stResult = sampleLayerStochasticGrad(layer0UV, ddx0UV, ddy0UV, 0, stScale, layer0Params.normalIntensity);
            layer0Albedo = stResult.albedo;
            layer0ORM = stResult.orm;
            layer0Normal = stResult.normal;
        } else {
            layer0Albedo = textureSampleGrad(layerBaseColorArray, baseColorTextureSampler, layer0UV, 0, ddx0UV, ddy0UV).rgb;
            layer0ORM = textureSampleGrad(layerORMArray, baseColorTextureSampler, layer0UV, 0, ddx0UV, ddy0UV);
            let layer0NormalRaw = textureSampleGrad(layerNormalArray, baseColorTextureSampler, layer0UV, 0, ddx0UV, ddy0UV).rgb * 2.0 - vec3<f32>(1.0);
            layer0Normal = vec3<f32>(layer0NormalRaw.xy * layer0Params.normalIntensity, max(0.01, layer0NormalRaw.z));
        }

        result.albedo = layer0Albedo;
        result.roughness = layer0Params.roughness * layer0ORM.g;
        result.metallic = layer0Params.metallic * layer0ORM.b;
        let rawAO = select(1.0, layer0ORM.r, layer0ORM.r > 0.001);
        result.ao = clamp(mix(1.0, rawAO, layer0Params.aoIntensity), 0.2, 1.0);

        result.normal = perturbNormalOrthonormal(baseNormal, layer0Normal);
        result.isValid = true;
    }

    return result;
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

    // [KO] 지형 전용 스펙큘러 감쇄 (흙/바위의 미세 다공성 흡수를 반영하여 언리얼 엔진 표준 0.2 수준으로 정반사 완화)
    // [EN] Landscape specular attenuation (reflecting micro-porosity of soil/rock, attenuated to UE standard ~0.2)
    let landscapeSpecularScale = 0.2;
    let effectiveF = F * landscapeSpecularScale;
    let directLight = (SPEC_BRDF * NdotL * landscapeSpecularScale) + (vec3<f32>(1.0) - effectiveF) * diffuse_reflection;
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

fn getLandscapeIndirectLighting(
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

fn sampleBilinearHeight(uv: vec2<f32>, texSize: vec2<f32>) -> f32 {
    let coord = uv * texSize - vec2<f32>(0.5);
    let iCoord = floor(coord);
    let fCoord = fract(coord);

    let maxCoord = texSize - vec2<f32>(1.0);
    let c0 = vec2<i32>(clamp(iCoord, vec2<f32>(0.0), maxCoord));
    let c1 = vec2<i32>(clamp(iCoord + vec2<f32>(1.0, 0.0), vec2<f32>(0.0), maxCoord));
    let c2 = vec2<i32>(clamp(iCoord + vec2<f32>(0.0, 1.0), vec2<f32>(0.0), maxCoord));
    let c3 = vec2<i32>(clamp(iCoord + vec2<f32>(1.0, 1.0), vec2<f32>(0.0), maxCoord));

    let h0 = textureLoad(heightMapTexture, c0, 0).r;
    let h1 = textureLoad(heightMapTexture, c1, 0).r;
    let h2 = textureLoad(heightMapTexture, c2, 0).r;
    let h3 = textureLoad(heightMapTexture, c3, 0).r;

    let top = mix(h0, h1, fCoord.x);
    let bot = mix(h2, h3, fCoord.x);
    return mix(top, bot, fCoord.y);
}

fn computeLandscapeHeightmapShadow(
    worldPos: vec3<f32>,
    N: vec3<f32>,
    L: vec3<f32>,
    screenCoord: vec2<f32>,
    worldSizeX: f32,
    worldSizeZ: f32,
    vhtTexSize: vec2<f32>,
    heightScale: f32,
    maxDistance: f32,
    stepsF: f32,
    softness: f32
) -> f32 {
    let stepCount = u32(clamp(stepsF, 4.0, 64.0));
    let invStepCount = 1.0 / f32(stepCount);
    let minDistance = 15.0;
    let distRange = max(1.0, maxDistance - minDistance);

    var shadowFactor: f32 = 1.0;

    let invWorldSize = vec2<f32>(1.0 / worldSizeX, 1.0 / worldSizeZ);

    let normalBias = 3.5;
    let biasedPos = worldPos + N * normalBias;
    let baseUV = (biasedPos.xz + vec2<f32>(worldSizeX, worldSizeZ) * 0.5) * invWorldSize;
    let uvDir = L.xz * invWorldSize;

    let ny = max(0.1, N.y);
    let tangentSlope = -(N.x * L.x + N.z * L.z) / ny;

    let jitter = getInterleavedGradientNoise(screenCoord);

    for (var i = 0u; i < stepCount; i = i + 1u) {
        let u = (f32(i) + jitter) * invStepCount;

        let t = minDistance + distRange * (u * 0.4 + u * u * 0.6);
        let samplePosY = biasedPos.y + L.y * t;

        if (samplePosY > heightScale) {
            break;
        }

        let uv = baseUV + uvDir * t;

        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
            break;
        }

        let terrainHeight = sampleBilinearHeight(uv, vhtTexSize) * heightScale;

        let tangentHeight = worldPos.y + tangentSlope * t;
        let ridgeHeight = terrainHeight - tangentHeight;
        if (ridgeHeight <= 1.5) {
            continue;
        }

        let diff = samplePosY - terrainHeight;

        if (diff <= 0.0) {
            return 0.0;
        } else {
            let penumbra = clamp((diff * softness) / max(1.0, t), 0.0, 1.0);
            shadowFactor = min(shadowFactor, penumbra);
        }

        if (shadowFactor <= 0.001) {
            return 0.0;
        }
    }

    return shadowFactor;
}

fn getFoliageSubCellDebugColor(
    worldPosXZ: vec2<f32>,
    cameraPosXZ: vec2<f32>,
    cellSize: f32,
    streamingRadius: f32,
    worldSizeX: f32,
    worldSizeZ: f32
) -> vec4<f32> {
    if (landscapeInstanceUniforms.foliageSubCellColoration < 0.5) {
        return vec4<f32>(0.0);
    }

    let safeCellSize = max(10.0, cellSize);
    let halfSize = vec2<f32>(worldSizeX * 0.5, worldSizeZ * 0.5);
    let shifted = clamp(worldPosXZ + halfSize, vec2<f32>(0.0), vec2<f32>(worldSizeX, worldSizeZ));
    let cellCoord = floor(shifted / safeCellSize);
    let cellFract = fract(shifted / safeCellSize);

    let gridDist = abs(cellFract - vec2<f32>(0.5));
    let gridEdge = vec2<f32>(0.5) - gridDist;
    let fw = fwidth(shifted / safeCellSize);
    let line = smoothstep(fw * 1.5, vec2<f32>(0.0), gridEdge);
    let isWireframe = max(line.x, line.y);

    let hash1 = fract(sin(dot(cellCoord, vec2<f32>(12.9898, 78.233))) * 43758.5453);
    let hash2 = fract(sin(dot(cellCoord, vec2<f32>(93.9898, 67.345))) * 24634.6345);
    let hash3 = fract(sin(dot(cellCoord, vec2<f32>(45.1234, 19.876))) * 58392.1234);
    let baseCellColor = vec3<f32>(0.2 + 0.6 * hash1, 0.2 + 0.6 * hash2, 0.2 + 0.6 * hash3);

    let distToCam = distance(worldPosXZ, cameraPosXZ);
    let isInRadius = distToCam <= streamingRadius;

    let ringDist = abs(distToCam - streamingRadius);
    let ringIntensity = smoothstep(4.0, 0.0, ringDist);

    var finalColor = vec3<f32>(0.0);
    var alpha = 0.0;

    if (isInRadius) {
        finalColor = mix(baseCellColor, vec3<f32>(1.0, 1.0, 0.9), isWireframe * 0.85);
        alpha = mix(0.5, 0.9, isWireframe);
    } else {
        finalColor = vec3<f32>(0.1, 0.1, 0.15);
        alpha = isWireframe * 0.35;
    }

    if (ringIntensity > 0.01) {
        finalColor = mix(finalColor, vec3<f32>(0.0, 1.0, 1.0), ringIntensity * 0.95);
        alpha = max(alpha, ringIntensity * 0.9);
    }

    return vec4<f32>(finalColor, alpha);
}

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;

    let input_vertexPosition = inputData.vertexPosition;
    let u_cameraPosition = systemUniforms.camera.cameraPosition;
    let globalUV = inputData.uv1;
    let worldTileUV = inputData.uv;

    let ddxGlobalUV = dpdx(globalUV);
    let ddyGlobalUV = dpdy(globalUV);
    let ddxWorldTileUV = dpdx(worldTileUV);
    let ddyWorldTileUV = dpdy(worldTileUV);

    let rawViewDist = distance(u_cameraPosition, input_vertexPosition);
    let V: vec3<f32> = getViewDirection(input_vertexPosition, u_cameraPosition);
    let baseNormal = getBaseNormal(globalUV);

    let nearDist = uniforms.nearDetailDistance;
    let nearFade = uniforms.nearDetailFade;
    let fadeStartDist = max(0.0, nearDist - nearFade);

    let isDetailActive = uniforms.activeLayerCount > 0u && nearDist > 0.0 && rawViewDist < nearDist;

    var albedo = uniforms.color.rgb;
    var N = baseNormal;
    var roughnessFactor = 0.85;
    var ambientOcclusion = 1.0;

    if (!isDetailActive) {
        let vbtBaseColor = textureSampleGrad(vbtBaseColorAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV);
        let vbtNormalRaw = textureSampleGrad(vbtNormalAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV).rgb;
        let vbtORM = textureSampleGrad(vbtORMAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV);

        let vbtN = normalize(vbtNormalRaw * 2.0 - vec3<f32>(1.0));
        let isVBTNormalValid = dot(vbtNormalRaw, vbtNormalRaw) > 0.001;
        N = select(baseNormal, vbtN, isVBTNormalValid);

        let isVBTColorValid = vbtBaseColor.a > 0.001 || dot(vbtBaseColor.rgb, vbtBaseColor.rgb) > 0.0001;
        albedo = select(uniforms.color.rgb, vbtBaseColor.rgb, isVBTColorValid);
        roughnessFactor = select(0.85, clamp(vbtORM.g, 0.4, 1.0), isVBTColorValid);
        ambientOcclusion = select(1.0, vbtORM.r, isVBTColorValid && vbtORM.r > 0.001);
    } else if (rawViewDist <= fadeStartDist) {
        let nearDetail = computeNearFieldLandscapeLayers(
            globalUV,
            worldTileUV,
            ddxGlobalUV,
            ddyGlobalUV,
            ddxWorldTileUV,
            ddyWorldTileUV,
            baseNormal
        );

        if (nearDetail.isValid) {
            albedo = nearDetail.albedo;
            N = nearDetail.normal;
            roughnessFactor = clamp(nearDetail.roughness, 0.35, 1.0);
            ambientOcclusion = nearDetail.ao;
        } else {
            let vbtBaseColor = textureSampleGrad(vbtBaseColorAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV);
            albedo = select(uniforms.color.rgb, vbtBaseColor.rgb, vbtBaseColor.a > 0.001);
        }
    } else {
        let vbtBaseColor = textureSampleGrad(vbtBaseColorAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV);
        let vbtNormalRaw = textureSampleGrad(vbtNormalAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV).rgb;
        let vbtORM = textureSampleGrad(vbtORMAtlasTexture, baseColorTextureSampler, globalUV, ddxGlobalUV, ddyGlobalUV);

        let vbtN = normalize(vbtNormalRaw * 2.0 - vec3<f32>(1.0));
        let isVBTNormalValid = dot(vbtNormalRaw, vbtNormalRaw) > 0.001;
        let farN = select(baseNormal, vbtN, isVBTNormalValid);

        let isVBTColorValid = vbtBaseColor.a > 0.001 || dot(vbtBaseColor.rgb, vbtBaseColor.rgb) > 0.0001;
        let farAlbedo = select(uniforms.color.rgb, vbtBaseColor.rgb, isVBTColorValid);
        let farRoughness = select(0.85, clamp(vbtORM.g, 0.4, 1.0), isVBTColorValid);
        let farAO = select(1.0, vbtORM.r, isVBTColorValid && vbtORM.r > 0.001);

        let nearDetail = computeNearFieldLandscapeLayers(
            globalUV,
            worldTileUV,
            ddxGlobalUV,
            ddyGlobalUV,
            ddxWorldTileUV,
            ddyWorldTileUV,
            baseNormal
        );

        if (nearDetail.isValid) {
            let blendFactor = clamp((nearDist - rawViewDist) / max(0.001, nearFade), 0.0, 1.0);
            let smoothBlend = smoothstep(0.0, 1.0, blendFactor);

            albedo = mix(farAlbedo, nearDetail.albedo, smoothBlend);
            N = normalize(mix(farN, nearDetail.normal, smoothBlend));
            roughnessFactor = mix(farRoughness, nearDetail.roughness, smoothBlend);
            ambientOcclusion = mix(farAO, nearDetail.ao, smoothBlend);
        } else {
            albedo = farAlbedo;
            N = farN;
            roughnessFactor = farRoughness;
            ambientOcclusion = farAO;
        }
    }

    if (inputData.instanceColor.a > 0.0) {
        albedo = mix(albedo, inputData.instanceColor.rgb, 0.6);
    }

    if (landscapeInstanceUniforms.foliageSubCellColoration > 0.5) {
        let debugSubCell = getFoliageSubCellDebugColor(
            input_vertexPosition.xz,
            u_cameraPosition.xz,
            landscapeInstanceUniforms.foliageSubCellSize,
            landscapeInstanceUniforms.foliageStreamingRadius,
            landscapeInstanceUniforms.worldSizeX,
            landscapeInstanceUniforms.worldSizeZ
        );
        if (debugSubCell.a > 0.0) {
            albedo = mix(albedo, debugSubCell.rgb, debugSubCell.a);
        }
    }

    let NdotV = max(abs(dot(N, V)), 0.04);
    let roughnessParameter = max(roughnessFactor, 0.04);

    let receiveShadowYn = inputData.receiveShadow != 0.0 && systemUniforms.directionalLightCount > 0u;
    var L = vec3<f32>(0.0, 1.0, 0.0);
    if (systemUniforms.directionalLightCount > 0u) {
        L = -normalize(systemUniforms.directionalLights[0].direction);
    }
    let geoNdotL = dot(baseNormal, L);

    var visibility = 1.0;
    var terrainShadowVis = 1.0;
    var csmVisibility = 1.0;

    if (receiveShadowYn && geoNdotL > 0.001) {
        var isDeepTerrainShadow = false;
        let shadowMaxDist = landscapeInstanceUniforms.heightmapShadowDistance;

        if (landscapeInstanceUniforms.heightmapShadow > 0.5 && L.y > 0.01 && rawViewDist < shadowMaxDist * 1.5) {
            let distRatio = clamp(rawViewDist / shadowMaxDist, 0.0, 1.0);
            let dynamicSteps = max(4.0, landscapeInstanceUniforms.heightmapShadowSteps * (1.0 - distRatio * 0.5));

            let terrainSelfShadow = computeLandscapeHeightmapShadow(
                input_vertexPosition,
                baseNormal,
                L,
                inputData.position.xy,
                landscapeInstanceUniforms.worldSizeX,
                landscapeInstanceUniforms.worldSizeZ,
                landscapeInstanceUniforms.vhtTextureSize,
                landscapeInstanceUniforms.heightScale,
                shadowMaxDist,
                dynamicSteps,
                landscapeInstanceUniforms.heightmapShadowSoftness
            );
            terrainShadowVis = mix(1.0 - systemUniforms.shadow.directionalShadowStrength, 1.0, terrainSelfShadow);
            isDeepTerrainShadow = terrainSelfShadow <= 0.001;
        }

        let cascadeCount = min(4u, max(1u, systemUniforms.shadow.cascadeCount));
        let maxCSMDist = systemUniforms.shadow.cascadeSplitDepths[cascadeCount - 1u];

        if (rawViewDist < maxCSMDist && !isDeepTerrainShadow) {
            let rawVisibility: f32 = getDirectionalShadowVisibility(
                directionalShadowMap,
                directionalShadowMapSampler,
                input_vertexPosition,
                baseNormal,
                L
            );
            csmVisibility = mix(1.0 - systemUniforms.shadow.directionalShadowStrength, 1.0, rawVisibility);
            visibility = min(csmVisibility, terrainShadowVis);
        } else {
            visibility = terrainShadowVis;
        }
    }

    let directLighting = getDirectPbrLighting(
        input_vertexPosition,
        N, V, NdotV,
        roughnessParameter, albedo,
        visibility
    );

    let indirectLighting = getLandscapeIndirectLighting(
        N,
        albedo,
        ambientOcclusion
    );

    let finalColor = vec4<f32>(directLighting + indirectLighting, 1.0);
    var outColor = finalColor;

    switch (landscapeInstanceUniforms.debugMode) {
        case 1u: {
            outColor = vec4<f32>(N * 0.5 + 0.5, 1.0);
        }
        case 2u: {
            outColor = vec4<f32>(baseNormal * 0.5 + 0.5, 1.0);
        }
        case 3u: {
            outColor = vec4<f32>(albedo, 1.0);
        }
        case 4u: {
            if (uniforms.activeLayerCount > 0u) {
                let weightSample = textureSampleGrad(layerWeightMapArray, baseColorTextureSampler, globalUV, 0, ddxGlobalUV, ddyGlobalUV);
                let remainingWeight = clamp(1.0 - (weightSample.r + weightSample.g + weightSample.b), 0.0, 1.0);
                let isAlphaFull = weightSample.a >= 0.99;
                let weightA = select(weightSample.a, remainingWeight, isAlphaFull);
                let splatColor = weightSample.r * vec3<f32>(1.0, 0.05, 0.05) +
                                 weightSample.g * vec3<f32>(0.05, 1.0, 0.05) +
                                 weightSample.b * vec3<f32>(0.05, 0.3, 1.0) +
                                 weightA * vec3<f32>(1.0, 0.9, 0.05);
                outColor = vec4<f32>(splatColor, 1.0);
            } else {
                outColor = vec4<f32>(0.2, 0.2, 0.2, 1.0);
            }
        }
        case 5u: {
            outColor = vec4<f32>(vec3<f32>(roughnessParameter), 1.0);
        }
        case 6u: {
            outColor = vec4<f32>(vec3<f32>(ambientOcclusion), 1.0);
        }
        case 7u: {
            outColor = vec4<f32>(vec3<f32>(terrainShadowVis), 1.0);
        }
        case 8u: {
            outColor = vec4<f32>(vec3<f32>(csmVisibility), 1.0);
        }
        case 9u: {
            outColor = vec4<f32>(vec3<f32>(visibility), 1.0);
        }
        case 10u: {
            let heightRatio = clamp(input_vertexPosition.y / max(1.0, landscapeInstanceUniforms.heightScale), 0.0, 1.0);
            let c0 = vec3<f32>(0.0, 0.1, 0.8);
            let c1 = vec3<f32>(0.0, 0.8, 0.8);
            let c2 = vec3<f32>(0.1, 0.8, 0.1);
            let c3 = vec3<f32>(0.9, 0.8, 0.0);
            let c4 = vec3<f32>(0.9, 0.1, 0.0);
            var elevationColor = mix(c0, c1, smoothstep(0.0, 0.25, heightRatio));
            elevationColor = mix(elevationColor, c2, smoothstep(0.25, 0.5, heightRatio));
            elevationColor = mix(elevationColor, c3, smoothstep(0.5, 0.75, heightRatio));
            elevationColor = mix(elevationColor, c4, smoothstep(0.75, 1.0, heightRatio));

            let line25 = abs(fract(input_vertexPosition.y / 25.0 - 0.5) - 0.5) / max(0.001, fwidth(input_vertexPosition.y / 25.0));
            let line100 = abs(fract(input_vertexPosition.y / 100.0 - 0.5) - 0.5) / max(0.001, fwidth(input_vertexPosition.y / 100.0));
            let contour = max(smoothstep(1.0, 0.0, line25) * 0.4, smoothstep(1.5, 0.0, line100) * 0.9);
            elevationColor = mix(elevationColor, vec3<f32>(1.0), contour);
            outColor = vec4<f32>(elevationColor, 1.0);
        }
        case 11u: {
            let lodIdx = min(u32(inputData.lodLevel + 0.5), 7u);
            outColor = vec4<f32>(landscapeInstanceUniforms.lodColors[lodIdx].rgb, 1.0);
        }
        default: {
            outColor = finalColor;
        }
    }

    output.color = outColor;
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);
    return output;
}
