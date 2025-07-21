#redgpu_include SYSTEM_UNIFORM;
#redgpu_include calcDirectionalShadowVisibility;
#redgpu_include drawPicking;
#redgpu_include calcPrePathBackground
struct Uniforms {
    color: vec3<f32>,
    ior:f32,
    //
    specularStrength:f32,
    shininess: f32,
    //
    opacity: f32,
    //
};

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) worldPosition: vec3<f32>,  // 🌊 월드 위치 추가
    @location(4) waveHeight: f32,           // 🌊 파도 높이 정보
    @location(9) ndcPosition: vec3<f32>,
    @location(12) combinedOpacity: f32,
    @location(13) shadowPos: vec3<f32>,
    @location(14) receiveShadow: f32,
    @location(15) pickingId: vec4<f32>,

}

@group(2) @binding(0) var<uniform> uniforms: Uniforms;


@fragment
fn main(inputData:InputData) -> @location(0) vec4<f32> {

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
    let u_specularColor = vec3<f32>(1.0);
    let u_specularStrength = uniforms.specularStrength;
    let u_shininess = uniforms.shininess;
    let u_opacity = uniforms.opacity;
    let V = normalize(u_cameraPosition - inputData.vertexPosition);

    // Shadow
    let receiveShadowYn = inputData.receiveShadow != .0;


    //

    // Vertex Normal
    var N = normalize(inputData.vertexNormal) ;
    //
    var finalColor:vec4<f32>;

    var resultAlpha:f32 = u_opacity * inputData.combinedOpacity;

    var diffuseColor:vec3<f32> = u_color;

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
        let specular = pow(max(dot(R, V), 0.0), u_shininess) ;

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
         let attenuation = clamp(1.0 - (lightDistance * lightDistance) / (u_clusterLightRadius * u_clusterLightRadius), 0.0, 1.0);

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
         let specular = pow(max(dot(R, V), 0.0), u_shininess) ;

         let diffuseAttenuation = finalAttenuation;
         let specularAttenuation = finalAttenuation * finalAttenuation;

         let ld = u_clusterLightColor * diffuse * diffuseAttenuation * u_clusterLightIntensity;
         let ls = u_specularColor * u_specularStrength * specular * specularAttenuation * u_clusterLightIntensity;

         mixColor += ld + ls;
    }


    // 🌊 물리 기반 물 렌더링 파라미터
        let waterF0 = 0.02;              // 물의 기본 반사율 (정확한 값)
        let u_ior = uniforms.ior;          // 물의 굴절률 (정확한 값)
        let roughnessParameter = 0.05;   // 더 매끄러운 물 표면 (선명한 굴절)
        let dispersion = 0.02;           // 약간의 색분산으로 현실감 추가
        let attenuationDistance = 5.0;   // 더 넓은 감쇠 거리로 자연스러운 색상
        let baseThickness = 0.5;         // 물 두께를 낮춰서 자연스러운 굴절
        let thicknessParameter = baseThickness + inputData.waveHeight * 0.3; // 파도 높이에 따른 동적 두께
        let u_useKHR_materials_volume = true;
        let transmissionParameter = 1.0 - resultAlpha;

        // 🌊 Fresnel 계산 (시야각에 따른 반사/투과 비율)
        let VdotN = abs(dot(V, N));
        let fresnel = schlickFresnel(VdotN, waterF0);

        // 🔥 핵심 수정: opacity에 따라 물 색상 강도를 조절하여 굴절 배경과 미리 합성

        let effectiveWaterColor = mix( u_color,vec3<f32>(1.0), transmissionParameter);

        // 🌊 굴절된 배경 계산 (물 색상이 이미 적용됨)
        let refractedBackground = calcPrePathBackground(
            u_useKHR_materials_volume,
            thicknessParameter,
            dispersion,
            attenuationDistance,
            vec3<f32>(1.0,0.0,0.0),  // 투명도가 적용된 물 색상으로 굴절 계산
            u_ior,
            roughnessParameter,
            u_color,  // 투명도가 적용된 물 색상으로 굴절 계산
            systemUniforms.projectionCameraMatrix,
            inputData.vertexPosition,
            inputData.ndcPosition,
            V,
            N,
            renderPath1ResultTexture,
            renderPath1ResultTextureSampler
        );

    let NdotV = max(dot(N, V),0.04);
    let F0_dielectric: vec3<f32> =  vec3(pow((1.0 - u_ior) / (1.0 + u_ior), 2.0)) ; // 유전체 반사율
    let F0_metal = u_color; // 금속 반사율
    let metallicParameter = 0.0;
    var F0 = mix(F0_dielectric, F0_metal, metallicParameter); // 기본 반사율

    let F_IBL_dielectric = F0_dielectric + (vec3<f32>(1.0) - F0_dielectric) * pow(1.0 - NdotV, 5.0); // 유전
    let F_IBL_metal = F0_metal + (vec3<f32>(1.0) - F0_metal) * pow(1.0 - NdotV, 5.0); // 금속
    var F_IBL = F0 + (vec3<f32>(1.0) - F0) * pow(1.0 - NdotV, 5.0);

    let iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, iblTextureSampler, N,0).rgb;
    var envIBL_DIFFUSE:vec3<f32> = u_color * iblDiffuseColor * (vec3<f32>(1.0) - F_IBL_dielectric);


    let R = normalize(reflect(-V, N));

    let K = (roughnessParameter + 1.0) * (roughnessParameter + 1.0) / 8.0;
    let G = NdotV / (NdotV * (1.0 - K) + K);
    let a2 = roughnessParameter * roughnessParameter;
    let G_smith = NdotV / (NdotV * (1.0 - a2) + a2);
    let iblMipmapCount:f32 = f32(textureNumLevels(ibl_environmentTexture) - 1);
    let mipLevel = pow(roughnessParameter,0.6) * iblMipmapCount;
    // ---------- ibl 기본 컬러 ----------
    var reflectedColor = textureSampleLevel(ibl_irradianceTexture, iblTextureSampler, R, mipLevel).rgb;


    var envIBL_SPECULAR:vec3<f32>;
    envIBL_SPECULAR = G_smith * u_specularColor * F_IBL * u_specularStrength ;

    var envIBL_SPECULAR_BTDF = vec3<f32>(0.0);
    var refractedDir: vec3<f32>;
    let eta = 1.0 / u_ior;
    if (abs(u_ior - 1.0) < 0.0001) { refractedDir = V; }
    else { refractedDir = refract(-V, -N, eta); }

    if(length(refractedDir) > 0.0001) {
        let NdotT = abs(dot(N, normalize(refractedDir)));
        let F_transmission = vec3<f32>(1.0) - F_IBL_dielectric;

        var attenuatedBackground = refractedBackground;

        envIBL_SPECULAR_BTDF = attenuatedBackground * F_transmission * transmissionParameter + G_smith * F_IBL * NdotT;
    }

     let envIBL_DIELECTRIC = mix(envIBL_DIFFUSE ,envIBL_SPECULAR_BTDF, transmissionParameter) + envIBL_SPECULAR;
    finalColor = vec4<f32>(envIBL_DIELECTRIC, 1.0);
//    finalColor = vec4<f32>(mixColor, 1.0);
    // alpha 값이 0일 경우 discard
    if (systemUniforms.isView3D == 1 && finalColor.a == 0.0) {
      discard;
    }
    return finalColor;
}
fn schlickFresnel(cosTheta: f32, f0: f32) -> f32 {
    let oneMinusCosTheta = 1.0 - clamp(cosTheta, 0.0, 1.0);
    let oneMinusCosThetaPow5 = oneMinusCosTheta * oneMinusCosTheta * oneMinusCosTheta * oneMinusCosTheta * oneMinusCosTheta;
    return f0 + (1.0 - f0) * oneMinusCosThetaPow5;
}
