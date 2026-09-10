#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.PI;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;
#redgpu_include skyAtmosphere.skyAtmosphereFn;
#redgpu_include shadow.getDirectionalShadowVisibilityFoliage;

struct GrassMaterialUniforms {
    worldSizeX: f32,
    worldSizeZ: f32,
    groundBlendStrength: f32,
    alphaCutoff: f32,
    hasGroundTexture: u32,
    roughness: f32,
    subsurfaceStrength: f32,
    exposureBoost: f32,
    subsurfaceColor: vec3<f32>,
    subsurfaceDistortion: f32,
    hasNormalTexture: u32,
    hasOrmTexture: u32,
    normalScale: f32,
    aoIntensity: f32,
    receiveShadow: u32,
    shadowStrength: f32,
    _pad0: f32,
    _pad1: f32,
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
@group(2) @binding(3) var normalTexture: texture_2d<f32>;
@group(2) @binding(4) var normalSampler: sampler;
@group(2) @binding(5) var ormTexture: texture_2d<f32>;
@group(2) @binding(6) var ormSampler: sampler;

@fragment
fn main(input: VertexOutput) -> OutputFragment {
    var output: OutputFragment;

    let baseTex = textureSample(baseColorTexture, baseColorSampler, input.uv);

    // 🌿 1. TAA-Safe Mipmap Coverage 보존 및 적응형 알파 컷오프 (순수 잎사귀 실루엣 형태 보존)
    // 에셋에서 Alpha 채널이 255(1.0)로 누락/구워진 경우 대비: 검은색 패딩 배경(RGB ≈ 0)을 지능적으로 감지하여 마스크 컷아웃
    let rgbMax = max(baseTex.r, max(baseTex.g, baseTex.b));
    let sourceAlpha = select(baseTex.a, min(baseTex.a, smoothstep(0.02, 0.12, rgbMax)), baseTex.a > 0.98 && rgbMax < 0.12);

    // TAA 서브픽셀 지터 시 경계면 펄럭임을 방지하는 단일 Coverage 임계값 판정
    let baseCutoff = clamp(materialUniforms.alphaCutoff, 0.15, 0.85);
    let alphaWidth = max(fwidth(sourceAlpha), 0.0001);
    let coverageAlpha = clamp((sourceAlpha - baseCutoff) / alphaWidth + 0.5, 0.0, 1.0);

    if (coverageAlpha < 0.5) {
        discard;
    }

    // 🌿 3. 외곽선 검은 테두리(Black Fringe) 완전 박멸 (Mathematical Unpremultiplication):
    // 텍스처 투명 배경(0,0,0)과 바이리니어/밉맵 보간되어 어두워진 외곽선 픽셀의 RGB를 원래 순수 잎사귀 색으로 완전 나눗셈 역보정
    let safeAlpha = clamp(sourceAlpha, 0.20, 1.0);
    let pureLeafAlbedo = baseTex.rgb / safeAlpha;

    // 🌿 3. 엽록소 생동감 리프트 (Foliage Vibrancy & Tone Calibration):
    // 포토스캔된 어두운 쑥색/야생잡초 텍스처(평균 RGB 45, 68, 25)의 칙칙함을 화사한 잔디의 싱그러운 색감으로 변환
    let exposureBoost = max(0.1, materialUniforms.exposureBoost);
    // 암부 감마 곡선을 완만하게 펴서(0.86) 지형의 밝은 톤과 자연스럽게 융합
    let vibrantAlbedo = pow(pureLeafAlbedo, vec3<f32>(0.86)) * exposureBoost;
    // 경계면 미세 녹색 채도 보상 (검은색 침투로 빠진 엽록소 채도 회복)
    let edgeTint = mix(vec3<f32>(1.08, 1.15, 0.95), vec3<f32>(1.0), smoothstep(0.20, 0.60, baseTex.a));
    var albedo = vibrantAlbedo * edgeTint;

    // 밑동 지형 소프트 블렌딩 (Ground Color Blending - 정점 셰이더 사전 계산 전달값으로 순수 ALU 연산 처리)
    if (materialUniforms.hasGroundTexture != 0u && materialUniforms.groundBlendStrength > 0.01) {
        let blendFactor = smoothstep(0.40, 0.0, input.heightRatio) * materialUniforms.groundBlendStrength;
        albedo = mix(albedo, input.groundColor, blendFactor);
    }

    // 🌿 1. 식생 노멀 설정 (Spherical Upward Normal)
    // 얇은 평면 쿼드 판자 음영을 완벽히 지우고 풍성한 융단 같은 볼륨 라이팅 형성
    let upVec = vec3<f32>(0.0, 1.0, 0.0);
    let upwardBlend = mix(0.55, 0.85, input.heightRatio);
    let N = normalize(mix(input.normal, upVec, upwardBlend));

    let V = normalize(systemUniforms.camera.cameraPosition.xyz - input.worldPos);
    let NdotV = max(abs(dot(N, V)), 0.001);

    // 2. 물리 파라미터 (유니폼 기반 경량화: 평면 풀잎의 불필요한 ORM 텍스처 샘플링 제거)
    let roughness = clamp(materialUniforms.roughness, 0.20, 1.0);
    let subsurfaceStrength = clamp(materialUniforms.subsurfaceStrength, 0.0, 3.0);
    let preExposure = systemUniforms.preExposure;

    // 🌿 언리얼식 Two-Sided Foliage Subsurface Color & Thickness:
    // 잎사귀 알베도의 미세 텍스처 명도 굴곡과 엽록소 투과 스펙트럼을 결합하여, 역광 시 잎맥이 눈부시게 살아나는 황록빛 투과색 형성
    let albedoLum = dot(albedo, vec3<f32>(0.2126, 0.7152, 0.0722));
    let sssColor = mix(albedo * 1.25, materialUniforms.subsurfaceColor * (albedoLum * 1.6), 0.70);
    // 잎사귀 두께 감쇠 (밑동 줄기는 차폐 0.1, 끝단은 얇아서 1.0 투과 발광)
    let leafThickness = smoothstep(0.05, 0.85, input.heightRatio);

    // 3. 직사광 (경량 Direct Lighting: Blinn-Specular + Two-Sided Foliage BTDF)
    var totalDirectLighting = vec3<f32>(0.0);
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;

    // 🌿 CSM 그림자 계산 (Receive Shadow: 식생 전용 초경량 1-Tap CSM 섀도우)
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
        let directNdotL = max(dot(N, L), 0.0);
        let currentShadow = select(1.0, shadowFactor, i == 0u);
        var dLight = light.color.rgb * light.intensity * preExposure * currentShadow;

        // SkyAtmosphere 대기 산란 투과율
        if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let surfaceHeightKm = max(0.0, input.worldPos.y / 1000.0);
            let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, L.y, u_atmo.atmosphereHeight);
            dLight *= atmosphereTransmittance;
        }

        // 🌿 식생 왁스층 경량 스페큘러 (Cook-Torrance 완전 대체)
        let H = normalize(L + V);
        let NdotH = max(dot(N, H), 0.0);
        let specPower = mix(16.0, 64.0, 1.0 - roughness);
        let specFactor = pow(NdotH, specPower) * (1.0 - roughness) * 0.35;
        let directSpecular = vec3<f32>(specFactor);

        // 🌿 램버트 확산광
        let diffuseReflection = albedo * directNdotL;

        // 🌿 Two-Sided Foliage BTDF (Normal Distortion Phase Function)
        let distortion = materialUniforms.subsurfaceDistortion;
        let L_scatter = normalize(L + N * distortion);
        let forwardScatterDot = max(dot(V, -L_scatter), 0.0);
        let forwardTransmission = pow(forwardScatterDot, 3.0) * 1.50; // 전방 역광 림 투과광

        // 배면 확산 투과 (Lambertian Back Diffuse Transmission)
        let backDot = max(0.0, -dot(N, L));
        let diffuseBackTransmission = backDot * 0.50;

        let transmission = (forwardTransmission + diffuseBackTransmission) * (subsurfaceStrength * leafThickness);
        let diffuseTransmission = sssColor * transmission;

        // 부드러운 하프 랩핑 산란 (암부 채움 및 자연광 산란 강화)
        let wrapNdotL = max((dot(N, L) + 0.50) / 1.50, 0.0);
        let wrapScatter = albedo * wrapNdotL * 0.65;

        let totalDiffuse = diffuseReflection + diffuseTransmission + wrapScatter;
        totalDirectLighting += (totalDiffuse + directSpecular) * dLight;
    }

    // 4. 간접광 (경량 Indirect Lighting: 단일 Irradiance 1회 샘플링 및 헤미스피어 환경광)
    let skyOcclusion = mix(0.65, 1.0, smoothstep(0.0, 0.70, input.heightRatio));
    var totalIndirectLighting = vec3<f32>(0.0);
    let u_usePrefilterTexture = systemUniforms.usePrefilterTexture == 1u;

    if (u_usePrefilterTexture) {
        // IBL 활성화 시: 큐브맵 밉맵 트래버설/2D BRDF LUT 완전 배제, 상반구 Irradiance 단 1회 샘플링으로 초고속 환경광 획득
        let skyN = normalize(mix(N, vec3<f32>(0.0, 1.0, 0.0), 0.40));
        let iblSkyColor = textureSampleLevel(ibl_irradianceTexture, prefilterTextureSampler, skyN, 0.0).rgb * preExposure * systemUniforms.iblIntensity;

        // 엽록소 환경광 필터링: 파란색 하늘광 탈색 방지 및 따뜻한 초록 채도 보존
        let skyLum = dot(iblSkyColor, vec3<f32>(0.2126, 0.7152, 0.0722));
        let foliarSky = mix(iblSkyColor, vec3<f32>(skyLum * 0.90, skyLum * 1.15, skyLum * 0.70), 0.65);

        // 지면 바운스광 및 상하 채광 결합 (추가 텍스처 샘플링 0회)
        let iblGroundColor = foliarSky * 0.40;
        let envDiffuse = mix(iblGroundColor, foliarSky, skyOcclusion);

        // 경량 림 반사광
        let rimFresnel = pow(1.0 - NdotV, 3.0) * (1.0 - roughness) * 0.15;
        let foliarSpecular = foliarSky * rimFresnel * skyOcclusion;

        totalIndirectLighting = (albedo * envDiffuse) + foliarSpecular;
    } else {
        let ambLight = systemUniforms.ambientLight.color.rgb * (systemUniforms.ambientLight.intensity * preExposure);
        let ambSSS = ambLight * sssColor * (subsurfaceStrength * leafThickness * 0.25);
        totalIndirectLighting = (albedo * (ambLight * skyOcclusion)) + ambSSS;
    }

    // 5. 밑동 접촉 앰비언트 오클루전 (Ground Contact AO)
    let contactAO = mix(0.75, 1.0, smoothstep(0.0, 0.15, input.heightRatio));

    // 6. 최종 라이팅 합성
    let finalColor = (totalDirectLighting + totalIndirectLighting) * contactAO;

    output.color = vec4<f32>(finalColor, 1.0);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(input.currentClipPos, input.prevClipPos), 0.0, 1.0);

    return output;
}
