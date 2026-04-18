#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getDirectionalShadowVisibility;
#redgpu_include color.getTintBlendMode;
#redgpu_include entryPoint.mesh.entryPointPickingFragment;
#redgpu_include lighting.getTransmissionRefraction;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
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

fn getKHRTextureTransformUV(
    input_uv: vec2<f32>,
    input_uv1: vec2<f32>,
    texCoord_index: u32,
    use_transform: u32,
    transform_offset: vec2<f32>,
    transform_rotation: f32,
    transform_scale: vec2<f32>
) -> vec2<f32> {
    // 1. UV 좌표 선택 (UV index selection)
    var result_uv = select(input_uv, input_uv1, texCoord_index == 1u);

    // 2. 변환 적용 (Apply transformation if enabled)
    if (use_transform == 1u) {
        // Translation Matrix
        let translation = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            transform_offset.x, transform_offset.y, 1.0
        );

        // Rotation Matrix
        let cos_rot = cos(transform_rotation);
        let sin_rot = sin(transform_rotation);
        let rotation_matrix = mat3x3<f32>(
            cos_rot, -sin_rot, 0.0,
            sin_rot, cos_rot, 0.0,
            0.0, 0.0, 1.0
        );

        // Scale Matrix
        let scale_matrix = mat3x3<f32>(
            transform_scale.x, 0.0, 0.0,
            0.0, transform_scale.y, 0.0,
            0.0, 0.0, 1.0
        );

        // glTF KHR_texture_transform 규격에 따른 TRS 행렬 합성
        let result_matrix = translation * rotation_matrix * scale_matrix;
        result_uv = (result_matrix * vec3<f32>(result_uv, 1.0)).xy;
    }

    return result_uv;
}

struct SheenIBLResult {
    sheenIBLContribution: vec3<f32>,
    sheenAlbedoScaling: f32
}

fn getSheenCharlieDFG(NdotV: f32, roughness: f32) -> f32 {
    if (roughness < 0.01) {
        return 0.0;
    }

    let r = clamp(roughness, 0.01, 1.0);
    let grazingFactor = 1.0 - NdotV;
    let roughnessExp = 1.0 / max(r, EPSILON);
    let distribution = pow(grazingFactor, roughnessExp);
    let intensity = pow(roughnessExp, 0.5);

    return distribution * intensity * 0.5;
}

fn getSheenCharlieE(NdotV: f32, roughness: f32) -> f32 {
    if (roughness < 0.01) {
        return 0.0;
    }

    let r = clamp(roughness, 0.01, 1.0);
    let grazingFactor = 1.0 - NdotV;
    let roughnessExp = 1.0 / max(r, EPSILON);

    return pow(grazingFactor, roughnessExp) * pow(r, 0.5);
}

fn getSheenIBL(
    N: vec3<f32>,
    V: vec3<f32>,
    sheenColor: vec3<f32>,
    maxSheenColor: f32,
    sheenRoughness: f32,
    iblMipmapCount: f32,
    irradianceTexture: texture_cube<f32>,
    textureSampler: sampler
) -> SheenIBLResult {
    let NdotV = clamp(dot(N, V), EPSILON, 1.0);
    let R = getReflectionVectorFromViewDirection(V, N);

    let mipLevel = sheenRoughness * iblMipmapCount;
    let sheenRadiance = textureSampleLevel(irradianceTexture, textureSampler, R, mipLevel).rgb  / systemUniforms.preExposure;

    let sheenDFG = getSheenCharlieDFG(NdotV, sheenRoughness);
    let contribution = sheenRadiance * sheenColor * sheenDFG;

    let E = getSheenCharlieE(NdotV, sheenRoughness);
    let albedoScaling = 1.0 - maxSheenColor * E;

    return SheenIBLResult(contribution, albedoScaling);
}

// [KHR_materials_sheen] Direct
fn getSheenDirect(NdotL: f32, NdotV: f32, NdotH: f32, sheenColor: vec3<f32>, sheenRoughness: f32) -> vec3<f32> {
    let invAlpha = 1.0 / max(sheenRoughness, 0.000001);
    let cos2h = NdotH * NdotH;
    let sin2h = max(1.0 - cos2h, 0.0078125);
    let sheenDistribution = (2.0 + invAlpha) * pow(sin2h, invAlpha * 0.5) / (2.0 * PI);
    let sheenVisibility = 1.0 / (4.0 * (NdotL + NdotV - NdotL * NdotV));
    return sheenColor * sheenDistribution * sheenVisibility;
}

fn getAnisotropicVisibility(
    NdotL: f32, NdotV: f32, BdotV: f32, TdotV: f32, TdotL: f32, BdotL: f32, 
    at: f32, ab: f32
) -> f32 {
   let GGXV = NdotL * length(vec3<f32>(at * TdotV, ab * BdotV, NdotV));
   let GGXL = NdotV * length(vec3<f32>(at * TdotL, ab * BdotL, NdotL));
   let v = 0.5 / max(GGXV + GGXL, EPSILON);
   return v;
}

fn getAnisotropicNDF(NdotH: f32, TdotH: f32, BdotH: f32, at: f32, ab: f32) -> f32 {
    let a2: f32 = at * ab;
    let f: vec3<f32> = vec3<f32>(ab * TdotH, at * BdotH, a2 * NdotH);
    let denominator: f32 = dot(f, f);
    
    // [KO] 수치적 안정성을 위해 INV_PI 적용 및 0 나누기 방어
    // [EN] Applies INV_PI and prevents division by zero for numerical stability
    let w2: f32 = a2 / max(denominator, EPSILON);
    return a2 * w2 * w2 * INV_PI;
}

fn getAnisotropicSpecularBRDF(
    f0: vec3<f32>, 
    alphaRoughness: f32, 
    VdotH: f32, 
    NdotL: f32, 
    NdotV: f32, 
    NdotH: f32, 
    BdotV: f32, 
    TdotV: f32, 
    TdotL: f32, 
    BdotL: f32, 
    TdotH: f32, 
    BdotH: f32, 
    anisotropy: f32
) -> vec3<f32> {
    // [KO] 이방성 파라미터를 기반으로 방향별 거칠기(alpha) 계산
    // [EN] Calculates directional roughness (alpha) based on anisotropic parameters
    var at = mix(alphaRoughness, 1.0, anisotropy * anisotropy);
    var ab = alphaRoughness;
    
    var F: vec3<f32> = getFresnelSchlick(VdotH, f0);
    var V: f32 = getAnisotropicVisibility(NdotL, NdotV, BdotV, TdotV, TdotL, BdotL, at, ab);
    var D: f32 = getAnisotropicNDF(NdotH, TdotH, BdotH, at, ab);
    
    return F * (V * D);
}

// [KHR_materials_anisotropy] Indirect
fn getAnisotropicIBL(
    V: vec3<f32>, N: vec3<f32>,
    roughness: f32, anisotropy: f32,
    anisotropicT: vec3<f32>, anisotropicB: vec3<f32>
) -> vec4<f32> {
    var bentNormal = cross(anisotropicB, V);
    bentNormal = normalize(cross(bentNormal, anisotropicB));
    let temp = 1.0 - anisotropy * (1.0 - roughness);
    let tempSquared = temp * temp;
    var a = tempSquared * tempSquared;
    bentNormal = normalize(mix(bentNormal, N, a));
    var reflectVec = getReflectionVectorFromViewDirection(V, bentNormal);
    reflectVec = normalize(mix(reflectVec, bentNormal, roughness * roughness));
    let roughnessT = roughness * (1.0 + anisotropy);
    let roughnessB = roughness * (1.0 - anisotropy);
    let TdotR = dot(anisotropicT, reflectVec);
    let BdotR = dot(anisotropicB, reflectVec);
    let TdotV = dot(anisotropicT, V);
    let BdotV = dot(anisotropicB, V);
    let R = normalize(reflectVec - anisotropy * (TdotR * anisotropicT - BdotR * anisotropicB));
    let VdotT_abs = abs(TdotV);
    let VdotB_abs = abs(BdotV);
    let totalWeight = max(1e-6, VdotT_abs + VdotB_abs);
    let weightedRoughness = (roughnessT * VdotT_abs + roughnessB * VdotB_abs) / totalWeight;
    return vec4<f32>(R, max(weightedRoughness, 0.04));
}

fn getDiffuseBRDFDisney(NdotL: f32, NdotV: f32, LdotH: f32, roughness: f32, albedo: vec3<f32>) -> vec3<f32> {
    if (NdotL <= 0.0) { return vec3<f32>(0.0); }

    // Disney diffuse term
    let energyBias = mix(0.0, 0.5, roughness);
    let energyFactor = mix(1.0, 1.0 / 1.51, roughness);
    let fd90 = energyBias + 2.0 * LdotH * LdotH * roughness;
    let f0 = 1.0;
    let lightScatter = f0 + (fd90 - f0) * pow(1.0 - NdotL, 5.0);
    let viewScatter = f0 + (fd90 - f0) * pow(1.0 - NdotV, 5.0);

    return albedo * NdotL * lightScatter * viewScatter * energyFactor * INV_PI;
}

fn getFresnelSchlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {
    return F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

fn getIndirectFresnelSchlick(cosTheta: f32, F0: vec3<f32>, roughness: f32) -> vec3<f32> {
    let fresnelPower = 5.0 - 2.0 * roughness;
    let F90 = max(vec3<f32>(1.0 - roughness * 0.8), F0);
    return F0 + (F90 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), fresnelPower);
}

fn getConductorFresnel(F0: vec3<f32>, bsdf: vec3<f32>, VdotH: f32) -> vec3<f32> {
    let fresnel = F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - abs(VdotH), 0.0, 1.0), 5.0);
    return bsdf * fresnel;
}

