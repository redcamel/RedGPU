#redgpu_include SYSTEM_UNIFORM;
#redgpu_include calcDirectionalShadowVisibility;
#redgpu_include calcTintBlendMode;
#redgpu_include normalFunctions;
#redgpu_include drawPicking;
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

// Base ColorRGBA Texture
@group(2) @binding(1) var baseColorTextureSampler: sampler;
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;

// Emissive Texture
@group(2) @binding(3) var emissiveTextureSampler: sampler;
@group(2) @binding(4) var emissiveTexture: texture_2d<f32>;

// Normal Texture
@group(2) @binding(5) var normalTextureSampler: sampler;
@group(2) @binding(6) var normalTexture: texture_2d<f32>;


// occlusionTexture, metallicRoughnessTexture
@group(2) @binding(7) var packedORMTexture: texture_2d<f32>;

// KHR_specularTexture, KHR_specularColorTexture
@group(2) @binding(8) var KHR_specularTextureSampler: sampler;
@group(2) @binding(9) var KHR_specularTexture: texture_2d<f32>;
@group(2) @binding(10) var KHR_specularColorTextureSampler: sampler;
@group(2) @binding(11) var KHR_specularColorTexture: texture_2d<f32>;

// KHR_clearcoatTexture, KHR_clearcoatRoughnessTexture
//@group(2) @binding(12) var packedKHR_clearcoatTexture: texture_2d<f32>;

// KHR_clearcoatNormalTexture
@group(2) @binding(12) var KHR_clearcoatNormalTexture: texture_2d<f32>;
@group(2) @binding(13) var packedKHR_clearcoatTexture_transmission: texture_2d<f32>;

//@group(2) @binding(14) var packedKHR_transmission: texture_2d<f32>;

@group(2) @binding(14) var packedKHR_diffuse_transmission: texture_2d<f32>;

@group(2) @binding(15) var packedKHR_sheen: texture_2d<f32>;

@group(2) @binding(16) var KHR_anisotropyTexture: texture_2d<f32>;

@group(2) @binding(17) var packedKHR_iridescence: texture_2d<f32>;

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
  @location(6) shadowPos: vec3<f32>,
  @location(7) receiveShadow: f32,
  @location(8) pickingId: vec4<f32>,
  @location(9) ndcPosition: vec3<f32>,
  @location(10) localNodeScale: f32,
  @location(11) volumeScale: f32,
}


