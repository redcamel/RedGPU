#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getDirectionalShadowVisibility;
#redgpu_include color.getTintBlendMode;
#redgpu_include entryPoint.mesh.entryPointPickingFragment;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.getIsFinite;
#redgpu_include lighting.getLightDistanceAttenuation;
#redgpu_include lighting.getLightAngleAttenuation;
#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.INV_PI
#redgpu_include math.EPSILON
#redgpu_include math.direction.getViewDirection
#redgpu_include math.direction.getReflectionVectorFromViewDirection
#redgpu_include math.tnb.getTBNFromVertexTangent
#redgpu_include math.tnb.getTBN
#redgpu_include math.tnb.getNormalFromNormalMap
#redgpu_include skyAtmosphere.skyAtmosphereFn

struct TerrainUniforms {
    debugSplatTexture: u32,
}
@group(2) @binding(0) var<uniform> uniforms: TerrainUniforms;

// 💡 (참고) 레이어 바인딩 슬롯 레이아웃 유지를 위해 선언부는 남겨둡니다.
// 실제 연산에는 샘플링되지 않으므로 성능에 영향을 주지 않습니다.
#redgpu_if baseColorTexture
@group(2) @binding(1) var baseColorTexture: texture_2d<f32>;
#redgpu_endIf
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 💡 RVT (Runtime Virtual Texture) 아틀라스 바인딩 — 무조건 사용
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
@group(2) @binding(9)  var rvtAlbedoTexture:    texture_2d<f32>;
@group(2) @binding(10) var rvtNormalORMTexture:  texture_2d<f32>;
@group(2) @binding(11) var rvtSampler:           sampler;

struct InputData {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,
    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(10) localNodeScale_volumeScale: vec2<f32>,
    @location(11) combinedOpacity: f32,
    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
}