fn getIridescentFresnel(outsideIOR: f32, iridescenceIOR: f32, baseF0: vec3<f32>,
                      iridescenceThickness: f32, iridescenceFactor: f32, cosTheta1: f32) -> vec3<f32> {
    // 조기 반환
    if (iridescenceThickness <= 0.0 || iridescenceFactor <= 0.0) {
        return baseF0;
    }

    let cosTheta1Abs = abs(cosTheta1);
    let safeIridescenceIOR = max(iridescenceIOR, 1.01);

    // 스넬의 법칙
    let sinTheta1 = sqrt(max(0.0, 1.0 - cosTheta1Abs * cosTheta1Abs));
    let sinTheta2 = (outsideIOR / safeIridescenceIOR) * sinTheta1;

    if (sinTheta2 >= 1.0) {
        return baseF0 + iridescenceFactor * (vec3<f32>(1.0) - baseF0);
    }

    let cosTheta2 = sqrt(max(0.0, 1.0 - sinTheta2 * sinTheta2));

    // 상수들 사전 계산
    let wavelengths = vec3<f32>(650.0, 510.0, 475.0);
    let opticalThickness = 2.0 * iridescenceThickness * safeIridescenceIOR * cosTheta2;
    let phase = (PI2 * opticalThickness) / wavelengths;

    // 삼각함수 (한 번만)
    let cosPhase = cos(phase);
    let sinPhase = sin(phase);

    // 공통 계산값들
    let outsideCos1 = outsideIOR * cosTheta1Abs;
    let iridescenceCos2 = safeIridescenceIOR * cosTheta2;
    let iridescenceCos1 = safeIridescenceIOR * cosTheta1Abs;
    let outsideCos2 = outsideIOR * cosTheta2;

    // 프레넬 계수 (스칼라)
    let r12_s = (outsideCos1 - iridescenceCos2) / max(outsideCos1 + iridescenceCos2, EPSILON);
    let r12_p = (iridescenceCos1 - outsideCos2) / max(iridescenceCos1 + outsideCos2, EPSILON);

    // 기본 F0에서 굴절률 추출 (벡터화)
    let sqrtF0 = sqrt(clamp(baseF0, vec3<f32>(0.01), vec3<f32>(0.99)));
    let safeN3 = max((1.0 + sqrtF0) / max(1.0 - sqrtF0, vec3<f32>(EPSILON)), vec3<f32>(1.2));

    // r23 계산 (벡터화)
    let iridescenceCos2Vec = vec3<f32>(iridescenceCos2);
    let cosTheta1AbsVec = vec3<f32>(cosTheta1Abs);
    let iridescenceCos1Vec = vec3<f32>(iridescenceCos1);
    let cosTheta2Vec = vec3<f32>(cosTheta2);

    let r23_s = (iridescenceCos2Vec - safeN3 * cosTheta1AbsVec) /
                max(iridescenceCos2Vec + safeN3 * cosTheta1AbsVec, vec3<f32>(EPSILON));
    let r23_p = (safeN3 * cosTheta2Vec - iridescenceCos1Vec) /
                max(safeN3 * cosTheta2Vec + iridescenceCos1Vec, vec3<f32>(EPSILON));

    // 복소수 계산을 위한 공통 값들
    let r12_sVec = vec3<f32>(r12_s);
    let r12_pVec = vec3<f32>(r12_p);

    // S-편광 복소수 계산
    let numSReal = r12_sVec + r23_s * cosPhase;
    let numSImag = r23_s * sinPhase;
    let denSReal = vec3<f32>(1.0) + r12_sVec * r23_s * cosPhase;
    let denSImag = r12_sVec * r23_s * sinPhase;

    // P-편광 복소수 계산
    let numPReal = r12_pVec + r23_p * cosPhase;
    let numPImag = r23_p * sinPhase;
    let denPReal = vec3<f32>(1.0) + r12_pVec * r23_p * cosPhase;
    let denPImag = r12_pVec * r23_p * sinPhase;

    // 복소수 나눗셈 인라인 계산 (S-편광)
    let denSSquared = denSReal * denSReal + denSImag * denSImag;
    let rsReal = (numSReal * denSReal + numSImag * denSImag) / max(denSSquared, vec3<f32>(EPSILON));
    let rsImag = (numSImag * denSReal - numSReal * denSImag) / max(denSSquared, vec3<f32>(EPSILON));
    let Rs = rsReal * rsReal + rsImag * rsImag;

    // 복소수 나눗셈 인라인 계산 (P-편광)
    let denPSquared = denPReal * denPReal + denPImag * denPImag;
    let rpReal = (numPReal * denPReal + numPImag * denPImag) / max(denPSquared, vec3<f32>(EPSILON));
    let rpImag = (numPImag * denPReal - numPReal * denPImag) / max(denPSquared, vec3<f32>(EPSILON));
    let Rp = rpReal * rpReal + rpImag * rpImag;

    // 전체 반사율
    let reflectance = 0.5 * (Rs + Rp);

    // 최종 결과
    let clampedReflectance = clamp(reflectance, vec3<f32>(0.0), vec3<f32>(1.0));
    return mix(baseF0, clampedReflectance, iridescenceFactor);
}

fn getDistributionGGX(NdotH: f32, roughness: f32) -> f32 {
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

    // [KO] grazing angle에서의 수치적 발산을 방지하기 위해 최소값 제한
    let safeNdotV = max(NdotV, 1e-4);
    let safeNdotL = max(NdotL, 1e-4);

    let GGXV = safeNdotL * sqrt(safeNdotV * safeNdotV * (1.0 - alpha2) + alpha2);
    let GGXL = safeNdotV * sqrt(safeNdotL * safeNdotL * (1.0 - alpha2) + alpha2);

    return 0.5 / max(GGXV + GGXL, EPSILON);
}

fn getSpecularBRDF(
    F0: vec3<f32>,
    roughness: f32,
    NdotH: f32,
    NdotV: f32,
    NdotL: f32,
    LdotH: f32
) -> vec3<f32> {
    // 1. Distribution (D)
    let D = getDistributionGGX(NdotH, roughness);

    // 2. Visibility (V) - Includes Geometry term and 1/(4*NoL*NoV)
    // [KO] 기존 분리된 G와 분모 계산 방식에서 발생하는 수치적 아티팩트(십자 형태 음영 등)를 방지하기 위해 통합된 가시성 함수 사용
    // [EN] Uses an integrated visibility function to prevent numerical artifacts (such as cross-shaped shading) that occur in the separate G and denominator calculation.
    let V = getSpecularVisibility(NdotV, NdotL, roughness);

    // 3. Fresnel (F)
    let F = getFresnelSchlick(LdotH, F0);

    return D * V * F;
}

fn getSpecularBTDF(
    NdotV: f32,
    NdotL: f32,
    NdotH: f32,
    VdotH: f32,
    LdotH: f32,
    roughness: f32,
    F0: vec3<f32>,
    ior: f32
) -> vec3<f32> {
    let eta: f32 = 1.0 / ior;

    // 1. D (Distribution) 계산
    let D_rough: f32 = getDistributionGGX(NdotH, roughness);
    let t: f32 = clamp((ior - 1.0) * 100.0, 0.0, 1.0);
    let D: f32 = mix(1.0, D_rough, t);

    // 2. G (Geometric) 계산
    let G: f32 = min(1.0, min((2.0 * NdotH * NdotV) / VdotH, (2.0 * NdotH * abs(NdotL)) / VdotH));

    // 3. F (Fresnel) 계산
    let F: vec3<f32> = getFresnelSchlick(VdotH, F0);

    let denom = (eta * VdotH + LdotH) * (eta * VdotH + LdotH);

    // 4. BTDF 공식 적용
    // [KO] 분모에 abs(NdotL)을 추가하여 표준 PBR BTDF 공식을 따름 (렌더링 방정식의 NdotL과 상쇄됨)
    // [EN] Adds abs(NdotL) to the denominator to follow the standard PBR BTDF formula (cancels with NdotL in the rendering equation).
    let btdf: vec3<f32> =
        (vec3<f32>(1.0) - F) *
        abs(VdotH * LdotH) *
        (eta * eta) *
        D *
        G /
        (max(NdotV, EPSILON) * max(abs(NdotL), EPSILON) * max(denom, EPSILON));

    return btdf;
}

fn getDiffuseBTDF(N: vec3<f32>, L: vec3<f32>, albedo: vec3<f32>) -> vec3<f32> {
    // 뒷면으로 들어오는 광선만 처리 (-dot(N,L)를 사용하여 음수만 양수로 변환하여 사용)
    let cosTheta = max(-dot(N, L), 0.0);
    return albedo * cosTheta * INV_PI;
}

fn getFresnelMix(
    F0: vec3<f32>,
    weight: f32,
    base: vec3<f32>,
    layer: vec3<f32>,
    VdotH: f32
) -> vec3<f32> {
    var f0 = min(F0, vec3<f32>(1.0));
    let fr = f0 + (vec3<f32>(1.0) - f0) * pow(clamp(1.0 - abs(VdotH), 0.0, 1.0), 5.0);
    return (1.0 - weight * max(max(fr.x, fr.y), fr.z)) * base + weight * fr * layer;
}

fn getFresnelCoat(NdotV: f32, ior: f32, weight: f32, base: vec3<f32>, layer: vec3<f32>) -> vec3<f32> {
    let f0: f32 = pow((1.0 - ior) / (1.0 + ior), 2.0);
    let fr: f32 = f0 + (1.0 - f0) * pow(clamp(1.0 - abs(NdotV), 0.0, 1.0), 5.0);
    return mix(base, layer, weight * fr);
}

#redgpu_include skyAtmosphere.skyAtmosphereFn

/**
 * [KO] PBR 재질을 위한 유니폼 구조체입니다. 다양한 KHR 확장을 지원합니다.
 * [EN] Uniform structure for PBR material. Supports various KHR extensions.
 */
struct Uniforms {
    useVertexColor: u32,
    useCutOff: u32,
    cutOff: f32,
    alphaBlend: u32,

    doubleSided: u32,
    useVertexTangent: u32,

    opacity: f32,
    useTint: u32,
    tint: vec4<f32>,
    tintBlendMode: u32,

    // [KO] 기본 색상 [EN] Base Color
    baseColorFactor: vec4<f32>,
    // [KO] 에미시브 [EN] Emissive
    emissiveFactor: vec3<f32>,
    emissiveStrength: f32,
    // [KO] 오클루전 [EN] Occlusion
    occlusionStrength: f32,
    // [KO] 금속성 및 거칠기 [EN] Metallic Roughness
    metallicFactor: f32,
    roughnessFactor: f32,
    // [KO] 노멀 스케일 [EN] Normal Scale
    normalScale: f32,

    // [KO] KHR 확장 속성 [EN] KHR extension properties
    useKHR_materials_unlit: u32, // [KO] Unlit 모드 [EN] Unlit mode
    KHR_materials_ior: f32,      // [KO] 굴절률 [EN] Index of Refraction

