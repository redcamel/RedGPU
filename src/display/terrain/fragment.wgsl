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
    tileScale: f32,
    macroScale: f32,
    blendContrast: f32,
    debugSplatTexture: u32,
    grassRoughnessFactor:f32,
    sandRoughnessFactor:f32,
    rockRoughnessFactor:f32,
    gravelRoughnessFactor:f32,
}
@group(2) @binding(0) var<uniform> uniforms: TerrainUniforms;

#redgpu_if baseColorTexture
@group(2) @binding(1) var baseColorTexture: texture_2d<f32>;
#redgpu_endIf
@group(2) @binding(2) var splatTexture: texture_2d<f32>;
@group(2) @binding(3) var diffuseArray: texture_2d_array<f32>;
#redgpu_if normalArray
@group(2) @binding(4) var normalArray: texture_2d_array<f32>;
#redgpu_endIf
@group(2) @binding(5) var textureSampler: sampler;
#redgpu_if ormTexture
@group(2) @binding(6) var ormTexture: texture_2d<f32>;
#redgpu_endIf

// 💡 디테일 Height 맵 배열 바인딩
#redgpu_if heightArray
@group(2) @binding(7) var heightArray: texture_2d_array<f32>;
#redgpu_endIf

// 💡 디테일 ORM (Occlusion, Roughness, Metalness) 맵 배열 바인딩
#redgpu_if ormArray
@group(2) @binding(8) var ormArray: texture_2d_array<f32>;
#redgpu_endIf

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

