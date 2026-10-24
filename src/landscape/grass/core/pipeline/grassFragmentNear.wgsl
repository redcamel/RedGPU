#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include skyAtmosphere.skyAtmosphereFn;
#redgpu_include shadow.getShadowCoord;
#redgpu_include landscape.struct.GrassRenderParams;
#redgpu_include landscape.struct.GrassVertexOutput;
#redgpu_include landscape.grassFragmentCommon;

const SSS_DISTORTION: f32 = 0.35;

@group(1) @binding(1) var<uniform> materialUniforms: GrassRenderParams;

@group(2) @binding(0) var baseColorTexture: texture_2d<f32>;
@group(2) @binding(1) var baseColorSampler: sampler;

@fragment
fn main(input: VertexOutput) -> OutputFragment {
    var output: OutputFragment;

    let baseTex = textureSample(baseColorTexture, baseColorSampler, input.uv);
    let sourceAlpha = filterGrassAlpha(baseTex, input.alphaFade);

    let uvDeriv = fwidth(input.uv);
    let subpixelFactor = saturate(max(uvDeriv.x, uvDeriv.y) * 50.0);
    let adaptiveCutoff = mix(materialUniforms.alphaCutoff, materialUniforms.alphaCutoff * 0.45, subpixelFactor);

    if (sourceAlpha < adaptiveCutoff) {
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
    let firstNDotL = dot(N, firstLightDir);

    var shadowFactor: f32 = 1.0;
    let effectiveShadowWeight = input.shadowData.x;
    if (effectiveShadowWeight > 0.001) {
        if (firstNDotL <= -0.08) {
            shadowFactor = 1.0 - effectiveShadowWeight;
        } else {
            let shadowInfo = systemUniforms.shadow;
            let viewDepth = input.shadowData.y;
            let cascadeCount = min(4u, max(1u, shadowInfo.cascadeCount));
            var cascadeIndex = select(0u, min(1u, cascadeCount - 1u), viewDepth > shadowInfo.cascadeSplitDepths[0]);
            if (viewDepth > shadowInfo.cascadeSplitDepths[1] && cascadeCount > 2u) {
                cascadeIndex = 2u;
            }
            let lightVP = shadowInfo.cascadeLightViewProjectionMatrices[cascadeIndex];

            let slopeBias = saturate(1.0 - firstNDotL);
            let worldTexelSize = shadowInfo.cascadeTexelSizes[cascadeIndex];
            let normalOffset = N * ((0.35 + slopeBias * 0.65) * worldTexelSize);
            let shadowCoord = getShadowCoord(input.worldPos + normalOffset, lightVP);

            let tUV = shadowCoord.xy;
            if (all(tUV >= vec2<f32>(0.0)) && all(tUV <= vec2<f32>(1.0)) && shadowCoord.z >= 0.0 && shadowCoord.z <= 1.0) {
                let absPos = abs(input.worldPos);
                let maxCoord = max(absPos.x, max(absPos.y, absPos.z));
                let driftBias = max(maxCoord * 0.00000035, 0.0001);
                let cascadeBias = shadowInfo.directionalShadowBias * (1.0 + f32(cascadeIndex) * 0.5) + 0.0002 + driftBias;
                let rawVisibility = textureSampleCompareLevel(
                    directionalShadowMap,
                    directionalShadowMapSampler,
                    tUV,
                    cascadeIndex,
                    saturate(shadowCoord.z - cascadeBias)
                );
                let horizonFade = saturate(firstNDotL * 6.25 + 0.5);
                shadowFactor = 1.0 - effectiveShadowWeight * (1.0 - rawVisibility * horizonFade);
            }
        }
    }

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let light = u_directionalLights[i];
        var L: vec3<f32>;
        var nDotL: f32;
        if (i == 0u) {
            L = firstLightDir;
            nDotL = firstNDotL;
        } else {
            L = -normalize(light.direction);
            nDotL = dot(N, L);
        }
        let currentShadow = select(1.0, shadowFactor, i == 0u);
        var dLight = light.color.rgb * light.intensity * preExposure * currentShadow;

        if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let surfaceHeightKm = max(0.0, input.worldPos.y / 1000.0);
            let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, L.y, u_atmo.atmosphereHeight);
            dLight *= atmosphereTransmittance;
        }

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

    if (systemUniforms.usePrefilterTexture == 1u) {
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
