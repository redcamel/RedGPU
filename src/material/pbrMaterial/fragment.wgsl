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
#redgpu_include skyAtmosphere.skyAtmosphereFn

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
    baseColorFactor: vec4<f32>,
    emissiveFactor: vec3<f32>,
    emissiveStrength: f32,
    occlusionStrength: f32,
    metallicFactor: f32,
    roughnessFactor: f32,
    normalScale: f32,
    useKHR_materials_unlit: u32, 
    KHR_materials_ior: f32,      
    useKHR_materials_transmission: u32,
    KHR_transmissionFactor: f32,
    useKHR_materials_diffuse_transmission: u32,
    KHR_diffuseTransmissionFactor: f32,
    KHR_diffuseTransmissionColorFactor: vec3<f32>,
    KHR_dispersion: f32,
    useKHR_materials_volume: u32,
    KHR_thicknessFactor: f32,
    KHR_attenuationDistance: f32,
    KHR_attenuationColor: vec3<f32>,
    useKHR_materials_specular: u32,
    KHR_specularFactor: f32,
    KHR_specularColorFactor: vec3<f32>,
    useKHR_materials_anisotropy: u32,
    KHR_anisotropyStrength: f32,
    KHR_anisotropyRotation: f32,
    useKHR_materials_iridescence: u32,
    KHR_iridescenceFactor: f32,
    KHR_iridescenceIor: f32,
    KHR_iridescenceThicknessMinimum: f32,
    KHR_iridescenceThicknessMaximum: f32,
    useKHR_materials_sheen: u32,
    KHR_sheenColorFactor: vec3<f32>,
    KHR_sheenRoughnessFactor: f32,
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
    let input_vertexNormal = (inputData.vertexNormal.xyz);
    let input_vertexPosition = inputData.vertexPosition.xyz;
    let input_vertexColor_0 = inputData.vertexColor_0;
    let input_vertexTangent = inputData.vertexTangent;
    let input_ndcPosition = inputData.position.xyz / inputData.position.w ;
    let input_uv = inputData.uv;
    let input_uv1 = inputData.uv1;
    let u_camera = systemUniforms.camera;
    let u_cameraPosition = u_camera.cameraPosition;
    
    // Cache common system values
    let preExposure = systemUniforms.preExposure;
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;

    // Material Uniforms
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

    // UV Transforms
    let diffuseUV = getTextureTransformUV(input_uv, input_uv1, uniforms.baseColorTexture_texCoord_index, uniforms.use_baseColorTexture_KHR_texture_transform, uniforms.baseColorTexture_KHR_texture_transform_offset, uniforms.baseColorTexture_KHR_texture_transform_rotation, uniforms.baseColorTexture_KHR_texture_transform_scale);
    let emissiveUV = getTextureTransformUV(input_uv, input_uv1, uniforms.emissiveTexture_texCoord_index, uniforms.use_emissiveTexture_KHR_texture_transform, uniforms.emissiveTexture_KHR_texture_transform_offset, uniforms.emissiveTexture_KHR_texture_transform_rotation, uniforms.emissiveTexture_KHR_texture_transform_scale);
    let occlusionUV = getTextureTransformUV(input_uv, input_uv1, uniforms.occlusionTexture_texCoord_index, uniforms.use_occlusionTexture_KHR_texture_transform, uniforms.occlusionTexture_KHR_texture_transform_offset, uniforms.occlusionTexture_KHR_texture_transform_rotation, uniforms.occlusionTexture_KHR_texture_transform_scale);
    let metallicRoughnessUV = getTextureTransformUV(input_uv, input_uv1, uniforms.metallicRoughnessTexture_texCoord_index, uniforms.use_metallicRoughnessTexture_KHR_texture_transform, uniforms.metallicRoughnessTexture_KHR_texture_transform_offset, uniforms.metallicRoughnessTexture_KHR_texture_transform_rotation, uniforms.metallicRoughnessTexture_KHR_texture_transform_scale);
    let normalUV = getTextureTransformUV(input_uv, input_uv1, uniforms.normalTexture_texCoord_index, uniforms.use_normalTexture_KHR_texture_transform, uniforms.normalTexture_KHR_texture_transform_offset, uniforms.normalTexture_KHR_texture_transform_rotation, uniforms.normalTexture_KHR_texture_transform_scale);
    let KHR_clearcoatUV = getTextureTransformUV(input_uv, input_uv1, uniforms.KHR_clearcoatTexture_texCoord_index, uniforms.use_KHR_clearcoatTexture_KHR_texture_transform, uniforms.KHR_clearcoatTexture_KHR_texture_transform_offset, uniforms.KHR_clearcoatTexture_KHR_texture_transform_rotation, uniforms.KHR_clearcoatTexture_KHR_texture_transform_scale);
    #redgpu_if useKHR_materials_clearcoat
    let KHR_clearcoatNormalUV = getTextureTransformUV(input_uv, input_uv1, uniforms.KHR_clearcoatNormalTexture_texCoord_index, uniforms.use_KHR_clearcoatNormalTexture_KHR_texture_transform, uniforms.KHR_clearcoatNormalTexture_KHR_texture_transform_offset, uniforms.KHR_clearcoatNormalTexture_KHR_texture_transform_rotation, uniforms.KHR_clearcoatNormalTexture_KHR_texture_transform_scale);
    #redgpu_endIf
    let KHR_clearcoatRoughnessUV = getTextureTransformUV(input_uv, input_uv1, uniforms.KHR_clearcoatRoughnessTexture_texCoord_index, uniforms.use_KHR_clearcoatRoughnessTexture_KHR_texture_transform, uniforms.KHR_clearcoatRoughnessTexture_KHR_texture_transform_offset, uniforms.KHR_clearcoatRoughnessTexture_KHR_texture_transform_rotation, uniforms.KHR_clearcoatRoughnessTexture_KHR_texture_transform_scale);
    let KHR_sheenColorUV = getTextureTransformUV(input_uv, input_uv1, uniforms.KHR_sheenColorTexture_texCoord_index, uniforms.use_KHR_sheenColorTexture_KHR_texture_transform, uniforms.KHR_sheenColorTexture_KHR_texture_transform_offset, uniforms.KHR_sheenColorTexture_KHR_texture_transform_rotation, uniforms.KHR_sheenColorTexture_KHR_texture_transform_scale);
    let KHR_sheenRoughnessUV = getTextureTransformUV(input_uv, input_uv1, uniforms.KHR_sheenRoughnessTexture_texCoord_index, uniforms.use_KHR_sheenRoughnessTexture_KHR_texture_transform, uniforms.KHR_sheenRoughnessTexture_KHR_texture_transform_offset, uniforms.KHR_sheenRoughnessTexture_KHR_texture_transform_rotation, uniforms.KHR_sheenRoughnessTexture_KHR_texture_transform_scale);
    let KHR_specularTextureUV = getTextureTransformUV(input_uv, input_uv1, uniforms.KHR_specularTexture_texCoord_index, uniforms.use_KHR_specularTexture_KHR_texture_transform, uniforms.KHR_specularTexture_KHR_texture_transform_offset, uniforms.KHR_specularTexture_KHR_texture_transform_rotation, uniforms.KHR_specularTexture_KHR_texture_transform_scale);
    let KHR_specularColorTextureUV = getTextureTransformUV(input_uv, input_uv1, uniforms.KHR_specularColorTexture_texCoord_index, uniforms.use_KHR_specularColorTexture_KHR_texture_transform, uniforms.KHR_specularColorTexture_KHR_texture_transform_offset, uniforms.KHR_specularColorTexture_KHR_texture_transform_rotation, uniforms.KHR_specularColorTexture_KHR_texture_transform_scale);
    let KHR_iridescenceTextureUV = getTextureTransformUV(input_uv, input_uv1, uniforms.KHR_iridescenceTexture_texCoord_index, uniforms.use_KHR_iridescenceTexture_KHR_texture_transform, uniforms.KHR_iridescenceTexture_KHR_texture_transform_offset, uniforms.KHR_iridescenceTexture_KHR_texture_transform_rotation, uniforms.KHR_iridescenceTexture_KHR_texture_transform_scale);
    let KHR_iridescenceThicknessTextureUV = getTextureTransformUV(input_uv, input_uv1, uniforms.KHR_iridescenceThicknessTexture_texCoord_index, uniforms.use_KHR_iridescenceThicknessTexture_KHR_texture_transform, uniforms.KHR_iridescenceThicknessTexture_KHR_texture_transform_offset, uniforms.KHR_iridescenceThicknessTexture_KHR_texture_transform_rotation, uniforms.KHR_iridescenceThicknessTexture_KHR_texture_transform_scale);
    let KHR_transmissionUV = getTextureTransformUV(input_uv, input_uv1, uniforms.KHR_transmissionTexture_texCoord_index, uniforms.use_KHR_transmissionTexture_KHR_texture_transform, uniforms.KHR_transmissionTexture_KHR_texture_transform_offset, uniforms.KHR_transmissionTexture_KHR_texture_transform_rotation, uniforms.KHR_transmissionTexture_KHR_texture_transform_scale);
    let KHR_diffuseTransmissionUV = getTextureTransformUV(input_uv, input_uv1, uniforms.KHR_diffuseTransmissionTexture_texCoord_index, uniforms.use_KHR_diffuseTransmissionTexture_KHR_texture_transform, uniforms.KHR_diffuseTransmissionTexture_KHR_texture_transform_offset, uniforms.KHR_diffuseTransmissionTexture_KHR_texture_transform_rotation, uniforms.KHR_diffuseTransmissionTexture_KHR_texture_transform_scale);
    let KHR_diffuseTransmissionColorUV = getTextureTransformUV(input_uv, input_uv1, uniforms.KHR_diffuseTransmissionColorTexture_texCoord_index, uniforms.use_KHR_diffuseTransmissionColorTexture_KHR_texture_transform, uniforms.KHR_diffuseTransmissionColorTexture_KHR_texture_transform_offset, uniforms.KHR_diffuseTransmissionColorTexture_KHR_texture_transform_rotation, uniforms.KHR_diffuseTransmissionColorTexture_KHR_texture_transform_scale);
    let KHR_anisotropyUV = getTextureTransformUV(input_uv, input_uv1, uniforms.KHR_anisotropyTexture_texCoord_index, uniforms.use_KHR_anisotropyTexture_KHR_texture_transform, uniforms.KHR_anisotropyTexture_KHR_texture_transform_offset, uniforms.KHR_anisotropyTexture_KHR_texture_transform_rotation, uniforms.KHR_anisotropyTexture_KHR_texture_transform_scale);
    
    // Core Vectors
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
    
    // Cache TBN if needed
    let tbnNeeded = 
        #redgpu_if normalTexture
        true ||
        #redgpu_endIf
        #redgpu_if useKHR_materials_clearcoat
        true ||
        #redgpu_endIf
        #redgpu_if useKHR_materials_anisotropy
        true ||
        #redgpu_endIf
        false;
        
    var tbn: mat3x3<f32>;
    if (tbnNeeded) {
        tbn = getTBNFromVertexTangent(baseNormal, input_vertexTangent);
    }

    #redgpu_if normalTexture
    {
        var normalSamplerColor = textureSample(normalTexture, normalTextureSampler, normalUV).rgb;
        N = getNormalFromNormalMap(vec3<f32>(normalSamplerColor.r, 1.0 - normalSamplerColor.g, normalSamplerColor.b), tbn, u_normalScale );
    }
    #redgpu_endIf
    if (backFaceYn) {
        N = -N;
    }
    N = normalize(N);
    let NdotV = max(abs(dot(N, V)), 1e-6);

    // Shadow
    let receiveShadowYn = inputData.receiveShadow != 0.0;
    var visibility:f32 = 1.0;
    visibility = getDirectionalShadowVisibility(directionalShadowMap, directionalShadowMapSampler, systemUniforms.shadow.directionalShadowDepthTextureSize, systemUniforms.shadow.directionalShadowBias, inputData.shadowCoord);
    if(!receiveShadowYn){ visibility = 1.0; }

    // Base Color & Alpha
    var baseColor = u_baseColorFactor;
    var resultAlpha:f32 = u_opacity * baseColor.a;
    baseColor *= select(vec4<f32>(1.0), input_vertexColor_0, u_useVertexColor);
    #redgpu_if baseColorTexture
       let diffuseSampleColor =  (textureSample(baseColorTexture, baseColorTextureSampler, diffuseUV));
       baseColor *= diffuseSampleColor;
       resultAlpha *= diffuseSampleColor.a;
    #redgpu_endIf
    
    #redgpu_if useKHR_materials_unlit
    if(u_useKHR_materials_unlit){
        output.color = vec4<f32>(baseColor.rgb * preExposure, baseColor.a);
        return output;
    }
    #redgpu_endIf

    let albedo:vec3<f32> = baseColor.rgb ;
    var ior:f32 = u_KHR_materials_ior;

    // PBR Parameters
    var occlusionParameter:f32 = 1.0;
    #redgpu_if useOcclusionTexture
        occlusionParameter = textureSample(packedORMTexture, packedTextureSampler, occlusionUV).r * u_occlusionStrength;
    #redgpu_endIf
    var metallicParameter: f32 = u_metallicFactor;
    var roughnessParameter: f32 = u_roughnessFactor;
    #redgpu_if useMetallicRoughnessTexture
        let metallicRoughnessSample = (textureSample(packedORMTexture, packedTextureSampler, metallicRoughnessUV));
        metallicParameter *= metallicRoughnessSample.b;
        roughnessParameter *= metallicRoughnessSample.g;
    #redgpu_endIf
    roughnessParameter = max(roughnessParameter, 0.045);
    if (abs(ior - 1.0) < EPSILON) { roughnessParameter = 0.0; }

    // Clearcoat
    var clearcoatParameter = u_KHR_clearcoatFactor;
    var clearcoatRoughnessParameter = u_KHR_clearcoatRoughnessFactor ;
    var clearcoatNormal:vec3<f32> = select(baseNormal, -baseNormal, backFaceYn);
    #redgpu_if useKHR_materials_clearcoat
    {
        if(clearcoatParameter > 0.0){
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
                let clearcoatNormalSamplerColor = textureSample(KHR_clearcoatNormalTexture, baseColorTextureSampler, KHR_clearcoatNormalUV).rgb;
                let texturedNormal = getNormalFromNormalMap(clearcoatNormalSamplerColor, tbn, u_KHR_clearcoatNormalScale);
                clearcoatNormal = select(texturedNormal, -texturedNormal, backFaceYn);
            }
            #redgpu_endIf
            clearcoatNormal = normalize(clearcoatNormal);
        }
    }
    #redgpu_endIf

    // Specular
    var specularParameter = u_KHR_specularFactor;
    var specularColor = u_KHR_specularColorFactor;
    #redgpu_if useKHR_materials_specular
        #redgpu_if KHR_specularColorTexture
            specularColor *= textureSample(KHR_specularColorTexture, KHR_specularColorTextureSampler, KHR_specularColorTextureUV).rgb;
        #redgpu_endIf
        #redgpu_if KHR_specularTexture
            specularParameter *= textureSample(KHR_specularTexture, KHR_specularTextureSampler, KHR_specularTextureUV).a;
        #redgpu_endIf
    #redgpu_endIf

    // Transmission & Volume
    var transmissionParameter: f32 = u_KHR_transmissionFactor;
    var thicknessParameter: f32 = u_KHR_thicknessFactor;
    #redgpu_if useKHR_materials_transmission
        #redgpu_if useKHR_transmissionTexture
          transmissionParameter *= textureSample(packedKHR_clearcoatTexture_transmission, packedTextureSampler, KHR_transmissionUV).b;
        #redgpu_endIf
        #redgpu_if useKHR_thicknessTexture
          thicknessParameter *= textureSample(packedKHR_clearcoatTexture_transmission, packedTextureSampler, KHR_transmissionUV).a;
        #redgpu_endIf
    #redgpu_endIf

    var diffuseTransmissionColor:vec3<f32> = u_KHR_diffuseTransmissionColorFactor;
    var diffuseTransmissionParameter : f32 = u_KHR_diffuseTransmissionFactor;
    #redgpu_if useKHR_materials_diffuse_transmission
        #redgpu_if useKHR_diffuseTransmissionTexture
            diffuseTransmissionParameter *= textureSample(packedKHR_diffuse_transmission, packedTextureSampler, KHR_diffuseTransmissionUV).a;
        #redgpu_endIf
        #redgpu_if useKHR_diffuseTransmissionColorTexture
            diffuseTransmissionColor *= textureSample(packedKHR_diffuse_transmission, packedTextureSampler, KHR_diffuseTransmissionColorUV).rgb;
        #redgpu_endIf
    #redgpu_endIf

    // Sheen
    var sheenColor = u_KHR_sheenColorFactor;
    var sheenRoughnessParameter = u_KHR_sheenRoughnessFactor;
    #redgpu_if useKHR_materials_sheen
        #redgpu_if useKHR_sheenColorTexture
            sheenColor *= textureSample(packedKHR_sheen, packedTextureSampler, KHR_sheenColorUV).rgb;
        #redgpu_endIf
        #redgpu_if useKHR_sheenRoughnessTexture
            sheenRoughnessParameter *= textureSample(packedKHR_sheen, packedTextureSampler, KHR_sheenRoughnessUV).a;
        #redgpu_endIf
    #redgpu_endIf

    // Iridescence
    var iridescenceParameter = u_KHR_iridescenceFactor;
    var iridescenceThickness = u_KHR_iridescenceThicknessMaximum;
    #redgpu_if useKHR_materials_iridescence
        #redgpu_if useKHR_iridescenceTexture
            iridescenceParameter *= textureSample(packedKHR_iridescence, packedTextureSampler, KHR_iridescenceTextureUV).r;
        #redgpu_endIf
        #redgpu_if useKHR_iridescenceThicknessTexture
            iridescenceThickness = mix(u_KHR_iridescenceThicknessMinimum, u_KHR_iridescenceThicknessMaximum, textureSample(packedKHR_iridescence, packedTextureSampler, KHR_iridescenceThicknessTextureUV).g);
        #redgpu_endIf
    #redgpu_endIf

    // Anisotropy
    var anisotropy: f32 = u_KHR_anisotropyStrength;
    var anisotropicT: vec3<f32> = vec3<f32>(1.0);
    var anisotropicB: vec3<f32>= vec3<f32>(1.0);
    #redgpu_if useKHR_materials_anisotropy
    {
       let T = tbn[0];
       let B = tbn[1];
       var anisotropicDirection: vec2<f32> = vec2<f32>(1.0, 0.0);
       if(u_useKHR_anisotropyTexture){
           let anisotropyTex = textureSample(KHR_anisotropyTexture, baseColorTextureSampler, KHR_anisotropyUV).rgb;
           anisotropicDirection = anisotropyTex.rg * 2.0 - 1.0;
           anisotropy *= anisotropyTex.b;
       }
       let cosR = cos(u_KHR_anisotropyRotation);
       let sinR = sin(u_KHR_anisotropyRotation);
       anisotropicDirection = mat2x2<f32>(cosR, sinR, -sinR, cosR) * anisotropicDirection;
       let anisotropicTBN = getTBN(N, T * anisotropicDirection.x + B * anisotropicDirection.y);
       anisotropicT = anisotropicTBN[0];
       anisotropicB = anisotropicTBN[1];
    }
    #redgpu_endIf

    // Transmission Refraction (Indirect)
    var transmissionRefraction = vec3<f32>(0.0);
    #redgpu_if useKHR_materials_transmission
    {
        transmissionRefraction = getTransmissionRefraction(u_useKHR_materials_volume, thicknessParameter * inputData.localNodeScale_volumeScale[1] , u_KHR_dispersion, u_KHR_attenuationDistance , u_KHR_attenuationColor, ior, roughnessParameter, albedo, systemUniforms.projection.projectionViewMatrix, input_vertexPosition, input_ndcPosition, V, N, renderPath1ResultTexture, renderPath1ResultTextureSampler);
        
        #redgpu_if useKHR_materials_volume
        if (u_useKHR_materials_volume) {
            let localNodeScale = inputData.localNodeScale_volumeScale[0];
            let scaledThickness = thicknessParameter * localNodeScale;
            let safeAttenuationColor = clamp(u_KHR_attenuationColor, vec3<f32>(EPSILON), vec3<f32>(1.0));
            let safeAttenuationDistance = max(u_KHR_attenuationDistance, EPSILON);
            let attenuationCoefficient = -log(safeAttenuationColor) / safeAttenuationDistance;
            let pathLength = scaledThickness / max(NdotV, 0.04);
            transmissionRefraction *= exp(-attenuationCoefficient * pathLength);
        }
        #redgpu_endIf
    }
    #redgpu_endIf

    // Fresnel F0
    let F0_dielectric_base = getDielectricF0(ior);
    var F0_dielectric = F0_dielectric_base * specularColor;
    var F0_metal = albedo;
    #redgpu_if useKHR_materials_iridescence
        if (iridescenceParameter > 0.0) {
            F0_dielectric = getIridescentFresnel(1.0, u_KHR_iridescenceIor, F0_dielectric, iridescenceThickness, iridescenceParameter, NdotV);
            F0_metal = getIridescentFresnel(1.0, u_KHR_iridescenceIor, albedo, iridescenceThickness, iridescenceParameter, NdotV);
        }
    #redgpu_endIf
    let F0 = mix(F0_dielectric, F0_metal, metallicParameter);

    // Final Orchestration
    let totalDirectLighting = getDirectPbrLighting(
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
    let indirectLighting = getIndirectPbrLighting(
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
    
    var emissiveColor = u_emissiveFactor * u_emissiveStrength * preExposure * systemUniforms.emissiveIntensity;
    #redgpu_if emissiveTexture
        emissiveColor *= textureSample(emissiveTexture, emissiveTextureSampler, emissiveUV).rgb;
    #redgpu_endIf
    
    let finalColor = vec4<f32>(totalDirectLighting + indirectLighting + emissiveColor, resultAlpha);

    #redgpu_if useCutOff
        if (resultAlpha <= u_cutOff) { discard; }
    #redgpu_endIf
    
    output.color = finalColor;
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

fn getDirectSpecularBTDF(
    NdotV: f32,
    NdotL: f32,
    NdotH: f32,
    VdotH: f32,
    LdotH: f32,
    roughness: f32,
    F: vec3<f32>,
    ior: f32
) -> vec3<f32> {
    let eta: f32 = 1.0 / ior;
    let D_rough: f32 = getSpecularNDF(NdotH, roughness);
    let t: f32 = clamp((ior - 1.0) * 100.0, 0.0, 1.0);
    let D: f32 = mix(1.0, D_rough, t);
    let G: f32 = min(1.0, min((2.0 * NdotH * NdotV) / VdotH, (2.0 * NdotH * abs(NdotL)) / VdotH));
    let denom = (eta * VdotH + LdotH) * (eta * VdotH + LdotH);
    let btdf: vec3<f32> =
        (vec3<f32>(1.0) - F) *
        abs(VdotH * LdotH) *
        (eta * eta) *
        D *
        G /
        (max(NdotV, EPSILON) * max(abs(NdotL), EPSILON) * max(denom, EPSILON));
    return btdf;
}

fn getDirectDiffuseBTDF(N: vec3<f32>, L: vec3<f32>, albedo: vec3<f32>) -> vec3<f32> {
    let cosTheta = max(-dot(N, L), 0.0);
    return albedo * cosTheta * INV_PI;
}

// =============================================================================
// KHR Extensions (Sheen, Anisotropy, Clearcoat, Iridescence)
// =============================================================================
struct SheenIBLResult {
    sheenIBLContribution: vec3<f32>,
    sheenAlbedoScaling: f32
}

fn getSheenAlbedoScaling(maxSheenColor: f32, sheenE: f32) -> f32 {
    return 1.0 - maxSheenColor * sheenE;
}

fn getIndirectSheenDFG(NdotV: f32, roughness: f32) -> f32 {
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

fn getIndirectSheenBRDF(
    N: vec3<f32>,
    V: vec3<f32>,
    R: vec3<f32>,
    sheenColor: vec3<f32>,
    maxSheenColor: f32,
    sheenRoughness: f32,
    iblMipmapCount: f32,
    irradianceTexture: texture_cube<f32>,
    textureSampler: sampler
) -> SheenIBLResult {
    let NdotV = clamp(dot(N, V), EPSILON, 1.0);
    let mipLevel = sheenRoughness * iblMipmapCount;
    let sheenRadiance = textureSampleLevel(irradianceTexture, textureSampler, R, mipLevel).rgb * systemUniforms.preExposure * systemUniforms.iblIntensity;
    
    // Optimized Sheen DFG and Charlie E
    let r = clamp(sheenRoughness, 0.01, 1.0);
    let grazingFactor = 1.0 - NdotV;
    let roughnessExp = 1.0 / r;
    let sharedPow = pow(grazingFactor, roughnessExp);
    
    let sheenDFG = sharedPow * pow(roughnessExp, 0.5) * 0.5;
    let E = sharedPow * pow(r, 0.5);
    
    let contribution = sheenRadiance * sheenColor * sheenDFG;
    let albedoScaling = getSheenAlbedoScaling(maxSheenColor, E);
    return SheenIBLResult(contribution, albedoScaling);
}

fn getDirectSheenBRDF(NdotL: f32, NdotV: f32, NdotH: f32, sheenColor: vec3<f32>, sheenRoughness: f32) -> vec3<f32> {
    let invAlpha = 1.0 / max(sheenRoughness, 0.000001);
    let cos2h = NdotH * NdotH;
    let sin2h = max(1.0 - cos2h, 0.0078125);
    let sheenDistribution = (2.0 + invAlpha) * pow(sin2h, invAlpha * 0.5) / (2.0 * PI);
    let sheenVisibility = 1.0 / (4.0 * (NdotL + NdotV - NdotL * NdotV));
    return sheenColor * sheenDistribution * sheenVisibility;
}

fn getDirectAnisotropicVisibility(
    NdotL: f32, NdotV: f32, BdotV: f32, TdotV: f32, TdotL: f32, BdotL: f32, 
    at: f32, ab: f32
) -> f32 {
   let GGXV = NdotL * length(vec3<f32>(at * TdotV, ab * BdotV, NdotV));
   let GGXL = NdotV * length(vec3<f32>(at * TdotL, ab * BdotL, NdotL));
   let v = 0.5 / max(GGXV + GGXL, EPSILON);
   return v;
}

fn getDirectAnisotropicNDF(NdotH: f32, TdotH: f32, BdotH: f32, at: f32, ab: f32) -> f32 {
    let a2: f32 = at * ab;
    let f: vec3<f32> = vec3<f32>(ab * TdotH, at * BdotH, a2 * NdotH);
    let denominator: f32 = dot(f, f);
    let w2: f32 = a2 / max(denominator, EPSILON);
    return a2 * w2 * w2 * INV_PI;
}

fn getDirectAnisotropicBRDF(
    F: vec3<f32>, 
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
    var at = mix(alphaRoughness, 1.0, anisotropy * anisotropy);
    var ab = alphaRoughness;
    var V: f32 = getDirectAnisotropicVisibility(NdotL, NdotV, BdotV, TdotV, TdotL, BdotL, at, ab);
    var D: f32 = getDirectAnisotropicNDF(NdotH, TdotH, BdotH, at, ab);
    return F * (V * D);
}

fn getIndirectAnisotropicBRDF(
    V: vec3<f32>, N: vec3<f32>,
    roughness: f32, anisotropy: f32,
    anisotropicT: vec3<f32>, anisotropicB: vec3<f32>
) -> vec4<f32> {
    // [EN] Choose the grain direction based on the sign of anisotropy
    let grainDir = select(anisotropicT, anisotropicB, anisotropy >= 0.0);
    
    // [EN] Calculate a bent normal to shift the reflection vector in the direction of the anisotropic stretch.
    // [EN] This is a standard approximation for IBL anisotropy (Filament style).
    let stretch = abs(anisotropy) * (1.0 - roughness);
    
    // [EN] Robust cross product to avoid zero vector when V aligns with grainDir
    var T_perp_V = cross(grainDir, V);
    if (dot(T_perp_V, T_perp_V) < EPSILON) {
         T_perp_V = cross(grainDir, N);
    }
    
    let anisotropicNormal = normalize(cross(T_perp_V, grainDir));
    let bentNormal = normalize(mix(N, anisotropicNormal, stretch));
    let R = reflect(-V, bentNormal);
    
    // [EN] For isotropic lookup, we use a roughness that approximates the anisotropic highlight spread.
    // [EN] Anisotropy narrows the highlight in one direction, so we sharpen the effective roughness slightly.
    let effectiveRoughness = roughness * (1.0 - abs(anisotropy) * (1.0 - roughness));
    
    return vec4<f32>(R, max(effectiveRoughness, 0.04));
}

fn getDirectClearcoatBRDF(
    L: vec3<f32>, V: vec3<f32>, H: vec3<f32>,
    clearcoatNormal: vec3<f32>,
    clearcoatRoughness: f32,
    LdotH: f32
) -> vec3<f32> {
    let clearcoatNdotL = max(dot(clearcoatNormal, L), 0.0);
    let clearcoatNdotV = max(dot(clearcoatNormal, V), 1e-6);
    let clearcoatNdotH = max(dot(clearcoatNormal, H), 0.0);
    let clearcoatF = getFresnel(LdotH, vec3<f32>(0.04));
    let CLEARCOAT_BRDF = getDirectSpecularBRDF(clearcoatF, clearcoatRoughness, clearcoatNdotH, clearcoatNdotV, clearcoatNdotL);
    return CLEARCOAT_BRDF * clearcoatNdotL;
}

fn getIndirectClearcoatBRDF(
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
    transmittanceTexture: texture_2d<f32>,
    mainR: vec3<f32>,
    isMainNormal: bool
) -> vec4<f32> {
    let clearcoatR = select(getReflectionVectorFromViewDirection(V, clearcoatNormal), mainR, isMainNormal);
    let clearcoatNdotV = max(abs(dot(clearcoatNormal, V)), 1e-6);
    let clearcoatMipLevel = clearcoatRoughness * iblMipmapCount;
    var clearcoatRadiance = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, clearcoatR, clearcoatMipLevel).rgb * systemUniforms.preExposure * systemUniforms.iblIntensity;
    if (useSkyAtmosphere) {
        let u_atmo = systemUniforms.skyAtmosphere;
        let ccTrans = getTransmittance(transmittanceTexture, atmosphereSampler, cameraHeight, clearcoatR.y, atmosphereHeight);
        let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
        let atmoMipLevel = clearcoatRoughness * atmoMipCount;
        let ccSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, clearcoatR, atmoMipLevel).rgb * u_atmo.sunIntensity * systemUniforms.preExposure;
        clearcoatRadiance = (clearcoatRadiance * ccTrans) + ccSkyScat;
    }
    let clearcoatEnvBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, clamp(vec2<f32>(clearcoatNdotV, clearcoatRoughness), vec2<f32>(0.005), vec2<f32>(0.995)), 0.0).rg;
    let coatF = getIndirectFresnel(clearcoatNdotV, vec3<f32>(0.04), clearcoatRoughness, pow(1.0 - clearcoatNdotV, 5.0 - 2.0 * clearcoatRoughness)).x;
    let clearcoatIBL_Weight = (0.04 * clearcoatEnvBRDF.x + clearcoatEnvBRDF.y);
    return vec4<f32>(clearcoatRadiance * clearcoatIBL_Weight, coatF);
}