    // [KO] 투과 관련 (Transmission) [EN] Related to transmission
    useKHR_materials_transmission: u32,
    KHR_transmissionFactor: f32,

    // [KO] 확산 투과 (Diffuse Transmission) [EN] Diffuse Transmission
    useKHR_materials_diffuse_transmission: u32,
    KHR_diffuseTransmissionFactor: f32,
    KHR_diffuseTransmissionColorFactor: vec3<f32>,

    // [KO] 분산 (Dispersion) [EN] Dispersion
    KHR_dispersion: f32,

    // [KO] 볼륨 (Volume) [EN] Volume
    useKHR_materials_volume: u32,
    KHR_thicknessFactor: f32,
    KHR_attenuationDistance: f32,
    KHR_attenuationColor: vec3<f32>,

    // [KO] 스펙큘러 (Specular) [EN] Specular
    useKHR_materials_specular: u32,
    KHR_specularFactor: f32,
    KHR_specularColorFactor: vec3<f32>,

    // [KO] 이방성 (Anisotropy) [EN] Anisotropy
    useKHR_materials_anisotropy: u32,
    KHR_anisotropyStrength: f32,
    KHR_anisotropyRotation: f32,

    // [KO] Iridescence - 무지개색 효과 [EN] Iridescence effect
    useKHR_materials_iridescence: u32,
    KHR_iridescenceFactor: f32,
    KHR_iridescenceIor: f32,
    KHR_iridescenceThicknessMinimum: f32,
    KHR_iridescenceThicknessMaximum: f32,

    // [KO] Sheen - 천/패브릭 질감 [EN] Sheen - cloth/fabric texture
    useKHR_materials_sheen: u32,
    KHR_sheenColorFactor: vec3<f32>,
    KHR_sheenRoughnessFactor: f32,

    // [KO] Clearcoat - 표면 위 투명 코팅층 [EN] Clearcoat - transparent coating layer
    useKHR_materials_clearcoat: u32,
    KHR_clearcoatFactor: f32,
    KHR_clearcoatRoughnessFactor: f32,
    KHR_clearcoatNormalScale: f32,

    #redgpu_include KHR_texture_transform
};

@group(2) @binding(0) var<uniform> uniforms: Uniforms;
@group(2) @binding(1) var baseColorTextureSampler: sampler;

#redgpu_if baseColorTexture
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;
#redgpu_endIf

#redgpu_if emissiveTexture
@group(2) @binding(3) var emissiveTextureSampler: sampler;
@group(2) @binding(4) var emissiveTexture: texture_2d<f32>;
#redgpu_endIf

#redgpu_if normalTexture
@group(2) @binding(5) var normalTextureSampler: sampler;
@group(2) @binding(6) var normalTexture: texture_2d<f32>;
#redgpu_endIf

#redgpu_if packedORMTexture
@group(2) @binding(7) var packedORMTexture: texture_2d<f32>;
#redgpu_endIf

#redgpu_if useKHR_materials_specular
@group(2) @binding(8) var KHR_specularTextureSampler: sampler;
@group(2) @binding(9) var KHR_specularTexture: texture_2d<f32>;
@group(2) @binding(10) var KHR_specularColorTextureSampler: sampler;
@group(2) @binding(11) var KHR_specularColorTexture: texture_2d<f32>;
#redgpu_endIf

@group(2) @binding(12) var KHR_clearcoatNormalTexture: texture_2d<f32>;
@group(2) @binding(13) var packedKHR_clearcoatTexture_transmission: texture_2d<f32>;

#redgpu_if useKHR_materials_diffuse_transmission
@group(2) @binding(14) var packedKHR_diffuse_transmission: texture_2d<f32>;
#redgpu_endIf

#redgpu_if useKHR_materials_sheen
@group(2) @binding(15) var packedKHR_sheen: texture_2d<f32>;
#redgpu_endIf

#redgpu_if useKHR_materials_anisotropy
@group(2) @binding(16) var KHR_anisotropyTexture: texture_2d<f32>;
#redgpu_endIf

