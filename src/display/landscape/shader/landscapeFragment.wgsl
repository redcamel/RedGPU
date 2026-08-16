#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.PI;
#redgpu_include math.PI2;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;
#redgpu_include math.direction.getViewDirection;
#redgpu_include math.direction.getReflectionVectorFromViewDirection;

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
    uvScale: vec2<f32>, // 🌿 타일 기준 UV 스케일
    _padding0: vec2<f32>,
    minVal: f32,
    maxVal: f32,
    tintColor: vec4<f32>,
    blendFalloff: f32,
    blendMode: f32, // 0: SLOPE, 1: HEIGHT, 2: WEIGHT_MAP
    roughness: f32,
    metallic: f32,
    normalIntensity: f32,
    enabled: f32, // 1.0 or 0.0
    aoIntensity: f32,
    heightOffset: f32,
    heightContrast: f32,
    weightMapChannelIndex: f32, // 0: R, 1: G, 2: B, 3: A
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
    lodColors: array<vec4<f32>, 8>,
    lodDistancesSq: array<vec4<f32>, 2>,
};

// @group(1): RVT & VBT 2D Atlas 3-Set
@group(1) @binding(3) var vhtHeightAtlasTexture: texture_2d<f32>;
@group(1) @binding(4) var vntNormalTexture: texture_2d<f32>;
@group(1) @binding(5) var<uniform> landscapeInstanceUniforms: LandscapeUniforms;
@group(1) @binding(6) var vbtBaseColorAtlasTexture: texture_2d<f32>;
@group(1) @binding(7) var vbtNormalAtlasTexture: texture_2d<f32>;
@group(1) @binding(8) var vbtORMAtlasTexture: texture_2d<f32>;

// @group(2): Material & Textures
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

fn computeLayerRawWeightFast(layer: LandscapeLayerParams, slopeAngleDeg: f32, vertexHeight: f32) -> f32 {
    let blendMode = layer.blendMode;
    let minVal = layer.minVal;
    let maxVal = layer.maxVal;
    let falloff = max(0.001, layer.blendFalloff);

    var val = 0.0;
    if (blendMode < 0.5) {
        val = slopeAngleDeg;
    } else if (blendMode < 1.5) {
        val = vertexHeight + layer.heightOffset;
    } else {
        return 1.0;
    }

    let lowW = select(smoothstep(minVal, minVal + falloff, val), 1.0, minVal <= -499.0 || (blendMode < 0.5 && minVal <= 0.001));
    let highW = select(1.0 - smoothstep(maxVal - falloff, maxVal, val), 1.0, maxVal >= 499.0 || (blendMode < 0.5 && maxVal >= 89.999));

    return clamp(lowW * highW, 0.0, 1.0);
}

