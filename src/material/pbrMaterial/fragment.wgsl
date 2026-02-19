#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getDirectionalShadowVisibility;
#redgpu_include color.getTintBlendMode;
#redgpu_include drawPicking;
#redgpu_include lighting.getTransmissionRefraction;
#redgpu_include FragmentOutput;
#redgpu_include math.getMotionVector;
#redgpu_include lighting.getLightDistanceAttenuation;
#redgpu_include lighting.getLightAngleAttenuation;
#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.INV_PI
#redgpu_include math.direction.getViewDirection
#redgpu_include math.direction.getReflectionVectorFromViewDirection
#redgpu_include math.tnb.getTBNFromVertexTangent
#redgpu_include math.tnb.getTBN
#redgpu_include math.tnb.getTBNFromCotangent
#redgpu_include math.tnb.getNormalFromNormalMap;
#redgpu_include KHR.KHR_texture_transform.getKHRTextureTransformUV;
#redgpu_include KHR.KHR_materials_sheen.getSheenIBL;
#redgpu_include KHR.KHR_materials_sheen.getSheenLambda;
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

struct Uniforms {
    useVertexColor: u32,
    useCutOff: u32,
    cutOff: f32,
    alphaBlend: u32,

    // doubleSided
    doubleSided:u32,
    useVertexTangent:u32,

    //
    opacity: f32,
    useTint:u32,
    tint:vec4<f32>,
    tintBlendMode:u32,

    // Base Color
    baseColorFactor: vec4<f32>,
    // Emissive
    emissiveFactor: vec3<f32>,
    emissiveStrength:f32,
    // Occlusion
    occlusionStrength: f32,
    // Metallic Roughness
    metallicFactor: f32,
    roughnessFactor: f32,
    // Normal
    normalScale: f32,

    // extensions
    // unlit
    useKHR_materials_unlit:u32,
    // ior
    KHR_materials_ior:f32,
    // 기본 PBR 재질 속성
    // 투명도 관련 (Transmission)
    useKHR_materials_transmission: u32,
    KHR_transmissionFactor: f32,

    // 확산 투과 (Diffuse Transmission)
    useKHR_materials_diffuse_transmission: u32,
    KHR_diffuseTransmissionFactor: f32,
    KHR_diffuseTransmissionColorFactor: vec3<f32>,

    // 분산 (Dispersion) - 투과 광선의 파장에 따른 굴절 변화
    KHR_dispersion:f32,
    // 볼륨 (Volume) - 투명도 및 투과와 관련
    useKHR_materials_volume: u32,
    KHR_thicknessFactor: f32,
    KHR_attenuationDistance: f32,
    KHR_attenuationColor: vec3<f32>,

    // 스페큘러 (Specular)
    useKHR_materials_specular: u32,
    KHR_specularFactor: f32,
    KHR_specularColorFactor: vec3<f32>,

    // 이방성 (Anisotropy) - 스페큘러 하이라이트 형태 수정
    useKHR_materials_anisotropy: u32,
    KHR_anisotropyStrength: f32,
    KHR_anisotropyRotation: f32,

    // Iridescence - 무지개 빛
    useKHR_materials_iridescence: u32,
    KHR_iridescenceFactor: f32,
    KHR_iridescenceIor: f32,
    KHR_iridescenceThicknessMinimum: f32,
    KHR_iridescenceThicknessMaximum: f32,

    // Sheen - 천이나 패브릭 표현
    useKHR_materials_sheen: u32,
    KHR_sheenColorFactor: vec3<f32>,
    KHR_sheenRoughnessFactor: f32,

    // Clearcoat - 표면 위의 투명층
    useKHR_materials_clearcoat: u32,
    KHR_clearcoatFactor: f32,
    KHR_clearcoatRoughnessFactor: f32,
    KHR_clearcoatNormalScale: f32,
    // KHR_texture_transform
    #redgpu_include KHR_texture_transform

};
// Uniforms Group
@group(2) @binding(0) var<uniform> uniforms: Uniforms;

@group(2) @binding(1) var baseColorTextureSampler: sampler;
// Base ColorRGBA Texture
#redgpu_if baseColorTexture
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;
#redgpu_endIf

// Emissive Texture
#redgpu_if emissiveTexture
@group(2) @binding(3) var emissiveTextureSampler: sampler;
@group(2) @binding(4) var emissiveTexture: texture_2d<f32>;
#redgpu_endIf

// Normal Texture
#redgpu_if normalTexture
@group(2) @binding(5) var normalTextureSampler: sampler;
@group(2) @binding(6) var normalTexture: texture_2d<f32>;
#redgpu_endIf

// occlusionTexture, metallicRoughnessTexture
#redgpu_if packedORMTexture
@group(2) @binding(7) var packedORMTexture: texture_2d<f32>;
#redgpu_endIf

// KHR_specularTexture, KHR_specularColorTexture
#redgpu_if useKHR_materials_specular
@group(2) @binding(8) var KHR_specularTextureSampler: sampler;
@group(2) @binding(9) var KHR_specularTexture: texture_2d<f32>;
@group(2) @binding(10) var KHR_specularColorTextureSampler: sampler;
@group(2) @binding(11) var KHR_specularColorTexture: texture_2d<f32>;
#redgpu_endIf
// KHR_clearcoatTexture, KHR_clearcoatRoughnessTexture
//@group(2) @binding(12) var packedKHR_clearcoatTexture: texture_2d<f32>;

// KHR_clearcoatNormalTexture
@group(2) @binding(12) var KHR_clearcoatNormalTexture: texture_2d<f32>;
@group(2) @binding(13) var packedKHR_clearcoatTexture_transmission: texture_2d<f32>;

//@group(2) @binding(14) var packedKHR_transmission: texture_2d<f32>;

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

// Input structure for model data
struct InputData {
    // Built-in attributes
    @builtin(position) position : vec4<f32>,
    // Vertex attributes
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    // Texture coordinates
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    // ColorRGBA
    @location(4) vertexColor_0: vec4<f32>,
    // Tangent vector
    @location(5) vertexTangent: vec4<f32>,


    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(10) localNodeScale_volumeScale: vec2<f32>,
    @location(11) combinedOpacity: f32,