#redgpu_if useKHR_materials_iridescence
@group(2) @binding(17) var packedKHR_iridescence: texture_2d<f32>;
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

    // [KO] 입력 데이터 추출 [EN] Extract input data
    let input_vertexNormal = (inputData.vertexNormal.xyz);
    let input_vertexPosition = inputData.vertexPosition.xyz;
    let input_vertexColor_0 = inputData.vertexColor_0;
    let input_vertexTangent = inputData.vertexTangent;
    let input_ndcPosition = inputData.position.xyz / inputData.position.w ;
    let input_uv = inputData.uv;
    let input_uv1 = inputData.uv1;

    // [KO] 조명 및 시스템 유니폼 캐싱 [EN] Cache lighting and system uniforms
    let u_ambientLight = systemUniforms.ambientLight;
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let receiveShadowYn = inputData.receiveShadow != 0.0;

    // [KO] 카메라 정보 [EN] Camera information
    let u_camera = systemUniforms.camera;
    let u_cameraPosition = u_camera.cameraPosition;

    // [KO] 재질 유니폼 추출 [EN] Extract material uniforms
    let u_opacity = uniforms.opacity;
    let u_cutOff = uniforms.cutOff;
    let u_useVertexColor = uniforms.useVertexColor == 1u;
    let u_useVertexTangent = uniforms.useVertexTangent == 1u;
    let u_baseColorFactor = uniforms.baseColorFactor;
    let u_metallicFactor = uniforms.metallicFactor;
    let u_roughnessFactor = uniforms.roughnessFactor;
    let u_normalScale = uniforms.normalScale;
    let u_occlusionStrength = uniforms.occlusionStrength;
    let u_emissiveFactor = uniforms.emissiveFactor;
    let u_emissiveStrength = uniforms.emissiveStrength;

    // [KO] KHR 확장 데이터 추출 [EN] Extract KHR extension data
    let u_useKHR_materials_unlit = uniforms.useKHR_materials_unlit == 1u;
    let u_KHR_materials_ior = uniforms.KHR_materials_ior;
    let u_KHR_dispersion = uniforms.KHR_dispersion;
    let u_KHR_transmissionFactor = uniforms.KHR_transmissionFactor;
    let u_useKHR_materials_volume = uniforms.useKHR_materials_volume == 1u;
    let u_KHR_thicknessFactor = uniforms.KHR_thicknessFactor ;
    let u_KHR_attenuationColor = uniforms.KHR_attenuationColor;
    let u_KHR_attenuationDistance = uniforms.KHR_attenuationDistance ;
    let u_useKHR_materials_diffuse_transmission = uniforms.useKHR_materials_diffuse_transmission == 1u;
    let u_KHR_diffuseTransmissionFactor = uniforms.KHR_diffuseTransmissionFactor;
    let u_KHR_diffuseTransmissionColorFactor = uniforms.KHR_diffuseTransmissionColorFactor;
    let u_KHR_specularFactor = uniforms.KHR_specularFactor;
    let u_KHR_specularColorFactor = uniforms.KHR_specularColorFactor;
    let u_KHR_anisotropyStrength = uniforms.KHR_anisotropyStrength;
    let u_KHR_anisotropyRotation = uniforms.KHR_anisotropyRotation;
    let u_useKHR_anisotropyTexture = uniforms.useKHR_anisotropyTexture == 1u;
    let u_KHR_sheenColorFactor = uniforms.KHR_sheenColorFactor;
    let u_KHR_sheenRoughnessFactor = uniforms.KHR_sheenRoughnessFactor;
    let u_useKHR_materials_iridescence = uniforms.useKHR_materials_iridescence == 1u;
    let u_KHR_iridescenceFactor = uniforms.KHR_iridescenceFactor;
    let u_KHR_iridescenceIor = uniforms.KHR_iridescenceIor;
    let u_KHR_iridescenceThicknessMinimum = uniforms.KHR_iridescenceThicknessMinimum;
    let u_KHR_iridescenceThicknessMaximum = uniforms.KHR_iridescenceThicknessMaximum;
    let u_KHR_clearcoatFactor = uniforms.KHR_clearcoatFactor;
    let u_KHR_clearcoatRoughnessFactor = uniforms.KHR_clearcoatRoughnessFactor;
    let u_KHR_clearcoatNormalScale = uniforms.KHR_clearcoatNormalScale;

    // [KO] 모든 텍스처를 위한 UV 좌표 초기화 [EN] Initialize UV coordinates for all textures
    let diffuseUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.baseColorTexture_texCoord_index, uniforms.use_baseColorTexture_KHR_texture_transform, uniforms.baseColorTexture_KHR_texture_transform_offset, uniforms.baseColorTexture_KHR_texture_transform_rotation, uniforms.baseColorTexture_KHR_texture_transform_scale);
    let emissiveUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.emissiveTexture_texCoord_index, uniforms.use_emissiveTexture_KHR_texture_transform, uniforms.emissiveTexture_KHR_texture_transform_offset, uniforms.emissiveTexture_KHR_texture_transform_rotation, uniforms.emissiveTexture_KHR_texture_transform_scale);
    let occlusionUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.occlusionTexture_texCoord_index, uniforms.use_occlusionTexture_KHR_texture_transform, uniforms.occlusionTexture_KHR_texture_transform_offset, uniforms.occlusionTexture_KHR_texture_transform_rotation, uniforms.occlusionTexture_KHR_texture_transform_scale);
    let metallicRoughnessUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.metallicRoughnessTexture_texCoord_index, uniforms.use_metallicRoughnessTexture_KHR_texture_transform, uniforms.metallicRoughnessTexture_KHR_texture_transform_offset, uniforms.metallicRoughnessTexture_KHR_texture_transform_rotation, uniforms.metallicRoughnessTexture_KHR_texture_transform_scale);
    let normalUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.normalTexture_texCoord_index, uniforms.use_normalTexture_KHR_texture_transform, uniforms.normalTexture_KHR_texture_transform_offset, uniforms.normalTexture_KHR_texture_transform_rotation, uniforms.normalTexture_KHR_texture_transform_scale);
    let KHR_clearcoatUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.KHR_clearcoatTexture_texCoord_index, uniforms.use_KHR_clearcoatTexture_KHR_texture_transform, uniforms.KHR_clearcoatTexture_KHR_texture_transform_offset, uniforms.KHR_clearcoatTexture_KHR_texture_transform_rotation, uniforms.KHR_clearcoatTexture_KHR_texture_transform_scale);
    #redgpu_if useKHR_materials_clearcoat
    let KHR_clearcoatNormalUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.KHR_clearcoatNormalTexture_texCoord_index, uniforms.use_KHR_clearcoatNormalTexture_KHR_texture_transform, uniforms.KHR_clearcoatNormalTexture_KHR_texture_transform_offset, uniforms.KHR_clearcoatNormalTexture_KHR_texture_transform_rotation, uniforms.KHR_clearcoatNormalTexture_KHR_texture_transform_scale);
    #redgpu_endIf
    let KHR_clearcoatRoughnessUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.KHR_clearcoatRoughnessTexture_texCoord_index, uniforms.use_KHR_clearcoatRoughnessTexture_KHR_texture_transform, uniforms.KHR_clearcoatRoughnessTexture_KHR_texture_transform_offset, uniforms.KHR_clearcoatRoughnessTexture_KHR_texture_transform_rotation, uniforms.KHR_clearcoatRoughnessTexture_KHR_texture_transform_scale);
    let KHR_sheenColorUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.KHR_sheenColorTexture_texCoord_index, uniforms.use_KHR_sheenColorTexture_KHR_texture_transform, uniforms.KHR_sheenColorTexture_KHR_texture_transform_offset, uniforms.KHR_sheenColorTexture_KHR_texture_transform_rotation, uniforms.KHR_sheenColorTexture_KHR_texture_transform_scale);
    let KHR_sheenRoughnessUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.KHR_sheenRoughnessTexture_texCoord_index, uniforms.use_KHR_sheenRoughnessTexture_KHR_texture_transform, uniforms.KHR_sheenRoughnessTexture_KHR_texture_transform_offset, uniforms.KHR_sheenRoughnessTexture_KHR_texture_transform_rotation, uniforms.KHR_sheenRoughnessTexture_KHR_texture_transform_scale);
    let KHR_specularTextureUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.KHR_specularTexture_texCoord_index, uniforms.use_KHR_specularTexture_KHR_texture_transform, uniforms.KHR_specularTexture_KHR_texture_transform_offset, uniforms.KHR_specularTexture_KHR_texture_transform_rotation, uniforms.KHR_specularTexture_KHR_texture_transform_scale);
    let KHR_specularColorTextureUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.KHR_specularColorTexture_texCoord_index, uniforms.use_KHR_specularColorTexture_KHR_texture_transform, uniforms.KHR_specularColorTexture_KHR_texture_transform_offset, uniforms.KHR_specularColorTexture_KHR_texture_transform_rotation, uniforms.KHR_specularColorTexture_KHR_texture_transform_scale);
    let KHR_iridescenceTextureUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.KHR_iridescenceTexture_texCoord_index, uniforms.use_KHR_iridescenceTexture_KHR_texture_transform, uniforms.KHR_iridescenceTexture_KHR_texture_transform_offset, uniforms.KHR_iridescenceTexture_KHR_texture_transform_rotation, uniforms.KHR_iridescenceTexture_KHR_texture_transform_scale);
    let KHR_iridescenceThicknessTextureUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.KHR_iridescenceThicknessTexture_texCoord_index, uniforms.use_KHR_iridescenceThicknessTexture_KHR_texture_transform, uniforms.KHR_iridescenceThicknessTexture_KHR_texture_transform_offset, uniforms.KHR_iridescenceThicknessTexture_KHR_texture_transform_rotation, uniforms.KHR_iridescenceThicknessTexture_KHR_texture_transform_scale);
    let KHR_transmissionUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.KHR_transmissionTexture_texCoord_index, uniforms.use_KHR_transmissionTexture_KHR_texture_transform, uniforms.KHR_transmissionTexture_KHR_texture_transform_offset, uniforms.KHR_transmissionTexture_KHR_texture_transform_rotation, uniforms.KHR_transmissionTexture_KHR_texture_transform_scale);
    let KHR_diffuseTransmissionUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.KHR_diffuseTransmissionTexture_texCoord_index, uniforms.use_KHR_diffuseTransmissionTexture_KHR_texture_transform, uniforms.KHR_diffuseTransmissionTexture_KHR_texture_transform_offset, uniforms.KHR_diffuseTransmissionTexture_KHR_texture_transform_rotation, uniforms.KHR_diffuseTransmissionTexture_KHR_texture_transform_scale);
    let KHR_diffuseTransmissionColorUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.KHR_diffuseTransmissionColorTexture_texCoord_index, uniforms.use_KHR_diffuseTransmissionColorTexture_KHR_texture_transform, uniforms.KHR_diffuseTransmissionColorTexture_KHR_texture_transform_offset, uniforms.KHR_diffuseTransmissionColorTexture_KHR_texture_transform_rotation, uniforms.KHR_diffuseTransmissionColorTexture_KHR_texture_transform_scale);
    let KHR_anisotropyUV = getKHRTextureTransformUV(input_uv, input_uv1, uniforms.KHR_anisotropyTexture_texCoord_index, uniforms.use_KHR_anisotropyTexture_KHR_texture_transform, uniforms.KHR_anisotropyTexture_KHR_texture_transform_offset, uniforms.KHR_anisotropyTexture_KHR_texture_transform_rotation, uniforms.KHR_anisotropyTexture_KHR_texture_transform_scale);

    // [KO] 시선 방향 벡터 계산 [EN] View direction vector calculation
    let V: vec3<f32> = getViewDirection(input_vertexPosition, u_cameraPosition);

    // [KO] 법선 벡터(Normal) 계산 및 이면 렌더링 처리 [EN] Normal vector calculation and double-sided rendering
    let baseNormal:vec3<f32> = normalize(input_vertexNormal.xyz);
    var N:vec3<f32> = baseNormal;
    var backFaceYn:bool = false;
    #redgpu_if doubleSided
    {
        // [KO] vFrontFacing과 유사한 안정적인 판정을 위해 정점 법선과 시선 벡터 활용
        if (dot(baseNormal, V) < 0.0) {
            backFaceYn = true;
        }
    }
    #redgpu_endIf

    #redgpu_if normalTexture
    {
        var normalSamplerColor = textureSample(normalTexture, normalTextureSampler, normalUV).rgb;
        let tbn = getTBNFromVertexTangent(baseNormal, input_vertexTangent);
        N = getNormalFromNormalMap(vec3<f32>(normalSamplerColor.r, 1.0 - normalSamplerColor.g, normalSamplerColor.b), tbn, u_normalScale );
    }
    #redgpu_endIf

    // [KO] 이면 렌더링(double-sided) 시 최종적으로 노멀을 카메라 방향으로 반전
    // [EN] Final normal flip towards camera for double-sided rendering
    if (backFaceYn) {
        N = -N;
    }
    N = normalize(N);

    // [KO] 시선 방향 벡터 계산 [EN] View direction vector calculation
    let NdotV = max(abs(dot(N, V)), 1e-6);

    // [KO] 그림자 가시성 계산 [EN] Shadow visibility calculation
    var visibility:f32 = 1.0;
    visibility = getDirectionalShadowVisibility(directionalShadowMap, directionalShadowMapSampler, systemUniforms.shadow.directionalShadowDepthTextureSize, systemUniforms.shadow.directionalShadowBias, inputData.shadowCoord);
    if(!receiveShadowYn){ visibility = 1.0; }

    // [KO] 최종 색상 계산 초기화 [EN] Initialize final color calculation
    var finalColor:vec4<f32>;
    var ior:f32 = u_KHR_materials_ior;
    var baseColor = u_baseColorFactor;
    var resultAlpha:f32 = u_opacity * baseColor.a;
    baseColor *= select(vec4<f32>(1.0), input_vertexColor_0, u_useVertexColor);

    #redgpu_if baseColorTexture
       let diffuseSampleColor =  (textureSample(baseColorTexture, baseColorTextureSampler, diffuseUV));
       baseColor *= diffuseSampleColor;
       resultAlpha *= diffuseSampleColor.a;
    #redgpu_endIf

    let albedo:vec3<f32> = baseColor.rgb ;

    // [KO] Unlit 모드 처리 [EN] Handle Unlit mode
    #redgpu_if useKHR_materials_unlit
    if(u_useKHR_materials_unlit){
        output.color = baseColor;
        return output;
    }
    #redgpu_endIf

    // [KO] 오클루전 파라미터 [EN] Occlusion parameter
    var occlusionParameter:f32 = 1.0;
    #redgpu_if useOcclusionTexture
        occlusionParameter = textureSample(packedORMTexture, packedTextureSampler, occlusionUV).r * u_occlusionStrength;
    #redgpu_endIf

    // [KO] 금속성 및 거칠기 파라미터 [EN] Metallic and Roughness parameters
    var metallicParameter: f32 = u_metallicFactor;
    var roughnessParameter: f32 = u_roughnessFactor;
    #redgpu_if useMetallicRoughnessTexture
        let metallicRoughnessSample = (textureSample(packedORMTexture, packedTextureSampler, metallicRoughnessUV));
        metallicParameter = metallicRoughnessSample.b * metallicParameter;
        roughnessParameter = metallicRoughnessSample.g * roughnessParameter;
    #redgpu_endIf
    roughnessParameter = max(roughnessParameter, 0.045);
    if (abs(ior - 1.0) < EPSILON) { roughnessParameter = 0.0; }

    // [KO] 클리어코트 처리 [EN] Clearcoat processing
    var clearcoatParameter = u_KHR_clearcoatFactor;
    var clearcoatRoughnessParameter = u_KHR_clearcoatRoughnessFactor ;
    // [KO] 클리어코트 노멀은 베이스 노멀 맵의 영향을 받지 않는 기하 법선으로 초기화해야 합니다. (glTF 사양 준수)
    // [EN] Clearcoat normal should be initialized with the geometric normal, unaffected by the base normal map.
    var clearcoatNormal:vec3<f32> = select(baseNormal, -baseNormal, backFaceYn);
    #redgpu_if useKHR_materials_clearcoat
    {
        if(clearcoatParameter != 0.0){
            #redgpu_if useKHR_clearcoatTexture
                let clearcoatSample =  textureSample(packedKHR_clearcoatTexture_transmission, packedTextureSampler, KHR_clearcoatUV);
                clearcoatParameter *= clearcoatSample.r;
            #redgpu_endIf
            #redgpu_if useKHR_clearcoatRoughnessTexture
                let clearcoatRoughnesstSample =  textureSample(packedKHR_clearcoatTexture_transmission, packedTextureSampler, KHR_clearcoatRoughnessUV);
                clearcoatRoughnessParameter *= clearcoatRoughnesstSample.g;
            #redgpu_endIf
            #redgpu_if useKHR_clearcoatNormalTexture
            {
                var targetUv = KHR_clearcoatNormalUV;
                let clearcoatNormalSamplerColor = textureSample(KHR_clearcoatNormalTexture, baseColorTextureSampler, targetUv).rgb;

                // [KO] 클리어코트 TBN은 상단 메인 노멀 로직과 동일하게 기하 법선(baseNormal)을 기준으로 구축합니다.
                let clearcoatTBN = getTBNFromVertexTangent(baseNormal, input_vertexTangent);

                // [KO] 텍스처로부터 얻은 노멀은 아직 이면 처리가 되지 않은 상태이므로 수동으로 반전합니다.
                let texturedNormal = getNormalFromNormalMap(clearcoatNormalSamplerColor, clearcoatTBN, u_KHR_clearcoatNormalScale);
                clearcoatNormal = select(texturedNormal, -texturedNormal, backFaceYn);
            }
            #redgpu_endIf

            // [KO] 초기화 시 사용된 N은 이미 상단(line 371)에서 반전 처리되었으므로, 
            // [KO] 텍스처가 없는 경우 여기서 추가 반전을 하지 않아야 이중 반전을 피할 수 있습니다.
            clearcoatNormal = normalize(clearcoatNormal);
        }
    }
    #redgpu_endIf

    // [KO] 스펙큘러 관련 확장 [EN] Specular related extensions
    var specularParameter = u_KHR_specularFactor;
    var specularColor = u_KHR_specularColorFactor;
    #redgpu_if useKHR_materials_specular
        #redgpu_if KHR_specularColorTexture
            let specularColorTextureSample = textureSample(KHR_specularColorTexture, KHR_specularColorTextureSampler, KHR_specularColorTextureUV);
            specularColor *= specularColorTextureSample.rgb;
        #redgpu_endIf
        #redgpu_if KHR_specularTexture
            let specularTextureSample = textureSample(KHR_specularTexture, KHR_specularTextureSampler, KHR_specularTextureUV);
            specularParameter *= specularTextureSample.a;
        #redgpu_endIf
    #redgpu_endIf

    // [KO] 투과 및 볼륨 확장 [EN] Transmission and Volume extensions
    var transmissionParameter: f32 = u_KHR_transmissionFactor;
    var thicknessParameter: f32 = u_KHR_thicknessFactor;
    #redgpu_if useKHR_materials_transmission
        #redgpu_if useKHR_transmissionTexture
          let transmissionSample: vec4<f32> = textureSample(packedKHR_clearcoatTexture_transmission, packedTextureSampler, KHR_transmissionUV);
          transmissionParameter *= transmissionSample.b;
        #redgpu_endIf
        #redgpu_if useKHR_thicknessTexture
            let thicknessSample: vec4<f32> = textureSample(packedKHR_clearcoatTexture_transmission, packedTextureSampler, KHR_transmissionUV);
            thicknessParameter *= thicknessSample.a;
        #redgpu_endIf
    #redgpu_endIf

    // [KO] 확산 투과 확장 [EN] Diffuse transmission extension
    var diffuseTransmissionColor:vec3<f32> = u_KHR_diffuseTransmissionColorFactor;
    var diffuseTransmissionParameter : f32 = u_KHR_diffuseTransmissionFactor;
    #redgpu_if useKHR_materials_diffuse_transmission
        #redgpu_if useKHR_diffuseTransmissionTexture
            let diffuseTransmissionTextureSample =  textureSample(packedKHR_diffuse_transmission, packedTextureSampler, KHR_diffuseTransmissionUV);
            diffuseTransmissionParameter *= diffuseTransmissionTextureSample.a;
        #redgpu_endIf
        #redgpu_if useKHR_diffuseTransmissionColorTexture
            let diffuseTransmissionColorTextureSample =  textureSample(packedKHR_diffuse_transmission, packedTextureSampler, KHR_diffuseTransmissionColorUV);
            diffuseTransmissionColor *= diffuseTransmissionColorTextureSample.rgb;
        #redgpu_endIf
    #redgpu_endIf

    // [KO] Sheen 확장 [EN] Sheen extension
    var sheenColor = u_KHR_sheenColorFactor;
    var sheenRoughnessParameter = u_KHR_sheenRoughnessFactor;
    #redgpu_if useKHR_materials_sheen
        #redgpu_if useKHR_sheenColorTexture
            let sheenColorSample = (textureSample(packedKHR_sheen, packedTextureSampler, KHR_sheenColorUV));
            sheenColor *= sheenColorSample.rgb;
        #redgpu_endIf
        #redgpu_if useKHR_sheenRoughnessTexture
            let sheenRoughnessSample = (textureSample(packedKHR_sheen, packedTextureSampler, KHR_sheenRoughnessUV));
            sheenRoughnessParameter *= sheenRoughnessSample.a;
        #redgpu_endIf
    #redgpu_endIf

    // [KO] Iridescence 확장 [EN] Iridescence extension
    var iridescenceParameter = u_KHR_iridescenceFactor;
    var iridescenceThickness = u_KHR_iridescenceThicknessMaximum;
    #redgpu_if useKHR_materials_iridescence
        #redgpu_if useKHR_iridescenceTexture
            let iridescenceTextureSample: vec4<f32> = textureSample(packedKHR_iridescence, packedTextureSampler, KHR_iridescenceTextureUV);
            iridescenceParameter *= iridescenceTextureSample.r;
        #redgpu_endIf
        #redgpu_if useKHR_iridescenceThicknessTexture
            let iridescenceThicknessTextureSample: vec4<f32> = textureSample(packedKHR_iridescence, packedTextureSampler, KHR_iridescenceThicknessTextureUV);
            iridescenceThickness =  mix(u_KHR_iridescenceThicknessMinimum, u_KHR_iridescenceThicknessMaximum, iridescenceThicknessTextureSample.g);
        #redgpu_endIf
    #redgpu_endIf

    // [KO] 이방성(Anisotropy) 확장 [EN] Anisotropy extension
    var anisotropy: f32 = u_KHR_anisotropyStrength;
    var anisotropicT: vec3<f32> = vec3<f32>(1.0);
    var anisotropicB: vec3<f32>= vec3<f32>(1.0);
    #redgpu_if useKHR_materials_anisotropy
    {
       // 1. 기본 TBN 기저 구축
       let tbn = getTBNFromVertexTangent(N, input_vertexTangent);
       let T = tbn[0];
       let B = tbn[1];

       var anisotropicDirection: vec2<f32> = vec2<f32>(1.0, 0.0);
       if(u_useKHR_anisotropyTexture){
           let anisotropyTex = textureSample(KHR_anisotropyTexture, baseColorTextureSampler, KHR_anisotropyUV).rgb;
           // [KO] 텍스처의 rg를 [0, 1] 범위에서 [-1, 1]로 변환 [EN] Convert texture rg from [0, 1] range to [-1, 1]
           anisotropicDirection = anisotropyTex.rg * 2.0 - vec2<f32>(1.0, 1.0);
           anisotropy *= anisotropyTex.b;
       }

       // 2. 이방성 회전 적용 (GLTF 스펙: 시계 반대 방향 회전)
       // [EN] Apply anisotropic rotation (GLTF spec: counter-clockwise rotation)
       var cosR = cos(u_KHR_anisotropyRotation);
       var sinR = sin(u_KHR_anisotropyRotation);
       let rotationMtx: mat2x2<f32> = mat2x2<f32>(cosR, sinR, -sinR, cosR);

       // [KO] 텍스처에서 얻어온 방향에 추가 회전각을 결합 [EN] Combine additional rotation angle with direction obtained from texture
       anisotropicDirection = rotationMtx * anisotropicDirection;

       // 3. 최종 이방성 탄젠트/바이탄젠트 계산 (TBN 공간으로 투영)
       // [EN] Final anisotropic tangent/bitangent calculation (projection into TBN space)
       let anisotropicTBN = getTBN(N, T * anisotropicDirection.x + B * anisotropicDirection.y);
       anisotropicT = anisotropicTBN[0];
       anisotropicB = anisotropicTBN[1];
    }
    #redgpu_endIf

    // [KO] 투과 및 배경 샘플링 처리 [EN] Transmission and background sampling
    var transmissionRefraction = vec3<f32>(0.0);
    #redgpu_if useKHR_materials_transmission
    {
        transmissionRefraction = getTransmissionRefraction(u_useKHR_materials_volume, thicknessParameter * inputData.localNodeScale_volumeScale[1] , u_KHR_dispersion, u_KHR_attenuationDistance , u_KHR_attenuationColor, ior, roughnessParameter, albedo, systemUniforms.projection.projectionViewMatrix, input_vertexPosition, input_ndcPosition, V, N, renderPath1ResultTexture, renderPath1ResultTextureSampler);

        // [KO] 배경 텍스처는 이미 노출이 적용된 상태이므로, 물리적 합성을 위해 노출을 제거하여 원본 휘도로 복원
        // [EN] Since the background texture is already exposed, revert it to original radiance for physical synthesis
        if (systemUniforms.preExposure > 0.0) {
            transmissionRefraction /= systemUniforms.preExposure;
        }

        // [KO] 볼륨 감쇄(Beer-Lambert Law) 전역 적용
        // [EN] Apply volume attenuation (Beer-Lambert Law) globally
        #redgpu_if useKHR_materials_volume
        if (u_useKHR_materials_volume) {
            let localNodeScale = inputData.localNodeScale_volumeScale[0];
            let scaledThickness = thicknessParameter * localNodeScale;
            let safeAttenuationColor = clamp(u_KHR_attenuationColor, vec3<f32>(EPSILON), vec3<f32>(1.0));
            let safeAttenuationDistance = max(u_KHR_attenuationDistance, EPSILON);
            let attenuationCoefficient = -log(safeAttenuationColor) / safeAttenuationDistance;

            // 굴절각을 고려한 대략적인 투과 거리 계산 (NdotV 기반 근사)
            let pathLength = scaledThickness / max(NdotV, 0.04);
            let volumeTransmittance = exp(-attenuationCoefficient * pathLength);
            transmissionRefraction *= volumeTransmittance;
        }
        #redgpu_endIf
    }
    #redgpu_endIf

    // [KO] 기본 F0 계산 [EN] Base F0 calculation
    let f0_factor = (ior - 1.0) / (ior + 1.0);
    let F0_dielectric_base = vec3(f0_factor * f0_factor);
    var F0_dielectric = F0_dielectric_base *  specularColor;
    var F0_metal = baseColor.rgb;

    #redgpu_if useKHR_materials_iridescence
        if (iridescenceParameter > 0.0) {
            F0_dielectric = getIridescentFresnel(1.0, u_KHR_iridescenceIor, F0_dielectric, iridescenceThickness, iridescenceParameter, NdotV);
            F0_metal = getIridescentFresnel(1.0, u_KHR_iridescenceIor, baseColor.rgb, iridescenceThickness, iridescenceParameter, NdotV);
        }
    #redgpu_endIf
    let F0 = mix(F0_dielectric, F0_metal, metallicParameter);

    // [KO] 직접 조명 계산 [EN] Direct lighting calculation
    var totalDirectLighting = calcPbrDirectLight(
        input_vertexPosition, inputData.position, visibility,
        N, V, NdotV,
        roughnessParameter, metallicParameter, albedo,
        F0_dielectric_base, ior,
        specularColor, specularParameter,
        u_useKHR_materials_diffuse_transmission, diffuseTransmissionParameter, diffuseTransmissionColor,
        transmissionParameter,
        sheenColor, sheenRoughnessParameter,
        anisotropy, anisotropicT, anisotropicB,
        clearcoatParameter, clearcoatRoughnessParameter, clearcoatNormal,
        u_useKHR_materials_iridescence, iridescenceParameter, u_KHR_iridescenceIor, iridescenceThickness
    );

    // [KO] 간접 조명 계산 [EN] Indirect lighting calculation
    let indirectLighting = calcPbrIndirectLight(
        N, V, NdotV,
        albedo, &roughnessParameter, metallicParameter,
        F0, F0_dielectric, F0_metal,
        specularParameter,
        occlusionParameter,
        transmissionParameter, transmissionRefraction,
        u_useKHR_materials_diffuse_transmission, diffuseTransmissionParameter, diffuseTransmissionColor,
        sheenColor, sheenRoughnessParameter,
        anisotropy, anisotropicT, anisotropicB,
        clearcoatParameter, clearcoatRoughnessParameter, clearcoatNormal
    );

    finalColor = vec4<f32>(totalDirectLighting + indirectLighting, resultAlpha);

    // [KO] 에미시브 계산 [EN] Emissive calculation
    var emissiveColor = u_emissiveFactor * u_emissiveStrength;
    #redgpu_if emissiveTexture
        emissiveColor *= textureSample(emissiveTexture, emissiveTextureSampler, emissiveUV).rgb;
    #redgpu_endIf

    // [KO] 에미시브 물리 기반 보정 및 합산 (Intensity to Radiance)
    // [EN] Physically-based emissive correction and addition (Intensity to Radiance)
    finalColor = vec4<f32>(finalColor.rgb + emissiveColor, resultAlpha);

    // [KO] 컷오프 판단 [EN] Cut-off check
    #redgpu_if useCutOff
        if (resultAlpha <= u_cutOff) { discard; }
    #redgpu_endIf

    output.color = finalColor;

    // [KO] G-Buffer 데이터 출력 [EN] G-Buffer data output
    {
        let smoothness = 1.0 - roughnessParameter;
        let smoothnessCurved = smoothness * smoothness * (3.0 - 2.0 * smoothness);
        let metallicWeight = metallicParameter * metallicParameter;
        let baseReflection = 0.04 + 0.96 * metallicWeight;
        let baseReflectionStrength = smoothnessCurved * baseReflection;
        output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, baseReflectionStrength);
    }
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0 );

    return output;
}

