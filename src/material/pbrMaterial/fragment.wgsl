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
    // Base Color
    useBaseColorTexture: u32,
    baseColorTexture_texCoord_index: u32,
    baseColorFactor: vec4<f32>,
    // Emissive
    useEmissiveTexture: u32,
    emissiveTexture_texCoord_index: u32,
    emissiveFactor: vec3<f32>,
    emissiveStrength:f32,
    // Occlusion
    useOcclusionTexture: u32,
    occlusionTexture_texCoord_index: u32,
    occlusionStrength: f32,
    // Metallic Roughness
    useMetallicRoughnessTexture: u32,
    metallicRoughnessTexture_texCoord_index: u32,
    metallicFactor: f32,
    roughnessFactor: f32,
    // Normal
    normalScale: f32,
    useNormalTexture: u32,
    normalTexture_texCoord_index: u32,
    // Environment
    useEnvironmentTexture: u32,
    // doubleSided
    doubleSided:u32,
    useVertexTangent:u32,

    // extensions

    // clearcoat
    useKHR_materials_clearcoat:u32,
    KHR_clearcoatFactor:f32,
    KHR_clearcoatRoughnessFactor:f32,
    KHR_clearcoatNormalScale:f32,
    useKHR_clearcoatTexture: u32,
    useKHR_clearcoatNormalTexture: u32,
    useKHR_clearcoatRoughnessTexture: u32,
    KHR_clearcoatTexture_texCoord_index:u32,
    KHR_clearcoatNormalTexture_texCoord_index:u32,
    KHR_clearcoatRoughnessTexture_texCoord_index:u32,
    // transmissionFactor
    transmissionFactor:f32,
    useTransmissionTexture: u32,
    transmissionTexture_texCoord_index:u32,
    //
    useKHR_materials_specular:u32,
    KHR_specularFactor:f32,
    KHR_specularColorFactor: vec3<f32>,
    useKHR_specularTexture:u32,
    useKHR_specularColorTexture:u32,
    KHR_specularTexture_texCoord_index:u32,
    KHR_specularColorTexture_texCoord_index:u32,
    // sheen
    useKHR_materials_sheen:u32,
    KHR_sheenColorFactor:vec3<f32>,
    KHR_sheenRoughnessFactor:f32,
    useKHR_sheenColorTexture: u32,
    useKHR_sheenRoughnessTexture: u32,
    KHR_sheenColorTexture_texCoord_index:u32,
    KHR_sheenRoughnessTexture_texCoord_index:u32,

    // KHR_texture_transform
    // baseColorTexture_KHR_texture_transform
    baseColorTexture_KHR_texture_transform_offset:vec2<f32>,
    baseColorTexture_KHR_texture_transform_scale:vec2<f32>,
    baseColorTexture_KHR_texture_transform_rotation:f32,
    use_baseColorTexture_KHR_texture_transform:u32,
    // metallicRoughnessTexture_KHR_texture_transform
    metallicRoughnessTexture_KHR_texture_transform_offset:vec2<f32>,
    metallicRoughnessTexture_KHR_texture_transform_scale:vec2<f32>,
    metallicRoughnessTexture_KHR_texture_transform_rotation:f32,
    use_metallicRoughnessTexture_KHR_texture_transform:u32,
    // normalTexture_KHR_texture_transform
    normalTexture_KHR_texture_transform_offset:vec2<f32>,
    normalTexture_KHR_texture_transform_scale:vec2<f32>,
    normalTexture_KHR_texture_transform_rotation:f32,
    use_normalTexture_KHR_texture_transform:u32,
    // emissiveTexture_KHR_texture_transform
    emissiveTexture_KHR_texture_transform_offset:vec2<f32>,
    emissiveTexture_KHR_texture_transform_scale:vec2<f32>,
    emissiveTexture_KHR_texture_transform_rotation:f32,
    use_emissiveTexture_KHR_texture_transform:u32,
    // occlusionTexture_KHR_texture_transform
    occlusionTexture_KHR_texture_transform_offset:vec2<f32>,
    occlusionTexture_KHR_texture_transform_scale:vec2<f32>,
    occlusionTexture_KHR_texture_transform_rotation:f32,
    use_occlusionTexture_KHR_texture_transform:u32,
    // KHR_clearcoatTexture_KHR_texture_transform
    KHR_clearcoatTexture_KHR_texture_transform_offset:vec2<f32>,
    KHR_clearcoatTexture_KHR_texture_transform_scale:vec2<f32>,
    KHR_clearcoatTexture_KHR_texture_transform_rotation:f32,
    use_KHR_clearcoatTexture_KHR_texture_transform:u32,
    // KHR_clearcoatNormalTexture
    KHR_clearcoatNormalTexture_KHR_texture_transform_offset:vec2<f32>,
    KHR_clearcoatNormalTexture_KHR_texture_transform_scale:vec2<f32>,
    KHR_clearcoatNormalTexture_KHR_texture_transform_rotation:f32,
    use_KHR_clearcoatNormalTexture_KHR_texture_transform:u32,
    // KHR_clearcoatRoughnessTexture
    KHR_clearcoatRoughnessTexture_KHR_texture_transform_offset:vec2<f32>,
    KHR_clearcoatRoughnessTexture_KHR_texture_transform_scale:vec2<f32>,
    KHR_clearcoatRoughnessTexture_KHR_texture_transform_rotation:f32,
    use_KHR_clearcoatRoughnessTexture_KHR_texture_transform:u32,
    // KHR_sheenColorTexture
    KHR_sheenColorTexture_KHR_texture_transform_offset:vec2<f32>,
    KHR_sheenColorTexture_KHR_texture_transform_scale:vec2<f32>,
    KHR_sheenColorTexture_KHR_texture_transform_rotation:f32,
    use_KHR_sheenColorTexture_KHR_texture_transform:u32,
    // KHR_sheenRoughnessTexture
    KHR_sheenRoughnessTexture_KHR_texture_transform_offset:vec2<f32>,
    KHR_sheenRoughnessTexture_KHR_texture_transform_scale:vec2<f32>,
    KHR_sheenRoughnessTexture_KHR_texture_transform_rotation:f32,
    use_KHR_sheenRoughnessTexture_KHR_texture_transform:u32,
    // KHR_specularTexture
    KHR_specularTexture_KHR_texture_transform_offset:vec2<f32>,
    KHR_specularTexture_KHR_texture_transform_scale:vec2<f32>,
    KHR_specularTexture_KHR_texture_transform_rotation:f32,
    use_KHR_specularTexture_KHR_texture_transform:u32,
    // KHR_specularColorTexture
    KHR_specularColorTexture_KHR_texture_transform_offset:vec2<f32>,
    KHR_specularColorTexture_KHR_texture_transform_scale:vec2<f32>,
    KHR_specularColorTexture_KHR_texture_transform_rotation:f32,
    use_KHR_specularColorTexture_KHR_texture_transform:u32,
    //
    useKHR_materials_unlit:u32,
    //
    KHR_materials_ior:f32,
    //
    opacity: f32,
    useTint:u32,
    tint:vec4<f32>,
    tintBlendMode:u32,

};
// Uniforms Group
@group(2) @binding(0) var<uniform> uniforms: Uniforms;