// =============================================================================
// 💡 Height-Lerp Blending Function (높이 기반 블렌딩 가중치 계산)
// =============================================================================
fn getHeightBlendedWeights(
    splatWeights: vec4<f32>,
    layerHeights: vec4<f32>,
    contrast: f32
) -> vec4<f32> {
    // 💡 [언리얼 엔진 표준 공식] (Height + 1.0) * Weight 곱셈 결합
    let combined = (layerHeights + vec4<f32>(1.0)) * splatWeights;
    let maxVal = max(combined.r, max(combined.g, max(combined.b, combined.a)));

    // 💡 아티스트 감도 완화 곡선 (Power Curve) 적용
    let contrastPower = pow(contrast, 3.0);
    let safeContrast = max(1.0 - contrastPower, 0.02) * 2.0;
    let threshold = maxVal - safeContrast;
    let blended = max(combined - vec4<f32>(threshold), vec4<f32>(0.0));

    let sumVal = blended.r + blended.g + blended.b + blended.a;
    // 💡 가중치 소실 방지 안전 폴백
    if (sumVal <= 0.0001) {
        return splatWeights;
    }
    return blended / sumVal;
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
    let input_uv1 = inputData.uv1;
    let u_camera = systemUniforms.camera;
    let u_cameraPosition = u_camera.cameraPosition;

    let preExposure = systemUniforms.preExposure;
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;

    let u_opacity = pbrUniforms.opacity;
    let u_cutOff = pbrUniforms.cutOff;
    let u_useVertexColor = pbrUniforms.useVertexColor == 1u;
    let u_useVertexTangent = pbrUniforms.useVertexTangent == 1u;

    #redgpu_if baseColorTexture
        let u_baseColorFactor = vec4<f32>(1.0);
    #redgpu_else
        let u_baseColorFactor = pbrUniforms.baseColorFactor;
    #redgpu_endIf
    let u_metallicFactor = pbrUniforms.metallicFactor;
    let u_roughnessFactor = pbrUniforms.roughnessFactor;
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

    #redgpu_if normalArray
    let tbnNeeded = true;
    #redgpu_else
    let tbnNeeded = false;
    #redgpu_endIf

    var tbn: mat3x3<f32>;
    if (tbnNeeded) {
        tbn = getTBNFromVertexTangent(baseNormal, input_vertexTangent);
    }

    // =============================================================================
    // 💡 [언리얼 표준] 카메라 거리 기반 타일링 블렌딩 (Distance-based Tiling Blend)
    // =============================================================================
    let tileUV  = input_uv * uniforms.tileScale;
    let macroUV = input_uv * uniforms.macroScale;

    let dist = distance(systemUniforms.camera.cameraPosition, inputData.vertexPosition);
    let macroBlend = clamp((dist - 40.0) / (180.0 - 40.0), 0.0, 1.0);

    // =============================================================================
    // 💡 지형 스플랫 알베도 샘플링 (거리 기반 블렌드 적용)
    // =============================================================================
    let grass_detail = textureSample(diffuseArray, textureSampler, tileUV, 0i);
    let grass_macro  = textureSample(diffuseArray, textureSampler, macroUV, 0i);
    let grass = mix(grass_detail, grass_macro, macroBlend);

    let sand_detail = textureSample(diffuseArray, textureSampler, tileUV, 1i);
    let sand_macro  = textureSample(diffuseArray, textureSampler, macroUV, 1i);
    let sand = mix(sand_detail, sand_macro, macroBlend);

    let rock_detail = textureSample(diffuseArray, textureSampler, tileUV, 2i);
    let rock_macro  = textureSample(diffuseArray, textureSampler, macroUV, 2i);
    let rock = mix(rock_detail, rock_macro, macroBlend);

    let gravel_detail = textureSample(diffuseArray, textureSampler, tileUV, 3i);
    let gravel_macro  = textureSample(diffuseArray, textureSampler, macroUV, 3i);
    let gravel = mix(gravel_detail, gravel_macro, macroBlend);

    // =============================================================================
    // 💡 텍스처 배열(heightArray)에서 디테일 Height 맵 추출 및 명암 대비 강제 증폭
    // =============================================================================
    var layerHeights = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    #redgpu_if heightArray
    {
        let h_grass_detail = textureSample(heightArray, textureSampler, tileUV, 0i).r;
        let h_grass_macro  = textureSample(heightArray, textureSampler, macroUV, 0i).r;
        let h_grass = mix(h_grass_detail, h_grass_macro, macroBlend);

        let h_sand_detail = textureSample(heightArray, textureSampler, tileUV, 1i).r;
        let h_sand_macro  = textureSample(heightArray, textureSampler, macroUV, 1i).r;
        let h_sand = mix(h_sand_detail, h_sand_macro, macroBlend);

        let h_rock_detail = textureSample(heightArray, textureSampler, tileUV, 2i).r;
        let h_rock_macro  = textureSample(heightArray, textureSampler, macroUV, 2i).r;
        let h_rock = mix(h_rock_detail, h_rock_macro, macroBlend);

        let h_gravel_detail = textureSample(heightArray, textureSampler, tileUV, 3i).r;
        let h_gravel_macro  = textureSample(heightArray, textureSampler, macroUV, 3i).r;
        let h_gravel = mix(h_gravel_detail, h_gravel_macro, macroBlend);

        let h_power = 3.0;
        layerHeights = vec4<f32>(
            pow(clamp(h_grass, 0.0, 1.0), h_power),
            pow(clamp(h_sand, 0.0, 1.0), h_power),
            pow(clamp(h_rock, 0.0, 1.0), h_power),
            pow(clamp(h_gravel, 0.0, 1.0), h_power)
        );
    }
    #redgpu_else
    {
        layerHeights = vec4<f32>(grass.a, sand.a, rock.a, gravel.a);
    }
    #redgpu_endIf

    // =============================================================================
    // 💡 지형 스플랫 마스크 및 Height-Lerp 기반 가중치 정규화 연산 (언리얼 표준 방식)
    // =============================================================================
    let splatMask = textureSample(splatTexture, textureSampler, input_uv);
    let splatR = splatMask.r;
    let splatG = splatMask.g;
    let splatB = splatMask.b;

    var baseWeights = vec4<f32>(splatR, splatG, splatB, splatMask.a);

    if (splatR + splatG + splatB + splatMask.a <= 0.1) {
        baseWeights = vec4<f32>(1.0, 0.0, 0.0, 0.0);
    } else {
        let splatA = select(splatMask.a, max(0.0, 1.0 - (splatR + splatG + splatB)), splatMask.a == 1.0);
        baseWeights = vec4<f32>(splatR, splatG, splatB, splatA);
    }

    let normWeights = getHeightBlendedWeights(baseWeights, layerHeights, uniforms.blendContrast);
    if(uniforms.debugSplatTexture == 1u){
        output.color = splatMask;
        return output;
    }

    // =============================================================================
    // 💡 지형 스플랫 노멀 맵 믹스 (표준 Z-Reconstruction 기반 정밀 연산)
    // =============================================================================
    #redgpu_if normalArray
    {
        let n_grass = textureSample(normalArray, textureSampler, tileUV, 0i).rgb;
        let grassNormal_detail = mix(n_grass, textureSample(normalArray, textureSampler, macroUV, 0i).rgb, macroBlend);

        let n_sand = textureSample(normalArray, textureSampler, tileUV, 1i).rgb;
        let sandNormal_detail = mix(n_sand, textureSample(normalArray, textureSampler, macroUV, 1i).rgb, macroBlend);

        let n_rock = textureSample(normalArray, textureSampler, tileUV, 2i).rgb;
        let rockNormal_detail = mix(n_rock, textureSample(normalArray, textureSampler, macroUV, 2i).rgb, macroBlend);

        let n_gravel = textureSample(normalArray, textureSampler, tileUV, 3i).rgb;
        let gravelNormal_detail = mix(n_gravel, textureSample(normalArray, textureSampler, macroUV, 3i).rgb, macroBlend);

        let xy_grass  = vec2<f32>(grassNormal_detail.r * 2.0 - 1.0,  -(grassNormal_detail.g * 2.0 - 1.0));
        let xy_sand   = vec2<f32>(sandNormal_detail.r * 2.0 - 1.0,   -(sandNormal_detail.g * 2.0 - 1.0));
        let xy_rock   = vec2<f32>(rockNormal_detail.r * 2.0 - 1.0,   -(rockNormal_detail.g * 2.0 - 1.0));
        let xy_gravel = vec2<f32>(gravelNormal_detail.r * 2.0 - 1.0, -(gravelNormal_detail.g * 2.0 - 1.0));

        let blendedXY = xy_grass * normWeights.r +
                        xy_sand * normWeights.g +
                        xy_rock * normWeights.b +
                        xy_gravel * normWeights.a;

        var scaledXY = blendedXY * u_normalScale;

        let lenSq = dot(scaledXY, scaledXY);
        if (lenSq > 0.98) {
            scaledXY = normalize(scaledXY) * 0.98;
        }

        let reconstructedZ = sqrt(max(0.001, 1.0 - dot(scaledXY, scaledXY)));
        N = normalize(tbn * vec3<f32>(scaledXY, reconstructedZ));
    }
    #redgpu_else
    {
        N = baseNormal;
    }
    #redgpu_endIf
    if (backFaceYn) {
        N = -N;
    }
    N = normalize(N);
    let NdotV = max(abs(dot(N, V)), 0.04);

    // Shadow
    let receiveShadowYn = inputData.receiveShadow != 0.0;
    var visibility:f32 = 1.0;
    visibility = getDirectionalShadowVisibility(directionalShadowMap, directionalShadowMapSampler, systemUniforms.shadow.directionalShadowDepthTextureSize, systemUniforms.shadow.directionalShadowBias, systemUniforms.shadow.directionalShadowFilterScale, inputData.shadowCoord);
    if(!receiveShadowYn){
        visibility = 1.0;
    } else {
        visibility = mix(1.0 - systemUniforms.shadow.directionalShadowStrength, 1.0, visibility);
    }

    // Base Color & Alpha
    var baseColor = u_baseColorFactor;
    var resultAlpha:f32 = u_opacity * baseColor.a;
    baseColor *= select(vec4<f32>(1.0), input_vertexColor_0, u_useVertexColor);

    var baseMapColor = vec4<f32>(1.0);
    #redgpu_if baseColorTexture
        baseMapColor = textureSample(baseColorTexture, textureSampler, input_uv);
    #redgpu_endIf

    let diffuseSampleColor = grass * normWeights.r + sand * normWeights.g + rock * normWeights.b + gravel * normWeights.a;

    #redgpu_if baseColorTexture
        baseColor = baseColor * baseMapColor * diffuseSampleColor;
        resultAlpha = resultAlpha * baseMapColor.a * diffuseSampleColor.a;
    #redgpu_else
        baseColor = baseColor * diffuseSampleColor;
        resultAlpha = resultAlpha * diffuseSampleColor.a;
    #redgpu_endIf

    let albedo:vec3<f32> = baseColor.rgb ;
    var ior:f32 = u_KHR_materials_ior;
    if (ior <= 0.0) {
        ior = 1.5;
    }

    // =============================================================================
    // 💡 레이어별 Roughness Factor 가중치 믹스 연산
    // =============================================================================
    let baseLayerRoughnessFactor =
        uniforms.grassRoughnessFactor  * normWeights.r +
        uniforms.sandRoughnessFactor   * normWeights.g +
        uniforms.rockRoughnessFactor   * normWeights.b +
        uniforms.gravelRoughnessFactor * normWeights.a;

    var metallicParameter: f32 = u_metallicFactor;
    var occlusionParameter: f32 = 1.0;
    var roughnessParameter: f32 = u_roughnessFactor;

    // 💡 1. 베이스 매크로 ORM 텍스처 누적 적용
    #redgpu_if ormTexture
    {
        let ormSample = textureSample(ormTexture, textureSampler, inputData.uv);
        occlusionParameter *= ormSample.r;
        metallicParameter *= ormSample.b;
        roughnessParameter *= ormSample.g;
    }
    #redgpu_endIf

    // 💡 2. 디테일 4종 레이어 ORM 텍스처 어레이 누적 적용
    #redgpu_if ormArray
    {
        let orm_grass_detail = textureSample(ormArray, textureSampler, tileUV, 0i);
        let orm_grass_macro  = textureSample(ormArray, textureSampler, macroUV, 0i);
        let orm_grass = mix(orm_grass_detail, orm_grass_macro, macroBlend);

        let orm_sand_detail = textureSample(ormArray, textureSampler, tileUV, 1i);
        let orm_sand_macro  = textureSample(ormArray, textureSampler, macroUV, 1i);
        let orm_sand = mix(orm_sand_detail, orm_sand_macro, macroBlend);

        let orm_rock_detail = textureSample(ormArray, textureSampler, tileUV, 2i);
        let orm_rock_macro  = textureSample(ormArray, textureSampler, macroUV, 2i);
        let orm_rock = mix(orm_rock_detail, orm_rock_macro, macroBlend);

        let orm_gravel_detail = textureSample(ormArray, textureSampler, tileUV, 3i);
        let orm_gravel_macro  = textureSample(ormArray, textureSampler, macroUV, 3i);
        let orm_gravel = mix(orm_gravel_detail, orm_gravel_macro, macroBlend);

        let blendedORM = orm_grass * normWeights.r +
                         orm_sand * normWeights.g +
                         orm_rock * normWeights.b +
                         orm_gravel * normWeights.a;

        occlusionParameter *= blendedORM.r;

        // 💡 [해결 1] 텍스처 노이즈로 인해 지형이 금속(Metal)으로 취급되는 현상 차단
        metallicParameter = 0.0;

        roughnessParameter = max(roughnessParameter * blendedORM.g, baseLayerRoughnessFactor);
    }
    #redgpu_else
    {
        // 💡 [해결 2] ORM 텍스처가 없을 때 거칠기가 비정상적으로 훅 떨어지던 중복 곱셈 제거
        metallicParameter = 0.0;
        roughnessParameter = baseLayerRoughnessFactor;
    }
    #redgpu_endIf

    // 💡 3. 최종 오클루전 강도 보정
    occlusionParameter *= pbrUniforms.occlusionStrength;

    roughnessParameter = max(roughnessParameter, 0.04);
    if (abs(ior - 1.0) < EPSILON) { roughnessParameter = 0.0; }

    let F0_dielectric_base = getDielectricF0(ior);
    let F0_dielectric = F0_dielectric_base;
    var F0_metal = albedo;

    let F0 = mix(F0_dielectric, F0_metal, metallicParameter);

    let totalDirectLighting = getDirectPbrLighting(
        input_vertexPosition, inputData.position, visibility,
        N, V, NdotV,
        roughnessParameter, metallicParameter, albedo,
        F0_dielectric_base, ior
    );

    let indirectLighting = getIndirectPbrLighting(
        N, V, NdotV,
        albedo, roughnessParameter, metallicParameter,
        F0, F0_dielectric, F0_metal,
        occlusionParameter
    );

    let finalColor = vec4<f32>(totalDirectLighting + indirectLighting, resultAlpha);

    #redgpu_if useCutOff
        if (resultAlpha <= u_cutOff) { discard; }
    #redgpu_endIf
    #redgpu_if useTint
        output.color = getTintBlendMode(finalColor, pbrUniforms.tintBlendMode, pbrUniforms.tint);
    #redgpu_else
        output.color = finalColor;
    #redgpu_endIf
    {
        let smoothness = 1.0 - roughnessParameter;
        let smoothnessCurved = smoothness * smoothness * (3.0 - 2.0 * smoothness);
        let baseReflectionStrength = smoothnessCurved * (0.04 + 0.96 * metallicParameter * metallicParameter);
        output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, baseReflectionStrength);
    }
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0 );
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
// KHR Extensions (Sheen, Anisotropy, Clearcoat, Iridescence)
// =============================================================================

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

