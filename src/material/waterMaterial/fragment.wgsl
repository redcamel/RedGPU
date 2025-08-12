#redgpu_include SYSTEM_UNIFORM;
#redgpu_include calcTintBlendMode;
#redgpu_include calcDirectionalShadowVisibility;
#redgpu_include normalFunctions;
#redgpu_include drawPicking;

struct Uniforms {
    color: vec3<f32>,
    opacity: f32,
};

struct InputData {
    // Built-in attributes
    @builtin(position) position : vec4<f32>,

    // Vertex attributes
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
@group(2) @binding(1) var normalTextureSampler: sampler;
@group(2) @binding(2) var normalTexture: texture_2d<f32>;

@fragment
fn main(inputData: InputData) -> @location(0) vec4<f32> {
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
    let u_opacity = uniforms.opacity;
    let u_normalScale = 1.0;
    let u_shininess = 512.0;
    let u_specularColor = vec3<f32>(1.0);
    let u_specularStrength = 1.0;
    let emissiveColor = vec3<f32>(0.0);

    // 카메라 방향 벡터
    let viewDir = normalize(u_cameraPosition - inputData.vertexPosition);

    // Shadow
    let receiveShadowYn = inputData.receiveShadow != 0.0;

    // Vertex Normal (변수명 수정: N -> normal)
    var normal = normalize(inputData.vertexNormal) * u_normalScale;
    #redgpu_if normalTexture
        let normalSamplerColor = textureSample(normalTexture, normalTextureSampler, inputData.uv).rgb;
        normal = perturb_normal(normal, inputData.vertexPosition, inputData.uv, normalSamplerColor, u_normalScale);
    #redgpu_endIf

    var finalColor: vec4<f32>;
    var waterColor: vec3<f32> = u_color;
    var specularSamplerValue: f32 = 1.0;
    var mixColor: vec3<f32> = vec3<f32>(0.0);
    var diffuseLight: vec3<f32> = vec3<f32>(0.0);
    var specularLight: vec3<f32> = vec3<f32>(0.0);




    var visibility: f32 = 1.0;
    visibility = calcDirectionalShadowVisibility(
        directionalShadowMap,
        directionalShadowMapSampler,
        u_shadowDepthTextureSize,
        u_bias,
        inputData.shadowPos
    );

    if (!receiveShadowYn) {
        visibility = 1.0;
    }

    // DirectionalLight 처리
    for (var i = 0u; i < u_directionalLightCount; i = i + 1) {
        let u_directionalLightDirection = u_directionalLights[i].direction;
        let u_directionalLightColor = u_directionalLights[i].color;
        let u_directionalLightIntensity = u_directionalLights[i].intensity;

        let L = normalize(u_directionalLightDirection);
        let R = reflect(L, normal);
        let lambertTerm = max(dot(normal, -L), 0.0);
        let specular = pow(max(dot(R, viewDir), 0.0), u_shininess) * specularSamplerValue;

        // 디렉셔널 라이트 기여도 (쉐도우 적용)
        let lightContribution = u_directionalLightColor * u_directionalLightIntensity * visibility;
        let ld = waterColor * lightContribution * lambertTerm ;
        let ls = u_specularColor * u_specularStrength * lightContribution * specular;

        diffuseLight += ld;
        specularLight += ls;
    }

    // PointLight 처리
    let clusterIndex = getClusterLightClusterIndex(inputData.position);
    let lightOffset = clusterLightGroup.lights[clusterIndex].offset;
    let lightCount: u32 = clusterLightGroup.lights[clusterIndex].count;

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

        let L = normalize(lightDir);
        let dist2 = max(dot(lightDir, lightDir), 0.0001);
        let d = sqrt(dist2);
        let rangePart = pow(clamp(1.0 - d / u_clusterLightRadius, 0.0, 1.0), 2.0);
        let invSquare = (u_clusterLightRadius * u_clusterLightRadius) / dist2;
        let attenuation = rangePart * invSquare;

        var finalAttenuation = attenuation;

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

            if (cosTheta < cosOuter) {
                continue;
            }

            let epsilon = cosInner - cosOuter;
            let spotIntensity = clamp((cosTheta - cosOuter) / epsilon, 0.0, 1.0);

            finalAttenuation *= spotIntensity;
        }

        let R = reflect(-L, normal);
        let diffuse = waterColor * max(dot(normal, L), 0.0);
        let specular = pow(max(dot(R, viewDir), 0.0), u_shininess) * specularSamplerValue;

        let diffuseAttenuation = finalAttenuation;
        let specularAttenuation = finalAttenuation * finalAttenuation;

        let ld = u_clusterLightColor * diffuse * diffuseAttenuation * u_clusterLightIntensity;
        let ls = u_specularColor * u_specularStrength * specular * specularAttenuation * u_clusterLightIntensity;