    //
    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
}


@fragment
fn main(inputData:InputData) -> FragmentOutput {
    var output: FragmentOutput;
    // 데이터 변수를 뽑아서 저장
    let input_vertexNormal = (inputData.vertexNormal.xyz);
    let input_vertexPosition = inputData.vertexPosition.xyz;
    let input_vertexColor_0 = inputData.vertexColor_0;
    let input_vertexTangent = inputData.vertexTangent;
    let input_ndcPosition = inputData.position.xyz / inputData.position.w ;
    let input_uv = inputData.uv;
    let input_uv1 = inputData.uv1;
    //
    // AmbientLight
    let u_ambientLight = systemUniforms.ambientLight;
    let u_ambientLightColor = u_ambientLight.color;
    let u_ambientLightIntensity = u_ambientLight.intensity;

    // DirectionalLight
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    let u_shadowDepthTextureSize = systemUniforms.shadowDepthTextureSize;
    let u_bias = systemUniforms.bias;

    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    // Shadow
    let receiveShadowYn = inputData.receiveShadow != .0;

    // Camera
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // 유니폼 변수 뽑아서 저장
    let u_opacity = uniforms.opacity;
    let u_cutOff = uniforms.cutOff;
    let u_useVertexColor = uniforms.useVertexColor == 1u;
    let u_useVertexTangent = uniforms.useVertexTangent == 1u;

    // Base Color
    let u_baseColorFactor = uniforms.baseColorFactor;

    // Metallic-Roughness
    let u_metallicFactor = uniforms.metallicFactor;
    let u_roughnessFactor = uniforms.roughnessFactor;

    // Normal Map
    let u_normalScale = uniforms.normalScale;

    // Occlusion
    let u_occlusionStrength = uniforms.occlusionStrength;

    // Emissive
    let u_emissiveFactor = uniforms.emissiveFactor;
    let u_emissiveStrength = uniforms.emissiveStrength;

    // KHR 확장정리
    let u_useKHR_materials_unlit = uniforms.useKHR_materials_unlit == 1u;
    let u_KHR_materials_ior = uniforms.KHR_materials_ior;
    let u_KHR_dispersion = uniforms.KHR_dispersion;


    // KHR_materials_transmission
    let u_KHR_transmissionFactor = uniforms.KHR_transmissionFactor;

     // KHR_materials_volume
    var u_useKHR_materials_volume = uniforms.useKHR_materials_volume == 1u;
    var u_KHR_thicknessFactor = uniforms.KHR_thicknessFactor ;
    var u_KHR_attenuationColor = uniforms.KHR_attenuationColor;
    var u_KHR_attenuationDistance = uniforms.KHR_attenuationDistance ;

    // KHR_materials_diffuse_transmission
    let u_useKHR_materials_diffuse_transmission = uniforms.useKHR_materials_diffuse_transmission == 1u;
    let u_KHR_diffuseTransmissionFactor = uniforms.KHR_diffuseTransmissionFactor;
    let u_KHR_diffuseTransmissionColorFactor = uniforms.KHR_diffuseTransmissionColorFactor;

    // KHR_materials_specular
    let u_KHR_specularFactor = uniforms.KHR_specularFactor;
    let u_KHR_specularColorFactor = uniforms.KHR_specularColorFactor;


    // KHR_materials_anisotropy
    let u_KHR_anisotropyStrength = uniforms.KHR_anisotropyStrength;
    let u_KHR_anisotropyRotation = uniforms.KHR_anisotropyRotation;
    let u_useKHR_anisotropyTexture = uniforms.useKHR_anisotropyTexture == 1u;

    // KHR_materials_sheen


    let u_KHR_sheenColorFactor = uniforms.KHR_sheenColorFactor;
    let u_KHR_sheenRoughnessFactor = uniforms.KHR_sheenRoughnessFactor;

    // KHR_materials_iridescence
    let u_useKHR_materials_iridescence = uniforms.useKHR_materials_iridescence == 1u;
    let u_KHR_iridescenceFactor = uniforms.KHR_iridescenceFactor;
    let u_KHR_iridescenceIor = uniforms.KHR_iridescenceIor;
    let u_KHR_iridescenceThicknessMinimum = uniforms.KHR_iridescenceThicknessMinimum;
    let u_KHR_iridescenceThicknessMaximum = uniforms.KHR_iridescenceThicknessMaximum;

    // KHR_materials_clearcoat
    let u_KHR_clearcoatFactor = uniforms.KHR_clearcoatFactor;
    let u_KHR_clearcoatRoughnessFactor = uniforms.KHR_clearcoatRoughnessFactor;
    let u_KHR_clearcoatNormalScale = uniforms.KHR_clearcoatNormalScale;


    // 모든 텍스처 타입에 대한 UV 좌표를 초기화

    // 기본 PBR 텍스처 UV 좌표
    let diffuseUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.baseColorTexture_texCoord_index,
        uniforms.use_baseColorTexture_KHR_texture_transform,
        uniforms.baseColorTexture_KHR_texture_transform_offset,
        uniforms.baseColorTexture_KHR_texture_transform_rotation,
        uniforms.baseColorTexture_KHR_texture_transform_scale
    );

    let emissiveUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.emissiveTexture_texCoord_index,
        uniforms.use_emissiveTexture_KHR_texture_transform,
        uniforms.emissiveTexture_KHR_texture_transform_offset,
        uniforms.emissiveTexture_KHR_texture_transform_rotation,
        uniforms.emissiveTexture_KHR_texture_transform_scale
    );

    let occlusionUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.occlusionTexture_texCoord_index,
        uniforms.use_occlusionTexture_KHR_texture_transform,
        uniforms.occlusionTexture_KHR_texture_transform_offset,
        uniforms.occlusionTexture_KHR_texture_transform_rotation,
        uniforms.occlusionTexture_KHR_texture_transform_scale
    );

    let metallicRoughnessUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.metallicRoughnessTexture_texCoord_index,
        uniforms.use_metallicRoughnessTexture_KHR_texture_transform,
        uniforms.metallicRoughnessTexture_KHR_texture_transform_offset,
        uniforms.metallicRoughnessTexture_KHR_texture_transform_rotation,
        uniforms.metallicRoughnessTexture_KHR_texture_transform_scale
    );

    let normalUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.normalTexture_texCoord_index,
        uniforms.use_normalTexture_KHR_texture_transform,
        uniforms.normalTexture_KHR_texture_transform_offset,
        uniforms.normalTexture_KHR_texture_transform_rotation,
        uniforms.normalTexture_KHR_texture_transform_scale
    );

    // 클리어코트 텍스처 UV 좌표
    let KHR_clearcoatUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.KHR_clearcoatTexture_texCoord_index,
        uniforms.use_KHR_clearcoatTexture_KHR_texture_transform,
        uniforms.KHR_clearcoatTexture_KHR_texture_transform_offset,
        uniforms.KHR_clearcoatTexture_KHR_texture_transform_rotation,
        uniforms.KHR_clearcoatTexture_KHR_texture_transform_scale
    );
    #redgpu_if useKHR_materials_clearcoat
    let KHR_clearcoatNormalUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.KHR_clearcoatNormalTexture_texCoord_index,
        uniforms.use_KHR_clearcoatNormalTexture_KHR_texture_transform,
        uniforms.KHR_clearcoatNormalTexture_KHR_texture_transform_offset,
        uniforms.KHR_clearcoatNormalTexture_KHR_texture_transform_rotation,
        uniforms.KHR_clearcoatNormalTexture_KHR_texture_transform_scale
    );
    #redgpu_endIf

    let KHR_clearcoatRoughnessUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.KHR_clearcoatRoughnessTexture_texCoord_index,
        uniforms.use_KHR_clearcoatRoughnessTexture_KHR_texture_transform,
        uniforms.KHR_clearcoatRoughnessTexture_KHR_texture_transform_offset,
        uniforms.KHR_clearcoatRoughnessTexture_KHR_texture_transform_rotation,
        uniforms.KHR_clearcoatRoughnessTexture_KHR_texture_transform_scale
    );

    // 광택 텍스처 UV 좌표
    let KHR_sheenColorUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.KHR_sheenColorTexture_texCoord_index,
        uniforms.use_KHR_sheenColorTexture_KHR_texture_transform,
        uniforms.KHR_sheenColorTexture_KHR_texture_transform_offset,
        uniforms.KHR_sheenColorTexture_KHR_texture_transform_rotation,
        uniforms.KHR_sheenColorTexture_KHR_texture_transform_scale
    );

    let KHR_sheenRoughnessUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.KHR_sheenRoughnessTexture_texCoord_index,
        uniforms.use_KHR_sheenRoughnessTexture_KHR_texture_transform,
        uniforms.KHR_sheenRoughnessTexture_KHR_texture_transform_offset,
        uniforms.KHR_sheenRoughnessTexture_KHR_texture_transform_rotation,
        uniforms.KHR_sheenRoughnessTexture_KHR_texture_transform_scale
    );

    // 스페큘러 텍스처 UV 좌표
    let KHR_specularTextureUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.KHR_specularTexture_texCoord_index,
        uniforms.use_KHR_specularTexture_KHR_texture_transform,
        uniforms.KHR_specularTexture_KHR_texture_transform_offset,
        uniforms.KHR_specularTexture_KHR_texture_transform_rotation,
        uniforms.KHR_specularTexture_KHR_texture_transform_scale
    );

    let KHR_specularColorTextureUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.KHR_specularColorTexture_texCoord_index,
        uniforms.use_KHR_specularColorTexture_KHR_texture_transform,
        uniforms.KHR_specularColorTexture_KHR_texture_transform_offset,
        uniforms.KHR_specularColorTexture_KHR_texture_transform_rotation,
        uniforms.KHR_specularColorTexture_KHR_texture_transform_scale
    );

    // 무지개빛 텍스처 UV 좌표
    let KHR_iridescenceTextureUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.KHR_iridescenceTexture_texCoord_index,
        uniforms.use_KHR_iridescenceTexture_KHR_texture_transform,
        uniforms.KHR_iridescenceTexture_KHR_texture_transform_offset,
        uniforms.KHR_iridescenceTexture_KHR_texture_transform_rotation,
        uniforms.KHR_iridescenceTexture_KHR_texture_transform_scale
    );

    let KHR_iridescenceThicknessTextureUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.KHR_iridescenceThicknessTexture_texCoord_index,
        uniforms.use_KHR_iridescenceThicknessTexture_KHR_texture_transform,
        uniforms.KHR_iridescenceThicknessTexture_KHR_texture_transform_offset,
        uniforms.KHR_iridescenceThicknessTexture_KHR_texture_transform_rotation,
        uniforms.KHR_iridescenceThicknessTexture_KHR_texture_transform_scale
    );

    // 투과 텍스처 UV 좌표
    let KHR_transmissionUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.KHR_transmissionTexture_texCoord_index,
        uniforms.use_KHR_transmissionTexture_KHR_texture_transform,
        uniforms.KHR_transmissionTexture_KHR_texture_transform_offset,
        uniforms.KHR_transmissionTexture_KHR_texture_transform_rotation,
        uniforms.KHR_transmissionTexture_KHR_texture_transform_scale
    );

    let KHR_diffuseTransmissionUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.KHR_diffuseTransmissionTexture_texCoord_index,
        uniforms.use_KHR_diffuseTransmissionTexture_KHR_texture_transform,
        uniforms.KHR_diffuseTransmissionTexture_KHR_texture_transform_offset,
        uniforms.KHR_diffuseTransmissionTexture_KHR_texture_transform_rotation,
        uniforms.KHR_diffuseTransmissionTexture_KHR_texture_transform_scale
    );

    let KHR_diffuseTransmissionColorUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.KHR_diffuseTransmissionColorTexture_texCoord_index,
        uniforms.use_KHR_diffuseTransmissionColorTexture_KHR_texture_transform,
        uniforms.KHR_diffuseTransmissionColorTexture_KHR_texture_transform_offset,
        uniforms.KHR_diffuseTransmissionColorTexture_KHR_texture_transform_rotation,
        uniforms.KHR_diffuseTransmissionColorTexture_KHR_texture_transform_scale
    );

    let KHR_anisotropyUV = getKHRTextureTransformUV(
        input_uv, input_uv1,
        uniforms.KHR_anisotropyTexture_texCoord_index,
        uniforms.use_KHR_anisotropyTexture_KHR_texture_transform,
        uniforms.KHR_anisotropyTexture_KHR_texture_transform_offset,
        uniforms.KHR_anisotropyTexture_KHR_texture_transform_rotation,
        uniforms.KHR_anisotropyTexture_KHR_texture_transform_scale
    );


    /////////////////////////////////////////////////////////////////////////////////
    // check vertexNormal
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

    // [KO] 클리어코트 등을 위해 변형 전 기하 법선을 보존합니다.
    // [EN] Preserves the geometric normal before perturbation for clearcoat, etc.
    let geometricNormal = N;

    #redgpu_if normalTexture
    {
        var targetUv = select(normalUV, 1.0 - normalUV, backFaceYn);
        let normalSamplerColor = textureSample(normalTexture, normalTextureSampler, normalUV).rgb;
        let tbn = getTBNFromCotangent(N, input_vertexPosition, targetUv);
        N = getNormalFromNormalMap(
            vec3<f32>(normalSamplerColor.r, 1.0 - normalSamplerColor.g, normalSamplerColor.b),
            tbn,
            -u_normalScale
        );
        N = select(N, select(N, -N, backFaceYn), u_useVertexTangent);
    }
    #redgpu_else
    {
      N = N * u_normalScale;
    }
    #redgpu_endIf
    /////////////////////////////////////////////////////////////////////////////////
    // view direction vector
    let V: vec3<f32> = getViewDirection(input_vertexPosition, u_cameraPosition);
    let NdotV = max(dot(N, V), 0.04);
    let VdotN = max(dot(V, N), 0.0);
    /////////////////////////////////////////////////////////////////////////////////

    var visibility:f32 = 1.0;
    visibility = getDirectionalShadowVisibility(
                directionalShadowMap,
                directionalShadowMapSampler,
                u_shadowDepthTextureSize,
                u_bias,
                inputData.shadowCoord
            );

    if(!receiveShadowYn){
       visibility = 1.0;
    }
    /////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////
    var finalColor:vec4<f32>;
    var ior:f32 = u_KHR_materials_ior;
    var baseColor = u_baseColorFactor;
    var resultAlpha:f32 = u_opacity * baseColor.a;
    baseColor *= select(vec4<f32>(1.0), input_vertexColor_0, u_useVertexColor);
    // baseColorTexture

    #redgpu_if baseColorTexture
       let diffuseSampleColor =  (textureSample(baseColorTexture, baseColorTextureSampler, diffuseUV));
       baseColor *= diffuseSampleColor;
       resultAlpha *= diffuseSampleColor.a;
    #redgpu_endIf



    let albedo:vec3<f32> = baseColor.rgb ;

    // ---------- KHR_materials_unlit ----------

    #redgpu_if useKHR_materials_unlit
    if(u_useKHR_materials_unlit){
        output.color = baseColor;
        return output;
    }
    #redgpu_endIf

    // ---------- occlusion ----------
    var occlusionParameter:f32 = 1;
    #redgpu_if useOcclusionTexture
        occlusionParameter = textureSample(packedORMTexture, packedTextureSampler, occlusionUV).r * u_occlusionStrength;
    #redgpu_endIf

    // ---------- metallicRoughness ----------
    var metallicParameter: f32 = u_metallicFactor;
    var roughnessParameter: f32 = u_roughnessFactor;
    #redgpu_if useMetallicRoughnessTexture
        let metallicRoughnessSample = (textureSample(packedORMTexture, packedTextureSampler, metallicRoughnessUV));
        metallicParameter = metallicRoughnessSample.b * metallicParameter;
        roughnessParameter = metallicRoughnessSample.g * roughnessParameter;
    #redgpu_endIf
    roughnessParameter = max(roughnessParameter, 0.045);
    if (abs(ior - 1.0) < 0.0001) { roughnessParameter = 0; }

    // ---------- KHR_materials_clearcoat ----------
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
                if(backFaceYn){
                    targetUv = 1.0 - targetUv;
                }
                clearcoatNormal = clearcoatNormalSampler.rgb;
                // [KO] 클리어코트 TBN은 변형된 N이 아닌 기하 법선(geometricNormal)을 기준으로 구축해야 합니다.
                // [EN] Clearcoat TBN should be constructed based on the geometricNormal, not the perturbed N.
                let clearcoatTBN = getTBNFromCotangent(geometricNormal, input_vertexPosition, targetUv);
                clearcoatNormal = getNormalFromNormalMap(
                    vec3<f32>(clearcoatNormalSampler.r, 1.0 - clearcoatNormalSampler.g, clearcoatNormalSampler.b),
                    clearcoatTBN,
                    -u_KHR_clearcoatNormalScale
                );
                if(u_useVertexTangent){
                    if(backFaceYn ){ clearcoatNormal = -clearcoatNormal; }
                }
                clearcoatNormal = normalize(clearcoatNormal);
            }
            #redgpu_endIf
        }
    }
    #redgpu_endIf

    // ---------- KHR_materials_specular ----------
    var specularParameter = u_KHR_specularFactor;
    var specularColor = u_KHR_specularColorFactor;
    #redgpu_if useKHR_materials_specular
        #redgpu_if KHR_specularColorTexture
            let specularColorTextureSample = textureSample(
                KHR_specularColorTexture,
                KHR_specularColorTextureSampler,
                KHR_specularColorTextureUV
            );
            specularColor *= specularColorTextureSample.rgb;
        #redgpu_endIf
        #redgpu_if KHR_specularTexture
            let specularTextureSample = textureSample(
                KHR_specularTexture,
                KHR_specularTextureSampler,
                KHR_specularTextureUV
            );
            specularParameter *= specularTextureSample.a;
        #redgpu_endIf
    #redgpu_endIf

    // ---------- KHR_materials_transmission ----------
    var transmissionParameter: f32 = u_KHR_transmissionFactor;
    var thicknessParameter: f32 = u_KHR_thicknessFactor;
    #redgpu_if useKHR_materials_transmission
        #redgpu_if useKHR_transmissionTexture
          let transmissionSample: vec4<f32> = textureSample(
              packedKHR_clearcoatTexture_transmission,
              packedTextureSampler,
              KHR_transmissionUV
          );
          transmissionParameter *= transmissionSample.b;
        #redgpu_endIf

        // ---------- KHR_materials_volume ----------

        #redgpu_if useKHR_thicknessTexture
            let thicknessSample: vec4<f32> = textureSample(
                packedKHR_clearcoatTexture_transmission,
                packedTextureSampler,
                KHR_transmissionUV
            );
            thicknessParameter *= thicknessSample.a;
        #redgpu_endIf
    #redgpu_endIf

    // ---------- KHR_materials_diffuse_transmission ----------
    var diffuseTransmissionColor:vec3<f32> = u_KHR_diffuseTransmissionColorFactor;
    var diffuseTransmissionParameter : f32 = u_KHR_diffuseTransmissionFactor;
    #redgpu_if useKHR_materials_diffuse_transmission
        #redgpu_if useKHR_diffuseTransmissionTexture
            let diffuseTransmissionTextureSample =  textureSample(
                packedKHR_diffuse_transmission,
                packedTextureSampler,
                KHR_diffuseTransmissionUV
            );
            diffuseTransmissionParameter *= diffuseTransmissionTextureSample.a;
        #redgpu_endIf
        #redgpu_if useKHR_diffuseTransmissionColorTexture
            let diffuseTransmissionColorTextureSample =  textureSample(
                packedKHR_diffuse_transmission,
                packedTextureSampler,
                KHR_diffuseTransmissionColorUV
            );
            diffuseTransmissionColor *= diffuseTransmissionColorTextureSample.rgb;
        #redgpu_endIf
    #redgpu_endIf

    // ---------- KHR_materials_sheen ----------
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

    // ---------- KHR_materials_iridescence ----------
    var iridescenceParameter = u_KHR_iridescenceFactor;
    var iridescenceThickness = u_KHR_iridescenceThicknessMaximum;
    #redgpu_if useKHR_materials_iridescence
        #redgpu_if useKHR_iridescenceTexture
            let iridescenceTextureSample: vec4<f32> = textureSample(
                packedKHR_iridescence,
                packedTextureSampler,
                KHR_iridescenceTextureUV
            );
            iridescenceParameter *= iridescenceTextureSample.r;
        #redgpu_endIf
        #redgpu_if useKHR_iridescenceThicknessTexture
            let iridescenceThicknessTextureSample: vec4<f32> = textureSample(
                packedKHR_iridescence,
                packedTextureSampler,
                KHR_iridescenceThicknessTextureUV
            );
            iridescenceThickness =  mix(u_KHR_iridescenceThicknessMinimum, u_KHR_iridescenceThicknessMaximum, iridescenceThicknessTextureSample.g);
        #redgpu_endIf
    #redgpu_endIf

    // ---------- KHR_materials_anisotropy ----------
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
           // 탄젠트가 없는 경우 Normal을 기준으로 임의의 축 벡터로부터 직교 기저 생성
           let anyT = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(0.0, 1.0, 0.0), abs(N.x) > 0.9);
           tbn = getTBN(N, anyT);
       }
       T = tbn[0];
       B = tbn[1];

       var anisotropicDirection: vec2<f32> = vec2<f32>(1.0, 0.0);
       if(u_useKHR_anisotropyTexture){
           let anisotropyTex = textureSample(KHR_anisotropyTexture, baseColorTextureSampler, KHR_anisotropyUV).rgb;
           // 텍스처의 rg는 [0, 1] 범위이므로 [-1, 1]로 변환
           anisotropicDirection = anisotropyTex.rg * 2.0 - vec2<f32>(1.0, 1.0);
           anisotropy *= anisotropyTex.b;
       }

       // 2. 이방성 회전 적용 (GLTF 스펙: 시계 반대 방향 회전)
       var cosR = cos(u_KHR_anisotropyRotation);
       var sinR = sin(u_KHR_anisotropyRotation);
       let rotationMtx: mat2x2<f32> = mat2x2<f32>(
           cosR, sinR,
           -sinR, cosR
       );

       // 텍스처에서 읽어온 방향에 유니폼 회전량을 결합
       anisotropicDirection = rotationMtx * anisotropicDirection;

       // 3. 최종 이방성 탄젠트/바이탄젠트 계산 (TBN 공간으로 투영)
       let anisotropicTBN = getTBN(N, T * anisotropicDirection.x + B * anisotropicDirection.y);
       anisotropicT = anisotropicTBN[0];
       anisotropicB = anisotropicTBN[1];
    }
    #redgpu_endIf

    // ---------- 2패스일경우 배경 샘플링 ----------
    var transmissionRefraction = vec3<f32>(0.0);
    #redgpu_if useKHR_materials_transmission
        transmissionRefraction = getTransmissionRefraction(
            u_useKHR_materials_volume, thicknessParameter * inputData.localNodeScale_volumeScale[1] , u_KHR_dispersion, u_KHR_attenuationDistance , u_KHR_attenuationColor,
            ior, roughnessParameter, albedo,
            systemUniforms.projectionCameraMatrix, input_vertexPosition, input_ndcPosition,
            V, N,
            renderPath1ResultTexture, renderPath1ResultTextureSampler
        );
    #redgpu_endIf
    // ---------- 기본 F0 계산 ----------