// =============================================================================
// 💡 [해결 3] 직사광 계산 시 프레넬 감쇠 및 정반사(Specular) 약화 로직이 적용된 함수
// =============================================================================
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

    // 빛을 받지 못하는 뒷면은 연산 종료
    if (NdotL <= 0.0) {
        return vec3<f32>(0.0);
    }

    let H = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let LdotH = max(dot(L, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    let combined_f0 = mix(F0_base, albedo, metallicParameter);

    // 빗각에서 프레넬 반사율이 무조건 1.0(거울)까지 치솟아 비닐처럼 빛나는 현상 물리적 억제
    let fresnelTerm = pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
    let F = combined_f0 + (max(vec3<f32>(1.0 - roughnessParameter), combined_f0) - combined_f0) * fresnelTerm;

    let SPEC_BRDF = getDirectSpecularBRDF(F, roughnessParameter, NdotH, VdotN, NdotL);

    // 거칠기가 높을수록 정반사(Specular) 강도를 강제로 물리적 감쇠시킴
    let specularAttenuation = clamp(1.0 - roughnessParameter, 0.0, 1.0);
    let specularPart = SPEC_BRDF * NdotL * specularAttenuation;

    // 에너지 보존 법칙
    let kD = vec3<f32>(1.0) - F;

    // 디즈니 디퓨즈 적용
    let Fd90 = 0.5 + 2.0 * LdotH * LdotH * roughnessParameter;
    let lightScatter = 1.0 + (Fd90 - 1.0) * pow(clamp(1.0 - NdotL, 0.0, 1.0), 5.0);
    let viewScatter = 1.0 + (Fd90 - 1.0) * pow(clamp(1.0 - VdotN, 0.0, 1.0), 5.0);

    let diffusePart = albedo * (lightScatter * viewScatter) * NdotL * INV_PI * kD;

    let dielectricPart = specularPart + diffusePart;
    let metallicPart = specularPart;

    let result = mix(dielectricPart, metallicPart, metallicParameter);
    return result * dLight;
}