#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include skyAtmosphere.skyAtmosphereFn;
#redgpu_include shadow.getDirectionalShadowVisibilityFoliage;

struct GrassMaterialUniforms {
    groundBlendStrength: f32,
    alphaCutoff: f32,
    hasGroundTexture: u32,
    exposureBoost: f32,
    subsurfaceColor: vec3<f32>,
    subsurfaceDistortion: f32,
    subsurfaceStrength: f32,
    roughness: f32,
    shadowStrength: f32,
    receiveShadow: u32,
};

struct VertexOutput {
    @builtin(position) clipPos: vec4<f32>,
    @location(0) worldPos: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>,
    @location(3) heightRatio: f32,
    @location(4) alphaFade: f32,
    @location(5) currentClipPos: vec4<f32>,
    @location(6) prevClipPos: vec4<f32>,
    @location(7) groundColor: vec3<f32>,
};

@group(2) @binding(0) var baseColorTexture: texture_2d<f32>;
@group(2) @binding(1) var baseColorSampler: sampler;
@group(2) @binding(2) var<uniform> materialUniforms: GrassMaterialUniforms;

@fragment
fn main(input: VertexOutput) -> OutputFragment {
    var output: OutputFragment;

    let baseTex = textureSample(baseColorTexture, baseColorSampler, input.uv);

    // 🌿 텍스처 암흑 배경(Black Fringe) 및 알파 컷아웃
    let rgbMax = max(baseTex.r, max(baseTex.g, baseTex.b));
    var sourceAlpha = baseTex.a;
    if (sourceAlpha > 0.85 && rgbMax < 0.15) {
        sourceAlpha = clamp((rgbMax - 0.02) / 0.10, 0.0, 1.0);
    }
    sourceAlpha *= input.alphaFade;

    if (sourceAlpha < materialUniforms.alphaCutoff) {
        discard;
    }

    let exposureBoost = max(0.1, materialUniforms.exposureBoost);
    var albedo = baseTex.rgb * exposureBoost;

    if (materialUniforms.hasGroundTexture != 0u && materialUniforms.groundBlendStrength > 0.01) {
        let blendFactor = clamp((0.40 - input.heightRatio) * 2.5, 0.0, 1.0) * materialUniforms.groundBlendStrength;
        albedo = mix(albedo, input.groundColor, blendFactor);
    }

    let upVec = vec3<f32>(0.0, 1.0, 0.0);
    let upwardBlend = mix(0.55, 0.85, input.heightRatio);
    let N = normalize(mix(input.normal, upVec, upwardBlend));

    let V = normalize(systemUniforms.camera.cameraPosition.xyz - input.worldPos);

    let roughness = clamp(materialUniforms.roughness, 0.20, 1.0);
    let subsurfaceStrength = clamp(materialUniforms.subsurfaceStrength, 0.0, 3.0);
    let preExposure = systemUniforms.preExposure;

    let sssColor = mix(albedo * 1.25, materialUniforms.subsurfaceColor, 0.60);
    let leafThickness = clamp(input.heightRatio, 0.1, 1.0);

    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    var shadowFactor: f32 = 1.0;
    if (materialUniforms.receiveShadow != 0u && u_directionalLightCount > 0u) {
        let firstLightDir = -normalize(u_directionalLights[0].direction);
        let rawVisibility = getDirectionalShadowVisibilityFoliage(
            directionalShadowMap,
            directionalShadowMapSampler,
            input.worldPos,
            N,
            firstLightDir
        );
        let csmStrength = systemUniforms.shadow.directionalShadowStrength * materialUniforms.shadowStrength;
        shadowFactor = mix(1.0 - csmStrength, 1.0, rawVisibility);
    }

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let light = u_directionalLights[i];
        let L = -normalize(light.direction);
        let currentShadow = select(1.0, shadowFactor, i == 0u);
        var dLight = light.color.rgb * light.intensity * preExposure * currentShadow;

        if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let surfaceHeightKm = max(0.0, input.worldPos.y / 1000.0);
            let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, L.y, u_atmo.atmosphereHeight);
            dLight *= atmosphereTransmittance;
        }

        let nDotL = dot(N, L);

        // 🌿 1. 양면 Half-Lambert Wrap Diffuse (부드러운 풀잎 볼륨감)
        let wrapDiff = max((nDotL + 0.50) / 1.50, 0.0);

        // 🌿 2. 역광 배면 SSS (Backlight Subsurface Scattering - pow 0회 순수 ALU)
        let distortion = materialUniforms.subsurfaceDistortion;
        let backLight = max(-nDotL, 0.0) * 0.50 + max(dot(V, -(L + N * distortion)), 0.0) * 0.50;
        let sssTransmission = backLight * (subsurfaceStrength * leafThickness);

        // 🌿 3. 초경량 스펙큘러 (pow 대신 nDotH^4 고속 다항식 - 풀잎 깜빡임 방지)
        let H = normalize(L + V);
        let nDotH = max(dot(N, H), 0.0);
        let nh2 = nDotH * nDotH;
        let specFactor = nh2 * nh2 * (1.0 - roughness) * 0.25;

        let totalLighting = (albedo * wrapDiff) + (sssColor * sssTransmission) + vec3<f32>(specFactor);
        totalDirectLighting += totalLighting * dLight;
    }

    let skyOcclusion = mix(0.65, 1.0, clamp(input.heightRatio * 1.43, 0.0, 1.0));
    var totalIndirectLighting = vec3<f32>(0.0);
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;

    if (u_usePrefilterTexture) {
        let iblColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, N, 0.0).rgb * (preExposure * systemUniforms.iblIntensity);
        totalIndirectLighting = albedo * iblColor * skyOcclusion;
    } else {
        let ambLight = systemUniforms.ambientLight.color.rgb * (systemUniforms.ambientLight.intensity * preExposure);
        let ambSSS = ambLight * sssColor * (subsurfaceStrength * leafThickness * 0.25);
        totalIndirectLighting = (albedo * (ambLight * skyOcclusion)) + ambSSS;
    }

    let contactAO = mix(0.75, 1.0, clamp(input.heightRatio * 6.67, 0.0, 1.0));

    let finalColor = (totalDirectLighting + totalIndirectLighting) * contactAO;

    output.color = vec4<f32>(finalColor, 1.0);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(input.currentClipPos, input.prevClipPos), 0.0, 1.0);

    return output;
}
