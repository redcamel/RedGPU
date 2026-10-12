#redgpu_include SYSTEM_UNIFORM;
struct GrassRenderParams {
    cullingDistance: f32,
    fadeStartDistance: f32,
    meshHeight: f32,
    minY: f32,

    shadowCullDistance: f32,
    farAlphaCutoff: f32,
    invMeshHeight: f32,
    invFadeRange: f32,

    groundBlendStrength: f32,
    alphaCutoff: f32,
    hasGroundTexture: u32,
    exposureBoost: f32,

    subsurfaceColor: vec3<f32>,
    subsurfaceStrength: f32,

    roughness: f32,
    shadowStrength: f32,
    receiveShadow: u32,
    shadowCullDistanceSq: f32,

    shadowFadeStartSq: f32,
    invShadowFadeRange: f32,
    pad0: u32,
    pad1: u32,
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
    @location(7) groundColor: vec4<f32>,
    @location(8) @interpolate(flat) shadowData: vec2<f32>,
};

const SSS_DISTORTION: f32 = 0.35;
const NORM_225: f32 = 0.44444445;

fn filterGrassAlpha(baseTex: vec4<f32>, alphaFade: f32) -> f32 {
    let rgbMax = max(baseTex.r, max(baseTex.g, baseTex.b));
    var sourceAlpha = baseTex.a;
    if (sourceAlpha > 0.85 && rgbMax < 0.15) {
        sourceAlpha = saturate((rgbMax - 0.02) * 10.0);
    }
    return sourceAlpha * alphaFade;
}

fn blendGrassGroundColor(
    baseColor: vec3<f32>,
    exposureBoost: f32,
    hasGroundTexture: u32,
    groundBlendStrength: f32,
    heightRatio: f32,
    groundColor: vec3<f32>
) -> vec3<f32> {
    let boost = max(0.1, exposureBoost);
    var albedo = baseColor * boost;
    if (hasGroundTexture != 0u && groundBlendStrength > 0.01) {
        let blendFactor = saturate((0.40 - heightRatio) * 2.5) * groundBlendStrength;
        albedo = mix(albedo, groundColor, blendFactor);
    }
    return albedo;
}

fn computeGrassUpwardNormal(vertexNormal: vec3<f32>, heightRatio: f32) -> vec3<f32> {
    let upVec = vec3<f32>(0.0, 1.0, 0.0);
    let upwardBlend = mix(0.55, 0.85, heightRatio);
    return normalize(mix(vertexNormal, upVec, upwardBlend));
}

fn computeGrassSkyOcclusion(heightRatio: f32) -> f32 {
    return mix(0.65, 1.0, saturate(heightRatio * 1.43));
}

fn computeGrassContactAO(heightRatio: f32) -> f32 {
    return mix(0.40, 1.0, saturate(heightRatio * 4.0));
}
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include skyAtmosphere.skyAtmosphereFn;
#redgpu_include shadow.getShadowCoord;

@group(1) @binding(1) var<uniform> materialUniforms: GrassRenderParams;

@group(2) @binding(0) var baseColorTexture: texture_2d<f32>;
@group(2) @binding(1) var baseColorSampler: sampler;

