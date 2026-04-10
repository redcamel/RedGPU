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
#redgpu_include KHR.KHR_materials_sheen.getSheenCharlieE;
#redgpu_include KHR.KHR_materials_anisotropy.getAnisotropicSpecularBRDF;
#redgpu_include lighting.getDiffuseBRDFDisney;
#redgpu_include lighting.getFresnelSchlick
#redgpu_include lighting.getConductorFresnel
#redgpu_include lighting.getIridescentFresnel
#redgpu_include lighting.getDistributionGGX
#redgpu_include lighting.getSpecularVisibility
#redgpu_include lighting.getSpecularBRDF
#redgpu_include lighting.getSpecularBTDF
#redgpu_include lighting.getDiffuseBTDF
#redgpu_include lighting.getFresnelMix
#redgpu_include lighting.getFresnelCoat
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
    let hasVertexTangent:bool = u_useVertexTangent && (dot(input_vertexTangent.xyz, input_vertexTangent.xyz) > 0.0);
    #redgpu_if doubleSided
    {
        // [KO] vFrontFacing과 유사한 안정적인 판정을 위해 정점 법선과 시선 벡터 활용
        if (dot(baseNormal, V) < 0.0) {
            backFaceYn = true;
        }
    }
    #redgpu_endIf

    // [KO] 정점 탄젠트 유무에 관계없이 기본 노멀은 TBN 구축을 위해 보존합니다.
    // [EN] Preserve base normal for TBN construction regardless of vertex tangent.
    // [KO] 클리어코트 층 등을 위해 변형 전 기하 법선을 보존합니다. [EN] Preserves the geometric normal before perturbation for clearcoat, etc.
    let geometricNormal = N;

    #redgpu_if normalTexture
    {
        var normalSamplerColor = textureSample(normalTexture, normalTextureSampler, normalUV).rgb;

        // [KO] 미분(dpdx, dpdy) 기반 TBN은 Uniform Control Flow에서 계산되어야 하므로 분기문 바깥에서 호출
        // [EN] TBN based on derivatives (dpdx, dpdy) must be called in Uniform Control Flow, so it's called outside the branch.
        var tbn = getTBNFromCotangent(geometricNormal, input_vertexPosition,select( 1.0 - normalUV,normalUV,backFaceYn));
        
        // [KO] 정점 탄젠트가 가용한 경우 이를 우선적으로 사용하여 TBN을 덮어씀
        // [EN] If vertex tangent is available, override TBN using it preferentially.
        if (hasVertexTangent) {
            tbn = getTBNFromVertexTangent(baseNormal, input_vertexTangent);
        }

        // [KO] glTF 표준(OpenGL 방식, Y+)을 따르며, getNormalFromNormalMap 내부에서 적절히 처리되도록 strength를 양수로 전달합니다.
        N = getNormalFromNormalMap(normalSamplerColor, tbn, u_normalScale );
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
    roughnessParameter = max(roughnessParameter, 0.04);
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
            #redgpu_if useKHR_clearcoatNormalTexture
            {
                var targetUv = KHR_clearcoatNormalUV;
                if(backFaceYn){ targetUv = 1.0 - targetUv; }
                let clearcoatNormalSamplerColor = textureSample(KHR_clearcoatNormalTexture, baseColorTextureSampler, targetUv).rgb;

                // [KO] 클리어코트 TBN은 변형된 N이 아닌 기하 법선(geometricNormal)을 기준으로 구축해야 합니다.
                // [EN] Clearcoat TBN should be constructed based on the geometricNormal, not the perturbed N.
                let clearcoatTBN = getTBNFromCotangent(geometricNormal, input_vertexPosition, targetUv);
                clearcoatNormal = getNormalFromNormalMap(clearcoatNormalSamplerColor, clearcoatTBN, u_KHR_clearcoatNormalScale);
                if(hasVertexTangent){ if(backFaceYn ){ clearcoatNormal = -clearcoatNormal; } }
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

    // [KO] 직접 조명 계산 - Directional Light (Lux-based) [EN] Direct lighting calculation - Directional Light (Lux-based)
    var totalDirectLighting = vec3<f32>(0.0);
    for (var i = 0u; i < u_directionalLightCount; i++) {
        let lightIntensity = u_directionalLights[i].intensity;
        let L = -normalize(u_directionalLights[i].direction);

        // [KO] 통합 에너지 계산 (색상 * 강도 * 노출 * 가시성)
        // [KO] 물리적 조도(Lux)를 광휘(Radiance)로 변환 (getDiffuseBRDFDisney가 내부적으로 INV_PI를 처리함)
        var finalLightColor = u_directionalLights[i].color * lightIntensity * systemUniforms.preExposure * visibility;

        // [KO] 대기 산란이 활성화된 경우 태양광(첫 번째 직사광)에 대기 투과율 적용 (분광 감쇄)
        if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let surfaceHeightKm = max(0.0, input_vertexPosition.y / 1000.0);
            let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, L.y, u_atmo.atmosphereHeight);
            finalLightColor *= atmosphereTransmittance;
        }

        totalDirectLighting += calcLight(
            finalLightColor,
            N, V, L, NdotV,
            roughnessParameter, metallicParameter, albedo,
            F0, ior,
            specularColor, specularParameter,
            u_useKHR_materials_diffuse_transmission, diffuseTransmissionParameter, diffuseTransmissionColor,
            transmissionParameter,
            sheenColor, sheenRoughnessParameter,
            anisotropy, anisotropicT, anisotropicB,
            clearcoatParameter, clearcoatRoughnessParameter, clearcoatNormal
        );
    }


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

         // [KO] 통합 에너지 계산 (색상 * 강도 * 감쇄 * 노출)
         // [KO] 물리적 조도(Lux)를 광휘(Radiance)로 변환 (calcLight가 내부적으로 INV_PI를 처리함)
         var finalLightColor = targetLight.color * targetLight.intensity * finalAttenuation * systemUniforms.preExposure;

         // [KO] calcLight 함수 호출 (24개 인자) [EN] Call calcLight function (24 arguments)
         totalDirectLighting += calcLight(
            finalLightColor,
            N, V, L, NdotV,
            roughnessParameter, metallicParameter, albedo,
            F0, ior,
            specularColor, specularParameter,
            u_useKHR_materials_diffuse_transmission, diffuseTransmissionParameter, diffuseTransmissionColor,
            transmissionParameter,
            sheenColor, sheenRoughnessParameter,
            anisotropy, anisotropicT, anisotropicB,
            clearcoatParameter, clearcoatRoughnessParameter, clearcoatNormal
        );
        }
    }

    // [KO] 간접 조명 계산 - IBL [EN] Indirect lighting calculation - IBL
    if (u_usePrefilterTexture || systemUniforms.useSkyAtmosphere == 1u) {
        var R = getReflectionVectorFromViewDirection(V, N);
        let NdotV_IBL = max(abs(dot(N, V)), 1e-6);

        #redgpu_if useKHR_materials_anisotropy
        if (anisotropy > 0.0)
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
            let VdotN = max(1e-6, abs(dot(V, N)));
            let oneMinusVdotN = 1.0 - VdotN;
            let directionFactor = oneMinusVdotN * oneMinusVdotN * oneMinusVdotN;
            let VdotT_abs = abs(TdotV);
            let VdotB_abs = abs(BdotV);
            let totalWeight = max(1e-6, VdotT_abs + VdotB_abs);
            let weightedRoughness = (roughnessT * VdotT_abs + roughnessB * VdotB_abs) / totalWeight;
            roughnessParameter = max(weightedRoughness, 0.04);
        }
        #redgpu_endIf

        // [KO] ibl (roughness에 따른 mipmap 레벨 적용) [EN] ibl (apply mipmap level based on roughness)
        var reflectedColor = vec3<f32>(0.0);
        var iblDiffuseColor = vec3<f32>(0.0);
        var iblMipmapCount: f32 = 0.0;

        if (u_usePrefilterTexture) {
            iblMipmapCount = f32(textureNumLevels(ibl_prefilterTexture) - 1);
            var mipLevel = roughnessParameter * iblMipmapCount;
            reflectedColor = textureSampleLevel( ibl_prefilterTexture, prefilterTextureSampler, R, mipLevel ).rgb  / systemUniforms.preExposure;
            iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0).rgb  / systemUniforms.preExposure;
        }

        // [KO] 대기 산란 필터링 및 조도 합성 (IBL 동기화)
        // [EN] Atmospheric Scattering Filtering and Irradiance Synthesis (IBL Synchronization)
        if (systemUniforms.useSkyAtmosphere == 1u) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let camH = u_atmo.cameraHeight;
            let atmH = u_atmo.atmosphereHeight;
            let earthR = u_atmo.groundRadius;

            // [KO] Specular 필터링: (HDR 반사 * 투과율) + 실시간 하늘 산란광
            // [EN] Specular Filtering: (HDR Reflection * Transmittance) + Real-time Sky Scattering
            let specTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, R.y, atmH);

            // [KO] 큐브맵 기반 실시간 반사광 샘플링 (거칠기 대응)
            // [KO] 생성기가 이제 '단위 광휘'를 저장하므로 sunIntensity를 곱해줍니다.
            let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
            let atmoMipLevel = roughnessParameter * atmoMipCount;
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
        // [KO] NdotV와 Roughness를 좌표로 사용하여 미리 계산된 Scale(x)와 Bias(y) 값을 가져옵니다.
        // [KO] 텍스처 경계에서의 아티팩트 방지를 위해 좌표 범위를 미세하게 클램핑합니다.
        let envBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, clamp(vec2<f32>(NdotV_IBL, roughnessParameter), vec2<f32>(0.005), vec2<f32>(0.995)), 0.0).rg;

        // [KO] 다중 산란 에너지 보상 (Multi-scattering Energy Compensation)
        // [KO] 싱글 스캐터링에서 소실된 에너지를 NdotV와 거칠기에 따라 물리적으로 보상합니다.
        // [KO] 과도한 증폭 방지를 위해 최대 보상 수치를 2.0으로 제한합니다.
        let energyCompensation = 1.0 + F0 * clamp(1.0 / max(envBRDF.x + envBRDF.y, 0.01) - 1.0, 0.0, 1.0);
        reflectedColor *= energyCompensation;

        // [KO] 프레넬-거칠기 보정 (Fresnel-Roughness Correction)
        // [KO] 거친 표면에서 외곽 반사광이 급격히 사라지는 현상을 방지하고, 물리적으로 타당한 엣지 반사를 강화합니다.
        // [KO] 표준(5.0)보다 살짝 더 느슨한 곡선(3.0)과 상향된 F90 하한선을 적용하여 에너지를 보충합니다.
        let fresnelPower = 5.0 - 2.0 * roughnessParameter;
        let F90_dielectric = max(vec3<f32>(1.0 - roughnessParameter * 0.8), F0_dielectric);
        let F90_metal = max(vec3<f32>(1.0 - roughnessParameter * 0.8), F0_metal);

        let FR_dielectric = F0_dielectric + (F90_dielectric - F0_dielectric) * pow(clamp(1.0 - NdotV_IBL, 0.0, 1.0), fresnelPower);
        let FR_metal = F0_metal + (F90_metal - F0_metal) * pow(clamp(1.0 - NdotV_IBL, 0.0, 1.0), fresnelPower);

        // [KO] 지평선 감쇄(Horizon Occlusion) 및 최종 반사광 보정
        let horizonOcclusion = clamp(1.0 + dot(R, N), 0.0, 1.0);
        reflectedColor *= horizonOcclusion;

        // [KO] 거칠기를 고려한 다이렉트와 간접 반사율 계산 (Split Sum Approximation)
        // [KO] 보정된 프레넬 항(FR)을 반영하여 최종 스펙큘러 가중치를 결정합니다.
        let F_IBL_dielectric = FR_dielectric * envBRDF.x + envBRDF.y;
        let F_IBL_metal      = FR_metal * envBRDF.x + envBRDF.y;

        // [KO] 에너지 보존을 위한 최종 다이렉트 가중치 계산 (specularParameter 포함)
        let F_IBL_dielectric_weight = F_IBL_dielectric * specularParameter;

        // [KO] Specular Occlusion 계산 (AO가 반사광에 미치는 영향을 보정)
        // [KO] 기존 pow 기반 식 대신 지평선 감쇄와 결합된 더 안정적인 방식을 사용합니다.
        let specularOcclusion = saturate(dot(R, N) + occlusionParameter);

        // [KO] 언리얼 스타일의 에너지 보존: 시점 의존적 프레넬 대신 통합된 Specular Albedo 기반 마스킹
        // [EN] Unreal-style energy conservation: Masking based on integrated Specular Albedo instead of view-dependent Fresnel
        let specularAlbedo_IBL = saturate(F0_dielectric * envBRDF.x + envBRDF.y);
        let diffuseWeight_IBL = (vec3<f32>(1.0) - specularAlbedo_IBL * specularParameter);

        // [KO] ibl 확산광(Diffuse) [EN] ibl Diffuse
        // [KO] Irradiance(E)를 Radiance(L)로 변환하기 위해 INV_PI 적용
        // [KO] specularAlbedo를 차감하여 에너지 보존을 보장함
        var envIBL_DIFFUSE:vec3<f32> = albedo * iblDiffuseColor * diffuseWeight_IBL * INV_PI * occlusionParameter;

        // [KO] ibl 확산 투과 (Diffuse Transmission) [EN] ibl Diffuse Transmission
        #redgpu_if useKHR_materials_diffuse_transmission
        {
            var backScatteringColor = vec3<f32>(0.0);
            if (u_usePrefilterTexture) {
                let mipLevel = roughnessParameter * iblMipmapCount;
                backScatteringColor = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, -N, mipLevel).rgb  / systemUniforms.preExposure;
            }
            if (systemUniforms.useSkyAtmosphere == 1u) {
                let u_atmo = systemUniforms.skyAtmosphere;
                let backTrans = getTransmittance(transmittanceTexture, atmosphereSampler, u_atmo.cameraHeight, -N.y, u_atmo.atmosphereHeight);
                // [KO] 생성기가 이제 '단위 광휘'를 저장하므로 sunIntensity를 곱해줍니다.
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
            // [KO] Sheen은 스펙큘러성 하이라이트이므로 prefilterTexture를 사용하여 샘플링합니다.
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
                 let clearcoatR = getReflectionVectorFromViewDirection(V, clearcoatNormal);
                 let clearcoatNdotV = max(abs(dot(clearcoatNormal, V)), 1e-6);
                 let clearcoatMipLevel = clearcoatRoughnessParameter * iblMipmapCount;
                 var clearcoatPrefilteredColor = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, clearcoatR, clearcoatMipLevel).rgb  / systemUniforms.preExposure;

                 if (systemUniforms.useSkyAtmosphere == 1u) {
                     let u_atmo = systemUniforms.skyAtmosphere;
                     let ccTrans = getTransmittance(transmittanceTexture, atmosphereSampler, u_atmo.cameraHeight, clearcoatR.y, u_atmo.atmosphereHeight);
                     let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
                     let atmoMipLevel = clearcoatRoughnessParameter * atmoMipCount;
                     // [KO] 생성기가 이제 '단위 광휘'를 저장하므로 sunIntensity를 곱해줍니다.
                     let ccSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, clearcoatR, atmoMipLevel).rgb * u_atmo.sunIntensity;
                     clearcoatPrefilteredColor = (clearcoatPrefilteredColor * ccTrans) + ccSkyScat;
                 }

                 let clearcoatEnvBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, vec2<f32>(clearcoatNdotV, clearcoatRoughnessParameter), 0.0).rg;
                 let clearcoatF0 = vec3<f32>(0.04);

                 // [KO] Split Sum Approximation: F * Scale + Bias.
                 // [KO] 클리어코트 레이어의 통합 프레넬 가중치를 계산합니다.
                 let clearcoatIBL_F = (clearcoatF0 * clearcoatEnvBRDF.x + clearcoatEnvBRDF.y) * clearcoatParameter;

                 // [KO] 클리어코트 스펙큘러 IBL에 preExposure 적용하여 베이스와 단위 일치
                 let clearcoatSpecularIBL = clearcoatPrefilteredColor * clearcoatIBL_F * systemUniforms.preExposure;

                 // [KO] 하부 레이어 투과 가중치 (에너지 보존을 위해 LUT 기반 가중치와 일관성 유지)
                 indirectLighting = clearcoatSpecularIBL + (vec3<f32>(1.0) - clearcoatIBL_F) * indirectLighting;
            }
        #redgpu_endIf

        let environmentIntensity = 1.0;
        var surfaceColor = totalDirectLighting + indirectLighting * environmentIntensity;


        finalColor = vec4<f32>(surfaceColor, resultAlpha);
    } else {
        // [KO] 환경광 물리 기반 보정 (Lux to Radiance)
        let ambientContribution = albedo * u_ambientLight.color * u_ambientLight.intensity * occlusionParameter * systemUniforms.preExposure * INV_PI;

        // [KO] 최종 배경 굴절 합성 (비 IBL 모드)
        var surfaceColor = totalDirectLighting;
        #redgpu_if useKHR_materials_transmission
        if (transmissionParameter > 0.0) {
            let transmissionWeight = transmissionParameter * (vec3<f32>(1.0) - F0);
            surfaceColor += mix(ambientContribution, transmissionRefraction * systemUniforms.preExposure, transmissionWeight);
        } else {
            surfaceColor += ambientContribution;
        }
        #redgpu_else
            surfaceColor += ambientContribution;
        #redgpu_endIf



        finalColor = vec4<f32>(surfaceColor, resultAlpha);
    }
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