// [KHR_materials_clearcoat] Direct
fn getClearcoatDirect(
    L: vec3<f32>, V: vec3<f32>, H: vec3<f32>,
    clearcoatNormal: vec3<f32>,
    clearcoatRoughness: f32,
    LdotH: f32
) -> vec3<f32> {
    let clearcoatNdotL = max(dot(clearcoatNormal, L), 0.0);
    let clearcoatNdotV = max(dot(clearcoatNormal, V), 1e-6);
    let clearcoatNdotH = max(dot(clearcoatNormal, H), 0.0);
    let clearcoatF0 = vec3<f32>(0.04);
    let CLEARCOAT_SPEC = getSpecularBRDF(clearcoatF0, clearcoatRoughness, clearcoatNdotH, clearcoatNdotV, clearcoatNdotL, LdotH);
    return CLEARCOAT_SPEC * clearcoatNdotL;
}

// [KHR_materials_clearcoat] Indirect
fn getClearcoatIndirect(
    V: vec3<f32>,
    clearcoatNormal: vec3<f32>,
    clearcoatRoughness: f32,
    iblMipmapCount: f32,
    ibl_prefilterTexture: texture_cube<f32>,
    prefilterTextureSampler: sampler,
    ibl_brdfLUTTexture: texture_2d<f32>,
    useSkyAtmosphere: bool,
    sunIntensity: f32,
    skyAtmosphere_prefilteredTexture: texture_cube<f32>,
    atmosphereSampler: sampler,
    cameraHeight: f32,
    atmosphereHeight: f32,
    transmittanceTexture: texture_2d<f32>
) -> vec4<f32> {
    let clearcoatR = getReflectionVectorFromViewDirection(V, clearcoatNormal);
    let clearcoatNdotV = max(abs(dot(clearcoatNormal, V)), 1e-6);
    let clearcoatMipLevel = clearcoatRoughness * iblMipmapCount;
    var clearcoatRadiance = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, clearcoatR, clearcoatMipLevel).rgb / systemUniforms.preExposure;

    if (useSkyAtmosphere) {
        let ccTrans = getTransmittance(transmittanceTexture, atmosphereSampler, cameraHeight, clearcoatR.y, atmosphereHeight);
        let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
        let atmoMipLevel = clearcoatRoughness * atmoMipCount;
        let ccSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, clearcoatR, atmoMipLevel).rgb * sunIntensity;
        clearcoatRadiance = (clearcoatRadiance * ccTrans) + ccSkyScat;
    }

    let clearcoatEnvBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, clamp(vec2<f32>(clearcoatNdotV, clearcoatRoughness), vec2<f32>(0.005), vec2<f32>(0.995)), 0.0).rg;
    let clearcoatF0 = vec3<f32>(0.04);
    let coatF = getIndirectFresnelSchlick(clearcoatNdotV, clearcoatF0, clearcoatRoughness).x;
    let clearcoatIBL_Weight = (0.04 * clearcoatEnvBRDF.x + clearcoatEnvBRDF.y);
    let color = clearcoatRadiance * clearcoatIBL_Weight;
    return vec4<f32>(color, coatF);
}

