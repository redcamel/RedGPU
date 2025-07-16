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
    normalScale:f32,
    //
    opacity: f32,
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
@group(2) @binding(1) var normalTextureSampler: sampler;
@group(2) @binding(2) var normalTexture: texture_2d<f32>;

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
    let u_normalScale = uniforms.normalScale;
    let u_specularColor = uniforms.specularColor;
    let u_specularStrength = uniforms.specularStrength;
    let u_shininess = uniforms.shininess;
    let u_opacity = uniforms.opacity;

    // 🔧 변수명 변경 (E는 WGSL 예약어일 수 있음)
    let V = normalize(u_cameraPosition - inputData.vertexPosition);

    // Shadow
    let receiveShadowYn = inputData.receiveShadow != 0.0;

    // Vertex Normal
    var N = normalize(inputData.vertexNormal) * u_normalScale;
    #redgpu_if normalTexture
        let normalSamplerColor = textureSample(normalTexture, normalTextureSampler, inputData.uv).rgb;
        N = perturb_normal( N, inputData.vertexPosition, inputData.uv, normalSamplerColor, u_normalScale ) ;
    #redgpu_endIf

    var finalColor:vec4<f32>;
    var resultAlpha:f32 = u_opacity * inputData.combinedOpacity;

    let KHR_attenuationDistance = 1.0;
    let KHR_attenuationColor = u_color;
    let ior = 1.33;
    let roughnessParameter = 0.1;
    let albedo = vec3<f32>(0.2, 0.6, 0.8);
    let thicknessParameter = 1.0;
    let KHR_dispersion = 0.0;

    var diffuseColor = calcPrePathBackground(
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
        V,
        N,
        renderPath1ResultTexture,
        renderPath1ResultTextureSampler
    );

    var mixColor:vec3<f32> = vec3<f32>(0.0);

    var visibility:f32 = 1.0;
    #redgpu_if receiveShadow
        visibility = calcDirectionalShadowVisibility(
            directionalShadowMap,
            directionalShadowMapSampler,
            u_shadowDepthTextureSize,
            u_bias,
            inputData.shadowPos,
        );
    #redgpu_endIf

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
        let specular = pow(max(dot(R, V), 0.0), u_shininess);

        // 디렉셔널 라이트 기여도 (쉐도우 적용)
        let lightContribution = u_directionalLightColor * u_directionalLightIntensity * visibility;
        let ld = diffuseColor * lightContribution * lambertTerm;
        let ls = u_specularColor * u_specularStrength * lightContribution * specular;

        mixColor += ld + ls;
    }

    // PointLight
    #redgpu_if clusterLight
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

             // 공통 라이팅 계산
             let R = reflect(-L, N);
             let diffuse = diffuseColor * max(dot(N, L), 0.0);
             let specular = pow(max(dot(R, V), 0.0), u_shininess);

             // 디퓨즈와 스펙큘러에 다른 감쇠 적용
             let diffuseAttenuation = finalAttenuation;
             let specularAttenuation = finalAttenuation * finalAttenuation; // 스펙큘러는 더 빠르게 감쇠

             let ld = u_clusterLightColor * diffuse * diffuseAttenuation * u_clusterLightIntensity;
             let ls = u_specularColor * u_specularStrength * specular * specularAttenuation * u_clusterLightIntensity;

             mixColor += ld + ls;
        }
    #redgpu_endIf

    finalColor = vec4<f32>(mixColor, 1.0);

    // alpha 값이 0일 경우 discard
    if (systemUniforms.isView3D == 1 && finalColor.a == 0.0) {
      discard;
    }
    return finalColor;
}

fn calcPrePathBackground(
    u_useKHR_materials_volume:bool, thicknessParameter:f32, u_KHR_dispersion:f32, u_KHR_attenuationDistance:f32, u_KHR_attenuationColor:vec3<f32>,
    ior:f32, roughnessParameter:f32, albedo:vec3<f32>,
    projectionCameraMatrix:mat4x4<f32>, input_vertexPosition:vec3<f32>, input_ndcPosition:vec3<f32>,
    V:vec3<f32>, N:vec3<f32>,
    renderPath1ResultTexture:texture_2d<f32>, renderPath1ResultTextureSampler:sampler
) -> vec3<f32> {
    var prePathBackground = vec3<f32>(0.0);
    let transmissionMipLevel: f32 = roughnessParameter * f32(textureNumLevels(renderPath1ResultTexture) - 1);

    if(u_useKHR_materials_volume){
        var iorR: f32 = ior;
        var iorG: f32 = ior;
        var iorB: f32 = ior;

        if(u_KHR_dispersion > 0.0){
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
    prePathBackground *= albedo;
    return prePathBackground;
}
