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
#redgpu_include math.tnb.getTBNFromCotangent
#redgpu_include math.tnb.getNormalFromNormalMap;
#redgpu_include KHR.KHR_texture_transform.getKHRTextureTransformUV;
#redgpu_include KHR.KHR_materials_sheen.getSheenIBL;
#redgpu_include KHR.KHR_materials_sheen.getSheenLambda;
#redgpu_include KHR.KHR_materials_anisotropy.getAnisotropicSpecularBRDF;
#redgpu_include lighting.getDiffuseBRDFDisney;
#redgpu_include lighting.getFresnelSchlick
#redgpu_include lighting.getConductorFresnel
#redgpu_include lighting.getIridescentFresnel
#redgpu_include lighting.getDistributionGGX
#redgpu_include lighting.getGeometrySmith
#redgpu_include lighting.getSpecularBRDF
#redgpu_include lighting.getSpecularBTDF
#redgpu_include lighting.getDiffuseBTDF
#redgpu_include lighting.getFresnelMix
#redgpu_include lighting.getFresnelCoat
#redgpu_include skyAtmosphere.getAtmosphereSunLight

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

    // [KO] 법선 벡터(Normal) 계산 및 이면 렌더링 처리 [EN] Normal vector calculation and double-sided rendering
    var N:vec3<f32> = normalize(input_vertexNormal.xyz);
    var backFaceYn:bool = false;
    #redgpu_if doubleSided
    {
        var fdx:vec3<f32> = dpdx(input_vertexPosition);
        var fdy:vec3<f32> = dpdy(input_vertexPosition);
        var faceNormal:vec3<f32> = normalize(cross(fdy,fdx));
        if (dot(N, faceNormal) < 0.0) {
            N = -N;
            backFaceYn = true;
        };
    }
    #redgpu_endIf

    // [KO] 클리어코트 층 등을 위해 변형 전 기하 법선을 보존합니다. [EN] Preserves the geometric normal before perturbation for clearcoat, etc.
    let geometricNormal = N;

    #redgpu_if normalTexture
    {
        var targetUv = select(normalUV, 1.0 - normalUV, backFaceYn);
        let normalSamplerColor = textureSample(normalTexture, normalTextureSampler, normalUV).rgb;
        let tbn = getTBNFromCotangent(N, input_vertexPosition, targetUv);
        N = getNormalFromNormalMap(vec3<f32>(normalSamplerColor.r, 1.0 - normalSamplerColor.g, normalSamplerColor.b), tbn, -u_normalScale);
        N = select(N, select(N, -N, backFaceYn), u_useVertexTangent);
    }
    #redgpu_else
    {
      N = N * u_normalScale;
    }
    #redgpu_endIf

    // [KO] 시선 방향 벡터 계산 [EN] View direction vector calculation
    let V: vec3<f32> = getViewDirection(input_vertexPosition, u_cameraPosition);
    let NdotV = max(dot(N, V), 0.04);
    let VdotN = max(dot(V, N), 0.0);

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
    var clearcoatNormal:vec3<f32> = N;
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
            var clearcoatNormalSampler =  textureSample(KHR_clearcoatNormalTexture, baseColorTextureSampler, KHR_clearcoatNormalUV);
            #redgpu_if useKHR_clearcoatNormalTexture
            {
                var targetUv = KHR_clearcoatNormalUV;
                if(backFaceYn){ targetUv = 1.0 - targetUv; }
                clearcoatNormal = clearcoatNormalSampler.rgb;
                // [KO] 클리어코트 TBN은 변형된 N이 아닌 기하 법선(geometricNormal)을 기준으로 구축해야 합니다.
                // [EN] Clearcoat TBN should be constructed based on the geometricNormal, not the perturbed N.
                let clearcoatTBN = getTBNFromCotangent(geometricNormal, input_vertexPosition, targetUv);
                clearcoatNormal = getNormalFromNormalMap(vec3<f32>(clearcoatNormalSampler.r, 1.0 - clearcoatNormalSampler.g, clearcoatNormalSampler.b), clearcoatTBN, -u_KHR_clearcoatNormalScale);
                if(u_useVertexTangent){ if(backFaceYn ){ clearcoatNormal = -clearcoatNormal; } }
                clearcoatNormal = normalize(clearcoatNormal);
            }
            #redgpu_endIf
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
       var T: vec3<f32>;
       var B: vec3<f32>;

       // 1. 기본 TBN 기저 구축
       var tbn: mat3x3<f32>;
       if (u_useVertexTangent && length(input_vertexTangent.xyz) > 0.0) {
           tbn = getTBNFromVertexTangent(N, input_vertexTangent);
       } else {
           // [KO] 탄젠트가 없는 경우 Normal을 기준으로 임의의 수직벡터로부터 직교 기저 형성
           // [EN] If tangent is missing, construct orthonormal basis from arbitrary perpendicular vector based on normal
           let anyT = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(0.0, 1.0, 0.0), abs(N.x) > 0.9);
           tbn = getTBN(N, anyT);
       }
       T = tbn[0];
       B = tbn[1];

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
        transmissionRefraction = getTransmissionRefraction(u_useKHR_materials_volume, thicknessParameter * inputData.localNodeScale_volumeScale[1] , u_KHR_dispersion, u_KHR_attenuationDistance , u_KHR_attenuationColor, ior, roughnessParameter, albedo, systemUniforms.projection.projectionViewMatrix, input_vertexPosition, input_ndcPosition, V, N, renderPath1ResultTexture, renderPath1ResultTextureSampler);
    #redgpu_endIf

    // [KO] 기본 F0 계산 [EN] Base F0 calculation
    let F0_dielectric_base = vec3(pow((1.0 - ior) / (1.0 + ior), 2.0));
    var F0_dielectric = F0_dielectric_base *  specularColor;
    var F0_metal = baseColor.rgb;

    #redgpu_if useKHR_materials_iridescence
        if (iridescenceParameter > 0.0) {
            F0_dielectric = getIridescentFresnel(1.0, u_KHR_iridescenceIor, F0_dielectric, iridescenceThickness, iridescenceParameter, NdotV);
            F0_metal = getIridescentFresnel(1.0, u_KHR_iridescenceIor, baseColor.rgb, iridescenceThickness, iridescenceParameter, NdotV);
        }
    #redgpu_endIf
    let F0 = mix(F0_dielectric, F0_metal, metallicParameter);

    // [KO] 직접 조명 계산 - Directional Light [EN] Direct lighting calculation - Directional Light
    var totalDirectLighting = vec3<f32>(0.0);
    for (var i = 0u; i < u_directionalLightCount; i++) {
        totalDirectLighting += calcLight(u_directionalLights[i].color, u_directionalLights[i].intensity * visibility, N, V, -normalize(u_directionalLights[i].direction), VdotN, roughnessParameter, metallicParameter, albedo, F0, ior, transmissionRefraction, specularColor, specularParameter, u_useKHR_materials_diffuse_transmission, diffuseTransmissionParameter, diffuseTransmissionColor, transmissionParameter, sheenColor, sheenRoughnessParameter, anisotropy, anisotropicT, anisotropicB, clearcoatParameter, clearcoatRoughnessParameter, clearcoatNormal);
    }

    // [Atmosphere Sun Light]