@fragment
fn main(inputData:InputData) -> @location(0) vec4<f32> {
    // 데이터 변수를 뽑아서 저장
    let input_vertexNormal = (inputData.vertexNormal.xyz);
    let input_vertexPosition = inputData.vertexPosition.xyz;
    let input_vertexColor_0 = inputData.vertexColor_0;
    let input_vertexTangent = inputData.vertexTangent;
    let input_ndcPosition = inputData.ndcPosition;
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

    let u_useIblTexture = systemUniforms.useIblTexture == 1u;
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
    let diffuseUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.baseColorTexture_texCoord_index,
        uniforms.use_baseColorTexture_KHR_texture_transform,
        uniforms.baseColorTexture_KHR_texture_transform_offset,
        uniforms.baseColorTexture_KHR_texture_transform_rotation,
        uniforms.baseColorTexture_KHR_texture_transform_scale
    );

    let emissiveUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.emissiveTexture_texCoord_index,
        uniforms.use_emissiveTexture_KHR_texture_transform,
        uniforms.emissiveTexture_KHR_texture_transform_offset,
        uniforms.emissiveTexture_KHR_texture_transform_rotation,
        uniforms.emissiveTexture_KHR_texture_transform_scale
    );

    let occlusionUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.occlusionTexture_texCoord_index,
        uniforms.use_occlusionTexture_KHR_texture_transform,
        uniforms.occlusionTexture_KHR_texture_transform_offset,
        uniforms.occlusionTexture_KHR_texture_transform_rotation,
        uniforms.occlusionTexture_KHR_texture_transform_scale
    );

    let metallicRoughnessUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.metallicRoughnessTexture_texCoord_index,
        uniforms.use_metallicRoughnessTexture_KHR_texture_transform,
        uniforms.metallicRoughnessTexture_KHR_texture_transform_offset,
        uniforms.metallicRoughnessTexture_KHR_texture_transform_rotation,
        uniforms.metallicRoughnessTexture_KHR_texture_transform_scale
    );

    let normalUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.normalTexture_texCoord_index,
        uniforms.use_normalTexture_KHR_texture_transform,
        uniforms.normalTexture_KHR_texture_transform_offset,
        uniforms.normalTexture_KHR_texture_transform_rotation,
        uniforms.normalTexture_KHR_texture_transform_scale
    );

    // 클리어코트 텍스처 UV 좌표
    let KHR_clearcoatUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.KHR_clearcoatTexture_texCoord_index,
        uniforms.use_KHR_clearcoatTexture_KHR_texture_transform,
        uniforms.KHR_clearcoatTexture_KHR_texture_transform_offset,
        uniforms.KHR_clearcoatTexture_KHR_texture_transform_rotation,
        uniforms.KHR_clearcoatTexture_KHR_texture_transform_scale
    );

    let KHR_clearcoatNormalUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.KHR_clearcoatNormalTexture_texCoord_index,
        uniforms.use_KHR_clearcoatNormalTexture_KHR_texture_transform,
        uniforms.KHR_clearcoatNormalTexture_KHR_texture_transform_offset,
        uniforms.KHR_clearcoatNormalTexture_KHR_texture_transform_rotation,
        uniforms.KHR_clearcoatNormalTexture_KHR_texture_transform_scale
    );

    let KHR_clearcoatRoughnessUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.KHR_clearcoatRoughnessTexture_texCoord_index,
        uniforms.use_KHR_clearcoatRoughnessTexture_KHR_texture_transform,
        uniforms.KHR_clearcoatRoughnessTexture_KHR_texture_transform_offset,
        uniforms.KHR_clearcoatRoughnessTexture_KHR_texture_transform_rotation,
        uniforms.KHR_clearcoatRoughnessTexture_KHR_texture_transform_scale
    );

    // 광택 텍스처 UV 좌표
    let KHR_sheenColorUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.KHR_sheenColorTexture_texCoord_index,
        uniforms.use_KHR_sheenColorTexture_KHR_texture_transform,
        uniforms.KHR_sheenColorTexture_KHR_texture_transform_offset,
        uniforms.KHR_sheenColorTexture_KHR_texture_transform_rotation,
        uniforms.KHR_sheenColorTexture_KHR_texture_transform_scale
    );

    let KHR_sheenRoughnessUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.KHR_sheenRoughnessTexture_texCoord_index,
        uniforms.use_KHR_sheenRoughnessTexture_KHR_texture_transform,
        uniforms.KHR_sheenRoughnessTexture_KHR_texture_transform_offset,
        uniforms.KHR_sheenRoughnessTexture_KHR_texture_transform_rotation,
        uniforms.KHR_sheenRoughnessTexture_KHR_texture_transform_scale
    );

    // 스페큘러 텍스처 UV 좌표
    let KHR_specularTextureUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.KHR_specularTexture_texCoord_index,
        uniforms.use_KHR_specularTexture_KHR_texture_transform,
        uniforms.KHR_specularTexture_KHR_texture_transform_offset,
        uniforms.KHR_specularTexture_KHR_texture_transform_rotation,
        uniforms.KHR_specularTexture_KHR_texture_transform_scale
    );

    let KHR_specularColorTextureUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.KHR_specularColorTexture_texCoord_index,
        uniforms.use_KHR_specularColorTexture_KHR_texture_transform,
        uniforms.KHR_specularColorTexture_KHR_texture_transform_offset,
        uniforms.KHR_specularColorTexture_KHR_texture_transform_rotation,
        uniforms.KHR_specularColorTexture_KHR_texture_transform_scale
    );

    // 무지개빛 텍스처 UV 좌표
    let KHR_iridescenceTextureUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.KHR_iridescenceTexture_texCoord_index,
        uniforms.use_KHR_iridescenceTexture_KHR_texture_transform,
        uniforms.KHR_iridescenceTexture_KHR_texture_transform_offset,
        uniforms.KHR_iridescenceTexture_KHR_texture_transform_rotation,
        uniforms.KHR_iridescenceTexture_KHR_texture_transform_scale
    );

    let KHR_iridescenceThicknessTextureUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.KHR_iridescenceThicknessTexture_texCoord_index,
        uniforms.use_KHR_iridescenceThicknessTexture_KHR_texture_transform,
        uniforms.KHR_iridescenceThicknessTexture_KHR_texture_transform_offset,
        uniforms.KHR_iridescenceThicknessTexture_KHR_texture_transform_rotation,
        uniforms.KHR_iridescenceThicknessTexture_KHR_texture_transform_scale
    );

    // 투과 텍스처 UV 좌표
    let KHR_transmissionUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.KHR_transmissionTexture_texCoord_index,
        uniforms.use_KHR_transmissionTexture_KHR_texture_transform,
        uniforms.KHR_transmissionTexture_KHR_texture_transform_offset,
        uniforms.KHR_transmissionTexture_KHR_texture_transform_rotation,
        uniforms.KHR_transmissionTexture_KHR_texture_transform_scale
    );

    let KHR_diffuseTransmissionUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.KHR_diffuseTransmissionTexture_texCoord_index,
        uniforms.use_KHR_diffuseTransmissionTexture_KHR_texture_transform,
        uniforms.KHR_diffuseTransmissionTexture_KHR_texture_transform_offset,
        uniforms.KHR_diffuseTransmissionTexture_KHR_texture_transform_rotation,
        uniforms.KHR_diffuseTransmissionTexture_KHR_texture_transform_scale
    );

    let KHR_diffuseTransmissionColorUV = get_transformed_uv(
        input_uv, input_uv1,
        uniforms.KHR_diffuseTransmissionColorTexture_texCoord_index,
        uniforms.use_KHR_diffuseTransmissionColorTexture_KHR_texture_transform,
        uniforms.KHR_diffuseTransmissionColorTexture_KHR_texture_transform_offset,
        uniforms.KHR_diffuseTransmissionColorTexture_KHR_texture_transform_rotation,
        uniforms.KHR_diffuseTransmissionColorTexture_KHR_texture_transform_scale
    );

    let KHR_anisotropyUV = get_transformed_uv(
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
        var fdx:vec3<f32> = dpdx(input_vertexPosition);
        var fdy:vec3<f32> = dpdy(input_vertexPosition);
        var faceNormal:vec3<f32> = normalize(cross(fdy,fdx));
        if (dot(N, faceNormal) < 0.0) {
            N = -N;
            backFaceYn = true;
        };
    #redgpu_endIf
    N = N * u_normalScale;

    #redgpu_if normalTexture
    {
        var targetUv = select(normalUV, 1.0 - normalUV, backFaceYn);
        let normalSamplerColor = textureSample(normalTexture, normalTextureSampler, normalUV).rgb;
        N = perturb_normal(
            N,
            input_vertexPosition,
            targetUv,
            vec3<f32>(normalSamplerColor.r, 1.0 - normalSamplerColor.g, normalSamplerColor.b),
            u_normalScale
        ) ;
        N = select(N, select(N, -N, backFaceYn), u_useVertexTangent);
    }
    #redgpu_endIf
    /////////////////////////////////////////////////////////////////////////////////
    // view direction vector
    let V: vec3<f32> = normalize(u_cameraPosition - input_vertexPosition);
    let NdotV = max(dot(N, V), 0.04);
    let VdotN = max(dot(V, N), 0.0);
    /////////////////////////////////////////////////////////////////////////////////

    var visibility:f32 = 1.0;
    visibility = calcDirectionalShadowVisibility(
                directionalShadowMap,
                directionalShadowMapSampler,
                u_shadowDepthTextureSize,
                u_bias,
                inputData.shadowPos
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
    // Multiply vertex color if vertex colors are enabled
    baseColor *= select(vec4<f32>(1.0), input_vertexColor_0, u_useVertexColor);
    // baseColorTexture

    #redgpu_if baseColorTexture
       let diffuseSampleColor =  (textureSample(baseColorTexture, baseColorTextureSampler, diffuseUV));
       baseColor *= diffuseSampleColor;
       resultAlpha *= diffuseSampleColor.a;
    #redgpu_endIf

    let albedo:vec3<f32> = baseColor.rgb ;

    // ---------- KHR_materials_unlit ----------
    if(u_useKHR_materials_unlit){
        return baseColor;
    }

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
            clearcoatNormal = perturb_normal(
                N,
                input_vertexPosition,
                targetUv,
                clearcoatNormal,
                u_normalScale
            ) ;
            if(u_useVertexTangent){
                if(backFaceYn ){ clearcoatNormal = -clearcoatNormal; }
            }
            clearcoatNormal = normalize(clearcoatNormal);
        }
        #redgpu_endIf
    }

    // ---------- KHR_materials_specular ----------
    var specularParameter = u_KHR_specularFactor;
    var specularColor = u_KHR_specularColorFactor;
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

    // ---------- KHR_materials_transmission ----------
    var transmissionParameter: f32 = u_KHR_transmissionFactor;
    #redgpu_if useKHR_transmissionTexture
      let transmissionSample: vec4<f32> = textureSample(
          packedKHR_clearcoatTexture_transmission,
          packedTextureSampler,
          KHR_transmissionUV
      );
      transmissionParameter *= transmissionSample.b;
    #redgpu_endIf

    // ---------- KHR_materials_volume ----------
    var thicknessParameter: f32 = u_KHR_thicknessFactor;
    #redgpu_if useKHR_thicknessTexture
        let thicknessSample: vec4<f32> = textureSample(
            packedKHR_clearcoatTexture_transmission,
            packedTextureSampler,
            KHR_transmissionUV
        );
        thicknessParameter *= thicknessSample.a;
    #redgpu_endIf

    // ---------- KHR_materials_diffuse_transmission ----------
    var diffuseTransmissionColor:vec3<f32> = u_KHR_diffuseTransmissionColorFactor;
    var diffuseTransmissionParameter : f32 = u_KHR_diffuseTransmissionFactor;
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

    // ---------- KHR_materials_sheen ----------
    var sheenColor = u_KHR_sheenColorFactor;
    var sheenRoughnessParameter = u_KHR_sheenRoughnessFactor;
    #redgpu_if useKHR_sheenColorTexture
        let sheenColorSample = (textureSample(packedKHR_sheen, packedTextureSampler, KHR_sheenColorUV));
        sheenColor *= sheenColorSample.rgb;
    #redgpu_endIf
    #redgpu_if useKHR_sheenRoughnessTexture
        let sheenRoughnessSample = (textureSample(packedKHR_sheen, packedTextureSampler, KHR_sheenRoughnessUV));
        sheenRoughnessParameter *= sheenRoughnessSample.a;
    #redgpu_endIf

    // ---------- KHR_materials_iridescence ----------
    var iridescenceParameter = u_KHR_iridescenceFactor;
    var iridescenceThickness = u_KHR_iridescenceThicknessMaximum;
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

    // ---------- KHR_materials_anisotropy ----------
    var anisotropy: f32 = u_KHR_anisotropyStrength;
    var anisotropicT: vec3<f32> = vec3<f32>(1.0);
    var anisotropicB: vec3<f32>= vec3<f32>(1.0);
    #redgpu_if useKHR_materials_anisotropy
    {
        var anisotropicDirection: vec2<f32> = vec2<f32>(1.0,0.0);
        if(u_useKHR_anisotropyTexture){
            let anisotropyTex = textureSample(KHR_anisotropyTexture, baseColorTextureSampler, KHR_anisotropyUV).rgb;
            anisotropicDirection = anisotropyTex.rg * 2.0 - vec2<f32>(1.0, 1.0);
            var anisotropyRotation: vec2<f32>;
            if( u_KHR_anisotropyRotation < 0.0001 ){ anisotropyRotation = vec2<f32>(1.0,0.0); }
            else{ anisotropyRotation = vec2<f32>( cos(u_KHR_anisotropyRotation), sin(u_KHR_anisotropyRotation) ); }

            let rotationMtx: mat2x2<f32> = mat2x2<f32>(
              anisotropyRotation.x, anisotropyRotation.y,
              -anisotropyRotation.y, anisotropyRotation.x
            );

            anisotropicDirection = rotationMtx * normalize(anisotropicDirection);
            anisotropy *= anisotropyTex.b;
        }
        var T: vec3<f32>;
        var B: vec3<f32>;
        if (u_useVertexTangent) {
            if (length(input_vertexTangent.xyz) > 0.0) {
                T = normalize(input_vertexTangent.xyz);
                B = normalize(cross(T, N) * input_vertexTangent.w);
            } else {
                T = vec3<f32>(1.0, 0.0, 0.0);
                B = normalize(cross(T, N) * 1.0); // 또는 -1.0
            }
        } else {
            T = vec3<f32>(1.0, 0.0, 0.0);
            B = normalize(cross(T, N) * 1.0); // 또는 -1.0
        }
        // direction.xy를 이용하여 올바르게 tangent 공간에서 벡터를 혼합
        let TBN: mat3x3<f32> = mat3x3<f32>(T, B, N);
        anisotropicT = normalize(TBN * vec3<f32>(anisotropicDirection, 0.0));
        anisotropicB = normalize(cross(N, anisotropicT));
    }
    #redgpu_endIf

    // ---------- 2패스일경우 배경 샘플링 ----------
    var prePathBackground = vec3<f32>(0.0);
    #redgpu_if useKHR_materials_transmission
        prePathBackground = calcPrePathBackground(
            u_useKHR_materials_volume, thicknessParameter * inputData.volumeScale , u_KHR_dispersion, u_KHR_attenuationDistance , u_KHR_attenuationColor,
            ior, roughnessParameter, albedo,
            systemUniforms.projectionCameraMatrix, input_vertexPosition, input_ndcPosition,
            V, N,
            renderPath1ResultTexture, renderPath1ResultTextureSampler
        );
    #redgpu_endIf
    // ---------- 기본 F0 계산 ----------
    let F0_dielectric: vec3<f32> =  vec3(pow((1.0 - ior) / (1.0 + ior), 2.0)) ; // 유전체 반사율
    let F0_metal = baseColor.rgb; // 금속 반사율
    var F0 = mix(F0_dielectric, F0_metal, metallicParameter); // 기본 반사율
    #redgpu_if useKHR_materials_iridescence
        if (iridescenceParameter > 0.0) {
            F0 = iridescent_fresnel(1.0, u_KHR_iridescenceIor, F0, iridescenceThickness, iridescenceParameter, NdotV);
        }
    #redgpu_endIf


    // ---------- 직접 조명 계산 - directional ----------
    var totalDirectLighting = vec3<f32>(0.0);
    for (var i = 0u; i < u_directionalLightCount; i++) {
        totalDirectLighting += calcLight(
            u_directionalLights[i].color, u_directionalLights[i].intensity * visibility,
            N, V, -normalize(u_directionalLights[i].direction),
            VdotN,
            roughnessParameter, metallicParameter, albedo,
            F0, ior,
            prePathBackground,
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

            let lightDistance = length(u_clusterLightPosition - input_vertexPosition);


            if (lightDistance > u_clusterLightRadius) {
                continue;
            }

            let lightDir = normalize(u_clusterLightPosition - input_vertexPosition);
            let attenuation = clamp(1.0 - (lightDistance * lightDistance) / (u_clusterLightRadius * u_clusterLightRadius), 0.0, 1.0);
//            let attenuation = clamp(0.0, 1.0, 1.0 - (lightDistance * lightDistance) / (u_clusterLightRadius * u_clusterLightRadius));

            var finalAttenuation = attenuation;

            // 스폿라이트 처리
            if (u_isSpotLight > 0.0) {
                let u_clusterLightDirection = normalize(vec3<f32>(
                    targetLight.directionX,
                    targetLight.directionY,
                    targetLight.directionZ
                ));
                let u_clusterLightInnerAngle = targetLight.innerCutoff;
                let u_clusterLightOuterCutoff = targetLight.outerCutoff;

                // 라이트에서 버텍스로의 방향
                let lightToVertex = normalize(-lightDir);
                let cosTheta = dot(lightToVertex, u_clusterLightDirection);

                let cosOuter = cos(radians(u_clusterLightOuterCutoff));
                let cosInner = cos(radians(u_clusterLightInnerAngle));

                // 스폿라이트 외곽 범위를 벗어나면 스킵
                if (cosTheta < cosOuter) {
                    continue;
                }

                // 스폿라이트 강도 계산 (부드러운 페이드)
                let epsilon = cosInner - cosOuter;
                let spotIntensity = clamp((cosTheta - cosOuter) / epsilon, 0.0, 1.0);

                finalAttenuation *= spotIntensity;
            }

            // calcLight 함수 호출
            totalDirectLighting += calcLight(
                targetLight.color, targetLight.intensity * finalAttenuation,
                N, V, lightDir,
                VdotN,
                roughnessParameter, metallicParameter, albedo,
                F0, ior,
                prePathBackground,
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
    if (u_useIblTexture) {
        let R = normalize(reflect(-V, N));
        let NdotV = max(dot(N, V),0.04);
        let NdotV_fresnel = max(dot(N, V), 0.04);

        // ---------- ibl 프레넬 항 계산----------
        let F_IBL_dielectric = F0_dielectric + (vec3<f32>(1.0) - F0_dielectric) * pow(1.0 - NdotV_fresnel, 5.0); // 유전체
        let F_IBL_metal = F0_metal + (vec3<f32>(1.0) - F0_metal) * pow(1.0 - NdotV_fresnel, 5.0); // 금속
        var F_IBL = F0 + (vec3<f32>(1.0) - F0) * pow(1.0 - NdotV_fresnel, 5.0);
        var F_metal_iridescent = vec3<f32>(1.0);

        #redgpu_if useKHR_materials_iridescence
             if (iridescenceParameter > 0.0) {
                 // 베이스 F0 미리 계산 (한 번만)
                 let base_f0 = mix(F0_dielectric, baseColor.rgb, metallicParameter);

                 // 이리데센스 효과 계산 (한 번만)
                 let iridescence_effect = iridescent_fresnel(
                     1.0,                      // 외부 매질 IOR (공기)
                     u_KHR_iridescenceIor,     // 이리데센스 막의 IOR
                     base_f0,                  // 혼합된 기본 F0
                     iridescenceThickness,     // 이리데센스 막 두께
                     iridescenceParameter,     // 이리데센스 강도
                     NdotV                     // 시야각 코사인
                 );

                 F_IBL = iridescence_effect;
             }
         #redgpu_endIf

        let K = (roughnessParameter + 1.0) * (roughnessParameter + 1.0) / 8.0;
        let G = NdotV / (NdotV * (1.0 - K) + K);
        let a2 = roughnessParameter * roughnessParameter;
        let G_smith = NdotV / (NdotV * (1.0 - a2) + a2);
        // ---------- ibl (roughness에 따른 mipmap 레벨 사용) ----------
        let iblMipmapCount:f32 = f32(textureNumLevels(ibl_environmentTexture) - 1);
//        let mipLevel = roughnessParameter * iblMipmapCount;
//        let mipLevel = roughnessParameter * sqrt(roughnessParameter) * iblMipmapCount;
//        let mipLevel = max(0.0, (roughnessParameter * roughnessParameter) * iblMipmapCount);
//        let mipLevel = pow(roughnessParameter,0.5) * iblMipmapCount;
        let mipLevel = pow(roughnessParameter,0.4) * iblMipmapCount;
//        let mipLevel = (roughnessParameter * roughnessParameter) * iblMipmapCount;


        // ---------- ibl 기본 컬러 ----------
        var reflectedColor = textureSampleLevel(ibl_environmentTexture, iblTextureSampler, R, mipLevel).rgb;

        // ---------- ibl Diffuse  ----------
        let effectiveTransmission = transmissionParameter * (1.0 - metallicParameter);
        let iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, iblTextureSampler, N,0).rgb;
        var envIBL_DIFFUSE:vec3<f32> = albedo * iblDiffuseColor * (vec3<f32>(1.0) - F_IBL_dielectric);

        // ---------- ibl Diffuse Transmission ----------
        if (u_useKHR_materials_diffuse_transmission && diffuseTransmissionParameter > 0.0) {
            // 후면 산란을 위한 샘플링 방향 (back side)
            var backScatteringColor = textureSampleLevel(ibl_environmentTexture, iblTextureSampler, -N, mipLevel).rgb;
            let transmittedIBL = backScatteringColor * diffuseTransmissionColor * (vec3<f32>(1.0) - F_IBL);
            // 반사와 투과 효과 혼합
            envIBL_DIFFUSE = mix(envIBL_DIFFUSE, transmittedIBL, diffuseTransmissionParameter);
        }

        // ---------- ibl Specular ----------
        var envIBL_SPECULAR:vec3<f32>;
        let specularColorCorrected = max(vec3<f32>(0.16), specularColor);
        envIBL_SPECULAR = reflectedColor * G_smith * specularColorCorrected * F_IBL * specularParameter ;
        #redgpu_if useKHR_materials_anisotropy
        {
            var bentNormal = cross(anisotropicB, V);
            bentNormal = normalize(cross(bentNormal, anisotropicB));
            let temp = 1.0 - anisotropy * (1.0 - roughnessParameter);
            let tempSquared = temp * temp;
            var a = tempSquared * tempSquared;
            bentNormal = normalize(mix(bentNormal, N, a));
            var reflectVec = reflect(-V, bentNormal);
            reflectVec = normalize(mix(reflectVec, bentNormal, roughnessParameter * roughnessParameter));

            let roughnessT = roughnessParameter * (1.0 + anisotropy);
            let roughnessB = roughnessParameter * (1.0 - anisotropy);

            let TdotR = dot(anisotropicT, reflectVec);
            let BdotR = dot(anisotropicB, reflectVec);

            let TdotV = dot(anisotropicT, V);
            let BdotV = dot(anisotropicB, V);

            let anisotropicR = normalize(reflectVec - anisotropy * (TdotR * anisotropicT - BdotR * anisotropicB));

            let VdotN = max(0.04, dot(V, N));
            let oneMinusVdotN = 1.0 - VdotN;
            let directionFactor = oneMinusVdotN * oneMinusVdotN * oneMinusVdotN;

            let VdotT_abs = abs(TdotV);
            let VdotB_abs = abs(BdotV);
            let totalWeight = max(0.0001, VdotT_abs + VdotB_abs);

            let weightedRoughness = (roughnessT * VdotT_abs + roughnessB * VdotB_abs) / totalWeight;

            let anisotropyFactor = max(0.0, min(1.0, anisotropy));
            let finalRoughness = mix( roughnessParameter, weightedRoughness, anisotropyFactor * directionFactor );
            let anistropyMipmap = pow(finalRoughness, 0.4) * iblMipmapCount;
            reflectedColor = textureSampleLevel( ibl_environmentTexture, iblTextureSampler, anisotropicR, anistropyMipmap ).rgb;

            let a2 = finalRoughness * finalRoughness;
            let G_smith = NdotV / (NdotV * (1.0 - a2) + a2);
            envIBL_SPECULAR = reflectedColor * G_smith * specularColorCorrected * F_IBL * specularParameter;
        }
        #redgpu_endIf

        // ---------- ibl Specular BTDF ----------
        var envIBL_SPECULAR_BTDF = vec3<f32>(0.0);
        #redgpu_if useKHR_materials_transmission
            var refractedDir: vec3<f32>;
            let eta = 1.0 / ior;
            if (abs(ior - 1.0) < 0.0001) { refractedDir = V; }
            else { refractedDir = refract(-V, -N, eta); }

            if(length(refractedDir) > 0.0001) {
                let NdotT = abs(dot(N, normalize(refractedDir)));
                let F_transmission = vec3<f32>(1.0) - F_IBL_dielectric;

                var attenuatedBackground = prePathBackground;
                 if (u_useKHR_materials_volume) {
                     let localNodeScale = inputData.localNodeScale;
                     let volumeScale = inputData.volumeScale;

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

                envIBL_SPECULAR_BTDF = attenuatedBackground * F_transmission * transmissionParameter + reflectedColor * G_smith * F_IBL * NdotT;
            }
        #redgpu_endIf

        // ---------- ibl 유전체 합성 ----------
//        let envIBL_DIELECTRIC = mix(envIBL_SPECULAR_BTDF ,envIBL_DIFFUSE, 1-transmissionParameter) + envIBL_SPECULAR;
        let envIBL_DIELECTRIC = envIBL_DIFFUSE * (1.0-transmissionParameter) + envIBL_SPECULAR_BTDF + envIBL_SPECULAR;

        // ---------- ibl Sheen 계산 ----------
        var envIBL_SHEEN = vec3<f32>(0.0);
        var sheen_albedo_scaling: f32 = 1.0;
        let maxSheenColor = max(sheenColor.x, max(sheenColor.y, sheenColor.z));
        #redgpu_if useKHR_materials_sheen
            let sheenResult = calcIBLSheen(
                N,
                V,
                sheenColor,
                maxSheenColor,
                sheenRoughnessParameter,
                iblMipmapCount
            );
            envIBL_SHEEN = sheenResult.envIBL_SHEEN;
            sheen_albedo_scaling = sheenResult.sheen_albedo_scaling;
        #redgpu_endIf

        // ---------- ibl Metal 계산 ----------
        let envIBL_METAL = select(reflectedColor * max(baseColor.rgb,vec3<f32>(0.04)), reflectedColor * F_IBL, iridescenceParameter>0.0);
//        let envIBL_METAL = select(reflectedColor * baseColor.rgb, reflectedColor * F_IBL, iridescenceParameter>0.0);
//        let envIBL_METAL = reflectedColor * F0 * F_IBL ;
        // ---------- ibl 기본 혼합 ----------
        let metallicPart = envIBL_METAL * metallicParameter * sheen_albedo_scaling; // 금속 파트 계산
        let dielectricPart = envIBL_DIELECTRIC * (1.0 - metallicParameter) ; // 유전체 파트 계산
        var indirectLighting = metallicPart + dielectricPart + envIBL_SHEEN; // sheen 파트 포함

        // ---------- ibl clearcoat 계산 ----------
        #redgpu_if useKHR_materials_clearcoat
            if (clearcoatParameter > 0.0) {
                 // 클리어코트 반사 벡터와 뷰 각도 계산
                 let clearcoatR = reflect(-V, clearcoatNormal);
                 let clearcoatNdotV = max(dot(clearcoatNormal, V), 0.04);
                 let clearcoatMipLevel = pow(clearcoatRoughnessParameter,0.4) * iblMipmapCount;
                 let clearcoatPrefilteredColor = textureSampleLevel(ibl_environmentTexture, iblTextureSampler, clearcoatR, clearcoatMipLevel).rgb;
                 let clearcoatF0 = F0;
                 let clearcoatF = clearcoatF0 + (vec3<f32>(1.0) - clearcoatF0) * pow(1.0 - clearcoatNdotV, 5.0);
                 let clearcoatK = (clearcoatRoughnessParameter + 1.0) * (clearcoatRoughnessParameter + 1.0) / 8.0;
                 let clearcoatG = clearcoatNdotV / (clearcoatNdotV * (1.0 - clearcoatK) + clearcoatK);
                 let clearcoatBRDF = clearcoatF * clearcoatG;
                 let clearcoatSpecularIBL = clearcoatPrefilteredColor * clearcoatBRDF * clearcoatParameter;
                 let clearcoatFresnel = clearcoatF ;
                 indirectLighting = clearcoatSpecularIBL  + (vec3<f32>(1.0) - clearcoatFresnel) * indirectLighting;
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

    // ---------- srgb로 변환해주어야함 ----------
    finalColor = linear_to_srgb(finalColor);

    // ---------- 컷오프 판단 ----------
    #redgpu_if useCutOff
        if (resultAlpha <= u_cutOff) { discard; }
    #redgpu_endIf

    return finalColor;
};
// ---------- KHR_materials_anisotropy ----------

// ---------- KHR_materials_sheen ----------
struct SheenResult {
    envIBL_SHEEN: vec3<f32>,
    sheen_albedo_scaling: f32
}

fn calcIBLSheen(
    N:vec3<f32>,
    V:vec3<f32>,
    sheenColor:vec3<f32>,
    maxSheenColor:f32,
    sheenRoughnessParameter:f32,
    iblMipmapCount:f32
) -> SheenResult {
    let NdotV = max(dot(N, V), 0.0001);
    let sheenRoughnessAlpha = sheenRoughnessParameter * sheenRoughnessParameter;
    let R = reflect(-V, N);
    let sheenLobe = sheenRoughnessParameter * sheenRoughnessParameter; // GGX 기반 분포
    let sheenSamplingDir = normalize(mix(R, N, sheenLobe));

    var sheenMipLevel = log2(sheenRoughnessParameter) * 1.2 + iblMipmapCount - 1.0;
    sheenMipLevel = clamp(sheenMipLevel, 0.0, iblMipmapCount - 1.0);
    let sheenRadiance = textureSampleLevel(ibl_environmentTexture, iblTextureSampler, sheenSamplingDir, sheenMipLevel).rgb;

    let F0 = 0.04;
    let sheenFresnel = F0 + (1.0 - F0) * pow(1.0 - NdotV, 5.0);

    let E_VdotN = 1.0 - pow(1.0 - NdotV, 5.0);
    let sheen_albedo_scaling = max(1.0 - maxSheenColor * E_VdotN, 0.04);
    let envIBL_SHEEN = sheenColor * sheenFresnel;

    return SheenResult(envIBL_SHEEN, sheen_albedo_scaling);
}
// ---------------------------------------------
fn calcPrePathBackground(
    u_useKHR_materials_volume:bool, thicknessParameter:f32, u_KHR_dispersion:f32, u_KHR_attenuationDistance:f32, u_KHR_attenuationColor:vec3<f32>,
    ior:f32, roughnessParameter:f32, albedo:vec3<f32>,
    projectionCameraMatrix:mat4x4<f32>, input_vertexPosition:vec3<f32>, input_ndcPosition:vec3<f32>,
    V:vec3<f32>, N:vec3<f32>,
    renderPath1ResultTexture:texture_2d<f32>, renderPath1ResultTextureSampler:sampler
) -> vec3<f32> {
    var prePathBackground = vec3<f32>(0.0);
    let transmissionMipLevel: f32 = roughnessParameter * f32(textureNumLevels(renderPath1ResultTexture) - 1);
//    let transmissionMipLevel: f32 = pow(roughnessParameter,0.4) * f32(textureNumLevels(renderPath1ResultTexture) - 1);
    if(u_useKHR_materials_volume){
        var iorR: f32 = ior;
        var iorG: f32 = ior;
        var iorB: f32 = ior;
        if(u_KHR_dispersion>0.0){
            let halfSpread: f32 = (ior - 1.0) * 0.025 * u_KHR_dispersion;
            iorR = ior + halfSpread;
            iorG = ior;
            iorB = ior - halfSpread;
        }
        let refractedVecR: vec3<f32> = refract(-V, N, 1.0 / iorR);
        let refractedVecG: vec3<f32> = refract(-V, N, 1.0 / iorG);
        let refractedVecB: vec3<f32> = refract(-V, N, 1.0 / iorB);

        // 각각의 굴절 벡터로 세계 좌표의 굴절 위치 계산 후 UV 좌표 계산
        let worldPosR: vec3<f32> = input_vertexPosition + refractedVecR * thicknessParameter;
        let worldPosG: vec3<f32> = input_vertexPosition + refractedVecG * thicknessParameter;
        let worldPosB: vec3<f32> = input_vertexPosition + refractedVecB * thicknessParameter;

        // 월드→뷰→프로젝션 변환 적용하여 최종 UV 좌표 계산
        let clipPosR: vec4<f32> = projectionCameraMatrix * vec4<f32>(worldPosR, 1.0);
        let clipPosG: vec4<f32> = projectionCameraMatrix * vec4<f32>(worldPosG, 1.0);
        let clipPosB: vec4<f32> = projectionCameraMatrix * vec4<f32>(worldPosB, 1.0);

        let ndcR: vec2<f32> = clipPosR.xy / clipPosR.w * 0.5 + 0.5;
        let ndcG: vec2<f32> = clipPosG.xy / clipPosG.w * 0.5 + 0.5;
        let ndcB: vec2<f32> = clipPosB.xy / clipPosB.w * 0.5 + 0.5;

        // Y축 좌표 변환 적용
        let finalUV_R: vec2<f32> = vec2<f32>(ndcR.x, 1.0 - ndcR.y);
        let finalUV_G: vec2<f32> = vec2<f32>(ndcG.x, 1.0 - ndcG.y);
        let finalUV_B: vec2<f32> = vec2<f32>(ndcB.x, 1.0 - ndcB.y);

        // RGB 픽셀 샘플링
        prePathBackground.r = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_R, transmissionMipLevel).r;
        prePathBackground.g = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_G, transmissionMipLevel).g;
        prePathBackground.b = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_B, transmissionMipLevel).b;

    } else {
        let refractedVec: vec3<f32> = refract(-V, N, 1.0 / ior);
        let worldPos: vec3<f32> = input_vertexPosition + refractedVec * thicknessParameter;
        let clipPos: vec4<f32> = projectionCameraMatrix * vec4<f32>(worldPos, 1.0);
        let ndc: vec2<f32> = clipPos.xy / clipPos.w * 0.5 + 0.5;
        let finalUV: vec2<f32> = vec2<f32>(ndc.x, 1.0 - ndc.y);
        prePathBackground = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV, transmissionMipLevel).rgb;
    }
    // 투과 색상에 알베도 적용
    prePathBackground *= albedo ;
    return prePathBackground;
}
fn calcLight(
    lightColor:vec3<f32>, lightIntensity:f32,
    N:vec3<f32>, V:vec3<f32>, L:vec3<f32>,
    VdotN:f32,
    roughnessParameter:f32, metallicParameter:f32, albedo:vec3<f32>,
    F0:vec3<f32>, ior:f32,

    prePathBackground:vec3<f32>,
    specularColor:vec3<f32>, specularParameter:f32,
    u_useKHR_materials_diffuse_transmission:bool, diffuseTransmissionParameter:f32, diffuseTransmissionColor:vec3<f32>,
    transmissionParameter:f32,
    sheenColor:vec3<f32>, sheenRoughnessParameter:f32,
    anisotropy:f32, anisotropicT:vec3<f32>, anisotropicB:vec3<f32>,
    clearcoatParameter:f32, clearcoatRoughnessParameter:f32, clearcoatNormal:vec3<f32>
) -> vec3<f32>{
    let dLight = lightColor * lightIntensity ;

    let NdotL = max(dot(N, L), 0.04);
    let NdotV = max(dot(N, V), 0.04);
    let H = normalize(L + V);
    let LdotH = max(dot(L, H), 0.0);
    let NdotH = max(dot(N, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);


    var DIFFUSE_BRDF:vec3<f32> = diffuse_brdf_disney(NdotL, NdotV, LdotH, roughnessParameter, albedo);
    if(u_useKHR_materials_diffuse_transmission && diffuseTransmissionParameter > 0.0){
        DIFFUSE_BRDF = mix(DIFFUSE_BRDF, diffuse_btdf(N, L, diffuseTransmissionColor), diffuseTransmissionParameter);
    }

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
        SPECULAR_BRDF = specular_brdf( albedo, roughnessParameter, NdotH, NdotV, NdotL, LdotH);
    }

    let METAL_BRDF = conductor_fresnel( albedo, SPECULAR_BRDF, VdotH);;

    var SPECULAR_BTDF =  vec3<f32>(0.0);
    #redgpu_if useKHR_materials_transmission
        if(transmissionParameter > 0.0){
            SPECULAR_BTDF = specular_btdf( NdotV, NdotL, NdotH, VdotH, LdotH, roughnessParameter, albedo, ior);
        }
    #redgpu_endIf

    let DIELECTRIC_BRDF = fresnel_mix(
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
            let sheenDistribution = (2 + invR) * pow(sin2h, invR * 0.5) / (2 * pi);
            let sheen_visibility =  1.0 / ((1.0 + lambda_sheen(NdotV, sheenRoughnessAlpha) + lambda_sheen(NdotL, sheenRoughnessAlpha)) * (4.0 * NdotV * NdotL));
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
            directLighting = mix(directLighting, prePathBackground , transmissionWeight);
        }
    #redgpu_endIf

    #redgpu_if useKHR_materials_clearcoat
        if(clearcoatParameter > 0.0){
            let clearcoatNdotL = max(dot(clearcoatNormal, L), 0.04);
            let clearcoatNdotV = max(dot(clearcoatNormal, V), 0.04);
            let clearcoatNdotH = max(dot(clearcoatNormal, H), 0.0);
            let CLEARCOAT_BRDF = specular_brdf( F0, clearcoatRoughnessParameter, clearcoatNdotH, clearcoatNdotV, clearcoatNdotL, LdotH);
            directLighting = fresnel_coat(clearcoatNdotV, ior, clearcoatParameter, directLighting, CLEARCOAT_BRDF);
        }
    #redgpu_endIf

    var lightDirection: f32;
    if (u_useKHR_materials_diffuse_transmission && diffuseTransmissionParameter > 0.0) {
        lightDirection = mix(abs(dot(N, L)), 1.0, diffuseTransmissionParameter);
    } else {
        // 투과가 없는 경우, 기존처럼 양수 값만 허용
        lightDirection = NdotL;
    }

    let lightContribution = directLighting * dLight * lightDirection;
    return lightContribution;
}
const pi: f32 = 3.14159265359;
fn BRDF_specularAnisotropicGGX( f0: vec3<f32>, f90: vec3<f32>, alphaRoughness: f32, VdotH: f32, NdotL: f32, NdotV: f32, NdotH: f32, BdotV: f32, TdotV: f32, TdotL: f32, BdotL: f32, TdotH: f32, BdotH: f32, anisotropy: f32 ) -> vec3<f32> {
    var at = mix(alphaRoughness, 1.0, anisotropy * anisotropy);
    var ab = alphaRoughness;
    var F:vec3<f32> = fresnel_schlick(VdotH,f0);
    var V:f32 = V_GGX_anisotropic(NdotL, NdotV, BdotV, TdotV, TdotL, BdotL, at, ab);
    var D:f32 = D_GGX_anisotropic(NdotH, TdotH, BdotH, at, ab);
    return F * (V * D);
}
fn D_GGX_anisotropic( NdotH: f32, TdotH: f32, BdotH: f32, at: f32, ab: f32 ) -> f32 {
    let a2: f32 = at * ab;
    let f: vec3<f32> = vec3<f32>(ab * TdotH, at * BdotH, a2 * NdotH);
    let denominator: f32 = dot(f, f);
//    if (denominator < 0.0001) {
//     return 0.0;
//    }
    let w2: f32 = a2 / denominator;
    return a2 * w2 * w2 / pi;
}
fn V_GGX_anisotropic( NdotL: f32, NdotV: f32, BdotV: f32, TdotV: f32, TdotL: f32, BdotL: f32, at: f32, ab: f32 ) -> f32 {
   let GGXV = NdotL * length(vec3<f32>(at * TdotV, ab * BdotV, NdotV));
   let GGXL = NdotV * length(vec3<f32>(at * TdotL, ab * BdotL, NdotL));
   let v = 0.5 / (GGXV + GGXL);
   return clamp(v, 0.0, 1.0);
}
fn iridescent_fresnel(outside_ior: f32, iridescence_ior: f32, base_f0: vec3<f32>,
                      iridescence_thickness: f32, iridescence_factor: f32, cos_theta1: f32) -> vec3<f32> {
    // 조기 반환
    if (iridescence_thickness <= 0.0 || iridescence_factor <= 0.0) {
        return base_f0;
    }

    let cos_theta1_abs = abs(cos_theta1);
    let safe_iridescence_ior = max(iridescence_ior, 1.01);

    // 스넬의 법칙
    let sin_theta1 = sqrt(max(0.0, 1.0 - cos_theta1_abs * cos_theta1_abs));
    let sin_theta2 = (outside_ior / safe_iridescence_ior) * sin_theta1;

    if (sin_theta2 >= 1.0) {
        return base_f0 + iridescence_factor * (vec3<f32>(1.0) - base_f0);
    }

    let cos_theta2 = sqrt(max(0.0, 1.0 - sin_theta2 * sin_theta2));

    // 상수들 사전 계산
    let wavelengths = vec3<f32>(650.0, 510.0, 475.0);
    let effective_thickness = max(iridescence_thickness, 10.0);
    let ior_scale = max(1.0, 1.5 - 0.5 * (safe_iridescence_ior / 1.5));
    let optical_thickness = 2.0 * effective_thickness * safe_iridescence_ior * cos_theta2 * ior_scale;
    let phase = (2.0 * 3.14159265359 * optical_thickness) / wavelengths;

    // 삼각함수 (한 번만)
    let cos_phase = cos(phase);
    let sin_phase = sin(phase);

    // 공통 계산값들
    let outside_cos1 = outside_ior * cos_theta1_abs;
    let iridescence_cos2 = safe_iridescence_ior * cos_theta2;
    let iridescence_cos1 = safe_iridescence_ior * cos_theta1_abs;
    let outside_cos2 = outside_ior * cos_theta2;

    // 프레넬 계수 (스칼라)
    let r12_s = (outside_cos1 - iridescence_cos2) / (outside_cos1 + iridescence_cos2);
    let r12_p = (iridescence_cos1 - outside_cos2) / (iridescence_cos1 + outside_cos2);

    // 기본 F0에서 굴절률 추출 (벡터화)
    let sqrt_f0 = sqrt(clamp(base_f0, vec3<f32>(0.01), vec3<f32>(0.99)));
    let safe_n3 = max((1.0 + sqrt_f0) / (1.0 - sqrt_f0), vec3<f32>(1.2));

    // r23 계산 (벡터화)
    let iridescence_cos2_vec = vec3<f32>(iridescence_cos2);
    let cos_theta1_abs_vec = vec3<f32>(cos_theta1_abs);
    let iridescence_cos1_vec = vec3<f32>(iridescence_cos1);
    let cos_theta2_vec = vec3<f32>(cos_theta2);

    let r23_s = (iridescence_cos2_vec - safe_n3 * cos_theta1_abs_vec) /
                (iridescence_cos2_vec + safe_n3 * cos_theta1_abs_vec);
    let r23_p = (safe_n3 * cos_theta2_vec - iridescence_cos1_vec) /
                (safe_n3 * cos_theta2_vec + iridescence_cos1_vec);

    // 복소수 계산을 위한 공통 값들
    let r12_s_vec = vec3<f32>(r12_s);
    let r12_p_vec = vec3<f32>(r12_p);

    // S-편광 복소수 계산
    let num_s_real = r12_s_vec + r23_s * cos_phase;
    let num_s_imag = r23_s * sin_phase;
    let den_s_real = vec3<f32>(1.0) + r12_s_vec * r23_s * cos_phase;
    let den_s_imag = r12_s_vec * r23_s * sin_phase;

    // P-편광 복소수 계산
    let num_p_real = r12_p_vec + r23_p * cos_phase;
    let num_p_imag = r23_p * sin_phase;
    let den_p_real = vec3<f32>(1.0) + r12_p_vec * r23_p * cos_phase;
    let den_p_imag = r12_p_vec * r23_p * sin_phase;

    // 복소수 나눗셈 인라인 계산 (S-편광)
    let den_s_squared = den_s_real * den_s_real + den_s_imag * den_s_imag + vec3<f32>(0.001);
    let rs_real = (num_s_real * den_s_real + num_s_imag * den_s_imag) / den_s_squared;
    let rs_imag = (num_s_imag * den_s_real - num_s_real * den_s_imag) / den_s_squared;
    let Rs = rs_real * rs_real + rs_imag * rs_imag;

    // 복소수 나눗셈 인라인 계산 (P-편광)
    let den_p_squared = den_p_real * den_p_real + den_p_imag * den_p_imag + vec3<f32>(0.001);
    let rp_real = (num_p_real * den_p_real + num_p_imag * den_p_imag) / den_p_squared;
    let rp_imag = (num_p_imag * den_p_real - num_p_real * den_p_imag) / den_p_squared;
    let Rp = rp_real * rp_real + rp_imag * rp_imag;

    // 전체 반사율
    let reflectance = 0.5 * (Rs + Rp);

    // IOR 영향 최적화
    let ior_influence = smoothstep(1.0, 2.0, safe_iridescence_ior);
    let enhanced_reflectance = mix(
        pow(reflectance, vec3<f32>(0.8)) * 1.2,
        reflectance,
        ior_influence
    );

    // 최종 결과
    let clamped_reflectance = clamp(enhanced_reflectance, vec3<f32>(0.0), vec3<f32>(1.0));
    return mix(base_f0, clamped_reflectance, iridescence_factor);
}
fn specular_btdf(
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

    // GGX 분포 함수를 기존 roughness로 계산합니다.
    // 여기서는 외부에서 받은 NdotH와 roughness 값을 사용해 D 계산
    let D_rough: f32 = distribution_ggx(NdotH, roughness * roughness);

    // ior가 1.0이면 미세 효과가 없으므로 D = 1.0이 되어야 합니다.
    // 보간 인자 t를 통해 두 값을 혼합합니다.
    let t: f32 = clamp((ior - 1.0) * 100.0, 0.0, 1.0);
    let D: f32 = mix(1.0, D_rough, t);

    // 기하학적 감쇠 계산
    let G: f32 = min(1.0, min((2.0 * NdotH * NdotV) / VdotH, (2.0 * NdotH * NdotL) / VdotH));

    // 프레넬 항 계산 (이미 F0가 외부에서 제공됨)
    let F: vec3<f32> = fresnel_schlick(VdotH, F0);

    let denom: f32 = (eta * VdotH + LdotH) * (eta * VdotH + LdotH);

    // BTDF 공식 적용
    let btdf: vec3<f32> =
        (vec3<f32>(1.0) - F) *   // 투과되는 빛 (반사되지 않는 부분)
        abs(VdotH * LdotH) *     // 미세면 가시성
        (eta * eta) *           // 굴절률의 제곱
        D *                     // 미세면 분포
        G /                     // 기하학적 감쇠
        (NdotV * denom + 0.001); // 분모항 (작은 값 추가로 나누기 오류 방지)

    return btdf;
}

