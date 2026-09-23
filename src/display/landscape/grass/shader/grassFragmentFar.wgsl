#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;

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
    @location(7) groundColor: vec4<f32>,
};

@group(2) @binding(0) var baseColorTexture: texture_2d<f32>;
@group(2) @binding(1) var baseColorSampler: sampler;
@group(2) @binding(2) var<uniform> materialUniforms: GrassMaterialUniforms;

@fragment
fn main(input: VertexOutput) -> OutputFragment {
    var output: OutputFragment;

    let baseTex = textureSample(baseColorTexture, baseColorSampler, input.uv);

    let rgbMax = max(baseTex.r, max(baseTex.g, baseTex.b));
    var sourceAlpha = baseTex.a;
    if (sourceAlpha > 0.85 && rgbMax < 0.15) {
        sourceAlpha = clamp((rgbMax - 0.02) / 0.10, 0.0, 1.0);
    }
    sourceAlpha *= input.alphaFade;

    let farCutoff = clamp(materialUniforms.alphaCutoff * 0.55, 0.10, 0.30);
    if (sourceAlpha < farCutoff) {
        discard;
    }

    let exposureBoost = max(0.1, materialUniforms.exposureBoost);
    var albedo = baseTex.rgb * exposureBoost;

    if (materialUniforms.hasGroundTexture != 0u && materialUniforms.groundBlendStrength > 0.01) {
        let blendFactor = clamp((0.40 - input.heightRatio) * 2.5, 0.0, 1.0) * materialUniforms.groundBlendStrength;
        albedo = mix(albedo, input.groundColor.rgb, blendFactor);
    }

    let upVec = vec3<f32>(0.0, 1.0, 0.0);
    let upwardBlend = mix(0.55, 0.85, input.heightRatio);
    let N = normalize(mix(input.normal, upVec, upwardBlend));
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

        let NORM_225: f32 = 0.44444445;
        let frontWrap = clamp((nDotL + 0.5) * NORM_225, 0.0, 1.0);
        let directDiff = frontWrap * (1.0 - transRatio);

        let backWrap = clamp((-nDotL + 0.5) * NORM_225, 0.0, 1.0);
        let distortion = materialUniforms.subsurfaceDistortion;
        let lightOpposite = -(L + input.normal * distortion);
        let vDotL = max(dot(V, lightOpposite), 0.0);
        let inScatter = vDotL * vDotL;
        let sssTransmission = (backWrap * 0.5 + inScatter * 0.5) * transRatio;

        totalDirectLighting += (albedo * directDiff + sssColor * sssTransmission) * dLight;
    }

    let skyOcclusion = mix(0.65, 1.0, clamp(input.heightRatio * 1.43, 0.0, 1.0));
    var ambColor = systemUniforms.ambientLight.color.rgb * (systemUniforms.ambientLight.intensity * preExposure);

    if (systemUniforms.usePrefilterTexture == 1u) {
        let iblEquiv = vec3<f32>(0.35 * preExposure * systemUniforms.iblIntensity);
        ambColor = max(ambColor, iblEquiv);
    }

    let ambSSS = ambColor * sssColor * (subsurfaceStrength * leafThickness * 0.25);
    let totalIndirectLighting = (albedo * (ambColor * skyOcclusion)) + ambSSS;

    // [KO] 실시간 지면 접촉 AO 적용 (밑동은 부드러운 접촉 음영 0.40, 풀잎 끝은 1.0)
    // [EN] Real-time ground contact AO (soft contact shadow 0.40 at base, tip reaches 1.0)
    let contactAO = mix(0.40, 1.0, clamp(input.heightRatio * 4.0, 0.0, 1.0));
    let finalColor = (totalDirectLighting + totalIndirectLighting) * contactAO;

    output.color = vec4<f32>(finalColor, 1.0);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(input.currentClipPos, input.prevClipPos), 0.0, 1.0);

    return output;
}
