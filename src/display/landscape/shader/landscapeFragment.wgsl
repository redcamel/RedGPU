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
};

struct LandscapeLayerParams {
    uvOffset: vec2<f32>,
    uvScale: vec2<f32>,
    minVal: f32,
    maxVal: f32,
    blendFalloff: f32,
    blendMode: f32, // 0: SLOPE, 1: HEIGHT, 2: WEIGHT_MAP
    tintColor: vec4<f32>,
    roughness: f32,
    metallic: f32,
    normalIntensity: f32,
    enabled: f32, // 1.0 or 0.0
    aoIntensity: f32,
    heightOffset: f32,
    heightContrast: f32,
    weightMapChannelIndex: f32, // 0: R, 1: G, 2: B, 3: A
};

struct MaterialUniforms {
    activeLayerCount: u32,
    color: vec4<f32>,
    textureOffset: vec2<f32>,
    textureScale: vec2<f32>,
    roughnessFactor: f32,
    metallicFactor: f32,
    occlusionStrength: f32,
    pad0: f32,
    layers: array<LandscapeLayerParams, 8>,
};

@group(1) @binding(4) var vntNormalTexture: texture_2d<f32>;

@group(2) @binding(0) var<uniform> uniforms: MaterialUniforms;
@group(2) @binding(1) var baseColorTextureSampler: sampler;