// [KO] 물리 기반 직접 조명 계산 함수 (PBR Direct)
// [EN] Physically-based direct lighting calculation function (PBR Direct)
fn calcPbrDirectLight(
    input_vertexPosition: vec3<f32>,
    inputData_position: vec4<f32>,
    visibility: f32,
    N: vec3<f32>, V: vec3<f32>, NdotV: f32,
    roughnessParameter: f32, metallicParameter: f32, albedo: vec3<f32>,
    F0_dielectric_base: vec3<f32>, ior: f32,
    specularColor: vec3<f32>, specularParameter: f32,
    u_useKHR_materials_diffuse_transmission: bool, diffuseTransmissionParameter: f32, diffuseTransmissionColor: vec3<f32>,
    transmissionParameter: f32,
    sheenColor: vec3<f32>, sheenRoughnessParameter: f32,
    anisotropy: f32, anisotropicT: vec3<f32>, anisotropicB: vec3<f32>,
    clearcoatParameter: f32, clearcoatRoughnessParameter: f32, clearcoatNormal: vec3<f32>,
    useIridescence: bool, iridescenceFactor: f32, iridescenceIor: f32, iridescenceThickness: f32
) -> vec3<f32> {
    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    // [KO] 직접 조명 계산 - Directional Light (Lux-based)
    for (var i = 0u; i < u_directionalLightCount; i++) {
        let lightIntensity = u_directionalLights[i].intensity;
        let L = -normalize(u_directionalLights[i].direction);

        // [KO] 통합 에너지 계산 (색상 * 강도 * 노출 * 가시성)
        var finalLightColor = u_directionalLights[i].color * lightIntensity * systemUniforms.preExposure * visibility;

        // [KO] 대기 산란이 활성화된 경우 태양광에 대기 투과율 적용
        if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let surfaceHeightKm = max(0.0, input_vertexPosition.y / 1000.0);
            let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, L.y, u_atmo.atmosphereHeight);
            finalLightColor *= atmosphereTransmittance;
        }

        totalDirectLighting += calcPbrLight(
            finalLightColor,
            N, V, L, NdotV,
            roughnessParameter, metallicParameter, albedo,
            F0_dielectric_base, ior,
            specularColor, specularParameter,
            u_useKHR_materials_diffuse_transmission, diffuseTransmissionParameter, diffuseTransmissionColor,
            transmissionParameter,
            sheenColor, sheenRoughnessParameter,
            anisotropy, anisotropicT, anisotropicB,
            clearcoatParameter, clearcoatRoughnessParameter, clearcoatNormal,
            useIridescence, iridescenceFactor, iridescenceIor, iridescenceThickness
        );
    }

    // [KO] 직접 조명 계산 - Point/Spot Lights (Clustered)
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

            // [KO] 스포트라이트 처리
            if (u_isSpotLight > 0.0) {
                let u_clusterLightDirection = normalize(vec3<f32>(targetLight.directionX, targetLight.directionY, targetLight.directionZ));
                let lightToVertex = normalize(-L);
                finalAttenuation *= getLightAngleAttenuation(lightToVertex, u_clusterLightDirection, targetLight.innerCutoff, targetLight.outerCutoff);
            }

            var finalLightColor = targetLight.color * targetLight.intensity * finalAttenuation * systemUniforms.preExposure;

            totalDirectLighting += calcPbrLight(
                finalLightColor,
                N, V, L, NdotV,
                roughnessParameter, metallicParameter, albedo,
                F0_dielectric_base, ior,
                specularColor, specularParameter,
                u_useKHR_materials_diffuse_transmission, diffuseTransmissionParameter, diffuseTransmissionColor,
                transmissionParameter,
                sheenColor, sheenRoughnessParameter,
                anisotropy, anisotropicT, anisotropicB,
                clearcoatParameter, clearcoatRoughnessParameter, clearcoatNormal,
                useIridescence, iridescenceFactor, iridescenceIor, iridescenceThickness
            );
        }
    }

    return totalDirectLighting;
}