        diffuseLight += ld;
        specularLight += ls;
    }

   // 🔧 수정된 앰비언트 처리
   let ambientContribution = u_ambientLightColor * u_ambientLightIntensity;
   let ambientDiffuse = waterColor * ambientContribution * 0.1; // 앰비언트는 약하게
   mixColor += ambientDiffuse;

   // 🌊 물 전용 렌더링 로직 (완전히 새로운 접근)
   let waterF0 = 0.02;
   let waterRoughness = 0.15;
   let waterIOR = 1.333;

   // 물 특성 매개변수
   let scatteringStrength = 0.3;
   let subsurfaceStrength = 0.2;
   let shallowWaterColor = vec3<f32>(0.8, 0.95, 1.0);
   let deepWaterColor = waterColor;

   // 기본 계산
   let VdotN = abs(dot(viewDir, normal));
   let fresnel = schlickFresnel(VdotN, waterF0);
   let baseThickness = 1.0;
   let thicknessParameter = baseThickness / max(VdotN, 0.1);
   let depthFade = saturate(thicknessParameter / 5.0);
   let effectiveWaterColor = mix(shallowWaterColor, deepWaterColor, depthFade);

   // =====================================================
   // 1. 반사 성분 (Fresnel 가중)
   // =====================================================
   let reflectDir = reflect(-viewDir, normal);
   let iblMipmapCount = f32(textureNumLevels(ibl_environmentTexture) - 1);
   let mipLevel = waterRoughness * waterRoughness * iblMipmapCount;
   let environmentReflection = textureSampleLevel(ibl_environmentTexture, iblTextureSampler, reflectDir, mipLevel).rgb;

   // 환경 밝기 감지
   let environmentBrightness = dot(environmentReflection, vec3<f32>(0.299, 0.587, 0.114));
   let isDarkEnvironment = environmentBrightness < 0.1;

   // 야간에만 직접광 강화 (물리 법칙 준수)
   let directLightBoost = select(1.0, 2.5, isDarkEnvironment);
   let enhancedSpecularLight = specularLight * directLightBoost;

   let indirectReflection = environmentReflection * fresnel;
   let directReflection = enhancedSpecularLight * fresnel;

   // =====================================================
   // 2. 투과 성분 (1-Fresnel 가중)
   // =====================================================
   let attenuationColor = mix(vec3<f32>(0.95, 0.98, 1.0), effectiveWaterColor, u_opacity * 0.8);
   let refractedBackground = calcRefractionBackground(
       true, thicknessParameter, 0.0, 25.0, attenuationColor, waterIOR, waterRoughness,
       systemUniforms.projectionCameraMatrix, inputData.vertexPosition, inputData.ndcPosition,
       viewDir, normal, renderPath1ResultTexture, renderPath1ResultTextureSampler
   );

   let transmissionCoeff = (1.0 - fresnel) * (1.0 - u_opacity * 0.5);
   let transmissionComponent = refractedBackground * transmissionCoeff;

   // =====================================================
   // 3. 물 본체 색상 (매우 제한적)
   // =====================================================
   // IBL 디퓨즈 (극소량만)
   let environmentDiffuse = textureSampleLevel(ibl_irradianceTexture, iblTextureSampler, normal, 0.0).rgb;
   let bodyDiffuse = effectiveWaterColor * environmentDiffuse * 0.02; // 극소량

   // 산란 효과 - 야간에 직접광 강화
   let enhancedDiffuseLight = diffuseLight * directLightBoost;
   let scatteringContribution = effectiveWaterColor * (enhancedDiffuseLight + mixColor) * scatteringStrength * u_opacity * 0.1;

   // =====================================================
   // 4. 서브서페이스 (태양광만, 제한적으로)
   // =====================================================
   var subsurfaceComponent = vec3<f32>(0.0);
   if (u_directionalLightCount > 0u) {
       let sunDir = normalize(-u_directionalLights[0].direction);
       let sunColor = u_directionalLights[0].color;
       let sunIntensity = u_directionalLights[0].intensity;

       let subsurfaceAmount = pow(max(dot(sunDir, viewDir), 0.0), 4.0); // 더 집중된 효과
       subsurfaceComponent = effectiveWaterColor * sunColor * subsurfaceAmount * subsurfaceStrength * sunIntensity * 0.3;
   }

   // =====================================================
   // 5. 최종 합성 (물리적으로 올바름)
   // =====================================================
   let result = transmissionComponent +     // 투과 (1-F 가중)
               indirectReflection +        // 환경광 반사
               directReflection +          // 직접광 반사 (물리적으로 올바름)
                bodyDiffuse +              // 극소 디퓨즈
                scatteringContribution +   // 산란 (직접광 강화)
                subsurfaceComponent;       // 서브서페이스

   return vec4<f32>(result, 1.0);

}