fn getIridescentFresnel(outsideIOR: f32, iridescenceIOR: f32, baseF0: vec3<f32>,
                      iridescenceThickness: f32, iridescenceFactor: f32, cosTheta1: f32) -> vec3<f32> {
    if (iridescenceThickness <= 0.0 || iridescenceFactor <= 0.0) {
        return baseF0;
    }
    let cosTheta1Abs = abs(cosTheta1);
    let safeIridescenceIOR = max(iridescenceIOR, 1.01);
    let sinTheta1 = sqrt(max(0.0, 1.0 - cosTheta1Abs * cosTheta1Abs));
    let sinTheta2 = (outsideIOR / safeIridescenceIOR) * sinTheta1;
    if (sinTheta2 >= 1.0) {
        return baseF0 + iridescenceFactor * (1.0 - baseF0);
    }
    let cosTheta2 = sqrt(1.0 - sinTheta2 * sinTheta2);
    
    // Physics constants
    let opticalThickness = 2.0 * iridescenceThickness * safeIridescenceIOR * cosTheta2;
    let phase = (PI2 * opticalThickness) * vec3<f32>(1.0/650.0, 1.0/510.0, 1.0/475.0);
    let cosPhase = cos(phase);
    let sinPhase = sin(phase);
    
    let outsideCos1 = outsideIOR * cosTheta1Abs;
    let iridescenceCos2 = safeIridescenceIOR * cosTheta2;
    let iridescenceCos1 = safeIridescenceIOR * cosTheta1Abs;
    let outsideCos2 = outsideIOR * cosTheta2;
    
    let r12_s = (outsideCos1 - iridescenceCos2) / max(outsideCos1 + iridescenceCos2, EPSILON);
    let r12_p = (iridescenceCos1 - outsideCos2) / max(iridescenceCos1 + outsideCos2, EPSILON);
    
    let sqrtF0 = sqrt(clamp(baseF0, vec3<f32>(0.01), vec3<f32>(0.99)));
    let safeN3 = (1.0 + sqrtF0) / max(1.0 - sqrtF0, vec3<f32>(EPSILON));
    
    let r23_s = (iridescenceCos2 - safeN3 * cosTheta1Abs) / max(iridescenceCos2 + safeN3 * cosTheta1Abs, vec3<f32>(EPSILON));
    let r23_p = (safeN3 * cosTheta2 - iridescenceCos1) / max(safeN3 * cosTheta2 + iridescenceCos1, vec3<f32>(EPSILON));
    
    let r12_s_vec = vec3<f32>(r12_s);
    let r12_p_vec = vec3<f32>(r12_p);
    
    // S-polarization: (r12 + r23*e^-i phi) / (1 + r12*r23*e^-i phi)
    let denSReal = 1.0 + r12_s_vec * r23_s * cosPhase;
    let denSImag = -r12_s_vec * r23_s * sinPhase;
    let denSSquared = denSReal * denSReal + denSImag * denSImag;
    let numSReal = r12_s_vec + r23_s * cosPhase;
    let numSImag = -r23_s * sinPhase;
    let Rs = (numSReal * numSReal + numSImag * numSImag) / max(denSSquared, vec3<f32>(EPSILON));
    
    // P-polarization
    let denPReal = 1.0 + r12_p_vec * r23_p * cosPhase;
    let denPImag = -r12_p_vec * r23_p * sinPhase;
    let denPSquared = denPReal * denPReal + denPImag * denPImag;
    let numPReal = r12_p_vec + r23_p * cosPhase;
    let numPImag = -r23_p * sinPhase;
    let Rp = (numPReal * numPReal + numPImag * numPImag) / max(denPSquared, vec3<f32>(EPSILON));
    
    let reflectance = clamp(0.5 * (Rs + Rp), vec3<f32>(0.0), vec3<f32>(1.0));
    return mix(baseF0, reflectance, iridescenceFactor);
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

fn getIndirectPbrLighting(
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
    let preExposure = systemUniforms.preExposure;
    if (u_usePrefilterTexture || u_useSkyAtmosphere) {
        var R = getReflectionVectorFromViewDirection(V, N);
        let NdotV_IBL = max(abs(dot(N, V)), 1e-6);
        var iblRoughness = *roughnessParameter;
        #redgpu_if useKHR_materials_anisotropy
        if (anisotropy > 0.0)
        {
            let anisotropicResult = getIndirectAnisotropicBRDF(V, N, iblRoughness, anisotropy, anisotropicT, anisotropicB);
            R = anisotropicResult.xyz;
            iblRoughness = anisotropicResult.w;
        }
        #redgpu_endIf
        var reflectedColor = vec3<f32>(0.0);
        var iblDiffuseColor = vec3<f32>(0.0);
        var iblMipmapCount: f32 = 0.0;
        if (u_usePrefilterTexture) {
            iblMipmapCount = f32(textureNumLevels(ibl_prefilterTexture) - 1);
            var mipLevel = iblRoughness * iblMipmapCount;
            reflectedColor = textureSampleLevel( ibl_prefilterTexture, prefilterTextureSampler, R, mipLevel ).rgb * preExposure * systemUniforms.iblIntensity;
            iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0).rgb * preExposure * systemUniforms.iblIntensity;
        }
        if (u_useSkyAtmosphere) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let camH = u_atmo.cameraHeight;
            let atmH = u_atmo.atmosphereHeight;
            let specTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, R.y, atmH);
            let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
            let atmoMipLevel = iblRoughness * atmoMipCount;
            let specSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, R, atmoMipLevel).rgb * u_atmo.sunIntensity * preExposure;
            reflectedColor = (reflectedColor * specTrans) + specSkyScat;
            let diffTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, N.y, atmH);
            let skyIrradiance = textureSampleLevel(atmosphereIrradianceLUT, atmosphereSampler, N, 0.0).rgb * u_atmo.sunIntensity * preExposure;
            iblDiffuseColor = (iblDiffuseColor * diffTrans) + skyIrradiance;
        }
        let envBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, clamp(vec2<f32>(NdotV_IBL, *roughnessParameter), vec2<f32>(0.005), vec2<f32>(0.995)), 0.0).rg;
        let energyCompensation = 1.0 + F0 * clamp(1.0 / max(envBRDF.x + envBRDF.y, 0.01) - 1.0, 0.0, 1.0);
        reflectedColor *= energyCompensation;
        
        // Optimize Indirect Fresnel by pre-calculating shared pow() term
        let fresnelPower = 5.0 - 2.0 * (*roughnessParameter);
        let fresnelTerm = pow(saturate(1.0 - NdotV_IBL), fresnelPower);
        let FR_dielectric = getIndirectFresnel(NdotV_IBL, F0_dielectric, *roughnessParameter, fresnelTerm);
        let FR_metal      = getIndirectFresnel(NdotV_IBL, F0_metal,      *roughnessParameter, fresnelTerm);        
        let horizonOcclusion = clamp(1.0 + dot(R, N), 0.0, 1.0);
        reflectedColor *= horizonOcclusion;
        let F_IBL_dielectric = FR_dielectric * envBRDF.x + envBRDF.y;
        let F_IBL_metal      = FR_metal * envBRDF.x + envBRDF.y;
        let F_IBL_dielectric_weight = F_IBL_dielectric * specularParameter;
        let specularOcclusion = saturate(dot(R, N) + occlusionParameter);
        let specularAlbedo_IBL = saturate(F0_dielectric * envBRDF.x + envBRDF.y);
        let diffuseWeight_IBL = (vec3<f32>(1.0) - specularAlbedo_IBL * specularParameter);
        var envIBL_DIFFUSE:vec3<f32> = albedo * iblDiffuseColor * diffuseWeight_IBL * INV_PI * occlusionParameter;
        #redgpu_if useKHR_materials_diffuse_transmission
        {
            var backScatteringColor = vec3<f32>(0.0);
            if (u_usePrefilterTexture) {
                let mipLevel = iblRoughness * iblMipmapCount;
                backScatteringColor = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, -N, mipLevel).rgb  * preExposure * systemUniforms.iblIntensity;
            }
            if (u_useSkyAtmosphere) {
                let u_atmo = systemUniforms.skyAtmosphere;
                let backTrans = getTransmittance(transmittanceTexture, atmosphereSampler, u_atmo.cameraHeight, -N.y, u_atmo.atmosphereHeight);
                let backSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, prefilterTextureSampler, -N, 0.0).rgb * u_atmo.sunIntensity * preExposure;
                backScatteringColor = (backScatteringColor * backTrans) + backSkyScat;
            }
            let transmittedIBL = backScatteringColor * diffuseTransmissionColor * (vec3<f32>(1.0) - F_IBL_dielectric_weight);
            envIBL_DIFFUSE = mix(envIBL_DIFFUSE, transmittedIBL, diffuseTransmissionParameter);
        }
        #redgpu_endIf
        var envIBL_SPECULAR_BTDF = vec3<f32>(0.0);
        #redgpu_if useKHR_materials_transmission
        if (transmissionParameter > 0.0) {
            envIBL_SPECULAR_BTDF = transmissionRefraction * (vec3<f32>(1.0) - F_IBL_dielectric_weight) * specularOcclusion;
        }
        #redgpu_endIf
        var sheenIBLContribution = vec3<f32>(0.0);
        var sheenAlbedoScaling: f32 = 1.0;
        #redgpu_if useKHR_materials_sheen
        {
            let maxSheenColor = max(sheenColor.x, max(sheenColor.y, sheenColor.z));
            let sheenResult = getIndirectSheenBRDF(N, V, R, sheenColor, maxSheenColor, sheenRoughnessParameter, iblMipmapCount, ibl_prefilterTexture, prefilterTextureSampler);
            sheenIBLContribution = sheenResult.sheenIBLContribution;
            sheenAlbedoScaling = sheenResult.sheenAlbedoScaling;
        }
        #redgpu_endIf
        let ibl_specular_dielectric = reflectedColor * F_IBL_dielectric_weight * specularOcclusion;
        let ibl_diffuse_dielectric = mix(envIBL_DIFFUSE, envIBL_SPECULAR_BTDF, transmissionParameter);
        let dielectricPart_IBL = ibl_specular_dielectric + ibl_diffuse_dielectric;
        let metallicPart_IBL = reflectedColor * F_IBL_metal * specularOcclusion;
        let baseIndirect = mix(dielectricPart_IBL, metallicPart_IBL, metallicParameter);
        var indirectLighting = (baseIndirect * sheenAlbedoScaling + sheenIBLContribution);
        #redgpu_if useKHR_materials_clearcoat
            if (clearcoatParameter > 0.0) {
                 let u_atmo = systemUniforms.skyAtmosphere;
                 let clearcoatResult = getIndirectClearcoatBRDF(
                     V, clearcoatNormal, clearcoatRoughnessParameter, iblMipmapCount,
                     ibl_prefilterTexture, prefilterTextureSampler, ibl_brdfLUTTexture,
                     u_useSkyAtmosphere, u_atmo.sunIntensity, skyAtmosphere_prefilteredTexture, atmosphereSampler,
                     u_atmo.cameraHeight, u_atmo.atmosphereHeight, transmittanceTexture,
                     R, all(clearcoatNormal == N)
                 );
                 let clearcoatSpecularIBL = clearcoatResult.rgb * clearcoatParameter;
                 let coatF = clearcoatResult.a * clearcoatParameter;
                 indirectLighting = clearcoatSpecularIBL + (vec3<f32>(1.0) - coatF) * indirectLighting;
            }
        #redgpu_endIf
        return indirectLighting;
    } else {
        let ambientContribution = albedo * systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * occlusionParameter * preExposure * INV_PI;
        var indirectLighting = ambientContribution;
        #redgpu_if useKHR_materials_transmission
        if (transmissionParameter > 0.0) {
            let transmissionFresnel = getFresnel(NdotV, F0);
            let transmissionWeight = transmissionParameter * (vec3<f32>(1.0) - transmissionFresnel);
            indirectLighting = mix(ambientContribution, transmissionRefraction, transmissionWeight);
        }
        #redgpu_endIf
        return indirectLighting;
    }
}