//    if (systemUniforms.useSkyAtmosphere == 1u) {
//        let atmoSun = getAtmosphereSunLight();
//        totalDirectLighting += calcLight(atmoSun.color, atmoSun.intensity, N, V, atmoSun.direction, VdotN, roughnessParameter, metallicParameter, albedo, F0, ior, transmissionRefraction, specularColor, specularParameter, u_useKHR_materials_diffuse_transmission, diffuseTransmissionParameter, diffuseTransmissionColor, transmissionParameter, sheenColor, sheenRoughnessParameter, anisotropy, anisotropicT, anisotropicB, clearcoatParameter, clearcoatRoughnessParameter, clearcoatNormal);
//    }

    // [KO] 직접 조명 계산 - Point/Spot Lights (Clustered) [EN] Direct lighting calculation - Point/Spot Lights (Clustered)
    {
        let clusterIndex = getClusterLightClusterIndex(inputData.position);
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

         // [KO] 스포트라이트 처리 [EN] Spotlight processing
         if (u_isSpotLight > 0.0) {
             let u_clusterLightDirection = normalize(vec3<f32>(targetLight.directionX, targetLight.directionY, targetLight.directionZ));
             let lightToVertex = normalize(-L);
             finalAttenuation *= getLightAngleAttenuation(lightToVertex, u_clusterLightDirection, targetLight.innerCutoff, targetLight.outerCutoff);
         }

         // [KO] calcLight 함수 호출 [EN] Call calcLight function
         totalDirectLighting += calcLight(targetLight.color, targetLight.intensity * finalAttenuation, N, V, L, VdotN, roughnessParameter, metallicParameter, albedo, F0, ior, transmissionRefraction, specularColor, specularParameter, u_useKHR_materials_diffuse_transmission, diffuseTransmissionParameter, diffuseTransmissionColor, transmissionParameter, sheenColor, sheenRoughnessParameter, anisotropy, anisotropicT, anisotropicB, clearcoatParameter, clearcoatRoughnessParameter, clearcoatNormal);
        }
    }

    // [KO] 간접 조명 계산 - IBL [EN] Indirect lighting calculation - IBL
    if (u_usePrefilterTexture || systemUniforms.useSkyAtmosphere == 1u) {
        var R = getReflectionVectorFromViewDirection(V, N);
        let NdotV = max(dot(N, V),1e-4);

        #redgpu_if useKHR_materials_anisotropy
        {
            var bentNormal = cross(anisotropicB, V);
            bentNormal = normalize(cross(bentNormal, anisotropicB));
            let temp = 1.0 - anisotropy * (1.0 - roughnessParameter);
            let tempSquared = temp * temp;
            var a = tempSquared * tempSquared;
            bentNormal = normalize(mix(bentNormal, N, a));
            var reflectVec = getReflectionVectorFromViewDirection(V, bentNormal);
            reflectVec = normalize(mix(reflectVec, bentNormal, roughnessParameter * roughnessParameter));
            let roughnessT = roughnessParameter * (1.0 + anisotropy);
            let roughnessB = roughnessParameter * (1.0 - anisotropy);
            let TdotR = dot(anisotropicT, reflectVec);
            let BdotR = dot(anisotropicB, reflectVec);
            let TdotV = dot(anisotropicT, V);
            let BdotV = dot(anisotropicB, V);
            R = normalize(reflectVec - anisotropy * (TdotR * anisotropicT - BdotR * anisotropicB));
            let VdotN = max(1e-4, dot(V, N));
            let oneMinusVdotN = 1.0 - VdotN;
            let directionFactor = oneMinusVdotN * oneMinusVdotN * oneMinusVdotN;
            let VdotT_abs = abs(TdotV);
            let VdotB_abs = abs(BdotV);
            let totalWeight = max(1e-4, VdotT_abs + VdotB_abs);
            let weightedRoughness = (roughnessT * VdotT_abs + roughnessB * VdotB_abs) / totalWeight;
            roughnessParameter = weightedRoughness;
        }
        #redgpu_endIf

        // [KO] ibl (roughness에 따른 mipmap 레벨 적용) [EN] ibl (apply mipmap level based on roughness)
        var reflectedColor = vec3<f32>(0.0);
        var iblDiffuseColor = vec3<f32>(0.0);
        var iblMipmapCount: f32 = 0.0;
        
        if (u_usePrefilterTexture) {
            iblMipmapCount = f32(textureNumLevels(ibl_environmentTexture) - 1);
            var mipLevel = roughnessParameter * iblMipmapCount;
            reflectedColor = textureSampleLevel( ibl_environmentTexture, prefilterTextureSampler, R, mipLevel ).rgb;
            iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0).rgb;
        }

        // [KO] 대기 산란 필터링 및 조도 합성 (IBL 동기화)
        // [EN] Atmospheric Scattering Filtering and Irradiance Synthesis (IBL Synchronization)
        if (systemUniforms.useSkyAtmosphere == 1u) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let camH = u_atmo.cameraHeight;
            let atmH = u_atmo.atmosphereHeight;
            let earthR = u_atmo.earthRadius;
            let sunInt = u_atmo.sunIntensity;

            // [KO] Specular 필터링: (HDR 반사 * 투과율) + 실시간 하늘 산란광
            // [EN] Specular Filtering: (HDR Reflection * Transmittance) + Real-time Sky Scattering
            let specTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, R.y, atmH);
            
            // [KO] 큐브맵 기반 실시간 반사광 샘플링 (거칠기 대응)
            // [EN] Cubemap-based real-time reflection sampling (roughness support)
            let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
            let atmoMipLevel = roughnessParameter * atmoMipCount;
            let specSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, prefilterTextureSampler, R, atmoMipLevel).rgb * sunInt;
            
            reflectedColor = (reflectedColor * specTrans) + specSkyScat;

            // [KO] Diffuse 필터링: (HDR 조도 * 투과율) + 실시간 대기 조도(Irradiance)
            // [EN] Diffuse Filtering: (HDR Irradiance * Transmittance) + Real-time Atmosphere Irradiance
            let diffTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, N.y, atmH);
            
            // [KO] 큐브맵 기반 조도 샘플링 (2D LUT 방식에서 업그레이드)
            // [EN] Cubemap-based Irradiance sampling (upgraded from 2D LUT method)
            let skyIrradiance = textureSampleLevel(atmosphereIrradianceTexture, prefilterTextureSampler, N, 0.0).rgb * sunInt;
            iblDiffuseColor = (iblDiffuseColor * diffTrans) + skyIrradiance;
        }

        // [KO] ibl (BRDF LUT 샘플링) [EN] ibl BRDF LUT sampling
        // [KO] NdotV와 Roughness를 좌표로 사용하여 미리 계산된 Scale(x)와 Bias(y) 값을 가져옵니다.
        // [EN] Uses NdotV and Roughness as coordinates to fetch pre-calculated Scale(x) and Bias(y) values.
        let envBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, vec2<f32>(NdotV, roughnessParameter), 0.0).rg;

        // [KO] 거칠기를 고려한 다이렉트와 간접 반사율 계산 (Split Sum Approximation)
        // [EN] Calculates direct and indirect reflectance considering roughness (Split Sum Approximation)
        var F_IBL_dielectric = F0_dielectric * envBRDF.x + envBRDF.y;
        var F_IBL_metal      = F0_metal      * envBRDF.x + envBRDF.y;
        var F_IBL            = F0            * envBRDF.x + envBRDF.y;

        let a2 = roughnessParameter * roughnessParameter;
        let G_smith = NdotV / (NdotV * (1.0 - a2) + a2);

        // [KO] ibl 확산광(Diffuse) [EN] ibl Diffuse
        let effectiveTransmission = transmissionParameter * (1.0 - metallicParameter);
        var envIBL_DIFFUSE:vec3<f32> = albedo * iblDiffuseColor * (vec3<f32>(1.0) - F_IBL_dielectric);

        // [KO] ibl 확산 투과 (Diffuse Transmission) [EN] ibl Diffuse Transmission
        #redgpu_if useKHR_materials_diffuse_transmission
        {
            // [KO] 뒷면 반사광을 위한 샘플링 방향 [EN] Sampling direction for back side reflection
            var backScatteringColor = vec3<f32>(0.0);
            if (u_usePrefilterTexture) {
                var mipLevel = roughnessParameter * iblMipmapCount;
                backScatteringColor = textureSampleLevel(ibl_environmentTexture, prefilterTextureSampler, -N, mipLevel).rgb;
            }
            
            // [KO] 대기 필터링 적용 (Back side)
            if (systemUniforms.useSkyAtmosphere == 1u) {
                let u_atmo = systemUniforms.skyAtmosphere;
                let backTrans = getTransmittance(transmittanceTexture, atmosphereSampler, u_atmo.cameraHeight, -N.y, u_atmo.atmosphereHeight);
                
                // [KO] 큐브맵 기반 샘플링으로 교체 (skyViewTexture 의존성 제거)
                // [EN] Replace with cubemap-based sampling (remove dependency on skyViewTexture)
                let backSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, prefilterTextureSampler, -N, 0.0).rgb * u_atmo.sunIntensity;
                backScatteringColor = (backScatteringColor * backTrans) + backSkyScat;
            }

            let transmittedIBL = backScatteringColor * diffuseTransmissionColor * (vec3<f32>(1.0) - F_IBL_dielectric);
            // [KO] 반사광 및 투과 효과 혼합 [EN] Mix reflection and transmission effects
            envIBL_DIFFUSE = mix(envIBL_DIFFUSE, transmittedIBL, diffuseTransmissionParameter);
        }
        #redgpu_endIf

        // [KO] ibl 스펙큘러 [EN] ibl Specular
        var envIBL_SPECULAR:vec3<f32>;
        envIBL_SPECULAR = reflectedColor * F_IBL * specularParameter ;

        // [KO] ibl 스펙큘러 BTDF [EN] ibl Specular BTDF
        var envIBL_SPECULAR_BTDF = vec3<f32>(0.0);
        #redgpu_if useKHR_materials_transmission
            var refractedDir: vec3<f32>;
            let eta = 1.0 / ior;
            if (abs(ior - 1.0) < EPSILON) { refractedDir = V; }
            else { refractedDir = refract(-V, -N, eta); }

            if(length(refractedDir) > EPSILON) {
                let NdotT = abs(dot(N, normalize(refractedDir)));
                let F_transmission = vec3<f32>(1.0) - mix(F_IBL_dielectric,F_IBL_metal,metallicParameter);

                var attenuatedBackground = transmissionRefraction;
                 if (u_useKHR_materials_volume) {
                     let localNodeScale = inputData.localNodeScale_volumeScale[0];
                     let volumeScale = inputData.localNodeScale_volumeScale[1];
                     let scaledThickness = thicknessParameter * localNodeScale ;
                     let safeAttenuationColor = clamp(u_KHR_attenuationColor, vec3<f32>(EPSILON), vec3<f32>(1.0));
                     let safeAttenuationDistance = max(u_KHR_attenuationDistance, EPSILON);
                     let attenuationCoefficient = -log(safeAttenuationColor) / safeAttenuationDistance;
                     let cosTheta = max(NdotT, 0.001);
                     let pathLength = scaledThickness / cosTheta;
                     let transmittance = exp(-attenuationCoefficient * pathLength);
                     attenuatedBackground *= transmittance;
                 }else{
                     attenuatedBackground *= albedo;
                 }
                envIBL_SPECULAR_BTDF = attenuatedBackground * F_transmission * transmissionParameter + reflectedColor * G_smith * mix(F_IBL_dielectric,F_IBL_metal,metallicParameter) * NdotT;
            }
        #redgpu_endIf

        // [KO] ibl 다이렉트 속성 [EN] ibl dielectric attribute
        let envIBL_DIELECTRIC = mix(envIBL_DIFFUSE ,envIBL_SPECULAR_BTDF, transmissionParameter) + envIBL_SPECULAR  ;

        // [KO] ibl Sheen 계산 [EN] ibl Sheen calculation
        var sheenIBLContribution = vec3<f32>(0.0);
        var sheenAlbedoScaling: f32 = 1.0;
        let maxSheenColor = max(sheenColor.x, max(sheenColor.y, sheenColor.z));
        #redgpu_if useKHR_materials_sheen
            let sheenResult = getSheenIBL(N, V, sheenColor, maxSheenColor, sheenRoughnessParameter, iblMipmapCount, ibl_irradianceTexture, prefilterTextureSampler);
            sheenIBLContribution = sheenResult.sheenIBLContribution;
            sheenAlbedoScaling = sheenResult.sheenAlbedoScaling;
        #redgpu_endIf

        // [KO] ibl Metal 계산 [EN] ibl Metal calculation
        let envIBL_METAL = reflectedColor * F_IBL_metal;

        // [KO] ibl 최종 혼합 [EN] ibl final blend
        let metallicPart = envIBL_METAL * metallicParameter ;
        let dielectricPart = envIBL_DIELECTRIC * (1.0 - metallicParameter) ;
        var indirectLighting = (metallicPart + dielectricPart) * sheenAlbedoScaling + sheenIBLContribution;

        // [KO] ibl 클리어코트 계산 [EN] ibl clearcoat calculation
        #redgpu_if useKHR_materials_clearcoat
            if (clearcoatParameter > 0.0) {
                 let clearcoatR = getReflectionVectorFromViewDirection(V, clearcoatNormal);
                 let clearcoatNdotV = max(dot(clearcoatNormal, V), 0.04);
                 let clearcoatMipLevel = clearcoatRoughnessParameter * iblMipmapCount;
                 let clearcoatPrefilteredColor = textureSampleLevel(ibl_environmentTexture, prefilterTextureSampler, clearcoatR, clearcoatMipLevel).rgb;
                 let clearcoatEnvBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, vec2<f32>(clearcoatNdotV, clearcoatRoughnessParameter), 0.0).rg;
                 let clearcoatF0 = vec3<f32>(0.04);
                 let clearcoatF = clearcoatF0 * clearcoatEnvBRDF.x + clearcoatEnvBRDF.y;
                 let clearcoatSpecularIBL = clearcoatPrefilteredColor * clearcoatF * clearcoatParameter;
                 indirectLighting = clearcoatSpecularIBL + (1.0 - max(clearcoatF.x, max(clearcoatF.y, clearcoatF.z)) * clearcoatParameter) * indirectLighting;
            }
        #redgpu_endIf

        let environmentIntensity = 1.0;
        let surfaceColor = totalDirectLighting + indirectLighting * environmentIntensity * occlusionParameter;
        finalColor = vec4<f32>(surfaceColor, resultAlpha);
    } else {
        let ambientContribution = albedo * u_ambientLight.color * u_ambientLight.intensity * occlusionParameter;
        finalColor = vec4<f32>(totalDirectLighting + ambientContribution, resultAlpha);
    }

    // [KO] 에미시브 합산 [EN] Emissive addition
    var emissiveSamplerColor = vec3<f32>(1.0);
    #redgpu_if emissiveTexture
        emissiveSamplerColor = textureSample(emissiveTexture, emissiveTextureSampler, emissiveUV).rgb;
    #redgpu_endIf
    finalColor += vec4<f32>(emissiveSamplerColor.rgb * u_emissiveFactor * u_emissiveStrength, 0.0);

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