// 🌊 Fresnel 계산 (Schlick 근사)
fn schlickFresnel(VdotN: f32, fresnel: f32) -> f32 {
    let oneMinusCos = 1.0 - VdotN;
    let oneMinusCos2 = oneMinusCos * oneMinusCos;
    let oneMinusCos5 = oneMinusCos2 * oneMinusCos2 * oneMinusCos;
    return fresnel + (1.0 - fresnel) * oneMinusCos5;
}
fn calcRefractionBackground(
    u_useKHR_materials_volume: bool,
    thicknessParameter: f32,
    u_KHR_dispersion: f32,
    u_KHR_attenuationDistance: f32,
    u_KHR_attenuationColor: vec3<f32>,
    ior: f32,
    roughnessParameter: f32,
    projectionCameraMatrix: mat4x4<f32>,
    input_vertexPosition: vec3<f32>,
    input_ndcPosition: vec3<f32>,
    viewDir: vec3<f32>,
    surfaceNormal: vec3<f32>,
    renderPath1ResultTexture: texture_2d<f32>,
    renderPath1ResultTextureSampler: sampler
) -> vec3<f32> {
    // 정규화 보장
    let V = normalize(viewDir);
    let N = normalize(surfaceNormal);

    // 안전한 MIP 레벨 계산
    let levels = f32(textureNumLevels(renderPath1ResultTexture));
    let transmissionMipLevel = clamp(roughnessParameter * (levels - 1.0), 0.0, levels - 1.0);

    // 그레이징 안정화
    let VdotN = abs(dot(V, N));
    let thickness = thicknessParameter * mix(0.6, 1.0, smoothstep(0.1, 0.6, VdotN));

    var refractionBackground = vec3<f32>(0.0);

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

        let etaR = 1.0 / max(iorR, 1e-3);
        let etaG = 1.0 / max(iorG, 1e-3);
        let etaB = 1.0 / max(iorB, 1e-3);

        let refractedVecR = refract(-V, N, etaR);
        let refractedVecG = refract(-V, N, etaG);
        let refractedVecB = refract(-V, N, etaB);

        // TIR 체크 및 안전 처리
        let validR = length(refractedVecR) > 0.01;
        let validG = length(refractedVecG) > 0.01;
        let validB = length(refractedVecB) > 0.01;

        let worldPosR = input_vertexPosition + select(vec3<f32>(0.0), refractedVecR, validR) * thickness;
        let worldPosG = input_vertexPosition + select(vec3<f32>(0.0), refractedVecG, validG) * thickness;
        let worldPosB = input_vertexPosition + select(vec3<f32>(0.0), refractedVecB, validB) * thickness;

        let clipPosR = projectionCameraMatrix * vec4<f32>(worldPosR, 1.0);
        let clipPosG = projectionCameraMatrix * vec4<f32>(worldPosG, 1.0);
        let clipPosB = projectionCameraMatrix * vec4<f32>(worldPosB, 1.0);

        let ndcR = clipPosR.xy / max(clipPosR.w, 1e-4) * 0.5 + 0.5;
        let ndcG = clipPosG.xy / max(clipPosG.w, 1e-4) * 0.5 + 0.5;
        let ndcB = clipPosB.xy / max(clipPosB.w, 1e-4) * 0.5 + 0.5;

        // UV 클램핑
        let finalUV_R = clamp(vec2<f32>(ndcR.x, 1.0 - ndcR.y), vec2<f32>(0.0), vec2<f32>(1.0));
        let finalUV_G = clamp(vec2<f32>(ndcG.x, 1.0 - ndcG.y), vec2<f32>(0.0), vec2<f32>(1.0));
        let finalUV_B = clamp(vec2<f32>(ndcB.x, 1.0 - ndcB.y), vec2<f32>(0.0), vec2<f32>(1.0));

        refractionBackground.r = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_R, transmissionMipLevel).r;
        refractionBackground.g = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_G, transmissionMipLevel).g;
        refractionBackground.b = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_B, transmissionMipLevel).b;
    } else {
        let eta = 1.0 / max(ior, 1e-3);
        let refractedVec = refract(-V, N, eta);
        let valid = length(refractedVec) > 0.01;

        let worldPos = input_vertexPosition + select(vec3<f32>(0.0), refractedVec, valid) * thickness;
        let clipPos = projectionCameraMatrix * vec4<f32>(worldPos, 1.0);
        let ndc = clipPos.xy / max(clipPos.w, 1e-4) * 0.5 + 0.5;
        let finalUV = clamp(vec2<f32>(ndc.x, 1.0 - ndc.y), vec2<f32>(0.0), vec2<f32>(1.0));

        refractionBackground = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV, transmissionMipLevel).rgb;
    }

    // 🌊 올바른 Beer-Lambert 감쇠 (glTF 표준)
    if (u_KHR_attenuationDistance > 0.0) {
        let distance = max(thickness, 0.0);
        let transmittance = pow(
            max(u_KHR_attenuationColor, vec3<f32>(0.001)), // 0 방지
            vec3<f32>(distance / u_KHR_attenuationDistance)
        );
        refractionBackground *= transmittance;
    }

    return refractionBackground;
}