fn lambda_sheen_calc_l(x: f32, alpha_g: f32) -> f32 {
    let one_minus_alpha_sq = (1.0 - alpha_g) * (1.0 - alpha_g);

    let a = mix(21.5473, 25.3245, one_minus_alpha_sq);
    let b = mix(3.82987, 3.32435, one_minus_alpha_sq);
    let c = mix(0.19823, 0.16801, one_minus_alpha_sq);
    let d = mix(-1.97760, -1.27393, one_minus_alpha_sq);
    let e = mix(-4.32054, -4.85967, one_minus_alpha_sq);

    return a / (1.0 + b * pow(x, c)) + d * x + e;
}
fn lambda_sheen(cos_theta: f32, alpha_g: f32) -> f32 {
    if (abs(cos_theta) < 0.5) {
        return exp(lambda_sheen_calc_l(cos_theta, alpha_g));
    } else {
        return exp(2.0 * lambda_sheen_calc_l(0.5, alpha_g) - lambda_sheen_calc_l(1.0 - cos_theta, alpha_g));
    }
}

fn fresnel_coat(NdotV:f32, ior: f32, weight: f32, base: vec3<f32>, layer: vec3<f32>) -> vec3<f32> {
    let f0: f32 = pow((1.0 - ior) / (1.0 + ior), 2.0);
    let fr: f32 = f0 + (1.0 - f0) * pow(1.0 - abs(NdotV), 5.0);
    return mix(base, layer, weight * fr);
}
fn conductor_fresnel(F0: vec3<f32>, bsdf: vec3<f32>, VdotH: f32) -> vec3<f32> {
    let fresnel = F0 + (vec3<f32>(1.0) - F0) * pow(1.0 - abs(VdotH), 5.0);
    return bsdf * fresnel;
}
fn fresnel_mix(
    F0: vec3<f32>,
    weight: f32,
    base: vec3<f32>,
    layer: vec3<f32>,
    VdotH: f32
) -> vec3<f32> {
    var f0 = F0;
    f0 = min(f0, vec3<f32>(1.0));
    let fr = f0 + (1.0 - f0) * pow(1.0 - abs(VdotH), 5.0);
    return (1 - weight * max(max(fr.x, fr.y), fr.z)) * base + weight * fr * layer;
}
fn fresnel_mix_ibl(
    F0: vec3<f32>,
    weight: f32,
    base: vec3<f32>,
    layer: vec3<f32>,
    NdotV: f32
) -> vec3<f32> {
    var f0 = F0;
    f0 = min(f0, vec3<f32>(1.0));
    // Schlick의 프레넬 근사법 - 물리적으로 정확한 방식
    let fr = f0 + (1.0 - f0) * pow(1.0 - max(NdotV, 0.0), 5.0);

    // 물리적으로 올바른 블렌딩 방식: 에너지 보존 원칙을 준수
    return base * (1.0 - fr * weight) + layer * fr * weight;
}
// Disney-style diffuse BRDF (언리얼과 유사)
fn diffuse_brdf_disney(NdotL: f32, NdotV: f32, LdotH: f32, roughness: f32, albedo: vec3<f32>) -> vec3<f32> {
    if (NdotL <= 0.0) { return vec3<f32>(0.0); }

    // Disney diffuse term
    let energyBias = mix(0.0, 0.5, roughness);
    let energyFactor = mix(1.0, 1.0 / 1.51, roughness);
    let fd90 = energyBias + 2.0 * LdotH * LdotH * roughness;
    let f0 = 1.0;
    let lightScatter = f0 + (fd90 - f0) * pow(1.0 - NdotL, 5.0);
    let viewScatter = f0 + (fd90 - f0) * pow(1.0 - NdotV, 5.0);

    return albedo * NdotL * lightScatter * viewScatter * energyFactor / pi;
}

