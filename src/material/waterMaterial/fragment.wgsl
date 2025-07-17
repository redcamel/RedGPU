#redgpu_include SYSTEM_UNIFORM;
#redgpu_include calcTintBlendMode;
#redgpu_include calcDirectionalShadowVisibility;
#redgpu_include normalFunctions;
#redgpu_include drawPicking;

struct Uniforms {
    opacity: f32,
    waterIOR: f32,
    waterColor: vec3<f32>,
    waterColorStrength: f32,
};

struct InputData {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(9) ndcPosition: vec3<f32>,
    @location(12) combinedOpacity: f32,
    @location(13) shadowPos: vec3<f32>,
    @location(14) receiveShadow: f32,
    @location(15) pickingId: vec4<f32>,
}

@group(2) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn main(inputData: InputData) -> @location(0) vec4<f32> {
    // System uniforms
    let u_ambientLight = systemUniforms.ambientLight;
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    let u_shadowDepthTextureSize = systemUniforms.shadowDepthTextureSize;
    let u_bias = systemUniforms.bias;
    let u_camera = systemUniforms.camera;
    let u_cameraPosition = u_camera.cameraPosition;

    // Material uniforms
    let u_waterColor = uniforms.waterColor;

    let u_waterIOR = uniforms.waterIOR;
    let u_opacity = uniforms.opacity;
    let u_waterColorStrength = uniforms.waterColorStrength;

    let viewDir = normalize(u_cameraPosition - inputData.vertexPosition);
    let surfaceNormal = normalize(inputData.vertexNormal);
    let receiveShadowYn = inputData.receiveShadow != 0.0;

    // 🌊 물리적 특성 정의
    let waterF0 = 0.02;
    let baseThickness = 2.0;
    let viewAngle = abs(dot(viewDir, surfaceNormal));
    let thicknessParameter = baseThickness / max(viewAngle, 0.1);
    let roughnessParameter = 0.1;
    let dispersion = 0.0;        // 색 분산 비활성화 (필요시 활성화)
    let attenuationDistance = 25.0;
    let shininess = 32.0;

    // 🌊 Fresnel 계산
    let VdotN = abs(dot(viewDir, surfaceNormal));
    let fresnel = schlickFresnel(VdotN, waterF0);


   let neutralColor = vec3<f32>(1.0, 1.0, 1.0);
   let effectiveAttenuationColor = mix(neutralColor, u_waterColor, u_waterColorStrength);

   let refractedBackground = calcPrePathBackground(
       true,
       thicknessParameter,
       dispersion,
       attenuationDistance,
       effectiveAttenuationColor,
       u_waterIOR,
       roughnessParameter,
       effectiveAttenuationColor,
       systemUniforms.projectionCameraMatrix,
       inputData.vertexPosition,
       inputData.ndcPosition,
       viewDir,
       surfaceNormal,
       renderPath1ResultTexture,
       renderPath1ResultTextureSampler
   );



    var diffuseLight = vec3<f32>(0.0);
    var specularLight = vec3<f32>(0.0);

    // 앰비언트 라이트
    diffuseLight += u_ambientLight.color * u_ambientLight.intensity;

    // 섀도우 계산
    var visibility = 1.0;

    visibility = calcDirectionalShadowVisibility(
        directionalShadowMap,
        directionalShadowMapSampler,
        u_shadowDepthTextureSize,
        u_bias,
        inputData.shadowPos,
    );


    if (!receiveShadowYn) {
        visibility = 1.0;
    }

    // 디렉셔널 라이트
    for (var i = 0u; i < u_directionalLightCount; i = i + 1) {
        let lightDir = normalize(-u_directionalLights[i].direction);
        let halfVector = normalize(lightDir + viewDir);
        let lightColor = u_directionalLights[i].color;
        let lightIntensity = u_directionalLights[i].intensity;

        let NdotL = max(dot(surfaceNormal, lightDir), 0.0);
        let NdotH = max(dot(surfaceNormal, halfVector), 0.0);

        let lightContribution = lightColor * lightIntensity * visibility;

        // 디퓨즈
        diffuseLight += lightContribution * NdotL;

        // 스펙큘러
        let specularTerm = pow(NdotH, shininess);
        let waterSpecular = fresnel * specularTerm ;
        specularLight += lightContribution * waterSpecular * NdotL;

    }

    // 🌊 클러스터 라이트
    #redgpu_if clusterLight
        let clusterIndex = getClusterLightClusterIndex(inputData.position);
        let lightOffset = clusterLightGroup.lights[clusterIndex].offset;
        let lightCount = clusterLightGroup.lights[clusterIndex].count;

        for (var lightIndex = 0u; lightIndex < lightCount; lightIndex = lightIndex + 1u) {
            let i = clusterLightGroup.indices[lightOffset + lightIndex];
            let u_clusterLightPosition = clusterLightList.lights[i].position;
            let u_clusterLightColor = clusterLightList.lights[i].color;
            let u_clusterLightIntensity = clusterLightList.lights[i].intensity;
            let u_clusterLightRadius = clusterLightList.lights[i].radius;
            let u_isSpotLight = clusterLightList.lights[i].isSpotLight;

            let lightDir = u_clusterLightPosition - inputData.vertexPosition;
            let lightDistance = length(lightDir);

            if (lightDistance > u_clusterLightRadius) {
                continue;
            }

            let lightDirNorm = normalize(lightDir);
            let halfVector = normalize(lightDirNorm + viewDir);
            let attenuation = clamp(1.0 - (lightDistance * lightDistance) / (u_clusterLightRadius * u_clusterLightRadius), 0.0, 1.0);

            var finalAttenuation = attenuation;

            if (u_isSpotLight > 0.0) {
                let u_clusterLightDirection = normalize(vec3<f32>(
                    clusterLightList.lights[i].directionX,
                    clusterLightList.lights[i].directionY,
                    clusterLightList.lights[i].directionZ
                ));
                let u_clusterLightInnerAngle = clusterLightList.lights[i].innerCutoff;
                let u_clusterLightOuterCutoff = clusterLightList.lights[i].outerCutoff;

                let lightToVertex = normalize(-lightDir);
                let VdotN = dot(lightToVertex, u_clusterLightDirection);

                let cosOuter = cos(radians(u_clusterLightOuterCutoff));
                let cosInner = cos(radians(u_clusterLightInnerAngle));

                if (VdotN < cosOuter) {
                    continue;
                }

                let epsilon = cosInner - cosOuter;
                let spotIntensity = clamp((VdotN - cosOuter) / epsilon, 0.0, 1.0);
                finalAttenuation *= spotIntensity;
            }

            let NdotL = max(dot(surfaceNormal, lightDirNorm), 0.0);
            let NdotH = max(dot(surfaceNormal, halfVector), 0.0);

            let lightContribution = u_clusterLightColor * u_clusterLightIntensity * finalAttenuation;

            diffuseLight += lightContribution * NdotL;

           let specularTerm = pow(NdotH, shininess);
           let waterSpecular = fresnel * specularTerm ;
           specularLight += lightContribution * waterSpecular * NdotL;
        }
    #redgpu_endIf

    // 🌊 최종 물 색상 계산
    let finalColor = calculateWaterColor(
        u_waterColor,
        u_waterColorStrength,
        u_opacity,
        fresnel,
        diffuseLight,
        specularLight,
        refractedBackground
    );

    return vec4<f32>(finalColor, 1.0);
}
fn calculateWaterColor(
      waterColor: vec3<f32>,
      waterColorStrength: f32,
      opacity: f32,
      fresnel: f32,
      diffuseLight: vec3<f32>,
      specularLight: vec3<f32>,
      refractedBackground: vec3<f32>
  ) -> vec3<f32> {

      let neutralColor = vec3<f32>(1.0, 1.0, 1.0);
      let effectiveWaterColor = mix(neutralColor, waterColor, waterColorStrength);

      let waterScattering = 0.3;
      let waterDiffuse = diffuseLight * effectiveWaterColor * waterScattering;
      let waterAmbient = diffuseLight * effectiveWaterColor * 0.1;
      let waterBodyColor = waterDiffuse + waterAmbient;


      let waterSpecular = specularLight * vec3<f32>(1.0, 1.0, 1.0);


      let transmissionCoeff = (1.0 - fresnel) * (1.0 - opacity);
      let reflectionCoeff = fresnel + opacity * (1.0 - fresnel);

      let transmittedColor = refractedBackground * transmissionCoeff;
      let reflectedColor = waterBodyColor * reflectionCoeff;

      var finalColor = transmittedColor + reflectedColor + waterSpecular;

      if (opacity >= 0.99) {
          finalColor = waterBodyColor + waterSpecular;
      }

      finalColor = toneMapWater(finalColor, effectiveWaterColor, fresnel, opacity);
      return max(finalColor, vec3<f32>(0.01));
  }

