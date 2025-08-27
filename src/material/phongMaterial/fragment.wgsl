#redgpu_include SYSTEM_UNIFORM;
#redgpu_include calcTintBlendMode;
#redgpu_include calcDirectionalShadowVisibility;
#redgpu_include normalFunctions;
#redgpu_include drawPicking;
#redgpu_include FragmentOutput;
struct Uniforms {
    color: vec3<f32>,
    //
    emissiveColor: vec3<f32>,
    emissiveStrength:f32,
    //
    specularColor:vec3<f32>,
    specularStrength:f32,
    shininess: f32,
    //
    aoStrength:f32,
    //
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
    @location(3) motionVector: vec3<f32>,
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
fn main(inputData:InputData) -> FragmentOutput {
    var output: FragmentOutput;
    // AmbientLight
    let u_ambientLight = systemUniforms.ambientLight;
    let u_ambientLightColor = u_ambientLight.color;
    let u_ambientLightIntensity = u_ambientLight.intensity;

    // DirectionalLight
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    let u_shadowDepthTextureSize = systemUniforms.shadowDepthTextureSize;
    let u_bias = systemUniforms.bias;


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
    let E = normalize(u_cameraPosition - inputData.vertexPosition);

    // Shadow
    let receiveShadowYn = inputData.receiveShadow != .0;


    //

    // Vertex Normal
    var N = normalize(inputData.vertexNormal) ;
    #redgpu_if normalTexture
        let normalSamplerColor = textureSample(normalTexture, normalTextureSampler, inputData.uv).rgb;
        N = perturb_normal( N, inputData.vertexPosition, inputData.uv, normalSamplerColor, u_normalScale ) ;
    #redgpu_endIf
    //
    var finalColor:vec4<f32>;
    var resultAlpha:f32 = u_opacity * inputData.combinedOpacity;
    var diffuseColor:vec3<f32> = u_color;

    #redgpu_if diffuseTexture
        let diffuseSampleColor = textureSample(diffuseTexture,diffuseTextureSampler, inputData.uv);
        diffuseColor = diffuseSampleColor.rgb;
        resultAlpha = resultAlpha * diffuseSampleColor.a;
    #redgpu_endIf

    var specularSamplerValue:f32 = 1;
    #redgpu_if specularTexture
        specularSamplerValue = textureSample(specularTexture,specularTextureSampler, inputData.uv).r ;
    #redgpu_endIf
    var mixColor:vec3<f32>;

    // 암비안트 라이트 처리 추가
    let ambientContribution = u_ambientLightColor * u_ambientLightIntensity;
    let ambientDiffuse = diffuseColor * ambientContribution;
    mixColor += ambientDiffuse;

    var visibility:f32 = 1.0;
     visibility = calcDirectionalShadowVisibility(
                directionalShadowMap,
                directionalShadowMapSampler,
                u_shadowDepthTextureSize,
                u_bias,
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
    let clusterIndex = getClusterLightClusterIndex(inputData.position);
    let lightOffset  = clusterLightGroup.lights[clusterIndex].offset;
    let lightCount:u32   = clusterLightGroup.lights[clusterIndex].count;

    for (var lightIndex = 0u; lightIndex < lightCount; lightIndex = lightIndex + 1u) {
         let i = clusterLightGroup.indices[lightOffset + lightIndex];
         let u_clusterLightPosition = clusterLightList.lights[i].position;
         let u_clusterLightColor = clusterLightList.lights[i].color;
         let u_clusterLightIntensity = clusterLightList.lights[i].intensity;
         let u_clusterLightRadius = clusterLightList.lights[i].radius;
         let u_isSpotLight = clusterLightList.lights[i].isSpotLight;

         let lightDir = u_clusterLightPosition - inputData.vertexPosition;
         let lightDistance = length(lightDir);

         // 거리 범위 체크
         if (lightDistance > u_clusterLightRadius) {
             continue;
         }

         let L = normalize(lightDir);
//         let attenuation = clamp(0.0, 1.0, 1.0 - (lightDistance * lightDistance) / (u_clusterLightRadius * u_clusterLightRadius));
//         let attenuation = clamp(1.0 - (lightDistance * lightDistance) / (u_clusterLightRadius * u_clusterLightRadius), 0.0, 1.0);

        let dist2 = max(dot(lightDir, lightDir), 0.0001);
        let d = sqrt(dist2);
        let rangePart = pow(clamp(1.0 - d / u_clusterLightRadius, 0.0, 1.0), 2.0);
        // 반경 정규화로 중심부 과도한 밝기 방지 (radius^2 스케일)
        let invSquare = (u_clusterLightRadius * u_clusterLightRadius) / dist2;
        let attenuation = rangePart * invSquare;

         var finalAttenuation = attenuation;

         // 스폿라이트 처리
         if (u_isSpotLight > 0.0) {
             let u_clusterLightDirection = normalize(vec3<f32>(
                 clusterLightList.lights[i].directionX,
                 clusterLightList.lights[i].directionY,
                 clusterLightList.lights[i].directionZ
             ));
             let u_clusterLightInnerAngle = clusterLightList.lights[i].innerCutoff;
             let u_clusterLightOuterCutoff = clusterLightList.lights[i].outerCutoff;

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

         let R = reflect(-L, N);
         let diffuse = diffuseColor * max(dot(N, L), 0.0);
         let specular = pow(max(dot(R, E), 0.0), u_shininess) * specularSamplerValue;

         let diffuseAttenuation = finalAttenuation;
         let specularAttenuation = finalAttenuation * finalAttenuation;

         let ld = u_clusterLightColor * diffuse * diffuseAttenuation * u_clusterLightIntensity;
         let ls = u_specularColor * u_specularStrength * specular * specularAttenuation * u_clusterLightIntensity;

         mixColor += ld + ls;
    }


    #redgpu_if alphaTexture
        let alphaMapValue:f32 = textureSample(alphaTexture, alphaTextureSampler, inputData.uv).r;
        resultAlpha = alphaMapValue * resultAlpha;
        if(resultAlpha == 0){ discard ; }
    #redgpu_endIf
    //
    var emissiveColor = u_emissiveColor  * u_emissiveStrength;
    #redgpu_if emissiveTexture
        emissiveColor = textureSample(emissiveTexture, emissiveTextureSampler, inputData.uv).rgb  * u_emissiveStrength;
    #redgpu_endIf
    //
    #redgpu_if aoTexture
        mixColor = mixColor * textureSample(aoTexture, aoTextureSampler, inputData.uv).rgb * u_aoStrength;
    #redgpu_endIf
    //
    finalColor = vec4<f32>(mixColor + emissiveColor, resultAlpha);
    #redgpu_if useTint
        finalColor = calcTintBlendMode(finalColor, uniforms.tintBlendMode, uniforms.tint);
    #redgpu_endIf
    // alpha 값이 0일 경우 discard
    if (systemUniforms.isView3D == 1 && finalColor.a == 0.0) {
      discard;
    }
    output.color = finalColor;
    #redgpu_if useSSR
    {
        let metallicFromShininess = sqrt(2.0 / (uniforms.shininess + 2.0));
        let roughnessFromShininess = 1.0 - (uniforms.shininess / 128.0); // shininess를 러프니스로 변환

        // F0 계산 (물리 기반)
        let F0_dielectric = 0.04;
        let F0_metal = 0.9; // 금속의 평균 반사율
        let F0 = mix(F0_dielectric, F0_metal, metallicFromShininess);

        // 러프니스 보정 (부드러운 감소 곡선)
        let roughnessFactor = 1.0 - smoothstep(0.0, 1.0, roughnessFromShininess);

        // 최종 반사 강도 계산 및 저장
        let finalReflectionStrength = F0 * roughnessFactor;

        output.gBufferNormal = vec4<f32>(normalize(N) * 0.5 + 0.5, finalReflectionStrength);
    }
    #redgpu_endIf
    output.gBufferMotionVector = vec4<f32>( inputData.motionVector, 1.0 );
    return output;
}
