#redgpu_include SYSTEM_UNIFORM;
#redgpu_include landscape.struct.GrassParams;
#redgpu_include landscape.math.blendGrassGround;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;

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
};

@group(1) @binding(1) var<uniform> materialUniforms: GrassParams;

@group(2) @binding(0) var baseColorTexture: texture_2d<f32>;
@group(2) @binding(1) var baseColorSampler: sampler;

@fragment
fn main(input: VertexOutput) -> OutputFragment {
    var output: OutputFragment;

    let baseTex = textureSample(baseColorTexture, baseColorSampler, input.uv);
    let sourceAlpha = filterGrassAlpha(baseTex, input.alphaFade);

    let farCutoff = clamp(materialUniforms.alphaCutoff * 0.55, 0.10, 0.30);
    if (sourceAlpha < farCutoff) {
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

    let N = computeGrassUpwardNormal(input.normal, input.heightRatio);
    let V = normalize(systemUniforms.camera.cameraPosition.xyz - input.worldPos);
    let preExposure = systemUniforms.preExposure;

    let subsurfaceStrength = materialUniforms.subsurfaceStrength;
    let sssColor = materialUniforms.subsurfaceColor * albedo;
    let leafThickness = clamp(input.heightRatio * 1.25, 0.20, 1.0);
    let transRatio = clamp(subsurfaceStrength * leafThickness * 0.35, 0.0, 0.80);

    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let light = u_directionalLights[i];
        let L = -normalize(light.direction);
        let dLight = light.color.rgb * light.intensity * preExposure;
        let nDotL = dot(N, L);
        let frontWrap = clamp((nDotL + 0.5) * NORM_225, 0.0, 1.0);
        let directDiff = frontWrap * (1.0 - transRatio);

        let backWrap = clamp((-nDotL + 0.5) * NORM_225, 0.0, 1.0);
        let lightOpposite = -(L + input.normal * SSS_DISTORTION);
        let vDotL = max(dot(V, lightOpposite), 0.0);
        let inScatter = vDotL * vDotL;
        let sssTransmission = (backWrap * 0.5 + inScatter * 0.5) * transRatio;

        totalDirectLighting += (albedo * directDiff + sssColor * sssTransmission) * dLight;
    }

    let skyOcclusion = computeGrassSkyOcclusion(input.heightRatio);
    var ambColor = systemUniforms.ambientLight.color.rgb * (systemUniforms.ambientLight.intensity * preExposure);

    if (systemUniforms.usePrefilterTexture == 1u) {
        let iblEquiv = vec3<f32>(0.35 * preExposure * systemUniforms.iblIntensity);
        ambColor = max(ambColor, iblEquiv);
    }

    let ambSSS = ambColor * sssColor * (subsurfaceStrength * leafThickness * 0.25);
    let totalIndirectLighting = (albedo * (ambColor * skyOcclusion)) + ambSSS;

    let contactAO = computeGrassContactAO(input.heightRatio);
    let finalColor = (totalDirectLighting + totalIndirectLighting) * contactAO;

    output.color = vec4<f32>(finalColor, 1.0);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(input.currentClipPos, input.prevClipPos), 0.0, 1.0);

    return output;
}