fn diffuse_brdf(NdotL:f32, albedo: vec3<f32>) -> vec3<f32> {
    return albedo * NdotL / pi;
}
fn diffuse_btdf(N: vec3<f32>, L: vec3<f32>, Albedo: vec3<f32>) -> vec3<f32> {
    // 뒷면으로 들어오는 광선만 처리 (-dot(N,L)를 사용하여 음수만 양수로 변환하여 사용)
    let cos_theta = max(-dot(N, L), 0.0);
    return Albedo * cos_theta / pi;
}

fn specular_brdf(
    F0: vec3<f32>,
    roughness: f32,
    NdotH: f32,
    NdotV: f32,
    NdotL: f32,
    LdotH: f32
) -> vec3<f32> {

    // Distribution (D)
    let D = distribution_ggx(NdotH, roughness);

    // Geometric Shadowing (G)
    let G = geometry_smith(NdotV, NdotL, roughness);

    // Fresnel (F)
    let F = fresnel_schlick(LdotH, F0);

    // Cook-Torrance BRDF
    let numerator = D * G * F;
    let denominator = 4.0 * NdotV * NdotL + 0.04; // 0으로 나누기 방지
//    let energyCompensation = 1.0 + roughness * (1.0 / NdotV - 1.0);
    return (numerator / denominator) ;
}