// [KO] 물리 기반 간접 조명 계산 함수 (PBR Indirect/IBL)
// [EN] Physically-based indirect lighting calculation function (PBR Indirect/IBL)
fn calcPbrIndirectLight(
    N: vec3<f32>, V: vec3<f32>, NdotV: f32,
    albedo: vec3<f32>, roughnessParameter: ptr<function, f32>, metallicParameter: f32,
    F0: vec3<f32>, F0_dielectric: vec3<f32>, F0_metal: vec3<f32>,
    specularParameter: f32,
    occlusionParameter: f32,
    transmissionParameter: f32, transmissionRefraction: vec3<f32>,
    u_useKHR_materials_diffuse_transmission: bool, diffuseTransmissionParameter: f32, diffuseTransmissionColor: vec3<f32>,
    sheenColor: vec3<f32>, sheenRoughnessParameter: f32,
    anisotropy: f32, anisotropicT: vec3<f32>, anisotropicB: vec3<f32>,
    clearcoatParameter: f32, clearcoatRoughnessParameter: f32, clearcoatNormal: vec3<f32>
) -> vec3<f32> {
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;

    if (u_usePrefilterTexture || u_useSkyAtmosphere) {
        var R = getReflectionVectorFromViewDirection(V, N);
        let NdotV_IBL = max(abs(dot(N, V)), 1e-6);

        #redgpu_if useKHR_materials_anisotropy
        if (anisotropy > 0.0)
        {
            let anisotropicResult = getAnisotropicIBL(V, N, *roughnessParameter, anisotropy, anisotropicT, anisotropicB);
            R = anisotropicResult.xyz;
            *roughnessParameter = anisotropicResult.w;
        }
        #redgpu_endIf

        // [KO] ibl (roughness에 따른 mipmap 레벨 적용) [EN] ibl (apply mipmap level based on roughness)
        var reflectedColor = vec3<f32>(0.0);
        var iblDiffuseColor = vec3<f32>(0.0);
        var iblMipmapCount: f32 = 0.0;

        if (u_usePrefilterTexture) {
            iblMipmapCount = f32(textureNumLevels(ibl_prefilterTexture) - 1);
            var mipLevel = (*roughnessParameter) * iblMipmapCount;
            // [KO] 스카이박스의 계산된 물리적 강도(skyboxIntensity)를 반영하여 IBL 샘플링 (배경과 조명 일치)
            // [EN] Sample IBL reflecting the skybox's calculated physical intensity (matching background and lighting)
            reflectedColor = textureSampleLevel( ibl_prefilterTexture, prefilterTextureSampler, R, mipLevel ).rgb * systemUniforms.skyboxIntensity;
            iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0).rgb * systemUniforms.skyboxIntensity;
        }

        // [KO] 대기 산란 필터링 및 조도 합성 (IBL 동기화)
        // [EN] Atmospheric Scattering Filtering and Irradiance Synthesis (IBL Synchronization)
        if (u_useSkyAtmosphere) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let camH = u_atmo.cameraHeight;
            let atmH = u_atmo.atmosphereHeight;

            // [KO] Specular 필터링: (HDR 반사 * 투과율) + 실시간 하늘 산란광
            // [EN] Specular Filtering: (HDR Reflection * Transmittance) + Real-time Sky Scattering
            let specTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, R.y, atmH);

            // [KO] 큐브맵 기반 실시간 반사광 샘플링 (거칠기 대응)
            // [KO] 생성기가 이제 '단위 광휘'를 저장하므로 sunIntensity를 곱해줍니다.
            let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
            let atmoMipLevel = (*roughnessParameter) * atmoMipCount;
            let specSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, R, atmoMipLevel).rgb * u_atmo.sunIntensity;

            reflectedColor = (reflectedColor * specTrans) + specSkyScat;

            // [KO] Diffuse 필터링: (HDR 조도 * 투과율) + 실시간 대기 조도(Irradiance)
            // [EN] Diffuse Filtering: (HDR Irradiance * Transmittance) + Real-time Atmosphere Irradiance
            let diffTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, N.y, atmH);

            // [KO] 큐브맵 기반 조도 샘플링 (단위 광휘에 sunIntensity 곱셈)
            let skyIrradiance = textureSampleLevel(atmosphereIrradianceLUT, atmosphereSampler, N, 0.0).rgb * u_atmo.sunIntensity;
            iblDiffuseColor = (iblDiffuseColor * diffTrans) + skyIrradiance;
        }

        // [KO] ibl (BRDF LUT 샘플링) [EN] ibl BRDF LUT sampling
        let envBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, clamp(vec2<f32>(NdotV_IBL, *roughnessParameter), vec2<f32>(0.005), vec2<f32>(0.995)), 0.0).rg;

        // [KO] 다중 산란 에너지 보상 (Multi-scattering Energy Compensation)
        let energyCompensation = 1.0 + F0 * clamp(1.0 / max(envBRDF.x + envBRDF.y, 0.01) - 1.0, 0.0, 1.0);
        reflectedColor *= energyCompensation;

        // [KO] 프레넬-거칠기 보정 (Fresnel-Roughness Correction)
        let FR_dielectric = getIndirectFresnelSchlick(NdotV_IBL, F0_dielectric, *roughnessParameter);
        let FR_metal      = getIndirectFresnelSchlick(NdotV_IBL, F0_metal,      *roughnessParameter);

        // [KO] 지평선 감쇄(Horizon Occlusion) 및 최종 반사광 보정
        let horizonOcclusion = clamp(1.0 + dot(R, N), 0.0, 1.0);
        reflectedColor *= horizonOcclusion;

        // [KO] 거칠기를 고려한 다이렉트와 간접 반사율 계산 (Split Sum Approximation)
        let F_IBL_dielectric = FR_dielectric * envBRDF.x + envBRDF.y;
        let F_IBL_metal      = FR_metal * envBRDF.x + envBRDF.y;

        // [KO] 에너지 보존을 위한 최종 다이렉트 가중치 계산 (specularParameter 포함)
        let F_IBL_dielectric_weight = F_IBL_dielectric * specularParameter;

        // [KO] Specular Occlusion 계산 (AO가 반사광에 미치는 영향을 보정)
        let specularOcclusion = saturate(dot(R, N) + occlusionParameter);

        // [KO] 언리얼 스타일의 에너지 보존: 시점 의존적 프레넬 대신 통합된 Specular Albedo 기반 마스킹
        let specularAlbedo_IBL = saturate(F0_dielectric * envBRDF.x + envBRDF.y);
        let diffuseWeight_IBL = (vec3<f32>(1.0) - specularAlbedo_IBL * specularParameter);

        // [KO] ibl 확산광(Diffuse) [EN] ibl Diffuse
        var envIBL_DIFFUSE:vec3<f32> = albedo * iblDiffuseColor * diffuseWeight_IBL * INV_PI * occlusionParameter;

        // [KO] ibl 확산 투과 (Diffuse Transmission) [EN] ibl Diffuse Transmission
        #redgpu_if useKHR_materials_diffuse_transmission
        {
            var backScatteringColor = vec3<f32>(0.0);
            if (u_usePrefilterTexture) {
                let mipLevel = (*roughnessParameter) * iblMipmapCount;
                backScatteringColor = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, -N, mipLevel).rgb  / systemUniforms.preExposure;
            }
            if (u_useSkyAtmosphere) {
                let u_atmo = systemUniforms.skyAtmosphere;
                let backTrans = getTransmittance(transmittanceTexture, atmosphereSampler, u_atmo.cameraHeight, -N.y, u_atmo.atmosphereHeight);
                let backSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, prefilterTextureSampler, -N, 0.0).rgb * u_atmo.sunIntensity;
                backScatteringColor = (backScatteringColor * backTrans) + backSkyScat;
            }
            let transmittedIBL = backScatteringColor * diffuseTransmissionColor * (vec3<f32>(1.0) - F_IBL_dielectric_weight);
            envIBL_DIFFUSE = mix(envIBL_DIFFUSE, transmittedIBL, diffuseTransmissionParameter);
        }
        #redgpu_endIf

        // [KO] ibl 스펙큘러 투과(굴절) [EN] ibl Specular BTDF (Refraction)
        var envIBL_SPECULAR_BTDF = vec3<f32>(0.0);
        #redgpu_if useKHR_materials_transmission
        if (transmissionParameter > 0.0) {
            envIBL_SPECULAR_BTDF = transmissionRefraction * (vec3<f32>(1.0) - F_IBL_dielectric_weight) * specularOcclusion;
        }
        #redgpu_endIf

        // [KO] ibl Sheen 계산 [EN] ibl Sheen calculation
        var sheenIBLContribution = vec3<f32>(0.0);
        var sheenAlbedoScaling: f32 = 1.0;
        #redgpu_if useKHR_materials_sheen
        {
            let maxSheenColor = max(sheenColor.x, max(sheenColor.y, sheenColor.z));
            let sheenResult = getSheenIBL(N, V, sheenColor, maxSheenColor, sheenRoughnessParameter, iblMipmapCount, ibl_prefilterTexture, prefilterTextureSampler);
            sheenIBLContribution = sheenResult.sheenIBLContribution;
            sheenAlbedoScaling = sheenResult.sheenAlbedoScaling;
        }
        #redgpu_endIf

        // [KO] IBL 구성 요소 계산 (Dielectric) [EN] Compute IBL components (Dielectric)
        let ibl_specular_dielectric = reflectedColor * F_IBL_dielectric_weight * specularOcclusion;
        let ibl_diffuse_dielectric = mix(envIBL_DIFFUSE, envIBL_SPECULAR_BTDF, transmissionParameter);
        let dielectricPart_IBL = ibl_specular_dielectric + ibl_diffuse_dielectric;

        // [KO] IBL 구성 요소 계산 (Metallic) [EN] Compute IBL components (Metallic)
        let metallicPart_IBL = reflectedColor * F_IBL_metal * specularOcclusion;

        // [KO] 금속성 및 Sheen에 따른 최종 간접 조명 혼합 [EN] Final indirect lighting blend based on metallic and sheen
        let baseIndirect = mix(dielectricPart_IBL, metallicPart_IBL, metallicParameter);
        var indirectLighting = (baseIndirect * sheenAlbedoScaling + sheenIBLContribution) * systemUniforms.preExposure;

        // [KO] ibl 클리어코트 계산 [EN] ibl clearcoat calculation
        #redgpu_if useKHR_materials_clearcoat
            if (clearcoatParameter > 0.0) {
                 let u_atmo = systemUniforms.skyAtmosphere;
                 let clearcoatResult = getClearcoatIndirect(
                     V, clearcoatNormal, clearcoatRoughnessParameter, iblMipmapCount,
                     ibl_prefilterTexture, prefilterTextureSampler, ibl_brdfLUTTexture,
                     u_useSkyAtmosphere, u_atmo.sunIntensity, skyAtmosphere_prefilteredTexture, atmosphereSampler,
                     u_atmo.cameraHeight, u_atmo.atmosphereHeight, transmittanceTexture
                 );
                 let clearcoatSpecularIBL = clearcoatResult.rgb * clearcoatParameter * systemUniforms.preExposure;
                 let coatF = clearcoatResult.a * clearcoatParameter;
                 indirectLighting = clearcoatSpecularIBL + (vec3<f32>(1.0) - coatF) * indirectLighting;
            }
        #redgpu_endIf

        return indirectLighting;
    } else {
        // [KO] 환경광 물리 기반 보정 (Lux to Radiance)
        let ambientContribution = albedo * systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * occlusionParameter * systemUniforms.preExposure * INV_PI;

        // [KO] 최종 배경 굴절 합성 (비 IBL 모드)
        var indirectLighting = ambientContribution;
        #redgpu_if useKHR_materials_transmission
        if (transmissionParameter > 0.0) {
            let transmissionFresnel = F0 + (vec3<f32>(1.0) - F0) * pow(1.0 - NdotV, 5.0);
            let transmissionWeight = transmissionParameter * (vec3<f32>(1.0) - transmissionFresnel);
            indirectLighting = mix(ambientContribution, transmissionRefraction * systemUniforms.preExposure, transmissionWeight);
        }
        #redgpu_endIf

        return indirectLighting;
    }
}

