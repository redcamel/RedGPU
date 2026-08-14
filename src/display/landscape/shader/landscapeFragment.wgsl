#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.PI;
#redgpu_include math.PI2;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;
#redgpu_include math.direction.getViewDirection;
#redgpu_include math.direction.getReflectionVectorFromViewDirection;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,
    @location(6) vertexHeight: f32,
    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(9) instanceColor: vec4<f32>,
};

struct MaterialUniforms {
    color: vec4<f32>,
    textureOffset: vec2<f32>,
    textureScale: vec2<f32>,
    roughnessFactor: f32,
    metallicFactor: f32,
};

@group(1) @binding(1) var vhtSampler: sampler;
@group(1) @binding(3) var vntNormalTexture: texture_2d<f32>;

@group(2) @binding(0) var<uniform> uniforms: MaterialUniforms;
@group(2) @binding(1) var baseColorTextureSampler: sampler;

#redgpu_if baseColorTexture
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;
#redgpu_endIf

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    
    let input_vertexPosition = inputData.vertexPosition;
    let u_cameraPosition = systemUniforms.camera.cameraPosition;
    let preExposure = systemUniforms.preExposure;

    let u_metallicFactor = uniforms.metallicFactor;
    let u_roughnessFactor = uniforms.roughnessFactor;

    // RVT 노멀 아틀라스(@group(1) @binding(3)) 픽셀 샘플링 및 복원
    let encodedNormal = textureSampleLevel(vntNormalTexture, vhtSampler, inputData.uv1, 0.0).rgb;
    let sampledNormal = normalize(encodedNormal * 2.0 - vec3<f32>(1.0));
    let N: vec3<f32> = select(sampledNormal, vec3<f32>(0.0, 1.0, 0.0), length(encodedNormal) <= 0.001);

    // Base Color & Albedo
    var baseColor = uniforms.color;

    #redgpu_if baseColorTexture
    let transformedUV = inputData.uv * uniforms.textureScale + uniforms.textureOffset;
    let diffuseSampleColor = textureSample(baseColorTexture, baseColorTextureSampler, transformedUV);
    baseColor *= diffuseSampleColor;
    #redgpu_endIf

    if (inputData.instanceColor.a > 0.0) {
        baseColor = mix(baseColor, inputData.instanceColor, 0.5);
    }

    let albedo: vec3<f32> = baseColor.rgb;

    // Core Vectors
    let V: vec3<f32> = getViewDirection(input_vertexPosition, u_cameraPosition);
    let NdotV = max(abs(dot(N, V)), 0.04);

    // Fresnel F0
    let F0_dielectric = vec3<f32>(0.04);
    let F0_metal = albedo;
    let F0 = mix(F0_dielectric, F0_metal, u_metallicFactor);
    let roughnessParameter = max(u_roughnessFactor, 0.04);

    // Direct Lighting Loop (Cook-Torrance PBR)
    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    if (u_directionalLightCount > 0u) {
        for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
            let lightIntensity = u_directionalLights[i].intensity;
            let L = -normalize(u_directionalLights[i].direction);
            let finalLightColor = u_directionalLights[i].color * lightIntensity * preExposure;

            let NdotL = max(dot(N, L), 0.0);
            if (NdotL > 0.0) {
                let H = normalize(V + L);
                let NdotH = max(dot(N, H), 0.0);
                let LdotH = max(dot(L, H), 0.0);

                let alpha = roughnessParameter * roughnessParameter;
                let alpha2 = alpha * alpha;
                let denomNDF = (NdotH * NdotH * (alpha2 - 1.0) + 1.0);
                let NDF = alpha2 / (PI * denomNDF * denomNDF + EPSILON);

                let k = (roughnessParameter + 1.0) * (roughnessParameter + 1.0) / 8.0;
                let G1V = NdotV / (NdotV * (1.0 - k) + k + EPSILON);
                let G1L = NdotL / (NdotL * (1.0 - k) + k + EPSILON);
                let G = G1V * G1L;

                let F = F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - LdotH, 0.0, 1.0), 5.0);

                let spec = (NDF * G * F) / (4.0 * NdotV * NdotL + EPSILON);
                let kS = F;
                let kD = (vec3<f32>(1.0) - kS) * (1.0 - u_metallicFactor);

                totalDirectLighting += (kD * albedo * INV_PI + spec) * finalLightColor * NdotL;
            }
        }
    } else {
        // 기본 썬라이트 방향 폴백 (대각선 햇빛 PBR)
        let defaultSunL = normalize(vec3<f32>(0.6, 0.8, 0.4));
        let finalLightColor = vec3<f32>(1.2, 1.15, 1.05) * preExposure * 1.5;
        let NdotL = max(dot(N, defaultSunL), 0.0);
        if (NdotL > 0.0) {
            let H = normalize(V + defaultSunL);
            let NdotH = max(dot(N, H), 0.0);
            let LdotH = max(dot(defaultSunL, H), 0.0);

            let alpha = roughnessParameter * roughnessParameter;
            let alpha2 = alpha * alpha;
            let denomNDF = (NdotH * NdotH * (alpha2 - 1.0) + 1.0);
            let NDF = alpha2 / (PI * denomNDF * denomNDF + EPSILON);

            let k = (roughnessParameter + 1.0) * (roughnessParameter + 1.0) / 8.0;
            let G1V = NdotV / (NdotV * (1.0 - k) + k + EPSILON);
            let G1L = NdotL / (NdotL * (1.0 - k) + k + EPSILON);
            let G = G1V * G1L;

            let F = F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - LdotH, 0.0, 1.0), 5.0);

            let spec = (NDF * G * F) / (4.0 * NdotV * NdotL + EPSILON);
            let kS = F;
            let kD = (vec3<f32>(1.0) - kS) * (1.0 - u_metallicFactor);

            totalDirectLighting += (kD * albedo * INV_PI + spec) * finalLightColor * NdotL;
        }
    }

    // Indirect IBL & Ambient Lighting
    var indirectLighting = vec3<f32>(0.0);
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;
    let u_useSkyAtmosphere = systemUniforms.useSkyAtmosphere == 1u;

    if (u_usePrefilterTexture || u_useSkyAtmosphere) {
        let R = getReflectionVectorFromViewDirection(V, N);
        var reflectedColor = vec3<f32>(0.0);
        var iblDiffuseColor = vec3<f32>(0.0);

        if (u_usePrefilterTexture) {
            let iblMipmapCount = f32(textureNumLevels(ibl_prefilterTexture) - 1);
            let mipLevel = roughnessParameter * iblMipmapCount;
            reflectedColor = textureSampleLevel(ibl_prefilterTexture, prefilterTextureSampler, R, mipLevel).rgb * preExposure * systemUniforms.iblIntensity;
            iblDiffuseColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0).rgb * preExposure * systemUniforms.iblIntensity;
        }

        if (u_useSkyAtmosphere) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let skyIntensity = u_atmo.sunIntensity;
            let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
            let atmoMipLevel = roughnessParameter * atmoMipCount;
            let specSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, R, atmoMipLevel).rgb * skyIntensity * preExposure;
            reflectedColor += specSkyScat;

            let skyIrradiance = textureSampleLevel(atmosphereIrradianceLUT, atmosphereSampler, N, 0.0).rgb * skyIntensity * preExposure;
            iblDiffuseColor += skyIrradiance;
        }

        let envBRDF = textureSampleLevel(ibl_brdfLUTTexture, prefilterTextureSampler, clamp(vec2<f32>(NdotV, roughnessParameter), vec2<f32>(0.005), vec2<f32>(0.995)), 0.0).rg;
        let F_IBL = F0 * envBRDF.x + vec3<f32>(envBRDF.y);
        let kD = (vec3<f32>(1.0) - F_IBL) * (1.0 - u_metallicFactor);

        indirectLighting = (kD * albedo * iblDiffuseColor) + (reflectedColor * F_IBL);
    } else {
        let ambientContribution = albedo * systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity * preExposure * INV_PI;
        indirectLighting = ambientContribution;
    }

    let finalColor = vec4<f32>(totalDirectLighting + indirectLighting, baseColor.a);

    output.color = finalColor;
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);
    return output;
}
