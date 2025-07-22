#redgpu_include SYSTEM_UNIFORM;
#redgpu_include calcDirectionalShadowVisibility;
#redgpu_include drawPicking;
#redgpu_include calcPrePathBackground

struct Uniforms {
    color: vec3<f32>,
    ior: f32,
    specularStrength: f32,
    shininess: f32,
    opacity: f32,
};

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) worldPosition: vec3<f32>,
    @location(4) waveHeight: f32,
    @location(9) ndcPosition: vec3<f32>,
    @location(12) combinedOpacity: f32,
    @location(13) shadowPos: vec3<f32>,
    @location(14) receiveShadow: f32,
    @location(15) pickingId: vec4<f32>,
}

@group(2) @binding(0) var<uniform> uniforms: Uniforms;

// 🌊 **깊이 기반 색상 계산 함수**
fn calculateDepthBasedColor(baseColor: vec3<f32>, waveHeight: f32) -> vec3<f32> {
    let depth = max(0.0, -waveHeight);
    let shallowDepth = -0.5;
    let deepDepth = 10.0;
    let depthFactor = smoothstep(shallowDepth, deepDepth, depth);

    let shallowColor = baseColor * 1.2;
    let mediumColor = baseColor;
    let deepColor = baseColor * 0.3;

    let depthColor = mix(
        mix(shallowColor, mediumColor, smoothstep(0.0, 0.4, depthFactor)),
        deepColor,
        smoothstep(0.4, 1.0, depthFactor)
    );

    return depthColor;
}

@fragment
fn main(inputData: InputData) -> @location(0) vec4<f32> {
    // 🌊 기본 벡터들
    var normal = normalize(inputData.vertexNormal);
    var viewDir = normalize(systemUniforms.camera.cameraPosition - inputData.vertexPosition);
    var reflectDir = reflect(-viewDir, normal);

    // 🌊 물리적 상수들
    let waterIor = uniforms.ior;
    let airIor = 1.0;
    let roughness = 0.02;

    // 🌊 프레넬 계산
    let waterF0 = pow((airIor - waterIor) / (airIor + waterIor), 2.0);
    let ndotV = max(dot(normal, viewDir), 0.001);
    let fresnel = waterF0 + (1.0 - waterF0) * pow(1.0 - ndotV, 5.0);

    // 🌊 **실제 굴절된 배경 계산**
    let baseThickness = 0.8;
    let thickness = baseThickness + abs(inputData.waveHeight) * 0.5;
    let dispersion = 0.015;
    let attenuationDistance = 8.0;
    let transmissionParameter = 1.0 - uniforms.opacity;

    let refractedBackground = calcPrePathBackground(
        true, // useKHR_materials_volume
        thickness,
        dispersion,
        attenuationDistance,
        uniforms.color, // 물 색상을 감쇠 색상으로 사용
        waterIor,
        roughness,
        uniforms.color,
        systemUniforms.projectionCameraMatrix,
        inputData.vertexPosition,
        inputData.ndcPosition,
        viewDir,
        normal,
        renderPath1ResultTexture,
        renderPath1ResultTextureSampler
    );

    // 🌊 IBL 스페큘러 반사 (하늘/환경)
    let iblMipmapCount = f32(textureNumLevels(ibl_environmentTexture) - 1);
    let specularMipLevel = roughness * iblMipmapCount;
    let specularReflection = textureSampleLevel(ibl_environmentTexture, iblTextureSampler, reflectDir, specularMipLevel).rgb;

    // 🌊 IBL 확산 조명 (물 고유 색상)
    let diffuseIBL = textureSampleLevel(ibl_irradianceTexture, iblTextureSampler, normal, 0.0).rgb;

    // 🌊 **물 색상 계산**
    let baseWaterColor = uniforms.color * diffuseIBL;
    let finalWaterColor = calculateDepthBasedColor(baseWaterColor, inputData.waveHeight);

    // 🌊 **opacity로 굴절/물색상 혼합 조절**
    let waterTransparency = uniforms.opacity; // 0.0 = 완전투명(굴절만), 1.0 = 불투명(물색만)

    // 깊이에 따른 추가 굴절 강화
    let depth = max(0.0, -inputData.waveHeight);
    let depthRefractionBoost = smoothstep(0.0, 3.0, depth) * 0.3;

    let mixedUnderwaterColor = mix(
        refractedBackground.rgb,   // 굴절된 배경 (투명할 때)
        finalWaterColor,           // 물 고유 색상 (불투명할 때)
        waterTransparency - depthRefractionBoost // 깊을수록 약간 더 굴절
    );

    // 🌊 **최종 색상 계산** - 프레넬 기반 반사/굴절 혼합
    let diffuseTerm = mixedUnderwaterColor * (1.0 - fresnel);
    let specularTerm = specularReflection * uniforms.specularStrength * fresnel;
    let finalColor = diffuseTerm + specularTerm;

    // 🌊 **최종 결과는 항상 완전 불투명**
    let result = vec4<f32>(finalColor, 1.0);

    if (systemUniforms.isView3D == 1 && result.a == 0.0) {
        discard;
    }

    return result;
}
