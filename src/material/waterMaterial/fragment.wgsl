#redgpu_include SYSTEM_UNIFORM;
#redgpu_include calcTintBlendMode;
#redgpu_include calcDirectionalShadowVisibility;
#redgpu_include normalFunctions;
#redgpu_include drawPicking;

struct Uniforms {
    color: vec3<f32>,
    //
    specularColor:vec3<f32>,
    specularStrength:f32,
    shininess: f32,
    //
    transmissionFactor: f32,
    //
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
    let u_specularColor = uniforms.specularColor;
    let u_specularStrength = uniforms.specularStrength;
    let u_shininess = uniforms.shininess;

    // 🔧 변수명 수정 (WGSL 문법 호환성)
    let viewDir = normalize(u_cameraPosition - inputData.vertexPosition);

    // Shadow
    let receiveShadowYn = inputData.receiveShadow != 0.0;

    // 🌊 표면 노말 사용 (normalTexture 없이)
    let surfaceNormal = normalize(inputData.vertexNormal);

    // 🌊 물의 물리적 특성 정의
    let KHR_attenuationDistance = 10.0;
    let KHR_attenuationColor = u_color;
    let ior = 1.33;                          // 물의 굴절률
    let roughnessParameter = 0.1;            // 매끄러운 표면
    let albedo = u_color;                    // 물의 기본 색상
    let thicknessParameter = 1.0;            // 두께 매개변수
    let KHR_dispersion = 0.0;                // 분산 효과
    let transmissionFactor = uniforms.transmissionFactor;

    // 🌊 굴절된 배경 계산
    let refractedBackground = calcPrePathBackground(
        true,
        thicknessParameter,
        KHR_dispersion,
        KHR_attenuationDistance,
        KHR_attenuationColor,
        ior,
        roughnessParameter,
        albedo,
        systemUniforms.projectionCameraMatrix,
        inputData.vertexPosition,
        inputData.ndcPosition,
        viewDir,
        surfaceNormal,
        renderPath1ResultTexture,
        renderPath1ResultTextureSampler
    );

    // 🌊 디퓨즈와 스펙큘러를 분리해서 처리
    var diffuseColor = vec3<f32>(0.0);
    var specularColor = vec3<f32>(0.0);

    // 🌊 앰비언트 라이트 추가 (디퓨즈에만)
    diffuseColor += u_ambientLightColor * u_ambientLightIntensity;

    var visibility = 1.0;
    #redgpu_if receiveShadow
        visibility = calcDirectionalShadowVisibility(
            directionalShadowMap,
            directionalShadowMapSampler,
            u_shadowDepthTextureSize,
            u_bias,
            inputData.shadowPos,
        );
    #redgpu_endIf

    if (!receiveShadowYn) {
        visibility = 1.0;
    }

    // 🌊 디렉셔널 라이트 계산 (디퓨즈와 스펙큘러 분리)
    for (var i = 0u; i < u_directionalLightCount; i = i + 1) {
        let u_directionalLightDirection = u_directionalLights[i].direction;
        let u_directionalLightColor = u_directionalLights[i].color;
        let u_directionalLightIntensity = u_directionalLights[i].intensity;

        let lightDir = normalize(-u_directionalLightDirection);
        let reflectedLight = reflect(-lightDir, surfaceNormal);
        let lambertTerm = max(dot(surfaceNormal, lightDir), 0.0);
        let specular = pow(max(dot(reflectedLight, viewDir), 0.0), u_shininess);

        let lightContribution = u_directionalLightColor * u_directionalLightIntensity * visibility;

        // 🌊 디퓨즈는 나중에 물 색상 적용
        diffuseColor += lightContribution * lambertTerm;

        // 🌊 스펙큘러는 원래 색상 유지
        specularColor += u_specularColor * u_specularStrength * lightContribution * specular;
    }

    // 🌊 포인트 라이트 계산 (디퓨즈와 스펙큘러 분리)
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

            let reflectedLight = reflect(-lightDirNorm, surfaceNormal);
            let diffuse = max(dot(surfaceNormal, lightDirNorm), 0.0);
            let specular = pow(max(dot(reflectedLight, viewDir), 0.0), u_shininess);

            let diffuseAttenuation = finalAttenuation;
            let specularAttenuation = finalAttenuation * finalAttenuation;

            // 🌊 디퓨즈는 나중에 물 색상 적용
            diffuseColor += u_clusterLightColor * diffuse * diffuseAttenuation * u_clusterLightIntensity;

            // 🌊 스펙큘러는 원래 색상 유지
            specularColor += u_specularColor * u_specularStrength * specular * specularAttenuation * u_clusterLightIntensity;
        }
    #redgpu_endIf

    // 🌊 디퓨즈에만 물 색상 적용, 스펙큘러는 원래 색상 유지
    let surfaceColor = diffuseColor * albedo + specularColor;

    // 🌊 투과된 배경에만 물 색상 적용
    let tintedBackground = refractedBackground * albedo + specularColor;

    let finalColor = mix(
        tintedBackground,         // 틴팅된 배경
        surfaceColor,             // 물 색상이 적용된 디퓨즈 + 원래 색상의 스펙큘러
        1.0 - transmissionFactor
    );

    let result = vec4<f32>(finalColor, 1.0);

    return result;
}

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

    // 🌊 감쇠 효과 적용
    if (u_KHR_attenuationDistance > 0.0) {
        let attenuationFactor = exp(-length(vec3<f32>(1.0) - u_KHR_attenuationColor) * thicknessParameter / u_KHR_attenuationDistance);
        prePathBackground = mix(u_KHR_attenuationColor, prePathBackground, attenuationFactor);
    }

    return prePathBackground;
}
