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
    let combined = splatWeights + layerHeights;
    let maxVal = max(combined.r, max(combined.g, max(combined.b, combined.a)));
    // 💡 아티스트 감도 완화 곡선 (Power Curve) 적용
    // 슬라이더를 0.0~0.7까지 조작할 때는 넓고 풍부한 부드러운 전이를 보장하고, 0.85가 넘어가면서 칼선으로 수렴하게 설계
    let contrastPower = pow(contrast, 3.0);
    let safeContrast = max(1.0 - contrastPower, 0.02) * 2.0;
    let threshold = maxVal - safeContrast;
    let blended = max(combined - vec4<f32>(threshold), vec4<f32>(0.0));
    
    // 💡 [블리딩 방지 필터] 원래 스플랫 가중치가 0.001 이하인 채널은 높이 편차와 무관하게 완전히 차단(0.0)
    let filteredBlended = blended * step(vec4<f32>(0.001), splatWeights);
    let sumVal = filteredBlended.r + filteredBlended.g + filteredBlended.b + filteredBlended.a;
    // 💡 가중치 소실 방지 안전 폴백
    if (sumVal <= 0.0001) {
        return splatWeights;
    }
    return filteredBlended / sumVal;
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
    // 💡 월드 UV(0~1) 기반 타일링 및 노이즈 연산
    // =============================================================================
    let tileUV  = input_uv * uniforms.tileScale;
    let macroUV = input_uv * uniforms.macroScale;

    let nVal = sin(input_uv.x * 18.0) * cos(input_uv.y * 18.0) +
               sin(input_uv.x * 67.0 + input_uv.y * 43.0) * 0.5;
    let macroBlend = clamp(nVal * 0.5 + 0.5, 0.0, 1.0);

    // =============================================================================
    // 💡 지형 스플랫 알베도 샘플링
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
        // 0i: 풀(Grass)
        let h_grass_detail = textureSample(heightArray, textureSampler, tileUV, 0i).r;
        let h_grass_macro  = textureSample(heightArray, textureSampler, macroUV, 0i).r;
        let h_grass = mix(h_grass_detail, h_grass_macro, macroBlend);

        // 1i: 모래(Sand)
        let h_sand_detail = textureSample(heightArray, textureSampler, tileUV, 1i).r;
        let h_sand_macro  = textureSample(heightArray, textureSampler, macroUV, 1i).r;
        let h_sand = mix(h_sand_detail, h_sand_macro, macroBlend);

        // 2i: 바위(Rock)
        let h_rock_detail = textureSample(heightArray, textureSampler, tileUV, 2i).r;
        let h_rock_macro  = textureSample(heightArray, textureSampler, macroUV, 2i).r;
        let h_rock = mix(h_rock_detail, h_rock_macro, macroBlend);

        // 3i: 자갈(Gravel)
        let h_gravel_detail = textureSample(heightArray, textureSampler, tileUV, 3i).r;
        let h_gravel_macro  = textureSample(heightArray, textureSampler, macroUV, 3i).r;
        let h_gravel = mix(h_gravel_detail, h_gravel_macro, macroBlend);

        // pow 지수 연산으로 칙칙한 회색 톤 높이맵의 윤곽 및 대비를 강제로 강조
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

    // 💡 [언리얼 표준 폴백] 스플랫 맵이 없거나 꺼져서 1x1 투명 검은색 텍스처가 매핑되면
    // R채널(0번째 Grass 레이어)에 100% 가중치를 주어 지형 전체를 덮도록 동작
    if (splatR + splatG + splatB <= 0.01) {
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
        // 1. 각 레이어의 노멀 맵 원시 RGB 샘플링 (조건문 밖에서 무조건 실행하여 Uniform Control Flow 보장)
        let n_grass = textureSample(normalArray, textureSampler, tileUV, 0i).rgb;
        let grassNormal_detail = mix(n_grass, textureSample(normalArray, textureSampler, macroUV, 0i).rgb, macroBlend);

        let n_sand = textureSample(normalArray, textureSampler, tileUV, 1i).rgb;
        let sandNormal_detail = mix(n_sand, textureSample(normalArray, textureSampler, macroUV, 1i).rgb, macroBlend);

        let n_rock = textureSample(normalArray, textureSampler, tileUV, 2i).rgb;
        let rockNormal_detail = mix(n_rock, textureSample(normalArray, textureSampler, macroUV, 2i).rgb, macroBlend);

        let n_gravel = textureSample(normalArray, textureSampler, tileUV, 3i).rgb;
        let gravelNormal_detail = mix(n_gravel, textureSample(normalArray, textureSampler, macroUV, 3i).rgb, macroBlend);

        // 2. 믹싱 전 각 채널의 XY(Raw) 데이터를 [-1.0, 1.0] 탄젠트 평면으로 변환 및 WebGPU 규격 V축 반전 적용
        let xy_grass  = vec2<f32>(grassNormal_detail.r * 2.0 - 1.0,  -(grassNormal_detail.g * 2.0 - 1.0));
        let xy_sand   = vec2<f32>(sandNormal_detail.r * 2.0 - 1.0,   -(sandNormal_detail.g * 2.0 - 1.0));
        let xy_rock   = vec2<f32>(rockNormal_detail.r * 2.0 - 1.0,   -(rockNormal_detail.g * 2.0 - 1.0));
        let xy_gravel = vec2<f32>(gravelNormal_detail.r * 2.0 - 1.0, -(gravelNormal_detail.g * 2.0 - 1.0));

        // 3. XY 탄젠트 벡터 상태에서 정량 가중치 블렌딩 수행
        let blendedXY = xy_grass * normWeights.r + 
                        xy_sand * normWeights.g + 
                        xy_rock * normWeights.b + 
                        xy_gravel * normWeights.a;

        // 4. 노멀 스케일(강도) 적용
        var scaledXY = blendedXY * u_normalScale;
        
        // 💡 [안전 조치] XY 벡터의 길이가 1.0을 초과하여 Z 성분이 0으로 찌그러지며 검은 멍이 맺히는 현상 방지
        let lenSq = dot(scaledXY, scaledXY);
        if (lenSq > 0.98) {
            scaledXY = normalize(scaledXY) * 0.98;
        }

        // 5. RedGPU 표준 Z-Reconstruction: 강도가 적용된 XY 면적에 비례해 Z 높이 복원 (최소 0.2의 하늘 방향 법선 확보)
        let reconstructedZ = sqrt(max(0.001, 1.0 - dot(scaledXY, scaledXY)));

        // 6. 완성된 탄젠트 공간 노멀을 TBN 행렬을 통해 월드 공간으로 변환 후 최종 정규화
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

    // 💡 [최적화] 162라인에서 이미 샘플링된 grass, sand, rock, gravel 변수를 재사용하여 텍스처 대역폭 낭비와 중복 선언 에러를 해결
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

    var metallicParameter: f32 = u_metallicFactor;
    var roughnessParameter: f32 = u_roughnessFactor;
    #redgpu_if ormTexture
        let ormSample = textureSample(ormTexture, textureSampler, inputData.uv);
        metallicParameter *= ormSample.b;
        roughnessParameter *= ormSample.g;
    #redgpu_endIf
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
    var occlusionParameter: f32 = 1.0;
    #redgpu_if ormTexture
        occlusionParameter = textureSample(ormTexture, textureSampler, inputData.uv).r * pbrUniforms.occlusionStrength;
    #redgpu_endIf

    let indirectLighting = getIndirectPbrLighting(
        N, V, NdotV,
        albedo, &roughnessParameter, metallicParameter,
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
    albedo: vec3<f32>, roughnessParameter: ptr<function, f32>, metallicParameter: f32,
    F0: vec3<f32>, F0_dielectric: vec3<f32>, F0_metal: vec3<f32>,
    occlusionParameter: f32
) -> vec3<f32> {
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;
    let preExposure = systemUniforms.preExposure;
    if (u_usePrefilterTexture || u_useSkyAtmosphere) {
        let R = getReflectionVectorFromViewDirection(V, N);
        let NdotV_IBL = max(abs(dot(N, V)), 0.04);
        let iblRoughness = *roughnessParameter;
        var iblDiffuseColor = vec3<f32>(0.0);
        var iblMipmapCount: f32 = 0.0;

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

        let envIBL_DIFFUSE = albedo * iblDiffuseColor * INV_PI * occlusionParameter;
        let dielectricPart_IBL = envIBL_DIFFUSE;

        var metallicPart_IBL = vec3<f32>(0.0);
        if (metallicParameter > 0.0) {
            var reflectedColor = vec3<f32>(0.0);
            if (u_usePrefilterTexture) {
                iblMipmapCount = f32(textureNumLevels(ibl_prefilterTexture) - 1);
                var mipLevel = iblRoughness * iblMipmapCount;
                reflectedColor = textureSampleLevel( ibl_prefilterTexture, prefilterTextureSampler, R, mipLevel ).rgb * preExposure * systemUniforms.iblIntensity;
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
                reflectedColor = (reflectedColor * specTrans) + specSkyScat;
            }
            let envBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, clamp(vec2<f32>(NdotV_IBL, *roughnessParameter), vec2<f32>(0.005), vec2<f32>(0.995)), 0.0).rg;
            let energyCompensation = 1.0 + F0 * (1.0 / max(envBRDF.x + envBRDF.y, 1e-4) - 1.0);
            reflectedColor *= energyCompensation;

            let horizonOcclusion = saturate(1.0 + 1.1 * dot(R, N));
            reflectedColor *= horizonOcclusion * horizonOcclusion;

            let fresnelPower = 5.0 - 2.0 * (*roughnessParameter);
            let fresnelTerm = pow(saturate(1.0 - NdotV_IBL), fresnelPower);
            let FR_metal      = getIndirectFresnel(NdotV_IBL, F0_metal,      *roughnessParameter, fresnelTerm);
            let F_IBL_metal      = FR_metal * envBRDF.x + envBRDF.y;

            let specularOcclusion = saturate(pow(NdotV_IBL + occlusionParameter, exp2(-16.0 * (*roughnessParameter) - 1.0)) - 1.0 + occlusionParameter);
            metallicPart_IBL = reflectedColor * F_IBL_metal * specularOcclusion;
        }

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
    let H = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let LdotH = max(dot(L, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    // Dielectric specular is 0.0
    let diffuse_reflection = getDirectDiffuseBRDF(NdotL, VdotN, LdotH, roughnessParameter, albedo);
    let dielectricPart = diffuse_reflection;

    // Metallic part still calculates specular BRDF
    let metal_f0 = albedo;
    var F = getFresnel(VdotH, metal_f0);
    if (abs(ior - 1.0) < EPSILON) { F = vec3<f32>(0.0); }
    let SPEC_BRDF = getDirectSpecularBRDF(F, roughnessParameter, NdotH, VdotN, NdotL);
    let metallicPart = SPEC_BRDF * NdotL;

    let result = mix(dielectricPart, metallicPart, metallicParameter);
    return result * dLight;
}