fn getDirectPbrLight(
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
    let dLight = lightColor; 
    let NdotL_origin = dot(N, L);
    let NdotL = max(NdotL_origin, 0.0);
    let H = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let LdotH = max(dot(L, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);
    var F: vec3<f32>;
    let dielectric_f0 = F0_base * specularColor;
    let metal_f0 = albedo;
    let combined_f0 = mix(dielectric_f0, metal_f0, metallicParameter);
    if (useIridescence && iridescenceFactor > 0.0) {
        let F_irid_dielectric = getIridescentFresnel(1.0, iridescenceIor, dielectric_f0, iridescenceThickness, iridescenceFactor, VdotH);
        let F_irid_metal = getIridescentFresnel(1.0, iridescenceIor, metal_f0, iridescenceThickness, iridescenceFactor, VdotH);
        F = mix(F_irid_dielectric, F_irid_metal, metallicParameter);
    } else {
        F = getFresnel(VdotH, combined_f0);
    }
    if (abs(ior - 1.0) < EPSILON) { F = vec3<f32>(0.0); }
    var SPEC_BRDF = getDirectSpecularBRDF(F, roughnessParameter, NdotH, VdotN, NdotL);
    if (anisotropy > 0.0) {
        #redgpu_if useKHR_materials_anisotropy
            var TdotL = dot(anisotropicT, L);
            var TdotV = dot(anisotropicT, V);
            var BdotL = dot(anisotropicB, L);
            var TdotH = dot(anisotropicT, H);
            var BdotH = dot(anisotropicB, H);
            var BdotV = dot(anisotropicB, V);
            SPEC_BRDF = getDirectAnisotropicBRDF(F, roughnessParameter * roughnessParameter, VdotH, NdotL, VdotN, NdotH, BdotV, TdotV, TdotL, BdotL, TdotH, BdotH, anisotropy);
        #redgpu_endIf
    }
    if (abs(ior - 1.0) < EPSILON) { SPEC_BRDF = vec3<f32>(0.0); }
    let diffuse_reflection = getDirectDiffuseBRDF(NdotL, VdotN, LdotH, roughnessParameter, albedo);
    var diffuse_transmission = vec3<f32>(0.0);
    #redgpu_if useKHR_materials_diffuse_transmission
    if (u_useKHR_materials_diffuse_transmission) {
        diffuse_transmission = getDirectDiffuseBTDF(N, L, diffuseTransmissionColor);
    }
    #redgpu_endIf
    var specular_transmission = vec3<f32>(0.0);
    #redgpu_if useKHR_materials_transmission
    if (transmissionParameter > 0.0) {
        specular_transmission = getDirectSpecularBTDF(VdotN, NdotL_origin, NdotH, VdotH, LdotH, roughnessParameter, F, ior) * max(-NdotL_origin, 0.0);
        if (abs(ior - 1.0) < EPSILON) { specular_transmission = vec3<f32>(0.0); }
    }
    #redgpu_endIf
    let specular_weight = F * specularParameter;
    let total_diffuse = mix(diffuse_reflection, diffuse_transmission, diffuseTransmissionParameter);
    let dielectricPart = (SPEC_BRDF * specularParameter * NdotL) + mix((vec3<f32>(1.0) - specular_weight) * total_diffuse, specular_transmission, transmissionParameter);
    let metallicPart = SPEC_BRDF * NdotL;
    var result = mix(dielectricPart, metallicPart, metallicParameter);
    #redgpu_if useKHR_materials_sheen
    {
        let maxSheenColor = max(sheenColor.x, max(sheenColor.y, sheenColor.z));
        if (sheenRoughnessParameter > 0.0 && maxSheenColor > 0.001) {
            let sheen_brdf = getDirectSheenBRDF(NdotL, VdotN, NdotH, sheenColor, sheenRoughnessParameter);
            let sheen_albedo_scaling = getSheenAlbedoScaling(maxSheenColor, getSheenCharlieE(VdotN, sheenRoughnessParameter));
            result = result * sheen_albedo_scaling + (sheen_brdf * NdotL);
        }
    }
    #redgpu_endIf
    #redgpu_if useKHR_materials_clearcoat
        if(clearcoatParameter > 0.0){
            let CLEARCOAT_BRDF = getDirectClearcoatBRDF(L, V, H, clearcoatNormal, clearcoatRoughnessParameter, LdotH);
            let coatF = getFresnel(max(dot(clearcoatNormal, V), 1e-6), vec3<f32>(0.04)).x * clearcoatParameter;
            result = CLEARCOAT_BRDF + (vec3<f32>(1.0) - coatF) * result;
        }
    #redgpu_endIf
    return result * dLight;
}
