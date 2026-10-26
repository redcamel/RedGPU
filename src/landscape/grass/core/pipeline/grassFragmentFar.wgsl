#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include landscape.struct.GrassRenderParams;
#redgpu_include landscape.struct.GrassVertexOutput;
#redgpu_include landscape.grassFragmentCommon;

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
    let adaptiveCutoff = mix(materialUniforms.farAlphaCutoff, materialUniforms.farAlphaCutoff * 0.45, subpixelFactor);

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

    let N = normalize(mix(input.normal, vec3<f32>(0.0, 1.0, 0.0), 0.85));
    let preExposure = systemUniforms.preExposure;

    let subsurfaceStrength = materialUniforms.subsurfaceStrength;
    let sssColor = materialUniforms.subsurfaceColor * albedo;
    let leafThickness = clamp(input.heightRatio * 1.25, 0.20, 1.0);
    let sssThickness = subsurfaceStrength * leafThickness;
    let transRatio = clamp(sssThickness * 0.35, 0.0, 0.80);

    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    var firstLightDir = vec3<f32>(0.0, 1.0, 0.0);
    if (u_directionalLightCount > 0u) {
        firstLightDir = -normalize(u_directionalLights[0].direction);
    }

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let light = u_directionalLights[i];
        var L: vec3<f32>;
        if (i == 0u) {
            L = firstLightDir;
        } else {
            L = -normalize(light.direction);
        }
        let dLight = light.color.rgb * light.intensity * preExposure;

        let nDotL = dot(N, L);
        let frontWrap = saturate((nDotL + 0.5) * NORM_225);
        let backWrap = saturate((-nDotL + 0.5) * NORM_225);

        let directDiff = frontWrap * (1.0 - transRatio);
        let sssTransmission = backWrap * transRatio;

        totalDirectLighting += (albedo * directDiff + sssColor * sssTransmission) * dLight;
    }

    let skyOcclusion = computeGrassSkyOcclusion(input.heightRatio);
    var ambColor = systemUniforms.ambientLight.color.rgb * (systemUniforms.ambientLight.intensity * preExposure);

    if (systemUniforms.usePrefilterTexture == 1u) {
        let iblEquiv = vec3<f32>(0.35 * preExposure * systemUniforms.iblIntensity);
        ambColor = max(ambColor, iblEquiv);
    }

    let ambSSS = ambColor * sssColor * (sssThickness * 0.25);
    let totalIndirectLighting = (albedo * (ambColor * skyOcclusion)) + ambSSS;

    let contactAO = computeGrassContactAO(input.heightRatio);
    let finalColor = (totalDirectLighting + totalIndirectLighting) * contactAO;

    output.color = vec4<f32>(finalColor, 1.0);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(input.currentClipPos, input.prevClipPos), 0.0, 1.0);

    return output;
}
