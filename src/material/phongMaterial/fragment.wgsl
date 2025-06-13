#redgpu_include SYSTEM_UNIFORM;
#redgpu_include calcTintBlendMode;
#redgpu_include calcDirectionalShadowVisibility;
#redgpu_include normalFunctions;
#redgpu_include drawPicking;
struct Uniforms {
    useDiffuseTexture: u32,
    color: vec3<f32>,
    //
    emissiveColor: vec3<f32>,
    emissiveStrength:f32,
    useEmissiveTexture: u32,
    //
    specularColor:vec3<f32>,
    specularStrength:f32,
    useSpecularTexture: u32,
    shininess: f32,
    //
    useAoTexture: u32,
    aoStrength:f32,
    //
    useAlphaTexture: u32,
    //
    useNormalTexture: u32,
    normalScale:f32,
    //
    opacity: f32,
    useTint:u32,
    tint:vec4<f32>,
    tintBlendMode:u32,
    //
};

struct InputData {
    // Built-in attributes
    @builtin(position) position : vec4<f32>,

    // Vertex attributes
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(12) combinedOpacity: f32,
    @location(13) shadowPos: vec3<f32>,
    @location(14) receiveShadow: f32,
    @location(15) pickingId: vec4<f32>,
}

@group(2) @binding(0) var<uniform> uniforms: Uniforms;
@group(2) @binding(1) var diffuseTextureSampler: sampler;
@group(2) @binding(2) var diffuseTexture: texture_2d<f32>;
@group(2) @binding(3) var alphaTextureSampler: sampler;
@group(2) @binding(4) var alphaTexture: texture_2d<f32>;
@group(2) @binding(5) var specularTextureSampler: sampler;
@group(2) @binding(6) var specularTexture: texture_2d<f32>;
@group(2) @binding(7) var emissiveTextureSampler: sampler;
@group(2) @binding(8) var emissiveTexture: texture_2d<f32>;
@group(2) @binding(9) var aoTextureSampler: sampler;
@group(2) @binding(10) var aoTexture: texture_2d<f32>;
@group(2) @binding(11) var normalTextureSampler: sampler;
@group(2) @binding(12) var normalTexture: texture_2d<f32>;


