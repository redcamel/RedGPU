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
@fragment
fn main(inputData: InputData) -> @location(0) vec4<f32> {
    // 기본 벡터들
    var normal = normalize(inputData.vertexNormal);
    var viewDir = normalize(systemUniforms.camera.cameraPosition - inputData.vertexPosition);
    var reflectDir = reflect(-viewDir, normal);

    // 🌊 물리적으로 정확한 물 상수들
    let waterIor = uniforms.ior; // 물의 굴절률 (일반적으로 1.33)
    let airIor = 1.0; // 공기의 굴절률

    // 🌊 정확한 프레넬 F0 계산
    let waterF0 = pow((airIor - waterIor) / (airIor + waterIor), 2.0);

    // 🌊 물리적 거칠기
    let roughness = 0.02;

    // 🌊 정확한 프레넬 계산
    let ndotV = max(dot(normal, viewDir), 0.001);
    let fresnel = waterF0 + (1.0 - waterF0) * pow(1.0 - ndotV, 5.0);

    // 🌊 IBL 샘플링 - 스페큘러 반사
    let iblMipmapCount = f32(textureNumLevels(ibl_environmentTexture) - 1);
    let specularMipLevel = roughness * iblMipmapCount;
    let specularReflection = textureSampleLevel(ibl_environmentTexture, iblTextureSampler, reflectDir, specularMipLevel).rgb;

    // 🌊 IBL 확산 조명 (물리적으로 정확한 확산광)
    // 물도 확산광을 받아야 함 - irradiance texture 사용
    let diffuseIBL = textureSampleLevel(ibl_irradianceTexture, iblTextureSampler, normal, 0.0).rgb;

    // 🌊 물의 고유 색상에 확산 IBL 적용
    let baseWaterColor = uniforms.color * diffuseIBL;

    // 🌊 물리적으로 정확한 최종 색상 계산
    // 에너지 보존: 반사된 빛 = 입사광 - 흡수된 빛 - 투과된 빛
    let diffuseTerm = baseWaterColor * (1.0 - fresnel); // 투과/확산 성분
    let specularTerm = specularReflection * uniforms.specularStrength * fresnel; // 반사 성분

    let finalColor = diffuseTerm + specularTerm;

    // 🌊 물리적으로 정확한 알파값
    let baseOpacity = uniforms.opacity * inputData.combinedOpacity;
    let fresnelAlpha = mix(baseOpacity, 1.0, fresnel * 0.3);
    let finalAlpha = max(fresnelAlpha, baseOpacity);

    let result = vec4<f32>(finalColor, finalAlpha);

    if (systemUniforms.isView3D == 1 && result.a == 0.0) {
        discard;
    }

    return result;
}