@fragment
fn main(inputData:InputData) -> OutputFragment {
    var output: OutputFragment;
    let pbrUniforms = globalFragmentSSBO_PBR[inputData.globalFragmentSlotIndex];

    let input_vertexNormal = (inputData.vertexNormal.xyz);
    let input_vertexPosition = inputData.vertexPosition.xyz;
    let input_vertexColor_0 = inputData.vertexColor_0;
    let input_vertexTangent = inputData.vertexTangent;
    let input_ndcPosition = inputData.position.xyz / inputData.position.w ;
    let input_uv = inputData.uv;
    let u_camera = systemUniforms.camera;
    let u_cameraPosition = u_camera.cameraPosition;

    let u_opacity = pbrUniforms.opacity;
    let u_cutOff = pbrUniforms.cutOff;
    let u_useVertexColor = pbrUniforms.useVertexColor == 1u;

    #redgpu_if baseColorTexture
        let u_baseColorFactor = vec4<f32>(1.0);
    #redgpu_else
        let u_baseColorFactor = pbrUniforms.baseColorFactor;
    #redgpu_endIf
    let u_normalScale = pbrUniforms.normalScale;
    let u_KHR_materials_ior = pbrUniforms.KHR_materials_ior;

    let V: vec3<f32> = getViewDirection(input_vertexPosition, u_cameraPosition);
    let baseNormal:vec3<f32> = normalize(input_vertexNormal.xyz);
    var N:vec3<f32> = baseNormal;
    var backFaceYn:bool = false;

    #redgpu_if doubleSided
    {
        if (dot(baseNormal, V) < 0.0) {
            backFaceYn = true;
        }
    }
    #redgpu_endIf

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 💡 TBN: RVT 모드에서는 항상 노멀 맵이 적용되므로 무조건 계산
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let tbn = getTBNFromVertexTangent(baseNormal, input_vertexTangent);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 💡 RVT 전용 단일 샘플링 로직
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let rvt_albedo = textureSample(rvtAlbedoTexture, rvtSampler, input_uv);
    let rvt_normalORM = textureSample(rvtNormalORMTexture, rvtSampler, input_uv);

    let rvt_normalXY = rvt_normalORM.rg;
    let rvt_roughness = rvt_normalORM.b;
    let rvt_occlusion = rvt_normalORM.a;

    // debugSplatTexture 모드 지원
    if (uniforms.debugSplatTexture == 1u) {
        output.color = rvt_albedo;
        return output;
    }

    // NormalMap 복원 (XY octahedral → world space)
    let xy_rvt = vec2<f32>(rvt_normalXY.r * 2.0 - 1.0, -(rvt_normalXY.g * 2.0 - 1.0));
    var scaled_rvt = xy_rvt * u_normalScale;
    let lenSq_rvt = dot(scaled_rvt, scaled_rvt);
    if (lenSq_rvt > 0.98) { scaled_rvt = normalize(scaled_rvt) * 0.98; }
    let recon_z_rvt = sqrt(max(0.001, 1.0 - dot(scaled_rvt, scaled_rvt)));
    N = normalize(tbn * vec3<f32>(scaled_rvt, recon_z_rvt));

    if (backFaceYn) { N = -N; }
    N = normalize(N);
    let NdotV_rvt = max(abs(dot(N, V)), 0.04);

    // Shadow
    let receiveShadowYn_rvt = inputData.receiveShadow != 0.0;
    var visibility_rvt: f32 = 1.0;
    visibility_rvt = getDirectionalShadowVisibility(directionalShadowMap, directionalShadowMapSampler, systemUniforms.shadow.directionalShadowDepthTextureSize, systemUniforms.shadow.directionalShadowBias, systemUniforms.shadow.directionalShadowFilterScale, inputData.shadowCoord);
    if (!receiveShadowYn_rvt) {
        visibility_rvt = 1.0;
    } else {
        visibility_rvt = mix(1.0 - systemUniforms.shadow.directionalShadowStrength, 1.0, visibility_rvt);
    }

    var baseColor_rvt = u_baseColorFactor;
    var resultAlpha_rvt: f32 = u_opacity * baseColor_rvt.a;
    baseColor_rvt *= select(vec4<f32>(1.0), input_vertexColor_0, u_useVertexColor);
    baseColor_rvt = baseColor_rvt * rvt_albedo;
    let albedo_rvt: vec3<f32> = baseColor_rvt.rgb;

    var ior_rvt: f32 = u_KHR_materials_ior;
    if (ior_rvt <= 0.0) { ior_rvt = 1.5; }

    let occlusionParameter_rvt = rvt_occlusion * pbrUniforms.occlusionStrength;
    let roughnessParameter_rvt = max(rvt_roughness, 0.04);
    let metallicParameter_rvt: f32 = 0.0;

    let F0_dielectric_base_rvt = getDielectricF0(ior_rvt);
    let F0_rvt = F0_dielectric_base_rvt;

    let totalDirect_rvt = getDirectPbrLighting(
        input_vertexPosition, inputData.position, visibility_rvt,
        N, V, NdotV_rvt,
        roughnessParameter_rvt, metallicParameter_rvt, albedo_rvt,
        F0_dielectric_base_rvt, ior_rvt
    );
    let indirect_rvt = getIndirectPbrLighting(
        N, V, NdotV_rvt,
        albedo_rvt, roughnessParameter_rvt, metallicParameter_rvt,
        F0_rvt, F0_dielectric_base_rvt, albedo_rvt,
        occlusionParameter_rvt
    );

    let finalColor_rvt = vec4<f32>(totalDirect_rvt + indirect_rvt, resultAlpha_rvt);

    #redgpu_if useCutOff
        if (resultAlpha_rvt <= u_cutOff) { discard; }
    #redgpu_endIf
    #redgpu_if useTint
        output.color = getTintBlendMode(finalColor_rvt, pbrUniforms.tintBlendMode, pbrUniforms.tint);
    #redgpu_else
        output.color = finalColor_rvt;
    #redgpu_endIf

    {
        let smoothness_rvt = 1.0 - roughnessParameter_rvt;
        let sc_rvt = smoothness_rvt * smoothness_rvt * (3.0 - 2.0 * smoothness_rvt);
        output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, sc_rvt * (0.04 + 0.96 * metallicParameter_rvt * metallicParameter_rvt));
    }

    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);

    return output;
}