// [KO] 물리 기반 조명 계산 함수 (Simplified PBR)
// [EN] Physically-based lighting calculation function (Simplified PBR)
fn calcPbrLight(
    lightColor:vec3<f32>,
    N:vec3<f32>, V:vec3<f32>, L:vec3<f32>,
    VdotN:f32,
    roughnessParameter:f32, metallicParameter:f32, albedo:vec3<f32>,
    F0_base:vec3<f32>, ior:f32,
    specularColor:vec3<f32>, specularParameter:f32,
    u_useKHR_materials_diffuse_transmission:bool, diffuseTransmissionParameter:f32, diffuseTransmissionColor:vec3<f32>,
    transmissionParameter:f32,
    sheenColor:vec3<f32>, sheenRoughnessParameter:f32,
    anisotropy:f32, anisotropicT:vec3<f32>, anisotropicB:vec3<f32>,
    clearcoatParameter:f32, clearcoatRoughnessParameter:f32, clearcoatNormal:vec3<f32>,
    useIridescence:bool, iridescenceFactor:f32, iridescenceIor:f32, iridescenceThickness:f32
) -> vec3<f32>{
    let dLight = lightColor; // [KO] 이미 모든 감쇄 및 노출이 곱해진 최종 에너지 [EN] Final energy with all attenuation and exposure applied

    let NdotL_origin = dot(N, L);
    let NdotL = max(NdotL_origin, 0.0);
    let H = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let LdotH = max(dot(L, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    // [KO] 프레넬(F) 통합 계산
    // [KO] 박막 간섭이 활성화된 경우 표준 Schlick 대신 Iridescent Fresnel 사용 (glTF 사양 준수)
    var F: vec3<f32>;
    let dielectric_f0 = F0_base * specularColor;
    let metal_f0 = albedo;
    let combined_f0 = mix(dielectric_f0, metal_f0, metallicParameter);

    if (useIridescence && iridescenceFactor > 0.0) {
        let F_irid_dielectric = getIridescentFresnel(1.0, iridescenceIor, dielectric_f0, iridescenceThickness, iridescenceFactor, VdotH);
        let F_irid_metal = getIridescentFresnel(1.0, iridescenceIor, metal_f0, iridescenceThickness, iridescenceFactor, VdotH);
        F = mix(F_irid_dielectric, F_irid_metal, metallicParameter);
    } else {
        F = getFresnelSchlick(VdotH, combined_f0);
    }

    // [KO] IOR이 1.0인 경우 프레넬 반사 제로화 (물리적 예외 처리)
    if (abs(ior - 1.0) < EPSILON) { F = vec3<f32>(0.0); }

    // [KO] 1. 스페큘러 반사(Specular Reflection) BRDF 계산
    // [KO] getSpecularBRDF 대신 D와 V(Visibility) 항만 따로 가져와서 이미 계산된 F와 결합
    let D = getDistributionGGX(NdotH, roughnessParameter);
    let Vis = getSpecularVisibility(VdotN, NdotL, roughnessParameter);
    var SPEC_BRDF = D * Vis * F;

    if (anisotropy > 0.0) {
        #redgpu_if useKHR_materials_anisotropy
            var TdotL = dot(anisotropicT, L);
            var TdotV = dot(anisotropicT, V);
            var BdotL = dot(anisotropicB, L);
            var TdotH = dot(anisotropicT, H);
            var BdotH = dot(anisotropicB, H);
            var BdotV = dot(anisotropicB, V);
            // [KO] 이방성 BRDF 계산 시에도 통합된 F를 사용하여 중복 계산 방지
            SPEC_BRDF = getAnisotropicSpecularBRDF(vec3<f32>(1.0), roughnessParameter * roughnessParameter, VdotH, NdotL, VdotN, NdotH, BdotV, TdotV, TdotL, BdotL, TdotH, BdotH, anisotropy) * F;
        #redgpu_endIf
    }
    
    // [KO] IOR이 1.0인 경우 스펙큘러 제로화
    if (abs(ior - 1.0) < EPSILON) { SPEC_BRDF = vec3<f32>(0.0); }

    // [KO] 2. 하부 레이어(Diffuse + Specular Transmission) 계산
    // [KO] getDiffuseBRDFDisney는 내부적으로 NdotL과 INV_PI를 포함함
    let diffuse_reflection = getDiffuseBRDFDisney(NdotL, VdotN, LdotH, roughnessParameter, albedo);

    // [KO] 확산 투과 (Thin-walled)
    var diffuse_transmission = vec3<f32>(0.0);
    #redgpu_if useKHR_materials_diffuse_transmission
    if (u_useKHR_materials_diffuse_transmission) {
        // [KO] getDiffuseBTDF 내부에서 이미 max(-NdotL, 0)가 곱해지므로 중복 곱셈 제거
        diffuse_transmission = getDiffuseBTDF(N, L, diffuseTransmissionColor);
    }
    #redgpu_endIf

    // [KO] 스펙큘러 투과 (Refraction)
    var specular_transmission = vec3<f32>(0.0);
    #redgpu_if useKHR_materials_transmission
    if (transmissionParameter > 0.0) {
        // [KO] 투과 시에도 박막 간섭이 적용된 (1-F) 에너지를 고려함
        specular_transmission = getSpecularBTDF(VdotN, NdotL_origin, NdotH, VdotH, LdotH, roughnessParameter, combined_f0, ior) * max(-NdotL_origin, 0.0);
        if (abs(ior - 1.0) < EPSILON) { specular_transmission = vec3<f32>(0.0); }
    }
    #redgpu_endIf

    // [KO] 3. 물리적 레이어링 (Energy Conservation)
    // [KO] specularParameter를 고려한 최종 스펙큘러 가중치 (비금속용)
    let specular_weight = F * specularParameter;

    // [KO] 확산층 통합
    let total_diffuse = mix(diffuse_reflection, diffuse_transmission, diffuseTransmissionParameter);

    // [KO] 비금속(Dielectric) 파트 합성
    // [KO] SpecularReflection + mix((1-F_weight)*Diffuse, SpecularTransmission, Factor)
    // [KO] specular_transmission은 이미 내부적으로 굴절 에너지를 포함함
    let dielectricPart = (SPEC_BRDF * specularParameter * NdotL) + mix((vec3<f32>(1.0) - specular_weight) * total_diffuse, specular_transmission, transmissionParameter);

    // [KO] 금속(Metallic) 파트 합성
    let metallicPart = SPEC_BRDF * NdotL;

    // 금속성 믹싱
    var result = mix(dielectricPart, metallicPart, metallicParameter);

    // [KO] 4. Sheen (천/패브릭) 레이어링
    #redgpu_if useKHR_materials_sheen
    {
        let maxSheenColor = max(sheenColor.x, max(sheenColor.y, sheenColor.z));
        if (sheenRoughnessParameter > 0.0 && maxSheenColor > 0.001) {
            let sheen_brdf = getSheenDirect(NdotL, VdotN, NdotH, sheenColor, sheenRoughnessParameter);
            let sheen_albedo_scaling = 1.0 - maxSheenColor * getSheenCharlieE(VdotN, sheenRoughnessParameter);
            result = result * sheen_albedo_scaling + (sheen_brdf * NdotL);
        }
    }
    #redgpu_endIf

    // [KO] 5. Clearcoat (코팅층) 합성
    #redgpu_if useKHR_materials_clearcoat
        if(clearcoatParameter > 0.0){
            let CLEARCOAT_SPEC_LIGHT = getClearcoatDirect(L, V, H, clearcoatNormal, clearcoatRoughnessParameter, LdotH);
            let coatF = getFresnelSchlick(max(dot(clearcoatNormal, V), 1e-6), vec3<f32>(0.04)).x * clearcoatParameter;
            result = CLEARCOAT_SPEC_LIGHT + (vec3<f32>(1.0) - coatF) * result;
        }
    #redgpu_endIf

    return result * dLight;
}
