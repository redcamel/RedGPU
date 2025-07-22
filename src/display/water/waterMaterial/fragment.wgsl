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
    @location(5) waveScale: f32,
    @location(6) foamIntensity: f32,
    @location(7) flowVector: vec2<f32>,
    @location(9) ndcPosition: vec3<f32>,
    @location(12) combinedOpacity: f32,
    @location(13) shadowPos: vec3<f32>,
    @location(14) receiveShadow: f32,
    @location(15) pickingId: vec4<f32>,
}

@group(2) @binding(0) var<uniform> uniforms: Uniforms;

@group(2) @binding(1) var foamTexture: texture_2d<f32>;
@group(2) @binding(2) var foamTextureSampler: sampler;

@fragment
fn main(inputData: InputData) -> @location(0) vec4<f32> {
    // 🌊 기본 벡터들
    var normal = normalize(inputData.vertexNormal);
    var viewDir = normalize(systemUniforms.camera.cameraPosition - inputData.vertexPosition);
    var reflectDir = reflect(-viewDir, normal);
    let viewAngle = abs(dot(normal, viewDir));

    // 🌊 물리적 상수들
    let waterIor = uniforms.ior;
    let airIor = 1.0;

    let baseRoughness = 0.01; // 평온한 물의 기본 거칠기
    let maxRoughness = 0.3;   // 거품이 심할 때 최대 거칠기
    let roughness = mix(baseRoughness, maxRoughness, inputData.foamIntensity);

    // 🌊 프레넬 계산
    let waterF0 = pow((airIor - waterIor) / (airIor + waterIor), 2.0);
    let ndotV = max(dot(normal, viewDir), 0.001);
    let fresnel = waterF0 + (1.0 - waterF0) * pow(1.0 - ndotV, 5.0);

    // 🌊 **실제 굴절된 배경 계산**
    let baseThickness = 1.0;
    let thickness = mix(baseThickness * 1.8, baseThickness * 0.6, viewAngle);

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
    let diffuseIBL = textureSampleLevel(ibl_irradianceTexture, iblTextureSampler, normal, 0.0).rgb ;

 // ⭐ **추가: 각도에 따른 IBL 쉐이딩 (Lambert + View-dependent)**
    // 위에서 아래로 내려다보는 각도 계산 (하늘 방향을 기준)
    let upVector = vec3<f32>(0.0, 1.0, 0.0);
    let lambertFactor = max(dot(normal, upVector), 0.0);

    // 시선 각도에 따른 추가 쉐이딩
    let viewAngleShading = pow(ndotV, 0.5); // 0.5 지수로 부드러운 변화

    // 결합된 쉐이딩 팩터
    let shadingFactor = mix(0.3, 1.0, lambertFactor * viewAngleShading);

    // 🌊 **각도 쉐이딩이 적용된 물 색상 계산**
    let baseWaterColor = uniforms.color * diffuseIBL * shadingFactor;


    // 🌊 **opacity로 굴절/물색상 혼합 조절**
    let waterTransparency = uniforms.opacity;

    let mixedUnderwaterColor = mix(
        refractedBackground.rgb,
        baseWaterColor,
        waterTransparency
    );

    // 🌊 **최종 색상 계산**
    let diffuseTerm = mixedUnderwaterColor * (1.0 - fresnel);
    let specularTerm = mix(diffuseIBL, specularReflection, fresnel)
                      * uniforms.specularStrength * fresnel;

    // 🌊 **Foam 텍스처 색상 계산**
    let time = systemUniforms.time * 0.001;
    var foamColor: vec3<f32>;
    #redgpu_if foamTexture
    {
        // 🌊 **실제 물 흐름 기반 계산**
        let actualFlow = inputData.flowVector;
        let foamScale = mix(1.2, 2.5, inputData.waveScale);
        let flowStrength = 0.15;

        // 🌊 **자연스러운 시간차 흐름 (2레이어)**
        let baseFlow = actualFlow * flowStrength;

        let animatedUV1 = inputData.uv * foamScale +
                          baseFlow +
                          vec2<f32>(time * 0.008, time * 0.006);

        let animatedUV2 = inputData.uv * foamScale * 1.3 +
                          baseFlow * 0.7 +
                          vec2<f32>(-time * 0.005, time * 0.009);

        // 🌊 **거품 텍스처 샘플링**
        let foam1 = textureSample(foamTexture, foamTextureSampler, animatedUV1).rgb;
        let foam2 = textureSample(foamTexture, foamTextureSampler, animatedUV2).rgb;

        // 🌊 **정적 블렌딩**
        foamColor = mix(foam1, foam2, 0.6);

        // 🌊 **흐름 강도에 따른 거품 밝기 조절**
        let flowMagnitude = length(actualFlow);
        let flowBrightness = 1.0 + flowMagnitude * 0.5;
        foamColor *= flowBrightness;
    }
    #redgpu_else
    {
        // 🌊 기본 foam 색상
        foamColor = vec3<f32>(0.95, 0.98, 1.0);
    }
    #redgpu_endIf

    // 🌊 **거품 강도 조절** - 부드러운 혼합
    let smoothFoamIntensity = smoothstep(0.0, 0.8, inputData.foamIntensity);
    let finalColor = mix(diffuseTerm + specularTerm, foamColor, smoothFoamIntensity * 0.7);

    // 🌊 **최종 결과는 항상 완전 불투명**
    let result = vec4<f32>(finalColor, 1.0);

    if (systemUniforms.isView3D == 1 && result.a == 0.0) {
        discard;
    }

    return result;
}