/**
 * [KO] 빛의 기여도를 계산하는 핵심 함수입니다. [EN] Core function to calculate light contribution.
 */
fn calcLight(
    lightColor:vec3<f32>, lightIntensity:f32,
    N:vec3<f32>, V:vec3<f32>, L:vec3<f32>,
    VdotN:f32,
    roughnessParameter:f32, metallicParameter:f32, albedo:vec3<f32>,
    F0:vec3<f32>, ior:f32,
    transmissionRefraction:vec3<f32>,
    specularColor:vec3<f32>, specularParameter:f32,
    u_useKHR_materials_diffuse_transmission:bool, diffuseTransmissionParameter:f32, diffuseTransmissionColor:vec3<f32>,
    transmissionParameter:f32,
    sheenColor:vec3<f32>, sheenRoughnessParameter:f32,
    anisotropy:f32, anisotropicT:vec3<f32>, anisotropicB:vec3<f32>,
    clearcoatParameter:f32, clearcoatRoughnessParameter:f32, clearcoatNormal:vec3<f32>
) -> vec3<f32>{
    let dLight = lightColor * lightIntensity ;

    let NdotL_origin = dot(N, L);
    let NdotL = max(NdotL_origin, 0.04);
    let NdotV = max(dot(N, V), 0.04);
    let H = normalize(L + V);
    let LdotH = max(dot(L, H), 0.0);
    let NdotH = max(dot(N, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    var DIFFUSE_BRDF:vec3<f32> = getDiffuseBRDFDisney(NdotL, NdotV, LdotH, roughnessParameter, albedo);
    #redgpu_if useKHR_materials_diffuse_transmission
        DIFFUSE_BRDF = mix(DIFFUSE_BRDF, getDiffuseBTDF(N, L, diffuseTransmissionColor), diffuseTransmissionParameter);
    #redgpu_endIf

    var SPECULAR_BRDF:vec3<f32>;
    if (anisotropy > 0.0) {
        #redgpu_if useKHR_materials_anisotropy
            var TdotL = dot(anisotropicT, L);
            var TdotV = dot(anisotropicT, V);
            var BdotL = dot(anisotropicB, L);
            var TdotH = dot(anisotropicT, H);
            var BdotH = dot(anisotropicB, H);
            var BdotV = dot(anisotropicB, V);
            SPECULAR_BRDF =  getAnisotropicSpecularBRDF(albedo, roughnessParameter * roughnessParameter, VdotH, NdotL, NdotV, NdotH, BdotV, TdotV, TdotL, BdotL, TdotH, BdotH, anisotropy);
        #redgpu_endIf
    }else{
        SPECULAR_BRDF = getSpecularBRDF( albedo, roughnessParameter, NdotH, NdotV, NdotL, LdotH);
    }

    let METAL_BRDF = getConductorFresnel( albedo, SPECULAR_BRDF, VdotH);;

    var SPECULAR_BTDF =  vec3<f32>(0.0);
    #redgpu_if useKHR_materials_transmission
        if(transmissionParameter > 0.0){
            SPECULAR_BTDF = getSpecularBTDF( NdotV, NdotL, NdotH, VdotH, LdotH, roughnessParameter, albedo, ior);
        }
    #redgpu_endIf

    let DIELECTRIC_BRDF = getFresnelMix(F0, specularParameter, mix(DIFFUSE_BRDF, SPECULAR_BTDF, transmissionParameter), SPECULAR_BRDF, VdotH);

    var SHEEN_BRDF:vec3<f32> = vec3<f32>(0.0);
    var sheen_albedo_scaling:f32 = 1.0;
    #redgpu_if useKHR_materials_sheen
        let maxSheenColor = max(sheenColor.x, max(sheenColor.y, sheenColor.z));
        if(sheenRoughnessParameter > 0.0 && maxSheenColor > 0.001 && dot(N,V) > 0.0) {
            let NdotV_sheen = dot(N, V);
            let sheenRoughnessAlpha = sheenRoughnessParameter * sheenRoughnessParameter;
            let invR = 1.0 / sheenRoughnessAlpha;
            let cos2h = NdotH * NdotH;
            let sin2h = 1.0 - cos2h;
            let sheenDistribution = (2.0 + invR) * pow(sin2h, invR * 0.5) / PI2;
            let sheen_visibility =  1.0 / ((1.0 + getSheenLambda(NdotV_sheen, sheenRoughnessAlpha) + getSheenLambda(NdotL, sheenRoughnessAlpha)) * (4.0 * NdotV_sheen * NdotL));
            let LdotN = max(dot(L, N), 0.04);
            let E_LdotN = 1.0 - pow(1.0 - LdotN, 5.0);
            let E_VdotN = 1.0 - pow(1.0 - NdotV_sheen, 5.0);
            sheen_albedo_scaling = max(min(1.0 - maxSheenColor * E_VdotN, 1.0 - maxSheenColor * E_LdotN), 0.04);
            SHEEN_BRDF = sheenColor * sheenDistribution * sheen_visibility;
        }
    #redgpu_endIf

    // [KO] 금속성 및 다이렉트 속성 결합 [EN] Combine metallic and dielectric attributes
    let metallicPart = METAL_BRDF * metallicParameter * sheen_albedo_scaling  ;
    let dielectricPart = DIELECTRIC_BRDF * sheen_albedo_scaling ;
    let sheenPart = SHEEN_BRDF;
    var directLighting = (metallicPart  + dielectricPart + sheenPart);

    #redgpu_if useKHR_materials_transmission
        if(transmissionParameter > 0.0) {
            // [KO] 투과 가중치에 따라 배경색 혼합 [EN] Mix background color according to transmission weight
            let transmissionWeight = transmissionParameter * (vec3<f32>(1.0) - F0);
            directLighting = mix(directLighting, transmissionRefraction , transmissionWeight);
        }
    #redgpu_endIf

    #redgpu_if useKHR_materials_clearcoat
        if(clearcoatParameter > 0.0){
            let clearcoatNdotL = max(dot(clearcoatNormal, L), 0.04);
            let clearcoatNdotV = max(dot(clearcoatNormal, V), 0.04);
            let clearcoatNdotH = max(dot(clearcoatNormal, H), 0.0);
            let CLEARCOAT_BRDF = getSpecularBRDF( F0, clearcoatRoughnessParameter, clearcoatNdotH, clearcoatNdotV, clearcoatNdotL, LdotH);
            directLighting = getFresnelCoat(clearcoatNdotV, ior, clearcoatParameter, directLighting, CLEARCOAT_BRDF);
        }
    #redgpu_endIf

    var lightDirection: f32;
    #redgpu_if useKHR_materials_diffuse_transmission
        lightDirection = mix(abs(NdotL_origin), 1.0, diffuseTransmissionParameter);
    #redgpu_else
        lightDirection = max(NdotL_origin, 0.0);
    #redgpu_endIf

    let lightContribution = directLighting * dLight * lightDirection;
    return lightContribution;
}