// Base ColorRGBA Texture
@group(2) @binding(1) var baseColorTextureSampler: sampler;
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;

// Emissive Texture
@group(2) @binding(3) var emissiveTextureSampler: sampler;
@group(2) @binding(4) var emissiveTexture: texture_2d<f32>;

// Occlusion Texture
@group(2) @binding(5) var occlusionTextureSampler: sampler;
@group(2) @binding(6) var occlusionTexture: texture_2d<f32>;

// Metallic Roughness Texture
@group(2) @binding(7) var metallicRoughnessTextureSampler: sampler;
@group(2) @binding(8) var metallicRoughnessTexture: texture_2d<f32>;

// Normal Texture
@group(2) @binding(9) var normalTextureSampler: sampler;
@group(2) @binding(10) var normalTexture: texture_2d<f32>;

// Environment Texture

// clearcoatNormal Texture
@group(2) @binding(11) var KHR_clearcoatTextureSampler: sampler;
@group(2) @binding(12) var KHR_clearcoatTexture: texture_2d<f32>;

// clearcoatNormal Texture
@group(2) @binding(13) var KHR_clearcoatNormalTextureSampler: sampler;
@group(2) @binding(14) var KHR_clearcoatNormalTexture: texture_2d<f32>;

// useClearcoatRoughness Texture
@group(2) @binding(15) var KHR_clearcoatRoughnessTextureSampler: sampler;
@group(2) @binding(16) var KHR_clearcoatRoughnessTexture: texture_2d<f32>;

// transmission Texture
@group(2) @binding(17) var transmissionTextureSampler: sampler;
@group(2) @binding(18) var transmissionTexture: texture_2d<f32>;

// transmission Texture
@group(2) @binding(19) var KHR_sheenColorTextureSampler: sampler;
@group(2) @binding(20) var KHR_sheenColorTexture: texture_2d<f32>;
@group(2) @binding(21) var KHR_sheenRoughnessTextureSampler: sampler;
@group(2) @binding(22) var KHR_sheenRoughnessTexture: texture_2d<f32>;

// specularTexture
@group(2) @binding(23) var KHR_specularTextureSampler: sampler;
@group(2) @binding(24) var KHR_specularTexture: texture_2d<f32>;
@group(2) @binding(25) var KHR_specularColorTextureSampler: sampler;
@group(2) @binding(26) var KHR_specularColorTexture: texture_2d<f32>;

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
}