/**
 * [KO] 빛의 기여도를 계산하는 핵심 함수입니다. [EN] Core function to calculate light contribution.
 */
/**
 * [KO] 빛의 기여도를 계산하는 핵심 함수입니다. [EN] Core function to calculate light contribution.
 */
fn calcLight(
    lightColor:vec3<f32>,
    N:vec3<f32>, V:vec3<f32>, L:vec3<f32>,
    VdotN:f32,
    roughnessParameter:f32, metallicParameter:f32, albedo:vec3<f32>,
    F0:vec3<f32>, ior:f32,
    specularColor:vec3<f32>, specularParameter:f32,
    u_useKHR_materials_diffuse_transmission:bool, diffuseTransmissionParameter:f32, diffuseTransmissionColor:vec3<f32>,
    transmissionParameter:f32,
    sheenColor:vec3<f32>, sheenRoughnessParameter:f32,
    anisotropy:f32, anisotropicT:vec3<f32>, anisotropicB:vec3<f32>,
    clearcoatParameter:f32, clearcoatRoughnessParameter:f32, clearcoatNormal:vec3<f32>
) -> vec3<f32>{
    let dLight = lightColor; // [KO] 이미 모든 감쇄 및 노출이 곱해진 최종 에너지 [EN] Final energy with all attenuation and exposure applied

    let NdotL_origin = dot(N, L);
    let NdotL = max(NdotL_origin, 0.0);
    let H = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let LdotH = max(dot(L, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    // [KO] 1. 스페큘러 반사(Specular Reflection) BRDF 계산
    var SPEC_BRDF: vec3<f32>;
    if (anisotropy > 0.0) {
        #redgpu_if useKHR_materials_anisotropy
            var TdotL = dot(anisotropicT, L);
            var TdotV = dot(anisotropicT, V);
            var BdotL = dot(anisotropicB, L);
            var TdotH = dot(anisotropicT, H);
            var BdotH = dot(anisotropicB, H);
            var BdotV = dot(anisotropicB, V);
            SPEC_BRDF = getAnisotropicSpecularBRDF(F0, roughnessParameter * roughnessParameter, VdotH, NdotL, VdotN, NdotH, BdotV, TdotV, TdotL, BdotL, TdotH, BdotH, anisotropy);
        #redgpu_endIf
    } else {
        SPEC_BRDF = getSpecularBRDF(F0, roughnessParameter, NdotH, VdotN, NdotL, LdotH);
    }

    // [KO] 2. 하부 레이어(Diffuse + Specular Transmission) 계산
    // [KO] getDiffuseBRDFDisney는 내부적으로 NdotL과 INV_PI를 포함함
    let diffuse_reflection = getDiffuseBRDFDisney(NdotL, VdotN, LdotH, roughnessParameter, albedo);

    // [KO] 확산 투과 (Thin-walled)
    var diffuse_transmission = vec3<f32>(0.0);
    #redgpu_if useKHR_materials_diffuse_transmission
    if (u_useKHR_materials_diffuse_transmission) {
        diffuse_transmission = getDiffuseBTDF(N, L, diffuseTransmissionColor) * max(-NdotL_origin, 0.0);
    }
    #redgpu_endIf

    // [KO] 스펙큘러 투과 (Refraction)
    var specular_transmission = vec3<f32>(0.0);
    #redgpu_if useKHR_materials_transmission
    if (transmissionParameter > 0.0) {
        specular_transmission = getSpecularBTDF(VdotN, NdotL_origin, NdotH, VdotH, LdotH, roughnessParameter, F0, ior) * max(-NdotL_origin, 0.0);
    }
    #redgpu_endIf

    // [KO] 3. 물리적 레이어링 (Energy Conservation)
    let F = getFresnelSchlick(VdotH, F0);

    // [KO] specularParameter를 고려한 최종 스펙큘러 가중치 (비금속용)
    let specular_weight = F * specularParameter;

    // [KO] 확산층 통합
    let total_diffuse = mix(diffuse_reflection, diffuse_transmission, diffuseTransmissionParameter);

    // [KO] 비금속(Dielectric) 파트 합성
    // [KO] SpecularReflection + mix((1-F_weight)*Diffuse, SpecularTransmission, Factor)
    // [KO] specular_transmission은 이미 (1-F)를 포함하므로 별도로 가중치를 조절하여 합산
    let dielectricPart = (SPEC_BRDF * specularParameter * max(NdotL_origin, 0.0)) + mix((vec3<f32>(1.0) - specular_weight) * total_diffuse, specular_transmission, transmissionParameter);

    // [KO] 금속(Metallic) 파트 합성
    let metallicPart = SPEC_BRDF * max(NdotL_origin, 0.0);

    // 금속성 믹싱
    var result = mix(dielectricPart, metallicPart, metallicParameter);

    // [KO] 4. Sheen (천/패브릭) 레이어링
    #redgpu_if useKHR_materials_sheen
    {
        let maxSheenColor = max(sheenColor.x, max(sheenColor.y, sheenColor.z));
        if (sheenRoughnessParameter > 0.0 && maxSheenColor > 0.001) {
            let sheenRoughness = max(sheenRoughnessParameter, 0.000001);
            
            // [KO] Charlie Sheen 분포 항 (Distribution term)
            // [EN] Charlie Sheen distribution term
            let invAlpha = 1.0 / sheenRoughness;
            let cos2h = NdotH * NdotH;
            let sin2h = max(1.0 - cos2h, 0.0078125); // [KO] pow(sin2h, ...) 안정성을 위해 하한선 설정
            let sheenDistribution = (2.0 + invAlpha) * pow(sin2h, invAlpha * 0.5) / (2.0 * PI);

            // [KO] Neubelt 가시성 항 (Visibility term) - glTF 스펙 권장 모델
            // [EN] Neubelt visibility term - Recommended by glTF spec
            let sheen_visibility = 1.0 / (4.0 * (NdotL + VdotN - NdotL * VdotN));

            // [KO] 에너지 보존을 위한 알베도 스케일링 [EN] Albedo scaling for energy conservation
            let sheen_albedo_scaling = 1.0 - maxSheenColor * getSheenCharlieE(VdotN, sheenRoughness);

            // [KO] Sheen은 베이스 레이어 위에 얹어짐 (NdotL은 조명 방정식의 일부로 결합)
            let sheen_brdf = sheenColor * sheenDistribution * sheen_visibility;
            result = result * sheen_albedo_scaling + (sheen_brdf * NdotL);
        }
    }
    #redgpu_endIf

    // [KO] 5. Clearcoat (코팅층) 합성
    #redgpu_if useKHR_materials_clearcoat
        if(clearcoatParameter > 0.0){
            let clearcoatNdotL = max(dot(clearcoatNormal, L), 0.0);
            let clearcoatNdotV = max(dot(clearcoatNormal, V), 1e-6);
            let clearcoatNdotH = max(dot(clearcoatNormal, H), 0.0);
            let clearcoatF0 = vec3<f32>(0.04);
            
            let CLEARCOAT_SPEC = getSpecularBRDF(clearcoatF0, clearcoatRoughnessParameter, clearcoatNdotH, clearcoatNdotV, clearcoatNdotL, LdotH);
            let coatF = getFresnelSchlick(clearcoatNdotV, clearcoatF0) * clearcoatParameter;
            
            result = (CLEARCOAT_SPEC * clearcoatNdotL) + (vec3<f32>(1.0) - coatF) * result;
        }
    #redgpu_endIf

    return result * dLight;
}