// =============================================================================
// Texture & UV Helpers
// =============================================================================
fn getTextureTransformUV(
    input_uv: vec2<f32>,
    input_uv1: vec2<f32>,
    texCoord_index: u32,
    use_transform: u32,
    transform_offset: vec2<f32>,
    transform_rotation: f32,
    transform_scale: vec2<f32>
) -> vec2<f32> {
    var result_uv = select(input_uv, input_uv1, texCoord_index == 1u);
    if (use_transform == 1u) {
        let translation = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            transform_offset.x, transform_offset.y, 1.0
        );
        let cos_rot = cos(transform_rotation);
        let sin_rot = sin(transform_rotation);
        let rotation_matrix = mat3x3<f32>(
            cos_rot, -sin_rot, 0.0,
            sin_rot, cos_rot, 0.0,
            0.0, 0.0, 1.0
        );
        let scale_matrix = mat3x3<f32>(
            transform_scale.x, 0.0, 0.0,
            0.0, transform_scale.y, 0.0,
            0.0, 0.0, 1.0
        );
        let result_matrix = translation * rotation_matrix * scale_matrix;
        result_uv = (result_matrix * vec3<f32>(result_uv, 1.0)).xy;
    }
    return result_uv;
}

// =============================================================================
// Common Math & BRDF Utilities
// =============================================================================
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