// 🌊 물리적 톤 매핑 함수
fn toneMapWater(color: vec3<f32>, baseColor: vec3<f32>, fresnel: f32, opacity: f32) -> vec3<f32> {
    let exposure = 1.0;
    let gamma = 2.2;

    let exposedColor = vec3<f32>(1.0) - exp(-color * exposure);
    let gammaCorrected = pow(exposedColor, vec3<f32>(1.0 / gamma));
    let colorBoost = mix(0.9, 1.1, opacity);

    return gammaCorrected * colorBoost;
}

// 🌊 Fresnel 계산 (Schlick 근사)
fn schlickFresnel(VdotN: f32, fresnel: f32) -> f32 {
    let oneMinusCos = 1.0 - VdotN;
    let oneMinusCos2 = oneMinusCos * oneMinusCos;
    let oneMinusCos5 = oneMinusCos2 * oneMinusCos2 * oneMinusCos;
    return fresnel + (1.0 - fresnel) * oneMinusCos5;
}

// 🌊 기존 calcPrePathBackground 함수 (그대로 유지)
fn calcPrePathBackground(
    u_useKHR_materials_volume: bool,
    thicknessParameter: f32,
    u_KHR_dispersion: f32,
    u_KHR_attenuationDistance: f32,
    u_KHR_attenuationColor: vec3<f32>,
    ior: f32,
    roughnessParameter: f32,
    albedo: vec3<f32>,
    projectionCameraMatrix: mat4x4<f32>,
    input_vertexPosition: vec3<f32>,
    input_ndcPosition: vec3<f32>,
    viewDir: vec3<f32>,
    surfaceNormal: vec3<f32>,
    renderPath1ResultTexture: texture_2d<f32>,
    renderPath1ResultTextureSampler: sampler
) -> vec3<f32> {
    var prePathBackground = vec3<f32>(0.0);
    let transmissionMipLevel = roughnessParameter * f32(textureNumLevels(renderPath1ResultTexture) - 1);

    if (u_useKHR_materials_volume) {
        var iorR = ior;
        var iorG = ior;
        var iorB = ior;

        if (u_KHR_dispersion > 0.0) {
            let halfSpread = (ior - 1.0) * 0.025 * u_KHR_dispersion;
            iorR = ior + halfSpread;
            iorG = ior;
            iorB = ior - halfSpread;
        }

        let refractedVecR = refract(-viewDir, surfaceNormal, 1.0 / iorR);
        let refractedVecG = refract(-viewDir, surfaceNormal, 1.0 / iorG);
        let refractedVecB = refract(-viewDir, surfaceNormal, 1.0 / iorB);

        let worldPosR = input_vertexPosition + refractedVecR * thicknessParameter;
        let worldPosG = input_vertexPosition + refractedVecG * thicknessParameter;
        let worldPosB = input_vertexPosition + refractedVecB * thicknessParameter;

        let clipPosR = projectionCameraMatrix * vec4<f32>(worldPosR, 1.0);
        let clipPosG = projectionCameraMatrix * vec4<f32>(worldPosG, 1.0);
        let clipPosB = projectionCameraMatrix * vec4<f32>(worldPosB, 1.0);

        let ndcR = clipPosR.xy / clipPosR.w * 0.5 + 0.5;
        let ndcG = clipPosG.xy / clipPosG.w * 0.5 + 0.5;
        let ndcB = clipPosB.xy / clipPosB.w * 0.5 + 0.5;

        let finalUV_R = vec2<f32>(ndcR.x, 1.0 - ndcR.y);
        let finalUV_G = vec2<f32>(ndcG.x, 1.0 - ndcG.y);
        let finalUV_B = vec2<f32>(ndcB.x, 1.0 - ndcB.y);

        prePathBackground.r = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_R, transmissionMipLevel).r;
        prePathBackground.g = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_G, transmissionMipLevel).g;
        prePathBackground.b = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_B, transmissionMipLevel).b;

    } else {
        let refractedVec = refract(-viewDir, surfaceNormal, 1.0 / ior);
        let worldPos = input_vertexPosition + refractedVec * thicknessParameter;
        let clipPos = projectionCameraMatrix * vec4<f32>(worldPos, 1.0);
        let ndc = clipPos.xy / clipPos.w * 0.5 + 0.5;
        let finalUV = vec2<f32>(ndc.x, 1.0 - ndc.y);
        prePathBackground = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV, transmissionMipLevel).rgb;
    }

    // 🌊 물리적 감쇠 효과
    if (u_KHR_attenuationDistance > 0.0) {
        let attenuationFactor = exp(-length(vec3<f32>(1.0) - u_KHR_attenuationColor) * thicknessParameter / u_KHR_attenuationDistance);
        prePathBackground = mix(u_KHR_attenuationColor, prePathBackground, attenuationFactor);
    }

    return prePathBackground;
}