@group(2) @binding(2) var layerBaseColorArray: texture_2d_array<f32>;
@group(2) @binding(3) var layerNormalArray: texture_2d_array<f32>;
@group(2) @binding(4) var layerORMArray: texture_2d_array<f32>;
@group(2) @binding(5) var layerWeightMapArray: texture_2d_array<f32>;

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

    // 언리얼 엔진(UE5) 표준 S-Curve (smoothstep) 부드러운 페더링 감쇄 연산
    let lowW = select(smoothstep(minVal, minVal + falloff, val), 1.0, minVal <= -499.0 || (blendMode < 0.5 && minVal <= 0.001));
    let highW = select(1.0 - smoothstep(maxVal - falloff, maxVal, val), 1.0, maxVal >= 499.0 || (blendMode < 0.5 && maxVal >= 89.999));

    return clamp(lowW * highW, 0.0, 1.0);
}

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    
    let input_vertexPosition = inputData.vertexPosition;
    let u_cameraPosition = systemUniforms.camera.cameraPosition;
    let preExposure = systemUniforms.preExposure;

    var u_metallicFactor = uniforms.metallicFactor;
    var u_roughnessFactor = uniforms.roughnessFactor;
    var ambientOcclusion = uniforms.occlusionStrength;

    let globalUV = inputData.uv1;
    let baseUvDx = dpdx(globalUV);
    let baseUvDy = dpdy(globalUV);

    // 1. RVT 월드 노멀 아틀라스(@group(1) @binding(3)) 픽셀 샘플링 및 복원 (단일 통합 샘플러 사용)
    let encodedNormal = textureSampleLevel(vntNormalTexture, baseColorTextureSampler, globalUV, 0.0).rgb;
    let sampledNormal = normalize(encodedNormal * 2.0 - vec3<f32>(1.0));
    var N: vec3<f32> = select(sampledNormal, vec3<f32>(0.0, 1.0, 0.0), length(encodedNormal) <= 0.001);

    // ⚡ GPU acos() 역삼각함수 Pre-computation (루프 밖에서 픽셀당 1회만 계산)
    let slopeAngleDeg = acos(clamp(N.y, -1.0, 1.0)) * 57.295779513;

    // Base Color & Albedo
    var baseColor = uniforms.color;

    if (inputData.instanceColor.a > 0.0) {
        baseColor = mix(baseColor, inputData.instanceColor, 0.5);
    }

    var albedo: vec3<f32> = baseColor.rgb;

    // Multi-Layer PBR 아틀라스 연산 (지형 기본 바탕 baseColor와의 알파 믹싱 지원)
    let activeLayerCount = uniforms.activeLayerCount;

    if (activeLayerCount > 0u) {
        var baseAlbedo = albedo;
        var baseRoughness = u_roughnessFactor;
        var baseMetallic = u_metallicFactor;
        var baseAO = ambientOcclusion;

        var totalLayerWeight = 0.0;
        var blendedAlbedo = vec3<f32>(0.0);
        var blendedNormal = vec3<f32>(0.0);
        var blendedRoughness = 0.0;
        var blendedMetallic = 0.0;
        var blendedAO = 0.0;

        for (var i = 0u; i < activeLayerCount; i = i + 1u) {
            let layerParams = uniforms.layers[i];
            if (layerParams.enabled <= 0.5) { continue; }

            let layerIdx = i32(i);

            var layerW = 0.0;
            if (layerParams.blendMode >= 1.5) {
                let weightMapSample = textureSampleGrad(layerWeightMapArray, baseColorTextureSampler, globalUV, layerIdx, baseUvDx, baseUvDy);
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
                layerW = computeLayerRawWeightFast(layerParams, slopeAngleDeg, inputData.vertexHeight);
            }

            if (layerW <= 0.0001) { continue; }

            let layerUV = globalUV * layerParams.uvScale + layerParams.uvOffset;
            let uvDx = baseUvDx * layerParams.uvScale;
            let uvDy = baseUvDy * layerParams.uvScale;

            let layerAlbedoSample = textureSampleGrad(layerBaseColorArray, baseColorTextureSampler, layerUV, layerIdx, uvDx, uvDy);
            let layerNormalRaw = textureSampleGrad(layerNormalArray, baseColorTextureSampler, layerUV, layerIdx, uvDx, uvDy).rgb * 2.0 - vec3<f32>(1.0);
            let layerNormalSample = layerNormalRaw * vec3<f32>(layerParams.normalIntensity, layerParams.normalIntensity, 1.0);
            let layerORMSample = textureSampleGrad(layerORMArray, baseColorTextureSampler, layerUV, layerIdx, uvDx, uvDy);

            let layerAlbedo = layerAlbedoSample.rgb * layerParams.tintColor.rgb;
            let layerRoughness = layerParams.roughness * layerORMSample.g;
            let layerMetallic = layerParams.metallic * layerORMSample.b;
            let rawAO = select(1.0, layerORMSample.r, layerORMSample.r > 0.001);
            let layerAO = clamp(mix(1.0, rawAO, layerParams.aoIntensity), 0.2, 1.0);

            blendedAlbedo += layerAlbedo * layerW;
            blendedNormal += layerNormalSample * layerW;
            blendedRoughness += layerRoughness * layerW;
            blendedMetallic += layerMetallic * layerW;
            blendedAO += layerAO * layerW;

            totalLayerWeight += layerW;
        }

        if (totalLayerWeight > 0.0001) {
            let layerBlendAlbedo = blendedAlbedo / totalLayerWeight;
            let layerBlendNormal = blendedNormal / totalLayerWeight;
            let layerBlendRoughness = blendedRoughness / totalLayerWeight;
            let layerBlendMetallic = blendedMetallic / totalLayerWeight;
            let layerBlendAO = blendedAO / totalLayerWeight;

            let alpha = clamp(totalLayerWeight, 0.0, 1.0);

            albedo = mix(baseAlbedo, layerBlendAlbedo, alpha);
            if (length(layerBlendNormal) > 0.001) {
                N = normalize(mix(N, N + layerBlendNormal, alpha));
            }
            u_roughnessFactor = mix(baseRoughness, layerBlendRoughness, alpha);
            u_metallicFactor = mix(baseMetallic, layerBlendMetallic, alpha);
            ambientOcclusion = mix(baseAO, layerBlendAO, alpha);
        }
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
    let F0 = mix(F0_dielectric, F0_metal, u_metallicFactor);
    let roughnessParameter = max(u_roughnessFactor, 0.04);

    // Direct Lighting Loop (Cook-Torrance PBR)
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
                let kS = F;
                let kD = (vec3<f32>(1.0) - kS) * (1.0 - u_metallicFactor);

                totalDirectLighting += (kD * albedo * INV_PI + spec) * finalLightColor * NdotL;
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
            let kS = F;
            let kD = (vec3<f32>(1.0) - kS) * (1.0 - u_metallicFactor);

            totalDirectLighting += (kD * albedo * INV_PI + spec) * finalLightColor * NdotL;
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
        let kD = (vec3<f32>(1.0) - F_IBL) * (1.0 - u_metallicFactor);

        indirectLighting = ((kD * albedo * iblDiffuseColor) + (reflectedColor * F_IBL)) * ambientOcclusion;
    } else {
        let ambientContribution = albedo * systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * preExposure * INV_PI;
        indirectLighting = ambientContribution * ambientOcclusion;
    }

    let directAO = mix(1.0, ambientOcclusion, 0.6);
    let finalColor = vec4<f32>((totalDirectLighting * directAO) + indirectLighting, baseColor.a);

    output.color = finalColor;
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);
    return output;
}