fn getFresnel(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {
    return F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

fn getIndirectFresnel(cosTheta: f32, F0: vec3<f32>, roughness: f32, fresnelTerm: f32) -> vec3<f32> {
    let F90 = max(vec3<f32>(1.0 - roughness * 0.8), F0);
    return F0 + (F90 - F0) * fresnelTerm;
}

// =============================================================================
// Core Lighting Functions (Diffuse, Specular, Transmission)
// =============================================================================
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

fn getDirectDiffuseBRDF(NdotL: f32, albedo: vec3<f32>) -> vec3<f32> {
    return albedo * NdotL * INV_PI;
}

// =============================================================================
// Main PBR Orchestration
// =============================================================================
fn getDirectPbrLighting(
    input_vertexPosition: vec3<f32>,
    inputData_position: vec4<f32>,
    visibility: f32,
    N: vec3<f32>, V: vec3<f32>, NdotV: f32,
    roughnessParameter: f32, metallicParameter: f32, albedo: vec3<f32>,
    F0_dielectric_base: vec3<f32>, ior: f32
) -> vec3<f32> {
    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    for (var i = 0u; i < u_directionalLightCount; i++) {
        let lightIntensity = u_directionalLights[i].intensity;
        let L = -normalize(u_directionalLights[i].direction);
        var finalLightColor = u_directionalLights[i].color * lightIntensity * systemUniforms.preExposure * visibility;
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
            F0_dielectric_base, ior
        );
    }
    {
        let clusterIndex = getClusterLightClusterIndex(inputData_position);
        let lightOffset  = clusterLightGrid.cells[clusterIndex].offset;
        let lightCount:u32   = clusterLightGrid.cells[clusterIndex].count;
        for (var lightIndex = 0u; lightIndex < lightCount; lightIndex = lightIndex + 1u) {
            let i = clusterLightGrid.indices[lightOffset + lightIndex];
            let targetLight = clusterLightList.lights[i];
            let u_clusterLightPosition = targetLight.position;
            let u_clusterLightRadius = targetLight.radius;
            let u_isSpotLight = targetLight.isSpotLight;
            let lightDir = u_clusterLightPosition - input_vertexPosition;
            let lightDistance = length(lightDir);
            if (lightDistance > u_clusterLightRadius) { continue; }
            let L = normalize(lightDir);
            let attenuation = getLightDistanceAttenuation(lightDistance, u_clusterLightRadius);
            var finalAttenuation = attenuation;
            if (u_isSpotLight > 0.0) {
                let u_clusterLightDirection = normalize(vec3<f32>(targetLight.directionX, targetLight.directionY, targetLight.directionZ));
                let lightToVertex = normalize(-L);
                finalAttenuation *= getLightAngleAttenuation(lightToVertex, u_clusterLightDirection, targetLight.innerCutoff, targetLight.outerCutoff);
            }
            var finalLightColor = targetLight.color * targetLight.intensity * finalAttenuation * systemUniforms.preExposure;
            totalDirectLighting += getDirectPbrLight(
                finalLightColor,
                N, V, L, NdotV,
                roughnessParameter, metallicParameter, albedo,
                F0_dielectric_base, ior
            );
        }
    }
    return totalDirectLighting;
}

fn getIndirectPbrLighting(
    N: vec3<f32>, V: vec3<f32>, NdotV: f32,
    albedo: vec3<f32>, roughnessParameter: f32, metallicParameter: f32,
    F0: vec3<f32>, F0_dielectric: vec3<f32>, F0_metal: vec3<f32>,
    occlusionParameter: f32
) -> vec3<f32> {
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;
    let preExposure = systemUniforms.preExposure;
    if (u_usePrefilterTexture || u_useSkyAtmosphere) {
        let R = getReflectionVectorFromViewDirection(V, N);
        let NdotV_IBL = max(abs(dot(N, V)), 0.04);
        let iblRoughness = roughnessParameter;
        var reflectedColor = vec3<f32>(0.0);
        var iblDiffuseColor = vec3<f32>(0.0);
        var iblMipmapCount: f32 = 0.0;

        if (u_usePrefilterTexture) {
            let levels = textureNumLevels(ibl_prefilterTexture);
            if (levels > 1u) {
                iblMipmapCount = f32(levels - 1u);
            } else {
                let size = textureDimensions(ibl_prefilterTexture, 0);
                iblMipmapCount = floor(log2(max(f32(size.x), f32(size.y))));
            }
            var mipLevel = iblRoughness * iblMipmapCount;
            reflectedColor = textureSampleLevel( ibl_prefilterTexture, prefilterTextureSampler, R, mipLevel ).rgb * preExposure * systemUniforms.iblIntensity;
            iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0).rgb * preExposure * systemUniforms.iblIntensity;
        }
        if (u_useSkyAtmosphere) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let camH = u_atmo.cameraHeight;
            let atmH = u_atmo.atmosphereHeight;
            let skyIntensity = u_atmo.sunIntensity;
            let specTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, R.y, atmH);
            let levelsAtmo = textureNumLevels(skyAtmosphere_prefilteredTexture);
            let sizeAtmo = textureDimensions(skyAtmosphere_prefilteredTexture, 0);
            let fallbackAtmo = floor(log2(max(f32(sizeAtmo.x), f32(sizeAtmo.y))));
            let atmoMipCount = select(fallbackAtmo, f32(levelsAtmo - 1u), levelsAtmo > 1u);
            let atmoMipLevel = iblRoughness * atmoMipCount;
            let specSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, R, atmoMipLevel).rgb * skyIntensity * preExposure;
            reflectedColor = (reflectedColor * specTrans) + specSkyScat;
            let diffTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, N.y, atmH);
            let skyIrradiance = textureSampleLevel(atmosphereIrradianceLUT, atmosphereSampler, N, 0.0).rgb * skyIntensity * preExposure;
            iblDiffuseColor = (iblDiffuseColor * diffTrans) + skyIrradiance;
        }
        let envBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, clamp(vec2<f32>(NdotV_IBL, roughnessParameter), vec2<f32>(0.005), vec2<f32>(0.995)), 0.0).rg;
        let energyCompensation = 1.0 + F0 * (1.0 / max(envBRDF.x + envBRDF.y, 1e-4) - 1.0);
        reflectedColor *= energyCompensation;

        let fresnelPower = 5.0 - 2.0 * (roughnessParameter);
        let fresnelTerm = pow(saturate(1.0 - NdotV_IBL), fresnelPower);
        let FR_dielectric = getIndirectFresnel(NdotV_IBL, F0_dielectric, roughnessParameter, fresnelTerm);
        let FR_metal      = getIndirectFresnel(NdotV_IBL, F0_metal,      roughnessParameter, fresnelTerm);

        let horizonOcclusion = saturate(1.0 + 1.1 * dot(R, N));
        reflectedColor *= horizonOcclusion * horizonOcclusion;

        let F_IBL_dielectric = F0_dielectric * envBRDF.x + envBRDF.y;
        let F_IBL_metal      = F0_metal * envBRDF.x + envBRDF.y;
        let F_IBL_dielectric_weight = F_IBL_dielectric;

        let specularOcclusion = saturate(pow(NdotV_IBL + occlusionParameter, exp2(-16.0 * (roughnessParameter) - 1.0)) - 1.0 + occlusionParameter);

        let specularAlbedo_IBL = saturate(F0_dielectric * envBRDF.x + envBRDF.y);
        let diffuseWeight_IBL = saturate(vec3<f32>(1.0) - specularAlbedo_IBL);

        let ibl_specular_dielectric = reflectedColor * F_IBL_dielectric_weight * specularOcclusion;
        let envIBL_DIFFUSE = albedo * iblDiffuseColor * diffuseWeight_IBL * INV_PI * occlusionParameter;
        let dielectricPart_IBL = ibl_specular_dielectric + envIBL_DIFFUSE;
        let metallicPart_IBL = reflectedColor * F_IBL_metal * specularOcclusion;

        let baseIndirect = mix(dielectricPart_IBL, metallicPart_IBL, metallicParameter);
        let indirectLighting = baseIndirect;
        return indirectLighting;
    } else {
        let ambientContribution = albedo * systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * occlusionParameter * preExposure * INV_PI;
        var indirectLighting = ambientContribution;
        return indirectLighting;
    }
}