@fragment
fn main(inputData:InputData) -> @location(0) vec4<f32> {

    // AmbientLight
    let u_ambientLight = systemUniforms.ambientLight;
    let u_ambientLightColor = u_ambientLight.color;
    let u_ambientLightIntensity = u_ambientLight.intensity;

    // DirectionalLight
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    let u_directionalLightShadowDepthTextureSize = systemUniforms.directionalLightShadowDepthTextureSize;
    let u_directionalLightShadowBias = systemUniforms.directionalLightShadowBias;


    // Camera
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;


    // Uniforms
    let u_color = uniforms.color;
    let u_aoStrength = uniforms.aoStrength;
    let u_emissiveColor = uniforms.emissiveColor;
    let u_emissiveStrength = uniforms.emissiveStrength;
    let u_normalScale = uniforms.normalScale;
    let u_specularColor = uniforms.specularColor;
    let u_specularStrength = uniforms.specularStrength;
    let u_shininess = uniforms.shininess;
    let u_opacity = uniforms.opacity;
    let E = normalize(u_cameraPosition);
    // Texture
    let u_useDiffuseTexture = uniforms.useDiffuseTexture == 1;
    let u_useAlphaTexture = uniforms.useAlphaTexture == 1;
    let u_useSpecularTexture = uniforms.useSpecularTexture == 1;
    let u_useEmissiveTexture = uniforms.useEmissiveTexture == 1;
    let u_useAoTexture = uniforms.useAoTexture == 1;
    let u_useNormalTexture = uniforms.useNormalTexture == 1;
    // Shadow
    let receiveShadowYn = inputData.receiveShadow != .0;


    //

    // Vertex Normal
    var N = normalize(inputData.vertexNormal);
    if(u_useNormalTexture){
        let normalSamplerColor = textureSample(normalTexture, normalTextureSampler, inputData.uv).rgb;
        N = perturb_normal( N, inputData.vertexPosition, inputData.uv, normalSamplerColor, u_normalScale ) ;
    }else{
        N = N * u_normalScale;
    }
    //
    var finalColor:vec4<f32>;
    var resultAlpha:f32 = u_opacity * inputData.combinedOpacity;
    var diffuseColor:vec3<f32> = u_color;
    if(u_useDiffuseTexture){
        let diffuseSampleColor = textureSample(diffuseTexture,diffuseTextureSampler, inputData.uv);
        diffuseColor = diffuseSampleColor.rgb;
        resultAlpha = resultAlpha * diffuseSampleColor.a;
    }

    var specularSamplerValue:f32 = 1;
    if(u_useSpecularTexture){
        specularSamplerValue = textureSample(specularTexture,specularTextureSampler, inputData.uv).r ;
    }
    var mixColor:vec3<f32>;

    var visibility:f32 = 1.0;
     visibility = calcDirectionalShadowVisibility(
                directionalShadowMap,
                directionalShadowMapSampler,
                u_directionalLightShadowDepthTextureSize,
                u_directionalLightShadowBias,
                inputData.shadowPos,

            );

    if(!receiveShadowYn){
       visibility = 1.0;
    }

    for (var i = 0u; i < u_directionalLightCount; i = i + 1) {
        let u_directionalLightDirection = u_directionalLights[i].direction;
        let u_directionalLightColor = u_directionalLights[i].color;
        let u_directionalLightIntensity = u_directionalLights[i].intensity;

        let L = normalize(u_directionalLightDirection);
        let R = reflect(L, N);
        let lambertTerm = max(dot(N, -L), 0.0);
        let specular = pow(max(dot(R, E), 0.0), u_shininess) * specularSamplerValue;

        // 디렉셔널 라이트 기여도 (쉐도우 적용)
        let lightContribution = u_directionalLightColor * u_directionalLightIntensity * visibility;
        let ld = diffuseColor * lightContribution * lambertTerm;
        let ls = u_specularColor * u_specularStrength * lightContribution * specular;

        mixColor += ld + ls;

    }

    // PointLight
    let clusterIndex = getPointLightClusterIndex(inputData.position);
    let lightOffset  = pointLight_clusterLightGroup.lights[clusterIndex].offset;
    let lightCount:u32   = pointLight_clusterLightGroup.lights[clusterIndex].count;

// for (var lightIndex = 0u; lightIndex < lightCount; lightIndex = lightIndex + 1u) {
//        let i = pointLight_clusterLightGroup.indices[lightOffset + lightIndex];
//        let u_spotLightPosition = pointLightList.lights[i].position;
//        let u_spotLightColor = pointLightList.lights[i].color;
//        let u_spotLightIntensity = pointLightList.lights[i].intensity ;
//        let u_spotLightInnerCutoff = radians(21.0);
//        let u_spotLightOuterCutoff = radians(26.0);
//        let u_spotLightDirection = vec3<f32>(0,-1,0);;
//
//        let L = normalize(u_spotLightPosition - inputData.vertexPosition);
//        let NdotL = max(dot(N, L), 0.0);
//        let H = normalize(L + E);
//        let NdotH = dot(N, H);
//
//        let theta = dot(L, -normalize(u_spotLightDirection));
//
//        let innerCos = cos(u_spotLightInnerCutoff);
//        let outerCos = cos(u_spotLightOuterCutoff);
//        let inLight = smoothstep(outerCos, innerCos, theta);
//
//        let specular = select( 0.0, pow(NdotH, u_shininess), NdotH > 0.0 );
//        let ld = (u_spotLightColor * u_spotLightIntensity) * NdotL * inLight;
//        let ls = u_specularColor * u_specularStrength * specular * inLight;
//
//        mixColor += ld + ls;
//    }


    for (var lightIndex = 0u; lightIndex < lightCount; lightIndex = lightIndex + 1u) {
        let i = pointLight_clusterLightGroup.indices[lightOffset + lightIndex];
        let u_pointLightPosition = pointLightList.lights[i].position;
        let u_pointLightColor = pointLightList.lights[i].color;
        let u_pointLightIntensity = pointLightList.lights[i].intensity ;
        let u_pointLightRadius = pointLightList.lights[i].radius ;

        let lightDir = normalize(u_pointLightPosition - inputData.vertexPosition);
        let lightDistance = length(u_pointLightPosition - inputData.vertexPosition);
        let attenuation = clamp(0.0, 1.0, 1.0 - (lightDistance * lightDistance) / (u_pointLightRadius * u_pointLightRadius));
        if(lightDistance<=u_pointLightRadius){

            let L = normalize(lightDir);
            let R = reflect(-L, N);

            let diffuse = max(dot(N, L), 0.0);
            let specular = pow(max(dot(R, E), 0.0), u_shininess);

            let ld = (u_pointLightColor * u_pointLightIntensity) * diffuse * attenuation * u_pointLightIntensity;
            let ls = u_specularColor * u_specularStrength * specular * attenuation  * u_pointLightIntensity;

            mixColor += ld + ls;
        }
    }


    if(u_useAlphaTexture){
        let alphaMapValue:f32 = textureSample(alphaTexture, alphaTextureSampler, inputData.uv).r;
        resultAlpha = alphaMapValue * resultAlpha;
        if(resultAlpha == 0){
            discard ;
        }
    }
    var emissiveColor = u_emissiveColor  * u_emissiveStrength;
    if(u_useEmissiveTexture){
        emissiveColor = textureSample(emissiveTexture, emissiveTextureSampler, inputData.uv).rgb  * u_emissiveStrength;
    }
    if(u_useAoTexture){
        mixColor = mixColor * textureSample(aoTexture, aoTextureSampler, inputData.uv).rgb * u_aoStrength;
    }
    finalColor = vec4<f32>(mixColor + emissiveColor, resultAlpha);
    if(uniforms.useTint == 1u){
        finalColor = calcTintBlendMode(finalColor, uniforms.tintBlendMode, uniforms.tint);
    }
    // alpha 값이 0일 경우 discard
    if (systemUniforms.isView3D == 1 && finalColor.a == 0.0) {
      discard;
    }
    return finalColor;
}