@fragment
fn main(input: VertexOutput) -> OutputFragment {
    var output: OutputFragment;

    let baseTex = textureSample(baseColorTexture, baseColorSampler, input.uv);
    let sourceAlpha = filterGrassAlpha(baseTex, input.alphaFade);

    if (sourceAlpha < materialUniforms.alphaCutoff) {
        discard;
    }

    let albedo = blendGrassGroundColor(
        baseTex.rgb,
        materialUniforms.exposureBoost,
        materialUniforms.hasGroundTexture,
        materialUniforms.groundBlendStrength,
        input.heightRatio,
        input.groundColor.rgb
    );

    let N = normalize(input.normal);

    let V = normalize(systemUniforms.camera.cameraPosition.xyz - input.worldPos);

    let roughness = clamp(materialUniforms.roughness, 0.20, 1.0);
    let subsurfaceStrength = clamp(materialUniforms.subsurfaceStrength, 0.0, 3.0);
    let preExposure = systemUniforms.preExposure;

    let sssColor = mix(albedo * 1.05, materialUniforms.subsurfaceColor, 0.35);
    let leafThickness = clamp(input.heightRatio, 0.1, 1.0);
    let transRatio = clamp(subsurfaceStrength * leafThickness * 0.45, 0.0, 0.85);

    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    var firstLightDir = vec3<f32>(0.0, 1.0, 0.0);
    if (u_directionalLightCount > 0u) {
        firstLightDir = -normalize(u_directionalLights[0].direction);
    }

    var shadowFactor: f32 = 1.0;
    if (input.shadowData.x > 0.001) {
        let shadowInfo = systemUniforms.shadow;
        let viewDepth = input.shadowData.y;
        let cascadeCount = min(4u, max(1u, shadowInfo.cascadeCount));
        let cascadeIndex = select(0u, min(1u, cascadeCount - 1u), viewDepth > shadowInfo.cascadeSplitDepths[0]);
        let lightVP = shadowInfo.cascadeLightViewProjectionMatrices[cascadeIndex];

        // 🌿 자가 그림자 Z-fighting(아크네/지글거림) 원천 방지용 초경량 노멀 오프셋
        let normalOffset = N * select(0.025, 0.07, cascadeIndex > 0u);
        let shadowCoord = getShadowCoord(input.worldPos + normalOffset, lightVP);

        let tUV = shadowCoord.xy;
        if (shadowCoord.z >= 0.0 && shadowCoord.z <= 1.0 && tUV.x >= 0.0 && tUV.x <= 1.0 && tUV.y >= 0.0 && tUV.y <= 1.0) {
            let cascadeBias = shadowInfo.directionalShadowBias * (1.0 + f32(cascadeIndex) * 0.8) + 0.0003;
            let rawVisibility = textureSampleCompareLevel(
                directionalShadowMap,
                directionalShadowMapSampler,
                tUV,
                cascadeIndex,
                saturate(shadowCoord.z - cascadeBias)
            );
            // ☀️ 터미네이터(빛과 수평인 각도) 경계선 톱니 지글거림 방지 초고속 선형 페이드
            let nDotL = dot(N, firstLightDir);
            let horizonFade = saturate(nDotL * 6.25 + 0.5);
            let csmStrength = shadowInfo.directionalShadowStrength * materialUniforms.shadowStrength;
            let pureShadow = mix(1.0 - csmStrength, 1.0, rawVisibility * horizonFade);
            shadowFactor = mix(1.0, pureShadow, input.shadowData.x);
        }
    }

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let light = u_directionalLights[i];
        let L = select(-normalize(light.direction), firstLightDir, i == 0u);
        let currentShadow = select(1.0, shadowFactor, i == 0u);
        var dLight = light.color.rgb * light.intensity * preExposure * currentShadow;

        if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let surfaceHeightKm = max(0.0, input.worldPos.y / 1000.0);
            let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, L.y, u_atmo.atmosphereHeight);
            dLight *= atmosphereTransmittance;
        }

        let nDotL = dot(N, L);
        let frontWrap = saturate((nDotL + 0.5) * NORM_225);
        let directDiff = frontWrap * (1.0 - transRatio);

        let backWrap = saturate((-nDotL + 0.5) * NORM_225);
        let lightOpposite = -(L + N * SSS_DISTORTION);
        let vDotL = max(dot(V, lightOpposite), 0.0);
        let inScatter = vDotL * vDotL;
        let sssTransmission = (backWrap * 0.5 + inScatter * 0.5) * transRatio;

        let H = normalize(L + V);
        let nDotH = max(dot(N, H), 0.0);
        let nh2 = nDotH * nDotH;
        let specFactor = nh2 * nh2 * (1.0 - roughness) * 0.25;

        let totalLighting = (albedo * directDiff) + (sssColor * sssTransmission) + vec3<f32>(specFactor);
        totalDirectLighting += totalLighting * dLight;
    }

    let skyOcclusion = computeGrassSkyOcclusion(input.heightRatio);
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

    let contactAO = computeGrassContactAO(input.heightRatio);

    let finalColor = (totalDirectLighting + totalIndirectLighting) * contactAO;

    output.color = vec4<f32>(finalColor, 1.0);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(input.currentClipPos, input.prevClipPos), 0.0, 1.0);

    return output;
}