//    let F0_dielectric: vec3<f32> =  vec3(pow((1.0 - ior) / (1.0 + ior), 2.0)) ; // 유전체 반사율
//    let F0_metal = baseColor.rgb; // 금속 반사율
//    var F0 = mix(F0_dielectric, F0_metal, metallicParameter); // 기본 반사율
    let F0_dielectric_base = vec3(pow((1.0 - ior) / (1.0 + ior), 2.0));
    // KHR_materials_specular 적용
    var F0_dielectric = F0_dielectric_base *  specularColor;
    var F0_metal = baseColor.rgb; // 금속 반사율

    #redgpu_if useKHR_materials_iridescence
        if (iridescenceParameter > 0.0) {
            F0_dielectric = getIridescentFresnel(1.0, u_KHR_iridescenceIor, F0_dielectric, iridescenceThickness, iridescenceParameter, NdotV);
            F0_metal = getIridescentFresnel(1.0, u_KHR_iridescenceIor, baseColor.rgb, iridescenceThickness, iridescenceParameter, NdotV);
        }
    #redgpu_endIf
    let F0 = mix(F0_dielectric, F0_metal, metallicParameter); // 기본 반사율

    // ---------- 직접 조명 계산 - directional ----------
    var totalDirectLighting = vec3<f32>(0.0);
    for (var i = 0u; i < u_directionalLightCount; i++) {
        totalDirectLighting += calcLight(
            u_directionalLights[i].color, u_directionalLights[i].intensity * visibility,
            N, V, -normalize(u_directionalLights[i].direction),
            VdotN,
            roughnessParameter, metallicParameter, albedo,
            F0, ior,
            transmissionRefraction,
            specularColor, specularParameter,
            u_useKHR_materials_diffuse_transmission, diffuseTransmissionParameter, diffuseTransmissionColor,
            transmissionParameter,
            sheenColor, sheenRoughnessParameter,
            anisotropy, anisotropicT, anisotropicB,
            clearcoatParameter, clearcoatRoughnessParameter, clearcoatNormal
        );
    }

    // ---------- 직접 조명 계산 - pointLight ----------
    {
        let clusterIndex = getClusterLightClusterIndex(inputData.position);
        let lightOffset  = clusterLightGroup.lights[clusterIndex].offset;
        let lightCount:u32   = clusterLightGroup.lights[clusterIndex].count;

        for (var lightIndex = 0u; lightIndex < lightCount; lightIndex = lightIndex + 1u) {
            let i = clusterLightGroup.indices[lightOffset + lightIndex];
            let targetLight = clusterLightList.lights[i];
            let u_clusterLightPosition = targetLight.position;
            let u_clusterLightRadius = targetLight.radius;
            let u_isSpotLight = targetLight.isSpotLight;

         let lightDir = u_clusterLightPosition - input_vertexPosition;
         let lightDistance = length(lightDir);

         // 거리 범위 체크
         if (lightDistance > u_clusterLightRadius) {
             continue;
         }

         let L = normalize(lightDir);
         let attenuation = getLightDistanceAttenuation(lightDistance, u_clusterLightRadius);

         var finalAttenuation = attenuation;

         // 스폿라이트 처리
         if (u_isSpotLight > 0.0) {
             let u_clusterLightDirection = normalize(vec3<f32>(
                 targetLight.directionX,
                 targetLight.directionY,
                 targetLight.directionZ
             ));

             // 라이트에서 버텍스로의 방향
             let lightToVertex = normalize(-L);
             
             finalAttenuation *= getLightAngleAttenuation(
                 lightToVertex, 
                 u_clusterLightDirection, 
                 targetLight.innerCutoff, 
                 targetLight.outerCutoff
             );
         }

         // calcLight 함수 호출
         totalDirectLighting += calcLight(
             targetLight.color, targetLight.intensity * finalAttenuation,
             N, V, L,
             VdotN,
             roughnessParameter, metallicParameter, albedo,
             F0, ior,
             transmissionRefraction,
             specularColor, specularParameter,
             u_useKHR_materials_diffuse_transmission, diffuseTransmissionParameter, diffuseTransmissionColor,
             transmissionParameter,
             sheenColor, sheenRoughnessParameter,
             anisotropy, anisotropicT, anisotropicB,
             clearcoatParameter, clearcoatRoughnessParameter, clearcoatNormal
         );
        }
    }

    // ---------- 간접 조명 계산 - ibl ----------
    if (u_usePrefilterTexture) {

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
        // ---------- ibl (roughness에 따른 mipmap 레벨 사용) ----------
        let iblMipmapCount:f32 = f32(textureNumLevels(ibl_environmentTexture) - 1);
        var mipLevel = roughnessParameter * iblMipmapCount;
        var reflectedColor = textureSampleLevel( ibl_environmentTexture, prefilterTextureSampler, R, mipLevel ).rgb;

        // ---------- ibl (BRDF LUT 샘플링) ----------
        // NdotV와 Roughness를 좌표로 사용하여 미리 계산된 Scale(x)과 Bias(y) 값을 가져옴
        let envBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, vec2<f32>(NdotV, roughnessParameter), 0.0).rg;

        // 거칠기를 고려한 각 파트별 통합 반사율 계산 (Split Sum Approximation)
        var F_IBL_dielectric = F0_dielectric * envBRDF.x + envBRDF.y;
        var F_IBL_metal      = F0_metal      * envBRDF.x + envBRDF.y;
        var F_IBL            = F0            * envBRDF.x + envBRDF.y;

        // Transmission 등에서 사용하는 Smith 기하 감쇠 근사 (기존 로직 유지)
        let a2 = roughnessParameter * roughnessParameter;
        let G_smith = NdotV / (NdotV * (1.0 - a2) + a2);

        // ---------- ibl Diffuse  ----------
        let effectiveTransmission = transmissionParameter * (1.0 - metallicParameter);
        let iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N,0).rgb;
        var envIBL_DIFFUSE:vec3<f32> = albedo * iblDiffuseColor* (vec3<f32>(1.0) - F_IBL_dielectric);

        // ---------- ibl Diffuse Transmission ----------
        #redgpu_if useKHR_materials_diffuse_transmission
        {
            // 후면 산란을 위한 샘플링 방향 (back side)
            var backScatteringColor = textureSampleLevel(ibl_environmentTexture, prefilterTextureSampler, -N, mipLevel).rgb;
            let transmittedIBL = backScatteringColor * diffuseTransmissionColor * (vec3<f32>(1.0) - F_IBL_dielectric);
            // 반사와 투과 효과 혼합
            envIBL_DIFFUSE = mix(envIBL_DIFFUSE, transmittedIBL, diffuseTransmissionParameter);
        }
        #redgpu_endIf

        // ---------- ibl Specular ----------
        var envIBL_SPECULAR:vec3<f32>;
        envIBL_SPECULAR = reflectedColor * F_IBL * specularParameter ;
        // ---------- ibl Specular BTDF ----------
        var envIBL_SPECULAR_BTDF = vec3<f32>(0.0);
        #redgpu_if useKHR_materials_transmission
            var refractedDir: vec3<f32>;
            let eta = 1.0 / ior;
            if (abs(ior - 1.0) < 0.0001) { refractedDir = V; }
            else { refractedDir = refract(-V, -N, eta); }

            if(length(refractedDir) > 0.0001) {
                let NdotT = abs(dot(N, normalize(refractedDir)));
                let F_transmission = vec3<f32>(1.0) - mix(F_IBL_dielectric,F_IBL_metal,metallicParameter);

                var attenuatedBackground = transmissionRefraction;
                 if (u_useKHR_materials_volume) {
                     let localNodeScale = inputData.localNodeScale_volumeScale[0];
                     let volumeScale = inputData.localNodeScale_volumeScale[1];

                     let scaledThickness = thicknessParameter * localNodeScale ;
                     // 유효한 색상 및 거리 값 확보 (물리적으로 의미 있는 범위)
                     let safeAttenuationColor = clamp(u_KHR_attenuationColor, vec3<f32>(0.0001), vec3<f32>(1.0));
                     let safeAttenuationDistance = max(u_KHR_attenuationDistance, 0.0001);

                     // Beer-Lambert 법칙에 따른 감쇠 계산
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

        // ---------- ibl 유전체 합성 ----------
        let envIBL_DIELECTRIC = mix(envIBL_DIFFUSE ,envIBL_SPECULAR_BTDF, transmissionParameter) + envIBL_SPECULAR  ;

        // ---------- ibl Sheen 계산 ----------
        var sheenIBLContribution = vec3<f32>(0.0);
        var sheenAlbedoScaling: f32 = 1.0;
        let maxSheenColor = max(sheenColor.x, max(sheenColor.y, sheenColor.z));
        #redgpu_if useKHR_materials_sheen
            let sheenResult = getSheenIBL(
                N,
                V,
                sheenColor,
                maxSheenColor,
                sheenRoughnessParameter,
                iblMipmapCount,
                ibl_irradianceTexture,
                prefilterTextureSampler
            );
            sheenIBLContribution = sheenResult.sheenIBLContribution;
            sheenAlbedoScaling = sheenResult.sheenAlbedoScaling;
        #redgpu_endIf

        // ---------- ibl Metal 계산 ----------

        let envIBL_METAL = reflectedColor * F_IBL_metal;
        // ---------- ibl 기본 혼합 ----------
        let metallicPart = envIBL_METAL * metallicParameter ; // 금속 파트 계산
        let dielectricPart = envIBL_DIELECTRIC * (1.0 - metallicParameter) ; // 유전체 파트 계산
        var indirectLighting = (metallicPart + dielectricPart) * sheenAlbedoScaling + sheenIBLContribution; // sheen 파트 포함
        // ---------- ibl clearcoat 계산 ----------
        #redgpu_if useKHR_materials_clearcoat
            if (clearcoatParameter > 0.0) {
                 // 클리어코트 반사 벡터와 뷰 각도 계산
                 let clearcoatR = getReflectionVectorFromViewDirection(V, clearcoatNormal);
                 let clearcoatNdotV = max(dot(clearcoatNormal, V), 0.04);
                 let clearcoatMipLevel = clearcoatRoughnessParameter * iblMipmapCount;
                 let clearcoatPrefilteredColor = textureSampleLevel(ibl_environmentTexture, prefilterTextureSampler, clearcoatR, clearcoatMipLevel).rgb;

                 // 클리어코트용 BRDF LUT 샘플링
                 let clearcoatEnvBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, vec2<f32>(clearcoatNdotV, clearcoatRoughnessParameter), 0.0).rg;
                 
                 // 클리어코트는 보통 굴절률 1.5(F0 = 0.04) 고정으로 취급함
                 let clearcoatF0 = vec3<f32>(0.04);
                 let clearcoatF = clearcoatF0 * clearcoatEnvBRDF.x + clearcoatEnvBRDF.y;

                 // Specular IBL
                 let clearcoatSpecularIBL = clearcoatPrefilteredColor * clearcoatF * clearcoatParameter;

                 //   최종 합산 (에너지 보존: 클리어코트가 반사한 만큼 하위 레이어 조명은 감쇠됨)
                 indirectLighting = clearcoatSpecularIBL + (1.0 - max(clearcoatF.x, max(clearcoatF.y, clearcoatF.z)) * clearcoatParameter) * indirectLighting;
            }
        #redgpu_endIf

        // 최종 IBL 적용
        let environmentIntensity = 1.0;
        let surfaceColor = totalDirectLighting + indirectLighting * environmentIntensity * occlusionParameter;
        finalColor = vec4<f32>(surfaceColor, resultAlpha);

    } else {
        // IBL 텍스처 없는 경우 단순 주변광 사용
        let ambientContribution = albedo * u_ambientLightColor * u_ambientLightIntensity * occlusionParameter;
        finalColor = vec4<f32>(totalDirectLighting + ambientContribution, resultAlpha);
    }

    // ---------- emissive 합산 ----------
    var emissiveSamplerColor = vec3<f32>(1.0);
    #redgpu_if emissiveTexture
        emissiveSamplerColor = textureSample(emissiveTexture, emissiveTextureSampler, emissiveUV).rgb;
    #redgpu_endIf
    finalColor += vec4<f32>( emissiveSamplerColor.rgb * u_emissiveFactor * u_emissiveStrength, 0);


    // ---------- 컷오프 판단 ----------
    #redgpu_if useCutOff
        if (resultAlpha <= u_cutOff) { discard; }

    #redgpu_endIf

    output.color = finalColor;

    {
        let smoothness = 1.0 - roughnessParameter;
        let smoothnessCurved = smoothness * smoothness * (3.0 - 2.0 * smoothness);

        let metallicWeight = metallicParameter * metallicParameter;
        let baseReflection = 0.04 + 0.96 * metallicWeight;

        let baseReflectionStrength = smoothnessCurved * baseReflection;
        output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, baseReflectionStrength);
    }
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos),0.0, 1.0 );