fn getDirectPbrLight(
    lightColor:vec3<f32>,
    N:vec3<f32>, V:vec3<f32>, L:vec3<f32>,
    VdotN:f32,
    roughnessParameter:f32, metallicParameter:f32, albedo:vec3<f32>,
    F0_base:vec3<f32>, ior:f32
) -> vec3<f32>{
    let dLight = lightColor;
    let NdotL_origin = dot(N, L);
    let NdotL = max(NdotL_origin, 0.0);

    if (NdotL <= 0.0) {
        return vec3<f32>(0.0);
    }

    let H = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let LdotH = max(dot(L, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    let combined_f0 = mix(F0_base, albedo, metallicParameter);
    let fresnelTerm = pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
    let F = combined_f0 + (max(vec3<f32>(1.0 - roughnessParameter), combined_f0) - combined_f0) * fresnelTerm;

    let SPEC_BRDF = getDirectSpecularBRDF(F, roughnessParameter, NdotH, VdotN, NdotL);
    let specularAttenuation = clamp(1.0 - roughnessParameter, 0.0, 1.0);
    let specularPart = SPEC_BRDF * NdotL * specularAttenuation;

    let kD = vec3<f32>(1.0) - F;
    let Fd90 = 0.5 + 2.0 * LdotH * LdotH * roughnessParameter;
    let lightScatter = 1.0 + (Fd90 - 1.0) * pow(clamp(1.0 - NdotL, 0.0, 1.0), 5.0);
    let viewScatter = 1.0 + (Fd90 - 1.0) * pow(clamp(1.0 - VdotN, 0.0, 1.0), 5.0);

    let diffusePart = albedo * (lightScatter * viewScatter) * NdotL * INV_PI * kD;

    let dielectricPart = specularPart + diffusePart;
    let metallicPart = specularPart;

    let result = mix(dielectricPart, metallicPart, metallicParameter);
    return result * dLight;
}