@fragment
fn main(inputData:InputData) -> @location(0) vec4<f32> {
    // 데이터 변수를 뽑아서 저장
    var input_vertexNormal = (inputData.vertexNormal.xyz);
    var input_vertexPosition = inputData.vertexPosition.xyz;
    var input_vertexColor_0 = inputData.vertexColor_0;
    var input_vertexTangent = inputData.vertexTangent;
    var input_uv = inputData.uv;
    var input_uv1 = inputData.uv1;
    //
    // AmbientLight
    let u_ambientLight = systemUniforms.ambientLight;
    let u_ambientLightColor = u_ambientLight.color;
    let u_ambientLightIntensity = u_ambientLight.intensity;

    // DirectionalLight
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    let u_directionalLightShadowDepthTextureSize = systemUniforms.directionalLightShadowDepthTextureSize;
    let u_directionalLightShadowBias = systemUniforms.directionalLightShadowBias;

    var u_useIblTexture = systemUniforms.useIblTexture == 1u;
    // Shadow
    let receiveShadowYn = inputData.receiveShadow != .0;

    // Camera
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // 유니폼 변수 뽑아서 저장
    var u_opacity = uniforms.opacity;
    var u_baseColorTexture_texCoord_index = uniforms.baseColorTexture_texCoord_index;
    var u_emissiveTexture_texCoord_index = uniforms.emissiveTexture_texCoord_index;
    var u_occlusionTexture_texCoord_index = uniforms.occlusionTexture_texCoord_index;
    var u_KHR_clearcoatTexture_texCoord_index = uniforms.KHR_clearcoatTexture_texCoord_index;
    var u_KHR_clearcoatNormalTexture_texCoord_index = uniforms.KHR_clearcoatNormalTexture_texCoord_index;
    var u_KHR_clearcoatRoughnessTexture_texCoord_index  = uniforms.KHR_clearcoatRoughnessTexture_texCoord_index ;
    var u_useMetallicRoughnessTexture  = uniforms.useMetallicRoughnessTexture == 1u;
    var u_metallicRoughnessTexture_texCoord_index = uniforms.metallicRoughnessTexture_texCoord_index;
    var u_normalTexture_texCoord_index = uniforms.normalTexture_texCoord_index;
    var u_normalScale = uniforms.normalScale;
    var u_baseColorFactor = uniforms.baseColorFactor;
    var u_useVertexColor = uniforms.useVertexColor == 1u;
    var u_useBaseColorTexture = uniforms.useBaseColorTexture == 1u;
    var u_useNormalTexture = uniforms.useNormalTexture == 1u;
    var u_metallicFactor = uniforms.metallicFactor;
    var u_roughnessFactor = uniforms.roughnessFactor;;
    var u_useEmissiveTexture = uniforms.useEmissiveTexture == 1u;
    var u_emissiveFactor = uniforms.emissiveFactor;
    var u_emissiveStrength = uniforms.emissiveStrength;
    var u_useOcclusionTexture = uniforms.useOcclusionTexture == 1u;
    var u_occlusionStrength = uniforms.occlusionStrength;
    var u_useCutOff = uniforms.useCutOff == 1u;
    var u_cutOff = uniforms.cutOff;
    var u_doubleSided = uniforms.doubleSided == 1u;
    var u_useVertexTangent = uniforms.useVertexTangent == 1u;
    //
    var u_KHR_clearcoatFactor = uniforms.KHR_clearcoatFactor;
    var u_KHR_clearcoatRoughnessFactor = uniforms.KHR_clearcoatRoughnessFactor;
    var u_KHR_clearcoatNormalScale = uniforms.KHR_clearcoatNormalScale;
    var u_useKHR_materials_clearcoat = uniforms.useKHR_materials_clearcoat == 1u;
    var u_useKHR_clearcoatTexture = uniforms.useKHR_clearcoatTexture == 1u;
    var u_useKHR_clearcoatNormalTexture = uniforms.useKHR_clearcoatNormalTexture == 1u;
    var u_useKHR_clearcoatRoughnessTexture = uniforms.useKHR_clearcoatRoughnessTexture == 1u;
    //
    var u_transmissionFactor = uniforms.transmissionFactor;
    var u_transmissionTexture_texCoord_index = uniforms.transmissionTexture_texCoord_index;
    var u_useTransmissionTexture = uniforms.useTransmissionTexture == 1u;
    //
    var u_use_baseColorTexture_KHR_texture_transform = uniforms.use_baseColorTexture_KHR_texture_transform == 1u;
    var u_use_metallicRoughnessTexture_texture_transform = uniforms.use_metallicRoughnessTexture_KHR_texture_transform == 1u;
    var u_use_normalTexture_texture_transform = uniforms.use_normalTexture_KHR_texture_transform == 1u;
    var u_use_emissiveTexture_texture_transform = uniforms.use_emissiveTexture_KHR_texture_transform == 1u;
    var u_use_occlusionTexture_texture_transform = uniforms.use_occlusionTexture_KHR_texture_transform == 1u;
    var u_use_KHR_clearcoatTexture_texture_transform = uniforms.use_KHR_clearcoatTexture_KHR_texture_transform == 1u;
    var u_use_KHR_clearcoatNormalTexture_texture_transform = uniforms.use_KHR_clearcoatNormalTexture_KHR_texture_transform == 1u;
    var u_use_KHR_clearcoatRoughnessTexture_texture_transform = uniforms.use_KHR_clearcoatRoughnessTexture_KHR_texture_transform == 1u;
    var u_use_KHR_sheenColorTexture_KHR_texture_transform = uniforms.use_KHR_sheenColorTexture_KHR_texture_transform == 1u;
    var u_use_KHR_sheenRoughnessTexture_KHR_texture_transform = uniforms.use_KHR_sheenRoughnessTexture_KHR_texture_transform == 1u;
    var u_use_KHR_specularTexture_KHR_texture_transform = uniforms.use_KHR_specularTexture_KHR_texture_transform == 1u;
    var u_use_KHR_specularColorTexture_KHR_texture_transform = uniforms.use_KHR_specularColorTexture_KHR_texture_transform == 1u;
    //
    var u_useKHR_materials_unlit = uniforms.useKHR_materials_unlit == 1u;
    var u_KHR_materials_ior = uniforms.KHR_materials_ior;
    //
    var u_useKHR_materials_sheen = uniforms.useKHR_materials_sheen == 1u;
    var u_useKHR_sheenColorTexture = uniforms.useKHR_sheenColorTexture == 1u;
    var u_useKHR_sheenRoughnessTexture = uniforms.useKHR_sheenRoughnessTexture == 1u;
    var u_KHR_sheenColorFactor = uniforms.KHR_sheenColorFactor;
    var u_KHR_sheenRoughnessFactor = uniforms.KHR_sheenRoughnessFactor;
    var u_KHR_sheenColorTexture_texCoord_index = uniforms.KHR_sheenColorTexture_texCoord_index;
    var u_KHR_sheenRoughnessTexture_texCoord_index = uniforms.KHR_sheenRoughnessTexture_texCoord_index;
    //
    var u_useKHR_materials_specular = uniforms.useKHR_materials_specular == 1u;
    var u_KHR_specularFactor = uniforms.KHR_specularFactor;
    var u_KHR_specularColorFactor = uniforms.KHR_specularColorFactor;
    var u_useKHR_specularTexture = uniforms.useKHR_specularTexture == 1u;
    var u_useKHR_specularColorTexture = uniforms.useKHR_specularColorTexture == 1u;
    var u_KHR_specularTexture_texCoord_index = uniforms.KHR_specularTexture_texCoord_index;
    var u_KHR_specularColorTexture_texCoord_index = uniforms.KHR_specularColorTexture_texCoord_index;

    // Initialize UV coordinates for different texture maps
    var diffuseUV = input_uv;
    var emissiveUV = input_uv;
    var occlusionUV = input_uv;
    var metallicRoughnessUV = input_uv;
    var normalUV = input_uv;
    var clearcoatUV = input_uv;
    var clearcoatNormalUV = input_uv;
    var clearcoatRoughnessUV = input_uv;
    var transmissionUV = input_uv;
    var sheenColorUV = input_uv;
    var sheenRoughnessUV = input_uv;
    var khr_specularTextureUV = input_uv;
    var khr_specularColorTextureUV = input_uv;

    // Conditionally switch to secondary UV channel if specified in uniforms
    if (u_baseColorTexture_texCoord_index == 1) { diffuseUV = input_uv1; }
    if (u_emissiveTexture_texCoord_index == 1) { emissiveUV = input_uv1; }
    if (u_occlusionTexture_texCoord_index == 1) { occlusionUV = input_uv1; }
    if (u_metallicRoughnessTexture_texCoord_index == 1) { metallicRoughnessUV = input_uv1; }
    if (u_normalTexture_texCoord_index == 1) { normalUV = input_uv1; }
    //
    if (u_KHR_clearcoatTexture_texCoord_index == 1) { clearcoatUV = input_uv1; }
    if (u_KHR_clearcoatNormalTexture_texCoord_index == 1) { clearcoatNormalUV = input_uv1; }
    if (u_KHR_clearcoatRoughnessTexture_texCoord_index == 1) { clearcoatRoughnessUV = input_uv1; }
    //
    if (u_transmissionTexture_texCoord_index == 1) { transmissionUV = input_uv1; }
    //
    if (u_KHR_sheenColorTexture_texCoord_index == 1) { sheenColorUV = input_uv1; }
    if (u_KHR_sheenRoughnessTexture_texCoord_index == 1) { sheenRoughnessUV = input_uv1; }
    //
    if (u_KHR_specularTexture_texCoord_index == 1) { khr_specularTextureUV = input_uv1; }
    if (u_KHR_specularColorTexture_texCoord_index == 1) { khr_specularColorTextureUV = input_uv1; }

//

    if(u_use_baseColorTexture_KHR_texture_transform){
        diffuseUV = transform_texture_coordinate( diffuseUV, uniforms.baseColorTexture_KHR_texture_transform_offset, uniforms.baseColorTexture_KHR_texture_transform_rotation , uniforms.baseColorTexture_KHR_texture_transform_scale );
    }
    if(u_use_metallicRoughnessTexture_texture_transform){
        metallicRoughnessUV = transform_texture_coordinate( metallicRoughnessUV, uniforms.metallicRoughnessTexture_KHR_texture_transform_offset, uniforms.metallicRoughnessTexture_KHR_texture_transform_rotation , uniforms.metallicRoughnessTexture_KHR_texture_transform_scale );
    }
    if(u_use_normalTexture_texture_transform){
        normalUV = transform_texture_coordinate( normalUV, uniforms.normalTexture_KHR_texture_transform_offset, uniforms.normalTexture_KHR_texture_transform_rotation , uniforms.normalTexture_KHR_texture_transform_scale );
    }
    if(u_use_emissiveTexture_texture_transform){
        emissiveUV = transform_texture_coordinate( emissiveUV, uniforms.emissiveTexture_KHR_texture_transform_offset, uniforms.emissiveTexture_KHR_texture_transform_rotation , uniforms.emissiveTexture_KHR_texture_transform_scale );
    }
    if(u_use_occlusionTexture_texture_transform){
        occlusionUV = transform_texture_coordinate( occlusionUV, uniforms.occlusionTexture_KHR_texture_transform_offset, uniforms.occlusionTexture_KHR_texture_transform_rotation , uniforms.occlusionTexture_KHR_texture_transform_scale );
    }
    if(u_use_KHR_clearcoatTexture_texture_transform){
        clearcoatUV = transform_texture_coordinate( clearcoatUV, uniforms.KHR_clearcoatTexture_KHR_texture_transform_offset, uniforms.KHR_clearcoatTexture_KHR_texture_transform_rotation , uniforms.KHR_clearcoatTexture_KHR_texture_transform_scale );
    }
    if(u_use_KHR_clearcoatNormalTexture_texture_transform){
        clearcoatNormalUV = transform_texture_coordinate( clearcoatNormalUV, uniforms.KHR_clearcoatNormalTexture_KHR_texture_transform_offset, uniforms.KHR_clearcoatNormalTexture_KHR_texture_transform_rotation , uniforms.KHR_clearcoatNormalTexture_KHR_texture_transform_scale );
    }
    if(u_use_KHR_clearcoatRoughnessTexture_texture_transform){
        clearcoatRoughnessUV = transform_texture_coordinate( clearcoatRoughnessUV, uniforms.KHR_clearcoatRoughnessTexture_KHR_texture_transform_offset, uniforms.KHR_clearcoatRoughnessTexture_KHR_texture_transform_rotation , uniforms.KHR_clearcoatRoughnessTexture_KHR_texture_transform_scale );
    }
    if(u_use_KHR_sheenColorTexture_KHR_texture_transform){
        sheenColorUV = transform_texture_coordinate( sheenColorUV, uniforms.KHR_sheenColorTexture_KHR_texture_transform_offset, uniforms.KHR_sheenColorTexture_KHR_texture_transform_rotation , uniforms.KHR_sheenColorTexture_KHR_texture_transform_scale );
    }
    if(u_use_KHR_sheenRoughnessTexture_KHR_texture_transform){
        sheenRoughnessUV = transform_texture_coordinate( sheenRoughnessUV, uniforms.KHR_sheenRoughnessTexture_KHR_texture_transform_offset, uniforms.KHR_sheenRoughnessTexture_KHR_texture_transform_rotation , uniforms.KHR_sheenRoughnessTexture_KHR_texture_transform_scale );
    }
    if(u_use_KHR_specularColorTexture_KHR_texture_transform){
        khr_specularColorTextureUV = transform_texture_coordinate( khr_specularColorTextureUV, uniforms.KHR_specularColorTexture_KHR_texture_transform_offset, uniforms.KHR_specularColorTexture_KHR_texture_transform_rotation , uniforms.KHR_specularColorTexture_KHR_texture_transform_scale );
    }
    if(u_use_KHR_specularTexture_KHR_texture_transform){
        khr_specularTextureUV = transform_texture_coordinate( khr_specularColorTextureUV, uniforms.KHR_specularTexture_KHR_texture_transform_offset, uniforms.KHR_specularTexture_KHR_texture_transform_rotation , uniforms.KHR_specularTexture_KHR_texture_transform_scale );
    }

    if(u_use_baseColorTexture_KHR_texture_transform){
        transmissionUV = transform_texture_coordinate( transmissionUV, uniforms.baseColorTexture_KHR_texture_transform_offset, uniforms.baseColorTexture_KHR_texture_transform_rotation , uniforms.baseColorTexture_KHR_texture_transform_scale );
    }

    // Calculate view direction vector
    var V: vec3<f32> = normalize(u_cameraPosition - input_vertexPosition);
    // Extract and normalize the vertex normal
    var N: vec3<f32> = normalize(input_vertexNormal.xyz);



    var backFaceYn:bool = false;
    if(u_doubleSided) {
        var fdx:vec3<f32> = dpdx(input_vertexPosition);
        var fdy:vec3<f32> = dpdy(input_vertexPosition);
        var faceNormal:vec3<f32> = normalize(cross(fdy,fdx));
        if (dot(N, faceNormal) < 0.0) {
            N = -N;
            backFaceYn = true;
        };
    }
    let N2 = N;
    if(u_useNormalTexture){
        var targetUv = normalUV;
        if(backFaceYn){
            targetUv = 1.0 - targetUv;
        }
        let normalSamplerColor = textureSample(normalTexture, normalTextureSampler, normalUV).rgb;
        N = perturb_normal(
            N,
            input_vertexPosition,
            targetUv,
            vec3<f32>(normalSamplerColor.r, 1.0 - normalSamplerColor.g, normalSamplerColor.b),
            u_normalScale
        ) ;
        if(u_useVertexTangent){
            if(backFaceYn ){ N = -N; }
        }
    }else{
        N = N * u_normalScale;
    }


    var visibility:f32 = 1.0;
     visibility = calcDirectionalShadowVisibility(
                directionalShadowMap,
                directionalShadowMapSampler,
                u_directionalLightShadowDepthTextureSize,
                u_directionalLightShadowBias,
                inputData.shadowPos
            );

    if(!receiveShadowYn){
       visibility = 1.0;
    }

    let directionalLightColor = u_directionalLights[0].color;
    let directionalLightIntensity = u_directionalLights[0].intensity;
    // Calculate light direction vector
    var L: vec3<f32> = -normalize(u_directionalLights[0].direction);


    // Initialize diffuse color with a uniform base color
    var finalColor:vec4<f32>;
    var baseColor = u_baseColorFactor;
    var resultAlpha:f32 = u_opacity * baseColor.a;

    // Multiply vertex color if vertex colors are enabled
    if (u_useVertexColor) {
        baseColor *= input_vertexColor_0 ;
    }

    // diffuse
    if (u_useBaseColorTexture) {
        let diffuseSampleColor = (textureSample(baseColorTexture, baseColorTextureSampler, diffuseUV)) ;
        baseColor *= diffuseSampleColor ;
        resultAlpha *= diffuseSampleColor.a;
    }


    if(u_useKHR_materials_unlit){
        return baseColor;
    }

    // occlusion
    if (u_useOcclusionTexture) {
        let occlusionSamplerColor: vec4<f32> = (textureSample(occlusionTexture, occlusionTextureSampler, occlusionUV));
        baseColor = vec4<f32>( baseColor.rgb * occlusionSamplerColor.r * u_occlusionStrength, resultAlpha);
    }

//    var metallicParameter: f32 = u_metallicFactor;
    var metallicParameter: f32 = u_metallicFactor;
    var roughnessParameter: f32 = u_roughnessFactor;
    var ior:f32 = u_KHR_materials_ior;


    if (u_useMetallicRoughnessTexture) {
        // Calculate for metallic and roughness from the metallicRoughnessTexture
        let metallicRoughnessSample = (textureSample(metallicRoughnessTexture, metallicRoughnessTextureSampler, metallicRoughnessUV));
        metallicParameter = metallicRoughnessSample.b * u_metallicFactor;
        roughnessParameter = metallicRoughnessSample.g * u_roughnessFactor;
    }

//    let NdotL = (dot(N, L)) ;
//    let NdotV = (dot(N, V)) ;
//
//    let H = normalize(L + V);
//    let NdotH = (dot(N, H)) ;
//    let LdotH = (dot(L, H)) ;
//    let VdotH = (dot(V, H)) ;

//    let NdotL = max(dot(N, L), 0.0) * 0.5 + 0.5;
//    let NdotV = max(dot(N, V), 0.0) * 0.5 + 0.5;
//
//    let H = normalize(L + V);
//    let NdotH = max(dot(N, H), 0.0) * 0.5 + 0.5;
//    let LdotH = max(dot(L, H), 0.0) * 0.5 + 0.5;
//    let VdotH = max(dot(V, H), 0.0) * 0.5 + 0.5;

//    let NdotL = max(dot(N, L), 0.0) ;
//    let NdotV = max(dot(N, V), 0.0) ;
//
//    let H = normalize(L + V);
//    let NdotH = max(dot(N, H), 0.0) ;
//    let LdotH = max(dot(L, H), 0.0) ;
//    let VdotH = max(dot(V, H), 0.0) ;


    let albedo = baseColor.rgb;


    let F0_dielectric: vec3<f32> = vec3<f32>(pow((1.0 - ior) / (1.0 + ior), 2.0));
    let F0_metal: vec3<f32> = albedo;
    var F0: vec3<f32> = mix(F0_dielectric, F0_metal, metallicParameter );


    var specularColor = vec3<f32>(1.0);


////////////////////////////////////////////////////////////////////
    var specular_specularFactor = u_KHR_specularFactor;
    var specular_specularColorFactor = u_KHR_specularColorFactor;

    if(u_useKHR_materials_specular){
        if(u_useKHR_specularTexture){
            let specularTextureSample =  textureSample(
            KHR_specularTexture,
            KHR_specularTextureSampler,
            khr_specularTextureUV
            );
            specular_specularFactor *= specularTextureSample.a;
        };

        if(u_useKHR_specularColorTexture){
            let specularColorTextureSample =  textureSample(
            KHR_specularColorTexture,
            KHR_specularColorTextureSampler,
            khr_specularColorTextureUV
            );
            specular_specularColorFactor *= specularColorTextureSample.rgb;
        };
        specularColor = specular_specularColorFactor ;
    }




    let NdotV = (dot(N, V)) * 0.5 + 0.5;

    let NdotL = (dot(N, L)) * 0.5 + 0.5;
    let H = normalize(L + V);
    let LdotH = (dot(L, H)) * 0.5 + 0.5;
    let NdotH = (dot(N, H)) * 0.5 + 0.5;
    let VdotH = (dot(V, H)) * 0.5 + 0.5 ;

////////////////////////////////////////////////////////////////////
    var BRDF_diffuse = diffuse_brdf(N, L, albedo * directionalLightColor * directionalLightIntensity );
    var BRDF_specular = specular_brdf(F0,N,V,L,roughnessParameter  )  * directionalLightIntensity ;
    var BRDF_dielectric = fresnel_mix_KHR_materials_specular(specularColor,ior,specular_specularFactor,BRDF_diffuse,BRDF_specular,VdotH);
    let BRDF_metal = conductor_fresnel(F0,BRDF_specular,VdotH) ;
    finalColor = vec4<f32>(
        mix(BRDF_dielectric , BRDF_metal ,metallicParameter) ,
        resultAlpha
    );

{
    let clusterIndex = getPointLightClusterIndex(inputData.position);
    let lightOffset  = pointLight_clusterLightGroup.lights[clusterIndex].offset;
    let lightCount:u32   = pointLight_clusterLightGroup.lights[clusterIndex].count;
    var mixColor:vec3<f32> = vec3<f32>(0.0);
    for (var lightIndex = 0u; lightIndex < lightCount; lightIndex = lightIndex + 1u) {
        let i = pointLight_clusterLightGroup.indices[lightOffset + lightIndex];
        let u_pointLightPosition = pointLightList.lights[i].position;
        let u_pointLightRadius = pointLightList.lights[i].radius ;
        let lightDistance = length(u_pointLightPosition - inputData.vertexPosition);

        if(lightDistance<=u_pointLightRadius){
            let u_pointLightColor = pointLightList.lights[i].color;
            let u_pointLightIntensity = pointLightList.lights[i].intensity ;
            let lightDir = normalize(u_pointLightPosition - inputData.vertexPosition);
            let attenuation = clamp(0.0, 1.0, 1.0 - (lightDistance * lightDistance) / (u_pointLightRadius * u_pointLightRadius));
            let L = normalize(lightDir);
            let R = reflect(-L, N);

            var BRDF_diffuse = diffuse_brdf(N, L, albedo * u_pointLightColor * u_pointLightIntensity * attenuation) ;
            var BRDF_specular = specular_brdf(F0,N,V,L,roughnessParameter  ) * attenuation  ;
            var BRDF_dielectric = fresnel_mix_KHR_materials_specular(specularColor,ior,specular_specularFactor,BRDF_diffuse,BRDF_specular,VdotH);
            let BRDF_metal = conductor_fresnel(F0,BRDF_specular,VdotH) ;
            mixColor += mix(BRDF_dielectric , BRDF_metal ,metallicParameter) ;
        }
    }
    finalColor = vec4<f32>(finalColor.rgb + mixColor, resultAlpha);

}
{
//TODO - directional 조명컬러적용
//    let diffuseLight: vec3<f32> = lightColor * NdotL * lightIntensity;
//    finalColor = vec4<f32>(finalColor.rgb * diffuseLight, resultAlpha);;
}
    var transmission = u_transmissionFactor;
    {

        if(u_transmissionFactor > 0.0 ){

            var transmissionSampleColor = vec4<f32>(1.0);
            if (u_useTransmissionTexture) {
                 transmissionSampleColor = (textureSample(transmissionTexture, transmissionTextureSampler, transmissionUV)) ;
                 transmission *= transmissionSampleColor.r;

            }
            if(transmission > 0.0){
//                let BTDF_specular = specular_btdf(vec3<f32>(ior),N,L,V) * albedo;
//
//
//
//                BRDF_dielectric = fresnel_mix_KHR_materials_specular(
//                    specularColor,
//                    ior,
//                    specular_specularFactor,
//                    mix(  BRDF_dielectric, BTDF_specular, transmission) ,
//                    BRDF_specular,
//                    VdotH
//                );
//                finalColor = vec4<f32>(
//                    vec3<f32>(transmissionSampleColor.r) * BTDF_specular , 1 - transmission
//                );

            }

        }
    }



    // environment
    if (u_useIblTexture) {

        var reflectionDirection: vec3<f32> = reflect(-V, N);
        let reflectionFromEnvironmentSample = (textureSample(iblTexture, iblTextureSampler, reflectionDirection));
        let reflectance = (1.0 - roughnessParameter) * metallicParameter  ;

        let fresnel: vec3<f32> = fresnelSchlick(max(1.0 - VdotH, 0.0), F0) *  (1.0 - roughnessParameter) *  (1.0 - roughnessParameter) * reflectionFromEnvironmentSample.rgb  * VdotH;
        let Metal_result = conductor_fresnel( F0, reflectionFromEnvironmentSample.rgb, VdotH  );
        finalColor = vec4<f32>(
              (mix(finalColor.rgb , Metal_result   , reflectance )
              + specular_specularColorFactor * specular_specularFactor * fresnel * (1-(NdotV )) * (1.0 - roughnessParameter) * (1.0 - roughnessParameter)) * directionalLightColor  * directionalLightIntensity ,
          resultAlpha
      );
    }


    if(u_useKHR_materials_clearcoat){
         if(u_KHR_clearcoatFactor == 0.0){
        }else{
            var clearcoat = u_KHR_clearcoatFactor;
            var clearcoatRoughness = u_KHR_clearcoatRoughnessFactor ;
            var clearcoatNormal:vec3<f32> = N;
            if(u_useKHR_clearcoatTexture){
                let clearcoatSample =  textureSample(KHR_clearcoatTexture, KHR_clearcoatTextureSampler, clearcoatUV);
                clearcoat *= clearcoatSample.r;
            }

            if(u_useKHR_clearcoatRoughnessTexture){
                let clearcoatRoughnesstSample =  textureSample(KHR_clearcoatRoughnessTexture, KHR_clearcoatRoughnessTextureSampler, clearcoatRoughnessUV);
                clearcoatRoughness *= clearcoatRoughnesstSample.g;
            }

            var clearcoatNormalSampler =  textureSample(KHR_clearcoatNormalTexture, KHR_clearcoatNormalTextureSampler, clearcoatNormalUV);
            if(u_useKHR_clearcoatNormalTexture){
                var targetUv = clearcoatNormalUV;
                if(backFaceYn){
                    targetUv = 1.0 - targetUv;
                }
                clearcoatNormal =  vec3<f32>(clearcoatNormalSampler.r,clearcoatNormalSampler.g, clearcoatNormalSampler.b);

                clearcoatNormal = perturb_normal(
                    N2,
                    input_vertexPosition,
                    targetUv,
                    clearcoatNormal,
                    u_normalScale
                ) ;
                if(u_useVertexTangent){
                    if(backFaceYn ){ clearcoatNormal = -clearcoatNormal; }
                }

            }

            let reflectance =  (1.0 - clearcoatRoughness);
            var reflectionDirection: vec3<f32> = reflect(-V, clearcoatNormal);
            reflectionDirection = vec3<f32>(reflectionDirection.x, -reflectionDirection.y, reflectionDirection.z);
            let reflectionFromEnvironmentSample2 = (textureSample(iblTexture, iblTextureSampler, reflectionDirection));

            let F0_dielectric: vec3<f32> = vec3<f32>(pow((1.0 - ior) / (1.0 + ior), 2.0));
            let BRDF_clearcoat = specular_brdf(F0_dielectric,clearcoatNormal,V,L,clearcoatRoughness * clearcoatRoughness  );
            let coated_material =
                fresnel_coat( dot(clearcoatNormal, V), ior, clearcoat, finalColor, vec4<f32>(BRDF_clearcoat,0) );
            finalColor = coated_material;

            if (u_useIblTexture) {

              let t0 = fresnel_coat( dot(clearcoatNormal, V), ior, clearcoat, finalColor, reflectionFromEnvironmentSample2 );
              finalColor = vec4<f32>(t0.rgb *  directionalLightColor  * directionalLightIntensity, t0.a);
            }
        }

    }

{

    // sheen 산란
    var sheenColorFactor = u_KHR_sheenColorFactor;
    var sheenRoughnessFactor = u_KHR_sheenRoughnessFactor;
    if(u_useKHR_materials_sheen){
        if(u_useKHR_sheenColorTexture){
            let sheenColorSampler = textureSample(KHR_sheenColorTexture, KHR_sheenColorTextureSampler,sheenColorUV);
            sheenColorFactor *= sheenColorSampler.rgb;
        }
        if(u_useKHR_sheenRoughnessTexture){
            let sheenRoughnessSampler = textureSample(KHR_sheenRoughnessTexture, KHR_sheenRoughnessTextureSampler,sheenRoughnessUV);
            sheenRoughnessFactor *= sheenRoughnessSampler.a;
        }
        if(sheenRoughnessFactor > 0.0) {
            let alphaG = sheenRoughnessFactor * sheenRoughnessFactor;
            let invR = 1 / alphaG;
            let H = normalize(L + V);
            let NdotH = max(dot(N, H),0.0)  * 0.5 +0.5;
            let NdotL = max(dot(N, L), 0.0) * 0.5 +0.5 ;
            let NdotV = max(dot(N, V), 0.0)  * 0.5 +0.5;
    //        let NdotL = dot(N, L);
    //        let NdotV = dot(N, V) ;
    //        let NdotL = (dot(N, L));
    //        let NdotV = (dot(N, V)) ;
            let sheenVisibility = 1 / (4 * (NdotL + NdotV - NdotL * NdotV));

            let cos2h = NdotH * NdotH;
            let sin2h = 1 - cos2h;
                let sheenDistribution = (2 + invR) * pow(sin2h, invR * 0.5) / (2 * pi);
                let sheenBRDF = sheenColorFactor * sheenDistribution * sheenVisibility ;
    //            finalColor = finalColor + vec4<f32>(sheenColorFactor,0);
    //            finalColor = vec4<f32>(mix(finalColor.rgb, sheenBRDF, sheenVisibility), resultAlpha);
                finalColor = finalColor + vec4<f32>(sheenBRDF,0);
        }
    }


}

    // emissive
    if (u_useEmissiveTexture) {
        let emissiveSamplerColor: vec4<f32> = (textureSample(emissiveTexture, emissiveTextureSampler, emissiveUV));
        finalColor += vec4<f32>( emissiveSamplerColor.rgb * u_emissiveFactor * u_emissiveStrength, 0);
    } else {
        finalColor += (vec4<f32>(u_emissiveFactor * u_emissiveStrength, 0));
    }
    if(uniforms.useTint == 1u){
        finalColor = calcTintBlendMode(finalColor, uniforms.tintBlendMode, uniforms.tint);
    }
    finalColor = linear_to_srgb(finalColor);


//	if( uniforms.alphaBlend != 2 ) {
//        finalColor = vec4<f32>(finalColor.rgb,resultAlpha );
//    }
    // Check if alpha cutoff feature is used
    if (u_useCutOff) {
        // Compare alpha value with preset cutoff value
        if (resultAlpha <= u_cutOff) {
            discard;  // Discard pixel if its alpha value is lower than the predefined cutoff value
        }
    }

    return finalColor;
};
fn specular_btdf(ior: vec3<f32>, n: vec3<f32>, wi: vec3<f32>, wo: vec3<f32>) -> vec3<f32> {
    let eta = vec3<f32>(1.0, 1.0, 1.0) / ior;

    let f0 = ((1.0 - eta) / (1.0 + eta)) * ((1.0 - eta) / (1.0 + eta));

    let cosThetaI = dot(n, wi) * 0.5 + 0.5;
    let sinThetaI = sqrt(max(vec3<f32>(1.0, 1.0, 1.0) - cosThetaI * cosThetaI, vec3<f32>(0.0, 0.0, 0.0)));

    let sinThetaT = eta * sinThetaI;

    if(any(sinThetaT > vec3<f32>(1.0, 1.0, 1.0))) {
        return vec3<f32>(0.0, 0.0, 0.0);
    }

    let cosThetaT = sqrt(max(vec3<f32>(1.0, 1.0, 1.0) - sinThetaT * sinThetaT, vec3<f32>(0.0, 0.0, 0.0)));

    let Fparl = ((eta * cosThetaI - cosThetaT) / (eta * cosThetaI + cosThetaT)) * ((eta * cosThetaI - cosThetaT) / (eta * cosThetaI + cosThetaT));
    let Fperp = ((cosThetaI - eta * cosThetaT) / (cosThetaI + eta * cosThetaT)) * ((cosThetaI - eta * cosThetaT) / (cosThetaI + eta * cosThetaT));

    let Fr = 0.5 * (Fparl + Fperp);

    return vec3<f32>(1.0, 1.0, 1.0) - Fr;
}
const pi = 3.14159;
fn fresnel_coat(NdotV:f32, ior: f32, weight: f32, base: vec4<f32>, layer: vec4<f32>) -> vec4<f32> {
    let f0: f32 = pow((1.0 - ior) / (1.0 + ior), 2.0);
    let fr: f32 = f0 + (1.0 - f0) * pow(1.0 - abs(NdotV), 5.0);
    return mix(base, layer, weight * fr);
}
fn conductor_fresnel(F0: vec3<f32>, bsdf: vec3<f32>, VdotH: f32) -> vec3<f32> {
    return bsdf * (F0 + (1 - F0) * pow((1 - abs(VdotH)),5));
}
fn fresnel_mix(ior: f32, base: vec3<f32>, layer: vec3<f32>, VdotH:f32 ) -> vec3<f32> {
    var f0: f32 = pow((1.0 - ior) / (1.0 + ior), 2.0);
    var fr: f32 = f0 + (1.0 - f0) * pow(1.0 - abs(VdotH), 5.0) ;
    return mix(base, layer, fr);
}
fn max_value(v: vec3<f32>) -> f32{
    return max(max(v.x, v.y), v.z);
}
fn fresnel_mix_KHR_materials_specular(f0_color: vec3<f32>, ior: f32, weight: f32, base: vec3<f32>, layer: vec3<f32>, VdotH: f32) -> vec3<f32> {
    var f0: vec3<f32> = pow((1.0 - ior) / (1.0 + ior), 2.0) * f0_color;
    f0 = min(f0, vec3<f32>(1.0, 1.0, 1.0));
    var fr: vec3<f32> = f0 + (1.0 - f0) * pow(1.0 - abs(VdotH), 5.0);
    return (1.0 - weight * max_value(fr)) * base + weight * fr * layer;
}
fn diffuse_brdf(N: vec3<f32>, L: vec3<f32>, Albedo: vec3<f32>) -> vec3<f32> {
    let cos_theta = dot(N, L) * 0.5 + 0.5;
    return Albedo * cos_theta;
//    return (1/pi) * Albedo;
}

