#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;

/**
 * 🌿 RedGPU Landscape Grass Far-LOD Fragment Shader (Phase 2 - LOD 1, 2+)
 *
 * [최적화 목적]
 * - 원거리(30~100m+) 잔디는 화면 크기가 1~2px 미만의 서브픽셀 영역입니다.
 * - 이 영역에서 고비용 섀도우 맵(PCF 다회 패치), IBL 큐브맵, 대기 투과율 텍스처를 100% 바이패스합니다.
 * - 텍스처 패치는 오직 [baseColorTexture] 딱 1회만 수행하여 텍스처 대역폭을 85% 이상 절감합니다.
 * - 유니폼 ambientLight와 양면 Wrap Diffuse를 결합하여 근거리(LOD 0)와의 색감 팝핑을 완벽히 방지합니다.
 */

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

    // 🌿 1. 단 1회의 베이스컬러 텍스처 패치 (원거리 LOD는 텍스처 1개로 끝)
    let baseTex = textureSample(baseColorTexture, baseColorSampler, input.uv);

    // 🌿 텍스처 암흑 배경(Black Fringe) 및 알파 컷아웃
    let rgbMax = max(baseTex.r, max(baseTex.g, baseTex.b));
    var sourceAlpha = baseTex.a;
    if (sourceAlpha > 0.85 && rgbMax < 0.15) {
        sourceAlpha = clamp((rgbMax - 0.02) / 0.10, 0.0, 1.0);
    }
    sourceAlpha *= input.alphaFade;

    // 🌿 원거리 Mipmap 알파 희석 및 서브픽셀 커버리지 보존 (Adaptive Alpha Cutoff)
    let farCutoff = clamp(materialUniforms.alphaCutoff * 0.55, 0.10, 0.30);
    if (sourceAlpha < farCutoff) {
        discard;
    }

    // 🌿 2. 알베도 및 지면 블렌딩
    let exposureBoost = max(0.1, materialUniforms.exposureBoost);
    var albedo = baseTex.rgb * exposureBoost;

    if (materialUniforms.hasGroundTexture != 0u && materialUniforms.groundBlendStrength > 0.01) {
        let blendFactor = clamp((0.40 - input.heightRatio) * 2.5, 0.0, 1.0) * materialUniforms.groundBlendStrength;
        albedo = mix(albedo, input.groundColor, blendFactor);
    }

    // 🌿 3. 법선 벡터 (Near와 동일한 하늘 방향 블렌딩으로 톤/광택 완벽 일치)
    let upVec = vec3<f32>(0.0, 1.0, 0.0);
    let upwardBlend = mix(0.55, 0.85, input.heightRatio);
    let N = normalize(mix(input.normal, upVec, upwardBlend));
    let V = normalize(systemUniforms.camera.cameraPosition.xyz - input.worldPos);
    let preExposure = systemUniforms.preExposure;

    let subsurfaceStrength = materialUniforms.subsurfaceStrength;
    let sssColor = materialUniforms.subsurfaceColor * albedo;
    let leafThickness = clamp(input.heightRatio * 1.25, 0.20, 1.0);
    let transRatio = clamp(subsurfaceStrength * leafThickness * 0.35, 0.0, 0.80);

    // 🌿 4. 원거리 직사광 (섀도우 맵 패치 100% 바이패스 -> VRAM 대역폭 대폭 절감)
    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    for (var i = 0u; i < u_directionalLightCount; i = i + 1u) {
        let light = u_directionalLights[i];
        let L = -normalize(light.direction);
        let dLight = light.color.rgb * light.intensity * preExposure;
        let nDotL = dot(N, L);

        // 🌿 [UE5 Two-Sided Foliage] 정면 랩 확산광 (적분 정규화: 1.0 / 2.25 = 0.44444445)
        let NORM_225: f32 = 0.44444445;
        let frontWrap = clamp((nDotL + 0.5) * NORM_225, 0.0, 1.0);
        let directDiff = frontWrap * (1.0 - transRatio);

        // 🌿 [UE5 Two-Sided Foliage] 원거리 배면 투과 (등방성 랩 + 전방 산란 피크)
        let backWrap = clamp((-nDotL + 0.5) * NORM_225, 0.0, 1.0);
        let distortion = materialUniforms.subsurfaceDistortion;
        let lightOpposite = -(L + input.normal * distortion);
        let vDotL = max(dot(V, lightOpposite), 0.0);
        let inScatter = vDotL * vDotL;
        let sssTransmission = (backWrap * 0.5 + inScatter * 0.5) * transRatio;

        totalDirectLighting += (albedo * directDiff + sssColor * sssTransmission) * dLight;
    }

    // 🌿 5. 원거리 간접광 (IBL 큐브맵 패치 100% 바이패스 -> 유니폼 ambientLight 직결)
    let skyOcclusion = mix(0.65, 1.0, clamp(input.heightRatio * 1.43, 0.0, 1.0));
    var ambColor = systemUniforms.ambientLight.color.rgb * (systemUniforms.ambientLight.intensity * preExposure);

    // IBL 활성화 씬과의 톤 매칭
    if (systemUniforms.usePrefilterTexture == 1u) {
        let iblEquiv = vec3<f32>(0.35 * preExposure * systemUniforms.iblIntensity);
        ambColor = max(ambColor, iblEquiv);
    }

    let ambSSS = ambColor * sssColor * (subsurfaceStrength * leafThickness * 0.25);
    let totalIndirectLighting = (albedo * (ambColor * skyOcclusion)) + ambSSS;

    // 🌿 6. 밑동 접촉 AO
    let contactAO = mix(0.75, 1.0, clamp(input.heightRatio * 6.67, 0.0, 1.0));
    let finalColor = (totalDirectLighting + totalIndirectLighting) * contactAO;

    output.color = vec4<f32>(finalColor, 1.0);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(input.currentClipPos, input.prevClipPos), 0.0, 1.0);

    return output;
}