// 표준 GGX Normal Distribution Function
fn distribution_ggx(NdotH: f32, roughness: f32) -> f32 {
    let alpha = roughness * roughness;
    let alpha2 = alpha * alpha;
    let NdotH2 = NdotH * NdotH;

    let nom = alpha2;
    let denom = (NdotH2 * (alpha2 - 1.0) + 1.0);
    let denom_squared = denom * denom;

    return nom / (denom_squared * 3.14159265359);
}

// Smith's method for Geometric Shadowing with GGX
fn geometry_smith(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
    let alpha = roughness * roughness;
    let k = alpha / 2.0;  // 직접 조명에 적합한 k 값

    let ggx1 = NdotV / (NdotV * (1.0 - k) + k);
    let ggx2 = NdotL / (NdotL * (1.0 - k) + k);

    return ggx1 * ggx2;
}

// Schlick's approximation for Fresnel
fn fresnel_schlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {
    return F0 + (vec3<f32>(1.0) - F0) * pow(1.0 - cosTheta, 5.0);
}

fn get_transformed_uv(
    input_uv: vec2<f32>,
    input_uv1: vec2<f32>,
    texCoord_index: u32,
    use_transform: u32,
    transform_offset: vec2<f32>,
    transform_rotation: f32,
    transform_scale: vec2<f32>
) -> vec2<f32> {
    // UV 좌표 선택
    var result_uv = select(input_uv, input_uv1, texCoord_index == 1);

    // 변환 적용 (필요한 경우)
    if (use_transform == 1) {
        // 행렬 직접 생성 및 적용
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

fn linear_to_srgb(linearColor: vec4<f32>) -> vec4<f32> {
 let cutoff = vec4<f32>(0.0031308);
 let higher = vec4<f32>(1.055) * pow(linearColor, vec4<f32>(1.0/2.4)) - vec4<f32>(0.055);
 let lower = linearColor * vec4<f32>(12.92);

 return vec4<f32>(
   mix(higher.r, lower.r, step(linearColor.r, cutoff.r)),
   mix(higher.g, lower.g, step(linearColor.g, cutoff.g)),
   mix(higher.b, lower.b, step(linearColor.b, cutoff.b)),
   linearColor.a // 알파는 보통 그대로 둡니다
 );
}