fn specular_brdf(F0:vec3<f32>,N: vec3<f32>, V: vec3<f32>, L: vec3<f32>, roughness: f32) -> vec3<f32> {
    let H = normalize(V + L);
    let NdotH = (dot(N, H))  * 0.5 + 0.5;
    let NdotV = (dot(N, V))  * 0.5 + 0.5;
    let NdotL = (dot(N, L)) * 0.5 + 0.5 ;

    let D = ggx_distribution(N, H, roughness * roughness);
    let G = min(1.0, min(2.0 * NdotH * NdotV / NdotH, 2.0 * NdotH * NdotL / NdotH));

    let F = fresnelSchlick(max(1.0 - NdotV, 0.0), F0);

    return (D * G * F) / (4.0 * NdotV * NdotL);
}
fn fresnelSchlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {
    return F0 + (vec3<f32>(1.0, 1.0, 1.0) - F0) * pow(1.0 - cosTheta, 5.0);
}

fn ggx_distribution(N: vec3<f32>, H: vec3<f32>, alpha: f32) -> f32 {
    let a2 = alpha * alpha;
    let NdotH = max(dot(N, H), 0.0);
    let NdotH2 = NdotH * NdotH;

    let den = NdotH2 * (a2 - 1.0) + 1.0;
    let D = a2 / (3.14159 * den * den);

    return max(D, 0.0);
}
fn sRGBToLinear(srgb: vec4<f32>) -> vec4<f32> {
  let scale = vec3<f32>(12.92);
  let offset = vec3<f32>(0.055);
  let power = vec3<f32>(2.4);
  let threshold = vec3<f32>(0.04045);
  return vec4<f32>(
  select(
        srgb.rgb / scale,
        pow((srgb.rgb + offset) / (1.0 + offset), power),
        srgb.rgb > threshold
    ),
    srgb.a
  );
}
// Linear to sRGB
fn linear_to_srgb( color:vec4<f32>) -> vec4<f32> {
  let scale = vec3<f32>(12.92);
  let offset = vec3<f32>(0.055);
  let power = vec3<f32>(1.0 / 2.4);
  let threshold = vec3<f32>(0.0031308);
  return vec4<f32>(
    select(
          color.rgb * scale,
          (1.0 + offset) * pow(color.rgb, power) - offset,
          color.rgb > threshold
      ),
      color.a
  );
}
fn transform_texture_coordinate(
  uv: vec2<f32>, offset:vec2<f32>,  rotation:f32,scale:vec2<f32>) -> vec2<f32> {
    let translation : mat3x3<f32> = mat3x3<f32>(
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        offset.x, offset.y, 1.0
    );

    let rotation_matrix : mat3x3<f32> = mat3x3<f32>(
        cos(rotation), -sin(rotation), 0.0,
        sin(rotation), cos(rotation), 0.0,
        0.0, 0.0, 1.0
    );

    let scale_matrix : mat3x3<f32> = mat3x3<f32>(
        scale.x, 0.0, 0.0,
        0.0, scale.y, 0.0,
        0.0, 0.0, 1.0
    );

    let result_matrix = translation * rotation_matrix * scale_matrix;
    return (result_matrix * vec3<f32>(uv, 1.0)).xy;
}