fn computeDirectLayersPBR(
    globalUV: vec2<f32>,
    worldTileUV: vec2<f32>,
    baseN: vec3<f32>,
    vertexHeight: f32,
    slopeAngleDeg: f32,
    mipLevel: f32
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
        var layerW = 0.0;

        if (layerParams.blendMode >= 1.5) {
            var weightMapSample = textureSampleLevel(layerWeightMapArray, baseColorTextureSampler, globalUV, layerIdx, 0.0);
            if (length(weightMapSample) <= 0.0001 && layerIdx > 0) {
                weightMapSample = textureSampleLevel(layerWeightMapArray, baseColorTextureSampler, globalUV, 0, 0.0);
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
            layerW = clamp(weightVal, 0.0, 1.0);
        } else {
            layerW = computeLayerRawWeightFast(layerParams, slopeAngleDeg, vertexHeight);
        }

        if (layerW <= 0.0001) { continue; }

        // 🌿 타일 기준 UV 스케일 적용 (근경/원경 1:1 완벽 일치)
        let layerUV = worldTileUV * layerParams.uvScale + layerParams.uvOffset;

        let layerAlbedoSample = textureSampleLevel(layerBaseColorArray, baseColorTextureSampler, layerUV, layerIdx, mipLevel);
        let layerNormalRaw = textureSampleLevel(layerNormalArray, baseColorTextureSampler, layerUV, layerIdx, mipLevel).rgb * 2.0 - vec3<f32>(1.0);
        let layerNormalSample = vec3<f32>(layerNormalRaw.xy * layerParams.normalIntensity, max(0.01, layerNormalRaw.z));
        let layerORMSample = textureSampleLevel(layerORMArray, baseColorTextureSampler, layerUV, layerIdx, mipLevel);

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
        let layerBlendNormal = normalize(blendedNormalTangent * invW);
        let layerBlendRoughness = blendedRoughness * invW;
        let layerBlendMetallic = blendedMetallic * invW;
        let layerBlendAO = blendedAO * invW;

        let alpha = clamp(totalLayerWeight, 0.0, 1.0);

        res.albedo = mix(baseAlbedo, layerBlendAlbedo, alpha);

        // TBN 월드 공간 표면 노멀 합성 (Reoriented Perturbation)
        if (length(layerBlendNormal.xy) > 0.001) {
            let tangentX = normalize(vec3<f32>(1.0, 0.0, 0.0) - baseN * baseN.x);
            let tangentZ = normalize(cross(baseN, tangentX));
            let perturbedWorldN = normalize(tangentX * layerBlendNormal.x + tangentZ * layerBlendNormal.y + baseN * layerBlendNormal.z);
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

fn getDirectDiffuseBRDF(NdotL: f32, NdotV: f32, LdotH: f32, roughness: f32, albedo: vec3<f32>) -> vec3<f32> {
    if (NdotL <= 0.0) { return vec3<f32>(0.0); }
    let energyBias = mix(0.0, 0.5, roughness);
    let energyFactor = mix(1.0, 1.0 / 1.51, roughness);
    let fd90 = energyBias + 2.0 * LdotH * LdotH * roughness;
    let f0 = 1.0;
    let lightScatter = f0 + (fd90 - f0) * pow(1.0 - NdotL, 5.0);
    let viewScatter = f0 + (fd90 - f0) * pow(1.0 - NdotV, 5.0);
    return albedo * NdotL * lightScatter * viewScatter * energyFactor * INV_PI;
}

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    
    let input_vertexPosition = inputData.vertexPosition;
    let u_cameraPosition = systemUniforms.camera.cameraPosition;
    let preExposure = systemUniforms.preExposure;

    let globalUV = inputData.uv1;
    let lod = inputData.lodLevel;
    let worldTileUV = inputData.uv; // 🌿 타일 로컬 격자 고정밀 UV (0.0 ~ 1.0)

    // 🌟 VNT 기반 베이스 지형 표면 법선 로드 (Zero-Derivative, Mip 0 Level 즉시 샘플링)
    let vntSample = textureSampleLevel(vntNormalTexture, baseColorTextureSampler, globalUV, 0.0).rgb;
    let baseN = normalize(select(vntSample * 2.0 - vec3<f32>(1.0), vec3<f32>(0.0, 1.0, 0.0), length(vntSample) <= 0.001));
    let slopeAngleDeg = acos(clamp(baseN.y, -1.0, 1.0)) * 57.295779513;

    var albedo: vec3<f32>;
    var N: vec3<f32>;
    var roughnessFactor: f32;
    var metallicFactor: f32;
    var ambientOcclusion: f32;

    let viewDist = distance(u_cameraPosition, input_vertexPosition);
    // 🌿 원경 VBT 전용 정수 밉 레벨 (Trilinear 부하 0%, 텍스처 캐시 적중률 극대화)
    let vbtMip = floor(clamp(log2(max(1.0, viewDist * 0.002)), 0.0, 4.0));

    // 🌟 하이브리드 LOD 적응형 셰이딩 (Hybrid LOD Distance-Based Continuous Adaptive Shading)
    if (lod < 1.5) {
        // 🌿 LOD 0 ~ 1: 카메라와의 실제 픽셀 거리 기반 부드러운 하이브리드 크로스페이드 (시각적 팝핑 0%)
        let lod0Dist = max(1.0, sqrt(landscapeInstanceUniforms.lodDistancesSq[0].x));
        let fadeStart = lod0Dist * 0.7;
        let fadeEnd = lod0Dist;
        let fade = smoothstep(fadeStart, fadeEnd, viewDist);

        // 거리 기반 밉맵 레벨 (0.0 ~ 4.0) 부드러운 산출
        let mipLevel = clamp(log2(max(1.0, viewDist * 0.05)), 0.0, 4.0);
        let direct = computeDirectLayersPBR(globalUV, worldTileUV, baseN, inputData.vertexHeight, slopeAngleDeg, mipLevel);

        if (fade <= 0.001) {
            // 🌿 근거리 (LOD 0 영역): 100% Direct Layer 초고해상도 샘플링 (1cm 마이크로 디테일)
            albedo = direct.albedo;
            N = direct.normal;
            roughnessFactor = direct.roughness;
            metallicFactor = direct.metallic;
            ambientOcclusion = direct.ao;
        } else {
            // 🔀 페이드 영역 (LOD 0 외곽 ~ LOD 1): Direct Layer <-> VBT 부드러운 크로스페이드 (정수 밉 적용)
            let vbtAlbedoRaw = textureSampleLevel(vbtBaseColorAtlasTexture, baseColorTextureSampler, globalUV, vbtMip).rgb;
            let vbtNormalEncoded = textureSampleLevel(vbtNormalAtlasTexture, baseColorTextureSampler, globalUV, vbtMip).rgb;
            let vbtORM = textureSampleLevel(vbtORMAtlasTexture, baseColorTextureSampler, globalUV, vbtMip);

            let isBaked = length(vbtAlbedoRaw) > 0.001;
            let vbtAlbedo = select(uniforms.color.rgb, vbtAlbedoRaw, isBaked);
            let vbtN = normalize(select(vbtNormalEncoded * 2.0 - vec3<f32>(1.0), baseN, length(vbtNormalEncoded) <= 0.001));

            albedo = mix(direct.albedo, vbtAlbedo, fade);
            N = normalize(mix(direct.normal, vbtN, fade));
            roughnessFactor = mix(direct.roughness, max(0.04, select(0.9, vbtORM.g, isBaked)), fade);
            metallicFactor = mix(direct.metallic, select(0.0, vbtORM.b, isBaked), fade);
            ambientOcclusion = mix(direct.ao, select(1.0, vbtORM.r, isBaked), fade);
        }
    }
    else {
        // ⚡ LOD 2 ~ 7 (원경 250개 타일): 정수 밉 레벨 $O(1)$ 초고속 VBT 2D Atlas 3-Tap 즉시 샘플링 (캐시 히트율 99%)
        let vbtAlbedoRaw = textureSampleLevel(vbtBaseColorAtlasTexture, baseColorTextureSampler, globalUV, vbtMip).rgb;
        let vbtNormalEncoded = textureSampleLevel(vbtNormalAtlasTexture, baseColorTextureSampler, globalUV, vbtMip).rgb;
        let vbtORM = textureSampleLevel(vbtORMAtlasTexture, baseColorTextureSampler, globalUV, vbtMip);

        let isBaked = length(vbtAlbedoRaw) > 0.001;
        let vbtAlbedo = select(uniforms.color.rgb, vbtAlbedoRaw, isBaked);

        albedo = vbtAlbedo;
        N = normalize(select(vbtNormalEncoded * 2.0 - vec3<f32>(1.0), baseN, length(vbtNormalEncoded) <= 0.001));
        roughnessFactor = max(0.04, select(0.9, vbtORM.g, isBaked));
        metallicFactor = select(0.0, vbtORM.b, isBaked);
        ambientOcclusion = select(1.0, vbtORM.r, isBaked);
    }

    // LOD 디버그 색상 (lodColoration) 오버레이 처리
    if (inputData.instanceColor.a > 0.0) {
        albedo = mix(albedo, inputData.instanceColor.rgb, 0.6);
    }

    // Core Vectors
    let V: vec3<f32> = getViewDirection(input_vertexPosition, u_cameraPosition);
    let NdotV = max(abs(dot(N, V)), 0.04);

    // Fresnel F0
    let F0_dielectric = vec3<f32>(0.04);
    let F0_metal = albedo;
    let F0 = mix(F0_dielectric, F0_metal, metallicFactor);
    let roughnessParameter = max(roughnessFactor, 0.04);

    // Direct Lighting Loop (Cook-Torrance PBR with Disney Diffuse)
    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    if (u_directionalLightCount > 0u) {
        for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
            let lightIntensity = u_directionalLights[i].intensity;
            let L = -normalize(u_directionalLights[i].direction);
            let finalLightColor = u_directionalLights[i].color * lightIntensity * preExposure;

            let NdotL = max(dot(N, L), 0.0);
            if (NdotL > 0.0) {
                let H = normalize(V + L);
                let NdotH = max(dot(N, H), 0.0);
                let LdotH = max(dot(L, H), 0.0);

                let alpha = roughnessParameter * roughnessParameter;
                let alpha2 = alpha * alpha;
                let denomNDF = (NdotH * NdotH * (alpha2 - 1.0) + 1.0);
                let NDF = alpha2 / (PI * denomNDF * denomNDF + EPSILON);

                let k = (roughnessParameter + 1.0) * (roughnessParameter + 1.0) / 8.0;
                let G1V = NdotV / (NdotV * (1.0 - k) + k + EPSILON);
                let G1L = NdotL / (NdotL * (1.0 - k) + k + EPSILON);
                let G = G1V * G1L;

                let F = F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - LdotH, 0.0, 1.0), 5.0);

                let spec = (NDF * G * F) / (4.0 * NdotV * NdotL + EPSILON);
                let diffuse_reflection = getDirectDiffuseBRDF(NdotL, NdotV, LdotH, roughnessParameter, albedo);
                let kS = F;
                let kD = (vec3<f32>(1.0) - kS) * (1.0 - metallicFactor);

                totalDirectLighting += (kD * diffuse_reflection + spec * NdotL) * finalLightColor;
            }
        }
    } else {
        // 기본 썬라이트 방향 폴백 (대각선 햇빛 PBR)
        let defaultSunL = normalize(vec3<f32>(0.6, 0.8, 0.4));
        let finalLightColor = vec3<f32>(1.2, 1.15, 1.05) * preExposure * 1.5;
        let NdotL = max(dot(N, defaultSunL), 0.0);
        if (NdotL > 0.0) {
            let H = normalize(V + defaultSunL);
            let NdotH = max(dot(N, H), 0.0);
            let LdotH = max(dot(defaultSunL, H), 0.0);

            let alpha = roughnessParameter * roughnessParameter;
            let alpha2 = alpha * alpha;
            let denomNDF = (NdotH * NdotH * (alpha2 - 1.0) + 1.0);
            let NDF = alpha2 / (PI * denomNDF * denomNDF + EPSILON);

            let k = (roughnessParameter + 1.0) * (roughnessParameter + 1.0) / 8.0;
            let G1V = NdotV / (NdotV * (1.0 - k) + k + EPSILON);
            let G1L = NdotL / (NdotL * (1.0 - k) + k + EPSILON);
            let G = G1V * G1L;

            let F = F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - LdotH, 0.0, 1.0), 5.0);

            let spec = (NDF * G * F) / (4.0 * NdotV * NdotL + EPSILON);
            let diffuse_reflection = getDirectDiffuseBRDF(NdotL, NdotV, LdotH, roughnessParameter, albedo);
            let kS = F;
            let kD = (vec3<f32>(1.0) - kS) * (1.0 - metallicFactor);

            totalDirectLighting += (kD * diffuse_reflection + spec * NdotL) * finalLightColor;
        }
    }

    // Indirect IBL & Ambient Lighting
    var indirectLighting = vec3<f32>(0.0);
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;

    if (u_usePrefilterTexture || u_useSkyAtmosphere) {
        let R = getReflectionVectorFromViewDirection(V, N);
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
            let skyIntensity = u_atmo.sunIntensity;
            let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
            let atmoMipLevel = roughnessParameter * atmoMipCount;
            let specSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, R, atmoMipLevel).rgb * skyIntensity * preExposure;
            reflectedColor += specSkyScat;

            let skyIrradiance = textureSampleLevel(atmosphereIrradianceLUT, atmosphereSampler, N, 0.0).rgb * skyIntensity * preExposure;
            iblDiffuseColor += skyIrradiance;
        }

        let envBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, clamp(vec2<f32>(NdotV, roughnessParameter), vec2<f32>(0.005), vec2<f32>(0.995)), 0.0).rg;
        let F_IBL = F0 * envBRDF.x + vec3<f32>(envBRDF.y);
        let kD = (vec3<f32>(1.0) - F_IBL) * (1.0 - metallicFactor);

        indirectLighting = ((kD * albedo * iblDiffuseColor) + (reflectedColor * F_IBL)) * ambientOcclusion;
    } else {
        let ambientContribution = albedo * systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * preExposure * INV_PI;
        indirectLighting = ambientContribution * ambientOcclusion;
    }

    let finalColor = vec4<f32>(totalDirectLighting + indirectLighting, 1.0);

    output.color = finalColor;
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);
    return output;
}