//  // 디버깅: 모션벡터 증폭하여 확인
//   let amplifiedMotion = inputData.motionVector * 50.0;  // 50배 증폭
//   let clampedMotion = vec2<f32>(
//       clamp(amplifiedMotion.x * 0.5 + 0.5, 0.0, 1.0),
//       clamp(amplifiedMotion.y * 0.5 + 0.5, 0.0, 1.0)
//   );
//   output.color = vec4<f32>(clampedMotion, 0.5, 1.0);

    return output;
};
// ---------- KHR_materials_anisotropy ----------

// ---------------------------------------------

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
            SPECULAR_BRDF =  BRDF_specularAnisotropicGGX(
                albedo,
                vec3<f32>(1.0),
                roughnessParameter * roughnessParameter,
                VdotH, NdotL, NdotV, NdotH, BdotV, TdotV, TdotL, BdotL, TdotH, BdotH,
                anisotropy
            ) ;
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

    let DIELECTRIC_BRDF = getFresnelMix(
        F0 ,
        specularParameter,
        mix(DIFFUSE_BRDF , SPECULAR_BTDF , transmissionParameter),
        SPECULAR_BRDF,
        VdotH
    );

    var SHEEN_BRDF:vec3<f32> = vec3<f32>(0.0);
    var sheen_albedo_scaling:f32 = 1.0;
    #redgpu_if useKHR_materials_sheen
        let maxSheenColor = max(sheenColor.x, max(sheenColor.y, sheenColor.z));
        if(sheenRoughnessParameter > 0.0 && maxSheenColor > 0.001 && dot(N,V) > 0) {
            let NdotV = dot(N, V);
            let sheenRoughnessAlpha = sheenRoughnessParameter * sheenRoughnessParameter;
            let invR = 1 / sheenRoughnessAlpha;
            let cos2h = NdotH * NdotH;
            let sin2h = 1 - cos2h;
            let sheenDistribution = (2 + invR) * pow(sin2h, invR * 0.5) / PI2;
            let sheen_visibility =  1.0 / ((1.0 + getSheenLambda(NdotV, sheenRoughnessAlpha) + getSheenLambda(NdotL, sheenRoughnessAlpha)) * (4.0 * NdotV * NdotL));
            let LdotN = max(dot(L, N), 0.04);
            let E_LdotN = 1.0 - pow(1.0 - LdotN, 5.0);
            let E_VdotN = 1.0 - pow(1.0 - VdotN, 5.0);

            sheen_albedo_scaling = max(min(1.0 - maxSheenColor * E_VdotN, 1.0 - maxSheenColor * E_LdotN),0.04);
            SHEEN_BRDF = sheenColor * sheenDistribution * sheen_visibility;
        }
    #redgpu_endIf

    // 조명 계산결과
    // 금속과 유전체 부분을 각각 계산
    let metallicPart = METAL_BRDF * metallicParameter * sheen_albedo_scaling  ;
    let dielectricPart = DIELECTRIC_BRDF * sheen_albedo_scaling ;
