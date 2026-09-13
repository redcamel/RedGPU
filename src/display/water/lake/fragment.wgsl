#redgpu_include SYSTEM_UNIFORM;
#redgpu_include color.getTintBlendMode;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.tnb.getTBNFromVertexTangent;
#redgpu_include math.tnb.getNormalFromNormalMap;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;

struct WaterUniforms {
    baseColor: vec3<f32>,
    opacity: f32,

    windDirection: vec2<f32>,
    normalScale: f32,
    normalTiling: f32,

    windSpeed: f32,
    roughness: f32,
    specularFactor: f32,
    padding: f32,
};

@group(2) @binding(0) var<uniform> uniforms: WaterUniforms;
@group(2) @binding(1) var normalTextureSampler: sampler;
@group(2) @binding(2) var normalTexture: texture_2d<f32>;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) vertexTangent: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(11) combinedOpacity: f32,

    @location(12) motionVector: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;

    // 1. UV 스크롤 계산 (시간 t 기반 애니메이션, 초 단위)
    let timeSec = systemUniforms.time.time;
    let scrollUV = inputData.uv * uniforms.normalTiling + uniforms.windDirection * (timeSec * uniforms.windSpeed);

    // 2. RedGPU 표준 TBN 행렬 구축 (버텍스 탄젠트 기반)
    let baseNormal = normalize(inputData.vertexNormal);
    let tbn = getTBNFromVertexTangent(baseNormal, inputData.vertexTangent);

    // 3. 노멀맵 샘플링 및 RedGPU PBR 표준 언패킹 (G채널 반전 적용)
    let sampledNormal = textureSample(normalTexture, normalTextureSampler, scrollUV).rgb;
    let worldNormal = getNormalFromNormalMap(vec3<f32>(sampledNormal.r, 1.0 - sampledNormal.g, sampledNormal.b), tbn, uniforms.normalScale);

    // 4. 카메라 시선 벡터 (View Direction)
    let viewDir = normalize(systemUniforms.camera.cameraPosition - inputData.vertexPosition);
    let NdotV = max(dot(worldNormal, viewDir), 0.0001);

    // 5. 물의 물리 반사율 (물의 F0 = ((1.333 - 1) / (1.333 + 1))^2 ≈ 0.02037)
    let F0 = vec3<f32>(0.02037);

    // 6. 태양 직사광에 의한 디퓨즈 산란광 및 Cook-Torrance GGX 스펙큘러 하이라이트 (pbrMaterial 표준 정합)
    var diffuseLighting = vec3<f32>(0.0);
    var specularLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    // glTF/PBR 표준: roughness 분모 0 나눗셈 방지 하한선 클램핑
    let safeRoughness = clamp(uniforms.roughness, 0.02, 1.0);
    let alpha = safeRoughness * safeRoughness;
    let alpha2 = alpha * alpha;
    let oneMinusAlpha2 = 1.0 - alpha2;

    for (var i = 0u; i < u_directionalLightCount; i++) {
        let dirLight = u_directionalLights[i];
        let lightDir = -normalize(dirLight.direction);
        let NdotL = max(dot(worldNormal, lightDir), 0.0);

        // pbrMaterial 표준 물리 조명 강도 (intensity * preExposure)
        let lightRadiance = dirLight.color.rgb * (dirLight.intensity * systemUniforms.preExposure);

        // Cook-Torrance GGX 마이크로패싯 스펙큘러 계산 (pbrMaterial getDirectSpecularBRDF 완전 정합)
        if (NdotL > 0.0) {
            let halfDir = normalize(lightDir + viewDir);
            let NdotH = max(dot(worldNormal, halfDir), 0.0);
            let VdotH = max(dot(viewDir, halfDir), 0.0);

            // 1) Fresnel-Schlick
            let F = F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);

            // 2) GGX Normal Distribution Function (NDF)
            let NdotH2 = NdotH * NdotH;
            let denom = NdotH2 * (alpha2 - 1.0) + 1.0;
            let D = (alpha2 * INV_PI) / max(EPSILON, denom * denom);

            // 3) Smith Joint GGX Visibility Function
            let safeNdotL = max(NdotL, 0.0001);
            let GGXV = safeNdotL * sqrt(NdotV * NdotV * oneMinusAlpha2 + alpha2);
            let GGXL = NdotV * sqrt(safeNdotL * safeNdotL * oneMinusAlpha2 + alpha2);
            let V = 0.5 / max(GGXV + GGXL, EPSILON);

            // 4) Specular BRDF = D * V * F
            let specBRDF = D * V * F;

            // pbrMaterial 표준: SPEC_BRDF * specularFactor * NdotL * lightRadiance
            specularLighting += lightRadiance * specBRDF * uniforms.specularFactor * NdotL;

            // 5) 물리적 에너지 보존 (PBR Energy Conservation): 반사된 빛(F)을 제외한 나머지 투과 산란
            let diffuseWeight = max(vec3<f32>(1.0) - F * uniforms.specularFactor, vec3<f32>(0.0));
            let scatterFactor = NdotL * 0.6 + 0.4;
            diffuseLighting += uniforms.baseColor * lightRadiance * scatterFactor * 0.3 * diffuseWeight;
        }
    }

    // 7. 환경광(Ambient / Sky) 기반 수면 기본 조명
    let hasAmbient = (systemUniforms.ambientLight.intensity > 0.0) && any(systemUniforms.ambientLight.color.rgb > vec3<f32>(0.0));
    let ambientColor = select(vec3<f32>(0.6, 0.75, 0.9), systemUniforms.ambientLight.color.rgb, hasAmbient);
    let ambientLux = select(0.35, systemUniforms.ambientLight.intensity * systemUniforms.preExposure, hasAmbient);
    let waterAmbient = uniforms.baseColor * ambientColor * ambientLux;

    // 8. 최종 수면 색상 합성 (Premultiplied Alpha 스펙큘러 분리 기법)
    // 수체 내부 투과 확산광(diffusePart)에만 투명도(finalAlpha)를 곱하고,
    // 표면 반사광(specularLighting)은 투명도와 독립적으로 100% 온전한 광량을 유지하여 가산
    let finalAlpha = uniforms.opacity * inputData.combinedOpacity;
    let diffusePart = waterAmbient + diffuseLighting;
    let finalRgb = diffusePart * finalAlpha + specularLighting;

    var finalColor = vec4<f32>(finalRgb, finalAlpha);

    if (finalColor.a == 0.0 && all(specularLighting == vec3<f32>(0.0))) {
        discard;
    }

    output.color = finalColor;

    // 9. RedGPU PBR 표준 G-Buffer Normal & MotionVector 출력
    let smoothness = 1.0 - safeRoughness;
    let smoothnessCurved = smoothness * smoothness * (3.0 - 2.0 * smoothness);
    let baseReflectionStrength = smoothnessCurved * 0.02037 * uniforms.specularFactor;
    output.gBufferNormal = vec4<f32>(worldNormal * 0.5 + 0.5, baseReflectionStrength);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);

    return output;
}
