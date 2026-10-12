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

@group(1) @binding(1) var<uniform> materialUniforms: GrassRenderParams;

@group(2) @binding(0) var baseColorTexture: texture_2d<f32>;
@group(2) @binding(1) var baseColorSampler: sampler;

@fragment
fn main(input: VertexOutput) -> OutputFragment {
    var output: OutputFragment;

    let baseTex = textureSample(baseColorTexture, baseColorSampler, input.uv);
    let sourceAlpha = filterGrassAlpha(baseTex, input.alphaFade);

    // 🌿 TAA 서브픽셀 지터링 깜빡임 방지용 적응형 알파 컷오프 (Alpha Widening)
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

    // 🌿 원거리 잔디 서브픽셀 라이팅 지글거림 방지: 개별 풀잎 노멀을 지면 수직 노멀(+Y)로 85% 수렴 (Normal Flattening)
    let N = normalize(mix(input.normal, vec3<f32>(0.0, 1.0, 0.0), 0.85));
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

    let ambSSS = ambColor * sssColor * (subsurfaceStrength * leafThickness * 0.25);
    let totalIndirectLighting = (albedo * (ambColor * skyOcclusion)) + ambSSS;

    let contactAO = computeGrassContactAO(input.heightRatio);
    let finalColor = (totalDirectLighting + totalIndirectLighting) * contactAO;

    output.color = vec4<f32>(finalColor, 1.0);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(input.currentClipPos, input.prevClipPos), 0.0, 1.0);

    return output;
}