//    let dielectricPart = DIELECTRIC_BRDF * (1 - metallicParameter) * sheen_albedo_scaling ;

    let sheenPart = SHEEN_BRDF;
    var directLighting = (metallicPart  + dielectricPart + sheenPart);

    #redgpu_if useKHR_materials_transmission
        if(transmissionParameter > 0.0) {
            // 투과 가중치에 따라 배경색 혼합
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
        // 투과가 없는 경우, 기존처럼 양수 값만 허용
        lightDirection = max(NdotL_origin, 0.0);
    #redgpu_endIf

    let lightContribution = directLighting * dLight * lightDirection;
    return lightContribution;
}
// [KO] PI는 이제 math.PI 인클루드를 통해 공급됩니다.
// [EN] PI is now supplied via math.PI include.

fn BRDF_specularAnisotropicGGX( f0: vec3<f32>, f90: vec3<f32>, alphaRoughness: f32, VdotH: f32, NdotL: f32, NdotV: f32, NdotH: f32, BdotV: f32, TdotV: f32, TdotL: f32, BdotL: f32, TdotH: f32, BdotH: f32, anisotropy: f32 ) -> vec3<f32> {
    var at = mix(alphaRoughness, 1.0, anisotropy * anisotropy);
    var ab = alphaRoughness;
    var F:vec3<f32> = getFresnelSchlick(VdotH,f0);
    var V:f32 = vGGXAnisotropic(NdotL, NdotV, BdotV, TdotV, TdotL, BdotL, at, ab);
    var D:f32 = dGGXAnisotropic(NdotH, TdotH, BdotH, at, ab);
    return F * (V * D);
}
fn dGGXAnisotropic( NdotH: f32, TdotH: f32, BdotH: f32, at: f32, ab: f32 ) -> f32 {
    let a2: f32 = at * ab;
    let f: vec3<f32> = vec3<f32>(ab * TdotH, at * BdotH, a2 * NdotH);
    let denominator: f32 = dot(f, f);
//    if (denominator < 0.0001) {
//     return 0.0;
//    }
    let w2: f32 = a2 / denominator;
    return a2 * w2 * w2 * INV_PI;
}
fn vGGXAnisotropic( NdotL: f32, NdotV: f32, BdotV: f32, TdotV: f32, TdotL: f32, BdotL: f32, at: f32, ab: f32 ) -> f32 {
   let GGXV = NdotL * length(vec3<f32>(at * TdotV, ab * BdotV, NdotV));
   let GGXL = NdotV * length(vec3<f32>(at * TdotL, ab * BdotL, NdotL));
   let v = 0.5 / (GGXV + GGXL);
   return clamp(v, 0.0, 1.0);
}